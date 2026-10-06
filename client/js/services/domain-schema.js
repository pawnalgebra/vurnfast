// Shared validation for shipped packs, user modifications and workspace imports.
export const provenanceTypes=['researcher','target','domain','ai','external','unknown'];
export const domainCollections=['terminology','actors','businessObjects','businessFlows','sensitiveData','criticalAssets','commonTrustBoundaries','securityInvariants','commonFailurePatterns','relevantTechniques','researchQuestions'];
export const intelligenceKinds=['company-overview','business-model','actor','object','asset','sensitive-data','flow','terminology','boundary','invariant','question','explanation','unknown'];
export function checkProvenance(item){
  if(!item||!provenanceTypes.includes(item.sourceType)||typeof item.source!=='string'||typeof item.notes!=='string'||typeof item.verified!=='boolean'||!Number.isFinite(item.confidence)||item.confidence<0||item.confidence>1)throw new Error('Knowledge provenance tidak valid.');
  if(item.sourceType==='target'&&(!item.verified||!item.source.trim()))throw new Error('TARGET FACT membutuhkan source dan verifikasi peneliti.');
}
export function validateKnowledgeItem(item){
  checkProvenance(item);
  for(const key of ['id','kind','title','content','domainId','flowId','invariantId','techniqueId'])if(typeof item[key]!=='string'||item[key].length>30000)throw new Error('Knowledge item '+key+' tidak valid.');
  if(!item.id||!intelligenceKinds.includes(item.kind)||!Array.isArray(item.steps)||item.steps.some(s=>typeof s!=='string'||s.length>8000)||item.steps.length>60)throw new Error('Knowledge item tidak valid.');
  if(item.sourceType==='ai'&&item.verified)throw new Error('AI inference tidak dapat menjadi verified otomatis. Gunakan verifikasi eksplisit sebagai TARGET FACT dengan source.');
  return item;
}
export function validateDomainPack(pack){
  let nodes=0;
  const safe=(value,depth=0)=>{if(++nodes>100000||depth>30)throw new Error('Domain pack terlalu besar/dalam.');if(typeof value==='string'&&value.length>30000)throw new Error('Field domain terlalu panjang.');if(value&&typeof value==='object')for(const [key,child] of Object.entries(value)){if(['__proto__','prototype','constructor'].includes(key))throw new Error('Key knowledge tidak aman.');safe(child,depth+1);}};
  safe(pack);
  if(!pack||typeof pack!=='object'||Array.isArray(pack)||typeof pack.id!=='string'||!pack.id||pack.id.length>150||typeof pack.name!=='string'||!pack.name.trim()||typeof pack.description!=='string'||typeof pack.notes!=='string')throw new Error('Profil domain pack tidak valid.');
  checkProvenance(pack.provenance);
  if(!Array.isArray(pack.coreConcepts)||pack.coreConcepts.length>100||pack.coreConcepts.some(s=>typeof s!=='string'))throw new Error('Core concepts harus daftar teks.');
  const ids=new Set();
  for(const key of domainCollections){
    if(!Array.isArray(pack[key])||pack[key].length>250)throw new Error('Domain collection '+key+' tidak valid.');
    for(const row of pack[key]){
      checkProvenance(row);
      if(typeof row.id!=='string'||!row.id||ids.has(row.id)||typeof row.title!=='string'||typeof row.content!=='string')throw new Error('Domain item/ID tidak valid.');ids.add(row.id);
      for(const [name,value] of Object.entries(row))if(['__proto__','prototype','constructor'].includes(name)||typeof value==='function')throw new Error('Key knowledge tidak aman.');
      if(key==='terminology'&&(['term','definition','whyImportant'].some(k=>typeof row[k]!=='string')||!Array.isArray(row.relatedTerms)||row.relatedTerms.some(t=>typeof t!=='string')))throw new Error('Terminology tidak valid.');
      if(key==='businessFlows'){
        for(const list of ['steps','actorIds','objectIds','boundaryIds','invariantIds'])if(!Array.isArray(row[list])||row[list].some(s=>typeof s!=='string'))throw new Error('Business flow '+list+' tidak valid.');
        if(!Array.isArray(row.transitions)||row.transitions.length>60||row.transitions.some(t=>!t||['id','fromState','toState','action'].some(k=>typeof t[k]!=='string')||typeof t.critical!=='boolean'||!Array.isArray(t.invariantIds)||t.invariantIds.some(v=>typeof v!=='string')))throw new Error('Critical transition tidak valid.');
      }
      if(key==='relevantTechniques'&&(typeof row.techniqueId!=='string'||typeof row.flowId!=='string'||typeof row.invariantId!=='string'||!Number.isFinite(row.researchPriority)||row.researchPriority<0||row.researchPriority>100))throw new Error('Technique mapping tidak valid.');
      if(key==='securityInvariants'&&(!Array.isArray(row.techniqueIds)||row.techniqueIds.some(t=>typeof t!=='string')||typeof row.flowId!=='string'))throw new Error('Invariant mapping tidak valid.');
      if(key==='commonTrustBoundaries'&&['fromComponent','toComponent','channel','authority','flowId'].some(k=>typeof row[k]!=='string'))throw new Error('Domain boundary tidak valid.');
      if(key==='researchQuestions'&&['flowId','invariantId','techniqueId'].some(k=>typeof row[k]!=='string'))throw new Error('Question relationship tidak valid.');
    }
  }
  const ref=(id,collection)=>{if(id&&!pack[collection].some(r=>r.id===id))throw new Error('Domain relationship tidak ditemukan: '+id);};
  for(const flow of pack.businessFlows){for(const [key,collection] of [['actorIds','actors'],['objectIds','businessObjects'],['boundaryIds','commonTrustBoundaries'],['invariantIds','securityInvariants']])for(const id of flow[key])ref(id,collection);for(const t of flow.transitions)for(const id of t.invariantIds)ref(id,'securityInvariants');}
  for(const row of [...pack.securityInvariants,...pack.commonTrustBoundaries,...pack.relevantTechniques,...pack.researchQuestions]){ref(row.flowId,'businessFlows');if(row.invariantId)ref(row.invariantId,'securityInvariants');}
  if(!Array.isArray(pack.references)||pack.references.some(r=>!r||typeof r.title!=='string'||typeof r.url!=='string'||typeof r.notes!=='string'||!/^https?:\/\//.test(r.url)))throw new Error('Domain references tidak valid.');
  return pack;
}
export const emptyIntelligence=()=>({profile:{},primaryDomainId:'',secondaryDomainIds:[],items:[],suggestions:[]});
export function validateIntelligence(intelligence){
  if(!intelligence||typeof intelligence!=='object'||Array.isArray(intelligence)||!intelligence.profile||typeof intelligence.profile!=='object'||Array.isArray(intelligence.profile)||typeof intelligence.primaryDomainId!=='string'||!Array.isArray(intelligence.secondaryDomainIds)||intelligence.secondaryDomainIds.some(id=>typeof id!=='string')||!Array.isArray(intelligence.items)||!Array.isArray(intelligence.suggestions))throw new Error('Target intelligence tidak valid.');
  for(const [key,field] of Object.entries(intelligence.profile)){if(!field||typeof field.value!=='string'||field.value.length>30000)throw new Error('Intelligence profile '+key+' tidak valid.');checkProvenance(field);}
  if(intelligence.classificationProvenance)checkProvenance(intelligence.classificationProvenance);
  const ids=new Set();for(const item of intelligence.items){validateKnowledgeItem(item);if(ids.has(item.id)||!['accepted','rejected'].includes(item.status))throw new Error('Knowledge ID/status tidak valid.');ids.add(item.id);}
  return intelligence;
}
