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
  const privacyMode=env.AI_PRIVACY_MODE||'REDACTED_CLOUD';
  let configured=!!model && (provider==='ollama'||!!key) && Object.hasOwn(modelNames,provider);
  const baseURL=env.OLLAMA_BASE_URL||'http://127.0.0.1:11434';
  try {const url=new URL(baseURL);if(!['127.0.0.1','localhost','[::1]'].includes(url.hostname)||url.username||url.password||url.protocol!=='http:')configured=false;}catch{configured=false;}
  if(!['LOCAL_ONLY','REDACTED_CLOUD','CLOUD'].includes(privacyMode)||(privacyMode==='LOCAL_ONLY'&&provider!=='ollama'))configured=false;
  const host=env.SERVER_HOST||'127.0.0.1';if(!['127.0.0.1','localhost','::1'].includes(host))throw new Error('SERVER_HOST harus loopback untuk platform lokal ini.');
  const port=Number(env.SERVER_PORT||3001);if(!Number.isInteger(port)||port<1||port>65535)throw new Error('SERVER_PORT tidak valid.');
  return {enabled,provider,model,key,baseURL,privacyMode,redactSecrets:env.AI_REDACT_SECRETS!=='false',configured,host,port};
}
export function safeConfig(config,status) {
  return {enabled:config.enabled,provider:config.provider,model:config.model,configured:config.enabled&&config.configured,privacyMode:config.privacyMode,redactSecrets:config.redactSecrets,status:status||(!config.enabled?'Disabled':!config.configured?'Misconfigured':'Connected')};
}
