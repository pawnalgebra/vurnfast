import test from 'node:test';
import assert from 'node:assert/strict';
import {authorizedTarget} from '../fixtures.js';
import {emptyResearchModel,NormalizedObservationService,validateResearchModel} from '../../client/js/services/research-model.js';
import {CausalResearchGraph,AuthorityTimeline} from '../../client/js/services/causal-research-graph.js';
import {ContradictionAnalyzer} from '../../client/js/services/contradiction-analyzer.js';
import {NextHypothesisService,AdversarialValidationService} from '../../client/js/services/next-hypothesis.js';
import {analyzeAdvancedResearch} from '../../client/js/services/advanced-research.js';
import {buildAgentContext} from '../../client/js/services/agent-context.js';
import {parseWorkspace} from '../../client/js/storage.js';
import {randomUUID} from 'node:crypto';
import {ResearchOrchestrator} from '../../server/services/research-orchestrator.js';
import {AgentToolAdapters} from '../../server/services/agent-tools.js';
import {MemoryAgentBudgetLedger} from '../../server/services/agent-budget.js';
import {resolveConfig} from '../../server/config.js';
import {agentStages,emptyAgentContent} from '../../client/js/services/agent-schema.js';
import {AgentResearchService,compactAgentResearch} from '../../client/js/services/agent-research.js';
import {ResearchContextBuilder} from '../../client/js/services/research-context-builder.js';
import {ResearchPriorityService} from '../../client/js/services/research-priority.js';
import {createApp} from '../../server/app.js';
function fixture(){
  const {store,target}=authorizedTarget();target.researchModel=emptyResearchModel();
  const actor=target.actors[0],object=target.objects[0],boundary=store.upsert(target.id,'boundaries',{from:'Owned authority',to:'Protected dummy object',channel:'API'});
  const raw=(label)=>store.upsert(target.id,'evidence',{label,content:'Dummy raw observation '+label});
  const event=(id,values={})=>{const e=raw(id),row={id,actorId:actor.id,objectId:object.id,boundaryId:boundary.id,operation:'export',state:'active',effectiveAuthority:'member',evidenceRefs:[e.id],provenance:{status:'OBSERVED',source:'evidence:'+e.id,confidence:1,evidenceRefs:[e.id]},...values};target.researchModel.events.push(row);return row;};
  const analyze=()=>{const graph=new CausalResearchGraph(target),result=ContradictionAnalyzer.analyze(graph);return {graph,...result,next:NextHypothesisService.generate({contradictions:result.signals,graph,scopeConfidence:100})};};
  return {store,target,actor,object,boundary,event,analyze,raw};
}
test('advanced: stable boundary/flow references and older critical evidence survive context selection',()=>{
  const f=fixture(),e=f.raw('old critical'),h=f.store.upsert(f.target.id,'hypotheses',{title:'Async export',queue:'Next',knowledgeLinks:{flowId:'export-flow',transitionId:'revoke-transition',invariantId:'export-invariant'}});
  const t=f.store.upsert(f.target.id,'testCases',{title:'Observed export',hypothesisId:h.id,boundaryId:f.boundary.id,evidenceIds:[e.id],result:'interesting'});
  for(let i=0;i<20;i++)f.raw('unrelated '+i);
  const c=buildAgentContext(f.store.get(),f.target);
  assert.equal(c.tests.find(r=>r.id===t.id).boundaryId,f.boundary.id);assert.equal(c.hypotheses.find(r=>r.id===h.id).knowledgeLinks.flowId,'export-flow');assert(c.evidence.some(r=>r.id===e.id));assert(c.knowledge.actors.every(a=>a.id));assert(c.contextManifest.omitted.length>0);
});
test('advanced: cross-tenant boundary, invariant candidate and grounded next hypothesis',()=>{
  const f=fixture(),e=f.event('access',{tenant:'B',authorityTenant:'A',operation:'read',outcome:'allowed'}),r=f.analyze();
  assert.equal(r.signals[0].type,'tenant_authority_contradiction');assert.equal(r.signals[0].boundaryId,f.boundary.id);assert(r.signals[0].invariantId);assert(r.next[0].reason.includes('tenant A'));assert.equal(r.next[0].actorId,f.actor.id);assert.deepEqual(r.next[0].evidenceRefs,e.evidenceRefs);assert.equal(r.signals[0].requiresValidation,true);assert.notEqual(r.signals[0].status,'CONFIRMED');
  e.authorityTenant='B';assert.equal(f.analyze().signals.length,0);
});
test('advanced: grant/queue/revoke/worker causal timeline, alternative and next discriminating test',()=>{
  const f=fixture();f.event('grant',{order:1,authorityAfter:'granted'});f.event('queue',{order:2,operation:'queue'});const revoke=f.event('revoke',{order:3,authorityAfter:'revoked'});const execution=f.event('worker',{order:4,outcome:'allowed'});const r=f.analyze();
  assert.equal(r.graph.timeline.authorityAt(execution).status,'revoked');assert.equal(r.graph.timeline.compare(revoke,execution),'BEFORE');assert.equal(r.signals[0].type,'authority_state_contradiction');assert(r.next[0].alternativeExplanation.includes('independent'));assert(r.next[0].discriminatingTest.includes('post-revocation'));assert.equal(r.next[0].evidenceRefs.length,2);assert.equal(r.next[0].validation.status,'NEEDS_TESTING');assert(r.graph.edges.every(e=>e.provenance));
  execution.independentAuthority='confirmed';f.target.researchModel.invariants.push({id:'independent',rule:'independent-job-authority',objectId:f.object.id,operation:'export',content:'Job has independent authorized grant',evidenceRefs:execution.evidenceRefs,provenance:{status:'RESEARCHER_CONFIRMED',source:'Owned lab policy',confidence:1,evidenceRefs:execution.evidenceRefs}});
  const benign=f.analyze();assert.equal(benign.signals.length,0);assert.equal(benign.explained[0].type,'independent_authority');
});
test('advanced: race evaluates distinct concurrent executions and aggregate business outcome',()=>{
  const f=fixture(),a=f.event('refund-a',{operation:'refund',operationId:'txn-a',amount:60,outcome:'allowed',concurrentWith:['refund-b']}),b=f.event('refund-b',{operation:'refund',operationId:'txn-b',amount:60,outcome:'allowed'});
  f.target.researchModel.invariants.push({id:'refund-limit',rule:'aggregate-limit',operation:'refund',objectId:f.object.id,maximum:100,content:'Total refund <= captured 100',evidenceRefs:a.evidenceRefs,provenance:a.provenance});
  const r=f.analyze();assert.equal(r.graph.timeline.compare(a,b),'CONCURRENT');assert.equal(r.signals[0].invariantId,'refund-limit');assert(r.signals[0].observed.includes('120'));assert(r.next[0].discriminatingTest.includes('ledger'));
  b.amount=40;assert.equal(f.analyze().signals.length,0);b.amount=60;b.operationId='txn-a';assert.equal(f.analyze().signals.length,0);
});
test('advanced: approval requires ordered version dependency and recognizes benign current approval',()=>{
  const f=fixture();f.event('approval',{order:1,operation:'approve',version:'v1'});f.event('modify',{order:2,operation:'modify',version:'v2'});const e=f.event('execute',{order:3,operation:'transfer',outcome:'allowed',version:'v2',approvedVersion:'v1',approvalEventId:'approval'});
  const r=f.analyze();assert.equal(r.signals[0].type,'approval_version_contradiction');assert.equal(r.signals[0].events.length,3);assert.equal(r.next[0].evidenceRefs.length,3);assert(r.next[0].discriminatingTest.includes('beneficiary'));
  e.approvedVersion='v2';assert.equal(f.analyze().signals.length,0);e.approvedVersion='v1';e.approvalEventId='missing';assert.equal(f.analyze().signals.length,0);
});
test('advanced: semantic cross-surface comparison matches operation and effective authority, avoids unmatched sessions',()=>{
  const f=fixture();const a=f.event('web',{operation:'read',role:'viewer',tenant:'A',state:'revoked',effectiveAuthority:'none',surface:'Web',outcome:'denied'}),b=f.event('api',{operation:'read',role:'viewer',tenant:'A',state:'revoked',effectiveAuthority:'none',surface:'API',outcome:'allowed'});
  f.target.researchModel.events=[];f.target.researchModel.observations=[a,b];const r=f.analyze();assert.equal(r.signals[0].type,'cross_surface_authority_contradiction');assert.equal(r.next[0].evidenceRefs.length,2);const diff=NormalizedObservationService.compare(a,b);assert(diff.sameOperation);assert(diff.changes.some(c=>c.dimension==='surface'));assert(diff.changes.some(c=>c.dimension==='business outcome'));
  b.effectiveAuthority='owner';assert.equal(f.analyze().signals.length,0);
});
test('advanced: unknown ordering and AI-inferred records never fabricate observed contradiction',()=>{
  const f=fixture();f.event('revoke',{authorityAfter:'revoked'});const e=f.event('worker',{outcome:'allowed'});assert.equal(f.analyze().signals.length,0);
  f.target.researchModel.events[0].order=1;e.order=2;e.provenance.status='AI_INFERRED';assert.equal(f.analyze().signals.length,0);
  e.actorId='invented-actor';assert.throws(()=>f.analyze(),/reference/);
  const timeline=new AuthorityTimeline([{id:'a',before:['b']},{id:'b',before:['a']}]);assert.equal(timeline.compare(timeline.events[0],timeline.events[1]),'UNKNOWN');
});
test('advanced: unresolved alternatives need observed controls, cache invalidates and model persists without touching raw evidence',()=>{
  const f=fixture();f.event('access',{tenant:'B',authorityTenant:'A',operation:'read',outcome:'allowed'});const a=analyzeAdvancedResearch(f.target),signal=a.signals[0],before=JSON.stringify(f.target.evidence);assert.equal(AdversarialValidationService.assess(signal,f.target.researchModel).status,'NEEDS_TESTING');
  const e=f.raw('matched-control');f.target.researchModel.observations.push({id:'control',discriminatesSignalId:signal.id,explanationOutcome:'primary',actorId:f.actor.id,objectId:f.object.id,operation:'read',expectedOutcome:'No grant: denied',actualOutcome:'No grant: owned B object returned',evidenceRefs:[e.id],provenance:{status:'OBSERVED',source:'evidence:'+e.id,confidence:1,evidenceRefs:[e.id]}});
  assert.equal(analyzeAdvancedResearch(f.target).hypotheses[0].validation.status,'READY_FOR_RESEARCHER_REVIEW');assert.equal(AdversarialValidationService.assess(signal,f.target.researchModel).status,'READY_FOR_RESEARCHER_REVIEW');assert.equal(parseWorkspace(JSON.stringify(f.store.get())).targets[0].researchModel.events.length,1);assert(f.target.evidence[0].content.includes('Dummy'));assert(before.length>0);
  f.target.researchModel.events[0].evidenceRefs=['not-found'];assert.throws(()=>validateResearchModel(f.target.researchModel,f.target),/evidence/);
});
const advancedEnv={AI_ENABLED:'true',AGENTIC_AI_ENABLED:'true',AI_PROVIDER:'ollama',OLLAMA_MODEL:'mock',AI_PRIVACY_MODE:'LOCAL_ONLY',AGENT_MAX_STEPS:'32',AGENT_RUN_BUDGET_USD:'5'};
const advancedOutput=extra=>({summary:'Synthetic analysis; no confirmation.',confidence:.8,notes:'Dummy lab.',proposals:[],actions:[],unknownInformation:[],...extra});
const advancedRun=f=>({runId:randomUUID(),context:buildAgentContext(f.store.get(),f.target),research:compactAgentResearch(f.target.agentResearch),inventory:f.store.get().toolInventory,privacyMode:'LOCAL_ONLY'});
test('advanced: unexpected evidence targets hypothesis re-analysis, review creates next test without extra AI calls',async()=>{
  const f=fixture(),ledger=new MemoryAgentBudgetLedger();let calls=0;
  const orchestrator=new ResearchOrchestrator({complete:async()=>{calls++;return advancedOutput();}},resolveConfig(advancedEnv),ledger,new AgentToolAdapters('dummy-secret'));
  f.target.agentResearch.completedStages=agentStages.map(s=>s[0]);f.event('access',{tenant:'B',authorityTenant:'A',operation:'read',outcome:'allowed'});
  const before=JSON.stringify(f.target.evidence),first=await orchestrator.run(advancedRun(f));assert.equal(first.state,'HYPOTHESIS_REANALYSIS');assert.deepEqual(first.completedStages,agentStages.slice(0,6).map(s=>s[0]));assert.equal(calls,0);assert.equal(ledger.rows.length,0);assert.equal(f.target.hypotheses.length,0);
  AgentResearchService.update(f.store,f.target,first);const hId=AgentResearchService.decide(f.store,f.target,first.reviewQueue[0].id,'ACCEPT');const h=f.target.hypotheses.find(h=>h.id===hId);assert(h.actorId);assert(h.objectId);assert(h.boundaryId);assert(h.signalId);assert(h.discriminatingTest);
  const second=await orchestrator.run(advancedRun(f));assert.equal(second.state,'TEST_PLANNED');assert.equal(calls,0);const plan=second.reviewQueue.find(p=>p.kind==='test-plan');assert.equal(plan.relatedHypothesisId,h.id);assert(plan.content.steps.includes('share'));
  AgentResearchService.update(f.store,f.target,second);const tId=AgentResearchService.decide(f.store,f.target,plan.id,'ACCEPT');const t=f.target.testCases.find(t=>t.id===tId);assert.equal(t.actorId,h.actorId);assert.equal(t.boundaryId,h.boundaryId);assert.equal(t.result,'not-tested');assert.equal(JSON.stringify(f.target.evidence),before);assert(parseWorkspace(JSON.stringify(f.store.get())));
});
test('advanced: multi-test grounding retains prerequisites and controls; unresolved alternatives block confirmation',async()=>{
  const f=fixture(),h=f.store.upsert(f.target.id,'hypotheses',{title:'Tenant boundary',invariant:'Tenant isolated',expectedBehavior:'Denied'}),a=f.store.upsert(f.target.id,'testCases',{title:'Boundary outcome',hypothesisId:h.id,result:'failed',actualResult:'Owned B object read by A',expectedResult:'Denied',steps:'Owned dummy tenant control',who:f.actor.name,object:f.object.name}),b=f.store.upsert(f.target.id,'testCases',{title:'Prerequisite share check',hypothesisId:h.id,result:'passed',actualResult:'No independent share exists',expectedResult:'No share',steps:'Inspect owned grants'});
  const event=f.event('access',{tenant:'B',authorityTenant:'A',operation:'read',outcome:'allowed',testId:a.id});f.store.upsert(f.target.id,'evidence',{id:event.evidenceRefs[0],testCaseId:a.id,evidenceRole:'OUTCOME'});const control=f.raw('prerequisite-control');f.store.upsert(f.target.id,'evidence',{id:control.id,testCaseId:b.id,evidenceRole:'CONTROL'});f.store.upsert(f.target.id,'testCases',{id:a.id,evidenceIds:event.evidenceRefs});f.store.upsert(f.target.id,'testCases',{id:b.id,evidenceIds:[control.id]});
  const orchestrator=new ResearchOrchestrator({complete:async()=>advancedOutput({proposals:[{kind:'potential-finding',title:'Dummy multi-test candidate',analysis:'Supplied observations',reason:'Boundary failure candidate',confidence:.8,notes:'Unverified',relatedTechniqueId:'',relatedToolId:'',relatedHypothesisId:h.id,relatedTestId:a.id,relatedFindingId:'',evidenceIds:[...event.evidenceRefs,control.id],content:{...emptyAgentContent(),startingAuthority:'Tenant A member',securityRestriction:'Tenant isolation',protectedResource:'Dummy tenant B object',impact:'Owned object observed'}}]})},resolveConfig(advancedEnv),new MemoryAgentBudgetLedger(),new AgentToolAdapters('dummy-secret'));
  const context=buildAgentContext(f.store.get(),f.target),reply=await orchestrator.message({runId:randomUUID(),context,message:{agent:'finding',text:'Analyze'},inventory:f.store.get().toolInventory,privacyMode:'LOCAL_ONLY',memory:{},researchState:{}}),p=reply.proposals[0];
  assert.deepEqual(new Set(p.testIds),new Set([a.id,b.id]));assert.equal(p.evidenceIds.length,2);assert(p.evidenceLinks.some(l=>l.role==='CONTROL'));assert.equal(p.validationStatus,'NEEDS_TESTING');assert.equal(p.observationSnapshot.tests.length,2);
  p.analysisCompleted=true;const research=structuredClone(f.target.agentResearch);research.reviewQueue.push(p);AgentResearchService.update(f.store,f.target,research);assert.throws(()=>AgentResearchService.decide(f.store,f.target,p.id,'CONFIRM_FINDING'),/NEEDS_TESTING/);assert.equal(f.target.findings.length,0);
  const id=AgentResearchService.decide(f.store,f.target,p.id,'ACCEPT'),finding=f.target.findings.find(row=>row.id===id);assert.equal(finding.status,'draft');assert.equal(finding.validationStatus,'NEEDS_TESTING');assert.equal(finding.testIds.length,2);assert.equal(finding.evidenceIds.length,2);assert(parseWorkspace(JSON.stringify(f.store.get())));
});
test('advanced: observed controls enable manual review, contradicted alternative explains signal and rejected signals remain suppressed',()=>{
  const f=fixture();f.event('access',{tenant:'B',authorityTenant:'A',operation:'read',outcome:'allowed'});const signal=f.analyze().signals[0],e=f.raw('discriminating result');
  const control={id:'validation',actorId:f.actor.id,objectId:f.object.id,operation:'read',discriminatesSignalId:signal.id,explanationOutcome:'primary',expectedOutcome:'No independent grant: denied',actualOutcome:'No grant: owned object returned',evidenceRefs:[e.id],provenance:{status:'OBSERVED',source:'Owned control',confidence:1,evidenceRefs:[e.id]}};f.target.researchModel.observations.push(control);
  assert.equal(f.analyze().next[0].validation.status,'READY_FOR_RESEARCHER_REVIEW');control.explanationOutcome='alternative';assert.equal(f.analyze().next.length,0);assert.equal(AdversarialValidationService.assess(signal,f.target.researchModel).status,'EXPLAINED');
  f.target.researchModel.signalDecisions.push({signalId:signal.id,status:'REJECTED',reason:'Researcher verified valid cross-tenant grant'});assert.equal(f.analyze().signals.length,0);assert.equal(f.analyze().explained.length,1);
});
test('advanced: raw evidence edits invalidate normalized inference; deleted references remain importable',()=>{
  const f=fixture(),event=f.event('access',{tenant:'B',authorityTenant:'A',operation:'read',outcome:'allowed'});f.store.updateResearchModel(f.target.id,f.target.researchModel);assert.equal(f.analyze().signals.length,1);
  f.store.upsert(f.target.id,'evidence',{id:event.evidenceRefs[0],content:'Corrected: request was denied'});assert.equal(f.analyze().signals.length,0);f.store.remove(f.target.id,'evidence',event.evidenceRefs[0]);assert.equal(f.target.researchModel.events[0].provenance.status,'UNKNOWN');f.store.remove(f.target.id,'actors',f.actor.id);assert(parseWorkspace(JSON.stringify(f.store.get())));
});
test('advanced: chat carries relevant normalized relationships and API validates advanced context without AI facts',async()=>{
  const f=fixture(),event=f.event('access',{tenant:'B',authorityTenant:'A',operation:'read',outcome:'allowed'}),selected=new ResearchContextBuilder().build({workspace:f.store.get(),target:f.target,page:'dashboard',contextRefs:[{kind:'evidence',id:event.evidenceRefs[0]}],message:'Analyze tenant authority'});assert.equal(selected.context.researchModel.events.length,1);assert(selected.context.knowledge.actors.some(a=>a.id===f.actor.id));
  let calls=0;const app=await createApp({env:advancedEnv,agentLedger:new MemoryAgentBudgetLedger(),providerFactory:()=>({complete:async()=>{calls++;return advancedOutput();}})});
  try{const token=(await app.inject('/api/config')).json().requestToken,response=await app.inject({method:'POST',url:'/api/agent/run',headers:{'x-workspace-token':token},payload:advancedRun(f)});assert.equal(response.statusCode,200,response.body);assert.equal(response.json().research.state,'HYPOTHESIS_REANALYSIS');assert.equal(calls,0);
    const broken=advancedRun(f);broken.context.researchModel.events[0].actorId='unsupported';const denied=await app.inject({method:'POST',url:'/api/agent/run',headers:{'x-workspace-token':token},payload:broken});assert.equal(denied.statusCode,400);
  }finally{await app.close();}
});
test('advanced: priority and information gain rank risky boundaries; scope remains a hard gate',()=>{
  const ranked=ResearchPriorityService.rank([{id:'weak',evidenceRefs:[],priority:'low'},{id:'strong',boundaryId:'boundary',authority:'revoked',state:'executed',priority:'high',evidenceRefs:['a','b'],priorityFactors:{businessCriticality:90}}],{scopeConfidence:100});assert.equal(ranked[0].id,'strong');assert(ranked[0].researchRanking.score>ranked[1].researchRanking.score);
  const f=fixture();f.event('access',{tenant:'B',authorityTenant:'A',operation:'read',outcome:'allowed'});f.store.updateTarget(f.target.id,{scope:{inScope:'other.test',guard:{inScope:false,account:true,data:true}}});const result=analyzeAdvancedResearch(f.target);assert.equal(result.signals.length,1);assert.equal(result.hypotheses.length,0);assert.equal(result.nextTests.length,0);
});
test('advanced: explicit causal ordering works, inferred authority cannot override observed revocation, subgraphs stay bounded',()=>{
  const f=fixture(),revoke=f.event('revoke',{authorityAfter:'revoked'}),worker=f.event('worker',{outcome:'allowed'});
  f.target.researchModel.relations.push({type:'PRECEDES',from:'event:'+revoke.id,to:'event:'+worker.id,provenance:revoke.provenance});const r=f.analyze();assert.equal(r.signals[0].type,'authority_state_contradiction');assert.equal(r.graph.timeline.compare(revoke,worker),'BEFORE');
  const sub=r.graph.relevantSubgraph([...r.graph.nodes.values()].map(n=>n.referenceId),{maxNodes:3,maxEdges:2});assert(sub.nodes.length<=3);assert(sub.edges.length<=2);assert(sub.nodes.every(n=>n.id.includes(':')));assert(sub.omittedNodes>0);
  revoke.order=1;worker.order=3;f.event('inferred-grant',{order:2,authorityAfter:'granted',evidenceRefs:worker.evidenceRefs,provenance:{status:'AI_INFERRED',source:'Model suggestion',confidence:1,evidenceRefs:worker.evidenceRefs}});assert.equal(f.analyze().signals[0].type,'authority_state_contradiction');
});
test('advanced: explicit insufficient role generates an authority signal; effective grant is a benign variant',()=>{
  const f=fixture(),event=f.event('owner-operation',{role:'viewer',requiredRole:'owner',effectiveAuthority:'insufficient',outcome:'allowed'});assert.equal(f.analyze().signals[0].type,'role_authority_contradiction');event.effectiveAuthority='granted-capability';assert.equal(f.analyze().signals.length,0);
});
test('advanced: native evidence comparator returns semantic authorization/surface differences without model calls',async()=>{
  const f=fixture(),left=f.event('web',{operation:'read',role:'viewer',effectiveAuthority:'none',surface:'Web',outcome:'denied'}),right=f.event('api',{operation:'read',role:'viewer',effectiveAuthority:'none',surface:'API',outcome:'allowed'});f.target.researchModel.events=[];f.target.researchModel.observations=[left,right];
  const adapters=new AgentToolAdapters('dummy'),result=await adapters.execute({adapter:'evidence-compare',input:{leftEvidenceId:left.evidenceRefs[0],rightEvidenceId:right.evidenceRefs[0]}},buildAgentContext(f.store.get(),f.target)),compared=JSON.parse(result.result);assert(compared.semantic.sameOperation);assert(compared.semantic.changes.some(c=>c.field==='surface'));assert(compared.semantic.changes.some(c=>c.field==='outcome'));assert.equal(compared.targetObservation,false);assert.equal(compared.sourceType,'local-derived');
});
