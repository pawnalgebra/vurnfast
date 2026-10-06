import {el,button,badge,formulaView,empty,now,dateLabel} from '../utils.js';
import {editDialog,formulaFields,formulaSuggestions} from '../forms.js';
import {techniqueOptions,researchFilters} from './hypotheses.js';
import {editEvidence,evidenceSelector,extractEvidenceIds} from './evidence.js';
import {promoteTest} from './findings.js';
export const resultOptions=[['not-tested','NOT TESTED'],['passed','PASS · kontrol bekerja'],['failed','FAIL · invariant gagal'],['interesting','INCONCLUSIVE · perlu investigasi'],['vulnerability','VULNERABILITY · hasil dikonfirmasi peneliti']];
export const resultLabel=value=>resultOptions.find(r=>r[0]===value)?.[1]||value;
export function editTest(ctx,target,row,hypothesis) {
  const fields=[['title','Title','required'],['hypothesisId','Hypothesis','select',[['','— Tanpa hypothesis —'],...target.hypotheses.map(h=>[h.id,h.title])]],['techniqueId','Technique','select',techniqueOptions(target)],['preconditions','Preconditions','textarea'],['steps','Steps (satu langkah per baris)','textarea'],['expectedResult','Expected Result','textarea'],['actualResult','Actual Result','textarea'],...formulaFields(target),['requestNotes','Request Notes','textarea'],['responseNotes','Response Notes','textarea'],['result','Security Control','select',resultOptions],['timestamp','Timestamp (ISO / catatan waktu)']];
  const defaults={result:'not-tested',timestamp:now()};
  fields.push(['boundaryId','Trust Boundary','select',[['','— Tanpa boundary —'],...target.boundaries.map(b=>[b.id,b.from+' → '+b.to])]],['notes','Research Notes','textarea']);
  if(hypothesis) {for(const key of ['who','what','object','state','authority','context','techniqueId'])defaults[key]=hypothesis[key]||'';defaults.hypothesisId=hypothesis.id;defaults.title=hypothesis.title;defaults.expectedResult=hypothesis.expectedBehavior;defaults.steps=target.techniques.find(t=>t.id===hypothesis.techniqueId)?.testTemplate||'';}
  editDialog(row?'Edit Test Case':'Create Test Case',fields,{...defaults,...row},values=>{const {clean,evidenceIds}=extractEvidenceIds(values);ctx.store.upsert(target.id,'testCases',{...row,...clean,evidenceIds});ctx.render();},form=>{formulaSuggestions(form,target);evidenceSelector(form,target,row?.evidenceIds||[]);});
}
export function renderTests(ctx,target) {
  const root=el('div',{},ctx.heading('Test Cases','Catat langkah dan hasil pengujian manual. FAIL berarti security invariant gagal.',button('+ Create Test Case',()=>editTest(ctx,target),'primary')));
  root.append(ctx.filters('tests',[['techniqueId','Technique',target.techniques.map(t=>[t.id,t.name])],['result','Security Control',resultOptions],['who','Actor',target.actors.map(a=>a.name)],['object','Object',target.objects.map(o=>o.name)]]));
  const rows=ctx.filtered(target.testCases,'tests');if(!rows.length)root.append(empty());
  for(const row of rows)root.append(el('article',{class:'record'},el('div',{class:'record-header'},el('h3',{},row.title),el('div',{class:'actions'},button('Attach Evidence',()=>editEvidence(ctx,target,null,{testCaseId:row.id})),button('Promote to Finding',()=>promoteTest(ctx,target,row),'primary'),button('Edit',()=>editTest(ctx,target,row)),ctx.deleteButton(target,'testCases',row))),el('div',{class:'badges'},badge(resultLabel(row.result)),badge(dateLabel(row.timestamp)),badge(target.hypotheses.find(h=>h.id===row.hypothesisId)?.title||'Tanpa hypothesis')),formulaView(row),el('details',{class:'technique-details'},el('summary',{},'Langkah, hasil, dan evidence'),el('dl',{class:'details'},['preconditions','steps','expectedResult','actualResult','requestNotes','responseNotes'].map(key=>[el('dt',{},({preconditions:'Preconditions',steps:'Steps',expectedResult:'Expected Result',actualResult:'Actual Result',requestNotes:'Request Notes',responseNotes:'Response Notes'})[key]),el('dd',{},row[key]||'—')])),el('div',{class:'badges'},(row.evidenceIds||[]).map(id=>badge(target.evidence.find(e=>e.id===id)?.label||'Evidence'))))));
  return root;
}
