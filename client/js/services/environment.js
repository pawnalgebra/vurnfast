import {SecretRedactor} from './redactor.js';
export const environmentRuleNames=['automationAllowed','authenticatedTestingAllowed','multipleAccountTestingAllowed','thirdPartyTestingAllowed','productionTestingAllowed','destructiveTestingAllowed','socialEngineeringAllowed','dosAllowed','scannerAllowed','customHeaderRequired','researcherIdentificationRequired'];
export const ruleChoices=['Unknown','Allowed','Not Allowed'];
export const authMethods=['None','Cookie','Bearer Token','API Key','Basic Auth','Custom Header','Manual'];
export const environmentTextFields=['name','baseUrl','allowedAssets','testTenant','ownedData','dummyIdentifiers','rateLimit','userAgent','researcherHeader','automationRestrictions','testingRestrictions','programRulesText','safeHarbor','knownIssues','outOfScopeNotes','specialInstructions','notes'];
export const emptyResearchEnvironment=()=>({...Object.fromEntries(environmentTextFields.map(k=>[k,''])),rules:Object.fromEntries(environmentRuleNames.map(k=>[k,'Unknown'])),accounts:[],profiles:[],headers:[]});
export const environmentSecretRef=(targetId,ownerId,kind)=>'secret://'+encodeURIComponent(targetId)+'/'+encodeURIComponent(ownerId)+'/'+kind;
export const sensitiveHeader=name=>/authorization|cookie|api[-_]?key|token|secret|password|session|csrf|xsrf/i.test(name);
const fields={accounts:['id','name','role','purpose','username','tenant','ownership','notes','credentialRef'],profiles:['id','name','accountId','actorId','authType','tenant','ownership','purpose','notes','secretRef','cookieRef','cookieUpdatedAt','sessionStatus'],headers:['id','name','value','secretRef','secret','enabled']};
export function validateResearchEnvironment(env,target){
  const fail=()=>{throw new Error('Research Environment metadata/reference tidak valid; raw secrets tidak boleh berada di workspace.');};
  if(!env||typeof env!=='object'||Array.isArray(env)||Object.keys(env).some(k=>![...environmentTextFields,'rules','accounts','profiles','headers'].includes(k)))fail();
  if(environmentTextFields.some(k=>typeof env[k]!=='string'||env[k].length>12000))fail();
  const containsKnownSecret=value=>{const emailsRedacted=value.replace(/\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/gi,'[REDACTED_EMAIL]');return SecretRedactor.redact(emailsRedacted)!==emailsRedacted;};
  if(environmentTextFields.some(k=>containsKnownSecret(env[k])))fail();
  if(!env.rules||Object.keys(env.rules).length!==environmentRuleNames.length||environmentRuleNames.some(k=>!ruleChoices.includes(env.rules[k])))fail();
  const seen=new Set();
  for(const [collection,keys] of Object.entries(fields)){
    if(!Array.isArray(env[collection])||env[collection].length>50)fail();
    for(const row of env[collection]){
      if(!row||Object.keys(row).some(k=>!keys.includes(k))||keys.some(k=>['secret','enabled'].includes(k)?typeof row[k]!=='boolean':typeof row[k]!=='string'||row[k].length>12000)||!row.id||row.id.length>120||!row.name.trim()||seen.has(row.id))fail();seen.add(row.id);
      const refs=collection==='accounts'?[['credentialRef','credential']]:collection==='profiles'?[['secretRef','auth'],['cookieRef','cookie']]:[['secretRef','header']];
      for(const [key,kind] of refs)if(row[key]&&row[key]!==environmentSecretRef(target.id,row.id,kind))fail();
      if(keys.filter(k=>!['username','credentialRef','secretRef','cookieRef'].includes(k)).some(k=>typeof row[k]==='string'&&containsKnownSecret(row[k])))fail();
      if(collection==='profiles'&&(!authMethods.includes(row.authType)||!['Unknown','Expired'].includes(row.sessionStatus)||row.accountId&&!env.accounts.some(a=>a.id===row.accountId)||row.actorId&&!target.actors.some(a=>a.id===row.actorId)))fail();
      if(collection==='headers'&&(sensitiveHeader(row.name)&&!row.secret||row.secret&&row.value||!row.secret&&row.secretRef||!/^[-!#$%&'*+.^_`|~0-9A-Za-z]+$/.test(row.name)||/[\r\n]/.test(row.value)))fail();
    }
  }
  return env;
}
export function environmentMetadata(target){
  const env=target.researchEnvironment||emptyResearchEnvironment();
  return SecretRedactor.context({name:env.name,baseUrl:env.baseUrl,allowedAssets:env.allowedAssets,testTenant:env.testTenant,ownedData:env.ownedData,dummyIdentifiers:env.dummyIdentifiers,rateLimit:env.rateLimit,userAgent:env.userAgent,researcherHeader:env.researcherHeader,rules:{...env.rules},automationRestrictions:env.automationRestrictions,testingRestrictions:env.testingRestrictions,programRulesText:env.programRulesText,safeHarbor:env.safeHarbor,knownIssues:env.knownIssues,outOfScopeNotes:env.outOfScopeNotes,specialInstructions:env.specialInstructions,notes:env.notes,
    accounts:env.accounts.map(a=>({id:a.id,name:a.name,role:a.role,purpose:a.purpose,tenant:a.tenant,ownership:a.ownership,credentialConfigured:!!a.credentialRef})),
    profiles:env.profiles.map(p=>({id:p.id,name:p.name,accountId:p.accountId,actorId:p.actorId,authType:p.authType,tenant:p.tenant,ownership:p.ownership,purpose:p.purpose,credentialConfigured:!!p.secretRef,cookieConfigured:!!p.cookieRef,sessionStatus:p.sessionStatus})),
    headers:env.headers.map(h=>({name:h.name,enabled:h.enabled,secret:h.secret,configured:!!(h.secret?h.secretRef:h.value)}))});
}
export function effectiveProgramRules(target){
  const rules=target.researchEnvironment?.rules;
  const choose=(key,legacy)=>rules?rules[key]==='Allowed':target.programRules?.[legacy]===true;
  return {automationAllowed:choose('automationAllowed','automationAllowed'),dosAllowed:choose('dosAllowed','dosAllowed'),thirdPartyTesting:choose('thirdPartyTestingAllowed','thirdPartyTesting')};
}
export function environmentReadiness(target){const e=target.researchEnvironment;return e?.baseUrl&&target.scope?.inScope?.trim()&&e.rateLimit.trim()&&e.rules.automationAllowed!=='Unknown'?'Ready':'Incomplete';}
// Native local helpers need no environment. This gate is mandatory for future target adapters.
export function checkEnvironmentAction(metadata,action,{asset,scopeAllowed,toolAllowed,credentialAvailable=false}={}){
  const result=(status,reason)=>({status,reason});
  if(!metadata)return result('REQUIRES_REVIEW','Research Environment belum configured.');
  if(scopeAllowed!==true)return result('REQUIRES_REVIEW','Asset/scope perlu diperiksa.');
  const assets=metadata.allowedAssets.split(/\r?\n/).map(s=>s.trim().toLowerCase()).filter(Boolean);
  if(!assets.includes(String(asset||'').trim().toLowerCase()))return result('REQUIRES_REVIEW','Asset tidak cocok tepat dengan allowed environment assets.');
  if(toolAllowed!==true)return result('REQUIRES_REVIEW','Tool permission belum verified.');
  const selectedProfile=action.authProfileId?metadata.profiles.find(p=>p.id===action.authProfileId):null;
  const required=['automationAllowed',...(action.authProfileId&&selectedProfile?.authType!=='None'?['authenticatedTestingAllowed']:[]),...(action.multipleAccounts?['multipleAccountTestingAllowed']:[]),...(action.thirdParty?['thirdPartyTestingAllowed']:[]),...(action.production?['productionTestingAllowed']:[]),...(action.scanner?['scannerAllowed']:[])];
  for(const key of required){if(metadata.rules[key]==='Not Allowed')return result('DENIED',key+' tidak diizinkan program.');if(metadata.rules[key]!=='Allowed')return result('REQUIRES_REVIEW',key+' masih Unknown.');}
  if(action.destructive||action.dos||action.socialEngineering)return result('DENIED','Capability tidak didukung executor.');
  if(!metadata.rateLimit.trim()||/^(unknown|n\/a|unspecified|\?)$/i.test(metadata.rateLimit.trim()))return result('REQUIRES_REVIEW','Rate limit belum diketahui.');
  if(action.authProfileId){const p=metadata.profiles.find(p=>p.id===action.authProfileId);if(!p||p.authType!=='None'&&(!credentialAvailable||p.sessionStatus==='Expired'))return result('WAITING_FOR_ENVIRONMENT','Authentication Required: profile/credential belum tersedia atau expired.');}
  if(metadata.rules.customHeaderRequired==='Unknown'||metadata.rules.researcherIdentificationRequired==='Unknown')return result('REQUIRES_REVIEW','Header/identification requirements masih Unknown.');
  if(metadata.rules.customHeaderRequired==='Allowed'&&!metadata.headers.some(h=>h.enabled&&h.configured))return result('WAITING_FOR_ENVIRONMENT','Required custom header belum configured.');
  if(metadata.rules.researcherIdentificationRequired==='Allowed'&&(!metadata.researcherHeader.trim()||!metadata.headers.some(h=>h.enabled&&h.configured&&h.name.toLowerCase()===metadata.researcherHeader.trim().toLowerCase())))return result('WAITING_FOR_ENVIRONMENT','Researcher identification header/value belum configured.');
  return result('APPROVAL_REQUIRED','Environment checks satisfied; bound human approval and adapter checks remain required.');
}
export const authenticationOptions=target=>[['','Optional / no authentication context'],...(target.researchEnvironment?.profiles||[]).map(p=>[p.id,p.name+' / '+p.authType])];
const metaText={type:'string',maxLength:12000},metaBool={type:'boolean'};
const metaObject=properties=>({type:'object',additionalProperties:false,required:Object.keys(properties),properties});
const metaRows=properties=>({type:'array',maxItems:50,items:metaObject(properties)});
export const ENVIRONMENT_METADATA_SCHEMA=metaObject({...Object.fromEntries(environmentTextFields.map(k=>[k,metaText])),rules:metaObject(Object.fromEntries(environmentRuleNames.map(k=>[k,{type:'string',enum:ruleChoices}]))),accounts:metaRows({...Object.fromEntries(['id','name','role','purpose','tenant','ownership'].map(k=>[k,metaText])),credentialConfigured:metaBool}),profiles:metaRows({...Object.fromEntries(['id','name','accountId','actorId','authType','tenant','ownership','purpose','sessionStatus'].map(k=>[k,metaText])),credentialConfigured:metaBool,cookieConfigured:metaBool}),headers:metaRows({name:metaText,enabled:metaBool,secret:metaBool,configured:metaBool})});
export function validateEnvironmentMetadata(metadata){
  const check=(value,schema)=>{if(schema.type==='object'){if(!value||typeof value!=='object'||Array.isArray(value)||schema.required.some(k=>!Object.hasOwn(value,k))||Object.keys(value).some(k=>!Object.hasOwn(schema.properties,k)))throw new Error('Environment context fields invalid.');for(const [key,s] of Object.entries(schema.properties))check(value[key],s);}else if(schema.type==='array'){if(!Array.isArray(value)||value.length>schema.maxItems)throw new Error('Environment context collection invalid.');value.forEach(row=>check(row,schema.items));}else if(typeof value!==schema.type||schema.maxLength&&value.length>schema.maxLength||schema.enum&&!schema.enum.includes(value))throw new Error('Environment context value invalid.');};
  check(metadata,ENVIRONMENT_METADATA_SCHEMA);return metadata;
}
