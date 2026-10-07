import {ResearchPriorityService} from './research-priority.js';
import {supportedResearchObservation} from './research-model.js';
export class AdversarialValidationService {
  static assess(signal,model,target){
    const controls=model.observations.filter(o=>o.discriminatesSignalId===signal.id&&o.actorId===signal.actorId&&o.objectId===signal.objectId&&o.actualOutcome?.trim()&&o.expectedOutcome?.trim()&&(!target||supportedResearchObservation(o,target))&&['OBSERVED','RESEARCHER_CONFIRMED'].includes(o.provenance.status)&&o.evidenceRefs.length&&o.evidenceRefs.some(id=>!signal.evidenceRefs.includes(id))&&['primary','alternative'].includes(o.explanationOutcome));
    const primary=controls.filter(o=>o.explanationOutcome==='primary'),alternative=controls.filter(o=>o.explanationOutcome==='alternative');
    return {status:primary.length&&!alternative.length?'READY_FOR_RESEARCHER_REVIEW':alternative.length&&!primary.length?'EXPLAINED':'NEEDS_TESTING',primaryExplanation:signal.observed,alternativeExplanation:signal.alternativeExplanation,discriminatingTest:signal.discriminatingTest,controlEvidenceRefs:[...new Set(controls.flatMap(o=>o.evidenceRefs))],reason:controls.length?'Researcher supplied discriminating observations; confirmation remains manual.':'No discriminating control evidence. Model confidence cannot resolve alternative explanations.'};
  }
}
export class NextHypothesisService {
  static generate({contradictions,graph,currentHypotheses=[],rejectedExplanations=[],unresolvedQuestions=[],scopeConfidence=50}){
    const candidates=[];
    for(const signal of contradictions){
      if(!signal.actorId||!signal.objectId||!graph.nodes.has('actor:'+signal.actorId)||!graph.nodes.has('object:'+signal.objectId))continue;
      if(currentHypotheses.some(h=>h.signalId===signal.id&&['rejected','confirmed'].includes(h.status)))continue;
      const validation=AdversarialValidationService.assess(signal,graph.model,graph.target);if(validation.status==='EXPLAINED')continue;
      const rejected=rejectedExplanations.filter(r=>r.signalId===signal.id);
      candidates.push({id:'next:'+signal.id,signalId:signal.id,title:'Investigate '+signal.type.replaceAll('_',' ')+' on '+signal.objectId,interestingBoundary:signal.boundaryId||'Authority decision for '+signal.operation,actorId:signal.actorId,objectId:signal.objectId,boundaryId:signal.boundaryId,invariantId:signal.invariantId,invariant:signal.expected,state:signal.state,authority:signal.authority,context:[signal.tenant,signal.surface,signal.operation].filter(Boolean).join(' / ')||'Supplied observations',reason:signal.observed+' Compared with '+signal.expected,supportingSignals:[signal.id],contradictingSignals:rejected.map(r=>r.explanation),evidenceRefs:[...signal.evidenceRefs],requiredEvidence:[signal.discriminatingTest],confirmEvidence:'Observed invariant failure persists under the matched discriminating control and independent grants are ruled out.',rejectEvidence:'Observed independent authority, permitted state change, or reconciled outcome explains the result.',alternativeExplanation:signal.alternativeExplanation,discriminatingTest:signal.discriminatingTest,unresolvedQuestions:[...unresolvedQuestions,signal.alternativeExplanation],validation,sourceType:'system',verified:false,priorityFactors:{boundaryImportance:signal.boundaryId?85:60,authoritySensitivity:85,stateSensitivity:80,evidenceStrength:Math.min(100,signal.evidenceRefs.length*30),scopeConfidence},status:'idea'});
    }
    return ResearchPriorityService.rank(candidates,{scopeConfidence});
  }
}
export class SelectiveStateSpaceService {
  static select({signals,observations=[],limit=8,scopeConfidence=50}){
    const plans=signals.map(signal=>({id:'test:'+signal.id,hypothesisId:'next:'+signal.id,signalId:signal.id,title:signal.discriminatingTest,actorId:signal.actorId,objectId:signal.objectId,boundaryId:signal.boundaryId,state:signal.state,authority:signal.authority,tenant:signal.tenant,surface:signal.surface,timing:signal.type==='aggregate_execution_contradiction'?'CONCURRENT':signal.type==='authority_state_contradiction'?'AFTER_REVOCATION':'CONTROLLED',role:observations.find(o=>o.actorId===signal.actorId)?.role||'Unknown',ownership:observations.find(o=>o.objectId===signal.objectId)?.ownerId||'Unknown',evidenceRefs:signal.evidenceRefs,expectedInformation:'Distinguish primary explanation from: '+signal.alternativeExplanation,priorityFactors:{authoritySensitivity:85,stateSensitivity:80,boundaryImportance:signal.boundaryId?85:60,scopeConfidence},manualOnly:true}));
    return ResearchPriorityService.rank(plans,{scopeConfidence}).slice(0,limit);
  }
}
