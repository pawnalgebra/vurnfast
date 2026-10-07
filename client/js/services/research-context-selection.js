import {ResearchPriorityService} from './research-priority.js';
export const stableResearchFields=['actorId','objectId','boundaryId','flowId','transitionId','invariantId','hypothesisId','testId','testCaseId','findingId','authorityProfileId','authProfileId','tenantId','surfaceId'];
export function stableResearchReferences(target,row){
  const result=Object.fromEntries(stableResearchFields.map(key=>[key,row[key]||row.knowledgeLinks?.[key]||'']));
  // Only unique exact names can resolve legacy free-text mappings; ambiguity stays Unknown.
  const unique=(rows,name)=>{const hits=rows.filter(r=>r.name===name);return hits.length===1?hits[0].id:'';};
  result.actorId||=unique(target.actors,row.who);result.objectId||=unique(target.objects,row.object);
  result.authorityProfileId||=result.authProfileId;result.testId||=result.testCaseId;
  return result;
}
export function selectResearchContext(target,{limits={},focusIds=[],criticalIds=[],chainIds=[],constraintIds=[],contradictionIds=[],query=''}={}){
  const priorityIds={focus:new Set(focusIds),critical:new Set(criticalIds),chain:new Set(chainIds),constraint:new Set(constraintIds),contradiction:new Set(contradictionIds)};
  const caps={actors:8,objects:8,boundaries:8,techniques:20,hypotheses:20,testCases:20,evidence:12,findings:12,...limits};
  const all=Object.keys(caps).flatMap(kind=>(target[kind]||[]).map((row,index)=>({kind,row,index}))),byId=new Map(all.map(item=>[item.row.id,item]));
  const links=row=>[...Object.values(stableResearchReferences(target,row)),...(row.testIds||[]),...(row.evidenceIds||[]),...(row.evidenceLinks||[]).map(e=>e.evidenceId)].filter(id=>byId.has(id));
  const tokens=query.toLowerCase().split(/[^\p{L}\p{N}]+/u).filter(t=>t.length>3),scores=new Map(),reasons=new Map();
  for(const item of all){const {row,kind,index}=item;let score=index/Math.max(1,target[kind].length);
    if(['Next','Testing','Interesting'].includes(row.queue)||['interesting','vulnerability','failed'].includes(row.result)||row.status==='confirmed')score+=40;
    if(kind==='findings')score+=30;
    if(kind==='hypotheses')score+=ResearchPriorityService.score(row).score/10;
    if(tokens.some(t=>[row.title,row.label,row.content,row.name,row.invariant].filter(Boolean).join(' ').toLowerCase().includes(t)))score+=60;
    if(priorityIds.contradiction.has(row.id))score+=6000;
    if(priorityIds.constraint.has(row.id))score+=7000;
    if(priorityIds.chain.has(row.id))score+=8000;
    if(priorityIds.critical.has(row.id))score+=9000;
    if(priorityIds.focus.has(row.id))score+=10000;
    scores.set(row.id,score);reasons.set(row.id,priorityIds.focus.has(row.id)?'explicit reference':score>10?'research relevance':'recency');
  }
  // Propagate dependency priority to a fixed point; older linked evidence beats unrelated new data.
  const roots=all.filter(item=>scores.get(item.row.id)>10).sort((a,b)=>scores.get(b.row.id)-scores.get(a.row.id));
  for(const root of roots){const visited=new Set(),queue=[root.row.id];while(queue.length){const id=queue.shift();if(visited.has(id))continue;visited.add(id);const item=byId.get(id);if(!item)continue;for(const linked of links(item.row)){const score=Math.min(9900,Math.max(9000,scores.get(root.row.id)-100));if(scores.get(linked)<score){scores.set(linked,score);reasons.set(linked,'dependency of '+root.row.id);}queue.push(linked);}}}
  const selected={...target},included=[],omitted=[];
  for(const kind of Object.keys(caps)){
    const ranked=all.filter(item=>item.kind===kind).sort((a,b)=>scores.get(b.row.id)-scores.get(a.row.id)||b.index-a.index);
    selected[kind]=ranked.slice(0,caps[kind]).map(item=>item.row);
    for(const [index,item] of ranked.entries())(index<caps[kind]?included:omitted).push({kind,id:item.row.id,reason:index<caps[kind]?reasons.get(item.row.id):'collection budget; '+reasons.get(item.row.id)});
  }
  // Capture missing dependencies explicitly instead of inventing or silently forgetting a link.
  const selectedIds=new Set(included.map(item=>item.id));
  const missingDependencies=included.flatMap(item=>links(byId.get(item.id).row).filter(id=>!selectedIds.has(id)).map(id=>({from:item.id,id,reason:'linked record exceeds context budget'})));
  return {selected,manifest:{included,omitted,missingDependencies,strategy:'explicit references > critical dependencies > chain dependencies > constraint dependencies > contradiction dependencies > current research > relevance > recency'}};
}
