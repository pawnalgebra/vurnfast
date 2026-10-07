import test from 'node:test';
import assert from 'node:assert/strict';
import {createStore} from '../client/js/store.js';
import {parseWorkspace} from '../client/js/storage.js';
import {SecretStore} from '../client/js/services/secret-store.js';
import {emptyResearchEnvironment,environmentSecretRef,environmentMetadata,validateResearchEnvironment,checkEnvironmentAction,environmentRuleNames,validateEnvironmentMetadata} from '../client/js/services/environment.js';
import {buildAgentContext} from '../client/js/services/agent-context.js';
import {buildResearchContext} from '../client/js/services/context.js';
import {evaluateAgentAction,AgentToolAdapters} from '../server/services/agent-tools.js';
import {createApp} from '../server/app.js';
import {MemoryAgentBudgetLedger} from '../server/services/agent-budget.js';
const setup=()=>{const store=createStore(),target=store.addTarget({name:'Dummy Environment',asset:'lab.example.test'});store.updateTarget(target.id,{scope:{inScope:'lab.example.test',outOfScope:'other.example.test',guard:{inScope:true,account:true,data:true}}});const actor=store.upsert(target.id,'actors',{name:'Member'}),env=emptyResearchEnvironment();env.accounts.push({id:'account-a',name:'Account A',role:'Member',purpose:'Owner',username:'dummy@example.test',tenant:'Tenant A',ownership:'Owner',notes:'',credentialRef:environmentSecretRef(target.id,'account-a','credential')});env.profiles.push({id:'profile-a',name:'Account A Cookie',accountId:'account-a',actorId:actor.id,authType:'Cookie',tenant:'Tenant A',ownership:'Owner',purpose:'Ownership testing',notes:'',secretRef:environmentSecretRef(target.id,'profile-a','auth'),cookieRef:'',cookieUpdatedAt:'',sessionStatus:'Unknown'});return {store,target,env};};
class MemorySecrets{constructor(){this.rows=new Map();}async get(k){return structuredClone(this.rows.get(k));}async put(k,v){this.rows.set(k,structuredClone(v));}async delete(k){this.rows.delete(k);}async initialize(meta){if(this.rows.has('metadata'))throw new Error('Concurrent vault initialization');this.rows.set('metadata',structuredClone(meta));}}
test('optional environment preserves old workspace and valid references across migration/export',()=>{
 const {store,target,env}=setup();assert.equal(target.researchEnvironment,undefined);const original=JSON.stringify(store.get());assert.equal(JSON.stringify(parseWorkspace(original)),original);
 assert.ok(Object.values(env.rules).every(v=>v==='Unknown'));store.updateEnvironment(target.id,env);const h=store.upsert(target.id,'hypotheses',{title:'Owned hypothesis',authProfileId:'profile-a'});store.upsert(target.id,'testCases',{title:'Owned test',hypothesisId:h.id,authProfileId:'profile-a'});
 const exported=JSON.stringify(store.get());assert.equal(JSON.stringify(parseWorkspace(exported)),exported);assert.ok(!exported.includes('ciphertext'));
 env.profiles=[];store.updateEnvironment(target.id,env);assert.equal(h.authProfileId,'');assert.equal(target.testCases[0].authProfileId,'');
});
test('encrypted vault survives lock/restart, rejects wrong passphrase/cross-target/tampering and stores no plaintext',async()=>{
 const memory=new MemorySecrets(),vault=new SecretStore(memory),binding={targetId:'owned-target',ownerId:'account'},ref='secret://owned-target/account/auth',secret='Bearer DUMMY_SECRET_COOKIE';
 await vault.unlock('Dummy passphrase 123');await vault.set(ref,binding,secret);assert.ok(!JSON.stringify([...memory.rows]).includes(secret));assert.equal(await vault.getForAdapter(ref,binding),secret);
 vault.lock();await assert.rejects(()=>vault.getForAdapter(ref,binding),/locked/);const next=new SecretStore(memory);await assert.rejects(()=>next.unlock('Wrong passphrase 123'),/salah/);await next.unlock('Dummy passphrase 123');assert.equal(await next.getForAdapter(ref,binding),secret);
 await assert.rejects(()=>next.getForAdapter(ref,{...binding,targetId:'another-target'}),/unavailable/);const row=memory.rows.get(ref);row.ciphertext[0]^=1;await assert.rejects(()=>next.getForAdapter(ref,binding),/decrypt/);next.lock();
});
test('concurrent vault creation cannot overwrite an existing key/ciphertext',async()=>{
 const memory=new MemorySecrets(),first=new SecretStore(memory),second=new SecretStore(memory);const results=await Promise.allSettled([first.unlock('First passphrase 123'),second.unlock('Second passphrase 123')]);assert.equal(results.filter(r=>r.status==='fulfilled').length,1);first.lock();second.lock();
});
test('raw secrets, cross-target refs, active claims, invalid headers and dangling auth links are rejected atomically',()=>{
 const {store,target,env}=setup();store.updateEnvironment(target.id,env);const before=JSON.stringify(store.get());
 for(const mutate of [e=>{e.accounts[0].password='DUMMY_PASSWORD';},e=>{e.profiles[0].secretRef='secret://other/account/auth';},e=>{e.profiles[0].sessionStatus='Active';},e=>{e.notes='Authorization: Bearer DUMMY_TOKEN';},e=>{e.profiles[0].accountId='missing';},e=>{e.headers=[{id:'header',name:'Authorization',value:'Bearer DUMMY_TOKEN',secret:false,enabled:true,secretRef:''}];}]){const bad=structuredClone(env);mutate(bad);assert.throws(()=>store.updateEnvironment(target.id,bad));assert.equal(JSON.stringify(store.get()),before);}
 const bad=structuredClone(store.get());bad.targets[0].hypotheses.push({id:'bad-h',title:'Invalid auth',authProfileId:'foreign-profile'});assert.throws(()=>store.replace(bad));assert.equal(JSON.stringify(store.get()),before);
});
test('AI receives only account/profile metadata and configured flags; tri-state rules override legacy booleans',()=>{
 const {store,target,env}=setup();store.updateTarget(target.id,{programRules:{automationAllowed:true,dosAllowed:true,thirdPartyTesting:true}});store.updateEnvironment(target.id,env);
 const context=buildAgentContext(store.get(),target),serialized=JSON.stringify(context);assert.ok(context.environment.accounts[0].credentialConfigured);assert.ok(!serialized.includes('secret://')&&!serialized.includes('dummy@example.test')&&!serialized.includes('credentialRef'));
 assert.equal(context.knowledge.programRules.automationAllowed,false);assert.equal(buildResearchContext(target).programRules.thirdPartyTesting,false);validateEnvironmentMetadata(environmentMetadata(target));
 const bad=structuredClone(context.environment);bad.profiles[0].cookie='DUMMY_COOKIE';assert.throws(()=>validateEnvironmentMetadata(bad));
});
test('environment policy defaults to review, requires available auth and never returns auto allowed',()=>{
 const {target,env}=setup();target.researchEnvironment=env;let metadata=environmentMetadata(target);const action={authProfileId:'profile-a'},options={asset:target.asset,scopeAllowed:true,toolAllowed:true};assert.equal(checkEnvironmentAction(metadata,action,options).status,'REQUIRES_REVIEW');
 env.allowedAssets=target.asset;env.rateLimit='1 request per second';for(const key of environmentRuleNames)env.rules[key]='Not Allowed';env.rules.automationAllowed='Allowed';env.rules.authenticatedTestingAllowed='Allowed';metadata=environmentMetadata(target);
 assert.equal(checkEnvironmentAction(metadata,action,options).status,'WAITING_FOR_ENVIRONMENT');assert.equal(checkEnvironmentAction(metadata,action,{...options,credentialAvailable:true}).status,'APPROVAL_REQUIRED');assert.equal(checkEnvironmentAction(metadata,{...action,thirdParty:true},{...options,credentialAvailable:true}).status,'DENIED');assert.equal(checkEnvironmentAction(metadata,action,{...options,asset:'outside.example.test',credentialAvailable:true}).status,'REQUIRES_REVIEW');
 metadata.rules.researcherIdentificationRequired='Allowed';metadata.researcherHeader='X-Researcher-ID';assert.equal(checkEnvironmentAction(metadata,action,{...options,credentialAvailable:true}).status,'WAITING_FOR_ENVIRONMENT');metadata.headers.push({name:'X-Researcher-ID',enabled:true,secret:false,configured:true});assert.equal(checkEnvironmentAction(metadata,action,{...options,credentialAvailable:true}).status,'APPROVAL_REQUIRED');metadata.profiles[0].authType='None';metadata.rules.authenticatedTestingAllowed='Not Allowed';assert.equal(checkEnvironmentAction(metadata,action,options).status,'APPROVAL_REQUIRED');
 const context=buildAgentContext({domainPacks:[]},target),policy=evaluateAgentAction({adapter:'http-request',toolId:'missing',authProfileId:'profile-a'},context,[],{localToolAccess:true,allowTargetRequests:true});assert.equal(policy.permission,'DENIED');
 const adapters=new AgentToolAdapters('dummy-signing-secret'),native={id:'action',adapter:'json-parse',toolId:'builtin-json',input:{json:'{}'}},token=adapters.sign(native,context),changed=structuredClone(context);changed.environment.rateLimit='10 requests per second';assert.throws(()=>adapters.consumeApproval(native,changed,token),/berubah/);
});
test('agent API accepts metadata context and rejects a raw secret field before provider',async()=>{
 const {store,target,env}=setup();store.updateEnvironment(target.id,env);const app=await createApp({env:{AI_ENABLED:'true',AGENTIC_AI_ENABLED:'true',AI_PROVIDER:'ollama',OLLAMA_MODEL:'mock'},providerFactory:()=>({complete:async()=>{throw new Error('Mock provider');}}),agentLedger:new MemoryAgentBudgetLedger()});
 try{const token=(await app.inject('/api/config')).json().requestToken,context=buildAgentContext(store.get(),target),payload={runId:'env-run',context,research:target.agentResearch,inventory:store.get().toolInventory,privacyMode:'LOCAL_ONLY'};const response=await app.inject({method:'POST',url:'/api/agent/run',headers:{'x-workspace-token':token},payload});assert.equal(response.statusCode,200,response.body);context.environment.profiles[0].rawCookie='DUMMY_COOKIE';const rejected=await app.inject({method:'POST',url:'/api/agent/run',headers:{'x-workspace-token':token},payload});assert.equal(rejected.statusCode,400);}
 finally{await app.close();}
});
