import {discoveryDependencies} from './discovery-intelligence.js';
import {buildKnowledgeContext} from './knowledge-context.js';
import {DomainKnowledgeService} from './domain-knowledge.js';
import {emptyAgentResearch} from './agent-schema.js';
import {SecretRedactor} from './redactor.js';
import {environmentMetadata} from './environment.js';
import {observationFingerprint} from './research-integrity.js';
import {selectResearchContext,stableResearchReferences} from './research-context-selection.js';
import {selectResearchModel} from './research-model.js';
import {analyzeAdvancedResearch,compactAdvancedContext} from './advanced-research.js';
// Allowlist + per-collection caps. No other target, full DB, filesystem or provider config.
export function buildAgentContext(workspace,source,options={}){
  const modelEvidence=source.researchModel?[...source.researchModel.events,...source.researchModel.observations].flatMap(e=>[...e.evidenceRefs,e.actorId,e.objectId,e.boundaryId,e.testId,e.hypothesisId].filter(Boolean)):[];
  const discovery=options.discovery||(source.researchModel?analyzeAdvancedResearch(source).discovery:null);
  const requested=discovery?Object.entries({chain:discovery.chains,constraint:discovery.constraints,signal:discovery.relationships,unknown:discovery.unknowns}).flatMap(([kind,rows])=>rows.filter(r=>(options.focusIds||[]).includes(r.id)).map(r=>({kind,id:r.id}))):[];
  const dependencies=discovery?discoveryDependencies(discovery,requested):{evidence:[]};
  const {selected:target,manifest}=selectResearchContext(source,{...options,chainIds:dependencies.evidence,contradictionIds:modelEvidence});
  let advanced={};
  if(source.researchModel){const selection=selectResearchModel(source.researchModel,target);target.researchModel=selection.model;manifest.omitted.push(...selection.omitted);advanced={researchModel:selection.model,advancedResearch:analyzeAdvancedResearch(target)};}
  if(advanced.advancedResearch)advanced.advancedResearch=compactAdvancedContext(advanced.advancedResearch,{focusIds:options.focusIds});
  const knowledge=buildKnowledgeContext(workspace,target,{domainId:target.intelligence.primaryDomainId});
  knowledge.domains=DomainKnowledgeService.selected(workspace,target).slice(0,3).map(pack=>buildKnowledgeContext(workspace,target,{domainId:pack.id}).domains[0]);
  knowledge.techniques=target.techniques.filter(t=>t.enabled).slice(0,20).map(t=>({id:t.id,libraryId:t.libraryId||'',name:t.name,securityInvariant:t.securityInvariant}));
  for(const [key,keys] of [['actors',['id','name','authority','notes']],['objects',['id','name','type','owner','tenant','state','sensitivity','notes']]])knowledge[key]=target[key].map(row=>Object.fromEntries(keys.map(k=>[k,row[k]||''])));
  knowledge.boundaries=target.boundaries.map(row=>({...row}));
  manifest.omittedCriticalDependencies=manifest.omitted.filter(r=>r.reason?.includes('dependency'));
  if(manifest.omittedCriticalDependencies.length&&advanced.advancedResearch){advanced.advancedResearch.conclusionLimit='Critical dependencies omitted; no high-confidence conclusion';for(const r of advanced.advancedResearch.discovery.relationships)r.confidence=Math.min(.35,r.confidence);}
  manifest.fieldTruncations=[];
  const pick=(row,keys)=>{for(const key of keys)if(typeof row[key]==='string'&&row[key].length>8000)manifest.fieldTruncations.push({id:row.id,field:key,includedCharacters:8000,omittedCharacters:row[key].length-8000,reason:'field context budget; full raw source stays local'});return {...Object.fromEntries(keys.map(k=>[k,typeof row[k]==='string'?row[k].slice(0,8000):row[k]??''])),...stableResearchReferences(source,row),...(row.knowledgeLinks?{knowledgeLinks:{...row.knowledgeLinks}}:{}),sourceFingerprint:observationFingerprint(row)};};
  return {targetId:target.id,revision:target.researchRevision||0,knowledge,contextManifest:manifest,...advanced,...(target.researchEnvironment?{environment:environmentMetadata(target)}:{}),sensitiveEvidenceIds:target.evidence.filter(e=>SecretRedactor.redact(e.content)!==e.content).map(e=>e.id),
    hypotheses:target.hypotheses.map(r=>pick(r,['id','authProfileId','title','techniqueId','invariant','expectedBehavior','potentialFailure','who','what','object','state','authority','context','notes','status','signalId','priority','queue','priorityFactors'])),
    tests:target.testCases.map(r=>({...pick(r,['id','authProfileId','hypothesisId','techniqueId','title','preconditions','steps','expectedResult','actualResult','who','what','object','state','authority','context','result']),evidenceIds:(r.evidenceIds||[]).slice(0,12)})),
    evidence:target.evidence.map(r=>pick(r,['id','label','type','description','content','testCaseId','findingId','evidenceRole'])),
    findings:target.findings.map(r=>({...pick(r,['id','title','testCaseId','techniqueId','status','severity','startingAuthority','securityRestriction','protectedResource','rootCause','impact','expectedResult','actualResult','steps','who','what','object','state','authority','context']),testIds:r.testIds||[],evidenceLinks:r.evidenceLinks||[],evidenceIds:(r.evidenceIds||[]).slice(0,12)})),
    lessons:target.knowledgeBase.slice(-12).map(r=>pick(r,['id','category','title','content','source','rootCause','securityRestriction','affectedComponent','impact'])),
    manualAnalysis:(target.agentResearch||emptyAgentResearch()).manualAnalysis.slice(-12).map(r=>pick(r,['id','type','title','content','sourceType','createdAt']))};
}
