import {validateAIOutput} from './services/ai-schema.js';
import {DEFAULT_TECHNIQUES} from './technique-data.js';
import {validateDomainPack,validateIntelligence,emptyIntelligence} from './services/domain-schema.js';
import {validateKnowledgeResponse,knowledgeOperations} from './services/knowledge-schema.js';
import {emptyAgentResearch,builtinTools,validateAgentResearch,validateToolInventory} from './services/agent-schema.js';
import {validateResearchEnvironment} from './services/environment.js';
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
  data.toolInventory??=builtinTools();validateToolInventory(data.toolInventory);
  data.domainPacks??=[];
  if(!Array.isArray(data.domainPacks))fail('Domain packs tidak valid.');
  const packIds=new Set();for(const pack of data.domainPacks){validateDomainPack(pack);if(packIds.has(pack.id))fail('Domain pack ID duplikat.');packIds.add(pack.id);}
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
    target.agentResearch??=emptyAgentResearch();validateAgentResearch(target.agentResearch);
    if(target.agentResearch.messages?.some(m=>m.targetId!==target.id))throw new Error('Conversation target tidak valid.');
    target.researchRevision??=0;if(!Number.isInteger(target.researchRevision)||target.researchRevision<0)fail('Research revision tidak valid.');
    target.intelligence??=emptyIntelligence();validateIntelligence(target.intelligence);
    if(target.researchEnvironment!==undefined)validateResearchEnvironment(target.researchEnvironment,target);
    for(const suggestion of target.intelligence.suggestions){entity(suggestion,'Knowledge suggestion');if(!['pending','accepted','rejected'].includes(suggestion.status)||!knowledgeOperations.some(o=>o[0]===suggestion.operation))fail('Knowledge suggestion tidak valid.');validateKnowledgeResponse(suggestion.response);}
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
        if(row.knowledgeLinks!==undefined&&(!plain(row.knowledgeLinks)||Object.values(row.knowledgeLinks).some(v=>typeof v!=='string')))fail('Knowledge relationship harus berupa referensi teks.');
        if(row.knowledgeProvenance!==undefined)validateIntelligence({profile:{source:{value:'',...row.knowledgeProvenance}},primaryDomainId:'',secondaryDomainIds:[],items:[],suggestions:[]});
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
    for(const row of [...target.hypotheses,...target.testCases])if(row.authProfileId!==undefined){if(typeof row.authProfileId!=='string')fail('Authentication profile reference harus teks.');check(row.authProfileId,target.researchEnvironment?.profiles||[],'authentication profile');}
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
export function createStorageSession(open=openDatabase,storage=()=>globalThis.localStorage){
  let baseline;
  const writerId=globalThis.crypto?.randomUUID?.()||String(Math.random()).slice(2);
  const recovery={warning:'',data:null};
  const journalText=workspace=>JSON.stringify({format:'workspace-journal-v3',baseRevision:baseline??0,writerId,workspace});
  const quarantine=raw=>{try{storage().setItem(JOURNAL_KEY+'-quarantine-'+writerId,raw);if(storage().getItem(JOURNAL_KEY)===raw)storage().removeItem(JOURNAL_KEY);}catch{}recovery.warning='Journal recovery tidak valid/berkonflik; primary dipertahankan. Export Recovery Data untuk memeriksa salinan.';};
  async function write(workspace,{preservePrimary}={}){
    const db=await open();
    return new Promise((resolve,reject)=>{
      const tx=db.transaction('workspace','readwrite'),s=tx.objectStore('workspace'),r=s.get('revision');let next,error;
      r.onsuccess=()=>{const current=r.result??0;if(baseline!==undefined&&current!==baseline){error=new Error('Workspace berubah di tab lain. Export perubahan lokal, lalu reload sebelum mengedit.');error.code='STORAGE_CONFLICT';tx.abort();return;}next=current+1;if(preservePrimary!==undefined)s.put(preservePrimary,'recovery-primary');s.put(workspace,'primary');s.put(next,'revision');};
      tx.oncomplete=()=>{baseline=next;resolve();};tx.onabort=tx.onerror=()=>reject(error||new Error('Penulisan IndexedDB gagal (quota atau permission).'));
    });
  }
  async function read(){
    recovery.warning='';const db=await open();
    const [stored,revision]=await new Promise((resolve,reject)=>{const tx=db.transaction('workspace','readonly'),s=tx.objectStore('workspace'),a=s.get('primary'),b=s.get('revision');tx.oncomplete=()=>resolve([a.result,b.result??0]);tx.onerror=tx.onabort=()=>reject(new Error('Pembacaan IndexedDB gagal.'));});
    baseline=revision;let raw,legacy;try{raw=storage().getItem(JOURNAL_KEY);if(!stored&&!raw)legacy=storage().getItem(STORAGE_KEY);}catch{}
    recovery.data={primary:stored??null,journal:raw??null,legacy:legacy??null,revision};
    let primary,primaryError,pending;
    try{if(stored)primary=migrateWorkspace(stored);}catch(error){primaryError=error;}
    if(raw){try{if(new Blob([raw]).size>21000000)throw new Error('Journal terlalu besar.');const parsed=JSON.parse(raw);if(parsed.format==='workspace-journal-v3'){if(parsed.baseRevision!==revision)throw new Error('Journal berasal dari revisi lama.');pending=migrateWorkspace(parsed.workspace);}else if(!stored||!primary||String(parsed.updatedAt)>String(stored.updatedAt))pending=parseWorkspace(raw);}catch{quarantine(raw);}}
    if(pending){await write(pending,{...(primaryError?{preservePrimary:stored}:{})});try{if(storage().getItem(JOURNAL_KEY)===raw)storage().removeItem(JOURNAL_KEY);}catch{}return pending;}
    if(primary){if(stored.schemaVersion!==SCHEMA_VERSION)await write(primary);return primary;}
    if(legacy){const migrated=parseWorkspace(legacy);await write(migrated);return migrated;}
    if(primaryError||raw)throw new Error('Tidak ada salinan workspace valid; editing/autosave diblokir sampai Import Backup.');
    return null;
  }
  return {read,write,journalText,recovery};
}
const localSession=createStorageSession();
export const storageRecovery=localSession.recovery;
export const readLocal=()=>localSession.read();
export const writeLocal=workspace=>localSession.write(workspace);
export function makePersistence(write=writeLocal,delay=350) {
  let timer,journalTimer,pending=null,running=null,blockedError=null;
  const listeners=new Set();
  const notify=(status,error)=>listeners.forEach(fn=>fn({status,error,blocked:!!blockedError,lastSaved:status==='saved'?new Date().toISOString():null}));
  const journal=snapshot=>{const text=localSession.journalText(snapshot);try{localStorage.setItem(JOURNAL_KEY,text);}catch{}return text;};
  async function flush() {
    clearTimeout(timer);clearTimeout(journalTimer);if(blockedError){notify('error',blockedError);return false;}if(running)return running;if(!pending)return true;
    running=(async()=>{
      while(pending) {
        const snapshot=JSON.parse(JSON.stringify(pending));pending=null;const raw=journal(snapshot);notify('saving');
        try {await write(snapshot);if(!pending){try{if(localStorage.getItem(JOURNAL_KEY)===raw)localStorage.removeItem(JOURNAL_KEY);}catch{}notify('saved');}}
        catch(error){if(!pending)pending=snapshot;if(error.code==='STORAGE_CONFLICT')blockedError=error.message;notify('error',error.message);return false;}
      }return true;
    })();
    try{return await running;}finally{running=null;}
  }
  return {schedule(workspace){pending=workspace;if(blockedError){notify('error',blockedError);return;}notify('unsaved');clearTimeout(timer);clearTimeout(journalTimer);journalTimer=setTimeout(()=>{if(pending)journal(pending);},Math.min(80,delay));timer=setTimeout(flush,delay);},flush,isDirty:()=>!!pending||!!running,isBlocked:()=>!!blockedError,subscribe(fn){listeners.add(fn);}};
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
