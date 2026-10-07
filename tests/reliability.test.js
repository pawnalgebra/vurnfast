import test from 'node:test';
import assert from 'node:assert/strict';
import {randomUUID} from 'node:crypto';
import {createStore} from '../client/js/store.js';
import {createStorageSession,JOURNAL_KEY,parseWorkspace} from '../client/js/storage.js';
import {AgentResearchService,compactAgentResearch} from '../client/js/services/agent-research.js';
import {buildAgentContext} from '../client/js/services/agent-context.js';
import {ResearchContextBuilder} from '../client/js/services/research-context-builder.js';
import {agentStages,emptyAgentContent} from '../client/js/services/agent-schema.js';
import {reportSourceFingerprint} from '../client/js/services/research-integrity.js';
import {prepareShare} from '../client/js/services/share-review.js';
import {buildResearchContext} from '../client/js/services/context.js';
import {policyFor} from '../client/js/services/rules.js';
import {ResearchOrchestrator} from '../server/services/research-orchestrator.js';
import {AgentToolAdapters,agentScopePolicy} from '../server/services/agent-tools.js';
import {MemoryAgentBudgetLedger} from '../server/services/agent-budget.js';
import {resolveConfig} from '../server/config.js';
import {authorizedTarget} from './fixtures.js';
const output=extra=>({summary:'Owned regression fixture; no vulnerability confirmed.',confidence:.8,notes:'Unverified.',proposals:[],actions:[],unknownInformation:[],...extra});
const proposal=(kind,extra={})=>({kind,title:'Owned '+kind,analysis:'Fixture',reason:'Researcher review',confidence:.7,notes:'Unverified',relatedTechniqueId:'',relatedToolId:'',relatedHypothesisId:'',relatedTestId:'',relatedFindingId:'',evidenceIds:[],content:emptyAgentContent(),...extra});
const config=()=>resolveConfig({AI_ENABLED:'true',AGENTIC_AI_ENABLED:'true',AI_PROVIDER:'ollama',OLLAMA_MODEL:'mock',AGENT_MAX_STEPS:'32',AGENT_RUN_BUDGET_USD:'5'});
const orchestration=provider=>new ResearchOrchestrator(provider,config(),new MemoryAgentBudgetLedger(),new AgentToolAdapters('owned-regression-key'));
const input=(store,target)=>({runId:randomUUID(),context:buildAgentContext(store.get(),target),research:compactAgentResearch(target.agentResearch),inventory:store.get().toolInventory,privacyMode:'LOCAL_ONLY'});
const memoryStorage=()=>{const values=new Map();return {values,getItem:k=>values.get(k)??null,setItem:(k,v)=>values.set(k,v),removeItem:k=>values.delete(k)};};
// Serialize transactions and commit a private copy only on completion, including abort semantics.
class MemoryDatabase{
  constructor(primary,revision=0){this.values=new Map([['primary',primary],['revision',revision]]);this.tail=Promise.resolve();}
  transaction(_,mode){
    const ops=[],previous=this.tail;let release,aborted=false;this.tail=new Promise(r=>release=r);
    const tx={abort(){aborted=true;},objectStore:()=>({get(key){const request={};ops.push({key,request});return request;},put(value,key){ops.push({key,value:structuredClone(value)});}})};
    queueMicrotask(async()=>{await previous;const draft=new Map(structuredClone([...this.values]));for(let i=0;i<ops.length&&!aborted;i++){const op=ops[i];if(op.request){op.request.result=structuredClone(draft.get(op.key));op.request.onsuccess?.();}else draft.set(op.key,op.value);}if(aborted)tx.onabort?.();else{if(mode==='readwrite')this.values=draft;tx.oncomplete?.();}release();});return tx;
  }
}
test('corrupt recovery journal cannot hide or overwrite a valid primary',async()=>{
  const {store}=authorizedTarget(),original=structuredClone(store.get()),db=new MemoryDatabase(original),ls=memoryStorage();ls.setItem(JOURNAL_KEY,'{broken');
  const session=createStorageSession(async()=>db,()=>ls);assert.deepEqual(await session.read(),original);assert.deepEqual(db.values.get('primary'),original);assert.ok(session.recovery.warning);assert.equal(ls.getItem(JOURNAL_KEY),null);assert.ok([...ls.values.keys()].some(k=>k.includes('quarantine')));
});
test('stale recovery journal cannot replay over a newer primary',async()=>{
  const {store}=authorizedTarget(),primary=structuredClone(store.get()),db=new MemoryDatabase(primary,2),ls=memoryStorage(),old=createStore();old.addTarget({name:'Old journal'});ls.setItem(JOURNAL_KEY,JSON.stringify({format:'workspace-journal-v3',baseRevision:1,workspace:old.get()}));const session=createStorageSession(async()=>db,()=>ls);assert.deepEqual(await session.read(),primary);assert.equal(db.values.get('revision'),2);
});
test('valid crash journal restores atomically; unusable storage requires explicit validated recovery',async()=>{
  const {store}=authorizedTarget(),db=new MemoryDatabase({broken:true}),ls=memoryStorage();ls.setItem(JOURNAL_KEY,JSON.stringify({format:'workspace-journal-v3',baseRevision:0,workspace:store.get()}));const session=createStorageSession(async()=>db,()=>ls);assert.deepEqual(await session.read(),store.get());assert.deepEqual(db.values.get('recovery-primary'),{broken:true});
  const broken=createStorageSession(async()=>new MemoryDatabase({broken:true}),()=>memoryStorage());await assert.rejects(()=>broken.read(),/editing\/autosave/);const locked=createStore(undefined,{readOnly:true});assert.throws(()=>locked.addTarget({name:'Must not overwrite'}),/read-only/);assert.throws(()=>locked.reset(),/read-only/);assert.throws(()=>locked.replace({broken:true},{recover:true}));assert.ok(locked.isReadOnly());locked.replace(store.get(),{recover:true});assert.equal(locked.isReadOnly(),false);
});
test('atomic revision check blocks lost updates from a second tab',async()=>{
  const {store}=authorizedTarget(),db=new MemoryDatabase(store.get()),ls=memoryStorage(),a=createStorageSession(async()=>db,()=>ls),b=createStorageSession(async()=>db,()=>ls),first=await a.read(),second=await b.read();first.targets[0].name='Tab A saved';second.targets[0].name='Tab B stale';await a.write(first);await assert.rejects(()=>b.write(second),e=>e.code==='STORAGE_CONFLICT');assert.equal(db.values.get('primary').targets[0].name,'Tab A saved');assert.equal(db.values.get('revision'),1);
});
test('canonical edits invalidate pending proposals and acceptance checks revision independently',async()=>{
  const {store,target}=authorizedTarget(),orch=orchestration({complete:async request=>output(JSON.parse(request.prompt).agentId==='attack-surface'?{proposals:[proposal('actor',{content:{...emptyAgentContent(),name:'Old actor',authority:'Owned'}})]}:{})});const result=await orch.run(input(store,target));AgentResearchService.update(store,target,result);store.updateTarget(target.id,{asset:'changed.test'});assert.ok(target.agentResearch.reviewQueue[0].stale);assert.throws(()=>AgentResearchService.decide(store,target,result.reviewQueue[0].id,'ACCEPT'),/replan/);target.agentResearch.reviewQueue[0].stale=false;assert.throws(()=>AgentResearchService.decide(store,target,result.reviewQueue[0].id,'ACCEPT'),/replan/);AgentResearchService.decide(store,target,result.reviewQueue[0].id,'REJECT');
});
test('accepting one valid batch proposal preserves review of its siblings',async()=>{
  const {store,target}=authorizedTarget(),orch=orchestration({complete:async request=>output(JSON.parse(request.prompt).agentId==='attack-surface'?{proposals:['A','B'].map(name=>proposal('actor',{title:name,content:{...emptyAgentContent(),name,authority:'Owned'}}))}:{})});const result=await orch.run(input(store,target));AgentResearchService.update(store,target,result);for(const p of result.reviewQueue)AgentResearchService.decide(store,target,p.id,'ACCEPT');assert.ok(target.actors.some(a=>a.name==='A'));assert.ok(target.actors.some(a=>a.name==='B'));assert.equal(target.agentResearch.reviewQueue.filter(p=>p.status==='ACCEPTED').length,2);
});
test('new confirmed finding resumes report; new hypothesis restarts planning without repeating intelligence',async()=>{
  const {store,target}=authorizedTarget();store.upsert(target.id,'hypotheses',{title:'Owned hypothesis',invariant:'Owner only',expectedBehavior:'Denied'});const e=store.upsert(target.id,'evidence',{label:'Owned observation',content:'Owned fixture'}),seen=[];const orch=orchestration({complete:async request=>{seen.push(JSON.parse(request.prompt).agentId);return output();}});const first=await orch.run(input(store,target));assert.equal(first.state,'COMPLETED');AgentResearchService.update(store,target,first);store.upsert(target.id,'findings',{title:'New finding',status:'confirmed',evidenceIds:[e.id]});seen.length=0;const second=await orch.run(input(store,target));assert.deepEqual(seen,['report']);AgentResearchService.update(store,target,second);store.upsert(target.id,'hypotheses',{title:'New hypothesis',invariant:'Role enforced',expectedBehavior:'Denied'});seen.length=0;await orch.run(input(store,target));assert.equal(seen[0],'test-planner');assert.ok(!seen.includes('target-intelligence'));
});
test('tool results reach the next specialist with derived provenance and never create target evidence',async()=>{
  const {store,target}=authorizedTarget(),seen=[],orch=orchestration({complete:async request=>{seen.push(JSON.parse(request.prompt));return output(seen.length===1?{actions:[{adapter:'json-parse',toolId:'builtin-json',goal:'Parse owned JSON',reason:'Local only',input:{query:'',json:'{"marker":"OWNED_DERIVED_RESULT"}',leftEvidenceId:'',rightEvidenceId:'',url:''},risk:'low',expectedResult:'Parsed',stopConditions:['Invalid input']}]}:{});}});const result=await orch.run(input(store,target));assert.equal(result.pendingActions[0].status,'EXECUTED');assert.ok(seen[1].toolResults[0].result.includes('OWNED_DERIVED_RESULT'));assert.equal(seen[1].toolResults[0].targetObservation,false);assert.equal(seen[1].toolResults[0].sourceType,'local-derived');assert.equal(target.evidence.length,0);
});
test('message finding receives false-positive/duplicate review and accepts unchanged long canonical observations',async()=>{
  const {store,target}=authorizedTarget(),t=store.upsert(target.id,'testCases',{title:'Owned test',result:'failed',steps:'Owned test steps',actualResult:'observed '.repeat(650),expectedResult:'Denied'}),e=store.upsert(target.id,'evidence',{label:'Long evidence',testCaseId:t.id,content:'owned '.repeat(1000)});store.upsert(target.id,'testCases',{id:t.id,evidenceIds:[e.id]});const seen=[],orch=orchestration({complete:async request=>{const payload=JSON.parse(request.prompt);seen.push(payload.agentId);return output(payload.message?{proposals:[proposal('potential-finding',{relatedTestId:t.id,evidenceIds:[e.id],content:{...emptyAgentContent(),startingAuthority:'Member',securityRestriction:'Owner only',protectedResource:'Owned resource',impact:'Observed owned outcome'}})]}:{});}});
  target.agentResearch.completedStages=agentStages.map(s=>s[0]);const selected=new ResearchContextBuilder().build({workspace:store.get(),target,page:'tests',contextRefs:[{kind:'test',id:t.id}],message:'Analyze'});const response=await orch.message({runId:randomUUID(),context:selected.context,message:{agent:'finding',text:'Analyze',contextRefs:[]},inventory:store.get().toolInventory,privacyMode:'LOCAL_ONLY',memory:{},researchState:{}});const research=structuredClone(target.agentResearch);research.reviewQueue.push(...response.proposals);AgentResearchService.update(store,target,research);seen.length=0;const reviewed=await orch.run(input(store,target));assert.equal(reviewed.state,'FINDING_REVIEW');assert.deepEqual(seen,['false-positive','duplicate']);AgentResearchService.update(store,target,reviewed);AgentResearchService.decide(store,target,response.proposals[0].id,'CONFIRM_FINDING');assert.equal(target.findings[0].actualResult,t.actualResult);assert.deepEqual(target.findings[0].evidenceIds,[e.id]);assert.equal(target.findings[0].status,'confirmed');parseWorkspace(JSON.stringify(store.get()));
});
test('report source version ignores draft edits and detects linked evidence changes',()=>{
  const {store,target}=authorizedTarget(),e=store.upsert(target.id,'evidence',{label:'Observation',content:'Owned A'}),f=store.upsert(target.id,'findings',{title:'Owned finding',evidenceIds:[e.id]});const version=reportSourceFingerprint(target,f);store.upsert(target.id,'findings',{id:f.id,reportMarkdown:'Edited draft',reportSourceFingerprint:version});assert.equal(reportSourceFingerprint(target,f),version);store.upsert(target.id,'evidence',{id:e.id,content:'Owned B'});assert.notEqual(reportSourceFingerprint(target,f),version);
});
test('scope evaluators agree on unknown, exact and excluded assets',()=>{
  const {store,target}=authorizedTarget();for(const asset of ['not-authorized.test','app.test','thirdparty.test']){store.updateTarget(target.id,{asset});const manual=policyFor(buildResearchContext(target)),agent=agentScopePolicy(buildAgentContext(store.get(),target));assert.deepEqual(agent.assessment,manual.assessment);assert.equal(agent.canRecommend,asset==='app.test');}
});
test('share redaction removes raw dummy credentials without corrupting backup JSON',()=>{
  const {store,target}=authorizedTarget();store.upsert(target.id,'evidence',{label:'Owned sensitive fixture',content:'Authorization: Bearer OWNED_DUMMY_TOKEN\nCookie: session=OWNED_DUMMY_COOKIE\nOwned response'});const share=prepareShare(store.get());assert.ok(share.sensitive);assert.ok(!share.redacted.includes('OWNED_DUMMY_TOKEN'));assert.ok(!share.redacted.includes('OWNED_DUMMY_COOKIE'));parseWorkspace(share.redacted);assert.ok(share.original.includes('OWNED_DUMMY_TOKEN'));assert.equal(prepareShare('Owned note').sensitive,false);
});
