import {el,button,badge} from './utils.js';
import {featureRegistry,routeFeatures} from './feature-registry.js';
// Documentation paths resolve from the loader: works for both root/client file shells and HTTP.
export function documentationURL(feature) {
  const loader=document.querySelector('script[src$="loader.js"]');
  return new URL('../'+feature.documentation,loader.src).href;
}
export function featureHelp(id) {
  const feature=featureRegistry.find(item=>item.id===id);
  if(!feature)return null;
  const href=documentationURL(feature);
  const open=()=>{
    const dialog=el('dialog',{class:'feature-help-dialog','aria-label':'Bantuan '+feature.name});
    dialog.append(el('div',{class:'dialog-heading'},el('h2',{},feature.name),button('×',()=>dialog.close(),'close')),
      badge('Status: '+feature.status),el('p',{},feature.description),el('p',{class:'muted'},feature.purpose),
      el('a',{href,target:'_blank',rel:'noopener'},'View Documentation'));
    dialog.addEventListener('close',()=>dialog.remove());document.body.append(dialog);dialog.showModal();
  };
  return el('span',{class:'feature-help'},el('button',{type:'button',class:'help-button',title:feature.description,'aria-label':'Bantuan '+feature.name,onclick:open},'?'),
    el('a',{class:'documentation-link',href,target:'_blank',rel:'noopener'},'View Documentation'));
}
export function routeHelp(route){return featureHelp(routeFeatures[route]);}
