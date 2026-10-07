import {el,button,badge,empty} from '../utils.js';
import {editDialog} from '../forms.js';
export const evidenceTypes=['screenshot','http-request','http-response','console-output','log','video-reference','file-reference','manual-note'];
export const sensitiveEvidence=text=>/authorization\s*:|bearer\s+\S+|cookie\s*:|set-cookie\s*:|(?:password|api[_-]?key|access[_-]?token|secret)\s*[:=]|[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/i.test(text);
export function evidenceSelector(form,target,selected) {
  const group=el('fieldset',{class:'wide'},el('legend',{},'Evidence terkait'));
  if(!target.evidence.length)group.append(el('small',{},'Tambahkan evidence dari modul Evidence atau Attach Evidence setelah menyimpan.'));
  for(const evidence of target.evidence) {const input=el('input',{type:'checkbox',name:'evidence:'+evidence.id,value:evidence.id});input.checked=selected.includes(evidence.id);group.append(el('label',{class:'actions'},input,evidence.label));}
  form.append(group);
}
export function extractEvidenceIds(values) {
  const clean={},evidenceIds=[];for(const [key,value] of Object.entries(values)) if(key.startsWith('evidence:'))evidenceIds.push(value);else clean[key]=value;
  return {clean,evidenceIds};
}
export function editEvidence(ctx,target,row,defaults={}) {
  const fields=[['label','Label','required'],['type','Type','select',evidenceTypes],['evidenceRole','Research relationship','select',['SUPPORTS','CONTRADICTS','CONTROL','CONTEXT','PREREQUISITE','OUTCOME']],['path','Local path / reference (metadata saja)'],['description','Description','textarea'],['content','Text evidence / HTTP request / response','textarea'],['testCaseId','Test Case','select',[['','— Tanpa test case —'],...target.testCases.map(t=>[t.id,t.title])]],['findingId','Finding','select',[['','— Tanpa finding —'],...target.findings.map(f=>[f.id,f.title])]]];
  editDialog(row?'Edit Evidence':'Attach Evidence',fields,{...defaults,...row},values=>{
    if(sensitiveEvidence(Object.values(values).join('\n')) && !confirm('Evidence mungkin mengandung token, cookie, password, API key, atau data pribadi. Redaksi dahulu jika belum aman. Simpan catatan ini?'))return false;
    const evidence=ctx.store.upsert(target.id,'evidence',{...row,...values});
    // PURPOSE: Keep selection membership and metadata association consistent after edits.
    for(const collection of ['testCases','findings'])for(const record of target[collection]) {
      let ids=(record.evidenceIds||[]).filter(id=>id!==evidence.id);
      if(record.id===(collection==='testCases'?values.testCaseId:values.findingId))ids.push(evidence.id);
      else if((row && record.evidenceIds?.includes(row.id)) && record.id!==(collection==='testCases'?row.testCaseId:row.findingId))ids.push(evidence.id);
      if(JSON.stringify(ids)!==JSON.stringify(record.evidenceIds||[]))ctx.store.upsert(target.id,collection,{id:record.id,evidenceIds:ids});
    }
    ctx.render();
  },form=>{
    const warning=el('p',{class:'notice wide'},'Redaksi tokens, cookies, passwords, API keys, dan personal data sebelum disimpan atau diekspor. File besar tidak disimpan; path adalah referensi lokal.');form.prepend(warning);
    form.elements.content.addEventListener('input',()=>{warning.textContent=sensitiveEvidence(form.elements.content.value)?'Terdeteksi pola data sensitif. Periksa dan redaksi sebelum menyimpan.':'Redaksi tokens, cookies, passwords, API keys, dan personal data sebelum disimpan atau diekspor.';});
  });
}
export function renderEvidence(ctx,target) {
  const root=el('div',{},ctx.heading('Evidence','Metadata file dan teks observasi yang mendukung hasil riset.',button('+ Attach Evidence',()=>editEvidence(ctx,target),'primary')),el('div',{class:'notice'},'Periksa redaksi secrets dan data pribadi. Workspace JSON memuat teks evidence; file screenshot/video hanya direferensikan lewat path.'));
  if(!target.evidence.length)root.append(empty());
  for(const row of target.evidence)root.append(el('article',{class:'record','data-agent-kind':'evidence','data-agent-id':row.id},el('div',{class:'record-header'},el('h3',{},row.label),el('div',{class:'actions'},button('Edit',()=>editEvidence(ctx,target,row)),ctx.deleteButton(target,'evidence',row))),badge(row.type),el('p',{class:'muted'},row.path||''),el('p',{},row.description||''),el('pre',{},row.content||'')));
  return root;
}
