import {AI_RESPONSE_SCHEMA,validateAIOutput} from './ai-schema.js';
import {policyFor} from './rules.js';
import {coverageAnalysis} from './analysis.js';
import {HELPER_KB} from '../knowledge-data.js';
// Compatibility for former advisor operations that only inspect supplied records/rules.
export const localAdviceOperations=['analyze_scope','identify_restrictions','recommend_helpers','gap_analysis'];
export function localAdvice(context){
  if(!localAdviceOperations.includes(context.operation))return null;
  const defaults=schema=>schema.type==='object'?Object.fromEntries(Object.entries(schema.properties).map(([key,value])=>[key,defaults(value)])):schema.type==='array'?[]:schema.type==='number'?0:schema.enum?(schema.enum.includes('Unknown')?'Unknown':schema.enum[0]):'';
  const output=defaults(AI_RESPONSE_SCHEMA),policy=policyFor(context);
  output.scopeAssessment=policy.assessment;output.rules=policy.restrictions;output.researchPriority.scopeConfidence=policy.canRecommend?100:0;
  output.researchPriority.reason='Local checks on supplied records, not vulnerability severity or verified authorization.';
  output.missingContext=['Target rules and observations remain researcher supplied; local checks do not verify external policy.'];
  output.stopConditions=['Stop manual testing if scope, effective authority or data ownership becomes unclear.'];
  output.safeNextSteps=[policy.canRecommend?'Choose a matched manual control; record actual results and evidence.':'Review scope, testing accounts and owned data before testing.'];
  if(context.operation==='recommend_helpers'){
    const relevant=new Set(['authorization-matrix','state-transition','scope-checker']);
    if(context.evidence?.length)relevant.add('evidence-comparator');
    if(context.finding||context.findings?.length){relevant.add('finding-checklist');relevant.add('duplicate-comparator');}
    output.helperSuggestions=HELPER_KB.filter(h=>relevant.has(h.id)).map(({id,name,purpose})=>({id,name,purpose}));
  }
  if(context.operation==='gap_analysis'){
    const result=coverageAnalysis({actors:context.actors,objects:context.objects,boundaries:context.boundaries,techniques:context.techniques.map(t=>({...t,enabled:true})),hypotheses:context.hypotheses,testCases:context.tests});
    output.gapAnalysis=result.coverage.map(g=>g.label+': '+g.covered+'/'+g.total+' recorded; untested: '+(g.untested.join(', ')||'none mapped')).slice(0,10);
    output.missingContext.push('Recorded coverage is not evidence that every state/context combination is secure.');
  }
  return validateAIOutput(output);
}
