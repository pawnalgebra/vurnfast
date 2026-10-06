// MODULE: Shared strict JSON contract; optional sections use empty values, never arbitrary HTML/code.
const aiText={type:'string',maxLength:30000};
const aiStrings={type:'array',maxItems:60,items:aiText};
const aiObject=properties=>({type:'object',additionalProperties:false,properties,required:Object.keys(properties)});
const aiList=properties=>({type:'array',maxItems:30,items:aiObject(properties)});
export const AI_RESPONSE_SCHEMA=aiObject({
  scopeAssessment:aiObject({status:{type:'string',enum:['within_supplied_scope','outside_supplied_scope','unclear_scope','requires_manual_review']},reason:aiText}),
  rules:aiStrings,
  recommendedTechniques:aiList({name:aiText,priority:{type:'number',minimum:0,maximum:100},reason:aiText,securityInvariant:aiText}),
  toolSuggestions:aiList({id:aiText,name:aiText,category:aiText,purpose:aiText,usageMode:{type:'string',enum:['manual']},whyUseful:aiText,scopeWarning:aiText}),
  helperSuggestions:aiList({id:aiText,name:aiText,purpose:aiText}),
  safeNextSteps:aiStrings,avoid:aiStrings,stopConditions:aiStrings,missingContext:aiStrings,confidence:{type:'number',minimum:0,maximum:1},
  researchQuestions:aiStrings,
  hypotheses:aiList({title:aiText,invariant:aiText,expectedBehavior:aiText,potentialFailure:aiText,technique:aiText,who:aiText,what:aiText,object:aiText,state:aiText,authority:aiText,context:aiText}),
  findingAnalysis:aiObject({assessment:{type:'string',enum:['Observed','Confirmed','Hypothesis','Unknown']},potentialClass:aiText,brokenInvariant:aiText,potentialRootCause:aiText,falsePositiveChecks:aiStrings,missingEvidence:aiStrings,potentialImpact:aiText,duplicateRisk:{type:'string',enum:['Likely Unique','Possible Variant','Likely Duplicate','Unknown']},safeValidation:aiStrings}),
  researchPriority:aiObject({score:{type:'number',minimum:0,maximum:100},potentialImpact:{type:'number',minimum:0,maximum:100},likelihood:{type:'number',minimum:0,maximum:100},novelty:{type:'number',minimum:0,maximum:100},testingCost:{type:'number',minimum:0,maximum:100},duplicateRisk:{type:'number',minimum:0,maximum:100},scopeConfidence:{type:'number',minimum:0,maximum:100},evidenceQuality:{type:'number',minimum:0,maximum:100},reason:aiText}),
  gapAnalysis:aiStrings,reportDraft:aiText
});
export function validateAIOutput(value) {
  let nodes=0;
  function validate(item,schema,path) {
    if(++nodes>10000)throw new Error('AI output terlalu besar.');
    if(schema.type==='object') {
      if(!item||typeof item!=='object'||Array.isArray(item))throw new Error(path+' harus object.');
      for(const key of schema.required)if(!(Object.hasOwn(item,key)))throw new Error(path+'.'+key+' wajib ada.');
      for(const [key,child] of Object.entries(item)){if(!Object.hasOwn(schema.properties,key))throw new Error(path+' memiliki field tidak dikenal.');validate(child,schema.properties[key],path+'.'+key);}
    }else if(schema.type==='array') {
      if(!Array.isArray(item)||item.length>schema.maxItems)throw new Error(path+' array tidak valid.');item.forEach((child,i)=>validate(child,schema.items,path+'['+i+']'));
    }else if(schema.type==='string') {if(typeof item!=='string'||item.length>(schema.maxLength||30000))throw new Error(path+' teks tidak valid.');}
    else if(schema.type==='number' && (typeof item!=='number'||!Number.isFinite(item)||item<schema.minimum||item>schema.maximum))throw new Error(path+' angka tidak valid.');
    if(schema.enum && !schema.enum.includes(item))throw new Error(path+' nilai tidak diizinkan.');
  }
  validate(value,AI_RESPONSE_SCHEMA,'response');return value;
}
