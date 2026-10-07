import {KNOWLEDGE_REQUEST_SCHEMA} from '../../client/js/services/knowledge-schema.js';
import {validateAgentResearch,validateToolInventory,validateStructuredAgentAction} from '../../client/js/services/agent-schema.js';
import {validateAgentContext} from './research-orchestrator.js';
import {evaluateAgentAction,detectLocalTools} from './agent-tools.js';
import {ENVIRONMENT_METADATA_SCHEMA} from '../../client/js/services/environment.js';
import {validateMessageAttachments} from '../../client/js/services/message-attachments.js';
const messageAttachmentSchema={type:'array',maxItems:3,items:{type:'object',additionalProperties:false,required:['id','name','type','size'],properties:{id:{type:'string',minLength:1,maxLength:120},name:{type:'string',minLength:1,maxLength:180},type:{type:'string',enum:['text/plain','image/png','image/jpeg','image/webp']},size:{type:'integer',minimum:1,maximum:750000},text:{type:'string',maxLength:60000},data:{type:'string',maxLength:1000000}}}};
const text={type:'string',maxLength:60000};
const record={type:'object',maxProperties:35,additionalProperties:{type:['string','number','boolean','array'],maxLength:60000,maxItems:30,items:{type:'string',maxLength:60000}}};
export const AGENT_CONTEXT_SCHEMA={type:'object',additionalProperties:false,required:['targetId','revision','knowledge','hypotheses','tests','evidence','findings','lessons','manualAnalysis','sensitiveEvidenceIds'],properties:{targetId:{type:'string',minLength:1,maxLength:120},revision:{type:'integer',minimum:0},knowledge:KNOWLEDGE_REQUEST_SCHEMA.properties.context,environment:ENVIRONMENT_METADATA_SCHEMA,...Object.fromEntries(['hypotheses','tests','evidence','findings','lessons','manualAnalysis'].map(k=>[k,{type:'array',maxItems:30,items:record}])),sensitiveEvidenceIds:{type:'array',maxItems:12,items:text}}};
const inventorySchema={type:'array',maxItems:100,items:{type:'object',maxProperties:12}};
const researchSchema={type:'object',maxProperties:35};
const runSchema={type:'object',additionalProperties:false,required:['runId','context','research','inventory','privacyMode'],properties:{runId:{type:'string',minLength:1,maxLength:120},context:AGENT_CONTEXT_SCHEMA,research:researchSchema,inventory:inventorySchema,privacyMode:{type:'string',enum:['LOCAL_ONLY','REDACTED_CLOUD','CLOUD']}}};
const idSchema={type:'object',additionalProperties:false,required:['runId'],properties:{runId:{type:'string',minLength:1,maxLength:120}}};
export function registerAgentAPI(app,{config,orchestrator,adapters,ledger,acquire,release,providerReady}){
  const guard=(privacyMode,reply)=>{
    if(!config.agentic.enabled){reply.code(503).send({status:'Disabled',error:'Agentic AI disabled. Manual analysis dan research tetap tersedia.'});return false;}
    if(!providerReady){reply.code(503).send({status:'Misconfigured',error:'AI provider belum configured.'});return false;}
    if(privacyMode==='LOCAL_ONLY'&&config.provider!=='ollama'||config.privacyMode==='LOCAL_ONLY'&&privacyMode!=='LOCAL_ONLY'){reply.code(400).send({error:'Privacy mode tidak sesuai backend.'});return false;}return true;
  };
  app.get('/api/agent/config',async()=>{let dailyEstimatedCostUSD=null;try{dailyEstimatedCostUSD=await ledger.spentToday();}catch{}return {...config.agentic,configured:config.agentic.enabled&&config.configured,dailyEstimatedCostUSD};});
  app.post('/api/agent/run',{schema:{body:runSchema}},async(request,reply)=>{
    if(!guard(request.body.privacyMode,reply))return;
    try{validateAgentContext(request.body.context);validateAgentResearch(request.body.research);validateToolInventory(request.body.inventory);}catch{return reply.code(400).send({error:'Agent context/research/inventory tidak valid.'});}
    if(!acquire())return reply.code(429).send({error:'Satu analisis sedang berjalan.'});
    try{return {research:await orchestrator.run(request.body)};}finally{release();}
  });
  app.post('/api/agent/message',{bodyLimit:2000000,schema:{body:{type:'object',additionalProperties:false,required:['runId','context','message','inventory','privacyMode','memory','researchState'],properties:{runId:runSchema.properties.runId,context:AGENT_CONTEXT_SCHEMA,inventory:inventorySchema,privacyMode:runSchema.properties.privacyMode,message:{type:'object',additionalProperties:false,required:['text','agent','contextRefs','tags'],properties:{routing:{type:'string',enum:['auto','mentions']},model:{type:'string',minLength:1,maxLength:180},agents:{type:'array',minItems:1,maxItems:4,uniqueItems:true,items:{type:'string',maxLength:40}},attachments:messageAttachmentSchema,text:{type:'string',minLength:1,maxLength:6000},agent:{type:'string',maxLength:40},contextRefs:{type:'array',maxItems:12,items:{type:'object',additionalProperties:false,required:['kind','id'],properties:{kind:{type:'string',enum:['target','scope','actor','object','boundary','technique','hypothesis','test','evidence','finding','report']},id:{type:'string',minLength:1,maxLength:120}}}},tags:{type:'array',maxItems:16,items:{type:'string',maxLength:100}}}},memory:{type:'object',additionalProperties:false,required:['summary','recent'],properties:{summary:{type:'string',maxLength:1600},recent:{type:'array',maxItems:4,items:{type:'object',additionalProperties:false,required:['sender','agent','message'],properties:{sender:{type:'string',enum:['researcher','agent']},agent:{type:'string',maxLength:40},message:{type:'string',maxLength:1200}}}}}},researchState:{type:'object',additionalProperties:false,required:['state','currentStage','currentTask','progress'],properties:{state:{type:'string',maxLength:40},currentStage:{type:'string',maxLength:40},currentTask:{type:'string',maxLength:300},progress:{type:'number',minimum:0,maximum:100}}}}}}},async(request,reply)=>{
    if(!guard(request.body.privacyMode,reply))return;
    try{validateAgentContext(request.body.context);validateToolInventory(request.body.inventory);
      const {context,message}=request.body,collections={actor:'actors',object:'objects',hypothesis:'hypotheses',test:'tests',evidence:'evidence',finding:'findings',report:'findings',technique:'techniques',boundary:'boundaries'};
      validateMessageAttachments(message.attachments||[]);
      for(const ref of message.contextRefs){if(['target','scope'].includes(ref.kind)&&ref.id!==context.targetId)throw new Error('Wrong target.');const key=collections[ref.kind];if(key&&!(['actor','object','technique','boundary'].includes(ref.kind)?context.knowledge[key]:context[key]).some(r=>r.id===ref.id))throw new Error('Missing selected reference.');}
    }catch{return reply.code(400).send({error:'Message context/reference tidak valid.'});}
    if(!acquire())return reply.code(429).send({error:'Satu analisis sedang berjalan.'});
    try{return await orchestrator.message(request.body);}catch{return reply.code(400).send({error:'Message atau specialist tidak valid.'});}finally{release();}
  });
  app.post('/api/agent/pause',{schema:{body:idSchema}},async request=>({paused:orchestrator.pause(request.body.runId)}));
  app.post('/api/agent/status',{schema:{body:idSchema}},async request=>({research:orchestrator.status(request.body.runId)}));
  app.post('/api/tools/detect',async(request,reply)=>{if(!config.agentic.localToolAccess)return reply.code(403).send({error:'Local tool access disabled.'});return {tools:await detectLocalTools(),device:'localhost backend'};});
  app.post('/api/agent/review-action',{schema:{body:{type:'object',additionalProperties:false,required:['action','context','inventory'],properties:{action:{type:'object',maxProperties:30},context:AGENT_CONTEXT_SCHEMA,inventory:inventorySchema}}}},async(request,reply)=>{
    if(!config.agentic.enabled)return reply.code(503).send({error:'Agentic AI disabled.'});
    const {action,context,inventory}=request.body;
    try{validateAgentContext(context);validateToolInventory(inventory);validateStructuredAgentAction(action);}catch{return reply.code(400).send({error:'Action/context tidak valid.'});}
    const policy=evaluateAgentAction(action,context,inventory,config.agentic);if(policy.permission==='DENIED')return reply.code(403).send({error:policy.reason});
    const revised={...action,...policy,status:'PROPOSED',contextRevision:context.revision,policyReason:policy.reason,approvalToken:''};if(policy.permission==='APPROVAL_REQUIRED')revised.approvalToken=adapters.sign(revised,context);return {action:revised};
  });
  app.post('/api/agent/action',{schema:{body:{type:'object',additionalProperties:false,required:['action','context','inventory','decision'],properties:{action:{type:'object',maxProperties:30},context:AGENT_CONTEXT_SCHEMA,inventory:inventorySchema,decision:{type:'string',enum:['APPROVE_ONCE','APPROVE_PLAN']}}}}},async(request,reply)=>{
    if(!config.agentic.enabled)return reply.code(503).send({error:'Agentic AI disabled.'});
    const {action,context,inventory}=request.body;
    try{validateAgentContext(context);validateToolInventory(inventory);validateStructuredAgentAction(action);}catch{return reply.code(400).send({error:'Action/context tidak valid.'});}
    const policy=evaluateAgentAction(action,context,inventory,config.agentic);
    if(policy.permission==='DENIED')return reply.code(403).send({error:policy.reason});
    if(!acquire())return reply.code(429).send({error:'Satu analisis sedang berjalan.'});
    try{if(policy.permission==='APPROVAL_REQUIRED')adapters.consumeApproval(action,context,action.approvalToken);const result=await adapters.execute(action,context);return {status:'EXECUTED',result,decision:request.body.decision};}
    catch{return reply.code(400).send({error:'Approval expired/changed atau local adapter gagal. Replan dan review ulang.'});}
    finally{release();}
  });
}
