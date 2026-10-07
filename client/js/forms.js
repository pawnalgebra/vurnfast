import {el,button} from './utils.js';
// MODULE: Reusable, accessible forms; every field is text-safe.
export function field(form,definition,value='') {
  const [name,label,type='text',options=[]]=definition;
  const id='field-'+name;
  let input;
  if(type==='select') {input=el('select',{name,id});for(const option of options) {const [key,text]=Array.isArray(option)?option:[option,option];input.append(el('option',{value:key},text));}}
  else if(type==='textarea') input=el('textarea',{name,id,rows:4});
  else input=el('input',{name,id,type:type==='required'?'text':type,required:type==='required',maxlength: type==='required'?240:4000});
  if(type==='number') input.step='any';
  input.value=value??'';
  const wrapper=el('label',{class:'field '+(type==='textarea'?'wide':''),for:id},el('span',{},label),input);
  form.append(wrapper);return input;
}
export function editDialog(title,definitions,values,onSave,afterFields) {
  const dialog=el('dialog',{class:'editor'}), form=el('form',{class:'form-grid'});
  for(const def of definitions) field(form,def,values[def[0]]);
  afterFields?.(form);
  const message=el('p',{class:'error wide',role:'alert'});
  form.append(message,el('div',{class:'actions wide'},button('Batal',()=>dialog.close()),el('button',{type:'submit',class:'primary'},'Simpan')));
  form.addEventListener('submit',event=>{event.preventDefault();const data=Object.fromEntries(new FormData(form));try {for(const [name,label,type] of definitions)if(type==='required'&&!data[name]?.trim())throw new Error(label+' wajib diisi.');if(onSave(data)!==false)dialog.close();}catch(error){message.textContent=error.message;}});
  dialog.append(el('div',{class:'dialog-heading'},el('h2',{},title),button('×',()=>dialog.close(),'close')),form);
  dialog.addEventListener('close',()=>dialog.remove());document.body.append(dialog);dialog.showModal();return dialog;
}
export const formulaFields=target=>[['who','WHO · Actor','text'],['what','WHAT · Action'],['object','OBJECT'],['state','STATE'],['authority','AUTHORITY'],['context','CONTEXT']];
export function formulaSuggestions(form,target) {
  // PURPOSE: Preserve readable snapshots while offering reusable actor/object names.
  for(const [key,collection] of [['who','actors'],['object','objects']]) {
    const id='suggest-'+key;const list=el('datalist',{id},target[collection].map(row=>el('option',{value:row.name})));
    form.append(list);form.elements[key]?.setAttribute('list',id);
  }
}
export function optionalFormFields(form,names,summary='Optional details'){
  const details=el('details',{class:'wide'},el('summary',{},summary)),body=el('div',{class:'form-grid'});
  for(const name of names){const input=form.elements[name];if(input&&!input.required){const wrapper=input.closest('label.field');if(wrapper)body.append(wrapper);}}
  if(body.children.length){details.append(body);form.append(details);}return details;
}
