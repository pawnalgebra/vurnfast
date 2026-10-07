import test from 'node:test';
import assert from 'node:assert/strict';
import {randomUUID} from 'node:crypto';
import {mkdtemp,rm,writeFile} from 'node:fs/promises';
import {join,resolve} from 'node:path';
import {createStore} from '../client/js/store.js';
import {parseWorkspace} from '../client/js/storage.js';
import {agentStages,emptyAgentContent,builtinTools,validateAgentResponse} from '../client/js/services/agent-schema.js';
import {AgentResearchService,compactAgentResearch,mergeAgentResearch} from '../client/js/services/agent-research.js';
import {TargetIntelligenceService} from '../client/js/services/domain-knowledge.js';
import {buildAgentContext} from '../client/js/services/agent-context.js';
import {ResearchOrchestrator} from '../server/services/research-orchestrator.js';
import {AgentToolAdapters,evaluateAgentAction} from '../server/services/agent-tools.js';
import {MemoryAgentBudgetLedger,AgentBudgetLedger} from '../server/services/agent-budget.js';
import {resolveConfig} from '../server/config.js';
import {createApp} from '../server/app.js';
export const agentOutput=(values={})=>({summary:'Supplied context reviewed; no company fact or vulnerability confirmed.',confidence:.8,notes:'Unverified analysis only.',proposals:[],actions:[],unknownInformation:[],...values});
export const agentProposal=(kind,values={})=>({kind,title:'Reviewed candidate '+kind,analysis:'AI inference for owned dummy lab.',reason:'Needs researcher review.',confidence:.6,notes:'Inference; no target actions.',relatedTechniqueId:'tech_03',relatedToolId:'',relatedHypothesisId:'',relatedTestId:'',relatedFindingId:'',evidenceIds:[],content:emptyAgentContent(),...values});
export const localJSONAction=()=>({adapter:'json-parse',toolId:'builtin-json',goal:'Parse dummy JSON',reason:'Understand supplied data only.',input:{query:'',json:'{"owned":true}',leftEvidenceId:'',rightEvidenceId:'',url:''},risk:'low',expectedResult:'Parsed local JSON',stopConditions:['Invalid JSON','Sensitive data']});
export function agentSetup(){
  const store=createStore(),target=store.addTarget({name:'Example Agent Lab',asset:'lab.example.test'});
  store.updateTarget(target.id,{scope:{inScope:'lab.example.test',outOfScope:'third-party.example.test',guard:{inScope:true,account:true,data:true}},programRules:{automationAllowed:false,dosAllowed:false,thirdPartyTesting:false}});
  TargetIntelligenceService.update(store,target,{primaryDomainId:'saas'});
  return {store,target};
}
function orchestration(provider,env={},ledger=new MemoryAgentBudgetLedger()){
  const config=resolveConfig({AI_ENABLED:'true',AGENTIC_AI_ENABLED:'true',AI_PROVIDER:'ollama',OLLAMA_MODEL:'mock',...env});
  return {orchestrator:new ResearchOrchestrator(provider,config,ledger,new AgentToolAdapters('test-secret')),config,ledger};
}
function runInput(store,target){return {runId:randomUUID(),context:buildAgentContext(store.get(),target),research:compactAgentResearch(target.agentResearch),inventory:store.get().toolInventory,privacyMode:'LOCAL_ONLY'};}
test('four flag combinations preserve copilot/manual mode and never initialize disabled AI',async()=>{
  for(const ai of [false,true])for(const agentic of [false,true]){
    let calls=0;const app=await createApp({env:{AI_ENABLED:String(ai),AGENTIC_AI_ENABLED:String(agentic),AI_PROVIDER:'ollama',OLLAMA_MODEL:'mock'},providerFactory:()=>{calls++;return {complete:async()=>agentOutput()};},agentLedger:new MemoryAgentBudgetLedger()});
    try{const safe=(await app.inject('/api/config')).json();assert.equal(safe.agentic.enabled,ai&&agentic);assert.equal(calls,ai?1:0);const {store,target}=agentSetup();const token=safe.requestToken;const response=await app.inject({method:'POST',url:'/api/agent/run',headers:{'x-workspace-token':token},payload:runInput(store,target)});assert.equal(response.statusCode,ai&&agentic?200:503);assert.equal((await app.inject('/')).statusCode,200);}finally{await app.close();}
  }
});
test('orchestrator selects specialists sequentially and stops at proposals without canonical mutations',async()=>{
  const {store,target}=agentSetup(),before=JSON.stringify(target.actors),seen=[];
  const provider={complete:async request=>{const id=JSON.parse(request.prompt).agentId;seen.push(id);if(id==='target-intelligence'){assert.deepEqual(request.schema.properties.proposals.items.properties.kind.enum,['knowledge','scope-question','uncertain-analysis']);assert.ok(!request.schema.properties.proposals.items.properties.kind.enum.includes('question'));}return agentOutput(id==='attack-surface'?{proposals:[agentProposal('actor',{content:{...emptyAgentContent(),name:'Owned Member',authority:'Own lab only'}})]}:{});}};
  const {orchestrator}=orchestration(provider),result=await orchestrator.run(runInput(store,target));
  assert.deepEqual(seen,['target-intelligence','domain-knowledge','scope','attack-surface']);assert.equal(result.state,'WAITING_REVIEW');assert.equal(JSON.stringify(target.actors),before);assert.equal(result.reviewQueue[0].sourceType,'ai');assert.equal(result.reviewQueue[0].verified,false);
  AgentResearchService.update(store,target,result);AgentResearchService.decide(store,target,result.reviewQueue[0].id,'EDIT',{name:'Researcher Edited Member',title:'Reviewed member',notes:'Reviewed with lab owner'});
  assert.equal(target.actors[0].name,'Researcher Edited Member');assert.equal(target.agentResearch.reviewQueue[0].status,'EDITED');assert.equal(target.actors[0].knowledgeProvenance.verified,false);
  const roundTrip=JSON.stringify(store.get());assert.equal(JSON.stringify(parseWorkspace(roundTrip)),roundTrip);
});
test('research loop stops for manual testing, scoped review, step caps and budget limits',async()=>{
  const {store,target}=agentSetup();store.upsert(target.id,'hypotheses',{title:'Owned lifecycle hypothesis',invariant:'Removed member must lose authority',expectedBehavior:'Denied',status:'idea'});
  const {orchestrator}=orchestration({complete:async()=>agentOutput()});let result=await orchestrator.run(runInput(store,target));assert.equal(result.state,'TESTING');assert.equal(result.runs.at(-1).steps,8);
  store.updateTarget(target.id,{scope:{...target.scope,inScope:'different.example.test'}});const blocked=await orchestrator.run(runInput(store,target));assert.equal(blocked.state,'WAITING_REVIEW');assert.equal(blocked.runs.at(-1).steps,0);
  const fresh=agentSetup(),limited=orchestration({complete:async()=>agentOutput()},{AGENT_MAX_STEPS:'1',AGENT_DAILY_BUDGET_USD:'0.03'});
  result=await limited.orchestrator.run(runInput(fresh.store,fresh.target));assert.match(result.reason,/Maximum steps/);AgentResearchService.update(fresh.store,fresh.target,result);
  result=await limited.orchestrator.run(runInput(fresh.store,fresh.target));assert.match(result.reason,/Budget Limit/);assert.equal(result.runs.at(-1).steps,0);
});
test('budget reservations survive a ledger restart; corrupt/missing access cannot increase calls',async()=>{
  const root=resolve('.qa'),directory=await mkdtemp(join(root,'budget-test-'));
  try{const path=join(directory,'ledger.json'),first=new AgentBudgetLedger(path),runId=randomUUID();assert.ok(await first.reserve(runId,.03,.25,.03));const restarted=new AgentBudgetLedger(path);assert.equal(await restarted.spentToday(),.03);assert.equal(await restarted.reserve(randomUUID(),.03,.25,.03),null);await writeFile(path,'{invalid ledger');await assert.rejects(()=>new AgentBudgetLedger(path).reserve(randomUUID(),.03,.25,2),/unavailable/);}
  finally{assert.ok(resolve(directory).startsWith(root+'\\')||resolve(directory).startsWith(root+'/'));await rm(directory,{recursive:true,force:true});}
});
test('manual corrections outrank inference, invalidate proposals and selected context excludes other targets/config',async()=>{
  const {store,target}=agentSetup();store.addTarget({name:'DO_NOT_SEND_OTHER_TARGET'});target.privateApiKey='DO_NOT_SEND_CONFIG';
  AgentResearchService.addManual(store,target,{type:'Correction',title:'Worker does not use old membership',content:'Use observed authorization at execution, not AI assumption.',replanFrom:'hypothesis'});
  let sent;const {orchestrator}=orchestration({complete:async request=>{sent=request.prompt;return agentOutput(JSON.parse(request.prompt).agentId==='hypothesis'?{proposals:[agentProposal('hypothesis',{content:{...emptyAgentContent(),invariant:'Owned invariant',expectedBehavior:'Denied'}})]}:{});}});
  const result=await orchestrator.run(runInput(store,target));assert.ok(sent.includes('Worker does not use old membership'));assert.ok(sent.includes('Researcher analysis/corrections outrank AI inference'));assert.ok(!sent.includes('DO_NOT_SEND_OTHER_TARGET')&&!sent.includes('DO_NOT_SEND_CONFIG'));assert.equal(result.state,'WAITING_REVIEW');
  AgentResearchService.update(store,target,result);AgentResearchService.addManual(store,target,{type:'Assessment',title:'Need another control',content:'Compare owned actor only',replanFrom:'hypothesis'});assert.ok(target.agentResearch.reviewQueue.every(p=>p.stale));assert.throws(()=>AgentResearchService.decide(store,target,result.reviewQueue[0].id,'ACCEPT'),/replan/);
});
test('potential findings require observed evidence, false positives, duplicate review and human confirmation',async()=>{
  const {store,target}=agentSetup();const h=store.upsert(target.id,'hypotheses',{title:'Approval replay',invariant:'Used approval must not replay',expectedBehavior:'Replay rejected'});
  const t=store.upsert(target.id,'testCases',{hypothesisId:h.id,title:'Owned replay',result:'failed',expectedResult:'Replay denied',actualResult:'Owned dummy approval accepted twice',steps:'Use dummy approval\nReplay owned approval',who:'Member',object:'Approval',state:'Used',authority:'Owned capability',context:'Lab'});
  const e=store.upsert(target.id,'evidence',{label:'Owned response',content:'200 OK dummy response',testCaseId:t.id});store.upsert(target.id,'testCases',{id:t.id,evidenceIds:[e.id]});
  target.agentResearch.completedStages=agentStages.slice(0,9).map(s=>s[0]);
  const provider={complete:async request=>{const id=JSON.parse(request.prompt).agentId;return agentOutput(id==='finding'?{proposals:[agentProposal('potential-finding',{relatedTestId:t.id,evidenceIds:[e.id],content:{...emptyAgentContent(),actualResult:'AI invented outcome MUST BE REPLACED',startingAuthority:'Owned capability',securityRestriction:h.invariant,protectedResource:'Approval',impact:'Observed duplicate owned approval',rootCause:'Atomic-use check hypothesis'}})]}:{summary:id==='false-positive'?'Effective role and owned control checked; review manual reproduction.':'Duplicate risk Unknown; only supplied lab metadata.'});}};
  const {orchestrator}=orchestration(provider);const result=await orchestrator.run(runInput(store,target));assert.equal(result.state,'FINDING_REVIEW');assert.equal(target.findings.length,0);const proposal=result.reviewQueue[0];assert.equal(proposal.content.actualResult,t.actualResult);assert.equal(proposal.analysisCompleted,true);assert.ok(proposal.falsePositiveAnalysis&&proposal.duplicateRisk);
  AgentResearchService.update(store,target,result);AgentResearchService.decide(store,target,proposal.id,'CONFIRM_FINDING');assert.equal(target.findings[0].status,'confirmed');assert.equal(target.findings[0].severity,'Unknown');assert.deepEqual(target.findings[0].evidenceIds,[e.id]);
  const noEvidence=structuredClone(runInput(store,target));noEvidence.research.reviewQueue=[];noEvidence.research.completedStages=agentStages.slice(0,9).map(s=>s[0]);noEvidence.context.tests[0].actualResult='';const unsupported=await orchestrator.run(noEvidence);assert.equal(unsupported.reviewQueue[0].kind,'uncertain-analysis');
});
test('native adapter permissions are enforced; approvals bind exact action/scope and cannot replay',async()=>{
  const {store,target}=agentSetup(),context=buildAgentContext(store.get(),target),config=resolveConfig({AI_ENABLED:'true',AGENTIC_AI_ENABLED:'true',AGENT_ALLOW_TARGET_REQUESTS:'true'}).agentic;
  const adapters=new AgentToolAdapters('bound-secret'),inventory=builtinTools(),action={...localJSONAction(),id:randomUUID()};inventory.find(t=>t.id==='builtin-json').agentAccess='APPROVAL_REQUIRED';
  assert.equal(evaluateAgentAction(action,context,inventory,config).permission,'APPROVAL_REQUIRED');action.approvalToken=adapters.sign(action,context);
  const changed=structuredClone(action);changed.input.json='{"changed":true}';assert.throws(()=>adapters.consumeApproval(changed,context,action.approvalToken),/changed|berubah/);
  const alteredScope=structuredClone(context);alteredScope.knowledge.scope.outOfScope.push('another.example.test');assert.throws(()=>adapters.consumeApproval(action,alteredScope,action.approvalToken),/berubah/);
  adapters.consumeApproval(action,context,action.approvalToken);assert.match((await adapters.execute(action,context)).result,/owned/);assert.throws(()=>adapters.consumeApproval(action,context,action.approvalToken),/used/);
  for(const adapter of ['http-request','browser','network-tool','package-install','root-command','destructive-action'])assert.equal(evaluateAgentAction({...action,adapter},context,inventory,config).permission,'DENIED');
});
test('tool recommendations require installed inventory capabilities without external execution',async()=>{
  for(const installed of [false,true]){
    const {store,target}=agentSetup();store.saveTool({id:'manual-http',name:'Manual HTTP Inspector',installed,version:'1',path:'Metadata only',capabilities:['http-inspection'],agentAccess:'APPROVAL_REQUIRED',notes:''});
    target.agentResearch.completedStages=agentStages.slice(0,5).map(s=>s[0]);
    const {orchestrator}=orchestration({complete:async()=>agentOutput({proposals:[agentProposal('tool-recommendation',{relatedToolId:'manual-http',content:{...emptyAgentContent(),type:'http-inspection'}})]})});
    const result=await orchestrator.run(runInput(store,target));assert.equal(result.reviewQueue[0].kind,installed?'tool-recommendation':'uncertain-analysis');assert.equal(result.pendingActions.length,0);assert.equal(target.testCases.length,0);
  }
});
test('sensitive provider output pauses without storing secrets or applying proposals',async()=>{
  const {store,target}=agentSetup();const {orchestrator}=orchestration({complete:async()=>agentOutput({summary:'Authorization: Bearer PRIVATE_MODEL_TOKEN'})});
  const result=await orchestrator.run(runInput(store,target));assert.equal(result.state,'PAUSED');assert.equal(result.reviewQueue.length,0);assert.ok(!JSON.stringify(result).includes('PRIVATE_MODEL_TOKEN'));
});
test('sensitive evidence pauses before provider; errors, pause and unsafe output are contained',async()=>{
  const {store,target}=agentSetup();store.upsert(target.id,'evidence',{label:'Sensitive dummy',content:'Authorization: Bearer PRIVATE_AGENT_TOKEN'});let calls=0;
  const {orchestrator}=orchestration({complete:async()=>{calls++;return agentOutput();}});const result=await orchestrator.run(runInput(store,target));assert.equal(calls,0);assert.equal(result.state,'WAITING_REVIEW');assert.ok(!JSON.stringify(result).includes('PRIVATE_AGENT_TOKEN'));
  const fresh=agentSetup();let started;const ready=new Promise(resolve=>{started=resolve;});const slow=orchestration({complete:request=>new Promise((resolve,reject)=>{started();request.signal.addEventListener('abort',()=>reject(new Error('Sensitive upstream details')));})});const input=runInput(fresh.store,fresh.target),promise=slow.orchestrator.run(input);await ready;assert.equal(slow.orchestrator.pause(input.runId),true);assert.equal((await promise).state,'PAUSED');
  const failing=orchestration({complete:async()=>{throw new Error('DO_NOT_EXPOSE_UPSTREAM_KEY');}});const failed=await failing.orchestrator.run(runInput(fresh.store,fresh.target));assert.equal(failed.state,'PAUSED');assert.equal(failed.runs.at(-1).steps,1);assert.ok(!JSON.stringify(failed).includes('DO_NOT_EXPOSE_UPSTREAM_KEY'));assert.throws(()=>validateAgentResponse({...agentOutput(),privateReasoning:'not supported'}));
});
test('agent API shares localhost token/privacy/concurrency guards and validates imports before mutation',async()=>{
  const {store,target}=agentSetup();const app=await createApp({env:{AI_ENABLED:'true',AGENTIC_AI_ENABLED:'true',AI_PROVIDER:'ollama',OLLAMA_MODEL:'mock',AI_PRIVACY_MODE:'LOCAL_ONLY'},providerFactory:()=>({complete:async()=>agentOutput()}),agentLedger:new MemoryAgentBudgetLedger()});
  try{const token=(await app.inject('/api/config')).json().requestToken,payload=runInput(store,target),headers={'x-workspace-token':token};assert.equal((await app.inject({method:'POST',url:'/api/agent/run',payload})).statusCode,403);assert.equal((await app.inject({method:'POST',url:'/api/agent/run',headers,payload:{...payload,privacyMode:'CLOUD'}})).statusCode,400);assert.equal((await app.inject({method:'POST',url:'/api/agent/run',headers,payload:{...payload,context:{}}})).statusCode,400);
    const result=await app.inject({method:'POST',url:'/api/agent/run',headers,payload});assert.equal(result.statusCode,200,result.body);assert.equal(target.hypotheses.length,0);
    const action={...localJSONAction(),id:randomUUID()},context=payload.context,inventory=structuredClone(payload.inventory);inventory.find(t=>t.id==='builtin-json').agentAccess='APPROVAL_REQUIRED';
    const reviewed=await app.inject({method:'POST',url:'/api/agent/review-action',headers,payload:{action,context,inventory}});assert.equal(reviewed.statusCode,200,reviewed.body);
    const approved={action:reviewed.json().action,context,inventory,decision:'APPROVE_ONCE'};
    assert.equal((await app.inject({method:'POST',url:'/api/agent/action',headers,payload:approved})).statusCode,200);
    assert.equal((await app.inject({method:'POST',url:'/api/agent/action',headers,payload:approved})).statusCode,400);
    assert.equal((await app.inject({method:'POST',url:'/api/agent/action',headers,payload:{...approved,action:{...action,input:{json:42}}}})).statusCode,400);
    const before=JSON.stringify(store.get()),bad=structuredClone(store.get());bad.toolInventory[0].agentAccess='UNRESTRICTED';assert.throws(()=>store.replace(bad));assert.equal(JSON.stringify(store.get()),before);
    const original=target.agentResearch;AgentResearchService.update(store,target,mergeAgentResearch(original,result.json().research));assert.equal(JSON.stringify(parseWorkspace(JSON.stringify(store.get()))),JSON.stringify(store.get()));
  }finally{await app.close();}
});
