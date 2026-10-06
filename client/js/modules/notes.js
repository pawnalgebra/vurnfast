import {el,panel} from '../utils.js';
export function renderNotes(ctx,target) {
  const root=el('div',{},ctx.heading('Research Notes','Scratchpad per target. Teks dan Markdown disimpan otomatis.'));
  const note=target.notes.find(n=>n.type==='scratchpad');
  let id=note?.id;const textarea=el('textarea',{class:'scratchpad','aria-label':'Research Notes',placeholder:'Catat observasi, ide lanjutan, atau pertanyaan yang belum terjawab…'});textarea.value=note?.content||'';
  textarea.addEventListener('input',()=>{const row=ctx.store.upsert(target.id,'notes',{...(id?{id}:{}),type:'scratchpad',title:'Research Notes',content:textarea.value});id=row.id;});
  root.append(panel('Target scratchpad',textarea));
  // PURPOSE: Imported non-scratchpad notes remain readable and editable, rather than hidden.
  for(const row of target.notes.filter(n=>n.type!=='scratchpad')) {const input=el('textarea',{'aria-label':row.title||'Note'});input.value=row.content||row.notes||'';input.addEventListener('input',()=>ctx.store.upsert(target.id,'notes',{id:row.id,content:input.value}));root.append(panel(row.title||'Imported note',input,ctx.deleteButton(target,'notes',row)));}
  return root;
}
