import test from 'node:test';
import assert from 'node:assert/strict';
import {randomUUID} from 'node:crypto';
import {createStore} from '../client/js/store.js';
import {parseWorkspace} from '../client/js/storage.js';
import {AgentMessageService,parseMessageTags,routeMessageAgent,planMessageAgents,messageAgents,summarizeMessageMemory} from '../client/js/services/agent-messages.js';
import {readMessageAttachment,validateMessageAttachments,attachmentMetadata} from '../client/js/services/message-attachments.js';
import {AiProvider} from '../server/ai/provider.js';
import {resolveConfig} from '../server/config.js';
import {ResearchContextBuilder} from '../client/js/services/research-context-builder.js';
import {RelatedTermService} from '../client/js/services/related-terms.js';
import {emptyAgentContent} from '../client/js/services/agent-schema.js';
import {compactAgentResearch} from '../client/js/services/agent-research.js';
import {TargetIntelligenceService} from '../client/js/services/domain-knowledge.js';
import {MemoryAgentBudgetLedger} from '../server/services/agent-budget.js';
import {createApp} from '../server/app.js';
function messageFixture(){
  const store=createStore(),target=store.addTarget({name:'Owned Message Lab',asset:'lab.example.test'});
  store.updateTarget(target.id,{scope:{inScope:'lab.example.test',outOfScope:'third-party.example.test',guard:{inScope:true,account:true,data:true}}});
  TargetIntelligenceService.update(store,target,{primaryDomainId:'finance'});
  TargetIntelligenceService.saveProfile(store,target,{company:'Owned Message Lab Company',businessModel:'Owned dummy research SaaS',products:'UNRELATED_PROFILE_PRODUCTS'});
  const hypothesis=store.upsert(target.id,'hypotheses',{title:'Authorization lifecycle',invariant:'Revoked owner cannot authorize',expectedBehavior:'Denied',status:'planned'});
  const testcase=store.upsert(target.id,'testCases',{title:'Owned revoke control',hypothesisId:hypothesis.id,actualResult:'Owned dummy replay succeeded',expectedResult:'Denied',result:'failed',evidenceIds:[]});
  const evidence=store.upsert(target.id,'evidence',{label:'Observed owned response',content:'HTTP 200 dummy result',testCaseId:testcase.id});
  store.upsert(target.id,'testCases',{id:testcase.id,evidenceIds:[evidence.id]});
  const finding=store.upsert(target.id,'findings',{title:'Owned replay candidate',testCaseId:testcase.id,evidenceIds:[evidence.id],status:'draft'});
  const other=store.addTarget({name:'OTHER_TARGET_PRIVATE_CONTEXT'});store.upsert(other.id,'evidence',{label:'Private other evidence',content:'OTHER_TARGET_PRIVATE_CONTENT'});
  store.upsert(target.id,'evidence',{label:'UNRELATED_EVIDENCE',content:'UNRELATED_EVIDENCE_CONTENT'});
  return {store,target,hypothesis,testcase,evidence,finding,refs:[{kind:'finding',id:finding.id},{kind:'evidence',id:evidence.id}]};
}
const messageOutput=()=>({summary:'Possible authorization lifecycle issue; not confirmed.',confidence:.8,notes:'Compare revocation timing against an owned denied control. #authorization #revocation',proposals:[],actions:[],unknownInformation:['Effective role at execution is Unknown.']});
function messagePayload(f,text='@finding review selected evidence',alias='finding'){
  const selected=new ResearchContextBuilder().build({workspace:f.store.get(),target:f.target,page:'findings',contextRefs:f.refs,message:text});
  return {runId:randomUUID(),...selected,message:{text,agent:alias,contextRefs:structuredClone(f.refs),tags:[]},inventory:f.store.get().toolInventory,privacyMode:'LOCAL_ONLY'};
}
const messageEnv={AI_ENABLED:'true',AGENTIC_AI_ENABLED:'true',AI_PROVIDER:'ollama',OLLAMA_MODEL:'mock',AI_PRIVACY_MODE:'LOCAL_ONLY'};
test('tags resolve internal active-target IDs and orchestrator routes without another AI call',()=>{
  const f=messageFixture();assert.deepEqual(parseMessageTags('@finding review #evidence:'+f.evidence.id+' #authorization',f.target),{agent:'finding',contextRefs:[{kind:'evidence',id:f.evidence.id}],tags:['authorization']});
  assert.equal(routeMessageAgent('orchestrator','root cause',f.refs),'evidence');assert.equal(routeMessageAgent('orchestrator','check duplicate',f.refs),'duplicate');assert.equal(routeMessageAgent('test','plan',f.refs),'test-planner');
  assert.deepEqual(parseMessageTags('@finding @evidence review',f.target).agents,['finding','evidence']);
  assert.equal(parseMessageTags('review',f.target).agent,'general');
  for(const text of ['@unknown review','@finding @evidence @scope @report @duplicate review','#evidence:invalid','#boundary'])assert.throws(()=>parseMessageTags(text,f.target));
});
test('selective context retrieves linked observations, redacts secrets and excludes unrelated workspace/history/domains',()=>{
  const f=messageFixture();f.store.upsert(f.target.id,'evidence',{id:f.evidence.id,content:'HTTP 200\nAuthorization: Bearer MESSAGE_SECRET'});
  const selected=messagePayload(f),serialized=JSON.stringify(selected.context);
  assert.equal(selected.context.evidence.length,1);assert.equal(selected.context.tests[0].id,f.testcase.id);assert.equal(selected.context.hypotheses[0].id,f.hypothesis.id);assert.equal(selected.context.knowledge.domains.length,1);assert.equal(selected.context.knowledge.domainCatalog.length,1);assert.ok(serialized.includes('[REDACTED]'));
  assert.ok(serialized.includes('Owned Message Lab Company'));
  for(const value of ['MESSAGE_SECRET','OTHER_TARGET_PRIVATE_CONTEXT','OTHER_TARGET_PRIVATE_CONTENT','UNRELATED_EVIDENCE_CONTENT','UNRELATED_PROFILE_PRODUCTS'])assert.ok(!serialized.includes(value));assert.deepEqual(selected.context.knowledge.scope.outOfScope,['third-party.example.test']);
  assert.throws(()=>new ResearchContextBuilder().build({workspace:f.store.get(),target:f.target,page:'finding',contextRefs:[{kind:'finding',id:'not-owned'}],message:'review'}));
});
test('local related terms use terminology edges, cache and invalidate after knowledge changes',()=>{
  const f=messageFixture(),service=new RelatedTermService(),query={term:'settlement',target:f.target,workspace:f.store.get()},result=service.search(query);assert.ok(result.related.some(r=>r.term.toLowerCase()==='ledger'));assert.ok(result.related.every(r=>r.source&&Number.isFinite(r.score)));assert.equal(service.search(query),result);assert.ok(service.search({...query,term:'authorization'}).related.some(r=>r.term==='BOLA'));
  f.store.upsert(f.target.id,'evidence',{label:'settlement-special-owned-ledger',content:'dummy'});query.workspace=f.store.get();assert.notEqual(service.search(query),result);
});
test('messages and extractive memory persist redacted, remain target-bound and never enter sequential run context',()=>{
  const f=messageFixture(),before=f.target.researchRevision;
  for(let i=0;i<12;i++)AgentMessageService.append(f.store,f.target,{sender:'researcher',agent:'finding',message:'question '+i+'\nCookie: private-cookie',contextRefs:f.refs,tags:['authorization']});
  assert.equal(f.target.researchRevision,before);assert.ok(!JSON.stringify(f.target.agentResearch).includes('private-cookie'));
  const memory=f.target.agentResearch.conversationSummary;assert.ok(memory.text&&memory.throughId);assert.equal(summarizeMessageMemory(f.target.agentResearch.messages,memory),memory);assert.equal(compactAgentResearch(f.target.agentResearch).messages,undefined);
  const copy=parseWorkspace(JSON.stringify(f.store.get()));assert.deepEqual(copy,f.store.get());copy.targets[0].agentResearch.messages[0].message='password=UNREDACTED';assert.throws(()=>parseWorkspace(JSON.stringify(copy)));
  const wrong=structuredClone(f.target.agentResearch);wrong.messages[0].targetId='other';assert.throws(()=>f.store.updateResearch(f.target.id,wrong));
});
test('message API reuses one specialist and budget, holds proposals for review, withholds tool actions',async()=>{
  const f=messageFixture(),ledger=new MemoryAgentBudgetLedger();let calls=0,prompt;
  const app=await createApp({env:messageEnv,agentLedger:ledger,providerFactory:()=>({complete:async request=>{calls++;assert.equal(request.maxOutputTokens,2500);assert.equal(request.schema.properties.proposals.maxItems,2);prompt=JSON.parse(request.prompt);return {...messageOutput(),proposals:[{kind:'uncertain-analysis',title:'Owned control needed',analysis:'Unverified',reason:'Missing denied control',confidence:.6,notes:'Inference only',relatedTechniqueId:'',relatedToolId:'',relatedHypothesisId:'',relatedTestId:'',relatedFindingId:f.finding.id,evidenceIds:[f.evidence.id,'invented'],content:emptyAgentContent()}],actions:[{adapter:'json-parse',toolId:'builtin-json',goal:'Parse',reason:'Compare',input:{query:'',json:'{}',leftEvidenceId:'',rightEvidenceId:'',url:''},risk:'low',expectedResult:'Parsed',stopConditions:[]}]};}})});
  try{const token=(await app.inject('/api/config')).json().requestToken,headers={'x-workspace-token':token},before=JSON.stringify(f.target.findings),response=await app.inject({method:'POST',url:'/api/agent/message',headers,payload:messagePayload(f)});assert.equal(response.statusCode,200,response.body);const result=response.json();assert.equal(result.status,'WAITING_REVIEW');assert.equal(result.agentId,'finding');assert.equal(calls,1);assert.equal(ledger.rows.length,1);assert.equal(result.run.actualCostUSD,null);assert.deepEqual(result.proposals[0].evidenceIds,[f.evidence.id]);assert.equal(result.proposals[0].verified,false);assert.equal(result.proposals[0].status,'PROPOSED');assert.equal(JSON.stringify(f.target.findings),before);assert.equal(prompt.message.agent,'finding');assert.ok(!JSON.stringify(prompt).includes('UNRELATED_EVIDENCE_CONTENT'));assert.ok(result.answer.details.includes('Tool suggestions withheld'));
    const foreign=messagePayload(f);foreign.message.contextRefs[0].id='other-target';assert.equal((await app.inject({method:'POST',url:'/api/agent/message',headers,payload:foreign})).statusCode,400);assert.equal((await app.inject({method:'POST',url:'/api/agent/message',payload:messagePayload(f)})).statusCode,403);
    const invalid=messagePayload(f);invalid.message.agent='unknown';assert.equal((await app.inject({method:'POST',url:'/api/agent/message',headers,payload:invalid})).statusCode,400);const wrongPrivacy=messagePayload(f);wrongPrivacy.privacyMode='CLOUD';assert.equal((await app.inject({method:'POST',url:'/api/agent/message',headers,payload:wrongPrivacy})).statusCode,400);assert.equal(calls,1);
  }finally{await app.close();}
});
test('message shares concurrency with research; Pause discards output and keeps estimate reserved',async()=>{
  const f=messageFixture();let finish,entered;const started=new Promise(resolve=>entered=resolve),ledger=new MemoryAgentBudgetLedger();const app=await createApp({env:messageEnv,agentLedger:ledger,providerFactory:()=>({complete:async()=>{entered();return new Promise(resolve=>finish=resolve);}})});
  try{const token=(await app.inject('/api/config')).json().requestToken,headers={'x-workspace-token':token},body=messagePayload(f),pending=app.inject({method:'POST',url:'/api/agent/message',headers,payload:body});await started;
    assert.equal((await app.inject({method:'POST',url:'/api/agent/message',headers,payload:messagePayload(f)})).statusCode,429);assert.equal((await app.inject({method:'POST',url:'/api/agent/run',headers,payload:{runId:randomUUID(),context:body.context,research:compactAgentResearch(f.target.agentResearch),inventory:body.inventory,privacyMode:'LOCAL_ONLY'}})).statusCode,429);
    assert.equal((await app.inject({method:'POST',url:'/api/agent/pause',headers,payload:{runId:body.runId}})).json().paused,true);finish(messageOutput());const result=(await pending).json();assert.equal(result.status,'PAUSED');assert.deepEqual(result.proposals,[]);assert.ok(!result.answer.finding.includes('authorization lifecycle'));assert.equal(ledger.rows.length,1);
  }finally{await app.close();}
});
test('message honors disabled/privacy/budget guards and contains sensitive provider errors',async()=>{
  const f=messageFixture();
  for(const scenario of [{AI_ENABLED:'false',status:503},{AGENTIC_AI_ENABLED:'false',status:503},{AGENT_DAILY_BUDGET_USD:'0',status:200,phase:'PAUSED',calls:0},{status:200,phase:'ERROR',calls:1}]){let calls=0;const app=await createApp({env:{...messageEnv,...scenario},agentLedger:new MemoryAgentBudgetLedger(),providerFactory:()=>({complete:async()=>{calls++;throw new Error('Authorization: Bearer NEVER_LEAK_UPSTREAM');}})});
    try{const token=(await app.inject('/api/config')).json().requestToken,response=await app.inject({method:'POST',url:'/api/agent/message',headers:{'x-workspace-token':token},payload:messagePayload(f)});assert.equal(response.statusCode,scenario.status);if(scenario.phase){assert.equal(response.json().status,scenario.phase);assert.equal(calls,scenario.calls);}assert.ok(!response.body.includes('NEVER_LEAK_UPSTREAM'));}finally{await app.close();}
  }
});
test('general routes a bounded relevant group; every specialist remains eligible and mentions select only their members',()=>{
  assert.deepEqual(planMessageAgents({agent:'general',text:'Halo',contextRefs:[{kind:'target',id:'owned'}]}),['general']);
  const team=planMessageAgents({agent:'general',text:'Review evidence finding false positive',contextRefs:[]});assert.deepEqual(team,['general','evidence','finding','false-positive']);
  assert.deepEqual(planMessageAgents({agent:'evidence',agents:['evidence','finding'],text:'Review report and scope',contextRefs:[]}),['evidence','finding']);
  assert.deepEqual(planMessageAgents({...parseMessageTags('@general explain evidence',messageFixture().target),text:'@general explain evidence',contextRefs:[]}),['general']);
  for(const [alias] of messageAgents.filter(([alias])=>!['general','orchestrator'].includes(alias)))assert.equal(planMessageAgents({agent:alias,text:'Review',contextRefs:[]})[0],routeMessageAgent(alias,'Review'));
  assert.throws(()=>planMessageAgents({agent:'general',agents:['unknown'],text:'Review'}));
});
test('group API dispatches real members with the selected model and files, shared replies, per-agent history and review proposals',async()=>{
  const f=messageFixture(),ledger=new MemoryAgentBudgetLedger(),seen=[],file=await readMessageAttachment(new File(['Owned log\nAuthorization: Bearer ATTACHMENT_PRIVATE_VALUE'],'owned.log',{type:'text/plain'}));
  const app=await createApp({env:{...messageEnv,AI_ALLOWED_MODELS:'mock,owned-alt'},agentLedger:ledger,providerFactory:()=>({complete:async request=>{const prompt=JSON.parse(request.prompt);seen.push({request,prompt});return {...messageOutput(),summary:prompt.agentId+' answered from owned context',proposals:[{kind:'uncertain-analysis',title:prompt.agentId+' control',analysis:'Unverified',reason:'Owned control missing',confidence:.6,notes:'Inference',relatedTechniqueId:'',relatedToolId:'',relatedHypothesisId:'',relatedTestId:'',relatedFindingId:f.finding.id,evidenceIds:[f.evidence.id],content:emptyAgentContent()}]};}})});
  try{const config=(await app.inject('/api/config')).json(),headers={'x-workspace-token':config.requestToken},payload=messagePayload(f,'Review evidence finding false positive','general');payload.message.model='owned-alt';payload.message.attachments=[file];
    const response=await app.inject({method:'POST',url:'/api/agent/message',headers,payload});assert.equal(response.statusCode,200,response.body);const result=response.json();
    assert.deepEqual(seen.map(row=>row.prompt.agentId),['general','evidence','finding','false-positive']);assert.equal(result.replies.length,4);assert.equal(result.run.steps,4);assert.equal(ledger.rows.length,4);assert.equal(result.run.estimatedCostUSD,.12);assert.equal(result.proposals.length,4);
    for(const [index,row] of seen.entries()){assert.equal(row.request.model,'owned-alt');assert.equal(row.request.attachments[0].text,file.text);assert.equal(row.prompt.sharedReplies.length,index);assert.ok(!JSON.stringify(row).includes('ATTACHMENT_PRIVATE_VALUE'));assert.equal(result.replies[index].model,'owned-alt');assert.equal(result.replies[index].history.estimatedCostUSD,.03);}
    assert.equal(new Set(result.replies.map(row=>row.history.id)).size,4);assert.ok(result.proposals.every(row=>row.contextRevision===f.target.researchRevision&&row.status==='PROPOSED'));
    const original=f.target.findings.length;for(const reply of result.replies)AgentMessageService.append(f.store,f.target,{sender:'agent',agent:reply.agentId,runId:payload.runId,model:reply.model,message:reply.answer.finding,answer:reply.answer,proposalIds:reply.proposals.map(row=>row.id),status:'completed'});
    AgentMessageService.append(f.store,f.target,{sender:'researcher',agent:'general',message:'Attached context',runId:payload.runId,model:'owned-alt',members:result.team,attachments:[attachmentMetadata(file)]});assert.deepEqual(parseWorkspace(JSON.stringify(f.store.get())),f.store.get());assert.equal(f.target.findings.length,original);
    payload.runId=randomUUID();payload.message.model='unregistered';assert.equal((await app.inject({method:'POST',url:'/api/agent/message',headers,payload})).statusCode,400);assert.equal(seen.length,4);
  }finally{await app.close();}
});
test('group budget stops further calls while preserving earlier replies; one failed specialist does not impersonate another',async()=>{
  for(const budget of ['.03','.25']){const f=messageFixture(),seen=[],ledger=new MemoryAgentBudgetLedger(),app=await createApp({env:{...messageEnv,AGENT_RUN_BUDGET_USD:budget},agentLedger:ledger,providerFactory:()=>({complete:async request=>{const id=JSON.parse(request.prompt).agentId;seen.push(id);if(id==='evidence')throw new Error('PRIVATE_GROUP_UPSTREAM');return messageOutput();}})});
    try{const token=(await app.inject('/api/config')).json().requestToken,payload=messagePayload(f,'Review evidence finding','general'),response=await app.inject({method:'POST',url:'/api/agent/message',headers:{'x-workspace-token':token},payload}),result=response.json();assert.equal(response.statusCode,200,response.body);assert.equal(result.replies[0].agentId,'general');assert.equal(result.replies[0].status,'COMPLETED');assert.ok(!response.body.includes('PRIVATE_GROUP_UPSTREAM'));
      if(budget==='.03'){assert.deepEqual(seen,['general']);assert.equal(result.status,'PAUSED');assert.equal(result.run.steps,1);assert.equal(result.replies[1].history.estimatedCostUSD,0);}else{assert.deepEqual(seen,['general','evidence','finding']);assert.equal(result.status,'ERROR');assert.equal(result.replies[1].status,'ERROR');assert.equal(result.replies[2].status,'COMPLETED');}
    }finally{await app.close();}}
});
test('attachments reject binary/oversized/forged input, redact text and keep image bytes separate from the model prompt',async()=>{
  const text=await readMessageAttachment(new File(['Cookie: ATTACHMENT_COOKIE\n{"owned":true}'],'owned.har'));assert.ok(!text.text.includes('ATTACHMENT_COOKIE'));assert.equal(attachmentMetadata(text).preview,text.text);
  await assert.rejects(()=>readMessageAttachment(new File(['%PDF fake'],'owned.pdf')));await assert.rejects(()=>readMessageAttachment(new File([new Uint8Array([255,0,128])],'bad.log')));
  assert.throws(()=>validateMessageAttachments([{...text,size:750001}]));assert.throws(()=>validateMessageAttachments([text,text]));assert.throws(()=>validateMessageAttachments([{...text,extra:'unexpected'}]));
  const png='iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+a5t8AAAAASUVORK5CYII=',image={id:'owned-image',name:'owned.png',type:'image/png',size:Buffer.from(png,'base64').length,data:png};validateMessageAttachments([image]);assert.throws(()=>validateMessageAttachments([{...image,size:1}]));assert.throws(()=>validateMessageAttachments([{...image,type:'text/html'}]));
  for(const provider of ['openai','anthropic','gemini','ollama']){
    const model='configured',selected='alternate',config=resolveConfig({AI_ENABLED:'true',AI_PROVIDER:provider,AI_ALLOWED_MODELS:selected,OPENAI_MODEL:model,ANTHROPIC_MODEL:model,GEMINI_MODEL:model,OLLAMA_MODEL:model,OPENAI_API_KEY:'dummy',ANTHROPIC_API_KEY:'dummy',GEMINI_API_KEY:'dummy'});let body,url;
    const transport=new AiProvider(config,async(endpoint,request)=>{url=endpoint;body=JSON.parse(request.body);const result=JSON.stringify(messageOutput());return Response.json(provider==='openai'?{output:[{content:[{type:'output_text',text:result}]}]}:provider==='anthropic'?{content:[{type:'text',text:result}]}:provider==='gemini'?{candidates:[{content:{parts:[{text:result}]}}]}:{message:{content:result}});});
    await transport.complete({system:'Fixture',prompt:'Owned supplied context',schema:{type:'object'},model:selected,attachments:[image]});assert.ok(JSON.stringify(body).includes(png));if(provider==='gemini'){assert.ok(url.includes('/alternate:generateContent'));assert.equal(body.contents[0].parts.at(-1).inlineData.mimeType,'image/png');}else assert.equal(body.model,selected);
    await assert.rejects(()=>transport.complete({system:'Fixture',prompt:'Owned',schema:{},model:'unregistered'}));
  }
});
test('model refresh is authenticated, filters catalog IDs, caches discovery and makes discovered models selectable',async()=>{
  const f=messageFixture();let discovers=0,selected='';const app=await createApp({env:messageEnv,agentLedger:new MemoryAgentBudgetLedger(),providerFactory:()=>({listModels:async()=>{discovers++;return ['mock','owned-alt','invalid model\nPRIVATE_CATALOG'];},complete:async request=>{selected=request.model;return messageOutput();}})});
  try{const token=(await app.inject('/api/config')).json().requestToken,headers={'x-workspace-token':token};assert.equal((await app.inject({method:'POST',url:'/api/agent/models',payload:{}})).statusCode,403);
    for(let i=0;i<2;i++){const response=await app.inject({method:'POST',url:'/api/agent/models',headers,payload:{}});assert.equal(response.statusCode,200);assert.deepEqual(response.json().models,['mock','owned-alt']);assert.ok(!response.body.includes('PRIVATE_CATALOG'));}assert.equal(discovers,1);
    const payload=messagePayload(f);payload.message.model='owned-alt';assert.equal((await app.inject({method:'POST',url:'/api/agent/message',headers,payload})).statusCode,200);assert.equal(selected,'owned-alt');
  }finally{await app.close();}
});
