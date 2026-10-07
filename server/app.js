import Fastify from 'fastify';
import fastifyStatic from '@fastify/static';
import {readFile} from 'node:fs/promises';
import {fileURLToPath} from 'node:url';
import {randomBytes,timingSafeEqual} from 'node:crypto';
import {resolveConfig,safeConfig} from './config.js';
import {createProvider} from './ai/provider.js';
import {CyberResearchAdvisor,advisorOperations} from './services/advisor.js';
import {TargetKnowledgeAIService} from './services/target-knowledge.js';
import {KNOWLEDGE_REQUEST_SCHEMA,validateKnowledgeContext} from '../client/js/services/knowledge-schema.js';
import {AgentBudgetLedger} from './services/agent-budget.js';
import {AgentToolAdapters} from './services/agent-tools.js';
import {ResearchOrchestrator} from './services/research-orchestrator.js';
import {registerAgentAPI} from './services/agent-api.js';
// MODULE: Local API and explicit static client root. Project/server/.env are never static resources.
export function localOrigin(origin) {
  try{const url=new URL(origin);return ['http:','https:'].includes(url.protocol)&&['127.0.0.1','localhost','[::1]'].includes(url.hostname)&&url.origin===origin;}catch{return false;}
}
export async function createApp({env={},providerFactory=createProvider,agentLedger}={}) {
  const config=resolveConfig(env);
  const app=Fastify({logger:false,bodyLimit:300000,requestTimeout:70000,ajv:{customOptions:{allowUnionTypes:true,coerceTypes:false,removeAdditional:false}}});
  const provider=config.enabled&&config.configured?providerFactory(config):null; // Disabled startup never initializes a provider.
  const advisor=new CyberResearchAdvisor(provider,config),requestToken=randomBytes(32).toString('hex');
  const targetKnowledge=new TargetKnowledgeAIService(provider,config);
  let providerStatus=!config.enabled?'Disabled':!config.configured?'Misconfigured':'Connected',activeRequest=false;
  const ledger=agentLedger||new AgentBudgetLedger(),adapters=new AgentToolAdapters(requestToken),orchestrator=new ResearchOrchestrator(provider,config,ledger,adapters);
  const clientRoot=fileURLToPath(new URL('../client/',import.meta.url));
  app.addHook('onRequest',async(request,reply)=>{
    reply.header('X-Content-Type-Options','nosniff').header('Referrer-Policy','no-referrer');
    if(!request.url.startsWith('/api/'))return;
    const host=request.headers.host||'';
    if(!/^(?:localhost|127\.0\.0\.1|\[::1\])(?::\d+)?$/.test(host))return reply.code(403).send({error:'Localhost host required.'});
    const origin=request.headers.origin;
    if(origin && !localOrigin(origin))return reply.code(403).send({error:'Localhost origin required.'});
    if(origin)reply.header('Access-Control-Allow-Origin',origin).header('Vary','Origin');
    reply.header('Cache-Control','no-store');
    if(request.method==='OPTIONS')return reply.header('Access-Control-Allow-Methods','GET, POST, OPTIONS').header('Access-Control-Allow-Headers','Content-Type, X-Workspace-Token').code(204).send();
    if(request.method==='POST') {
      const token=request.headers['x-workspace-token'];
      if(typeof token!=='string'||token.length!==requestToken.length||!timingSafeEqual(Buffer.from(token),Buffer.from(requestToken)))return reply.code(403).send({error:'Reconnect backend untuk memperoleh session token.'});
    }
  });
  registerAgentAPI(app,{config,orchestrator,adapters,ledger,providerReady:!!provider,acquire:()=>{if(activeRequest)return false;activeRequest=true;return true;},release:()=>{activeRequest=false;}});
  app.get('/api/config',async()=>({...safeConfig(config,providerStatus),requestToken}));
  let modelsRefreshedAt=0;
  app.post('/api/agent/models',{schema:{body:{type:'object',additionalProperties:false,maxProperties:0}}},async(request,reply)=>{
    if(!config.agentic.enabled||!provider)return reply.code(503).send({error:'Agent provider belum configured.'});
    if(config.modelAllowlist.length)return {provider:config.provider,models:config.models,source:'Configured allowlist'};
    if(modelsRefreshedAt&&Date.now()-modelsRefreshedAt<300000)return {provider:config.provider,models:config.models,source:'Cached provider catalog'};
    if(typeof provider.listModels!=='function')return {provider:config.provider,models:config.models,source:'Configured models'};
    try{const discovered=await provider.listModels();config.models=[...new Set([config.model,...discovered])].filter(id=>typeof id==='string'&&/^[A-Za-z0-9._:/-]{1,180}$/.test(id)).slice(0,200);modelsRefreshedAt=Date.now();return {provider:config.provider,models:config.models,source:'Provider catalog'};}
    catch{return reply.code(502).send({error:'Daftar model tidak dapat dimuat. Model configured tetap tersedia.'});}
  });
  app.get('/api/health',async()=>({storage:'browser IndexedDB',schema:'2.0.0',ai:providerStatus}));
  app.post('/api/advice',{schema:{body:{type:'object',additionalProperties:false,required:['context','privacyMode'],properties:{privacyMode:{type:'string',enum:['LOCAL_ONLY','REDACTED_CLOUD','CLOUD']},context:{type:'object',additionalProperties:false,required:['operation','target','authorization','programRules','scope','research','actors','objects','boundaries','techniques','hypotheses','tests','findings','finding','evidence','knowledge','report'],properties:{operation:{type:'string',enum:advisorOperations},target:{type:'object',additionalProperties:false,required:['program','platform','asset','environment','version'],properties:Object.fromEntries(['program','platform','asset','environment','version'].map(k=>[k,{type:'string',maxLength:4000}]))},authorization:{type:'object',additionalProperties:false,required:['authorized','ownedAccountsOnly','ownedDataOnly'],properties:Object.fromEntries(['authorized','ownedAccountsOnly','ownedDataOnly'].map(k=>[k,{type:'boolean'}]))},programRules:{type:'object',additionalProperties:false,required:['automationAllowed','dosAllowed','thirdPartyTesting'],properties:Object.fromEntries(['automationAllowed','dosAllowed','thirdPartyTesting'].map(k=>[k,{type:'boolean'}]))},scope:{type:'object',additionalProperties:false,required:['inScope','outOfScope','testingRules','automationRules','knownIssues','rateLimits','safeHarbor'],properties:{...Object.fromEntries(['inScope','outOfScope','testingRules','automationRules','knownIssues'].map(k=>[k,{type:'array',maxItems:100,items:{type:'string',maxLength:8000}}])),rateLimits:{type:'string',maxLength:10000},safeHarbor:{type:'string',maxLength:10000}}},research:{type:'object',additionalProperties:false,required:['goal','technique','hypothesis','notes'],properties:Object.fromEntries(['goal','technique','hypothesis','notes'].map(k=>[k,{type:'string',maxLength:30000}]))},...Object.fromEntries(['actors','objects','boundaries','techniques','hypotheses','tests','findings','evidence','knowledge'].map(k=>[k,{type:'array',maxItems:250,items:{type:'object',maxProperties:25,additionalProperties:{type:['string','number','boolean']}}}])),finding:{anyOf:[{type:'null'},{type:'object',maxProperties:30,additionalProperties:{type:'string',maxLength:30000}}]},report:{type:'string',maxLength:60000}}}}}}},async(request,reply)=>{
    if(!config.enabled)return reply.code(503).send({status:'Disabled',error:'AI disabled. Core manual tetap tersedia.'});
    if(!provider)return reply.code(503).send({status:'Misconfigured',error:'Konfigurasi provider/model belum lengkap.'});
    if(request.body.privacyMode==='LOCAL_ONLY'&&config.provider!=='ollama')return reply.code(400).send({error:'LOCAL_ONLY hanya untuk Ollama localhost.'});
    if(config.privacyMode==='LOCAL_ONLY'&&request.body.privacyMode!=='LOCAL_ONLY')return reply.code(400).send({error:'Backend dikonfigurasi LOCAL_ONLY.'});
    if(activeRequest)return reply.code(429).send({error:'Satu analisis sedang berjalan. Tunggu hingga selesai.'});
    activeRequest=true;
    try {const output=await advisor.analyze(request.body.context,request.body.privacyMode);providerStatus='Connected';return {status:'Connected',response:output};}
    catch {providerStatus='Provider Error';return reply.code(502).send({status:'Provider Error',error:'Provider gagal atau output tidak valid. Workspace manual tidak diubah.'});}
    finally{activeRequest=false;}
  });
  app.post('/api/knowledge',{schema:{body:KNOWLEDGE_REQUEST_SCHEMA}},async(request,reply)=>{
    if(!config.enabled)return reply.code(503).send({status:'Disabled',error:'AI disabled. Domain knowledge manual tetap tersedia.'});
    if(!provider)return reply.code(503).send({status:'Misconfigured',error:'Konfigurasi provider/model belum lengkap.'});
    try{validateKnowledgeContext(request.body.context);}catch{return reply.code(400).send({error:'Knowledge context tidak valid.'});}
    if(request.body.privacyMode==='LOCAL_ONLY'&&config.provider!=='ollama')return reply.code(400).send({error:'LOCAL_ONLY hanya untuk Ollama localhost.'});
    if(config.privacyMode==='LOCAL_ONLY'&&request.body.privacyMode!=='LOCAL_ONLY')return reply.code(400).send({error:'Backend dikonfigurasi LOCAL_ONLY.'});
    if(activeRequest)return reply.code(429).send({error:'Satu analisis sedang berjalan.'});
    activeRequest=true;
    try{const output=await targetKnowledge.analyze(request.body.context,request.body.privacyMode);providerStatus='Connected';return {status:'Connected',response:output};}
    catch{providerStatus='Provider Error';return reply.code(502).send({status:'Provider Error',error:'Knowledge provider gagal atau output tidak valid. Core manual tidak diubah.'});}
    finally{activeRequest=false;}
  });
  // SECURITY: Fastify errors never return validation payloads, raw upstream bodies, stack traces or config.
  app.setErrorHandler((error,request,reply)=>reply.code(error.statusCode||500).send({error:error.statusCode===413?'Request terlalu besar.':'Request tidak valid atau layanan gagal.'}));
  async function shell(request,reply) {const html=await readFile(clientRoot+'index.html','utf8');return reply.type('text/html').send(html.replace('name="workspace-backend" content=""','name="workspace-backend" content="same-origin"'));}
  app.get('/',shell);app.get('/index.html',shell);
  await app.register(fastifyStatic,{root:clientRoot,prefix:'/',index:false,dotfiles:'deny'});
  app.get('/universal_bug_bounty_playbook.html',async(request,reply)=>reply.type('text/html').send(await readFile(fileURLToPath(new URL('../universal_bug_bounty_playbook.html',import.meta.url)),'utf8')));
  app.get('/style.css',async(request,reply)=>reply.type('text/css').send(await readFile(fileURLToPath(new URL('../style.css',import.meta.url)),'utf8')));
  app.decorate('safeAIConfig',()=>safeConfig(config,providerStatus));
  return app;
}
