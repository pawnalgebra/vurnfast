import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {migrateWorkspace,parseWorkspace,makePersistence} from '../client/js/storage.js';
import {createStore} from '../client/js/store.js';
import {SecretRedactor} from '../client/js/services/redactor.js';
import {validateAIOutput} from '../client/js/services/ai-schema.js';
import {policyFor,filterCandidates} from '../client/js/services/rules.js';
import {buildResearchContext} from '../client/js/services/context.js';
import {coverageAnalysis,duplicateComparison,findingChecklist} from '../client/js/services/analysis.js';
import {recommendLocalTools} from '../client/js/modules/tools.js';
import {generateIndonesianReport} from '../client/js/templates/report-id.js';
import {constrainResponse,prepareCandidates,CyberResearchAdvisor} from '../server/services/advisor.js';
import {emptyAdvice,authorizedTarget} from './fixtures.js';
test('v1 migration preserves IDs, content and original input; v2 round trip identical',async()=>{
  const legacy=JSON.parse(await readFile('data/example-workspace-v1.json','utf8')),original=JSON.stringify(legacy);
  const migrated=migrateWorkspace(legacy);assert.equal(JSON.stringify(legacy),original);assert.equal(migrated.schemaVersion,'2.0.0');
  for(const key of ['id','name','scope','hypotheses','testCases','findings','evidence','notes'])assert.deepEqual(migrated.targets[0][key],legacy.targets[0][key]);
  assert.equal(migrated.targets[0].techniques.length,20);assert.equal(migrated.targets[0].programRules.automationAllowed,false);
  const store=createStore(migrated),json=JSON.stringify(store.get());store.reset();store.replace(parseWorkspace(json));assert.equal(JSON.stringify(store.get()),json);
});
test('invalid JSON/types/IDs/references/version/AI output cannot replace state',()=>{
  const {store,target}=authorizedTarget(),before=JSON.stringify(store.get());
  for(const invalid of ['{bad',before.replace('"schemaVersion":"2.0.0"','"schemaVersion":"99"'),before.replace('"automationAllowed":false','"automationAllowed":"yes"'),before.replace('"targets":[','"__proto__":{},"targets":[')])assert.throws(()=>store.replace(parseWorkspace(invalid)));
  assert.equal(JSON.stringify(store.get()),before);
  const broken=structuredClone(store.get());broken.targets[0].aiSuggestions=[{id:crypto.randomUUID(),status:'pending',response:{}}];assert.throws(()=>migrateWorkspace(broken));
  const reference=structuredClone(store.get());reference.targets[0].testCases=[{id:crypto.randomUUID(),boundaryId:'missing'}];assert.throws(()=>migrateWorkspace(reference));
});
test('CRUD deletion cleans dependent relationships and keeps independent records',()=>{
  const {store,target}=authorizedTarget();const h=store.upsert(target.id,'hypotheses',{title:'Invariant',techniqueId:target.techniques[0].id});
  const b=store.upsert(target.id,'boundaries',{from:'Browser',to:'Worker'});const t=store.upsert(target.id,'testCases',{title:'Test',hypothesisId:h.id,techniqueId:target.techniques[0].id,boundaryId:b.id});
  const e=store.upsert(target.id,'evidence',{label:'Dummy',type:'manual-note',testCaseId:t.id});store.upsert(target.id,'testCases',{id:t.id,evidenceIds:[e.id]});
  const f=store.upsert(target.id,'findings',{title:'Draft',testCaseId:t.id,evidenceIds:[e.id]});
  store.remove(target.id,'boundaries',b.id);assert.equal(t.boundaryId,'');store.remove(target.id,'evidence',e.id);assert.deepEqual(t.evidenceIds,[]);assert.deepEqual(f.evidenceIds,[]);
  store.remove(target.id,'hypotheses',h.id);assert.equal(t.hypothesisId,'');store.remove(target.id,'testCases',t.id);assert.equal(f.testCaseId,'');migrateWorkspace(store.get());
});
test('async debounce serializes snapshots, flushes new writes, handles storage failure',async()=>{
  const written=[],saver=makePersistence(async state=>{await new Promise(r=>setTimeout(r,5));written.push(state.value);},100);
  saver.schedule({value:1});saver.schedule({value:2});const flush=saver.flush();saver.schedule({value:3});await flush;assert.deepEqual(written,[2,3]);assert.equal(saver.isDirty(),false);
  let status;const broken=makePersistence(async()=>{throw new Error('quota');});broken.subscribe(s=>status=s.status);broken.schedule({value:1});assert.equal(await broken.flush(),false);assert.equal(status,'error');assert.equal(broken.isDirty(),true);
});
test('secret redaction handles headers, key/value, JWT, session and CSRF while preserving text',()=>{
  const raw='HTTP/1.1 200 OK\nAuthorization: Bearer TOKEN123\nCookie: session=COOKIE123\nSet-Cookie: auth=COOKIE456\n{"api_key":"KEY123","password":"PASS123","session_id":"SESSION123","csrf_token":"CSRF123"}\nBearer BARETOKEN\neyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiIxMjMifQ.signature123\nemail=owned@example.test';
  const safe=SecretRedactor.redact(raw);for(const value of ['TOKEN123','COOKIE123','COOKIE456','KEY123','PASS123','SESSION123','CSRF123','BARETOKEN','signature123','owned@example.test'])assert.ok(!safe.includes(value),value);assert.ok(safe.includes('HTTP/1.1 200 OK'));
  assert.equal(SecretRedactor.context({password:'secret',nested:{tokenNote:'Authorization: token'}}).password,'[REDACTED]');
  const context=authorizedTarget().context;
  assert.deepEqual(SecretRedactor.context(context).authorization,context.authorization,'structured authorization flags survive redaction');
  assert.equal(policyFor(SecretRedactor.context(context)).canRecommend,true);
  assert.equal(SecretRedactor.context({'X-API-Key':'PRIVATE'} )['X-API-Key'],'[REDACTED]');
});
test('program rules and manual authorization constrain tool recommendations and AI candidates',()=>{
  const {target,context}=authorizedTarget();assert.equal(policyFor(context).assessment.status,'within_supplied_scope');
  assert.deepEqual(filterCandidates([{id:'manual',automationLevel:'manual'},{id:'scan',automationLevel:'automatic'},{id:'brute',credentialAttack:true},{id:'dos',requiresDos:true},{id:'third',requiresThirdParty:true}],context.programRules).map(c=>c.id),['manual']);
  const recommendations=recommendLocalTools(target,target.techniques[16].id);assert.ok(recommendations.tools.some(t=>t.id==='burp-repeater'));assert.ok(recommendations.tools.every(t=>t.automationLevel==='manual'));
  context.authorization.ownedDataOnly=false;assert.equal(policyFor(context).assessment.status,'requires_manual_review');assert.equal(prepareCandidates(context).tools.length,0);
  context.scope.outOfScope=['app.test'];assert.equal(policyFor(context).assessment.status,'outside_supplied_scope');
});
test('context builder is allowlisted, evidence/KB opt-in, no other target or config',()=>{
  const {store,target}=authorizedTarget();target.apiKey='NEVER-SEND';store.addTarget({name:'OTHER-TARGET'});store.upsert(target.id,'evidence',{label:'HTTP',content:'secret-evidence'});store.upsert(target.id,'knowledgeBase',{category:'Lessons',title:'Private lesson',content:'knowledge-note'});
  const base=buildResearchContext(target);assert.equal(base.evidence.length,0);assert.equal(base.knowledge.length,0);assert.ok(!JSON.stringify(base).includes('NEVER-SEND'));assert.ok(!JSON.stringify(base).includes('OTHER-TARGET'));
  store.upsert(target.id,'testCases',{title:'Recorded request',requestNotes:'PRIVATE_REQUEST_NOTES',responseNotes:'PRIVATE_RESPONSE_NOTES'});
  assert.ok(!JSON.stringify(buildResearchContext(target)).includes('PRIVATE_REQUEST_NOTES'));
  const selected=buildResearchContext(target,{includeEvidence:true,includeKnowledge:true});assert.equal(selected.evidence.length,1);assert.equal(selected.knowledge.length,1);
  assert.equal(selected.tests[0].requestNotes,'PRIVATE_REQUEST_NOTES');
});
test('strict AI schema rejects malformed/unknown fields and policy discards invented tools',()=>{
  const {context}=authorizedTarget(),output=emptyAdvice();validateAIOutput(output);assert.throws(()=>validateAIOutput({...output,severity:'P1'}));assert.throws(()=>validateAIOutput({...output,confidence:5}));
  output.scopeAssessment.status='outside_supplied_scope';output.toolSuggestions=[{id:'invented',name:'Imaginary Scanner',category:'api',purpose:'scan',usageMode:'manual',whyUseful:'',scopeWarning:''}];
  output.safeNextSteps=['Run brute-force attacks','Review the owned dummy object'];output.findingAnalysis.assessment='Confirmed';
  const constrained=constrainResponse(output,context,prepareCandidates(context));assert.equal(constrained.toolSuggestions.length,0);assert.equal(constrained.scopeAssessment.status,'within_supplied_scope');assert.deepEqual(constrained.safeNextSteps,['Review the owned dummy object']);assert.equal(constrained.findingAnalysis.assessment,'Unknown');
});
test('advisor redacts before provider and keeps target unchanged; LOCAL_ONLY rejects cloud',async()=>{
  const {store,context}=authorizedTarget();context.research.notes='Authorization: Bearer PRIVATE_TOKEN';let request;
  const advisor=new CyberResearchAdvisor({async complete(value){request=value;return emptyAdvice();}},{provider:'openai',redactSecrets:false});const before=JSON.stringify(store.get());
  await advisor.analyze(context,'REDACTED_CLOUD');assert.ok(!request.prompt.includes('PRIVATE_TOKEN'));assert.equal(JSON.stringify(store.get()),before);await assert.rejects(()=>advisor.analyze(context,'LOCAL_ONLY'));
});
test('coverage, duplicate analysis and Indonesian report remain factual',()=>{
  const {store,target}=authorizedTarget();const testCase=store.upsert(target.id,'testCases',{title:'Owned result',techniqueId:target.techniques[0].id,who:'Member',object:'Approval',state:'Used',result:'passed'});
  assert.equal(coverageAnalysis(target).coverage.find(c=>c.label==='Actor').covered,1);
  const finding={title:'Draft dummy',severity:'Unknown',status:'draft',actualResult:'Observed dummy only',rootCause:'Hypothesis only',evidenceIds:[]};
  const report=generateIndonesianReport(target,finding);assert.ok(report.includes('Researcher Estimate: Unknown'));assert.ok(report.includes('Hipotesis, belum terverifikasi'));assert.ok(report.includes('Evidence belum dilampirkan'));assert.ok(findingChecklist(finding).some(row=>!row.present));assert.equal(duplicateComparison(finding,{}).status,'Unknown');
});
