import {policyFor} from './rules.js';
import {buildResearchContext} from './context.js';
import {ResearchPriorityService} from './research-priority.js';
// One manual workflow for both dashboards. Suggestions never execute tests or set finding status.
export function nextResearchWork(target,{limit=5}={}){
  if(!target)return [{kind:'Target',route:'targets',title:'Create Target',reason:'Separate program scope and research records.'}];
  if(!policyFor(buildResearchContext(target)).canRecommend)return [{kind:'Scope',route:'scope',title:'Review Scope & Authorization',reason:'Scope, owned testing accounts and data must be clear before planning tests.'}];
  const tasks=[],add=(kind,route,row,reason)=>tasks.push({kind,route,id:row.id,title:row.title||row.label,reason});
  const tests=target.testCases,rawIds=new Set(target.evidence.map(e=>e.id));
  for(const finding of target.findings.filter(f=>!['rejected','duplicate','out-of-scope','reported','resolved'].includes(f.status))){
    if(finding.status==='confirmed')add('Report','reports',finding,'Review the factual draft and evidence before sharing.');
    else add('Review','findings',finding,'Check supporting evidence, alternative explanations and duplicate risk.');
  }
  for(const row of tests.filter(t=>t.result&&t.result!=='not-tested')){
    const linked=(row.evidenceIds||[]).filter(id=>rawIds.has(id));
    if(!linked.length&&!target.evidence.some(e=>e.testCaseId===row.id))add('Evidence','tests',row,'Attach the observed result and a matched control to this test.');
    else if(['failed','interesting','vulnerability'].includes(row.result)&&!target.findings.some(f=>f.testCaseId===row.id||f.testIds?.includes(row.id)))add('Analyze','tests',row,'Review the observed result; promote to an editable finding only when appropriate.');
  }
  for(const row of ResearchPriorityService.rank(tests.filter(t=>!t.result||t.result==='not-tested')))add('Test','tests',row,'Run the authorized manual plan and record the actual result.');
  for(const row of ResearchPriorityService.rank(target.hypotheses.filter(h=>!['rejected','duplicate','out-of-scope','confirmed'].includes(h.status)&&!tests.some(t=>t.hypothesisId===h.id))))add('Hypothesis','hypotheses',row,'Refine the invariant and create a discriminating manual test.');
  if(!tasks.length)tasks.push({kind:'Hypothesis',route:'hypotheses',title:'Build the next hypothesis',reason:'Use target understanding, actors/objects and business flows; AI is optional.'});
  return tasks.slice(0,Math.max(1,Math.min(10,limit)));
}
