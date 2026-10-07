import {supportedResearchObservation} from './research-model.js';
import {researchFingerprint} from './research-integrity.js';
const discoveryUnique=values=>[...new Set(values.filter(v=>v!==undefined&&v!==''))];
export const constraintCategories='AUTHORIZATION OWNERSHIP TENANT STATE LIFECYCLE APPROVAL TRANSACTION BUSINESS_RULE ASYNC SESSION IDENTITY VERSION LIMIT CUSTOM'.split(' ');
export class TargetConstraintService {
  static validate(row,target){
    if(!row||typeof row.id!=='string'||!row.id||row.id.length>120||row.targetId!==target.id||!constraintCategories.includes(row.category)||!['PROGRAM_RULE','TARGET_DOCUMENTATION','RESEARCHER_CONFIRMED','OBSERVED','DOMAIN_KNOWLEDGE','AI_INFERRED','UNKNOWN'].includes(row.sourceType)||!Number.isFinite(row.confidence)||row.confidence<0||row.confidence>1||typeof row.verified!=='boolean')throw new Error('Invalid target constraint.');
    if(row.verified&&(!['PROGRAM_RULE','TARGET_DOCUMENTATION','RESEARCHER_CONFIRMED'].includes(row.sourceType)||!row.sourceRef))throw new Error('Verification requires a target-specific reviewed source.');
    for(const part of ['condition','expected'])if(!row[part]||typeof row[part]!=='object'||Array.isArray(row[part]))throw new Error('Constraint predicates required.');
    for(const predicates of [row.condition.all||[],row.expected.all||[],row.condition.prior?.all||[],row.expected.aggregate?.all||[]]){if(!Array.isArray(predicates)||predicates.length>32)throw new Error('Invalid constraint predicate budget.');for(const predicate of predicates)if(!predicate||!['eq','neq','in','exists','lte','gte','eqField','neqField'].includes(predicate.operator)||typeof predicate.field!=='string'||!/^\w{1,80}$/.test(predicate.field)||predicate.operator==='in'&&(!Array.isArray(predicate.value)||predicate.value.length>32)||['eqField','neqField'].includes(predicate.operator)&&! /^(prior\.)?\w{1,80}$/.test(predicate.other||''))throw new Error('Invalid constraint predicate.');}
    if(row.condition.prior&&(!Array.isArray(row.condition.prior.same)||row.condition.prior.same.length>8))throw new Error('Prior identity fields required.');
    for(const f of ['subject','object','operation','sourceRef','notes'])if(row[f]!==undefined&&(typeof row[f]!=='string'||row[f].length>8000))throw new Error('Invalid constraint text.');
    if(row.expected.aggregate&&(!Array.isArray(row.expected.aggregate.groupBy)||row.expected.aggregate.groupBy.length>8||typeof row.expected.aggregate.field!=='string'))throw new Error('Invalid aggregate constraint.');
    return row;
  }
  static forTarget(target){return (target.researchModel?.constraints||[]).map(c=>this.validate(c,target));}
}
function discoveryPredicate(row,p,prior){
  const value=row[p.field],other=p.other?.startsWith('prior.')?prior?.[p.other.slice(6)]:row[p.other];
  if(p.operator==='exists')return value!==undefined&&value!=='';
  if(value===undefined||value==='unknown'||(['eqField','neqField'].includes(p.operator)&&(other===undefined||other==='unknown')))return null;
  return ({eq:()=>value===p.value,neq:()=>value!==p.value,in:()=>p.value.includes(value),lte:()=>value<=p.value,gte:()=>value>=p.value,eqField:()=>value===other,neqField:()=>value!==other})[p.operator]();
}
export class ConstraintEvaluator {
  static evaluate(constraint,{graph,rows,target}){
    const matches=[],unknowns=[],evidenceRefs=[];let applicable=0,violations=0,missing=false;
    for(const row of rows){
      if(constraint.subject&&constraint.subject!==row.actorId||constraint.object&&constraint.object!==row.objectId||constraint.operation&&constraint.operation!==row.operation)continue;
      const conditions=(constraint.condition.all||[]).map(p=>discoveryPredicate(row,p));
      if(conditions.includes(false))continue;if(conditions.includes(null)){missing=true;unknowns.push('Missing condition fields for '+row.id);continue;}
      let prior;
      if(constraint.condition.prior){
        const selection=constraint.condition.prior;
        const candidates=graph.model.events.filter(e=>e.id!==row.id&&(selection.same||['actorId','objectId']).every(f=>e[f]&&e[f]===row[f])&&(selection.all||[]).every(p=>discoveryPredicate(e,p)===true)&&graph.timeline.compare(e,row)==='BEFORE');
        prior=candidates.find(e=>candidates.every(other=>other.id===e.id||graph.timeline.compare(other,e)==='BEFORE'));
        if(!prior){missing=true;unknowns.push('Ordered predecessor unavailable for '+row.id);continue;}
      }
      applicable++;matches.push(row.id);evidenceRefs.push(...row.evidenceRefs,...(prior?.evidenceRefs||[]));
      let expectedRow=row;
      if(constraint.expected.aggregate){
        const a=constraint.expected.aggregate,group=rows.filter(r=>(a.groupBy||['objectId']).every(f=>r[f]===row[f])&&(a.all||[]).every(p=>discoveryPredicate(r,p)===true));
        const distinct=new Map();for(const r of group)distinct.set(r[a.distinctBy||'id'],r);
        if(group.some(r=>!Number.isFinite(r[a.field])||!supportedResearchObservation(r,target))){missing=true;continue;}
        expectedRow={...row,total:[...distinct.values()].reduce((n,r)=>n+r[a.field],0)};evidenceRefs.push(...group.flatMap(r=>r.evidenceRefs));
      }
      const result=(constraint.expected.all||[]).map(p=>discoveryPredicate(expectedRow,p,prior));
      if(!result.length||result.includes(null)){missing=true;unknowns.push('Expected fields unavailable for '+row.id);continue;}
      if(!supportedResearchObservation(row,target)||prior&&!supportedResearchObservation(prior,target)){missing=true;unknowns.push('Raw evidence missing or changed for '+row.id);continue;}
      if(result.includes(false))violations++;
    }
    const status=violations?(constraint.verified?'VIOLATED':'POSSIBLE_VIOLATION'):missing?'INSUFFICIENT_EVIDENCE':applicable?'SATISFIED':'NOT_APPLICABLE';
    return {constraintId:constraint.id,status,eventIds:matches,evidenceRefs:discoveryUnique(evidenceRefs),unknowns,requiresValidation:true,confirmed:false};
  }
}
export class ChainInterestingnessScore {
  static score(nodes,edges){
    const changed=f=>discoveryUnique(nodes.map(n=>n[f])).length>1;
    const factors={authorityTransition:nodes.some(n=>n.authorityBefore!==undefined&&n.authorityBefore!==n.authorityAfter),stateTransition:nodes.some(n=>n.stateBefore&&n.stateBefore!==n.stateAfter),boundaryCrossing:edges.some(e=>e.type==='CROSSES_BOUNDARY'),businessCriticality:nodes.some(n=>n.businessCriticality>50),sensitiveObject:nodes.some(n=>n.sensitive===true),protectedOperation:nodes.some(n=>n.requiredRole||n.expectedAuthority),unexpectedOutcome:nodes.some(n=>n.expectedOutcome&&n.actualOutcome&&n.expectedOutcome!==n.actualOutcome),contradiction:edges.some(e=>e.type==='CONTRADICTS'),crossTenant:changed('tenant'),crossSurface:changed('surface'),concurrency:edges.some(e=>e.type==='CONCURRENT'),temporalOrdering:edges.some(e=>e.type==='PRECEDES'),invariantRelevance:nodes.some(n=>n.type==='invariant'),evidenceStrength:nodes.filter(n=>n.evidenceRefs?.length).length/nodes.length,novelty:true,uncertainty:nodes.some(n=>!n.provenance||n.provenance.status==='UNKNOWN')};
    return {score:Math.round(Object.values(factors).reduce((n,v)=>n+Number(v),0)/16*100),factors,meaning:'Research priority, not severity'};
  }
}
export class GeneralChainDiscoveryService {
  static discover(graph,{maxHops=8,maxCandidates=64,maxExpansions=4000}={}){
    maxHops=Math.max(2,Math.min(8,maxHops));maxCandidates=Math.max(1,Math.min(64,maxCandidates));maxExpansions=Math.max(1,Math.min(4000,maxExpansions));const edges=graph.edges.filter(e=>!['SUPPORTS','OBSERVED_IN','CONTEXT'].includes(e.type)),nodes=[...graph.nodes.values()],paths=new Map();
    const events=graph.model.events.slice(0,120),groups=new Map();
    for(const event of events)if(event.objectId){if(!groups.has(event.objectId))groups.set(event.objectId,[]);groups.get(event.objectId).push(event);}
    for(const group of groups.values()){
      group.sort((a,b)=>{const order=graph.timeline.compare(a,b);return order==='BEFORE'?-1:order==='AFTER'?1:0;});
      for(let i=0;i<group.length-1;i++){const left=group[i],right=group[i+1];if(graph.timeline.compare(left,right)==='BEFORE')edges.push({from:'event:'+left.id,to:'event:'+right.id,type:'PRECEDES',provenance:{status:'UNKNOWN',source:'Explicit timeline ordering',evidenceRefs:discoveryUnique([...left.evidenceRefs,...right.evidenceRefs])}});}
    }
    const adjacency=new Map();for(const edge of edges){if(!adjacency.has(edge.from))adjacency.set(edge.from,[]);adjacency.get(edge.from).push(edge);}
    let expansions=0;
    const visit=(ids,path)=>{
      if(++expansions>maxExpansions)return;
      if(path.length>=2){
        const chainNodes=ids.map(id=>graph.nodes.get(id)).filter(Boolean),ranking=ChainInterestingnessScore.score(chainNodes,path);
        if(ranking.score>=15){
          const signature=researchFingerprint([chainNodes.map(n=>[n.type,n.actorId,n.objectId,n.operation,n.operationId,n.state,n.stateBefore,n.stateAfter,n.authorityBefore,n.authorityAfter,n.tenant,n.surface,n.version,n.outcome]),path.map(e=>e.type)]),existing=paths.get(signature),refs=discoveryUnique([...chainNodes.flatMap(n=>n.evidenceRefs||[]),...path.flatMap(e=>e.provenance?.evidenceRefs||[])]);
          if(existing){existing.evidenceRefs=discoveryUnique([...existing.evidenceRefs,...refs]);existing.equivalentNodes=discoveryUnique([...existing.equivalentNodes,...ids]);}
          else paths.set(signature,{id:'CHAIN-'+signature,nodes:ids,edges:path,startState:chainNodes[0],endState:chainNodes.at(-1),authorityChanges:chainNodes.filter(n=>n.authorityBefore&&n.authorityBefore!==n.authorityAfter).map(n=>n.referenceId),stateChanges:chainNodes.filter(n=>n.stateBefore&&n.stateBefore!==n.stateAfter).map(n=>n.referenceId),boundaries:discoveryUnique(chainNodes.map(n=>n.boundaryId)),evidenceRefs:refs,invariantRefs:chainNodes.filter(n=>n.type==='invariant').map(n=>n.referenceId),constraints:[],interestingSignals:[],confidence:Math.min(.75,chainNodes.filter(n=>supportedResearchObservation(n,graph.target)).length/chainNodes.length),provenance:path.map(e=>e.provenance),ranking,equivalentNodes:ids});
        }
      }
      if(path.length===maxHops)return;for(const edge of adjacency.get(ids.at(-1))||[])if(!ids.includes(edge.to))visit([...ids,edge.to],[...path,edge]);
    };
    for(const node of nodes.sort((a,b)=>Number(b.type==='event')-Number(a.type==='event')))if(expansions<=maxExpansions)visit([node.id],[]);
    return {chains:[...paths.values()].sort((a,b)=>b.ranking.score-a.ranking.score||b.edges.length-a.edges.length||a.id.localeCompare(b.id)).slice(0,maxCandidates),search:{expansions,bounded:expansions>maxExpansions,omittedCandidates:Math.max(0,paths.size-maxCandidates),maxHops,omittedTemporalEvents:Math.max(0,graph.model.events.length-events.length)}};
  }
}
export class LogicalOperationMatcher {
  static compare(a,b){
    const fields=['actorId','objectId','operationIntent','stateBefore','stateAfter','expectedOutcome','requiredRole'];
    const missing=fields.filter(f=>a[f]===undefined||b[f]===undefined||a[f]===''||b[f]==='');
    const equivalent=!missing.length&&fields.every(f=>a[f]===b[f]);
    return {equivalent,status:missing.length?'UNKNOWN':equivalent?'EQUIVALENT':'DIFFERENT',missing,differential:equivalent&&a.surface!==b.surface&&a.outcome!==b.outcome,dimensions:['surface','role','tenant','effectiveAuthority','version'].filter(f=>a[f]!==b[f])};
  }
}
export class ResearchUncertaintyService {
  static forRelationship(relationship,evaluation){return [
    {id:'UNKNOWN-'+researchFingerprint(relationship.id),question:'Does the operation have independent authority, an effective policy exception, or delayed state propagation?',relatedChain:relationship.chainId,possibleAnswers:['Target rule applies immediately','Independent reviewed capability','Documented propagation delay','Observation mismatch','UNKNOWN'],evidenceNeeded:['Reviewed target policy','Fresh authority and execution logs','Equivalent controlled operation'],impactOnHypothesis:'Separates a broken target relationship from permitted or misattributed behavior',priority:80,status:'UNKNOWN'},
    ...evaluation.unknowns.map((question,i)=>({id:'UNKNOWN-'+researchFingerprint([relationship.id,i]),question,relatedChain:relationship.chainId,possibleAnswers:['Supported','Refuted','UNKNOWN'],evidenceNeeded:evaluation.evidenceRefs,impactOnHypothesis:'Blocks a supported conclusion',priority:95,status:'UNKNOWN'}))];}
}
export class InformationGainService {
  static rank(tests){return tests.map(t=>({...t,score:Math.round((t.informationGain*.3+t.businessImportance*.15+t.hypothesisSeparation*.25+t.scopeConfidence*.1+t.evidenceQualityPotential*.2-t.testingCost*.1-t.executionRisk*.2))})).sort((a,b)=>b.score-a.score||a.id.localeCompare(b.id));}
  static candidates(relationship,scopeConfidence){return this.rank([
    {id:'TEST-'+relationship.id,relationshipId:relationship.id,title:'Compare equivalent operations before and after the relevant transition; capture authority source, version and effective time',properties:['matched-object','matched-intent','before-after-control','authority-source','fresh-evidence','manual-only'],informationGain:90,businessImportance:70,hypothesisSeparation:90,testingCost:40,scopeConfidence,executionRisk:20,evidenceQualityPotential:95,expectedOutcomes:{relationshipFailure:'Equivalent control violates reviewed rule',independentCapability:'Separate reviewed grant authorizes outcome',propagationDelay:'Behavior changes after documented effective time',observationMismatch:'Actor, object, intent or version differs'}},
    {id:'REPEAT-'+relationship.id,relationshipId:relationship.id,title:'Repeat the same observation',properties:['repeat','manual-only'],informationGain:10,businessImportance:70,hypothesisSeparation:5,testingCost:20,scopeConfidence,executionRisk:20,evidenceQualityPotential:40}
  ]);}
}
export class FailedPathMemory {
  static fingerprint(relationship,target){return researchFingerprint([relationship.evidenceRefs.map(id=>target.evidence.find(e=>e.id===id)),target.researchModel.events.filter(e=>relationship.evidenceRefs.some(id=>e.evidenceRefs.includes(id))),target.researchModel.observations.filter(e=>relationship.evidenceRefs.some(id=>e.evidenceRefs.includes(id))),target.researchModel.constraints?.filter(c=>relationship.constraintRefs.includes(c.id))]);}
  static consider(relationship,target){const previous=(target.researchModel.failedPaths||[]).find(p=>p.relationshipId===relationship.id);if(!previous)return {suppressed:false};const changed=previous.dependencyFingerprint!==this.fingerprint(relationship,target);return {suppressed:!changed,reopened:changed,reason:changed?'Evidence, state or target constraint changed since the reviewed path':previous.reason};}
  static record(relationship,target,status,reason){if(!['REJECTED','EXPLAINED','BENIGN','FAILED_TEST','ALTERNATIVE','DEAD_END'].includes(status)||!reason)throw new Error('Reviewed memory reason required.');return {relationshipId:relationship.id,status,reason,dependencyFingerprint:this.fingerprint(relationship,target)};}
}
export class ObservationExtractionService {
  static propose(evidence,input={}){
    let metadata=input;try{if(!Object.keys(input).length)metadata={...(evidence.metadata||{}),...JSON.parse(evidence.content||'{}')};}catch{metadata=evidence.metadata||{};}
    const fields=['actorId','objectId','tenant','operation','operationIntent','surface','state','stateBefore','stateAfter','authorityBefore','authorityAfter','requiredRole','outcome','version','order','timestamp'];
    let raw={};try{raw={...(evidence.metadata||{}),...JSON.parse(evidence.content||'{}')};}catch{raw=evidence.metadata||{};}
    const facts=Object.fromEntries(fields.filter(f=>Object.hasOwn(metadata,f)&&['string','number'].includes(typeof metadata[f])&&raw[f]===metadata[f]).map(f=>[f,metadata[f]]));
    return {id:'PROPOSAL-'+researchFingerprint([evidence.id,facts]),status:'PROPOSED',observation:{id:'OBS-'+researchFingerprint([evidence.id,facts]),...facts,evidenceRefs:[evidence.id],provenance:{status:'UNKNOWN',source:'Deterministic extraction awaiting review',confidence:0,evidenceRefs:[evidence.id]}},fieldProvenance:Object.entries(facts).map(([field,value])=>({field,value,source:evidence.id,extraction:'deterministic',confirmed:false})),rawFingerprint:researchFingerprint(evidence)};
  }
  static confirm(proposal,target,{reviewed=false}={}){if(!reviewed||proposal.status!=='PROPOSED')throw new Error('Researcher review required.');const raw=target.evidence.find(e=>e.id===proposal.observation.evidenceRefs[0]);if(!raw||researchFingerprint(raw)!==proposal.rawFingerprint)throw new Error('Raw evidence changed; re-extract.');if(researchFingerprint(this.propose(raw).observation)!==researchFingerprint(proposal.observation))throw new Error('Proposed fields differ from raw extraction.');return {...structuredClone(proposal.observation),provenance:{...proposal.observation.provenance,status:'RESEARCHER_CONFIRMED',source:'Researcher reviewed extraction',confidence:1}};}
}
export class ModelRouting {
  static select({operation,chainHops=0,competing=0,highValueUnknown=false,cheapConfidence=1},models={}){const deterministic=['graph','constraint','lookup','extraction','ranking'].includes(operation),tier=deterministic?'DETERMINISTIC':chainHops>=5||competing>=3||highValueUnknown||cheapConfidence<.6?'REASONING':'CHEAP';return {tier,model:tier==='DETERMINISTIC'?null:models[tier]||null,reason:deterministic?'Deterministic operation':tier==='REASONING'?'Complexity or unresolved competing explanations':'Simple interpretation'};}
}
export class ResearchResultCache {
  constructor(limit=64){this.limit=limit;this.entries=new Map();}
  key({targetRevision,researchRevision,context,operation,tier}){return researchFingerprint([targetRevision,researchRevision,context,operation,tier]);}
  get(input){const result=this.entries.get(this.key(input));return result===undefined?undefined:structuredClone(result);}
  set(input,value){const key=this.key(input);this.entries.delete(key);this.entries.set(key,structuredClone(value));while(this.entries.size>this.limit)this.entries.delete(this.entries.keys().next().value);return value;}
}
export function discoveryDependencies(discovery,refs){
  const selected={chain:new Set(),constraint:new Set(),signal:new Set(),unknown:new Set()},evidence=new Set(),records=new Set();
  for(const ref of refs)selected[ref.kind]?.add(ref.id);
  for(let depth=0;depth<8;depth++){
    for(const question of discovery.unknowns)if(selected.unknown.has(question.id))selected.chain.add(question.relatedChain);
    for(const relationship of discovery.relationships)if(selected.signal.has(relationship.id)||selected.chain.has(relationship.chainId)||relationship.constraintRefs.some(id=>selected.constraint.has(id))){selected.signal.add(relationship.id);selected.chain.add(relationship.chainId);relationship.constraintRefs.forEach(id=>selected.constraint.add(id));relationship.unknowns.forEach(id=>selected.unknown.add(id));relationship.evidenceRefs.forEach(id=>evidence.add(id));}
    for(const constraint of discovery.constraints)if(selected.constraint.has(constraint.id)&&constraint.sourceType==='OBSERVED')evidence.add(constraint.sourceRef);
    for(const chain of discovery.chains)if(selected.chain.has(chain.id)){chain.evidenceRefs.forEach(id=>evidence.add(id));chain.equivalentNodes.forEach(id=>records.add(id));chain.constraints.forEach(id=>selected.constraint.add(id));}
  }
  return {selected,evidence:[...evidence],records:[...records]};
}
export function compactDiscoveryContext(discovery,{focusIds=[]}={}){
  const state=row=>Object.fromEntries(['id','referenceId','type','actorId','objectId','operation','state','version','tenant','surface','authorityBefore','authorityAfter','outcome'].filter(f=>row[f]!==undefined).map(f=>[f,row[f]]));
  const ranked=rows=>[...rows].sort((a,b)=>Number(focusIds.includes(b.id))-Number(focusIds.includes(a.id)));
  const chains=ranked(discovery.chains).slice(0,4).map(c=>({...c,startState:state(c.startState),endState:state(c.endState),provenance:c.provenance.map(p=>({status:p.status,source:p.source,evidenceRefs:p.evidenceRefs})),edges:c.edges.map(e=>({from:e.from,to:e.to,type:e.type,provenance:{status:e.provenance.status,source:e.provenance.source,evidenceRefs:e.provenance.evidenceRefs}}))}));
  return {...discovery,chains,relationships:ranked(discovery.relationships).slice(0,8),constraints:ranked(discovery.constraints).slice(0,12),evaluations:discovery.evaluations.slice(0,12),hypotheses:discovery.hypotheses.slice(0,16),unknowns:ranked(discovery.unknowns).slice(0,16),nextTests:discovery.nextTests.slice(0,8),differential:discovery.differential.slice(0,8),contextOmissions:{chains:discovery.chains.length-chains.length,relationships:Math.max(0,discovery.relationships.length-8),constraints:Math.max(0,discovery.constraints.length-12)}};
}
export function discoverResearch({graph,target,contradictions=[],scopeConfidence=0}){
  const found=GeneralChainDiscoveryService.discover(graph),constraints=TargetConstraintService.forTarget(target),evaluations=[],relationships=[],unknowns=[],hypotheses=[],nextTests=[];
  const rows=[...graph.model.events,...graph.model.observations];
  for(const constraint of constraints){
    const evaluation=ConstraintEvaluator.evaluate(constraint,{graph,rows,target});evaluations.push(evaluation);
    if(!['VIOLATED','POSSIBLE_VIOLATION','INSUFFICIENT_EVIDENCE','UNKNOWN'].includes(evaluation.status))continue;
    const chain=found.chains.find(c=>evaluation.eventIds.some(id=>c.equivalentNodes.includes('event:'+id)||c.equivalentNodes.includes('observation:'+id)));
    const terminal=rows.find(r=>evaluation.eventIds.includes(r.id)&&r.operation===constraint.operation);
    const relationship={actorId:terminal?.actorId||'',objectId:terminal?.objectId||'',boundaryId:terminal?.boundaryId||'',operation:constraint.operation,state:terminal?.state||'Unknown',authority:terminal?.effectiveAuthority||'Unknown',id:'SIGNAL-'+researchFingerprint([constraint.id,evaluation.eventIds]),type:'interesting_relationship',summary:'Observed '+constraint.operation+' relationship requires review against '+constraint.category+' constraint '+constraint.id,chainId:chain?.id||'',whyInteresting:[evaluation.status,'Target-specific expected versus observed relationship'],evidenceRefs:evaluation.evidenceRefs,constraintRefs:[constraint.id],invariantRefs:chain?.invariantRefs||[],unknowns:[],possibleExplanations:['Relationship failure','Independent reviewed capability or policy exception','Delayed state propagation','Observation mismatch'],status:evaluation.status,confidence:evaluation.status==='VIOLATED'?.75:.35,requiresValidation:true,confirmed:false};
    const memory=FailedPathMemory.consider(relationship,target);if(memory.suppressed)continue;relationship.memory=memory;
    if(chain){chain.constraints.push(constraint.id);chain.interestingSignals.push(relationship.id);}
    const questions=ResearchUncertaintyService.forRelationship(relationship,evaluation);relationship.unknowns=questions.map(q=>q.id);unknowns.push(...questions);relationships.push(relationship);
    for(const [i,family] of ['relationshipFailure','independentCapability','propagationDelay','observationMismatch'].entries())hypotheses.push({id:'H'+(i+1)+'-'+relationship.id,relationshipId:relationship.id,family,supportingEvidence:i===0?evaluation.evidenceRefs:[],contradictingEvidence:[],unknowns:relationship.unknowns,requiredEvidence:questions.flatMap(q=>q.evidenceNeeded),confidence:i===0?relationship.confidence:.25,status:'UNVERIFIED'});
    if(scopeConfidence===100)nextTests.push(...InformationGainService.candidates(relationship,scopeConfidence));
  }
  if(!constraints.length){const chain=found.chains.find(c=>(c.authorityChanges.length||c.stateChanges.length)&&c.nodes.some(id=>graph.nodes.get(id)?.outcome==='allowed'));if(chain){const relationship={id:'SIGNAL-'+researchFingerprint(chain.id),type:'interesting_relationship',summary:'Authority or state changed on a multi-hop path containing a completed operation; target policy is unknown',chainId:chain.id,whyInteresting:['Authority transition','Temporal relationship'],evidenceRefs:chain.evidenceRefs,constraintRefs:[],invariantRefs:chain.invariantRefs,unknowns:[],possibleExplanations:['Relationship failure','Independent capability','Propagation delay','Observation mismatch'],status:'UNKNOWN',confidence:.25,requiresValidation:true,confirmed:false};const memory=FailedPathMemory.consider(relationship,target);if(!memory.suppressed){relationships.push(relationship);const questions=ResearchUncertaintyService.forRelationship(relationship,{unknowns:['Target-specific constraint is unavailable'],evidenceRefs:chain.evidenceRefs});relationship.unknowns=questions.map(q=>q.id);unknowns.push(...questions);}}}
  const differential=[];for(let i=0;i<Math.min(rows.length,120)&&differential.length<32;i++)for(let j=i+1;j<Math.min(rows.length,120)&&differential.length<32;j++){const comparison=LogicalOperationMatcher.compare(rows[i],rows[j]);if(comparison.differential)differential.push({id:'DIFF-'+researchFingerprint([rows[i].id,rows[j].id]),comparison,eventIds:[rows[i].id,rows[j].id],evidenceRefs:discoveryUnique([...rows[i].evidenceRefs,...rows[j].evidenceRefs]),supported:!!supportedResearchObservation(rows[i],target)&&!!supportedResearchObservation(rows[j],target),requiresValidation:true});}
  for(const diff of differential){const row=rows.find(r=>r.id===diff.eventIds[0]),chain=found.chains.find(c=>diff.eventIds.some(id=>c.equivalentNodes.includes('event:'+id)||c.equivalentNodes.includes('observation:'+id))),relationship={id:diff.id,type:'interesting_relationship',actorId:row.actorId,objectId:row.objectId,operation:row.operationIntent,chainId:chain?.id||'',summary:'Equivalent business operation has different observed outcomes across surfaces',whyInteresting:['Matched business object, actor, intent, transition and expected authority'],evidenceRefs:diff.evidenceRefs,constraintRefs:[],invariantRefs:[],unknowns:[],possibleExplanations:['Relationship failure','Surface-specific reviewed policy','Observation mismatch'],status:diff.supported?'UNKNOWN':'INSUFFICIENT_EVIDENCE',confidence:.35,requiresValidation:true,confirmed:false};if(!FailedPathMemory.consider(relationship,target).suppressed)relationships.push(relationship);}
  for(const relationship of relationships){
    if(!relationship.unknowns.length){const questions=ResearchUncertaintyService.forRelationship(relationship,{unknowns:[],evidenceRefs:relationship.evidenceRefs});relationship.unknowns=questions.map(q=>q.id);unknowns.push(...questions);}
    if(!hypotheses.some(h=>h.relationshipId===relationship.id))for(const [i,family] of ['relationshipFailure','independentCapability','propagationDelay','observationMismatch'].entries())hypotheses.push({id:'H'+(i+1)+'-'+relationship.id,relationshipId:relationship.id,family,supportingEvidence:i===0?relationship.evidenceRefs:[],contradictingEvidence:[],unknowns:relationship.unknowns,requiredEvidence:['Reviewed target policy','Matched control with fresh authority, object and execution evidence'],confidence:relationship.confidence,status:'UNVERIFIED'});
    if(scopeConfidence===100&&!nextTests.some(t=>t.relationshipId===relationship.id))nextTests.push(...InformationGainService.candidates(relationship,scopeConfidence));
    const controls=graph.model.observations.filter(o=>o.discriminatesSignalId===relationship.id&&o.actorId===relationship.actorId&&o.objectId===relationship.objectId&&supportedResearchObservation(o,target));
    for(const hypothesis of hypotheses.filter(h=>h.relationshipId===relationship.id)){
      const supporting=controls.filter(o=>o.explanationOutcome===hypothesis.family),contradicting=controls.filter(o=>o.explanationOutcome&&o.explanationOutcome!=='unknown'&&o.explanationOutcome!==hypothesis.family);
      hypothesis.supportingEvidence=discoveryUnique([...hypothesis.supportingEvidence,...supporting.flatMap(o=>o.evidenceRefs)]);hypothesis.contradictingEvidence=discoveryUnique(contradicting.flatMap(o=>o.evidenceRefs));
      if(contradicting.length)hypothesis.confidence=Math.min(.25,hypothesis.confidence);
    }
  }
  return {...found,constraints,evaluations,relationships,unknowns,hypotheses,nextTests:InformationGainService.rank(nextTests),differential,contradictionRefs:contradictions.map(s=>s.id),status:relationships.length?'RESEARCH_REQUIRED':'UNKNOWN',confirmed:false};
}
