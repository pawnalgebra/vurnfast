import {TargetConstraintService} from './discovery-intelligence.js';
export const researchTruth=['OBSERVED','RESEARCHER_CONFIRMED','AI_INFERRED','UNKNOWN'];
export const causalRelationTypes=['OWNS','CAN_ACCESS','GRANTED','REVOKED','TRANSITIONS_TO','EXECUTES','CREATES','MODIFIES','DEPENDS_ON','CROSSES_BOUNDARY','AUTHORIZED_BY','INVALIDATES','SUPPORTS','CONTRADICTS','OBSERVED_IN','PRECEDES','FOLLOWS','CONCURRENT','CONTROL','CONTEXT','PREREQUISITE','OUTCOME','PRODUCES'];
export const emptyResearchModel=()=>({version:1,events:[],observations:[],invariants:[],relations:[],signalDecisions:[],rejectedExplanations:[],unresolvedQuestions:[]});
export function supportedResearchObservation(row,target){return ['OBSERVED','RESEARCHER_CONFIRMED'].includes(row.provenance?.status)&&row.evidenceRefs?.length&&row.evidenceRefs.every(id=>target.evidence.some(e=>e.id===id&&(!row.provenance.evidenceFingerprints?.[id]||row.provenance.evidenceFingerprints[id]===(e.sourceFingerprint||observationFingerprint(e)))));}
export function snapshotResearchEvidence(model,target){
  const copy=structuredClone(model);
  for(const row of [...copy.events,...copy.observations,...copy.invariants,...copy.relations])if(!row.provenance.evidenceFingerprints)row.provenance.evidenceFingerprints=Object.fromEntries(row.provenance.evidenceRefs.map(id=>[id,observationFingerprint(target.evidence.find(e=>e.id===id))]));
  return copy;
}
export function repairResearchReferences(target){
  const refs={actorId:target.actors,objectId:target.objects,boundaryId:target.boundaries,hypothesisId:target.hypotheses,testId:target.testCases,testCaseId:target.testCases,findingId:target.findings,authorityProfileId:target.researchEnvironment?.profiles||[]};
  const evidenceIds=new Set(target.evidence.map(e=>e.id));
  for(const row of [...target.hypotheses,...target.testCases,...target.findings]){for(const [field,rows] of Object.entries(refs))if(row[field]&&!rows.some(r=>r.id===row[field]))row[field]='';if(row.testIds)row.testIds=row.testIds.filter(id=>target.testCases.some(t=>t.id===id));if(row.evidenceLinks)row.evidenceLinks=row.evidenceLinks.filter(l=>evidenceIds.has(l.evidenceId));}
  if(!target.researchModel)return;
  const model=target.researchModel;
  for(const row of [...model.events,...model.observations,...model.invariants]){
    for(const [field,rows] of Object.entries(refs))if(row[field]&&!rows.some(r=>r.id===row[field]))row[field]='';
    row.evidenceRefs=row.evidenceRefs.filter(id=>evidenceIds.has(id));row.provenance.evidenceRefs=row.provenance.evidenceRefs.filter(id=>evidenceIds.has(id));
    if(!row.evidenceRefs.length&&row.provenance.status==='OBSERVED'){row.provenance.status='UNKNOWN';row.provenance.confidence=0;}
  }
  model.relations=model.relations.filter(edge=>edge.provenance.evidenceRefs.every(id=>evidenceIds.has(id))&&!Object.entries(refs).some(([field,rows])=>{const type=({actorId:'actor',objectId:'object',boundaryId:'boundary',hypothesisId:'hypothesis',testId:'test',findingId:'finding',authorityProfileId:'authority'})[field];return type&&[edge.from,edge.to].some(endpoint=>endpoint.startsWith(type+':')&&!rows.some(r=>endpoint===type+':'+r.id));}));
  model.rejectedExplanations=model.rejectedExplanations.filter(r=>r.evidenceRefs.every(id=>evidenceIds.has(id)));
}
export function validateResearchProvenance(provenance,evidenceIds){
  if(!provenance||!researchTruth.includes(provenance.status)||typeof provenance.source!=='string'||!provenance.source||!Number.isFinite(provenance.confidence)||provenance.confidence<0||provenance.confidence>1)throw new Error('Research provenance tidak valid.');
  if(!Array.isArray(provenance.evidenceRefs)||provenance.evidenceRefs.some(id=>typeof id!=='string'||!evidenceIds.has(id)))throw new Error('Research provenance evidence tidak tersedia.');
  if(provenance.status==='OBSERVED'&&!provenance.evidenceRefs.length)throw new Error('Observed relation memerlukan raw evidence.');
  if(provenance.evidenceFingerprints!==undefined&&(!provenance.evidenceFingerprints||typeof provenance.evidenceFingerprints!=='object'||Array.isArray(provenance.evidenceFingerprints)||Object.entries(provenance.evidenceFingerprints).some(([id,value])=>typeof value!=='string'||value.length>120)))throw new Error('Evidence fingerprint tidak valid.');
}
export function validateResearchModel(model,target){
  if(!model||model.version!==1)throw new Error('Research model version tidak valid.');
  for(const key of ['events','observations','invariants','relations','signalDecisions','rejectedExplanations','unresolvedQuestions'])if(!Array.isArray(model[key])||model[key].length>2000)throw new Error('Research model collection tidak valid.');
  const raw=new Set((target.evidence||[]).map(e=>e.id)),ids=new Set(),fields=['actorId','objectId','boundaryId','authorityProfileId','tenant','authorityTenant','surface','operation','operationId','role','ownerId','state','stateBefore','stateAfter','authorityBefore','authorityAfter','effectiveAuthority','expectedOutcome','actualOutcome','outcome','timestamp','eventTime','version','approvedVersion','approvalEventId','independentAuthority','requiredRole','expectedAuthority','rule','content','discriminatesSignalId','explanationOutcome','operationIntent','expectedState'];
  const refs={actorId:target.actors||[],objectId:target.objects||[],boundaryId:target.boundaries||[],testId:target.testCases||[],hypothesisId:target.hypotheses||[],findingId:target.findings||[],authorityProfileId:target.researchEnvironment?.profiles||[]};
  for(const row of [...model.events,...model.observations,...model.invariants]){
    if(!row||typeof row.id!=='string'||!row.id||row.id.length>120||ids.has(row.id))throw new Error('Research record ID tidak valid/duplikat.');ids.add(row.id);
    for(const field of fields)if(row[field]!==undefined&&(typeof row[field]!=='string'||row[field].length>8000))throw new Error('Research '+field+' harus teks terbatas.');
    for(const [field,rows] of Object.entries(refs))if(row[field]!==undefined&&(typeof row[field]!=='string'||row[field]&&!rows.some(r=>r.id===row[field])))throw new Error('Research reference '+field+' tidak tersedia.');
    for(const field of ['order','amount','maximum','businessCriticality'])if(row[field]!==undefined&&!Number.isFinite(row[field]))throw new Error('Research numeric field tidak valid.');
    if(!Array.isArray(row.evidenceRefs)||row.evidenceRefs.some(id=>!raw.has(id)))throw new Error('Research evidence reference tidak tersedia.');
    validateResearchProvenance(row.provenance,raw);
    if(row.evidenceRefs.some(id=>!row.provenance.evidenceRefs.includes(id)))throw new Error('Evidence refs harus masuk provenance.');
    for(const key of ['before','after','concurrentWith'])if(row[key]!==undefined&&(!Array.isArray(row[key])||row[key].some(id=>typeof id!=='string')))throw new Error('Logical ordering tidak valid.');
  }
  const events=new Set(model.events.map(e=>e.id));
  for(const event of model.events)for(const key of ['before','after','concurrentWith'])for(const id of event[key]||[])if(!events.has(id)||id===event.id)throw new Error('Logical event reference tidak valid.');
  for(const edge of model.relations){if(!causalRelationTypes.includes(edge.type)||typeof edge.from!=='string'||typeof edge.to!=='string')throw new Error('Causal relation tidak valid.');validateResearchProvenance(edge.provenance,raw);}
  for(const row of model.signalDecisions)if(typeof row.signalId!=='string'||!['REJECTED','EXPLAINED','INVESTIGATE'].includes(row.status)||typeof row.reason!=='string')throw new Error('Signal decision tidak valid.');
  for(const row of model.rejectedExplanations)if(typeof row.signalId!=='string'||typeof row.explanation!=='string'||!Array.isArray(row.evidenceRefs)||row.evidenceRefs.some(id=>!raw.has(id)))throw new Error('Rejected explanation tidak valid.');
  for(const question of model.unresolvedQuestions)if(typeof question!=='string')throw new Error('Unresolved question harus teks.');
  for(const c of model.constraints||[])TargetConstraintService.validate(c,target);
  if(model.constraints!==undefined&&(!Array.isArray(model.constraints)||model.constraints.length>200))throw new Error('Constraint budget exceeded.');
  if(model.failedPaths!==undefined&&(!Array.isArray(model.failedPaths)||model.failedPaths.length>200||model.failedPaths.some(p=>typeof p.relationshipId!=='string'||typeof p.dependencyFingerprint!=='string'||typeof p.reason!=='string')))throw new Error('Invalid failed path memory.');
  return model;
}
export function selectResearchModel(model,target,{limit=60}={}){
  const filtered=emptyResearchModel(),omitted=[],ids=new Set();
  const refs={actorId:target.actors,objectId:target.objects,boundaryId:target.boundaries,testId:target.testCases,hypothesisId:target.hypotheses,findingId:target.findings,authorityProfileId:target.researchEnvironment?.profiles||[]},evidence=new Set(target.evidence.map(e=>e.id));
  for(const key of ['events','observations','invariants'])for(const row of model[key]){
    const missing=Object.entries(refs).some(([field,rows])=>row[field]&&!rows.some(r=>r.id===row[field]))||[...row.evidenceRefs,...row.provenance.evidenceRefs].some(id=>!evidence.has(id));
    if(missing||filtered[key].length>=limit)omitted.push({kind:key,id:row.id,reason:missing?'dependency omitted from selected context':'normalized model budget'});
    else{filtered[key].push(structuredClone(row));ids.add(row.id);}
  }
  const events=new Set(filtered.events.map(e=>e.id));for(const row of filtered.events)for(const key of ['before','after','concurrentWith'])if(row[key])row[key]=row[key].filter(id=>events.has(id));
  // Explicit edges are kept only when their provenance evidence and endpoint records are selected.
  const recordIds=new Set([...ids,...Object.values(refs).flatMap(rows=>rows.map(r=>r.id)),...evidence]);
  const selectedEndpoint=id=>recordIds.has(id.slice(id.indexOf(':')+1));
  filtered.relations=model.relations.filter(r=>selectedEndpoint(r.from)&&selectedEndpoint(r.to)&&r.provenance.evidenceRefs.every(id=>evidence.has(id))).slice(0,120);
  for(const key of ['signalDecisions','rejectedExplanations','unresolvedQuestions'])filtered[key]=structuredClone(model[key].slice(-30));
  filtered.rejectedExplanations=filtered.rejectedExplanations.filter(r=>r.evidenceRefs.every(id=>evidence.has(id)));
  filtered.constraints=structuredClone(model.constraints||[]);filtered.failedPaths=structuredClone(model.failedPaths||[]);
  return {model:filtered,omitted};
}
export class NormalizedObservationService {
  static fromTest(test,target){
    const actor=target.actors.filter(a=>a.name===test.who),object=target.objects.filter(o=>o.name===test.object),evidenceRefs=[...new Set([...(test.evidenceIds||[]),...target.evidence.filter(e=>e.testCaseId===test.id).map(e=>e.id)])];
    return {id:'observation:'+test.id,testId:test.id,actorId:test.actorId||(actor.length===1?actor[0].id:''),objectId:test.objectId||(object.length===1?object[0].id:''),boundaryId:test.boundaryId||'',authorityProfileId:test.authProfileId||'',operation:test.what||'',role:test.role||'',tenant:test.tenant||'',surface:test.surface||'',state:test.state||'',effectiveAuthority:test.authority||'',eventTime:test.timestamp||'',expectedOutcome:test.expectedResult||'',actualOutcome:test.actualResult||'',outcome:test.observedOutcome||'unknown',evidenceRefs,provenance:{status:evidenceRefs.length?'OBSERVED':'UNKNOWN',source:'test:'+test.id,confidence:evidenceRefs.length?1:0,evidenceRefs}};
  }
  static compare(left,right){
    const fields={actorId:'actor',role:'authorization',effectiveAuthority:'authorization',authorityProfileId:'authorization',state:'state',ownerId:'ownership',objectId:'object',tenant:'tenant',surface:'surface',outcome:'business outcome',actualOutcome:'business outcome'};
    const changes=Object.entries(fields).filter(([key])=>left[key]!==right[key]).map(([field,dimension])=>({field,dimension,before:left[field]??'Unknown',after:right[field]??'Unknown'}));
    const sameOperation=!!left.operation&&left.operation===right.operation&&!!left.objectId&&left.objectId===right.objectId;
    return {sameOperation,changes,evidenceRefs:[...new Set([...left.evidenceRefs,...right.evidenceRefs])],interpretation:'Deterministic comparison; changes are research signals, never vulnerability confirmation.'};
  }
}
import {observationFingerprint} from './research-integrity.js';
