// MODULE: Test-only enabled provider. Not part of runtime configuration and never contacts cloud.
import {createApp} from '../server/app.js';
import {emptyAdvice} from './fixtures.js';
const response=emptyAdvice();
response.scopeAssessment={status:'within_supplied_scope',reason:'Fixture'};
response.confidence=.5;
response.safeNextSteps=['Review owned dummy evidence.'];
response.hypotheses=[{title:'AI draft owned capability hypothesis',invariant:'A used dummy approval must not replay.',expectedBehavior:'Replay rejected.',potentialFailure:'Hypothesis only.',technique:'Approval / Capability Context Confusion',who:'Member',what:'Approve',object:'Approval',state:'Used',authority:'Dummy capability',context:'Workspace B'}];
response.reportDraft='# Reviewed AI Report Draft\n\n## Ringkasan\n\nObserved dummy only. Researcher Estimate: Unknown.';
response.findingAnalysis={assessment:'Hypothesis',potentialClass:'Capability lifecycle',brokenInvariant:'Used capability cannot replay',potentialRootCause:'State binding hypothesis',falsePositiveChecks:['Review effective role.'],missingEvidence:['Record exact request.'],potentialImpact:'Unverified',duplicateRisk:'Unknown',safeValidation:['Use owned dummy data.']};
const knowledgeResponse={items:[{id:'mock-actor',kind:'actor',title:'Suggested Finance Actor',content:'Possible actor for owned lab accounts',sourceType:'ai',source:'Model fixture',confidence:.5,verified:false,notes:'Inference only',domainId:'finance',flowId:'finance-flow-1',invariantId:'',techniqueId:'tech_17',steps:[]},{id:'mock-company',kind:'company-overview',title:'Company Overview',content:'Unsupplied company details',sourceType:'ai',source:'Fixture',confidence:.5,verified:false,notes:'Inference only',domainId:'finance',flowId:'',invariantId:'',techniqueId:'',steps:[]}],suggestedDomains:[{id:'saas',reason:'Supplied lab model',sourceType:'ai',source:'Fixture',confidence:.5,verified:false,notes:'Review classification'}],unknownInformation:[]};
const app=await createApp({env:{AI_ENABLED:'true',AI_PROVIDER:'ollama',OLLAMA_MODEL:'mock-model',AI_PRIVACY_MODE:'LOCAL_ONLY'},providerFactory:()=>({async complete(request){return structuredClone(request.schema.properties.items?knowledgeResponse:response);}})});
await app.listen({host:'127.0.0.1',port:Number(process.env.QA_PORT)});
for(const signal of ['SIGTERM','SIGINT'])process.on(signal,async()=>{await app.close();process.exit(0);});
