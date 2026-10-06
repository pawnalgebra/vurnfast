import {uuid,now} from './utils.js';
import {DEFAULT_TECHNIQUES} from './technique-data.js';
import {collections,migrateWorkspace} from './storage.js';
// MODULE: Central state; all mutations update timestamps and schedule persistence.
export const freshWorkspace=()=>({schemaVersion:'2.0.0',applicationVersion:'0.2.0',updatedAt:now(),targets:[]});
export function newTarget(values) {
  return {id:uuid(),name:'',platform:'Bugcrowd',programUrl:'',asset:'',environment:'',version:'',status:'active',createdAt:now(),updatedAt:now(),scope:{guard:{}},programRules:{automationAllowed:false,dosAllowed:false,thirdPartyTesting:false},actors:[],objects:[],boundaries:[],techniques:DEFAULT_TECHNIQUES.map(item=>({...item,id:uuid(),libraryId:item.id,enabled:true,tested:false,interesting:false,notes:'',securityInvariant:item.securityInvariant||item.hypothesisTemplate,dimensions:['who','what','object','state','authority','context'],falsePositiveIndicators:['Periksa role efektif, kepemilikan data, state terbaru, dan respons backend.'],stopConditions:[item.stopCondition],researchPriority:50,duplicateRisk:50,testingCost:50})),hypotheses:[],testCases:[],findings:[],evidence:[],notes:[],knowledgeBase:[],aiSuggestions:[],helperRecords:[],...values};
}
export function createStore(initial=freshWorkspace()) {
  let state=migrateWorkspace(initial); const listeners=new Set();
  function notify() {listeners.forEach(fn=>fn(state));}
  function touch(target) {state.updatedAt=now();if(target) target.updatedAt=state.updatedAt;notify();}
  return {
    get:()=>state, subscribe(fn){listeners.add(fn);return()=>listeners.delete(fn);},
    target:id=>state.targets.find(t=>t.id===id),
    addTarget(values){const target=newTarget(values);state.targets.push(target);touch(target);return target;},
    updateTarget(id,values){const target=this.target(id);if(!target) throw new Error('Target tidak ditemukan.');Object.assign(target,values);touch(target);},
    deleteTarget(id){state.targets=state.targets.filter(t=>t.id!==id);touch();},
    upsert(targetId,collection,values){
      if(!collections.includes(collection)) throw new Error('Collection tidak dikenal.');
      const target=this.target(targetId);let row=target[collection].find(v=>v.id===values.id);
      if(row) Object.assign(row,values,{updatedAt:now()});
      else {row={id:uuid(),createdAt:now(),updatedAt:now(),...values};target[collection].push(row);}
      touch(target);return row;
    },
    remove(targetId,collection,id){
      const target=this.target(targetId);target[collection]=target[collection].filter(v=>v.id!==id);
      // PURPOSE: Remove dangling relationships without deleting independent research records.
      if(collection==='hypotheses') for(const test of target.testCases) if(test.hypothesisId===id) test.hypothesisId='';
      if(collection==='boundaries')for(const test of target.testCases)if(test.boundaryId===id)test.boundaryId='';
      if(collection==='techniques') for(const row of [...target.hypotheses,...target.testCases,...target.findings]) if(row.techniqueId===id) row.techniqueId='';
      if(collection==='testCases') {for(const f of target.findings) if(f.testCaseId===id) f.testCaseId='';for(const e of target.evidence) if(e.testCaseId===id) e.testCaseId='';}
      if(collection==='findings') for(const e of target.evidence) if(e.findingId===id) e.findingId='';
      if(collection==='evidence') for(const row of [...target.testCases,...target.findings]) row.evidenceIds=(row.evidenceIds||[]).filter(v=>v!==id);
      touch(target);
    },
    replace(input){state=migrateWorkspace(input);notify();},
    reset(){state=freshWorkspace();notify();}
  };
}
