import {el,button,empty,download,markdownPreview,escapeHTML} from '../utils.js';
import {generateIndonesianReport} from '../templates/report-id.js';
export function renderReports(ctx,target) {
  const root=el('div',{},ctx.heading('Indonesian Reports','Review draft laporan faktual sebelum mengirimkannya ke program.'));
  if(!target.findings.length){root.append(empty('Buat atau promosikan test case menjadi finding terlebih dahulu.'));return root;}
  const finding=target.findings.find(f=>f.id===ctx.reportFindingId)||target.findings[0];ctx.reportFindingId=finding.id;
  const select=el('select',{'aria-label':'Finding untuk laporan'},target.findings.map(f=>el('option',{value:f.id},f.title)));select.value=finding.id;select.addEventListener('change',()=>{ctx.reportFindingId=select.value;ctx.render();});
  const editor=el('textarea',{class:'report-editor','aria-label':'Draft laporan Markdown',spellcheck:'false'});
  editor.value=finding.reportMarkdown??generateIndonesianReport(target,finding);
  const preview=el('div');let previewTimer;
  const updatePreview=()=>preview.replaceChildren(markdownPreview(editor.value));updatePreview();
  editor.addEventListener('input',()=>{ctx.store.upsert(target.id,'findings',{id:finding.id,reportMarkdown:editor.value});clearTimeout(previewTimer);previewTimer=setTimeout(updatePreview,150);});
  const controls=el('div',{class:'report-controls panel'},select,el('div',{class:'actions'},button('Generate Report',()=>{if(finding.reportMarkdown!==undefined&&!confirm('Ganti draft yang diedit dengan template terbaru dari finding?'))return;editor.value=generateIndonesianReport(target,finding);ctx.store.upsert(target.id,'findings',{id:finding.id,reportMarkdown:editor.value});updatePreview();},'primary'),button('Copy Markdown',async()=>{try {if(navigator.clipboard && window.isSecureContext)await navigator.clipboard.writeText(editor.value);else {editor.focus();editor.select();if(!document.execCommand('copy'))throw new Error('Silakan pilih dan salin teks laporan secara manual.');}ctx.toast('Markdown disalin.');}catch(error){ctx.toast(error.message);}}),button('Download .md',()=>download('report.md',editor.value,'text/markdown')),button('Download .txt',()=>download('report.txt',editor.value)),button('Download .html',()=>download('report.html','<!doctype html><html lang="id"><meta charset="utf-8"><title>'+escapeHTML(finding.title)+'</title><body><pre style="white-space:pre-wrap;font:16px/1.6 system-ui;max-width:900px;margin:40px auto">'+escapeHTML(editor.value)+'</pre></body></html>','text/html')),button('Print',()=>{updatePreview();window.print();})));
  controls.append(el('p',{class:'muted'},'Generate ulang setelah mengubah finding/evidence. Draft yang diedit disimpan otomatis. Pastikan seluruh secrets telah dire­daksi.'));
  root.append(controls,el('div',{class:'report-layout'},editor,preview));return root;
}
