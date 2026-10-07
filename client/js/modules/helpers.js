import {el,button,panel,empty} from '../utils.js';
import {field,editDialog} from '../forms.js';
import {HELPER_KB} from '../knowledge-data.js';
import {SecretRedactor} from '../services/redactor.js';
import {buildResearchContext} from '../services/context.js';
import {policyFor} from '../services/rules.js';
import {compareText,duplicateComparison,findingChecklist} from '../services/analysis.js';
import {editHypothesis} from './hypotheses.js';
import {coveragePanels} from './coverage.js';
import {routeTo} from '../router.js';
import {helperFeatures} from '../feature-registry.js';
// MODULE: Local manual helper tools. Inputs never produce network requests or target actions.
export function renderHelpers(ctx,target) {
  const root=el('div',{},ctx.heading('Internal Research Helpers','Bangun catatan dan bandingkan observasi secara lokal.'));
  const select=el('select',{'aria-label':'Internal Helper'},HELPER_KB.map(h=>el('option',{value:h.id,hidden:['trust-boundary','report-builder','gap-analyzer'].includes(h.id)&&ctx.helperId!==h.id},h.name)));select.value=ctx.helperId||'authorization-matrix';select.addEventListener('change',()=>{ctx.helperId=select.value;ctx.render();});root.append(panel('Select helper',select));
  const kind=select.value;
  root.append(ctx.help(helperFeatures[kind]));
  if(kind==='authorization-matrix'||kind==='state-transition') {
    const definitions=kind==='authorization-matrix'?[['who','Actor','required'],['object','Object','required'],['what','Action','required'],['authority','Required Authority'],['expectedResult','Expected permission / invariant','textarea']]:[['from','From State','required'],['to','To State','required'],['what','Action'],['authority','Required Authority'],['invariant','Security Invariant','textarea'],['notes','Notes','textarea']];
    const edit=row=>editDialog('Manual '+(kind==='authorization-matrix'?'Authorization Matrix':'State Transition'),definitions,row||{},values=>{ctx.store.upsert(target.id,'helperRecords',{...row,...values,type:kind});ctx.render();});
    root.append(panel('Document expected controls',button('+ Add Row',()=>edit(),'primary')));
    const rows=target.helperRecords.filter(row=>row.type===kind);
    if(!rows.length)root.append(empty());
    for(const row of rows)root.append(panel(kind==='authorization-matrix'?row.who+' → '+row.what+' → '+row.object:row.from+' → '+row.to,el('p',{class:'muted'},'Authority: '+(row.authority||'Unknown')),el('pre',{},row.expectedResult||row.invariant||''),el('p',{},row.notes||''),el('div',{class:'actions'},button('Review Hypothesis',()=>editHypothesis(ctx,target,null,{who:row.who||'',what:row.what||'',object:row.object||'',state:row.from||'',authority:row.authority||'',invariant:row.expectedResult||row.invariant||'',expectedBehavior:row.expectedResult||row.invariant||'',context:row.to?'Expected transition to '+row.to:'',title:'Review '+(row.what||'expected control'),notes:row.notes||''})),button('Edit',()=>edit(row)),ctx.deleteButton(target,'helperRecords',row))));
  }else if(kind==='trust-boundary')root.append(panel('Trust Boundary Mapper',el('p',{},'From → To, channel, authority, trust, dan notes disimpan di target.'),button('Open Trust Boundaries',()=>routeTo('boundaries'),'primary')));
  else if(kind==='evidence-comparator') {
    const form=el('form',{class:'form-grid'});const left=field(form,['left','Evidence A','textarea']),right=field(form,['right','Evidence B','textarea']);
    for(const [side,input] of [['left',left],['right',right]]) {const picker=field(form,[side+'Id','Use stored evidence','select',[['','— Paste text —'],...target.evidence.map(e=>[e.id,e.label])]]);picker.addEventListener('change',()=>input.value=target.evidence.find(e=>e.id===picker.value)?.content||'');}
    const result=el('div');form.addEventListener('submit',event=>{event.preventDefault();result.replaceChildren(el('pre',{},compareText(left.value,right.value).map(row=>({same:'  ','left-only':'− ','right-only':'+ '}[row.status])+row.line).join('\n')));});form.append(el('button',{type:'submit',class:'primary wide'},'Compare Evidence'));root.append(panel('Local text comparison',form,result));
  }else if(kind==='secret-redactor') {
    const input=el('textarea',{'aria-label':'Text to redact',placeholder:'Paste text untuk preview redaksi lokal…'}),output=el('pre');
    root.append(panel('Secret Redactor',el('p',{class:'notice'},'Raw input hanya berada di form ini; tidak disimpan. Review hasil redaksi sebelum dipakai sebagai evidence atau dikirim ke provider.'),input,button('Redact Preview',()=>output.textContent=SecretRedactor.redact(input.value),'primary'),output,button('Save Redacted Note',()=>{if(!output.textContent){ctx.toast('Buat redacted preview terlebih dahulu.');return;}ctx.store.upsert(target.id,'notes',{type:'redacted',title:'Redacted helper note',content:output.textContent});ctx.toast('Hasil redaksi disimpan ke Notes.');})));
  }else if(kind==='hypothesis-generator') {
    const picker=el('select',{'aria-label':'Technique for hypothesis'},target.techniques.map(t=>el('option',{value:t.id},t.name)));
    root.append(panel('Template Hypothesis Generator',picker,button('Preview / Edit Hypothesis',()=>{const t=target.techniques.find(t=>t.id===picker.value);if(!t)return;editHypothesis(ctx,target,null,{title:'Uji invariant: '+t.name,techniqueId:t.id,invariant:t.securityInvariant||'',potentialFailure:t.hypothesisTemplate,notes:t.testTemplate});},'primary')));
  }else if(kind==='scope-checker') {const policy=policyFor(buildResearchContext(target));root.append(panel('Scope Checker',el('p',{},policy.assessment.status),el('p',{class:'muted'},policy.assessment.reason),el('ul',{},policy.restrictions.map(rule=>el('li',{},rule))),button('Edit Scope & Rules',()=>routeTo('scope'))));}
  else if(kind==='finding-checklist'||kind==='duplicate-comparator') {
    if(!target.findings.length){root.append(empty('Buat finding terlebih dahulu.'));return root;}
    const findingPicker=el('select',{'aria-label':'Finding for helper'},target.findings.map(f=>el('option',{value:f.id},f.title)));findingPicker.value=ctx.helperFindingId||target.findings[0].id;findingPicker.addEventListener('change',()=>{ctx.helperFindingId=findingPicker.value;ctx.render();});root.append(panel('Finding',findingPicker));
    const finding=target.findings.find(f=>f.id===findingPicker.value)||target.findings[0];
    if(kind==='finding-checklist')root.append(panel('Evidence Required',el('ul',{},findingChecklist(finding).map(row=>el('li',{},(row.present?'✓ ':'○ ')+row.label))),el('p',{class:'muted'},'Checklist kelengkapan tidak menetapkan validity atau severity.')));
    else {
      const candidates=[...target.findings.filter(f=>f.id!==finding.id),...target.knowledgeBase.filter(k=>['Disclosed Reports','Finding Patterns','False Positives'].includes(k.category))];
      const form=el('form',{class:'form-grid'}),picker=field(form,['candidate','Previous finding / KB report','select',[['','— Isi kandidat manual / known issues —'],...candidates.map(c=>[c.id,c.title])]]);
      const inputs={};for(const [key,label] of [['rootCause','Root Cause'],['securityRestriction','Security Boundary'],['vulnerabilityClass','Primitive'],['affectedComponent','Affected Component'],['impact','Impact']])inputs[key]=field(form,[key,label,'textarea'],key==='rootCause'?target.scope.knownIssues||'':'');
      picker.addEventListener('change',()=>{const candidate=candidates.find(c=>c.id===picker.value)||{};for(const [key,input] of Object.entries(inputs))input.value=candidate[key]||'';});
      const result=el('div');form.addEventListener('submit',event=>{event.preventDefault();const candidate=Object.fromEntries(Object.entries(inputs).map(([key,input])=>[key,input.value]));const comparison=duplicateComparison(finding,candidate);result.replaceChildren(panel(comparison.status,el('p',{},'Text similarity: '+comparison.score+'%'),el('p',{class:'muted'},comparison.note)));});form.append(el('button',{type:'submit',class:'primary wide'},'Compare Duplicate Risk'));root.append(panel('Known Issues / Disclosed Reports / Previous Findings',form,result));
    }
  }else if(kind==='report-builder')root.append(panel('Report Builder',button('Open Indonesian Reports',()=>routeTo('reports'),'primary')));
  else if(kind==='gap-analyzer')root.append(coveragePanels(target));
  return root;
}
