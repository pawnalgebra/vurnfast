import {el,button,panel,badge,empty} from '../utils.js';
import {editDialog} from '../forms.js';
const actorFields=[['name','Actor / Role','required'],['authority','Authority'],['notes','Notes','textarea']];
const objectFields=[['name','Object Name','required'],['type','Object Type','select',['Account','File','Project','Workspace','Conversation','Token','Invitation','Approval','Invoice','Webhook','Job','Profile','API Resource','Custom']],['owner','Owner'],['tenant','Tenant'],['state','State'],['sensitivity','Sensitivity'],['notes','Notes','textarea']];
const boundaryFields=[['from','From','required'],['to','To','required'],['channel','Channel'],['trust','Trust','select',['restricted','trusted','untrusted']],['authority','Authority'],['notes','Notes','textarea']];
export function renderAttackSurface(ctx,target) {
  const root=el('div',{},ctx.heading('Attack Surface','Petakan aktor, protected objects, dan perpindahan authority.'));
  const grid=el('div',{class:'grid'});
  for(const [collection,title,fields] of [['actors','Actors',actorFields],['objects','Objects',objectFields],['boundaries','Trust Boundary Map',boundaryFields]].filter(([collection])=>!['actors','objects','boundaries'].includes(ctx.route)||collection===ctx.route)) {
    const edit=row=>editDialog((row?'Edit ':'Tambah ')+title,fields,row||{},values=>{ctx.store.upsert(target.id,collection,{...row,...values});ctx.render();});
    const section=panel(title,button('+ Tambah',()=>edit(),'primary'));
    if(collection==='actors')section.append(el('p',{class:'muted'},'Peran umum: Anonymous, User, Viewer, Member, Editor, Admin, Owner, Service Account. Nama custom juga didukung.'));
    if(!target[collection].length)section.append(empty());
    for(const row of target[collection])section.append(el('div',{class:collection==='boundaries'?'boundary':'record'},collection==='boundaries'?el('div',{},el('strong',{},row.from),el('span',{class:'arrow'},' → '),el('strong',{},row.to)):el('h3',{},row.name),el('div',{},el('div',{class:'badges'},[row.type,row.trust,row.state,row.authority,row.sensitivity].filter(Boolean).map(badge)),row.owner?el('p',{},'Owner: '+row.owner):null,row.tenant?el('p',{},'Tenant: '+row.tenant):null,el('p',{class:'muted'},row.notes||''),el('div',{class:'actions'},button('Edit',()=>edit(row)),button('Hapus',()=>{if(confirm('Hapus catatan ini?')){ctx.store.remove(target.id,collection,row.id);ctx.render();}},'danger')))));
    if(collection==='boundaries')for(const row of target.boundaries)if(row.channel)section.append(el('p',{class:'muted'},row.from+' → '+row.to+' · Channel: '+row.channel));
    grid.append(section);
  }
  root.append(grid);return root;
}
