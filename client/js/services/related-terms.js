import {DomainKnowledgeService} from './domain-knowledge.js';
import {messageReferenceRows} from './agent-messages.js';
const relatedVocabulary=[['authorization','Access Control','Ownership','Authority','Permission','BOLA','BFLA','Privilege'],['settlement','Clearing','Ledger','Reconciliation','Transfer','Reversal','Transaction'],['async','Worker','Queue','Revocation','Lifecycle','State']];
const normalizeRelated=value=>String(value||'').toLowerCase().replace(/[^\p{L}\p{N}]+/gu,' ').trim();
export class RelatedTermService{
  constructor(){this.cache=new Map();this.index=[];this.version='';}
  search({term,target,workspace}){
    const key=normalizeRelated(term),version=target.id+':'+target.researchRevision+':'+target.updatedAt+':'+workspace.updatedAt;
    if(this.version!==version){this.version=version;this.cache.clear();this.index=[];
      const add=(term,source,related=[],reference=null)=>{if(term)this.index.push({term,source,related,reference});};
      for(const pack of DomainKnowledgeService.selected(workspace,target))for(const item of pack.terminology)add(item.term,'Terminology · '+pack.name,item.relatedTerms||[]);
      for(const pack of DomainKnowledgeService.selected(workspace,target)){for(const term of pack.coreConcepts)add(term,'Domain Knowledge · '+pack.name);for(const row of [...pack.securityInvariants,...pack.businessFlows])add(row.title,'Domain Knowledge · '+pack.name);}
      for(const row of target.techniques)add(row.name,'Technique Library',[row.securityInvariant||'']);
      for(const row of target.intelligence.items.filter(i=>i.status==='accepted'))add(row.title,'Target Knowledge');
      for(const ref of messageReferenceRows(target))add(ref.label,'Workspace',[],{kind:ref.kind,id:ref.id});
    }
    if(this.cache.has(key))return this.cache.get(key);
    if(key.length<2)return {term,related:[]};
    const found=new Map(),put=(label,source,score,reference=null)=>{if(!label||normalizeRelated(label)===key||label.length>100)return;const previous=found.get(normalizeRelated(label));if(!previous||previous.score<score)found.set(normalizeRelated(label),{term:label,source,score,...(reference?{reference}:{})});};
    // Exact terminology edges precede generic local vocabulary and substring similarity.
    for(const row of this.index)if(normalizeRelated(row.term)===key)for(const other of row.related)put(other,row.source,.98);
    for(const group of relatedVocabulary)if(group.some(t=>normalizeRelated(t)===key))for(const other of group)put(other,group[0]==='settlement'?'Domain vocabulary (generic)':'Local terminology',.91);
    const tokens=key.split(' ').filter(t=>t.length>2);
    for(const row of this.index){const text=normalizeRelated(row.term),count=tokens.filter(t=>text.includes(t)).length;if(text.includes(key)||count)put(row.term,row.source,text.includes(key)?.85:.5+count/Math.max(tokens.length,1)*.25,row.reference);}
    const result={term,related:[...found.values()].sort((a,b)=>b.score-a.score||a.term.localeCompare(b.term)).slice(0,8)};
    if(this.cache.size>=100)this.cache.delete(this.cache.keys().next().value);this.cache.set(key,result);return result;
  }
}
