import {el,button,panel,badge,uuid,now,empty} from '../utils.js';
import {editDialog} from '../forms.js';
import {editTarget} from './targets.js';
import {routeTo} from '../router.js';
import {emptyResearchEnvironment,environmentTextFields,environmentRuleNames,ruleChoices,authMethods,environmentSecretRef,environmentReadiness,sensitiveHeader} from '../services/environment.js';
import {secretStore} from '../services/secret-store.js';
const labels={name:'Environment Name',baseUrl:'Base URL',allowedAssets:'Allowed Domains / Assets (one exact asset per line)',testTenant:'Test Workspace / Organization / Tenant',ownedData:'Owned Test Data',dummyIdentifiers:'Dummy Identifiers',rateLimit:'Rate Limit',userAgent:'User-Agent Requirement',researcherHeader:'Researcher Identification Header',automationRestrictions:'Automation Restrictions',testingRestrictions:'Testing Restrictions',programRulesText:'Program Rules',safeHarbor:'Safe Harbor Notes',knownIssues:'Known Issues',outOfScopeNotes:'Out of Scope Notes',specialInstructions:'Special Instructions',notes:'Notes'};
const ruleLabel=key=>key.replace(/([A-Z])/g,' $1').replace(/^./,c=>c.toUpperCase());
function envFor(target){return target.researchEnvironment||emptyResearchEnvironment();}
function save(ctx,target,env){ctx.store.updateEnvironment(target.id,env);ctx.render();}
function secretDialog(ctx,target,row,kind,refKey){
  const d=el('dialog',{class:'editor'},el('h2',{},'Update Protected Secret'),el('p',{},'Encrypted vault only. Secret tidak masuk workspace JSON, AI, report atau evidence. Existing value tidak ditampilkan.'));
  const f=el('form',{class:'form-grid'}),input=el('input',{type:'password',name:'secret',required:true,autocomplete:'new-password','aria-label':'Secret Value',maxlength:16000}),error=el('p',{class:'error wide',role:'alert'}),submit=el('button',{type:'submit',class:'primary'},'Save Protected Secret');
  f.append(el('label',{class:'wide'},'Secret Value',input),error,el('div',{class:'actions wide'},button('Cancel',()=>d.close()),submit));d.append(f);document.body.append(d);
  f.addEventListener('submit',async event=>{event.preventDefault();submit.disabled=true;error.textContent='';try{const ref=environmentSecretRef(target.id,row.id,kind);await secretStore.set(ref,{targetId:target.id,ownerId:row.id},input.value);const env=structuredClone(envFor(target)),collection=kind==='credential'?'accounts':kind==='header'?'headers':'profiles',current=env[collection].find(r=>r.id===row.id);if(!current)throw new Error('Record changed; reload environment.');current[refKey]=ref;if(collection==='profiles'){current.sessionStatus='Unknown';if(kind==='cookie'||current.authType==='Cookie')current.cookieUpdatedAt=now();}save(ctx,target,env);d.close();}catch(e){error.textContent=e.message;}finally{input.value='';submit.disabled=false;}});
  d.addEventListener('close',()=>{input.value='';d.remove();});d.showModal();
}
function unlockDialog(ctx){
  const d=el('dialog',{class:'editor'},el('h2',{},'Create / Unlock Encrypted Vault'),el('p',{},'Passphrase minimal 12 karakter. Simpan passphrase sendiri: tidak ada recovery atau plaintext fallback. Vault hanya tersedia pada browser/origin ini; workspace export tidak membackup secrets.'));
  const f=el('form',{class:'form-grid'}),input=el('input',{type:'password',name:'passphrase',required:true,minlength:12,autocomplete:'new-password','aria-label':'Vault Passphrase'}),error=el('p',{class:'error wide',role:'alert'}),submit=el('button',{type:'submit',class:'primary'},'Unlock Vault');
  f.append(el('label',{class:'wide'},'Vault Passphrase',input),error,el('div',{class:'actions wide'},button('Cancel',()=>d.close()),submit));d.append(f);document.body.append(d);f.addEventListener('submit',async event=>{event.preventDefault();submit.disabled=true;try{await secretStore.unlock(input.value);d.close();ctx.render();}catch(e){error.textContent=e.message;}finally{input.value='';submit.disabled=false;}});d.addEventListener('close',()=>{input.value='';d.remove();});d.showModal();
}
function editRow(ctx,target,collection,previous){
  const env=envFor(target);let fields,defaults;
  if(collection==='accounts'){fields=[['name','Account Name','required'],['role','Account Role'],['purpose','Purpose'],['username','Username'],['tenant','Tenant'],['ownership','Object Ownership'],['notes','Notes','textarea']];defaults={name:'',role:'',purpose:'',username:'',tenant:'',ownership:'',notes:'',credentialRef:''};}
  else if(collection==='profiles'){fields=[['name','Profile Name','required'],['accountId','Authorized Account','select',[['','Anonymous / no account'],...env.accounts.map(a=>[a.id,a.name])]],['actorId','Actor','select',[['','Optional actor'],...target.actors.map(a=>[a.id,a.name])]],['authType','Authentication Method','select',authMethods],['tenant','Tenant'],['ownership','Object Ownership'],['purpose','Purpose'],['sessionStatus','Session Status (not verified)','select',['Unknown','Expired']],['notes','Notes','textarea']];defaults={name:'',accountId:'',actorId:'',authType:'None',tenant:'',ownership:'',purpose:'',notes:'',secretRef:'',cookieRef:'',cookieUpdatedAt:'',sessionStatus:'Unknown'};}
  else{fields=[['name','Header Name','required'],['secret','Secret','select',[['yes','Yes'],['no','No']]],['value','Non-secret Value'],['enabled','Enabled','select',[['yes','Yes'],['no','No']]]];defaults={name:'',value:'',secret:true,enabled:true,secretRef:''};}
  editDialog(previous?'Edit '+collection:'Add '+collection,fields,{...defaults,...previous,...(collection==='headers'?{secret:previous?.secret===false?'no':'yes',enabled:previous?.enabled===false?'no':'yes'}:{})},values=>{
    const updated=structuredClone(envFor(target)),row={...defaults,...previous,...values,id:previous?.id||uuid()};
    if(collection==='headers'){row.secret=values.secret==='yes'||sensitiveHeader(row.name);row.enabled=values.enabled==='yes';if(row.secret&&row.value)throw new Error('Simpan secret header melalui Update Header Secret; Value harus kosong.');if(!row.secret)row.secretRef='';}
    if(collection==='profiles'&&previous&&previous.authType!==row.authType){row.secretRef='';row.sessionStatus='Unknown';}
    updated[collection]=updated[collection].filter(r=>r.id!==row.id);updated[collection].push(row);save(ctx,target,updated);
  });
}
async function removeRow(ctx,target,collection,row){
  if(!confirm('Remove '+row.name+' dan secret references terkait?'))return;
  try{const env=structuredClone(envFor(target));const affected=[row];env[collection]=env[collection].filter(r=>r.id!==row.id);
    if(collection==='accounts'){for(const p of env.profiles.filter(p=>p.accountId===row.id)){affected.push({...p});p.accountId='';p.secretRef='';p.cookieRef='';p.sessionStatus='Unknown';}}
    save(ctx,target,env);for(const item of affected)for(const key of ['credentialRef','secretRef','cookieRef'])await secretStore.remove(item[key]);
  }catch(e){ctx.toast(e.message);}
}
export function renderResearchEnvironment(ctx,target){
  const env=envFor(target),root=el('div',{},ctx.heading('Research Environment','Optional authorized testing context per target. Metadata dan encrypted secrets terpisah.'));
  root.append(panel('Environment Status',badge('Environment: '+environmentReadiness(target)),el('p',{},'Test Accounts: '+env.accounts.length+' · Authentication: '+env.profiles.length+' profiles · Headers: '+env.headers.length),el('p',{},'Sessions: Unknown sampai benar-benar diverifikasi. Imported secret references belum membuktikan secret tersedia pada perangkat ini.')));
  root.append(panel('Program',el('p',{},target.platform+' / '+target.name),el('p',{},target.programUrl||'Program URL: optional'),button('Edit Program',()=>editTarget(ctx,target))));
  root.append(panel('Scope & Rules',el('p',{},'Existing Scope adalah sumber scope. Structured rules di environment menjadi sumber rule ketika environment dikonfigurasi; Unknown tidak memberi izin.'),button('Open Scope',()=>routeTo('scope')),button('Edit Structured Rules',()=>editDialog('Program Rules',environmentRuleNames.map(k=>[k,ruleLabel(k),'select',ruleChoices]),env.rules,values=>save(ctx,target,{...structuredClone(envFor(target)),rules:values}))),el('dl',{class:'details'},environmentRuleNames.map(k=>[el('dt',{},ruleLabel(k)),el('dd',{},env.rules[k])]))));
  for(const [title,keys] of [['Testing Environment',['name','baseUrl','allowedAssets','testTenant','ownedData','dummyIdentifiers','rateLimit','userAgent','researcherHeader']],['Restrictions',['automationRestrictions','testingRestrictions','programRulesText','safeHarbor','knownIssues','outOfScopeNotes','specialInstructions','notes']]])root.append(panel(title,button('Edit '+title,()=>editDialog(title,keys.map(k=>[k,labels[k],'textarea']),env,values=>save(ctx,target,{...structuredClone(envFor(target)),...values}))),el('dl',{class:'details'},keys.map(k=>[el('dt',{},labels[k]),el('dd',{},env[k]||'Optional / Unknown')]))));
  const vault=panel('Secrets',badge(secretStore.unlocked?'Protected · Vault Unlocked':'Encrypted Vault Locked'),el('p',{},'AES-GCM encrypted IndexedDB; key hanya di memory. Auto-lock setelah 10 menit idle dan ketika page ditutup. Tidak ada secure secret export atau remote credential executor pada versi ini.'),button('Create / Unlock Vault',()=>unlockDialog(ctx)),button('Lock Vault',()=>{secretStore.lock();ctx.render();}));root.append(vault);
  for(const [collection,title] of [['accounts','Test Accounts'],['profiles','Authentication'],['headers','Headers']]){
    const section=panel(title,button('Add '+title,()=>editRow(ctx,target,collection),'primary'));
    for(const row of env[collection]){
      const card=el('article',{class:'record'},el('h3',{},row.name),el('div',{class:'badges'},badge(row.role||row.authType||'Custom Header'),badge(collection==='accounts'?'Credential: '+(row.credentialRef?'Configured (reference)':'Not configured'):collection==='profiles'?'Authentication: '+(row.secretRef?'Configured (reference)':'Not configured'):row.secret?'Secret: '+(row.secretRef?'Configured (reference)':'Not configured'):'Non-secret')));
      if(collection==='accounts')card.append(el('p',{},'Username: '+row.username+' · Purpose: '+row.purpose+' · Tenant: '+row.tenant+' · Ownership: '+row.ownership));
      if(collection==='profiles')card.append(el('p',{},'Actor: '+(target.actors.find(a=>a.id===row.actorId)?.name||'Unknown')+' · Account: '+(env.accounts.find(a=>a.id===row.accountId)?.name||'Anonymous')),el('p',{},'Session Cookie: '+(row.cookieRef||row.authType==='Cookie'&&row.secretRef?'Configured (reference)':'Not configured')+' · Status: '+row.sessionStatus+' · Last Updated: '+(row.cookieUpdatedAt||'Unknown')));
      if(collection==='headers')card.append(el('p',{},row.secret?'Value: [MASKED]':'Value: '+row.value),badge(row.enabled?'Enabled':'Disabled'));
      const actions=el('div',{class:'actions'},button('Edit',()=>editRow(ctx,target,collection,row)),button('Remove',()=>removeRow(ctx,target,collection,row),'danger'));
      if(collection==='accounts')actions.append(button('Update Credential',()=>secretDialog(ctx,target,row,'credential','credentialRef')));
      if(collection==='profiles'){actions.append(button('Update Authentication Secret',()=>secretDialog(ctx,target,row,'auth','secretRef')),button('Update Session Cookie',()=>secretDialog(ctx,target,row,'cookie','cookieRef')));}
      if(collection==='headers'&&row.secret)actions.append(button('Update Header Secret',()=>secretDialog(ctx,target,row,'header','secretRef')));
      card.append(actions);section.append(card);
    }if(!env[collection].length)section.append(empty('Optional; no configured records.'));root.append(section);
  }
  root.append(panel('Role / Account Matrix',el('div',{class:'environment-matrix'},el('table',{},el('thead',{},el('tr',{},['Actor','Account','Role','Tenant','Object Ownership','Authentication'].map(s=>el('th',{},s)))),el('tbody',{},env.profiles.map(p=>{const account=env.accounts.find(a=>a.id===p.accountId);return el('tr',{},[target.actors.find(a=>a.id===p.actorId)?.name||'Unknown',account?.name||'Anonymous',account?.role||'Unknown',p.tenant||account?.tenant||'Unknown',p.ownership||account?.ownership||'Unknown',p.name+' / '+p.authType].map(s=>el('td',{},s)));}))))));
  return root;
}
