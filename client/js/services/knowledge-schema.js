import {validateKnowledgeItem,checkProvenance} from './domain-schema.js';
export const knowledgeOperations=[['generate_target_knowledge','Generate Target Knowledge'],['analyze_target','Analyze Target'],['suggest_domains','Suggest Domain'],['explain_domain','Explain Domain'],['explain_terminology','Explain Terminology'],['ask_about_target','Ask About Target'],['analyze_business_flow','Analyze Business Flow'],['identify_critical_assets','Identify Critical Assets'],['generate_security_invariants','Generate Security Invariants'],['generate_domain_questions','Generate Research Questions'],['recommend_domain_techniques','Recommend Techniques']];
const kText={type:'string',maxLength:30000};
const kObject=properties=>({type:'object',additionalProperties:false,required:Object.keys(properties),properties});
const kList=items=>({type:'array',maxItems:40,items});
export const KNOWLEDGE_ITEM_SCHEMA=kObject({id:kText,kind:{type:'string',enum:['company-overview','business-model','actor','object','asset','sensitive-data','flow','terminology','boundary','invariant','question','explanation','unknown']},title:kText,content:kText,sourceType:{type:'string',enum:['ai','unknown']},source:kText,confidence:{type:'number',minimum:0,maximum:1},verified:{type:'boolean',enum:[false]},notes:kText,domainId:kText,flowId:kText,invariantId:kText,techniqueId:kText,steps:{type:'array',maxItems:60,items:{type:'string',maxLength:8000}}});
export const KNOWLEDGE_RESPONSE_SCHEMA=kObject({items:kList(KNOWLEDGE_ITEM_SCHEMA),suggestedDomains:kList(kObject({id:kText,reason:kText,sourceType:{type:'string',enum:['ai']},source:kText,confidence:{type:'number',minimum:0,maximum:1},verified:{type:'boolean',enum:[false]},notes:kText})),unknownInformation:kList(KNOWLEDGE_ITEM_SCHEMA)});
export function validateKnowledgeResponse(value){
  let nodes=0;
  const walk=(item,schema)=>{
    if(++nodes>10000)throw new Error('Knowledge output terlalu besar.');
    if(schema.type==='object'){if(!item||typeof item!=='object'||Array.isArray(item)||schema.required.some(k=>!Object.hasOwn(item,k))||Object.keys(item).some(k=>!Object.hasOwn(schema.properties,k)))throw new Error('Knowledge output object tidak valid.');for(const [key,child] of Object.entries(item))walk(child,schema.properties[key]);}
    else if(schema.type==='array'){if(!Array.isArray(item)||item.length>schema.maxItems)throw new Error('Knowledge array tidak valid.');for(const child of item)walk(child,schema.items);}
    else if(typeof item!==schema.type||(schema.type==='string'&&item.length>schema.maxLength)||(schema.type==='number'&&(!Number.isFinite(item)||item<schema.minimum||item>schema.maximum)))throw new Error('Knowledge output type tidak valid.');
    if(schema.enum&&!schema.enum.includes(item))throw new Error('Knowledge enum tidak valid.');
  };
  walk(value,KNOWLEDGE_RESPONSE_SCHEMA);const ids=new Set();
  for(const item of [...value.items,...value.unknownInformation]){validateKnowledgeItem(item);if(ids.has(item.id))throw new Error('Knowledge output ID duplikat.');ids.add(item.id);}
  return value;
}
// Bounded context: selected knowledge only; no evidence, credentials, or full workspace object.
const scalarRecord={type:'object',maxProperties:30,additionalProperties:{type:['string','number','boolean']}};
const domainLists=['terminology','actors','businessObjects','businessFlows','securityInvariants','commonTrustBoundaries','criticalAssets','sensitiveData','commonFailurePatterns','relevantTechniques','researchQuestions'];
const selectedDomain=kObject({id:kText,name:kText,description:kText,coreConcepts:{type:'array',maxItems:5,items:kText},...Object.fromEntries(domainLists.map(key=>[key,{type:'array',maxItems:key==='relevantTechniques'?10:key==='actors'||key==='businessObjects'?8:key==='businessFlows'?2:6,items:{type:'object',maxProperties:25}}]))});
export const KNOWLEDGE_REQUEST_SCHEMA=kObject({
  privacyMode:{type:'string',enum:['LOCAL_ONLY','REDACTED_CLOUD','CLOUD']},
  context:kObject({
    operation:{type:'string',enum:knowledgeOperations.map(o=>o[0])},
    target:scalarRecord,authorization:scalarRecord,programRules:scalarRecord,
    scope:{type:'object',maxProperties:10,additionalProperties:{anyOf:[kText,{type:'array',maxItems:100,items:kText}]}},
    research:scalarRecord,
    targetKnowledge:{type:'array',maxItems:30,items:{type:'object',maxProperties:20,additionalProperties:{type:['string','number','boolean','array'],maxLength:30000,maxItems:60,items:kText}}},
    domainCatalog:{type:'array',maxItems:50,items:scalarRecord},
    domains:{type:'array',maxItems:3,items:selectedDomain},
    actors:{type:'array',maxItems:8,items:scalarRecord},objects:{type:'array',maxItems:8,items:scalarRecord},boundaries:{type:'array',maxItems:8,items:scalarRecord},
    hypothesis:{anyOf:[{type:'null'},scalarRecord]},techniques:{type:'array',maxItems:20,items:scalarRecord}
  })
});
export function validateKnowledgeContext(context){
  let nodes=0;
  const walk=(value,depth=0)=>{if(++nodes>30000||depth>20)throw new Error('Knowledge context terlalu besar.');if(typeof value==='string'&&value.length>30000)throw new Error('Knowledge context field terlalu panjang.');if(value&&typeof value==='object')for(const [key,child] of Object.entries(value)){if(['__proto__','prototype','constructor'].includes(key))throw new Error('Knowledge context key tidak aman.');walk(child,depth+1);}};
  walk(context);
  if(!context||!Array.isArray(context.domains)||!Array.isArray(context.domainCatalog)||!Array.isArray(context.targetKnowledge)||!Array.isArray(context.techniques))throw new Error('Knowledge context tidak valid.');
  for(const row of context.targetKnowledge)validateKnowledgeItem(row);
  for(const domain of context.domains)for(const key of domainLists){if(!Array.isArray(domain[key]))throw new Error('Domain context tidak lengkap.');for(const row of domain[key]){checkProvenance(row);if(typeof row.id!=='string'||!row.id||typeof row.title!=='string'||typeof row.content!=='string')throw new Error('Domain context item tidak valid.');}}
  if(context.domainCatalog.some(row=>typeof row.id!=='string'||typeof row.name!=='string'))throw new Error('Domain catalog tidak valid.');
  return context;
}
