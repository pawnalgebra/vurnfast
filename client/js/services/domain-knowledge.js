import {DOMAIN_PACKS} from '../domain-data.js';
import {uuid,now} from '../utils.js';
import {validateDomainPack,domainCollections,emptyIntelligence} from './domain-schema.js';
export const profileFields=[['company','Company / Organization'],['sector','Sector'],['industry','Industry'],['businessModel','Business Model'],['companyType','Company Type'],['products','Primary Products'],['services','Primary Services'],['users','Primary Users'],['customers','Customer Types'],['revenueModel','Revenue Model'],['assets','Important Assets'],['sensitiveData','Sensitive Data'],['operations','Critical Operations'],['dependencies','Third-party Dependencies'],['surfaces','Technical Surfaces'],['notes','Notes']];
export const researcherProvenance=()=>({sourceType:'researcher',source:'Researcher input',confidence:.5,verified:false,notes:'Belum diverifikasi sebagai fakta target.'});
export const DomainPackRepository={
  all(workspace){const merged=new Map(DOMAIN_PACKS.map(pack=>[pack.id,pack]));for(const pack of workspace.domainPacks||[])merged.set(pack.id,pack);return [...merged.values()];},
  get(workspace,id){return this.all(workspace).find(pack=>pack.id===id);},
  save(store,pack){validateDomainPack(pack);store.saveDomainPack(structuredClone(pack));return pack;},
  import(store,text){if(new Blob([text]).size>1000000)throw new Error('Domain pack melebihi 1 MB.');const pack=JSON.parse(text);validateDomainPack(pack);return this.save(store,pack);}
};
export const TargetIntelligenceService={
  get:target=>target?.intelligence||emptyIntelligence(),
  update(store,target,values){store.updateTarget(target.id,{intelligence:{...this.get(target),...values}},{canonical:Object.keys(values).some(k=>k!=='suggestions')});},
  saveProfile(store,target,values){const previous=this.get(target).profile;const profile={...previous};for(const [key] of profileFields)if(values[key]!==undefined&&values[key]!==previous[key]?.value)profile[key]={value:values[key],...researcherProvenance()};this.update(store,target,{profile});},
  accept(store,target,item,edited={}){const intelligence=this.get(target);const record={...item,...edited,id:uuid(),status:'accepted',createdAt:now(),originId:item.id,generatedBy:item.sourceType==='ai'?'ai':'manual'};this.update(store,target,{items:[...intelligence.items,record]});return record;},
  remove(store,target,id){this.update(store,target,{items:this.get(target).items.filter(i=>i.id!==id)});}
};
export const TerminologyService={search:(packs,query)=>packs.flatMap(pack=>pack.terminology.filter(t=>JSON.stringify(t).toLowerCase().includes(query.toLowerCase())).map(item=>({pack,item})))};
export const DomainKnowledgeService={
  selected(workspace,target){const intelligence=TargetIntelligenceService.get(target);return [intelligence.primaryDomainId,...intelligence.secondaryDomainIds].filter(Boolean).map(id=>DomainPackRepository.get(workspace,id)).filter(Boolean);},
  techniques(target,pack,flowId=''){return pack.relevantTechniques.filter(m=>!flowId||m.flowId===flowId).map(mapping=>({...mapping,technique:target?.techniques.find(t=>(t.libraryId||t.id)===mapping.techniqueId)}));},
  asItem(row,kind,pack){return {id:row.id,kind,title:row.title,content:row.content,sourceType:row.sourceType,source:row.source,confidence:row.confidence,verified:row.verified,notes:row.notes,domainId:pack.id,flowId:row.flowId||'',invariantId:row.invariantId||'',techniqueId:row.techniqueId||row.techniqueIds?.[0]||'',steps:row.steps||[]};}
};
export const BusinessFlowService={
  researchCandidates(pack,flow,transitionId){const transition=flow.transitions.find(t=>t.id===transitionId)||flow.transitions.find(t=>t.critical)||flow.transitions[0];const invariant=pack.securityInvariants.find(i=>transition?.invariantIds.includes(i.id))||pack.securityInvariants.find(i=>flow.invariantIds.includes(i.id));return {transition,invariant,question:invariant?{...DomainKnowledgeService.asItem(invariant,'question',pack),id:uuid(),title:'Apa yang terjadi jika authority/state berubah?',content:`Pada ${transition?.action||flow.title}, bagaimana aturan ini ditegakkan: ${invariant.content}`,flowId:flow.id,invariantId:invariant.id,transitionId:transition?.id||''}:null};}
};
export const KnowledgeGraphService={
  edges(pack){const edges=[];for(const flow of pack.businessFlows){edges.push({from:pack.id,to:flow.id,type:'business-flow'});for(const [key,type] of [['actorIds','actor'],['objectIds','object'],['boundaryIds','boundary'],['invariantIds','invariant']])for(const id of flow[key])edges.push({from:flow.id,to:id,type});}for(const mapping of pack.relevantTechniques){edges.push({from:mapping.invariantId,to:mapping.techniqueId,type:'technique'});}return edges;},
  hypothesisDefaults(target,pack,item){
    const intelligence=TargetIntelligenceService.get(target);
    const flow=item.kind==='flow'?item:pack?.businessFlows.find(f=>f.id===item.flowId)||intelligence.items.find(i=>i.kind==='flow'&&(i.id===item.flowId||i.originId===item.flowId));
    const invariant=pack?.securityInvariants.find(i=>i.id===item.invariantId||i.id===item.originId||i.id===item.id)||intelligence.items.find(i=>i.kind==='invariant'&&(i.id===item.invariantId||i.originId===item.invariantId))||pack?.securityInvariants.find(i=>flow?.invariantIds?.includes(i.id));
    const techniqueKey=item.techniqueId||invariant?.techniqueIds?.[0]||invariant?.techniqueId;
    const technique=target.techniques.find(t=>(t.libraryId||t.id)===techniqueKey);
    const transition=flow?.transitions?.find(t=>t.id===item.transitionId)||flow?.transitions?.find(t=>t.critical);
    return {title:item.kind==='invariant'?'Uji invariant: '+item.title:item.title,invariant:item.kind==='invariant'?item.content:invariant?.content||'',expectedBehavior:item.kind==='invariant'?item.content:invariant?.content||'',potentialFailure:item.kind==='question'?item.content:'Hipotesis: aturan ini mungkin tidak ditegakkan pada critical transition; perlu evidence.',techniqueId:technique?.id||'',who:target.actors[0]?.name||'',what:transition?.action||(flow?.steps?.length>1?flow.steps.slice(0,2).join(' → '):''),object:target.objects[0]?.name||'',context:[pack?.name,flow?.title].filter(Boolean).join(' / '),notes:'Sumber '+item.sourceType+': '+item.source+'. Ini draft riset, bukan vulnerability target.',knowledgeLinks:{domainId:item.domainId,flowId:item.kind==='flow'?(item.originId||item.id):item.flowId,transitionId:item.transitionId||'',invariantId:item.kind==='invariant'?(item.originId||item.id):item.invariantId||invariant?.id||'',questionId:item.kind==='question'?(item.originId||item.id):'',sourceType:item.sourceType}};
  }
};
export function createManualPack(values,previous){
  const id=previous?.id||'custom-'+uuid(),provenance=researcherProvenance();
  const rows=(key,kind)=>String(values[key]||'').split('\n').map(s=>s.trim()).filter(Boolean).map((s,index)=>({id:`${id}-${kind}-${index+1}`,title:s,content:s,...provenance}));
  const actors=rows('actorsText','actor'),businessObjects=rows('objectsText','object'),securityInvariants=rows('invariantsText','invariant').map(row=>({...row,flowId:'',techniqueIds:[]}));
  const businessFlows=rows('flowsText','flow').map(row=>({...row,steps:row.title.split(/→|->/).map(s=>s.trim()).filter(Boolean),actorIds:[],objectIds:[],boundaryIds:[],invariantIds:[],transitions:[]}));
  for(const flow of businessFlows)flow.transitions=flow.steps.slice(1).map((step,i)=>({id:flow.id+'-transition-'+i,fromState:flow.steps[i],toState:step,action:flow.steps[i]+' → '+step,critical:false,invariantIds:[]}));
  const terminology=rows('termsText','term').map(row=>{const [term,definition='',whyImportant='',related='']=row.title.split('|').map(v=>v.trim());return {...row,title:term,content:definition,term,definition,whyImportant,relatedTerms:related.split(',').map(s=>s.trim()).filter(Boolean)};});
  return {id,name:values.name,description:values.description||'',notes:values.notes||'',provenance,coreConcepts:String(values.conceptsText||'').split('\n').filter(Boolean),terminology,actors,businessObjects,businessFlows,securityInvariants,sensitiveData:rows('sensitiveText','sensitive'),criticalAssets:rows('assetsText','asset'),commonTrustBoundaries:[],commonFailurePatterns:rows('patternsText','pattern'),relevantTechniques:[],researchQuestions:[],references:[]};
}
