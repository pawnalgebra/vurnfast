import {SecretRedactor} from './redactor.js';
import {uuid} from '../utils.js';
export const attachmentLimits={count:3,textLength:60000,totalText:90000,fileBytes:750000,totalBytes:1000000};
export const attachmentAccept='.txt,.md,.json,.csv,.log,.har,.http,.yaml,.yml,.xml,.html,.js,.ts,.py,.sql,.png,.jpg,.jpeg,.webp';
const attachmentTextExtensions=/\.(txt|md|json|csv|log|har|http|yaml|yml|xml|html|js|ts|py|sql)$/i;
const attachmentImageTypes=['image/png','image/jpeg','image/webp'];
export function validateMessageAttachments(files=[]){
  if(!Array.isArray(files)||files.length>attachmentLimits.count)throw new Error('Maksimal tiga file per pesan.');
  let bytes=0,textLength=0;const ids=new Set();
  for(const file of files){
    if(!file||Object.keys(file).some(k=>!['id','name','type','size','text','data'].includes(k))||typeof file.id!=='string'||!file.id||file.id.length>120||ids.has(file.id)||typeof file.name!=='string'||!file.name||file.name.length>180||!Number.isInteger(file.size)||file.size<1||file.size>attachmentLimits.fileBytes)throw new Error('Lampiran tidak valid atau melebihi 750 KB.');
    ids.add(file.id);bytes+=file.size;
    if(file.type==='text/plain'){
      if(typeof file.text!=='string'||!file.text.trim()||file.text.length>attachmentLimits.textLength||file.text.includes('\u0000')||file.data!==undefined)throw new Error('File teks harus UTF-8, tidak kosong, dan maksimal 60.000 karakter.');
      textLength+=file.text.length;
    }else{
      if(!attachmentImageTypes.includes(file.type)||typeof file.data!=='string'||file.text!==undefined||file.data.length>1000000||!/^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?$/.test(file.data))throw new Error('Format gambar tidak valid. Gunakan PNG, JPEG, atau WebP.');
      const decoded=Math.floor(file.data.length*3/4)-(file.data.endsWith('==')?2:file.data.endsWith('=')?1:0);
      const header=atob(file.data.slice(0,24));
      if(decoded!==file.size||!(file.type==='image/png'?file.data.startsWith('iVBORw0KGgo'):file.type==='image/jpeg'?file.data.startsWith('/9j/'):header.startsWith('RIFF')&&header.slice(8,12)==='WEBP'))throw new Error('Isi gambar tidak sesuai metadata.');
    }
  }
  if(bytes>attachmentLimits.totalBytes||textLength>attachmentLimits.totalText)throw new Error('Total lampiran maksimal 1 MB atau 90.000 karakter teks.');
  return files;
}
export async function readMessageAttachment(file){
  if(file.size<1||file.size>attachmentLimits.fileBytes)throw new Error('File kosong atau melebihi 750 KB.');
  const name=SecretRedactor.redact(file.name).slice(0,180);
  let result;
  if(attachmentImageTypes.includes(file.type)){
    const bytes=new Uint8Array(await file.arrayBuffer());let binary='';for(const byte of bytes)binary+=String.fromCharCode(byte);
    result={id:uuid(),name,type:file.type,size:file.size,data:btoa(binary)};
  }else{
    if(!attachmentTextExtensions.test(file.name))throw new Error('Gunakan file teks, log, JSON/HAR, kode, PNG, JPEG, atau WebP. PDF dan file biner belum didukung.');
    const text=new TextDecoder('utf-8',{fatal:true}).decode(await file.arrayBuffer());
    result={id:uuid(),name,type:'text/plain',size:file.size,text:SecretRedactor.redact(text)};
  }
  validateMessageAttachments([result]);return result;
}
export function attachmentMetadata(file){return {id:file.id,name:SecretRedactor.redact(file.name),type:file.type,size:file.size,preview:file.type==='text/plain'?SecretRedactor.redact(file.text).slice(0,600):'Image sent as shown; original not stored in conversation.'};}
