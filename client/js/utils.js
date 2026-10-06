// MODULE: Safe DOM and local file utilities.
// SECURITY: Research content always enters the DOM as text, never executable HTML.
export const uuid = () => crypto.randomUUID ? crypto.randomUUID() : 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => { const n=crypto.getRandomValues(new Uint8Array(1))[0]&15; return (c==='x'?n:(n&3)|8).toString(16); });
export const now = () => new Date().toISOString();
export function el(tag, attrs={}, ...children) {
  const node=document.createElement(tag);
  for(const [key,value] of Object.entries(attrs)) {
    if(key.startsWith('on')) node.addEventListener(key.slice(2).toLowerCase(),value);
    else if(key==='class') node.className=value;
    else if(key==='text') node.textContent=value;
    else if(value!==false && value!=null) node.setAttribute(key,value===true?'':String(value));
  }
  for(const child of children.flat(Infinity)) if(child!=null) node.append(child instanceof Node?child:document.createTextNode(String(child)));
  return node;
}
export const button=(text,handler,className='')=>el('button',{type:'button',class:className,onclick:handler},text);
export const badge=text=>el('span',{class:'badge'},text);
export const empty=(text='Belum ada catatan. Mulai dengan menambahkan item.')=>el('div',{class:'empty'},text);
export const dateLabel=value=>value?new Date(value).toLocaleString('id-ID'):'Belum pernah';
export function download(filename,content,type='text/plain') {
  const url=URL.createObjectURL(new Blob([content],{type:type+';charset=utf-8'}));
  const anchor=el('a',{href:url,download:filename}); anchor.click(); setTimeout(()=>URL.revokeObjectURL(url),1000);
}
export function escapeHTML(value) { return String(value).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c])); }
export function markdownPreview(markdown) {
  const article=el('article',{class:'report-preview'});
  // PURPOSE: A deliberately small renderer; raw HTML and links remain inert text.
  for(const line of markdown.split('\n')) {
    const heading=/^(#{1,3}) (.*)$/.exec(line);
    article.append(heading?el('h'+heading[1].length,{},heading[2]):el('p',{class:/^\d+\. /.test(line)?'step':''},line||'\u00a0'));
  }
  return article;
}
export const formulaKeys=['who','what','object','state','authority','context'];
export function formulaView(item) { return el('div',{class:'formula-strip'},formulaKeys.map(key=>el('div',{},el('small',{},key.toUpperCase()),el('span',{},item[key]||'—')))); }
export function panel(title,...children) { return el('section',{class:'panel'},el('h2',{},title),...children); }
