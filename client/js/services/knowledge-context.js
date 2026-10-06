import {DomainPackRepository,TargetIntelligenceService,profileFields} from './domain-knowledge.js';
import {buildResearchContext} from './context.js';
// Context is deliberately selected and capped; unrelated targets, evidence and config never enter it.
export function buildKnowledgeContext(workspace,target,options={}){
  const basic=buildResearchContext(target),intelligence=TargetIntelligenceService.get(target);
  const pack=DomainPackRepository.get(workspace,options.domainId||intelligence.primaryDomainId);
  const choose=(row,keys)=>Object.fromEntries(keys.map(k=>[k,row[k]??'']));
  const fields=profileFields.map(([key,label])=>intelligence.profile[key]?.value?{id:'profile-'+key,kind:key==='businessModel'?'business-model':'company-overview',title:label,content:intelligence.profile[key].value,...choose(intelligence.profile[key],['sourceType','source','confidence','verified','notes']),domainId:pack?.id||'',flowId:'',invariantId:'',techniqueId:'',steps:[]}:null).filter(Boolean);
  const flow=pack?.businessFlows.find(f=>f.id===options.flowId);
  const selection=pack?{
    id:pack.id,name:pack.name,description:pack.description,coreConcepts:pack.coreConcepts.slice(0,5),
    terminology:(options.term?pack.terminology.filter(t=>t.term===options.term):pack.terminology.slice(0,6)),
    actors:pack.actors.slice(0,8),businessObjects:pack.businessObjects.slice(0,8),
    businessFlows:(flow?[flow]:pack.businessFlows.slice(0,2)),
    securityInvariants:pack.securityInvariants.filter(i=>!flow||i.flowId===flow.id).slice(0,6),
    commonTrustBoundaries:pack.commonTrustBoundaries.filter(b=>!flow||b.flowId===flow.id).slice(0,6),
    criticalAssets:pack.criticalAssets.slice(0,6),sensitiveData:pack.sensitiveData.slice(0,6),
    commonFailurePatterns:pack.commonFailurePatterns.slice(0,6),relevantTechniques:pack.relevantTechniques.filter(m=>!flow||m.flowId===flow.id).slice(0,10),researchQuestions:pack.researchQuestions.filter(q=>!flow||q.flowId===flow.id).slice(0,6)
  }:null;
  const allowedTechniques=new Set(selection?.relevantTechniques.map(m=>m.techniqueId)||[]);
  const accepted=intelligence.items.filter(i=>i.status==='accepted'&&(!pack||i.domainId===pack.id||!i.domainId)&&(!options.flowId||i.flowId===options.flowId||!i.flowId)).slice(0,Math.max(0,30-fields.length));
  const hypothesis=target.hypotheses.find(h=>h.id===options.hypothesisId);
  return {operation:options.operation||'generate_target_knowledge',target:basic.target,authorization:basic.authorization,programRules:basic.programRules,scope:basic.scope,
    research:{question:options.question||'',notes:options.notes||'',level:options.level||'Beginner',domainId:pack?.id||'',flowId:options.flowId||'',term:options.term||''},
    targetKnowledge:[...fields,...accepted.map(i=>choose(i,['id','kind','title','content','sourceType','source','confidence','verified','notes','domainId','flowId','invariantId','techniqueId','steps']))],
    domainCatalog:DomainPackRepository.all(workspace).map(p=>({id:p.id,name:p.name})).slice(0,50),domains:selection?[selection]:[],
    actors:target.actors.slice(0,8).map(a=>choose(a,['name','authority','notes'])),objects:target.objects.slice(0,8).map(o=>choose(o,['name','type','owner','tenant','state','sensitivity','notes'])),boundaries:target.boundaries.slice(0,8).map(b=>choose(b,['id','from','to','channel','authority','trust','notes'])),
    hypothesis:hypothesis?choose(hypothesis,['title','invariant','potentialFailure','who','what','object','state','authority','context','status']):null,
    techniques:target.techniques.filter(t=>t.enabled&&allowedTechniques.has(t.libraryId||t.id)).slice(0,20).map(t=>choose(t,['id','libraryId','name','securityInvariant']))};
}
