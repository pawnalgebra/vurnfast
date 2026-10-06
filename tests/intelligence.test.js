import test from 'node:test';
import assert from 'node:assert/strict';
import {DOMAIN_PACKS} from '../client/js/domain-data.js';
import {validateDomainPack,validateKnowledgeItem} from '../client/js/services/domain-schema.js';
import {createStore} from '../client/js/store.js';
import {parseWorkspace,migrateWorkspace} from '../client/js/storage.js';
import {DomainPackRepository,TargetIntelligenceService,DomainKnowledgeService,BusinessFlowService,KnowledgeGraphService,createManualPack} from '../client/js/services/domain-knowledge.js';
import {knowledgeSearch} from '../client/js/services/knowledge-search.js';
import {buildKnowledgeContext} from '../client/js/services/knowledge-context.js';
import {validateKnowledgeResponse,KNOWLEDGE_RESPONSE_SCHEMA} from '../client/js/services/knowledge-schema.js';
import {constrainKnowledge,TargetKnowledgeAIService} from '../server/services/target-knowledge.js';
import {createApp} from '../server/app.js';
import {Script} from 'node:vm';
import {readFile} from 'node:fs/promises';

export const knowledgeFixture=()=>({items:[{id:'draft-flow',kind:'company-overview',title:'Company overview',content:'Unsupplied company architecture',sourceType:'ai',source:'Model',confidence:.6,verified:false,notes:'Inference',domainId:'finance',flowId:'',invariantId:'',techniqueId:'',steps:[]}],suggestedDomains:[{id:'finance',reason:'Based on supplied notes',sourceType:'ai',source:'Model',confidence:.6,verified:false,notes:'Classification suggestion'}],unknownInformation:[]});
function setup(){const store=createStore(),target=store.addTarget({name:'Example Finance',asset:'finance.example.test'});store.updateTarget(target.id,{scope:{inScope:'finance.example.test',guard:{inScope:true,account:true,data:true}}});TargetIntelligenceService.update(store,target,{primaryDomainId:'finance'});return {store,target,pack:DomainPackRepository.get(store.get(),'finance')};}
test('generated offline compatibility bundle parses as one script',async()=>{new Script(await readFile('client/js/bundle.js','utf8'));});
test('13 domain packs validate their provenance, glossary and complete relationships',()=>{
  assert.equal(DOMAIN_PACKS.length,13);for(const pack of DOMAIN_PACKS)validateDomainPack(pack);
  const finance=DOMAIN_PACKS.find(p=>p.id==='finance');assert.equal(finance.terminology.length,22);assert.ok(finance.businessFlows[0].steps.includes('Reconciliation'));
  for(const pack of DOMAIN_PACKS){assert.ok(pack.actors.length&&pack.businessObjects.length&&pack.securityInvariants.length&&pack.relevantTechniques.length);assert.ok(pack.actors.every(a=>a.sourceType==='domain'&&!a.verified));}
  const invalid=structuredClone(finance);invalid.businessFlows[0].actorIds=['missing'];assert.throws(()=>validateDomainPack(invalid));
  const nested=JSON.parse(JSON.stringify(finance));nested.extra=JSON.parse('{"constructor":{"prototype":{"polluted":true}}}');assert.throws(()=>validateDomainPack(nested),/tidak aman/);
  assert.ok(finance.businessFlows.some(f=>f.steps.includes('Refund Completed')));
});
test('domain selection and profile remain researcher input; conversion preserves business relationships',()=>{
  const {store,target,pack}=setup();TargetIntelligenceService.saveProfile(store,target,{company:'Example Finance',businessModel:'Lab API'});assert.equal(target.intelligence.profile.company.sourceType,'researcher');assert.equal(target.intelligence.profile.company.verified,false);
  const flow=pack.businessFlows[0],candidate=BusinessFlowService.researchCandidates(pack,flow);assert.ok(candidate.invariant&&candidate.question);
  const defaults=KnowledgeGraphService.hypothesisDefaults(target,pack,candidate.question);assert.equal(defaults.knowledgeLinks.flowId,flow.id);assert.equal(defaults.invariant,candidate.invariant.content);assert.ok(defaults.techniqueId);
  assert.equal(target.hypotheses.length,0,'conversion preview does not save before researcher');
  const accepted=TargetIntelligenceService.accept(store,target,candidate.question);assert.equal(accepted.sourceType,'domain');assert.equal(accepted.verified,false);
  const lastTransition=flow.transitions.at(-1),selected=BusinessFlowService.researchCandidates(pack,flow,lastTransition.id);
  assert.equal(KnowledgeGraphService.hypothesisDefaults(target,pack,selected.question).what,lastTransition.action,'selected transition survives question conversion');
  const draftFlow={...DomainKnowledgeService.asItem(flow,'flow',pack),id:'ai-flow',sourceType:'ai',title:'Reviewed AI flow',steps:['Authorize','Execute']};
  const draftInvariant={...DomainKnowledgeService.asItem(pack.securityInvariants[0],'invariant',pack),id:'ai-invariant',sourceType:'ai'};
  TargetIntelligenceService.accept(store,target,draftFlow);TargetIntelligenceService.accept(store,target,draftInvariant);
  const draftQuestion={...candidate.question,sourceType:'ai',flowId:'ai-flow',invariantId:'ai-invariant'};
  const fromAI=KnowledgeGraphService.hypothesisDefaults(target,pack,draftQuestion);assert.match(fromAI.context,/Reviewed AI flow/);assert.equal(fromAI.what,'Authorize → Execute');assert.equal(fromAI.invariant,draftInvariant.content);
  const before=JSON.stringify(store.get());store.reset();store.replace(parseWorkspace(before));assert.equal(JSON.stringify(store.get()),before);
});
test('custom pack is portable, overrides are local, invalid knowledge cannot replace workspace',()=>{
  const {store,target}=setup();const pack=createManualPack({name:'Lab Domain',actorsText:'Owner\nMember',objectsText:'Export',flowsText:'Create → Authorize → Execute',invariantsText:'Revoked Member must lose export access',termsText:'Export | Dummy file | Permission boundary | Resource'});
  DomainPackRepository.save(store,pack);assert.ok(DomainPackRepository.get(store.get(),pack.id));assert.equal(target.intelligence.items.length,0);
  const before=JSON.stringify(store.get()),bad=structuredClone(store.get());bad.domainPacks[0].actors[0].confidence=2;assert.throws(()=>store.replace(bad));assert.equal(JSON.stringify(store.get()),before);
  const item=DomainKnowledgeService.asItem(pack.securityInvariants[0],'invariant',pack);assert.throws(()=>validateKnowledgeItem({...item,sourceType:'target',verified:true,source:''}));assert.throws(()=>validateKnowledgeItem({...item,sourceType:'ai',verified:true}));
});
test('knowledge search connects reconciliation terminology to flows, invariants and techniques',()=>{
  const {store}=setup();const results=knowledgeSearch(store.get(),'reconciliation');for(const expected of ['Terminology','Business Flow','Security Invariant','Related Technique'])assert.ok(results.some(r=>r.category.includes(expected)),expected);
});
test('selected knowledge context excludes unrelated targets, evidence, config and nonselected domains',()=>{
  const {store,target,pack}=setup();store.addTarget({name:'DO-NOT-SEND-OTHER-TARGET'});store.upsert(target.id,'evidence',{label:'PRIVATE_EVIDENCE',content:'PRIVATE_RAW_TEXT'});target.privateApiKey='NEVER_CONFIG';
  const context=buildKnowledgeContext(store.get(),target,{domainId:'finance',term:'Settlement',flowId:pack.businessFlows[0].id});const text=JSON.stringify(context);
  for(const secret of ['DO-NOT-SEND-OTHER-TARGET','PRIVATE_RAW_TEXT','NEVER_CONFIG'])assert.ok(!text.includes(secret));assert.equal(context.domains.length,1);assert.equal(context.domains[0].terminology.length,1);assert.equal(context.domains[0].terminology[0].term,'Settlement');
  assert.equal(context.domainCatalog.length,13,'catalog includes labels, not all pack contents');
});
test('knowledge output cannot establish company facts, invented domains, or forbidden technique candidates',()=>{
  const {store,target}=setup(),context=buildKnowledgeContext(store.get(),target,{domainId:'finance'}),output=knowledgeFixture();output.suggestedDomains.push({...output.suggestedDomains[0],id:'invented'});output.items[0].techniqueId='invented';
  const safe=constrainKnowledge(output,context);assert.match(safe.items[0].content,/Unknown/);assert.equal(safe.items[0].confidence,0);assert.equal(safe.items[0].sourceType,'ai');assert.equal(safe.items[0].verified,false);assert.equal(safe.items[0].techniqueId,'');assert.equal(safe.suggestedDomains.length,1);
  assert.throws(()=>validateKnowledgeResponse({...output,items:[{...output.items[0],sourceType:'target',verified:true}]}));
});
test('knowledge service redacts context and never mutates research; provider schema is separate',async()=>{
  const {store,target}=setup(),context=buildKnowledgeContext(store.get(),target,{domainId:'finance',notes:'Authorization: Bearer PRIVATE_KNOWLEDGE_TOKEN'});let sent;
  const service=new TargetKnowledgeAIService({complete:async request=>{sent=request;return knowledgeFixture();}},{provider:'openai',redactSecrets:false});const before=JSON.stringify(store.get());await service.analyze(context,'REDACTED_CLOUD');assert.ok(!sent.prompt.includes('PRIVATE_KNOWLEDGE_TOKEN'));assert.deepEqual(sent.schema,KNOWLEDGE_RESPONSE_SCHEMA);assert.equal(JSON.stringify(store.get()),before);await assert.rejects(()=>service.analyze(context,'LOCAL_ONLY'));
});
test('knowledge API obeys disabled state, local token, privacy, schema and containment',async()=>{
  const {store,target,pack}=setup();TargetIntelligenceService.saveProfile(store,target,{company:'Example Finance Lab'});TargetIntelligenceService.accept(store,target,BusinessFlowService.researchCandidates(pack,pack.businessFlows[0]).question);
  const context=buildKnowledgeContext(store.get(),target,{domainId:'finance'});
  for(const enabled of [false,true]){
    let calls=0;const app=await createApp({env:{AI_ENABLED:enabled?'true':'false',AI_PROVIDER:'ollama',OLLAMA_MODEL:'mock-model',AI_PRIVACY_MODE:'LOCAL_ONLY'},providerFactory:()=>({complete:async()=>{calls++;return knowledgeFixture();}})});
    try{const token=(await app.inject('/api/config')).json().requestToken;const result=await app.inject({method:'POST',url:'/api/knowledge',headers:{'x-workspace-token':token},payload:{context,privacyMode:'LOCAL_ONLY'}});assert.equal(result.statusCode,enabled?200:503,result.body);assert.equal(calls,enabled?1:0);if(enabled){assert.equal(result.json().response.items[0].verified,false);assert.equal((await app.inject({method:'POST',url:'/api/knowledge',headers:{'x-workspace-token':token},payload:{context:{},privacyMode:'LOCAL_ONLY'}})).statusCode,400);
      const malformed=structuredClone(context);malformed.domains[0].businessFlows=[{id:'bad'}];assert.equal((await app.inject({method:'POST',url:'/api/knowledge',headers:{'x-workspace-token':token},payload:{context:malformed,privacyMode:'LOCAL_ONLY'}})).statusCode,400);assert.equal(calls,1,'malformed domain is rejected before provider');
    }}
    finally{await app.close();}
  }
});
