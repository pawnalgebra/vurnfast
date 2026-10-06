import {DomainPackRepository} from './domain-knowledge.js';
// Search indexes related flow text so terminology can lead to invariants and techniques.
export function knowledgeSearch(workspace,query,targetId=''){
  const text=query.trim().toLowerCase();if(!text)return [];
  const results=[],match=value=>JSON.stringify(value).toLowerCase().includes(text);
  const add=(title,category,route,extra={})=>results.push({title,category,route,...extra});
  for(const target of workspace.targets.filter(t=>!targetId||t.id===targetId)){
    if(match({name:target.name,asset:target.asset,intelligence:target.intelligence?.profile}))add(target.name,'Target','target-intelligence',{targetId:target.id});
    for(const [collection,route,category] of [['hypotheses','hypotheses','Hypothesis'],['testCases','tests','Test Case'],['findings','findings','Finding'],['notes','notes','Research Notes'],['techniques','techniques','Technique'],['knowledgeBase','knowledge','Research Pattern / Lesson']])for(const row of target[collection])if(match(row))add(row.title||row.name||'Research Notes',category,route,{targetId:target.id,itemId:row.id});
    for(const item of target.intelligence?.items||[])if(match(item))add(item.title,'Target Knowledge · '+item.kind,'target-intelligence',{targetId:target.id,itemId:item.id,domainId:item.domainId});
  }
  for(const pack of DomainPackRepository.all(workspace)){
    if(match({name:pack.name,description:pack.description,concepts:pack.coreConcepts}))add(pack.name,'Domain Knowledge','domain-knowledge',{domainId:pack.id});
    for(const term of pack.terminology)if(match(term))add(term.term,pack.name+' Terminology','terminology',{domainId:pack.id,itemId:term.id});
    for(const flow of pack.businessFlows)if(match(flow))add(flow.title,pack.name+' Business Flow','business-flows',{domainId:pack.id,itemId:flow.id});
    for(const [collection,section,category] of [['securityInvariants','invariants','Security Invariant'],['commonFailurePatterns','patterns','Research Pattern'],['researchQuestions','questions','Research Question'],['relevantTechniques','techniques','Related Technique']])for(const item of pack[collection]){
      const flow=pack.businessFlows.find(f=>f.id===item.flowId);if(match({item,relatedFlow:flow?.steps,relatedFlowTitle:flow?.title}))add(item.title,pack.name+' '+category,collection==='researchQuestions'?'research-questions':'domain-knowledge',{domainId:pack.id,itemId:item.id,section});
    }
  }return results.slice(0,200);
}
