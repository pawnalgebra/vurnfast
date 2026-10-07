import {execFile} from 'node:child_process';
import {promisify} from 'node:util';
import {createHmac,createHash,timingSafeEqual,randomUUID} from 'node:crypto';
import {agentSafeTree} from '../../client/js/services/agent-schema.js';
import {SecretRedactor} from '../../client/js/services/redactor.js';
import {compareText} from '../../client/js/services/analysis.js';
import {policyFor} from '../../client/js/services/rules.js';
import {checkEnvironmentAction} from '../../client/js/services/environment.js';
import {NormalizedObservationService} from '../../client/js/services/research-model.js';
const runFile=promisify(execFile);
const localAdapters={'knowledge-search':{toolId:'builtin-search',capability:'knowledge-search'},'json-parse':{toolId:'builtin-json',capability:'json-parsing'},'evidence-compare':{toolId:'builtin-compare',capability:'evidence-comparison'}};
const approvalPolicyKey=context=>createHash('sha256').update(JSON.stringify([context.knowledge.scope,context.knowledge.authorization,context.knowledge.programRules,context.environment])).digest('hex');
export function agentScopePolicy(context){
  return policyFor(context.knowledge);
}
export function evaluateAgentAction(action,context,inventory,config){
  const policy=agentScopePolicy(context),adapter=localAdapters[action.adapter];
  if(!policy.canRecommend)return {permission:'DENIED',reason:policy.assessment.reason,capability:adapter?.capability||action.adapter};
  if(!adapter){const gate=checkEnvironmentAction(context.environment,action,{asset:context.knowledge.target.asset,scopeAllowed:policy.canRecommend,toolAllowed:inventory.some(t=>t.id===action.toolId&&t.installed&&t.agentAccess!=='DENIED')});return {permission:'DENIED',environmentStatus:gate.status,reason:['package-install','root-command','destructive-action'].includes(action.adapter)?'Capability dilarang.':gate.status+': '+gate.reason+' External adapter tetap unavailable; no target execution.',capability:action.adapter};}
  if(!config.localToolAccess)return {permission:'DENIED',reason:'Local tool access disabled.',capability:adapter.capability};
  const tool=inventory.find(t=>t.id===adapter.toolId);
  if(action.toolId!==adapter.toolId||!tool?.installed||!tool.capabilities.includes(adapter.capability)||tool.agentAccess==='DENIED')return {permission:'DENIED',reason:'Tool unavailable atau capability tidak diizinkan.',capability:adapter.capability};
  if(action.adapter==='evidence-compare'&&(!context.evidence.some(e=>e.id===action.input.leftEvidenceId)||!context.evidence.some(e=>e.id===action.input.rightEvidenceId)))return {permission:'DENIED',reason:'Evidence yang dipilih tidak tersedia pada context.',capability:adapter.capability};
  return {permission:tool.agentAccess,reason:'Native local adapter; existing selected data only. Tidak memakai executable/path inventory.',capability:adapter.capability};
}
export class AgentToolAdapters{
  constructor(secret){this.secret=secret;this.usedApprovals=new Set();}
  sign(action,context){const payload=JSON.stringify({id:action.id,adapter:action.adapter,toolId:action.toolId,input:action.input,targetId:context.targetId,revision:context.revision,policyKey:approvalPolicyKey(context),expires:Date.now()+600000});return Buffer.from(payload).toString('base64url')+'.'+createHmac('sha256',this.secret).update(payload).digest('hex');}
  consumeApproval(action,context,token){
    if(typeof token!=='string'||token.length>40000||this.usedApprovals.has(token))throw new Error('Approval expired/used; replan diperlukan.');
    const [encoded,signature]=token.split('.');let payload;try{payload=Buffer.from(encoded,'base64url').toString('utf8');}catch{throw new Error('Approval tidak valid.');}
    const expected=createHmac('sha256',this.secret).update(payload).digest('hex');if(typeof signature!=='string'||signature.length!==expected.length||!timingSafeEqual(Buffer.from(signature),Buffer.from(expected)))throw new Error('Approval tidak valid.');
    const claim=JSON.parse(payload);
    if(claim.expires<Date.now()||claim.targetId!==context.targetId||claim.revision!==context.revision||claim.policyKey!==approvalPolicyKey(context)||claim.id!==action.id||claim.adapter!==action.adapter||claim.toolId!==action.toolId||JSON.stringify(claim.input)!==JSON.stringify(action.input))throw new Error('Action/context berubah; review approval ulang.');
    this.usedApprovals.add(token);
  }
  async execute(action,context){
    if(action.adapter==='json-parse'){if(action.input.json.length>12000)throw new Error('JSON terlalu besar.');const parsed=agentSafeTree(JSON.parse(action.input.json));return {summary:'JSON parsed locally.',result:JSON.stringify(SecretRedactor.context(parsed)).slice(0,12000),evidenceIds:[]};}
    if(action.adapter==='knowledge-search'){const q=action.input.query.toLowerCase().trim();if(!q)throw new Error('Query wajib diisi.');const rows=context.knowledge.domains.flatMap(p=>[...p.terminology,...p.businessFlows,...p.securityInvariants]).filter(r=>JSON.stringify(r).toLowerCase().includes(q)).slice(0,12);return {summary:rows.length+' selected local knowledge matches.',result:JSON.stringify(rows.map(r=>({id:r.id,title:r.title,content:r.content,sourceType:r.sourceType}))).slice(0,12000),evidenceIds:[]};}
    if(action.adapter==='evidence-compare'){const a=context.evidence.find(e=>e.id===action.input.leftEvidenceId),b=context.evidence.find(e=>e.id===action.input.rightEvidenceId);if(!a||!b)throw new Error('Evidence tidak tersedia.');const text=compareText(SecretRedactor.redact(a.content),SecretRedactor.redact(b.content)),observations=context.researchModel?.observations||[],left=observations.find(o=>o.evidenceRefs.includes(a.id)),right=observations.find(o=>o.evidenceRefs.includes(b.id)),result=left&&right?{text,semantic:NormalizedObservationService.compare(left,right),sourceType:'local-derived',targetObservation:false}:text;return {summary:'Existing evidence compared locally; differences are observations, not vulnerability confirmation.',result:JSON.stringify(SecretRedactor.context(result)).slice(0,12000),evidenceIds:[a.id,b.id]};}
    throw new Error('Adapter denied/unavailable.');
  }
}
// Detection uses fixed commands/arguments only. No supplied path, shell, installation or target URL.
export async function detectLocalTools(){
  const commands=[['curl','curl',['--version'],'http-inspection'],['jq','jq',['--version'],'json-parsing'],['Git','git',['--version'],'version-control'],['Node.js','node',['--version'],'local-runtime'],['Python','python',['--version'],'local-runtime'],['Docker','docker',['--version'],'local-containers']];
  return Promise.all(commands.map(async([name,command,args,capability])=>{let installed=false,version='',path='';try{const output=await runFile(command,args,{timeout:2500,maxBuffer:16000,windowsHide:true,shell:false});installed=true;version=SecretRedactor.redact((output.stdout||output.stderr).split(/\r?\n/)[0]).slice(0,500);try{const location=await runFile(process.platform==='win32'?'where.exe':'which',[command],{timeout:1000,maxBuffer:16000,windowsHide:true,shell:false});path=location.stdout.split(/\r?\n/)[0].trim();}catch{path='Resolved from backend PATH';}}catch{}return {id:randomUUID(),name,installed,version,path,capabilities:[capability],agentAccess:'APPROVAL_REQUIRED',notes:'Detected on localhost backend device; not installed or invoked against any target.'};}));
}
