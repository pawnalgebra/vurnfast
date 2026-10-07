import {el,button,badge,panel,empty} from '../utils.js';
import {editDialog} from '../forms.js';
import {routeTo} from '../router.js';
export const targetFields=[['name','Program Name','required'],['platform','Platform','select',['Bugcrowd','HackerOne','Intigriti','Private','Private Program','Other']],['programUrl','Program URL'],['asset','Target / Asset'],['environment','Environment'],['version','Version / Build'],['status','Status','select',['active','paused','archived']],['customNotes','Custom Notes','textarea']];
export function editTarget(ctx,target) {editDialog(target?'Edit Target':'Create Target',targetFields,target||{},values=>{if(target)ctx.store.updateTarget(target.id,values);else ctx.selectTarget(ctx.store.addTarget(values).id);ctx.render();});}
export function renderTargets(ctx) {
  const root=el('div');root.append(ctx.heading('Target','Profil program dan aset untuk setiap engagement.',button('+ Create Target',()=>editTarget(ctx),'primary')));
  const list=ctx.store.get().targets;
  if(!list.length)root.append(empty('Belum ada target. Buat target pertama untuk mulai menyusun riset.'));
  for(const target of list)root.append(panel(target.name,el('div',{class:'badges'},badge(target.platform),badge(target.status)),el('p',{},target.asset||'Asset belum diisi'),el('p',{class:'muted'},'Environment: '+(target.environment||'—')+' · Build: '+(target.version||'—')),el('p',{class:'muted'},target.programUrl||''),el('p',{class:'muted'},target.customNotes||''),el('div',{class:'actions'},button(target.id===ctx.targetId?'Target aktif':'Pilih target',()=>{ctx.selectTarget(target.id);ctx.render();}),button('Edit',()=>editTarget(ctx,target)),button('Hapus',()=>{if(confirm('Hapus target "'+target.name+'" beserta seluruh research dan evidence? Ekspor backup sebelum melanjutkan.')){ctx.store.deleteTarget(target.id);ctx.selectTarget(ctx.store.get().targets[0]?.id||'');ctx.render();}},'danger'))));
  for(const target of list){
    const areas=[['research-environment','Research Environment'],['scope','Research'],['target-intelligence','Intelligence'],['tests','Testing'],['findings','Findings']];
    const controls=areas.map(([route,label])=>button(label,()=>{ctx.selectTarget(target.id);routeTo(route);ctx.render();}));
    root.append(panel(target.name+' — Target Areas',el('div',{class:'actions'},controls)));
  }
  return root;
}
