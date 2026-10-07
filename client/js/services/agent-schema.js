import {validateMessageRecord,validateMessageMemory} from './message-contract.js';
// Shared data contracts. Decisions and observations are separate from model inference.
export const agentStages=[
  ['target-intelligence','Target Intelligence Agent','Target Intelligence','INTELLIGENCE_READY'],
  ['domain-knowledge','Domain Knowledge Agent','Domain Knowledge','INTELLIGENCE_READY'],
  ['scope','Scope Agent','Scope','SCOPE_VALIDATED'],
  ['attack-surface','Attack Surface Agent','Attack Surface','SURFACE_MAPPED'],
  ['trust-boundary','Trust Boundary Agent','Trust Boundaries','BOUNDARIES_MAPPED'],
  ['technique','Technique Agent','Techniques','TECHNIQUES_SELECTED'],
  ['hypothesis','Hypothesis Agent','Research Questions & Hypotheses','HYPOTHESES_READY'],
  ['test-planner','Test Planner Agent','Test Planning','TEST_PLANNED'],
  ['evidence','Evidence Agent','Evidence Analysis','EVIDENCE_READY'],
  ['finding','Finding Agent','Finding Analysis','FINDING_REVIEW'],
  ['false-positive','False Positive Agent','False Positive Review','FINDING_REVIEW'],
  ['duplicate','Duplicate Agent','Duplicate Review','FINDING_REVIEW'],
  ['report','Report Agent','Report','REPORT_READY']
];
export const researchStates=['TARGET_CREATED','INTELLIGENCE_READY','SCOPE_VALIDATED','SURFACE_MAPPED','BOUNDARIES_MAPPED','TECHNIQUES_SELECTED','HYPOTHESES_READY','TEST_PLANNED','WAITING_REVIEW','WAITING_APPROVAL','TESTING','EVIDENCE_READY','FINDING_REVIEW','REPORT_READY','COMPLETED','PAUSED','RUNNING','OBSERVATION_READY','CONTRADICTION_DETECTED','HYPOTHESIS_REANALYSIS','HYPOTHESIS_READY','ADVERSARIAL_REVIEW','NEEDS_MORE_TESTING','FINDING_CANDIDATE','CONFIRMED','REJECTED'];
export const proposalKinds=['knowledge','actor','object','boundary','technique','tool-recommendation','question','hypothesis','test-plan','evidence-analysis','potential-finding','false-positive','duplicate','report','scope-question','uncertain-analysis'];
export const manualAnalysisTypes=['Observation','Assessment','Correction','Research Idea','Potential Root Cause','Next Test Suggestion','Notes'];
export const capabilityPermissions=['SAFE_AUTO','APPROVAL_REQUIRED','DENIED'];
export const adapterIds=['knowledge-search','json-parse','evidence-compare','http-request','browser','network-tool','package-install','root-command','destructive-action'];
export const agentContentFields=['name','authority','type','owner','tenant','state','sensitivity','from','to','channel','trust','invariant','expectedBehavior','potentialFailure','who','what','object','context','preconditions','steps','expectedResult','actualResult','startingAuthority','securityRestriction','protectedResource','unauthorizedOutcome','rootCause','impact','vulnerabilityClass','reportMarkdown'];
const aText={type:'string',maxLength:12000};
const aObject=properties=>({type:'object',additionalProperties:false,required:Object.keys(properties),properties});
export const AGENT_PROPOSAL_SCHEMA=aObject({kind:{type:'string',enum:proposalKinds},title:aText,analysis:aText,reason:aText,confidence:{type:'number',minimum:0,maximum:1},notes:aText,relatedTechniqueId:aText,relatedToolId:aText,relatedHypothesisId:aText,relatedTestId:aText,relatedFindingId:aText,evidenceIds:{type:'array',maxItems:12,items:aText},content:aObject(Object.fromEntries(agentContentFields.map(f=>[f,aText])))});
export const AGENT_ACTION_SCHEMA=aObject({adapter:{type:'string',enum:adapterIds},toolId:aText,goal:aText,reason:aText,input:aObject({query:aText,json:aText,leftEvidenceId:aText,rightEvidenceId:aText,url:aText}),risk:{type:'string',enum:['low','medium','high']},expectedResult:aText,stopConditions:{type:'array',maxItems:12,items:aText}});
export const AGENT_RESPONSE_SCHEMA=aObject({summary:aText,confidence:{type:'number',minimum:0,maximum:1},notes:aText,proposals:{type:'array',maxItems:8,items:AGENT_PROPOSAL_SCHEMA},actions:{type:'array',maxItems:3,items:AGENT_ACTION_SCHEMA},unknownInformation:{type:'array',maxItems:12,items:aText}});
export const emptyAgentContent=()=>Object.fromEntries(agentContentFields.map(k=>[k,'']));
export const emptyAgentResearch=()=>({state:'TARGET_CREATED',reason:'',currentTask:'',currentStage:'',completedStages:[],reviewQueue:[],manualAnalysis:[],history:[],runs:[],pendingActions:[],replanFrom:'',progress:0,revision:0});
export const builtinTools=()=>[
  {id:'builtin-search',name:'Workspace Knowledge Search',installed:true,version:'2.0.0',path:'In-process adapter',capabilities:['knowledge-search'],agentAccess:'SAFE_AUTO',notes:'Selected local context only; no Internet search.'},
  {id:'builtin-json',name:'Workspace JSON Parser',installed:true,version:'2.0.0',path:'In-process adapter',capabilities:['json-parsing'],agentAccess:'SAFE_AUTO',notes:'Bounded JSON parsing; no shell.'},
  {id:'builtin-compare',name:'Workspace Evidence Comparator',installed:true,version:'2.0.0',path:'In-process adapter',capabilities:['evidence-comparison'],agentAccess:'SAFE_AUTO',notes:'Existing redacted evidence; no target interaction.'}
];
export function agentSafeTree(value){
  let nodes=0;
  const walk=(v,depth=0)=>{if(++nodes>80000||depth>25)throw new Error('Agent data terlalu besar/dalam.');if(typeof v==='string'&&v.length>60000)throw new Error('Agent field terlalu panjang.');if(v&&typeof v==='object')for(const [key,child] of Object.entries(v)){if(['__proto__','constructor','prototype'].includes(key))throw new Error('Agent key tidak aman.');walk(child,depth+1);}};
  walk(value);return value;
}
export function validateAgentResponse(value){
  agentSafeTree(value);
  if(new TextEncoder().encode(JSON.stringify(value)).length>100000)throw new Error('Agent output terlalu besar.');
  const check=(v,s)=>{if(s.type==='object'){if(!v||typeof v!=='object'||Array.isArray(v)||s.required.some(k=>!Object.hasOwn(v,k))||Object.keys(v).some(k=>!Object.hasOwn(s.properties,k)))throw new Error('Agent output object tidak valid.');for(const [k,c] of Object.entries(v))check(c,s.properties[k]);}
    else if(s.type==='array'){if(!Array.isArray(v)||v.length>s.maxItems)throw new Error('Agent output array tidak valid.');v.forEach(c=>check(c,s.items));}
    else if(typeof v!==s.type||s.type==='string'&&v.length>s.maxLength||s.type==='number'&&(!Number.isFinite(v)||v<s.minimum||v>s.maximum))throw new Error('Agent output field tidak valid.');
    if(s.enum&&!s.enum.includes(v))throw new Error('Agent output enum tidak valid.');};
  check(value,AGENT_RESPONSE_SCHEMA);return value;
}
export function validateStructuredAgentAction(action){
  agentSafeTree(action);
  if(!action||typeof action.id!=='string'||!action.id||action.id.length>120)throw new Error('Action ID tidak valid.');
  const core=Object.fromEntries(Object.keys(AGENT_ACTION_SCHEMA.properties).map(k=>[k,action[k]]));
  validateAgentResponse({summary:'',confidence:1,notes:'',proposals:[],actions:[core],unknownInformation:[]});
  if(action.approvalToken!==undefined&&(typeof action.approvalToken!=='string'||action.approvalToken.length>20000))throw new Error('Approval token tidak valid.');
  return action;
}
export function validateToolInventory(tools){
  if(!Array.isArray(tools)||tools.length>100)throw new Error('Tool inventory tidak valid.');const ids=new Set();
  for(const tool of tools){if(!tool||['id','name','version','path','notes'].some(k=>typeof tool[k]!=='string')||!tool.id||!tool.name.trim()||ids.has(tool.id)||typeof tool.installed!=='boolean'||!capabilityPermissions.includes(tool.agentAccess)||!Array.isArray(tool.capabilities)||tool.capabilities.some(c=>typeof c!=='string'))throw new Error('Tool inventory item tidak valid.');ids.add(tool.id);}
  agentSafeTree(tools);return tools;
}
export function validateAgentResearch(research){
  agentSafeTree(research);
  if(research?.messages!==undefined){if(!Array.isArray(research.messages)||research.messages.length>1000||new Set(research.messages.map(m=>m.id)).size!==research.messages.length)throw new Error('Conversation tidak valid.');research.messages.forEach(validateMessageRecord);}
  if(research?.messageSessionId!==undefined&&(typeof research.messageSessionId!=='string'||!research.messageSessionId||research.messageSessionId.length>120))throw new Error('Conversation session tidak valid.');
  if(research?.conversationSummary!==undefined)validateMessageMemory(research.conversationSummary);
  if(!research||!researchStates.includes(research.state)||['reason','currentTask','currentStage','replanFrom'].some(k=>typeof research[k]!=='string')||!Number.isInteger(research.revision)||research.revision<0||!Number.isFinite(research.progress)||research.progress<0||research.progress>100)throw new Error('Research state tidak valid.');
  for(const k of ['completedStages','reviewQueue','manualAnalysis','history','runs','pendingActions'])if(!Array.isArray(research[k])||research[k].length>2000)throw new Error('Research collection tidak valid.');
  if(research.completedStages.some(id=>!agentStages.some(s=>s[0]===id)))throw new Error('Research stage tidak valid.');
  const ids=new Set();
  for(const row of [...research.reviewQueue,...research.manualAnalysis,...research.history,...research.runs,...research.pendingActions]){if(!row||typeof row.id!=='string'||!row.id||ids.has(row.id))throw new Error('Agent record ID tidak valid.');ids.add(row.id);}
  for(const proposal of research.reviewQueue){if(!proposalKinds.includes(proposal.kind)||!['PROPOSED','ACCEPTED','EDITED','REJECTED'].includes(proposal.status)||!['ai','system'].includes(proposal.sourceType)||proposal.verified!==false||!Number.isFinite(proposal.confidence)||proposal.confidence<0||proposal.confidence>1||['title','analysis','reason','notes','source','agentId','createdAt'].some(k=>typeof proposal[k]!=='string')||!Array.isArray(proposal.evidenceIds)||proposal.evidenceIds.some(v=>typeof v!=='string')||!proposal.content||agentContentFields.some(k=>typeof proposal.content[k]!=='string'))throw new Error('Agent proposal tidak valid.');}
  for(const row of research.manualAnalysis)if(!manualAnalysisTypes.includes(row.type)||['title','content','createdAt'].some(k=>typeof row[k]!=='string')||row.sourceType!=='researcher')throw new Error('Manual analysis tidak valid.');
  for(const action of research.pendingActions)if(!adapterIds.includes(action.adapter)||!capabilityPermissions.includes(action.permission)||!['PROPOSED','APPROVED','EXECUTED','REJECTED','DENIED','FAILED'].includes(action.status)||['goal','reason','toolId','expectedResult','approvalToken','policyReason'].some(k=>typeof action[k]!=='string')||!['low','medium','high'].includes(action.risk)||!Array.isArray(action.stopConditions)||action.stopConditions.some(v=>typeof v!=='string')||!action.input||['query','json','leftEvidenceId','rightEvidenceId','url'].some(k=>typeof action.input[k]!=='string'))throw new Error('Action approval tidak valid.');
  for(const row of research.history)if(['agent','task','startedAt','completedAt','status','resultSummary','researcherDecision'].some(k=>typeof row[k]!=='string')||!Array.isArray(row.toolsUsed)||row.toolsUsed.some(t=>typeof t!=='string')||!Number.isFinite(row.estimatedCostUSD)||row.estimatedCostUSD<0)throw new Error('Agent history tidak valid.');
  for(const run of research.runs)if(!Number.isFinite(run.estimatedCostUSD)||run.estimatedCostUSD<0||!Number.isInteger(run.steps)||run.steps<0||typeof run.status!=='string')throw new Error('Agent run tidak valid.');
  return research;
}
