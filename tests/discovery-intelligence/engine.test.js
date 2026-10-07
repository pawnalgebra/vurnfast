import test from 'node:test';
import assert from 'node:assert/strict';
import {writeFileSync,mkdirSync} from 'node:fs';
import {scenarioCases,blindScenario} from './scenarios.js';
import {analyzeAdvancedResearch} from '../../client/js/services/advanced-research.js';
import {CausalResearchGraph} from '../../client/js/services/causal-research-graph.js';
import {GeneralChainDiscoveryService,TargetConstraintService,ObservationExtractionService,LogicalOperationMatcher,FailedPathMemory,ResearchResultCache,ModelRouting} from '../../client/js/services/discovery-intelligence.js';
import {ResearchContextBuilder} from '../../client/js/services/research-context-builder.js';
import {parseMessageTags} from '../../client/js/services/agent-messages.js';
import {buildAgentContext} from '../../client/js/services/agent-context.js';
import {ResearchOrchestrator} from '../../server/services/research-orchestrator.js';
import {resolveConfig} from '../../server/config.js';
import {MemoryAgentBudgetLedger} from '../../server/services/agent-budget.js';
import {AgentToolAdapters} from '../../server/services/agent-tools.js';
import {emptyAgentResearch} from '../../client/js/services/agent-schema.js';
import {randomUUID} from 'node:crypto';
import {createApp} from '../../server/app.js';
const totals={expectedRelations:0,foundRelations:0,returnedRelations:0,relevantHypotheses:0,hypotheses:0,benign:0,benignCorrect:0,missing:0,unknownCorrect:0,grounded:0,groundable:0,qualityTests:0,testCases:0,chains:0,unsupportedClaims:0,outputs:0},results=[];
for(let i=0;i<scenarioCases.length;i++)test('blind '+String(i+1).padStart(2,'0')+': structural discovery, benign and missing controls',()=>{
  const variants=[];
  for(const variant of ['suspicious','benign','missing']){
    const {target,evaluator}=blindScenario(i,variant),result=analyzeAdvancedResearch(target).discovery,evaluation=result.evaluations.find(e=>e.constraintId===evaluator.constraintId);
    assert.equal(evaluation.status,evaluator.expectedStatus,evaluator.name+' '+variant);
    assert.equal(result.confirmed,false);assert(result.relationships.every(r=>r.confirmed===false&&r.requiresValidation));
    const supported=result.relationships.filter(r=>r.status==='VIOLATED');
    totals.outputs++;totals.unsupportedClaims+=result.relationships.filter(r=>r.confirmed||r.confidence>.8).length;
    if(variant==='suspicious'){
      totals.expectedRelations++;totals.returnedRelations+=supported.length;
      const relation=supported.find(r=>r.constraintRefs.includes(evaluator.constraintId)&&result.evaluations.find(e=>e.constraintId===r.constraintRefs[0]).eventIds.includes(evaluator.terminal));
      assert(relation,'Expected terminal/constraint relation missing');totals.foundRelations++;
      const chain=result.chains.find(c=>c.id===relation.chainId);assert(chain&&chain.edges.length>=2&&chain.edges.length<=8);assert(chain.nodes.includes('event:'+evaluator.terminal));totals.chains++;
      assert(result.unknowns.some(q=>q.relatedChain===chain.id&&q.possibleAnswers.includes('UNKNOWN')&&q.evidenceNeeded.length));
      const hypotheses=result.hypotheses.filter(h=>h.relationshipId===relation.id);assert.equal(hypotheses.length,4);assert(hypotheses.some(h=>h.family===evaluator.hypothesisFamily));
      totals.hypotheses+=hypotheses.length;totals.relevantHypotheses+=hypotheses.filter(h=>h.requiredEvidence.length&&h.unknowns.length&&h.status==='UNVERIFIED').length;
      totals.groundable++;if(relation.evidenceRefs.length&&relation.evidenceRefs.every(id=>target.evidence.some(e=>e.id===id)))totals.grounded++;
      const best=result.nextTests[0];assert(best&&evaluator.nextTestProperties.every(p=>best.properties.includes(p)));assert.equal(Object.keys(best.expectedOutcomes).length,4);assert(best.score>result.nextTests.find(t=>t.properties.includes('repeat')).score);totals.testCases++;totals.qualityTests++;
    }else if(variant==='benign'){totals.benign++;assert.equal(supported.length,0);totals.benignCorrect++;}
    else{totals.missing++;assert.equal(supported.length,0);assert(result.unknowns.length);totals.unknownCorrect++;}
    variants.push({variant,status:evaluation.status,relationships:result.relationships.length,chains:result.chains.length});
  }
  results.push({scenario:i+1,name:scenarioCases[i][0],variants});
});
test('discovery: provenance, extraction review, no guessed identifiers and stale raw guard',()=>{
  const {target}=blindScenario(0);const c=target.researchModel.constraints[0];assert.throws(()=>TargetConstraintService.validate({...c,sourceType:'AI_INFERRED'},target));
  const raw={id:'raw',content:'{"operation":"export","surface":"api"}'};target.evidence.push(raw);const p=ObservationExtractionService.propose(raw);assert.equal(p.status,'PROPOSED');assert.equal(p.observation.actorId,undefined);assert(p.fieldProvenance.every(f=>!f.confirmed));assert.throws(()=>ObservationExtractionService.confirm(p,target));assert.equal(ObservationExtractionService.confirm(p,target,{reviewed:true}).provenance.status,'RESEARCHER_CONFIRMED');raw.content+=' ';assert.throws(()=>ObservationExtractionService.confirm(p,target,{reviewed:true}));
});
test('discovery: logical business equivalence does not use URL similarity',()=>{
  const a={actorId:'a',objectId:'o',operationIntent:'export',stateBefore:'active',stateAfter:'exported',expectedOutcome:'owner export',requiredRole:'owner',surface:'web',operation:'POST /a',outcome:'denied'},b={...a,surface:'api',operation:'exportWorkspace()',outcome:'allowed'};
  assert.equal(LogicalOperationMatcher.compare(a,b).differential,true);assert.equal(LogicalOperationMatcher.compare(a,{...b,objectId:'other'}).equivalent,false);assert.equal(LogicalOperationMatcher.compare(a,{...b,operationIntent:undefined}).status,'UNKNOWN');
});
test('discovery: bounded search, structural evidence merge and failed path reopening',()=>{
  const {target}=blindScenario(1),graph=new CausalResearchGraph(target),result=analyzeAdvancedResearch(target).discovery;
  assert(GeneralChainDiscoveryService.discover(graph,{maxExpansions:5}).search.bounded);assert(new Set(result.chains.map(c=>c.id)).size===result.chains.length);
  const relation=result.relationships[0];target.researchModel.failedPaths=[FailedPathMemory.record(relation,target,'EXPLAINED','Reviewed exception')];assert.equal(analyzeAdvancedResearch(target).discovery.relationships.length,0);
  target.evidence.find(e=>e.id===relation.evidenceRefs[0]).content+=' new captured state';const reopened=analyzeAdvancedResearch(target).discovery.relationships[0];assert(reopened.memory.reopened&&reopened.memory.reason);
});
test('discovery: cache dependency invalidation and capability tier routing',()=>{
  const cache=new ResearchResultCache(2),key={targetRevision:1,researchRevision:2,context:{evidence:'a',constraint:'a'},operation:'analysis',tier:'CHEAP'};cache.set(key,{answer:1});assert.equal(cache.get(key).answer,1);assert.equal(cache.get({...key,context:{evidence:'b',constraint:'a'}}),undefined);assert.equal(cache.get({...key,context:{evidence:'a',constraint:'b'}}),undefined);
  assert.equal(ModelRouting.select({operation:'lookup',competing:5},{REASONING:'configured'}).tier,'DETERMINISTIC');assert.equal(ModelRouting.select({operation:'interpretation',chainHops:6},{REASONING:'configured'}).model,'configured');assert.equal(ModelRouting.select({operation:'interpretation',cheapConfidence:.4}).tier,'REASONING');
});
test('discovery: explicit chain retrieves old dependencies and reports overflow',()=>{
  const {store,target}=blindScenario(1),discovery=analyzeAdvancedResearch(target).discovery,chain=discovery.chains.find(c=>c.nodes.includes('event:record-a')&&c.nodes.includes('event:record-c'));
  for(let i=0;i<30;i++)store.upsert(target.id,'evidence',{label:'noise '+i,content:'unrelated'});
  const refs=[{kind:'chain',id:chain.id}],parsed=parseMessageTags('@hypothesis review #chain:'+chain.id,target);assert.deepEqual(parsed.contextRefs,refs);
  const {context}=new ResearchContextBuilder().build({workspace:store.get(),target,page:'dashboard',contextRefs:refs,message:'Review this path'});
  assert(chain.evidenceRefs.every(id=>context.evidence.some(e=>e.id===id)));assert(context.advancedResearch.discovery.chains.some(c=>c.id===chain.id));assert(Array.isArray(context.contextManifest.omittedCriticalDependencies));
});
test('discovery: critical evidence overflow caps conclusions and references stay target-local',()=>{
  const {store,target}=blindScenario(0),original=target.researchModel.events.find(e=>e.id==='record-c');
  for(let i=0;i<18;i++){const raw=store.upsert(target.id,'evidence',{label:'related '+i,content:'Structured repeat '+i});target.researchModel.events.push({...structuredClone(original),id:'extra-'+i,order:4+i,evidenceRefs:[raw.id],provenance:{status:'OBSERVED',source:raw.id,confidence:1,evidenceRefs:[raw.id]}});}
  const discovery=analyzeAdvancedResearch(target).discovery,signal=discovery.relationships[0],refs=[{kind:'signal',id:signal.id}];
  const {context}=new ResearchContextBuilder().build({workspace:store.get(),target,page:'dashboard',contextRefs:refs,message:'Review selected relationship'});
  assert(context.contextManifest.omittedCriticalDependencies.length>0);assert(context.advancedResearch.conclusionLimit);assert(context.advancedResearch.discovery.relationships.every(r=>r.confidence<=.35));
  assert.throws(()=>parseMessageTags('#chain:CHAIN-wrong-target',target));
  assert.equal(ObservationExtractionService.propose(target.evidence[0],{actorId:'invented'}).observation.actorId,undefined);
});
test('discovery: orchestrator proposes reviewed constraint research without a provider call',async()=>{
  const {store,target}=blindScenario(0),config=resolveConfig({AI_ENABLED:'true',AGENTIC_AI_ENABLED:'true',AI_PROVIDER:'ollama',OLLAMA_MODEL:'mock',AGENT_MAX_STEPS:'32',AGENT_RUN_BUDGET_USD:'5'});
  let calls=0;const provider={complete:async()=>{calls++;throw new Error('Unexpected provider call');}},orchestrator=new ResearchOrchestrator(provider,config,new MemoryAgentBudgetLedger(),new AgentToolAdapters());
  const result=await orchestrator.run({runId:randomUUID(),context:buildAgentContext(store.get(),target),research:emptyAgentResearch(),inventory:[],privacyMode:'LOCAL_ONLY'});
  assert.equal(calls,0);assert.equal(result.state,'HYPOTHESIS_REANALYSIS');assert(result.reviewQueue.some(p=>p.signalId?.startsWith('SIGNAL-')&&p.kind==='hypothesis'&&!p.verified));assert.equal(target.findings.length,0);
});
test('discovery: API accepts selected discovery references and rejects invented ones',async()=>{
  const {store,target}=blindScenario(0),signal=analyzeAdvancedResearch(target).discovery.relationships[0],refs=[{kind:'signal',id:signal.id}],selected=new ResearchContextBuilder().build({workspace:store.get(),target,page:'dashboard',contextRefs:refs,message:'Review this relationship'});
  let calls=0;const app=await createApp({env:{AI_ENABLED:'true',AGENTIC_AI_ENABLED:'true',AI_PROVIDER:'ollama',OLLAMA_MODEL:'mock'},agentLedger:new MemoryAgentBudgetLedger(),providerFactory:()=>({complete:async()=>{calls++;return {summary:'Review required',confidence:.5,notes:'Unverified interpretation',proposals:[],actions:[],unknownInformation:['Authority source is unknown']};}})});
  try{const token=(await app.inject('/api/config')).json().requestToken,payload={runId:randomUUID(),...selected,inventory:[],privacyMode:'LOCAL_ONLY',message:{text:'Review selected relationship',agent:'hypothesis',contextRefs:refs,tags:[]}};
    const response=await app.inject({method:'POST',url:'/api/agent/message',headers:{'x-workspace-token':token},payload});assert.equal(response.statusCode,200,response.body);assert.equal(calls,1);
    payload.runId=randomUUID();payload.message.contextRefs=[{kind:'chain',id:'CHAIN-invented'}];const rejected=await app.inject({method:'POST',url:'/api/agent/message',headers:{'x-workspace-token':token},payload});assert.equal(rejected.statusCode,400);assert.equal(calls,1);
  }finally{await app.close();}
});
test('discovery: write structural benchmark metrics',()=>{
  const ratio=(n,d)=>d?n/d:0,metrics={relationshipRecall:ratio(totals.foundRelations,totals.expectedRelations),relationshipPrecision:ratio(totals.foundRelations,totals.returnedRelations),hypothesisRelevance:ratio(totals.relevantHypotheses,totals.hypotheses),falsePositiveRate:ratio(totals.benign-totals.benignCorrect,totals.benign),benignControlAccuracy:ratio(totals.benignCorrect,totals.benign),unknownRecognition:ratio(totals.unknownCorrect,totals.missing),evidenceGrounding:ratio(totals.grounded,totals.groundable),nextTestQuality:ratio(totals.qualityTests,totals.testCases),chainDiscoveryRate:ratio(totals.chains,totals.expectedRelations),unsupportedClaimRate:ratio(totals.unsupportedClaims,totals.outputs)};
  mkdirSync('tests/discovery-intelligence/results',{recursive:true});writeFileSync('tests/discovery-intelligence/results/deterministic.json',JSON.stringify({scenarios:scenarioCases.length,variants:scenarioCases.length*3,method:'Structural relationship IDs, constraint applicability, supported evidence, chain hops and discriminating test dimensions; labels evaluator-only',totals,metrics,results},null,2));console.log('Discovery metrics',JSON.stringify(metrics));assert.equal(results.length,22);
});
