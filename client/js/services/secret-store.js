// Separate encrypted IndexedDB vault. No plaintext fallback, export, logging or LLM access.
const encode=new TextEncoder(),decode=new TextDecoder();
export class IndexedSecretStorage{
  async db(){return new Promise((resolve,reject)=>{if(!globalThis.indexedDB)return reject(new Error('Secret vault requires IndexedDB.'));const r=indexedDB.open('universal-research-secret-vault',1);r.onupgradeneeded=()=>r.result.createObjectStore('vault');r.onsuccess=()=>resolve(r.result);r.onerror=r.onblocked=()=>reject(new Error('Secret vault storage unavailable.'));});}
  async transaction(mode,key,value){const db=await this.db();try{return await new Promise((resolve,reject)=>{const tx=db.transaction('vault',mode),s=tx.objectStore('vault');const r=mode==='readonly'?s.get(key):value===undefined?s.delete(key):s.put(value,key);let output;r.onsuccess=()=>{output=r.result;};tx.oncomplete=()=>resolve(output);tx.onerror=tx.onabort=()=>reject(new Error('Secret vault storage failed.'));});}finally{db.close();}}
  get(key){return this.transaction('readonly',key);}put(key,value){return this.transaction('readwrite',key,value);}delete(key){return this.transaction('readwrite',key);}
  async initialize(meta){const db=await this.db();try{await new Promise((resolve,reject)=>{const tx=db.transaction('vault','readwrite'),store=tx.objectStore('vault'),r=store.get('metadata');r.onsuccess=()=>{if(r.result){tx.abort();return;}store.put(meta,'metadata');};tx.oncomplete=resolve;tx.onerror=tx.onabort=()=>reject(new Error('Vault initialized in another tab; unlock again.'));});}finally{db.close();}}
}
export class SecretStore{
  constructor(storage=new IndexedSecretStorage()){this.storage=storage;this.key=null;this.timer=null;this.generation=0;}
  get unlocked(){return !!this.key;}
  lock(){this.key=null;this.generation++;clearTimeout(this.timer);}
  refresh(){clearTimeout(this.timer);this.timer=setTimeout(()=>this.lock(),600000);this.timer.unref?.();}
  async derive(passphrase,salt){if(!globalThis.crypto?.subtle)throw new Error('Encrypted vault unavailable; use HTTPS or localhost.');const material=await crypto.subtle.importKey('raw',encode.encode(passphrase),'PBKDF2',false,['deriveKey']);return crypto.subtle.deriveKey({name:'PBKDF2',salt,iterations:310000,hash:'SHA-256'},material,{name:'AES-GCM',length:256},false,['encrypt','decrypt']);}
  async unlock(passphrase){
    if(typeof passphrase!=='string'||passphrase.length<12)throw new Error('Vault passphrase minimal 12 karakter.');this.lock();const generation=this.generation;
    let meta=await this.storage.get('metadata'),key;
    if(meta){try{key=await this.derive(passphrase,new Uint8Array(meta.salt));const value=await crypto.subtle.decrypt({name:'AES-GCM',iv:new Uint8Array(meta.iv),additionalData:encode.encode('vault-check-v1')},key,new Uint8Array(meta.check));if(decode.decode(value)!=='workspace-vault-v1')throw new Error();}catch{throw new Error('Vault passphrase salah atau vault rusak.');}}
    else{const salt=crypto.getRandomValues(new Uint8Array(16)),iv=crypto.getRandomValues(new Uint8Array(12));key=await this.derive(passphrase,salt);const check=await crypto.subtle.encrypt({name:'AES-GCM',iv,additionalData:encode.encode('vault-check-v1')},key,encode.encode('workspace-vault-v1'));meta={version:1,salt:[...salt],iv:[...iv],check:[...new Uint8Array(check)]};await this.storage.initialize(meta);}
    if(this.generation!==generation)throw new Error('Vault locked during operation.');this.key=key;this.refresh();
  }
  async set(ref,binding,value){
    if(!this.key)throw new Error('Unlock encrypted vault terlebih dahulu.');if(typeof value!=='string'||!value||value.length>16000)throw new Error('Secret wajib diisi, maksimal 16000 karakter.');
    const key=this.key,generation=this.generation,iv=crypto.getRandomValues(new Uint8Array(12)),aad=encode.encode(JSON.stringify([ref,binding.targetId,binding.ownerId]));
    const ciphertext=await crypto.subtle.encrypt({name:'AES-GCM',iv,additionalData:aad},key,encode.encode(value));if(generation!==this.generation)throw new Error('Vault locked during operation.');
    await this.storage.put(ref,{version:1,targetId:binding.targetId,ownerId:binding.ownerId,iv:[...iv],ciphertext:[...new Uint8Array(ciphertext)],updatedAt:new Date().toISOString()});this.refresh();
  }
  async exists(ref,binding){const row=await this.storage.get(ref);return !!row&&row.targetId===binding.targetId&&row.ownerId===binding.ownerId;}
  async getForAdapter(ref,binding){
    if(!this.key)throw new Error('WAITING_FOR_ENVIRONMENT: vault locked.');const key=this.key,generation=this.generation,row=await this.storage.get(ref);
    if(!row||row.targetId!==binding.targetId||row.ownerId!==binding.ownerId)throw new Error('WAITING_FOR_ENVIRONMENT: credential unavailable.');
    try{const value=await crypto.subtle.decrypt({name:'AES-GCM',iv:new Uint8Array(row.iv),additionalData:encode.encode(JSON.stringify([ref,binding.targetId,binding.ownerId]))},key,new Uint8Array(row.ciphertext));if(generation!==this.generation)throw new Error();this.refresh();return decode.decode(value);}catch{throw new Error('Secret vault decrypt failed.');}
  }
  async remove(ref){if(ref)await this.storage.delete(ref);}
}
export const secretStore=new SecretStore();
if(globalThis.addEventListener)globalThis.addEventListener('pagehide',()=>secretStore.lock());
