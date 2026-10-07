import {readFileSync} from 'node:fs';
import {resolve} from 'node:path';
// MODULE: Server-only config. Never return this object or log env values.
export function loadEnvironment(path=resolve('.env'),base=process.env) {
  const env={};try {for(const line of readFileSync(path,'utf8').split(/\r?\n/)){const match=/^\s*([A-Z_]+)\s*=\s*(.*)\s*$/.exec(line);if(match){let value=match[2].trim();if((value.startsWith('"')&&value.endsWith('"'))||(value.startsWith("'")&&value.endsWith("'")))value=value.slice(1,-1);env[match[1]]=value;}}}catch(error){if(error.code!=='ENOENT')throw new Error('Tidak dapat membaca .env.');}
  return {...env,...base};
}
export function resolveConfig(env={}) {
  const provider=String(env.AI_PROVIDER||'openai').toLowerCase(),enabled=env.AI_ENABLED==='true';
  const keyNames={openai:'OPENAI_API_KEY',anthropic:'ANTHROPIC_API_KEY',gemini:'GEMINI_API_KEY'};
  const modelNames={openai:'OPENAI_MODEL',anthropic:'ANTHROPIC_MODEL',gemini:'GEMINI_MODEL',ollama:'OLLAMA_MODEL'};
  const model=env[modelNames[provider]]||'',key=env[keyNames[provider]]||'';
  const modelAllowlist=[...new Set(String(env.AI_ALLOWED_MODELS||'').split(',').map(id=>id.trim()).filter(id=>/^[A-Za-z0-9._:/-]{1,180}$/.test(id)))].slice(0,100);
  const modelTiers={CHEAP:env.AI_CHEAP_MODEL||model,REASONING:env.AI_REASONING_MODEL||model};
  const models=[...new Set([model,...Object.values(modelTiers),...modelAllowlist].filter(Boolean))];
  const privacyMode=env.AI_PRIVACY_MODE||'REDACTED_CLOUD';
  let configured=!!model && (provider==='ollama'||!!key) && Object.hasOwn(modelNames,provider);
  const baseURL=env.OLLAMA_BASE_URL||'http://127.0.0.1:11434';
  try {const url=new URL(baseURL);if(!['127.0.0.1','localhost','[::1]'].includes(url.hostname)||url.username||url.password||url.protocol!=='http:')configured=false;}catch{configured=false;}
  if(!['LOCAL_ONLY','REDACTED_CLOUD','CLOUD'].includes(privacyMode)||(privacyMode==='LOCAL_ONLY'&&provider!=='ollama'))configured=false;
  const host=env.SERVER_HOST||'127.0.0.1';if(!['127.0.0.1','localhost','::1'].includes(host))throw new Error('SERVER_HOST harus loopback untuk platform lokal ini.');
  const port=Number(env.SERVER_PORT||3001);if(!Number.isInteger(port)||port<1||port>65535)throw new Error('SERVER_PORT tidak valid.');
  const bounded=(value,fallback,min,max)=>{const number=Number(value);return value!==undefined&&Number.isFinite(number)&&number>=min&&number<=max?number:fallback;};
  const agentic={enabled:enabled&&env.AGENTIC_AI_ENABLED==='true',executionMode:'Supervised',humanApproval:true,
    maxSteps:Math.floor(bounded(env.AGENT_MAX_STEPS,8,1,32)),runBudgetUSD:bounded(env.AGENT_RUN_BUDGET_USD,.25,0,100),dailyBudgetUSD:bounded(env.AGENT_DAILY_BUDGET_USD,2,0,1000),callBudgetUSD:bounded(env.AGENT_CALL_BUDGET_USD,.03,.000001,100),
    localToolAccess:env.AGENT_ALLOW_LOCAL_TOOLS!=='false',allowTargetRequests:env.AGENT_ALLOW_TARGET_REQUESTS==='true',externalAdaptersAvailable:false,costAccounting:'Conservative configured estimate; actual provider billing unknown'};
  return {enabled,provider,model,models,modelTiers,modelAllowlist,key,baseURL,privacyMode,redactSecrets:env.AI_REDACT_SECRETS!=='false',configured,host,port,agentic};
}
export function safeConfig(config,status) {
  return {enabled:config.enabled,provider:config.provider,model:config.model,models:config.models,configured:config.enabled&&config.configured,privacyMode:config.privacyMode,redactSecrets:config.redactSecrets,status:status||(!config.enabled?'Disabled':!config.configured?'Misconfigured':'Connected'),agentic:{...config.agentic,configured:config.agentic.enabled&&config.configured}};
}
