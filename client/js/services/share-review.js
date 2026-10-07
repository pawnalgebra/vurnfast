import {el,button} from '../utils.js';
import {SecretRedactor} from './redactor.js';
export function prepareShare(value){
  const encode=v=>typeof v==='string'?v:JSON.stringify(v,null,2);
  const original=encode(value),redacted=encode(typeof value==='string'?SecretRedactor.redact(value):SecretRedactor.context(value));
  return {original,redacted,sensitive:original!==redacted};
}
export function reviewForSharing(value,{allowOriginal=false,label='Export'}={}){
  const prepared=prepareShare(value);if(!prepared.sensitive)return Promise.resolve(prepared.original);
  return new Promise(resolve=>{
    let selected=null;const dialog=el('dialog',{class:'editor','aria-label':'Review sensitive data'},el('h2',{},'Review sensitive data before '+label),el('p',{class:'notice'},'Tokens, cookies, credentials, or personal data were detected. Review the redacted preview; redaction can also remove identifiers needed for restoring a backup.'),el('pre',{},prepared.redacted),el('div',{class:'actions'},button('Cancel',()=>dialog.close()),button('Use Redacted',()=>{selected=prepared.redacted;dialog.close();},'primary'),allowOriginal?button('Export Original Backup',()=>{if(confirm('Original backup contains sensitive data in plaintext. Keep this file private. Continue?')){selected=prepared.original;dialog.close();}},'danger'):null));
    dialog.addEventListener('close',()=>{dialog.remove();resolve(selected);},{once:true});document.body.append(dialog);dialog.showModal();
  });
}
