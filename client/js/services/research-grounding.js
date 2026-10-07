import {AdversarialValidationService} from './next-hypothesis.js';
export function findingEvidenceGraph(proposal,context){
  const primary=context.tests.find(t=>t.id===proposal.relatedTestId);if(!primary)return {tests:[],evidence:[],signalIds:[],validation:[]};
  const signals=(context.advancedResearch?.signals||[]).filter(s=>s.evidenceRefs.some(id=>proposal.evidenceIds.includes(id))&&(!primary.objectId||s.objectId===primary.objectId));
  const signalEvidence=new Set(signals.flatMap(s=>s.evidenceRefs)),requested=new Set(proposal.evidenceIds);
  const testEvidence=t=>context.evidence.filter(e=>e.testCaseId===t.id||(t.evidenceIds||[]).includes(e.id));
  const tests=context.tests.filter(t=>t.id===primary.id||primary.hypothesisId&&t.hypothesisId===primary.hypothesisId||testEvidence(t).some(e=>signalEvidence.has(e.id))).filter(t=>t.actualResult?.trim());
  const ids=new Set(tests.flatMap(t=>testEvidence(t).map(e=>e.id))),evidence=context.evidence.filter(e=>requested.has(e.id)&&ids.has(e.id));
  const linkedTests=tests.filter(t=>evidence.some(e=>e.testCaseId===t.id||(t.evidenceIds||[]).includes(e.id)));
  const validation=signals.map(s=>({signalId:s.id,...AdversarialValidationService.assess(s,context.researchModel,{evidence:context.evidence})}));
  return {tests:linkedTests,evidence,signalIds:signals.map(s=>s.id),validation};
}
