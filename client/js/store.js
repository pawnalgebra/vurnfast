import {uuid,now} from './utils.js';
import {DEFAULT_TECHNIQUES} from './technique-data.js';
import {collections,migrateWorkspace} from './storage.js';
import {emptyIntelligence,validateDomainPack} from './services/domain-schema.js';
import {emptyAgentResearch,builtinTools,validateAgentResearch,validateToolInventory} from './services/agent-schema.js';
import {validateResearchEnvironment} from './services/environment.js';
import {validateResearchModel,snapshotResearchEvidence,repairResearchReferences} from './services/research-model.js';
// MODULE: Central state; all mutations update timestamps and schedule persistence.
export const freshWorkspace=()=>({schemaVersion:'2.0.0',applicationVersion:'2.0.0',updatedAt:now(),domainPacks:[],toolInventory:builtinTools(),targets:[]});
export function newTarget(values) {
  return {id:uuid(),agentResearch:emptyAgentResearch(),researchRevision:0,name:'',platform:'Bugcrowd',programUrl:'',asset:'',environment:'',version:'',status:'active',createdAt:now(),updatedAt:now(),intelligence:emptyIntelligence(),scope:{guard:{}},programRules:{automationAllowed:false,dosAllowed:false,thirdPartyTesting:false},actors:[],objects:[],boundaries:[],techniques:DEFAULT_TECHNIQUES.map(item=>({...item,id:uuid(),libraryId:item.id,enabled:true,tested:false,interesting:false,notes:'',securityInvariant:item.securityInvariant||item.hypothesisTemplate,dimensions:['who','what','object','state','authority','context'],falsePositiveIndicators:['Periksa role efektif, kepemilikan data, state terbaru, dan respons backend.'],stopConditions:[item.stopCondition],researchPriority:50,duplicateRisk:50,testingCost:50})),hypotheses:[],testCases:[],findings:[],evidence:[],notes:[],knowledgeBase:[],aiSuggestions:[],helperRecords:[],...values};
}
export function createStore(initial=freshWorkspace(),{readOnly=false}={}) {
  let state=migrateWorkspace(initial); const listeners=new Set();
  const writable=()=>{if(readOnly)throw new Error('Workspace read-only: pulihkan data melalui Import Backup sebelum mengedit.');};
  function notify() {listeners.forEach(fn=>fn(state));}
  function invalidate(target){for(const p of target.agentResearch.reviewQueue)if(p.status==='PROPOSED')p.stale=true;for(const a of target.agentResearch.pendingActions)if(a.status==='PROPOSED'){a.status='DENIED';a.approvalToken='';a.policyReason='Canonical context changed; review a fresh action.';}}
  function touch(target,canonical=true) {state.updatedAt=now();if(target){target.updatedAt=state.updatedAt;if(canonical){target.researchRevision=(target.researchRevision||0)+1;invalidate(target);}}notify();}
  return {
    get:()=>state, subscribe(fn){listeners.add(fn);return()=>listeners.delete(fn);},
    target:id=>state.targets.find(t=>t.id===id),
    isReadOnly:()=>readOnly,
    lock(){readOnly=true;},
    addTarget(values){writable();const target=newTarget(values);target.agentResearch??=emptyAgentResearch();target.researchRevision??=0;state.targets.push(target);touch(target);return target;},
    updateTarget(id,values,{canonical=true}={}){writable();const target=this.target(id);if(!target) throw new Error('Target tidak ditemukan.');Object.assign(target,values);touch(target,canonical);},
    updateResearch(id,research,{canonical=false}={}){writable();validateAgentResearch(research);const target=this.target(id);if(!target)throw new Error('Target tidak ditemukan.');if(research.messages?.some(m=>m.targetId!==id))throw new Error('Conversation target tidak valid.');target.agentResearch=structuredClone(research);touch(target,canonical);},
    updateEnvironment(id,environment){writable();const target=this.target(id);if(!target)throw new Error('Target tidak ditemukan.');validateResearchEnvironment(environment,target);target.researchEnvironment=structuredClone(environment);for(const row of [...target.hypotheses,...target.testCases])if(row.authProfileId&&!environment.profiles.some(p=>p.id===row.authProfileId))row.authProfileId='';repairResearchReferences(target);touch(target);},
    updateResearchModel(id,model){writable();const target=this.target(id);if(!target)throw new Error('Target tidak ditemukan.');validateResearchModel(model,target);target.researchModel=snapshotResearchEvidence(model,target);target.agentResearch.replanFrom='hypothesis';touch(target);},
    saveTool(tool){writable();const tools=state.toolInventory.filter(t=>t.id!==tool.id);tools.push(tool);validateToolInventory(tools);state.toolInventory=tools;for(const target of state.targets){target.researchRevision=(target.researchRevision||0)+1;invalidate(target);}touch();},
    removeTool(id){writable();state.toolInventory=state.toolInventory.filter(t=>t.id!==id);for(const target of state.targets){target.researchRevision=(target.researchRevision||0)+1;invalidate(target);}touch();},
    deleteTarget(id){writable();state.targets=state.targets.filter(t=>t.id!==id);touch();},
    saveDomainPack(pack){writable();validateDomainPack(pack);const index=state.domainPacks.findIndex(p=>p.id===pack.id);if(index<0)state.domainPacks.push(pack);else state.domainPacks[index]=pack;for(const target of state.targets){target.researchRevision=(target.researchRevision||0)+1;invalidate(target);}touch();},
    removeDomainPack(id){writable();state.domainPacks=state.domainPacks.filter(p=>p.id!==id);for(const target of state.targets){target.researchRevision=(target.researchRevision||0)+1;invalidate(target);}touch();},
    upsert(targetId,collection,values){
      writable();
      if(!collections.includes(collection)) throw new Error('Collection tidak dikenal.');
      const target=this.target(targetId);let row=target[collection].find(v=>v.id===values.id);
      if(row) Object.assign(row,values,{updatedAt:now()});
      else {row={id:uuid(),createdAt:now(),updatedAt:now(),...values};target[collection].push(row);}
      touch(target,collection!=='aiSuggestions');return row;
    },
    remove(targetId,collection,id){
      writable();
      const target=this.target(targetId);target[collection]=target[collection].filter(v=>v.id!==id);
      if(collection==='actors')for(const p of target.researchEnvironment?.profiles||[])if(p.actorId===id)p.actorId='';
      // PURPOSE: Remove dangling relationships without deleting independent research records.
      if(collection==='hypotheses') for(const test of target.testCases) if(test.hypothesisId===id) test.hypothesisId='';
      if(collection==='boundaries')for(const test of target.testCases)if(test.boundaryId===id)test.boundaryId='';
      if(collection==='techniques') for(const row of [...target.hypotheses,...target.testCases,...target.findings]) if(row.techniqueId===id) row.techniqueId='';
      if(collection==='testCases') {for(const f of target.findings) if(f.testCaseId===id) f.testCaseId='';for(const e of target.evidence) if(e.testCaseId===id) e.testCaseId='';}
      if(collection==='findings') for(const e of target.evidence) if(e.findingId===id) e.findingId='';
      if(collection==='evidence') for(const row of [...target.testCases,...target.findings]) row.evidenceIds=(row.evidenceIds||[]).filter(v=>v!==id);
      repairResearchReferences(target);touch(target);
    },
    replace(input,{recover=false}={}){if(!recover)writable();const validated=migrateWorkspace(input);state=validated;if(recover)readOnly=false;notify();},
    reset(){writable();state=freshWorkspace();notify();}
  };
}
