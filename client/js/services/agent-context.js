import {buildKnowledgeContext} from './knowledge-context.js';
import {DomainKnowledgeService} from './domain-knowledge.js';
import {emptyAgentResearch} from './agent-schema.js';
import {SecretRedactor} from './redactor.js';
import {environmentMetadata} from './environment.js';
import {observationFingerprint} from './research-integrity.js';
// Allowlist + per-collection caps. No other target, full DB, filesystem or provider config.
export function buildAgentContext(workspace,target){
  const knowledge=buildKnowledgeContext(workspace,target,{domainId:target.intelligence.primaryDomainId});
  knowledge.domains=DomainKnowledgeService.selected(workspace,target).slice(0,3).map(pack=>buildKnowledgeContext(workspace,target,{domainId:pack.id}).domains[0]);
  knowledge.techniques=target.techniques.filter(t=>t.enabled).slice(0,20).map(t=>({id:t.id,libraryId:t.libraryId||'',name:t.name,securityInvariant:t.securityInvariant}));
  const pick=(row,keys)=>({...Object.fromEntries(keys.map(k=>[k,typeof row[k]==='string'?row[k].slice(0,8000):row[k]??''])),sourceFingerprint:observationFingerprint(row)});
  return {targetId:target.id,revision:target.researchRevision||0,knowledge,...(target.researchEnvironment?{environment:environmentMetadata(target)}:{}),sensitiveEvidenceIds:target.evidence.slice(-12).filter(e=>SecretRedactor.redact(e.content)!==e.content).map(e=>e.id),
    hypotheses:target.hypotheses.slice(-20).map(r=>pick(r,['id','authProfileId','title','techniqueId','invariant','expectedBehavior','potentialFailure','who','what','object','state','authority','context','notes','status'])),
    tests:target.testCases.slice(-20).map(r=>({...pick(r,['id','authProfileId','hypothesisId','techniqueId','title','preconditions','steps','expectedResult','actualResult','who','what','object','state','authority','context','result']),evidenceIds:(r.evidenceIds||[]).slice(0,12)})),
    evidence:target.evidence.slice(-12).map(r=>pick(r,['id','label','type','description','content','testCaseId','findingId'])),
    findings:target.findings.slice(-12).map(r=>({...pick(r,['id','title','testCaseId','techniqueId','status','severity','startingAuthority','securityRestriction','protectedResource','rootCause','impact','expectedResult','actualResult','steps','who','what','object','state','authority','context']),evidenceIds:(r.evidenceIds||[]).slice(0,12)})),
    lessons:target.knowledgeBase.slice(-12).map(r=>pick(r,['id','category','title','content','source','rootCause','securityRestriction','affectedComponent','impact'])),
    manualAnalysis:(target.agentResearch||emptyAgentResearch()).manualAnalysis.slice(-12).map(r=>pick(r,['id','type','title','content','sourceType','createdAt']))};
}
