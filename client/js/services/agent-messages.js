import {analyzeAdvancedResearch} from './advanced-research.js';
import {validateMessageRecord} from './message-contract.js';
import {agentStages} from './agent-schema.js';
import {SecretRedactor} from './redactor.js';
import {uuid,now} from '../utils.js';
export const messageAgents=[['general','General'],['orchestrator','Orchestrator'],...agentStages.map(([id,name])=>[({'target-intelligence':'target','domain-knowledge':'domain','attack-surface':'surface','trust-boundary':'boundary','test-planner':'test'})[id]||id,name])];
export const messageAgentDomains={general:'Coordinate the conversation and relevant specialists',orchestrator:'Automatic routing (legacy alias)',target:'Company context and target intelligence',domain:'Industry concepts and business flows',scope:'Scope, authorization and program rules',surface:'Actors, objects and attack surface',boundary:'Trust transitions and authority',technique:'Techniques and manual tools',hypothesis:'Invariants, hypotheses and variants',test:'Reviewed hypotheses and manual test plans',evidence:'Observations and control comparisons',finding:'Potential findings and evidence gaps','false-positive':'Alternative explanations and controls',duplicate:'Similar findings and duplicate risk',report:'Confirmed findings and reports'};
export const contextCollections={actor:'actors',object:'objects',boundary:'boundaries',technique:'techniques',hypothesis:'hypotheses',test:'testCases',evidence:'evidence',finding:'findings',report:'findings'};
export const messageContextKinds=['target','scope','chain','constraint','signal','unknown',...Object.keys(contextCollections)];
export function messageReferenceRows(target){
  if(!target)return [];
  const discovery=target.researchModel?analyzeAdvancedResearch(target).discovery:null;
  const discoveries=discovery?Object.entries({chain:discovery.chains,constraint:discovery.constraints,signal:discovery.relationships,unknown:discovery.unknowns}).flatMap(([kind,rows])=>rows.map(r=>({kind,id:r.id,label:r.summary||r.question||r.category||r.id}))):[];
  return [...discoveries,{kind:'target',id:target.id,label:target.name},{kind:'scope',id:target.id,label:'Scope & rules'},...Object.entries(contextCollections).flatMap(([kind,key])=>target[key].map(row=>({kind,id:row.id,label:row.title||row.label||row.name||[row.from,row.to].filter(Boolean).join(' → ')})))];
}
export function parseMessageTags(text,target){
  const agents=[...text.matchAll(/(?:^|\s)@([\w-]+)/g)].map(m=>m[1]);
  const uniqueAgents=[...new Set(agents)];
  if(agents.some(a=>!messageAgents.some(([id])=>id===a))||uniqueAgents.length>4)throw new Error('Pilih maksimal empat @agent yang tersedia.');
  const contextRefs=[],tags=[];
  for(const match of text.matchAll(/(?:^|\s)#([\w-]+)(?::([^\s,;]+))?/g)){
    const [,kind,rawId]=match,id=rawId?.replace(/[.!?]+$/,'');
    if(messageContextKinds.includes(kind)){
      const resolved=id||(['target','scope'].includes(kind)?target.id:'');
      if(!resolved||!messageReferenceRows(target).some(r=>r.kind===kind&&r.id===resolved))throw new Error('#'+kind+' perlu reference ID yang valid dari target aktif.');
      if(!contextRefs.some(r=>r.kind===kind&&r.id===resolved))contextRefs.push({kind,id:resolved});
    }else if(id)throw new Error('Jenis context reference tidak tersedia.');
    else tags.push(kind);
  }
  if(contextRefs.length>12||tags.length>16)throw new Error('Maksimal 12 context references dan 16 tags.');
  return {agent:agents[0]||'general',...(!agents.length||agents[0]==='general'?{routing:agents.length?'mentions':'auto'}:{}),...(uniqueAgents.length>1?{agents:uniqueAgents}:{}),contextRefs,tags:[...new Set(tags)]};
}
// All specialists are eligible. Automatic teams are bounded; explicit mentions select only those members.
export function planMessageAgents(message,refs=message.contextRefs||[]){
  const explicit=message.agents||[message.agent||'general'];
  if(explicit.length>4||explicit.some(alias=>!messageAgents.some(([id])=>id===alias)))throw new Error('Unknown specialist.');
  if(message.routing==='mentions'||!explicit.some(alias=>['general','orchestrator'].includes(alias)))return [...new Set(explicit.map(alias=>routeMessageAgent(alias,message.text,refs)))];
  const query=message.text.toLowerCase(),scores=new Map();
  const add=(id,score)=>scores.set(id,(scores.get(id)||0)+score);
  const domains=[['target-intelligence',/company|perusahaan|target|business model|produk/i],['domain-knowledge',/domain|industry|industri|settlement|ledger|glossary|istilah|business flow|alur bisnis/i],['scope',/scope|izin|rules|allowed|authorization checklist|otorisasi/i],['attack-surface',/surface|permukaan|actor|aktor|object|objek|endpoint|mapping|pemetaan/i],['trust-boundary',/boundary|batas trust|trust|authority|otoritas/i],['technique',/technique|teknik|tool|alat/i],['hypothesis',/hypothes|hipotes|invariant|variant|kemungkinan/i],['test-planner',/test plan|rencana test|rencana uji|generate test|susun.*test|precondition|langkah.*uji/i],['evidence',/evidence|bukti|observation|observasi|compare|pembanding|control|kontrol|hasil test/i],['finding',/finding|temuan|root cause|akar masalah|impact|dampak/i],['false-positive',/false.?positive|alternatif|alternative|penjelasan lain/i],['duplicate',/duplicat|duplikat|similar finding/i],['report',/report|laporan|draft/i]];
  for(const [id,pattern] of domains)if(pattern.test(query))add(id,4);
  const byKind={chain:'hypothesis',constraint:'hypothesis',signal:'hypothesis',unknown:'false-positive',target:'target-intelligence',scope:'scope',actor:'attack-surface',object:'attack-surface',boundary:'trust-boundary',technique:'technique',hypothesis:'hypothesis',test:'evidence',evidence:'evidence',finding:'finding',report:'report'};
  for(const ref of refs)add(byKind[ref.kind]||'target-intelligence',['target','scope'].includes(ref.kind)?1:2);
  const selected=explicit.filter(alias=>!['general','orchestrator'].includes(alias)).map(alias=>routeMessageAgent(alias,message.text,refs));
  const relevant=[...scores].sort((a,b)=>b[1]-a[1]).filter(([,score])=>score>=2).map(([id])=>id);
  return ['general',...[...new Set([...selected,...relevant])].slice(0,3)];
}
export function routeMessageAgent(alias,text,refs=[]){
  const ids={'target':'target-intelligence',domain:'domain-knowledge',surface:'attack-surface',boundary:'trust-boundary',test:'test-planner'};
  if(alias!=='orchestrator')return ids[alias]||alias;
  const query=text.toLowerCase();
  if(/false.?positive/.test(query))return 'false-positive';
  if(/duplicat|duplikat/.test(query))return 'duplicate';
  if(/report|laporan/.test(query)||refs.some(r=>r.kind==='report'))return 'report';
  if(/scope|izin|rules|allowed/.test(query))return 'scope';
  if(/generate test|test plan|rencana test/.test(query))return 'test-planner';
  const focus=refs.findLast(r=>!['target','scope'].includes(r.kind))?.kind;
  if(['finding','evidence','hypothesis','boundary','technique'].includes(focus))return ids[focus]||focus;
  if(focus==='test')return 'evidence';
  if(focus==='actor'||focus==='object')return 'attack-surface';
  if(/domain|settlement|terminolog|jelaskan/.test(query))return 'domain-knowledge';
  if(/hypothes|hipotes|variant|kemungkinan/.test(query))return 'hypothesis';
  return 'target-intelligence';
}
// Extractive local memory: no background model calls and no private reasoning.
export function summarizeMessageMemory(messages,previous){
  const older=messages.slice(0,-4),throughId=older.at(-1)?.id||'';
  if(previous?.throughId===throughId)return previous;
  return {throughId,text:SecretRedactor.redact(older.slice(-10).map(m=>m.sender+': '+m.message.slice(0,140)).join('\n')).slice(0,1600)};
}
export const AgentMessageService={
  list:target=>target?.agentResearch?.messages||[],
  append(store,target,values){
    const research=structuredClone(target.agentResearch),messages=research.messages||[];
    if(messages.length>=1000)throw new Error('Conversation penuh (1000 pesan). Ekspor lalu gunakan Clear conversation.');
    research.messageSessionId||=uuid();
    const row=SecretRedactor.context({id:uuid(),timestamp:now(),researchSessionId:research.messageSessionId,targetId:target.id,contextRefs:[],tags:[],status:'sent',...values});validateMessageRecord(row);
    research.messages=[...messages,row];research.conversationSummary=summarizeMessageMemory(research.messages,research.conversationSummary);store.updateResearch(target.id,research);return row;
  },
  clear(store,target){const research=structuredClone(target.agentResearch);research.messages=[];research.messageSessionId=uuid();research.conversationSummary={throughId:'',text:''};store.updateResearch(target.id,research);}
};
