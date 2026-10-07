import {el,button,empty,download,dateLabel} from './utils.js';
import {readLocal,parseWorkspace,makePersistence,storageRecovery} from './storage.js';
import {createStore} from './store.js';
import {routes,navigationGroups,currentRoute,routeTo} from './router.js';
import {renderDashboard} from './modules/dashboard.js';
import {renderTargets,editTarget} from './modules/targets.js';
import {renderScope} from './modules/scope.js';
import {renderAttackSurface} from './modules/attack-surface.js';
import {renderTechniques} from './modules/techniques.js';
import {renderHypotheses} from './modules/hypotheses.js';
import {renderTests} from './modules/tests.js';
import {renderEvidence} from './modules/evidence.js';
import {renderFindings} from './modules/findings.js';
import {renderReports} from './modules/reports.js';
import {renderNotes} from './modules/notes.js';
import {renderSettings} from './modules/settings.js';
import {renderKnowledge} from './modules/knowledge.js';
import {renderTools} from './modules/tools.js';
import {renderHelpers} from './modules/helpers.js';
import {renderCoverage} from './modules/coverage.js';
import {researchRouteLinks} from './modules/research-navigation.js';
import {renderAI} from './modules/ai.js';
import {aiConnection,connectBackend} from './services/ai-client.js';
import {featureHelp,routeHelp} from './help.js';
import {renderIntelligence} from './modules/intelligence.js';
import {knowledgeSearch} from './services/knowledge-search.js';
import {renderAgentResearch,renderToolInventory,renderAgenticSettings} from './modules/agent-research.js';
import {renderResearchEnvironment} from './modules/research-environment.js';
import {createAgentMessagePanel} from './modules/agent-message-panel.js';
import {reviewForSharing} from './services/share-review.js';
// MODULE: App composition. Research modules share a small context instead of owning persistence.
let initial,startupError='';
try {initial=await readLocal();}catch(error){startupError='Data lokal tidak dapat dimuat: '+error.message;}
const store=createStore(initial||undefined,{readOnly:!!startupError}), persistence=makePersistence();
const view=document.getElementById('view'),targetSelect=document.getElementById('target-select'),fileInput=document.getElementById('json-file'),searchInput=document.getElementById('global-search');
const ctx={store,targetId:store.get().targets[0]?.id||'',reportFindingId:'',filterState:{},search:'',
  aiConnection,persistence,storageHealthy:!startupError,
  playbookUrl:location.pathname.replace(/\\/g,'/').includes('/client/')?'../universal_bug_bounty_playbook.html':'universal_bug_bounty_playbook.html',
  async connectBackend(url){try{await connectBackend(url);renderNavigation();ctx.render();ctx.toast('Backend terhubung · AI: '+aiConnection.status);}catch(error){ctx.toast(error.message);}},
  selectTarget(id){ctx.targetId=id;ctx.reportFindingId='';ctx.search='';ctx.searchTarget='';ctx.filterState={};ctx.domainId='';ctx.knowledgeQuestion='';ctx.knowledgeTerm='';ctx.knowledgeFlow='';searchInput.value='';},
  help:featureHelp,
  heading(title,description,action){return el('div',{class:'page-heading'},el('div',{},el('div',{class:'eyebrow'},'UNIVERSAL / '+currentRoute().toUpperCase()),el('h1',{},title),el('p',{},description),routeHelp(currentRoute())),action||null);},
  toast(message){const toast=document.getElementById('toast');toast.textContent=message;toast.hidden=false;clearTimeout(ctx.toastTimer);ctx.toastTimer=setTimeout(()=>toast.hidden=true,6500);},
  deleteButton(target,collection,row){return button('Hapus',()=>{if(confirm('Hapus "'+(row.title||row.name||row.label||'catatan')+'"? Referensi terkait akan dilepas.')){store.remove(target.id,collection,row.id);ctx.render();}},'danger');},
  filters(key,definitions){const container=el('div',{class:'filters'});const state=ctx.filterState[key]||{};
    const search=el('input',{type:'search',placeholder:'Cari di daftar…','aria-label':'Cari '+key});search.value=state.query||'';
    search.addEventListener('change',()=>{ctx.filterState[key]={...ctx.filterState[key],query:search.value};ctx.render();});container.append(search);
    for(const [name,label,options] of definitions) {const select=el('select',{'aria-label':'Filter '+label},el('option',{value:''},'Semua '+label),options.map(option=>{const [value,text]=Array.isArray(option)?option:[option,option];return el('option',{value},text);}));select.value=state[name]||'';select.addEventListener('change',()=>{ctx.filterState[key]={...ctx.filterState[key],[name]:select.value};ctx.render();});container.append(select);}return container;},
  filtered(rows,key){const filters=ctx.filterState[key]||{};return rows.filter(row=>Object.entries(filters).every(([name,value])=>!value || (name==='query'?JSON.stringify(row).toLowerCase().includes(value.toLowerCase()):row[name]===value)));},
  async exportWorkspace(backup=false){const snapshot=structuredClone(store.get()),text=await reviewForSharing(snapshot,{allowOriginal:true,label:'workspace export'});if(text===null)return;void persistence.flush();download(backup===true?'backup-'+new Date().toISOString().slice(0,10)+'.json':'workspace.json',text,'application/json');ctx.toast('Workspace JSON diekspor.');},
  importWorkspace(){fileInput.value='';fileInput.click();},
  render(){
    const state=store.get();if(!store.target(ctx.targetId))ctx.targetId=state.targets[0]?.id||'';
    targetSelect.replaceChildren(...(state.targets.length?state.targets.map(t=>el('option',{value:t.id},t.name)): [el('option',{value:''},'Belum ada target')]));targetSelect.value=ctx.targetId;
    const route=currentRoute();ctx.route=route;for(const anchor of document.querySelectorAll('#navigation a')){anchor.classList.toggle('active',anchor.hash==='#'+route);if(anchor.hash==='#'+route)anchor.setAttribute('aria-current','page');else anchor.removeAttribute('aria-current');}
    const target=store.target(ctx.targetId);let content;
    if(ctx.search.trim()) content=renderSearch();
    else if(route==='dashboard')content=renderDashboard(ctx,target);
    else if(route==='targets')content=renderTargets(ctx);
    else if(['settings','ai-provider','backup'].includes(route))content=renderSettings(ctx);
    else if(route==='tool-inventory')content=renderToolInventory(ctx);
    else if(route==='agentic-settings')content=renderAgenticSettings(ctx);
    else if(!target)content=el('div',{},ctx.heading(routes.find(r=>r[0]===route)[1],'Buat atau pilih target terlebih dahulu.',button('+ Create Target',()=>editTarget(ctx),'primary')),empty('Tidak ada target aktif.'));
    else {const renders={'research-environment':renderResearchEnvironment,'research-details':renderAgentResearch,'review-queue':renderAgentResearch,'manual-analysis':renderAgentResearch,'agent-history':renderAgentResearch,'scope':renderScope,'attack-surface':renderAttackSurface,'actors':renderAttackSurface,'objects':renderAttackSurface,'boundaries':renderAttackSurface,'target-intelligence':renderIntelligence,'domain-knowledge':renderIntelligence,'terminology':renderIntelligence,'business-flows':renderIntelligence,'critical-assets':renderIntelligence,'research-questions':renderIntelligence,'techniques':renderTechniques,'hypotheses':renderHypotheses,'queue':renderHypotheses,'tests':renderTests,'evidence':renderEvidence,'findings':renderFindings,'reports':renderReports,'notes':renderNotes,'knowledge':renderKnowledge,'tools':renderTools,'helpers':renderHelpers,'coverage':renderCoverage,'ai':renderAI,'ai-techniques':renderAI,'ai-tools':renderAI,'ai-gaps':renderAI,'ai-findings':renderAI};content=renders[route](ctx,target);}
    if(!ctx.search.trim()){
      const tabs=researchRouteLinks(route);
      if(tabs){const heading=content.querySelector('.page-heading');if(heading)heading.after(tabs);else content.prepend(tabs);}
    }
    view.replaceChildren(content);
    if(aiConnection.enabled&&aiConnection.agentic.enabled)for(const record of view.querySelectorAll('[data-agent-kind][data-agent-id]')){
      const action=button('Ask Agent',()=>agentMessages.select({kind:record.dataset.agentKind,id:record.dataset.agentId}),'agent-context-action');
      (record.querySelector('.record-header .actions')||record).append(action);
      record.addEventListener('focusin',()=>{ctx.agentSelection={kind:record.dataset.agentKind,id:record.dataset.agentId,targetId:ctx.targetId,page:ctx.route};agentMessages.sync();});
      record.addEventListener('click',()=>{ctx.agentSelection={kind:record.dataset.agentKind,id:record.dataset.agentId,targetId:ctx.targetId,page:ctx.route};agentMessages.sync();});
    }
    agentMessages.sync();
    if(startupError||storageRecovery.warning||persistence.isBlocked())view.prepend(el('div',{class:'notice',role:'alert'},startupError||storageRecovery.warning||'Tab lain menyimpan workspace. Export perubahan lokal lalu reload.',el('div',{class:'actions'},button('Import Backup',ctx.importWorkspace),button('Export Recovery Data',async()=>{const text=await reviewForSharing({storage:storageRecovery.data,local:store.get()},{allowOriginal:true,label:'recovery export'});if(text!==null)download('workspace-recovery.json',text,'application/json');}))));
    if(store.isReadOnly())for(const control of view.querySelectorAll('button,input,select,textarea'))if(!['Import Backup','Export Recovery Data'].includes(control.textContent))control.disabled=true;
  }
};
function renderSearch() {
  const query=ctx.search.trim().toLowerCase();const root=el('div',{},ctx.heading('Search Results','Pencarian targets, terminology, business flows, techniques, invariants, patterns, lessons, dan riset.'));
  const picker=el('select',{'aria-label':'Filter target pencarian'},el('option',{value:''},'Semua target'),store.get().targets.map(t=>el('option',{value:t.id},t.name)));picker.value=ctx.searchTarget||'';picker.addEventListener('change',()=>{ctx.searchTarget=picker.value;ctx.render();});root.append(picker);
  const results=knowledgeSearch(store.get(),query,ctx.searchTarget||'');
  for(const result of results)root.append(button(el('span',{},result.title,el('small',{},(result.targetId?store.target(result.targetId)?.name+' / ':'')+result.category)),()=>{if(result.targetId)ctx.selectTarget(result.targetId);else {ctx.search='';searchInput.value='';}ctx.domainId=result.domainId||'';ctx.domainLearning=false;ctx.intelligenceSection=result.section||'overview';routeTo(result.route);ctx.render();},'search-result'));
  if(!results.length)root.append(empty('Tidak ada hasil yang cocok.'));return root;
}
function renderNavigation() {
  const nav=document.getElementById('navigation');nav.replaceChildren();
  for(const [group,keys] of navigationGroups){nav.append(el('div',{class:'nav-group'},group.toUpperCase()));
    if(group==='AI'&&!aiConnection.enabled){nav.append(el('span',{class:'ai-disabled'},'AI Assistant · '+aiConnection.status));continue;}
    for(const key of keys){if(key==='review-queue'&&!aiConnection.agentic.enabled)continue;nav.append(el('a',{href:'#'+key},routes.find(r=>r[0]===key)[1]));}
  }
}
const agentMessages=createAgentMessagePanel(ctx);
renderNavigation();
store.subscribe(state=>{if(!store.isReadOnly())persistence.schedule(state);});
let lastSaved=initial?.updatedAt||'';
function renderSaveStatus(event) {if(event.lastSaved)lastSaved=event.lastSaved;const labels={saved:'● Saved locally',unsaved:'○ Unsaved changes',saving:'◌ Saving...',error:'⚠ Unsaved · storage error'};const status=document.getElementById('save-status');status.replaceChildren(el('span',{},labels[event.status]),el('small',{},'Last saved: '+dateLabel(lastSaved)));if(event.status==='error')ctx.toast('Autosave gagal: '+event.error+'. Export Workspace untuk backup.');}
persistence.subscribe(event=>{ctx.storageHealthy=event.status!=='error';if(event.blocked&&!store.isReadOnly()){store.lock();ctx.render();}renderSaveStatus(event);});renderSaveStatus({status:startupError?'error':'saved',error:startupError});
window.addEventListener('hashchange',()=>{ctx.search='';searchInput.value='';ctx.render();});
targetSelect.addEventListener('change',()=>{ctx.selectTarget(targetSelect.value);ctx.render();});
let searchTimer;searchInput.addEventListener('input',()=>{clearTimeout(searchTimer);searchTimer=setTimeout(()=>{ctx.search=searchInput.value;ctx.render();},180);});
document.getElementById('export-workspace').addEventListener('click',()=>ctx.exportWorkspace());
document.getElementById('import-workspace').addEventListener('click',ctx.importWorkspace);
fileInput.addEventListener('change',async()=>{const file=fileInput.files[0];if(!file)return;try{if(persistence.isBlocked())throw new Error('Reload dahulu agar data terbaru dari tab lain dimuat.');if(file.size>20000000)throw new Error('File JSON melebihi 20 MB.');const imported=parseWorkspace(await file.text());if(!confirm('Import mengganti workspace saat ini dengan '+imported.targets.length+' target. Sudah mengekspor backup?'))return;startupError='';storageRecovery.warning='';store.replace(imported,{recover:true});ctx.selectTarget(imported.targets[0]?.id||'');ctx.filterState={};ctx.searchTarget='';const saved=await persistence.flush();ctx.render();ctx.toast(saved?'Workspace berhasil diimpor.':'Workspace diimpor ke memory; IndexedDB gagal. Export backup.');}catch(error){ctx.toast('Import ditolak: '+error.message);}});
window.addEventListener('pagehide',()=>persistence.flush());
document.addEventListener('visibilitychange',()=>{if(document.visibilityState==='hidden')persistence.flush();});
window.addEventListener('beforeunload',event=>{if(persistence.isDirty()){void persistence.flush();event.preventDefault();event.returnValue='Perubahan sedang disimpan. Tunggu Saved locally atau export backup.';}});
ctx.render();
if(document.querySelector('meta[name="workspace-backend"]')?.content==='same-origin') {
  try{await connectBackend(location.origin);renderNavigation();ctx.render();}catch{aiConnection.status='Disabled';}
}
// EXTENSION POINT: Modules can consume ctx.store without adding target interaction or telemetry.
