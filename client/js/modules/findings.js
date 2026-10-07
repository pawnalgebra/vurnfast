import {el,button,badge,empty} from '../utils.js';
import {editDialog,formulaFields,formulaSuggestions} from '../forms.js';
import {techniqueOptions,researchFilters} from './hypotheses.js';
import {evidenceSelector,extractEvidenceIds,editEvidence} from './evidence.js';
import {routeTo} from '../router.js';
export const findingStatuses=['draft','investigating','confirmed','reported','resolved','duplicate','rejected','out-of-scope'];
export const severities=['Unknown','P1','P2','P3','P4','P5'];
export function editFinding(ctx,target,row,defaults={}) {
  const fields=[['title','Title','required'],['status','Status','select',findingStatuses],['severity','Severity · Researcher Estimate','select',severities],['affectedComponent','Affected Component'],['affectedVersion','Affected Version'],['vulnerabilityClass','Vulnerability Class'],['techniqueId','Technique','select',techniqueOptions(target)],['testCaseId','Source Test Case','select',[['','— Tanpa test case —'],...target.testCases.map(t=>[t.id,t.title])]],['startingAuthority','Starting Authority','textarea'],['securityRestriction','Security Restriction','textarea'],['protectedResource','Protected Resource'],['unauthorizedOutcome','Unauthorized Outcome','textarea'],['rootCause','Root Cause Hypothesis (belum terverifikasi)','textarea'],['impact','Impact (faktual; jangan melebihkan)','textarea'],['preconditions','Preconditions','textarea'],['steps','Steps to Reproduce (satu per baris)','textarea'],['expectedResult','Expected Result','textarea'],['actualResult','Actual Result','textarea'],['mitigation','Mitigation Suggestion','textarea'],['researchNotes','Research Notes','textarea']];
  fields.splice(8,0,...formulaFields(target));
  editDialog(row?'Edit Finding':'Create Finding',fields,{status:'draft',severity:'Unknown',affectedComponent:target.asset,affectedVersion:target.version,...defaults,...row},values=>{const {clean,evidenceIds}=extractEvidenceIds(values);ctx.store.upsert(target.id,'findings',{...(defaults.knowledgeLinks?{knowledgeLinks:defaults.knowledgeLinks}:{}),...row,...clean,evidenceIds});ctx.render();},form=>{formulaSuggestions(form,target);evidenceSelector(form,target,row?.evidenceIds||defaults.evidenceIds||[]);});
}
export function promoteTest(ctx,target,test) {
  const hypothesis=target.hypotheses.find(h=>h.id===test.hypothesisId);
  // PURPOSE: Promotion opens an editable draft; status and severity are never claimed automatically.
  editFinding(ctx,target,null,{...(test.knowledgeLinks?{knowledgeLinks:{...test.knowledgeLinks}}:{}),title:test.title,testCaseId:test.id,techniqueId:test.techniqueId||hypothesis?.techniqueId||'',who:test.who,what:test.what,object:test.object,state:test.state,authority:test.authority,context:test.context,startingAuthority:[test.who,test.authority,test.context].filter(Boolean).join(' / '),securityRestriction:hypothesis?.invariant||'',protectedResource:test.object,preconditions:test.preconditions,steps:test.steps,expectedResult:test.expectedResult,actualResult:test.actualResult,unauthorizedOutcome:test.actualResult,evidenceIds:[...(test.evidenceIds||[])],rootCause:hypothesis?.potentialFailure||'',researchNotes:'Dipromosikan dari pengujian manual. Result: '+test.result+'. Verifikasi temuan sebelum menetapkan status confirmed.'});
}
export function renderFindings(ctx,target) {
  const root=el('div',{},ctx.heading('Findings','Temuan yang dapat ditinjau, dilengkapi evidence, lalu disusun menjadi laporan.',button('+ Create Finding',()=>editFinding(ctx,target),'primary')));
  root.append(researchFilters(ctx,target,'findings',findingStatuses,[['severity','Severity',severities]]));
  const rows=ctx.filtered(target.findings,'findings');if(!rows.length)root.append(empty());
  for(const row of rows)root.append(el('article',{class:'record','data-agent-kind':'finding','data-agent-id':row.id},el('div',{class:'record-header'},el('h3',{},row.title),el('div',{class:'actions'},button('Generate Report',()=>{ctx.reportFindingId=row.id;routeTo('reports');},'primary'),button('Attach Evidence',()=>editEvidence(ctx,target,null,{findingId:row.id})),button('Edit',()=>editFinding(ctx,target,row)),ctx.deleteButton(target,'findings',row))),el('div',{class:'badges'},badge(row.status),badge('Researcher Estimate: '+row.severity),badge(row.vulnerabilityClass||'Belum diklasifikasi')),el('dl',{class:'details'},el('dt',{},'Unauthorized Outcome'),el('dd',{},row.unauthorizedOutcome||'—'),el('dt',{},'Impact'),el('dd',{},row.impact||'Belum dicatat'),el('dt',{},'Root Cause · hipotesis'),el('dd',{},row.rootCause||'Belum dicatat')),el('div',{class:'badges'},(row.evidenceIds||[]).map(id=>badge(target.evidence.find(e=>e.id===id)?.label||'Evidence')))));
  return root;
}
