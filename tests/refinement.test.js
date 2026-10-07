import test from 'node:test';
import assert from 'node:assert/strict';
import {authorizedTarget,emptyAdvice} from './fixtures.js';
import {navigationGroups,routes,routeSections,routeSectionFor} from '../client/js/router.js';
import {nextResearchWork} from '../client/js/services/research-workflow.js';
import {localAdvice,localAdviceOperations} from '../client/js/services/local-advice.js';
import {CyberResearchAdvisor} from '../server/services/advisor.js';
import {buildResearchContext} from '../client/js/services/context.js';
import {validateAIOutput} from '../client/js/services/ai-schema.js';
import {parseWorkspace} from '../client/js/storage.js';
import {coverageAnalysis,compareText} from '../client/js/services/analysis.js';
import {blindScenario} from './discovery-intelligence/scenarios.js';
import {analyzeAdvancedResearch} from '../client/js/services/advanced-research.js';

test('refinement: primary navigation is bounded, deep links and contextual destinations survive',()=>{
  const visible=navigationGroups.flatMap(([,keys])=>keys);assert.equal(visible.length,18);assert.equal(new Set(visible).size,visible.length);assert.equal(routes.length,40);
  const supported=new Set(routes.map(([key])=>key));assert(visible.every(key=>supported.has(key)));
  for(const section of Object.values(routeSections))assert(section.every(([key])=>supported.has(key)));
  for(const core of ['targets','scope','target-intelligence','attack-surface','business-flows','hypotheses','tests','evidence','findings','reports'])assert(visible.includes(core));
  for(const contextual of ['actors','objects','boundaries','ai-gaps','backup','agent-history'])assert(supported.has(contextual)&&!visible.includes(contextual));
});
test('navigation: every contextual route and legacy AI alias resolves its persistent tab group',()=>{
  for(const [name,section] of Object.entries(routeSections))for(const [route] of section)assert.equal(routeSectionFor(route),name);
  for(const route of ['ai-techniques','ai-tools','ai-gaps','ai-findings'])assert.equal(routeSectionFor(route),'assistant');
  for(const route of ['dashboard','targets','evidence','missing-route'])assert.equal(routeSectionFor(route),null);
});
test('refinement: a manual research story advances from hypothesis to evidence, review and report without AI',()=>{
  const {store,target}=authorizedTarget(),h=store.upsert(target.id,'hypotheses',{title:'Owned control hypothesis',invariant:'Owner permission required',queue:'Next'});
  assert(nextResearchWork(target).some(t=>t.id===h.id&&t.kind==='Hypothesis'));
  const t=store.upsert(target.id,'testCases',{title:'Owned matched test',hypothesisId:h.id,result:'not-tested'});assert.equal(nextResearchWork(target)[0].kind,'Test');
  store.upsert(target.id,'testCases',{id:t.id,result:'interesting',actualResult:'Recorded dummy response'});assert.equal(nextResearchWork(target)[0].kind,'Evidence');
  const e=store.upsert(target.id,'evidence',{label:'Dummy response',content:'Owned response',testCaseId:t.id});store.upsert(target.id,'testCases',{id:t.id,evidenceIds:[e.id]});assert.equal(nextResearchWork(target)[0].kind,'Analyze');
  const f=store.upsert(target.id,'findings',{title:'Review dummy relationship',testCaseId:t.id,evidenceIds:[e.id],status:'investigating'});assert.equal(nextResearchWork(target)[0].kind,'Review');
  store.upsert(target.id,'findings',{id:f.id,status:'confirmed'});assert.equal(nextResearchWork(target)[0].kind,'Report');
  const before=JSON.stringify(store.get());nextResearchWork(target);assert.equal(JSON.stringify(store.get()),before);assert.equal(JSON.stringify(parseWorkspace(before)),before);
});
test('refinement: scope uncertainty takes precedence and no analysis automatically confirms a finding',()=>{
  const {store,target}=authorizedTarget();store.upsert(target.id,'findings',{title:'Researcher confirmed dummy',status:'confirmed'});target.scope.guard.data=false;
  const before=JSON.stringify(target);assert.equal(nextResearchWork(target)[0].route,'scope');assert.equal(JSON.stringify(target),before);
});
test('refinement: four exact advisor operations use local policy/records with zero provider calls',async()=>{
  const {context}=authorizedTarget();let calls=0;const advisor=new CyberResearchAdvisor({complete:async()=>{calls++;return emptyAdvice();}},{provider:'ollama',redactSecrets:true});
  for(const operation of localAdviceOperations){const result=await advisor.analyze({...context,operation},'LOCAL_ONLY');validateAIOutput(result);assert.equal(result.scopeAssessment.status,'within_supplied_scope');assert.equal(result.findingAnalysis.assessment,'Unknown');}
  assert.equal(calls,0);assert.equal(localAdvice({...context,operation:'analyze_finding'}),null);
  context.authorization.ownedDataOnly=false;const blocked=localAdvice({...context,operation:'analyze_scope'});assert.equal(blocked.scopeAssessment.status,'requires_manual_review');assert.equal(blocked.researchPriority.scopeConfidence,0);
});
test('refinement: repeated advisor inference is reused; changed evidence, rules, operation or model cause fresh calls',async()=>{
  const {context}=authorizedTarget();let calls=0;const config={provider:'ollama',model:'cheap',redactSecrets:true},advisor=new CyberResearchAdvisor({complete:async()=>{calls++;return emptyAdvice();}},config);
  const first=await advisor.analyze(context,'LOCAL_ONLY');first.missingContext.push('Changed consumer copy');const second=await advisor.analyze(context,'LOCAL_ONLY');assert.equal(calls,1);assert(!second.missingContext.includes('Changed consumer copy'));
  context.evidence.push({type:'manual-note',label:'New control',description:'',content:'Different raw observation'});await advisor.analyze(context,'LOCAL_ONLY');assert.equal(calls,2);
  context.programRules.automationAllowed=!context.programRules.automationAllowed;await advisor.analyze(context,'LOCAL_ONLY');assert.equal(calls,3);
  await advisor.analyze({...context,operation:'analyze_finding'},'LOCAL_ONLY');assert.equal(calls,4);config.model='reasoning';await advisor.analyze(context,'LOCAL_ONLY');assert.equal(calls,5);
});
test('refinement: stable actor/object coverage survives renamed labels; legacy snapshots still work',()=>{
  const {store,target}=authorizedTarget(),actor=target.actors[0],object=target.objects[0];store.upsert(target.id,'testCases',{title:'Stored identities',actorId:actor.id,objectId:object.id,who:actor.name,object:object.name,result:'passed'});
  actor.name='Renamed member';object.name='Renamed object';const coverage=coverageAnalysis(target).coverage;assert.equal(coverage.find(c=>c.label==='Actor').covered,1);assert.equal(coverage.find(c=>c.label==='Object').covered,1);
  target.testCases[0].actorId='';target.testCases[0].who=actor.name;assert.equal(coverageAnalysis(target).coverage.find(c=>c.label==='Actor').covered,1);
});
test('refinement: comparison preserves union ordering and duplicate-line behavior at larger input sizes',()=>{
  assert.deepEqual(compareText('a\nb\na','b\nc'),[{line:'a',status:'left-only'},{line:'b',status:'same'},{line:'c',status:'right-only'}]);
  const left=Array.from({length:6000},(_,i)=>'line '+i),right=left.slice(3000).concat(['new line']);const result=compareText(left.join('\n'),right.join('\n'));assert.equal(result.length,6001);assert.equal(result[0].status,'left-only');assert.equal(result[3000].status,'same');assert.equal(result.at(-1).status,'right-only');
});
test('refinement: one analysis cache tracks mapping changes and preserves existing normalized research on round-trip',()=>{
  const {store,target}=blindScenario(0),first=analyzeAdvancedResearch(target),actor=target.actors[0];actor.name='Updated mapping label';const second=analyzeAdvancedResearch(target);
  assert(second.relevantGraph.nodes.some(n=>n.referenceId===actor.id&&n.label==='Updated mapping label'));assert(!first.relevantGraph.nodes.some(n=>n.referenceId===actor.id&&n.label==='Updated mapping label'));
  const text=JSON.stringify(store.get()),restored=parseWorkspace(text);assert.equal(JSON.stringify(restored),text);assert.equal(restored.targets[0].researchModel.constraints.length,1);assert.equal(restored.targets[0].researchModel.events.length,5);
});
