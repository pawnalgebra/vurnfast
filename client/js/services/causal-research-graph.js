import {emptyResearchModel,validateResearchModel,supportedResearchObservation} from './research-model.js';
import {stableResearchReferences} from './research-context-selection.js';
export class AuthorityTimeline {
  constructor(events,relations=[]){this.events=structuredClone(events);this.byId=new Map(this.events.map(e=>[e.id,e]));this.edges=new Map(this.events.map(e=>[e.id,new Set(e.before||[])]));for(const event of this.events)for(const id of event.after||[])this.edges.get(id)?.add(event.id);
    for(const relation of relations){if(!relation.from.startsWith('event:')||!relation.to.startsWith('event:'))continue;const from=relation.from.slice(6),to=relation.to.slice(6);if(!this.byId.has(from)||!this.byId.has(to))continue;if(relation.type==='PRECEDES')this.edges.get(from).add(to);if(relation.type==='FOLLOWS')this.edges.get(to).add(from);if(relation.type==='CONCURRENT'){const row=this.byId.get(from);row.concurrentWith=[...(row.concurrentWith||[]),to];}}
  }
  reaches(from,to){const seen=new Set(),queue=[from];while(queue.length){const id=queue.shift();if(seen.has(id))continue;seen.add(id);for(const next of this.edges.get(id)||[]){if(next===to)return true;queue.push(next);}}return false;}
  compare(left,right){
    if(!left||!right||left.id===right.id)return 'UNKNOWN';
    if((this.byId.get(left.id)?.concurrentWith||left.concurrentWith||[]).includes(right.id)||(this.byId.get(right.id)?.concurrentWith||right.concurrentWith||[]).includes(left.id))return 'CONCURRENT';
    const before=this.reaches(left.id,right.id),after=this.reaches(right.id,left.id);if(before&&after)return 'UNKNOWN';if(before)return 'BEFORE';if(after)return 'AFTER';
    if(Number.isFinite(left.order)&&Number.isFinite(right.order)&&left.order!==right.order)return left.order<right.order?'BEFORE':'AFTER';
    const parse=value=>/^\d{4}-\d{2}-\d{2}T/.test(value||'')?Date.parse(value):NaN;
    const a=parse(left.timestamp||left.eventTime||''),b=parse(right.timestamp||right.eventTime||'');if(Number.isFinite(a)&&Number.isFinite(b)&&a!==b)return a<b?'BEFORE':'AFTER';
    return 'UNKNOWN';
  }
  authorityAt(event){
    const history=this.events.filter(e=>e.actorId===event.actorId&&e.objectId===event.objectId&&(!event.authorityProfileId||e.authorityProfileId===event.authorityProfileId)&&['granted','revoked'].includes(e.authorityAfter)&&this.compare(e,event)==='BEFORE');
    const last=history.filter(e=>!history.some(other=>other.id!==e.id&&this.compare(e,other)==='BEFORE'));
    return {status:last.length===1?last[0].authorityAfter:'unknown',eventIds:last.map(e=>e.id),validFrom:last.length===1&&last[0].authorityAfter==='granted'?last[0].id:null,reason:last.length===1?'Latest ordered authority change':'Missing or ambiguous ordering'};
  }
}
export class CausalResearchGraph {
  constructor(target){
    this.target=target;this.model=target.researchModel||emptyResearchModel();validateResearchModel(this.model,target);this.nodes=new Map();this.edges=[];this.omissions=[];
    const add=(type,id,data={})=>{if(id)this.nodes.set(type+':'+id,{...data,id:type+':'+id,type,referenceId:id});};
    for(const [kind,type] of [['actors','actor'],['objects','object'],['boundaries','boundary'],['hypotheses','hypothesis'],['testCases','test'],['evidence','evidence'],['findings','finding']])for(const row of target[kind]||[])add(type,row.id,{label:row.name||row.title||row.label||row.id});
    for(const row of this.model.invariants)add('invariant',row.id,{...row});
    for(const [kind,type] of [['events','event'],['observations','observation']])for(const row of this.model[kind]){add(type,row.id,{...row});for(const [field,nodeType] of [['tenant','tenant'],['authorityTenant','tenant'],['surface','surface'],['stateBefore','state'],['stateAfter','state'],['state','state'],['operation','operation'],['authorityProfileId','authority']])add(nodeType,row[field]);}
    const edge=(type,from,to,provenance)=>{if(this.nodes.has(from)&&this.nodes.has(to))this.edges.push({type,from,to,provenance});else this.omissions.push({type,from,to,reason:'Missing endpoint; relation withheld'});};
    const recorded=(source)=>({status:source.knowledgeProvenance?.sourceType==='ai'?'AI_INFERRED':'UNKNOWN',source:'record:'+source.id,confidence:source.knowledgeProvenance?.sourceType==='ai'?source.knowledgeProvenance.confidence||0:0,evidenceRefs:[]});
    for(const object of target.objects){const owner=target.actors.filter(a=>a.id===object.ownerId||a.name===object.owner);if(owner.length===1)edge('OWNS','actor:'+owner[0].id,'object:'+object.id,recorded(object));}
    for(const [kind,type] of [['hypotheses','hypothesis'],['testCases','test'],['findings','finding']])for(const row of target[kind]){
      const refs=stableResearchReferences(target,row),provenance=recorded(row);
      for(const [field,nodeType] of [['flowId','flow'],['transitionId','transition'],['invariantId','invariant'],['authorityProfileId','authority']])add(nodeType,refs[field]);
      for(const [field,nodeType,relation] of [['actorId','actor','DEPENDS_ON'],['objectId','object','DEPENDS_ON'],['flowId','flow','DEPENDS_ON'],['transitionId','transition','DEPENDS_ON'],['invariantId','invariant','DEPENDS_ON'],['boundaryId','boundary','CROSSES_BOUNDARY'],['hypothesisId','hypothesis','DEPENDS_ON'],['testId','test','DEPENDS_ON'],['authorityProfileId','authority','AUTHORIZED_BY']])if(refs[field])edge(relation,type+':'+row.id,nodeType+':'+refs[field],provenance);
      for(const id of row.testIds||[])edge('DEPENDS_ON',type+':'+row.id,'test:'+id,provenance);
      for(const id of row.evidenceIds||[])edge('SUPPORTS','evidence:'+id,type+':'+row.id,provenance);
      for(const link of row.evidenceLinks||[])edge(link.role,'evidence:'+link.evidenceId,type+':'+row.id,link.provenance||provenance);
    }
    for(const event of this.model.events){const eventId='event:'+event.id,p=event.provenance;
      if(event.actorId)edge('EXECUTES','actor:'+event.actorId,eventId,p);
      if(event.objectId)edge(event.operation==='create'?'CREATES':event.operation==='modify'?'MODIFIES':event.authorityAfter==='revoked'?'REVOKED':event.authorityAfter==='granted'?'GRANTED':'DEPENDS_ON',eventId,'object:'+event.objectId,p);
      if(event.boundaryId)edge('CROSSES_BOUNDARY',eventId,'boundary:'+event.boundaryId,p);
      if(event.authorityProfileId)edge('AUTHORIZED_BY',eventId,'authority:'+event.authorityProfileId,p);
      const authorityKey=value=>event.actorId+'@'+event.objectId+':'+value;
      for(const value of [event.authorityBefore,event.authorityAfter,event.effectiveAuthority].filter(Boolean))add('authority',authorityKey(value),{label:value});
      if(event.effectiveAuthority)edge('AUTHORIZED_BY',eventId,'authority:'+authorityKey(event.effectiveAuthority),p);
      if(event.authorityAfter==='revoked'&&event.authorityBefore)edge('INVALIDATES',eventId,'authority:'+authorityKey(event.authorityBefore),p);
      if(event.stateBefore&&event.stateAfter)edge('TRANSITIONS_TO','state:'+event.stateBefore,'state:'+event.stateAfter,p);
      for(const id of event.evidenceRefs)edge('OBSERVED_IN',eventId,'evidence:'+id,p);
      for(const id of event.before||[])edge('PRECEDES',eventId,'event:'+id,p);
      for(const id of event.after||[])edge('FOLLOWS',eventId,'event:'+id,p);
      for(const id of event.concurrentWith||[])edge('CONCURRENT',eventId,'event:'+id,p);
    }
    for(const observation of this.model.observations){const id='observation:'+observation.id;if(observation.actorId)edge('EXECUTES','actor:'+observation.actorId,id,observation.provenance);if(observation.objectId)edge('DEPENDS_ON',id,'object:'+observation.objectId,observation.provenance);if(observation.boundaryId)edge('CROSSES_BOUNDARY',id,'boundary:'+observation.boundaryId,observation.provenance);}
    for(const relation of this.model.relations)edge(relation.type,relation.from,relation.to,relation.provenance);
    this.timeline=new AuthorityTimeline(this.model.events.filter(e=>supportedResearchObservation(e,target)),this.model.relations.filter(r=>supportedResearchObservation({provenance:r.provenance,evidenceRefs:r.provenance.evidenceRefs},target)));
  }
  relevantSubgraph(referenceIds,{maxNodes=80,maxEdges=120}={}){
    const roots=new Set(referenceIds),selected=new Set([...this.nodes.values()].filter(n=>roots.has(n.referenceId)||roots.has(n.id)).slice(0,maxNodes).map(n=>n.id));
    // Bounded dependency traversal; never send a whole workspace graph to a model.
    for(let depth=0;depth<8;depth++){const frontier=new Set(selected);for(const edge of this.edges)if(frontier.has(edge.from)||frontier.has(edge.to)){if(selected.size<maxNodes)selected.add(edge.from);if(selected.size<maxNodes)selected.add(edge.to);}}
    const allEdges=this.edges.filter(e=>selected.has(e.from)&&selected.has(e.to));
    return {nodes:[...selected].map(id=>Object.fromEntries(Object.entries(this.nodes.get(id)).filter(([key])=>!['actualOutcome','expectedOutcome'].includes(key)).map(([key,value])=>[key,typeof value==='string'?value.slice(0,1000):value]))),edges:allEdges.slice(0,maxEdges),omittedNodes:this.nodes.size-selected.size,omittedEdges:this.edges.length-Math.min(allEdges.length,maxEdges),omissions:this.omissions.slice(0,30)};
  }
}
