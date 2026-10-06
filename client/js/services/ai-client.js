import {validateAIOutput} from './ai-schema.js';
import {validateKnowledgeResponse} from './knowledge-schema.js';
// MODULE: Optional localhost bridge. Config and request token remain session-memory only.
export const aiConnection={baseURL:'',token:'',status:'Disabled',enabled:false,configured:false,provider:'',model:'',privacyMode:'REDACTED_CLOUD',redactSecrets:true};
export async function connectBackend(url) {
  const parsed=new URL(url);
  if(!['http:','https:'].includes(parsed.protocol)||!['127.0.0.1','localhost','[::1]'].includes(parsed.hostname)||parsed.username||parsed.password||parsed.pathname!=='/'||parsed.search||parsed.hash)throw new Error('Backend harus berupa origin localhost.');
  const response=await fetch(parsed.origin+'/api/config',{signal:AbortSignal.timeout(5000),credentials:'omit'});
  if(!response.ok)throw new Error('Backend localhost tidak dapat dihubungkan.');
  const config=await response.json();
  if(typeof config.enabled!=='boolean'||typeof config.configured!=='boolean'||typeof config.requestToken!=='string')throw new Error('Safe config backend tidak valid.');
  Object.assign(aiConnection,{baseURL:parsed.origin,token:config.requestToken,status:config.status,enabled:config.enabled,configured:config.configured,provider:config.provider,model:config.model,privacyMode:config.privacyMode,redactSecrets:config.redactSecrets});
  return aiConnection;
}
export async function requestAdvice(context,privacyMode) {
  if(!aiConnection.enabled||!aiConnection.configured)throw new Error('AI disabled atau misconfigured.');
  try {
    const response=await fetch(aiConnection.baseURL+'/api/advice',{method:'POST',headers:{'Content-Type':'application/json','X-Workspace-Token':aiConnection.token},body:JSON.stringify({context,privacyMode}),signal:AbortSignal.timeout(65000),credentials:'omit'});
    const data=await response.json();if(!response.ok){aiConnection.status=data.status||'Provider Error';throw new Error(data.error||'Provider Error');}
    aiConnection.status='Connected';return validateAIOutput(data.response);
  }catch(error){if(!['Disabled','Misconfigured'].includes(aiConnection.status))aiConnection.status='Provider Error';throw error;}
}
export async function requestKnowledge(context,privacyMode){
  if(!aiConnection.enabled||!aiConnection.configured)throw new Error('AI disabled atau misconfigured.');
  try{const response=await fetch(aiConnection.baseURL+'/api/knowledge',{method:'POST',headers:{'Content-Type':'application/json','X-Workspace-Token':aiConnection.token},body:JSON.stringify({context,privacyMode}),signal:AbortSignal.timeout(65000),credentials:'omit'});const data=await response.json();if(!response.ok){aiConnection.status=data.status||'Provider Error';throw new Error(data.error||'Provider Error');}aiConnection.status='Connected';return validateKnowledgeResponse(data.response);}catch(error){if(!['Disabled','Misconfigured'].includes(aiConnection.status))aiConnection.status='Provider Error';throw error;}
}
