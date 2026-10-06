import {validateAIOutput} from './services/ai-schema.js';
import {DEFAULT_TECHNIQUES} from './technique-data.js';
// MODULE: Persistence and migration boundary.
// DATA CONTRACT: v1 -> v2 migration preserves IDs, research content, timestamps and extensions.
export const SCHEMA_VERSION='2.0.0';
export const STORAGE_KEY='universal-bounty-workspace-v1'; // Legacy source is retained after migration.
export const JOURNAL_KEY='universal-bounty-pending-v2';
export const DATABASE_NAME='universal-research-workspace';
export const collections=['actors','objects','boundaries','techniques','hypotheses','testCases','findings','evidence','notes','knowledgeBase','aiSuggestions','helperRecords'];
const plain=value=>value!==null && typeof value==='object' && !Array.isArray(value);
const fail=message=>{throw new Error(message);};
export function migrateWorkspace(input) {
  if(!plain(input)) fail('Workspace harus berupa object JSON.');
  if(!['1.0.0',SCHEMA_VERSION].includes(input.schemaVersion)) fail('schemaVersion tidak didukung. Diperlukan v1 atau v2.');
  const seen=new Set();
  let nodes=0;
  function walk(value,depth=0) {
    if(depth>30 || ++nodes>200000) fail('Struktur workspace terlalu besar atau terlalu dalam.');
    if(typeof value==='string' && value.length>2000000) fail('Satu field melebihi batas 2 juta karakter.');
    if(value && typeof value==='object') for(const [key,item] of Object.entries(value)) {
      if(['__proto__','constructor','prototype'].includes(key)) fail('Key tidak aman ditemukan pada JSON.');
      walk(item,depth+1);
    }
  }
  walk(input);
  if(typeof input.applicationVersion!=='string' || typeof input.updatedAt!=='string' || !Array.isArray(input.targets)) fail('Metadata/root workspace tidak valid.');
  const data=JSON.parse(JSON.stringify(input));
  if(data.schemaVersion==='1.0.0') {
    data.schemaVersion=SCHEMA_VERSION;data.applicationVersion='0.2.0';
    for(const target of data.targets) {
      target.programRules={automationAllowed:false,dosAllowed:false,thirdPartyTesting:false,...target.programRules};
      for(const key of ['knowledgeBase','aiSuggestions','helperRecords'])if(target[key]===undefined)target[key]=[];
      for(const technique of target.techniques||[]) {
        technique.category??=DEFAULT_TECHNIQUES.find(t=>t.id===technique.libraryId||t.name===technique.name)?.category||'Custom';
        technique.securityInvariant??=DEFAULT_TECHNIQUES.find(t=>t.id===technique.libraryId||t.name===technique.name)?.securityInvariant||technique.hypothesisTemplate||'';
        technique.dimensions??=['who','what','object','state','authority','context'];
        technique.falsePositiveIndicators??=['Periksa role efektif, kepemilikan data, state terbaru, dan hasil backend.'];
        technique.stopConditions??=technique.stopCondition?[technique.stopCondition]:[];
        technique.researchPriority??=50;technique.duplicateRisk??=50;technique.testingCost??=50;
      }
    }
  }
  function entity(value,label) {
    if(!plain(value) || typeof value.id!=='string' || !value.id || value.id.length>120) fail(label+': id tidak valid.');
    if(seen.has(value.id)) fail('ID duplikat: '+value.id); seen.add(value.id);
  }
  const textFields=['name','title','platform','programUrl','asset','environment','version','status','owner','tenant','state','sensitivity','from','to','trust','authority','description','hypothesisTemplate','testTemplate','stopCondition','rarity','difficulty','domain','invariant','expectedBehavior','potentialFailure','who','what','object','context','priority','confidence','queue','preconditions','steps','expectedResult','actualResult','requestNotes','responseNotes','result','timestamp','severity','affectedComponent','affectedVersion','vulnerabilityClass','startingAuthority','securityRestriction','protectedResource','unauthorizedOutcome','rootCause','impact','mitigation','researchNotes','type','label','path','content','createdAt','updatedAt','techniqueId','hypothesisId','testCaseId'];
  for(const target of data.targets) {
    entity(target,'Target');
    if(typeof target.name!=='string' || !target.name.trim() || !plain(target.scope)) fail('Nama/scope target tidak valid.');
    if(!plain(target.programRules) || ['automationAllowed','dosAllowed','thirdPartyTesting'].some(key=>typeof target.programRules[key]!=='boolean'))fail('Program rules tidak valid.');
    for(const [key,value] of Object.entries(target.scope)) if(key==='guard') {
      if(!plain(value) || Object.values(value).some(v=>typeof v!=='boolean')) fail('Engagement guard tidak valid.');
    } else if(typeof value!=='string') fail('Field scope harus berupa teks.');
    for(const key of collections) {
      // Older minimal v1 targets may omit evidence; canonical exports always include it.
      if(key==='evidence' && target[key]===undefined) target[key]=[];
      if(!Array.isArray(target[key])) fail('Collection '+key+' tidak valid.');
      for(const row of target[key]) {
        entity(row,key);
        if(key==='aiSuggestions') {
          if(!['pending','accepted','rejected'].includes(row.status))fail('Status AI suggestion tidak valid.');
          validateAIOutput(row.response);
        }
        for(const extra of ['findingId','reportMarkdown','customNotes','channel','boundaryId','securityInvariant','category','source','operation']) if(row[extra]!==undefined && typeof row[extra]!=='string') fail(key+'.'+extra+' harus berupa teks.');
        for(const field of textFields) if(row[field]!==undefined && typeof row[field]!=='string') fail(key+'.'+field+' harus berupa teks.');
        if(row.notes!==undefined && typeof row.notes!=='string') fail(key+'.notes harus berupa teks.');
        for(const flag of ['enabled','tested','interesting']) if(row[flag]!==undefined && typeof row[flag]!=='boolean') fail(key+'.'+flag+' harus berupa boolean.');
        if(row.evidenceIds!==undefined && (!Array.isArray(row.evidenceIds)||row.evidenceIds.some(v=>typeof v!=='string'))) fail('evidenceIds tidak valid.');
        if(row.signals!==undefined && (!Array.isArray(row.signals)||row.signals.some(v=>typeof v!=='string'))) fail('signals tidak valid.');
        for(const field of ['dimensions','falsePositiveIndicators','stopConditions'])if(row[field]!==undefined && (!Array.isArray(row[field])||row[field].some(v=>typeof v!=='string')))fail(field+' tidak valid.');
        for(const field of ['researchPriority','duplicateRisk','testingCost'])if(row[field]!==undefined && (typeof row[field]!=='number'||!Number.isFinite(row[field])||row[field]<0||row[field]>100))fail(field+' harus 0–100.');
      }
    }
    for(const field of [...textFields,'customNotes']) if(target[field]!==undefined && typeof target[field]!=='string') fail('Target.'+field+' harus berupa teks.');
    const check=(value,rows,label)=>{if(value && !rows.some(r=>r.id===value)) fail('Referensi '+label+' tidak ditemukan.');};
    for(const h of target.hypotheses) check(h.techniqueId,target.techniques,'technique');
    for(const t of target.testCases) {check(t.hypothesisId,target.hypotheses,'hypothesis');check(t.techniqueId,target.techniques,'technique');check(t.boundaryId,target.boundaries,'boundary');}
    for(const f of target.findings) {check(f.testCaseId,target.testCases,'test case');check(f.techniqueId,target.techniques,'technique');}
    for(const row of [...target.testCases,...target.findings]) for(const id of row.evidenceIds||[]) check(id,target.evidence,'evidence');
    for(const e of target.evidence) {check(e.testCaseId,target.testCases,'evidence test');check(e.findingId,target.findings,'evidence finding');}
  }
  return data;
}
export function parseWorkspace(text) {
  if(new Blob([text]).size>20000000) fail('File JSON melebihi batas 20 MB.');
  let input; try { input=JSON.parse(text); } catch { fail('JSON tidak valid. Workspace saat ini tetap aman.'); }
  return migrateWorkspace(input);
}
// MODULE: IndexedDB primary storage, optional synchronous recovery journal for closing/crashing tabs.
let databasePromise;
export function openDatabase() {
  if(!databasePromise)databasePromise=new Promise((resolve,reject)=>{
    if(!globalThis.indexedDB)return reject(new Error('IndexedDB tidak tersedia di browser/context ini.'));
    const request=indexedDB.open(DATABASE_NAME,1);
    request.onupgradeneeded=()=>request.result.createObjectStore('workspace');
    request.onerror=()=>{databasePromise=null;reject(new Error('IndexedDB tidak dapat dibuka.'));};
    request.onblocked=()=>{databasePromise=null;reject(new Error('IndexedDB diblokir tab lain. Tutup tab workspace lain.'));};
    request.onsuccess=()=>{const db=request.result;db.onversionchange=()=>{db.close();databasePromise=null;};resolve(db);};
  });return databasePromise;
}
export async function writeLocal(workspace) {
  const db=await openDatabase();
  return new Promise((resolve,reject)=>{const tx=db.transaction('workspace','readwrite');tx.objectStore('workspace').put(workspace,'primary');tx.oncomplete=()=>resolve();tx.onabort=tx.onerror=()=>reject(new Error('Penulisan IndexedDB gagal (quota atau permission).'));});
}
export async function readLocal() {
  const db=await openDatabase();
  const stored=await new Promise((resolve,reject)=>{const tx=db.transaction('workspace','readonly');const request=tx.objectStore('workspace').get('primary');request.onsuccess=()=>resolve(request.result);request.onerror=()=>reject(new Error('Pembacaan IndexedDB gagal.'));});
  let journal,legacy;try{journal=localStorage.getItem(JOURNAL_KEY);if(!stored&&!journal)legacy=localStorage.getItem(STORAGE_KEY);}catch{} // Journal is optional, IDB remains primary.
  const workspace=journal?parseWorkspace(journal):stored?migrateWorkspace(stored):legacy?parseWorkspace(legacy):null;
  if(workspace && (journal||legacy||stored?.schemaVersion!==SCHEMA_VERSION)) {await writeLocal(workspace);if(journal)try{localStorage.removeItem(JOURNAL_KEY);}catch{}}
  return workspace;
}
export function makePersistence(write=writeLocal,delay=350) {
  let timer,pending=null,running=null;
  const listeners=new Set();
  const notify=(status,error)=>listeners.forEach(fn=>fn({status,error,lastSaved:status==='saved'?new Date().toISOString():null}));
  async function flush() {
    clearTimeout(timer);if(running)return running;if(!pending)return true;
    running=(async()=>{
      while(pending) {
        const snapshot=pending;pending=null;notify('saving');
        try {await write(snapshot);if(!pending){try{if(localStorage.getItem(JOURNAL_KEY)===JSON.stringify(snapshot))localStorage.removeItem(JOURNAL_KEY);}catch{}notify('saved');}}
        catch(error){if(!pending)pending=snapshot;notify('error',error.message);return false;}
      }return true;
    })();
    try{return await running;}finally{running=null;}
  }
  return {schedule(workspace){pending=JSON.parse(JSON.stringify(workspace));try{localStorage.setItem(JOURNAL_KEY,JSON.stringify(pending));}catch{}notify('unsaved');clearTimeout(timer);timer=setTimeout(flush,delay);},flush,isDirty:()=>!!pending||!!running,subscribe(fn){listeners.add(fn);}};
}
// PURPOSE: File handles stay in memory. JSON is written only through an explicit user gesture.
export const connectedFile={handle:null};
export async function connectFile() {
  if(!window.showSaveFilePicker) throw new Error('Browser ini tidak mendukung File System Access. Gunakan Export Workspace.');
  connectedFile.handle=await window.showSaveFilePicker({suggestedName:'workspace.json',types:[{description:'Workspace JSON',accept:{'application/json':['.json']}}]});
  return connectedFile.handle.name;
}
export async function saveConnected(workspace) {
  if(!connectedFile.handle) throw new Error('Hubungkan file terlebih dahulu.');
  const stream=await connectedFile.handle.createWritable();
  try {await stream.write(JSON.stringify(workspace,null,2));await stream.close();} catch(error) {await stream.abort().catch(()=>{});throw error;}
}
