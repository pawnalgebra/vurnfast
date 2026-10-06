import test from 'node:test';
import assert from 'node:assert/strict';
import {createApp,localOrigin} from '../server/app.js';
import {resolveConfig,safeConfig} from '../server/config.js';
import {AiProvider,createProvider} from '../server/ai/provider.js';
import {AI_RESPONSE_SCHEMA} from '../client/js/services/ai-schema.js';
import {emptyAdvice,authorizedTarget} from './fixtures.js';
const configured={AI_ENABLED:'true',AI_PROVIDER:'openai',OPENAI_MODEL:'test-model',OPENAI_API_KEY:'SERVER_ONLY_PRIVATE_KEY'};
async function postAdvice(app,payload) {const token=(await app.inject('/api/config')).json().requestToken;return app.inject({method:'POST',url:'/api/advice',headers:{origin:'http://127.0.0.1:3001','x-workspace-token':token},payload});}
test('AI disabled startup does not create provider; complete core static shell still served',async()=>{
  let called=0;const app=await createApp({env:{AI_ENABLED:'false'},providerFactory(){called++;throw new Error('must never initialize');}});
  try {assert.equal(called,0);const config=(await app.inject('/api/config')).json();assert.equal(config.status,'Disabled');assert.equal(config.enabled,false);
    assert.equal((await app.inject('/')).statusCode,200);assert.ok((await app.inject('/')).body.includes('content="same-origin"'));
    const response=await postAdvice(app,{context:authorizedTarget().context,privacyMode:'REDACTED_CLOUD'});assert.equal(response.statusCode,503);assert.equal(response.json().status,'Disabled');
  }finally{await app.close();}
});
test('AI enabled requires config, safely reports status, never exposes key or private files',async()=>{
  const missing=await createApp({env:{AI_ENABLED:'true',AI_PROVIDER:'openai'},providerFactory(){throw new Error('not configured');}});assert.equal(missing.safeAIConfig().status,'Misconfigured');await missing.close();
  const app=await createApp({env:configured,providerFactory:()=>({complete:async()=>emptyAdvice()})});
  try {const config=(await app.inject('/api/config')).body;assert.ok(!config.includes(configured.OPENAI_API_KEY));assert.ok(!config.includes('API_KEY'));assert.equal(JSON.parse(config).status,'Connected');
    for(const path of ['/.env','/server/config.js','/node_modules/fastify/package.json'])assert.ok([403,404].includes((await app.inject(path)).statusCode),path);
    const result=await postAdvice(app,{context:authorizedTarget().context,privacyMode:'REDACTED_CLOUD'});assert.equal(result.statusCode,200,result.body);assert.ok(!result.body.includes(configured.OPENAI_API_KEY));
  }finally{await app.close();}
});
test('provider failures and invalid output are contained, no secrets in API error',async()=>{
  for(const provider of [{complete:async()=>{throw new Error('upstream echoes SERVER_ONLY_PRIVATE_KEY');}},{complete:async()=>({invalid:true})}]){
    const app=await createApp({env:configured,providerFactory:()=>provider});try{const result=await postAdvice(app,{context:authorizedTarget().context,privacyMode:'REDACTED_CLOUD'});assert.equal(result.statusCode,502);assert.ok(!result.body.includes('SERVER_ONLY_PRIVATE_KEY'));assert.equal(app.safeAIConfig().status,'Provider Error');assert.equal((await app.inject('/')).statusCode,200);}finally{await app.close();}
  }
});
test('local CORS, anti-CSRF token, host, privacy and request limits',async()=>{
  const app=await createApp({env:configured,providerFactory:()=>({complete:async()=>emptyAdvice()})});
  try {
    assert.equal(localOrigin('https://evil.test'),false);assert.equal(localOrigin('null'),false);assert.equal(localOrigin('http://localhost:8000'),true);
    assert.equal((await app.inject({url:'/api/config',headers:{origin:'https://evil.test'}})).statusCode,403);
    assert.equal((await app.inject({url:'/api/config',headers:{host:'evil.test'}})).statusCode,403);
    const cors=await app.inject({method:'OPTIONS',url:'/api/advice',headers:{origin:'http://localhost:8000'}});assert.equal(cors.statusCode,204);assert.equal(cors.headers['access-control-allow-origin'],'http://localhost:8000');
    assert.equal((await app.inject({method:'POST',url:'/api/advice',payload:{}})).statusCode,403);
    assert.equal((await postAdvice(app,{context:authorizedTarget().context,privacyMode:'LOCAL_ONLY'})).statusCode,400);
    assert.equal((await postAdvice(app,{context:{},privacyMode:'CLOUD'})).statusCode,400);
    const token=(await app.inject('/api/config')).json().requestToken;const large=await app.inject({method:'POST',url:'/api/advice',headers:{'content-type':'application/json','x-workspace-token':token},payload:JSON.stringify({notes:'x'.repeat(310000)})});assert.equal(large.statusCode,413);
  }finally{await app.close();}
  assert.throws(()=>resolveConfig({SERVER_HOST:'0.0.0.0'}));assert.equal(resolveConfig({...configured,AI_PRIVACY_MODE:'LOCAL_ONLY'}).configured,false);
});
test('all four real adapter request/response contracts using mocked transport',async()=>{
  for(const provider of ['openai','anthropic','gemini','ollama']) {
    const output=emptyAdvice(),config={provider,model:'model-fixture',key:'BACKEND_ONLY',baseURL:'http://127.0.0.1:11434'};let sent;
    const adapter=new AiProvider(config,async(url,request)=>{sent={url,...request};const body=provider==='openai'?{output:[{content:[{type:'output_text',text:JSON.stringify(output)}]}]}:provider==='anthropic'?{content:[{type:'text',text:JSON.stringify(output)}]}:provider==='gemini'?{candidates:[{content:{parts:[{text:JSON.stringify(output)}]}}]}:{message:{content:JSON.stringify(output)}};return new Response(JSON.stringify(body));});
    assert.deepEqual(await adapter.complete({system:'Manual research only',prompt:'{}',schema:AI_RESPONSE_SCHEMA}),output);
    assert.equal(sent.method,'POST');assert.equal(sent.redirect,'error');assert.ok(!sent.url.includes('BACKEND_ONLY'));assert.ok(!sent.body.includes('BACKEND_ONLY'));assert.ok(!sent.body.includes('tools'));
    if(provider==='openai')assert.equal(JSON.parse(sent.body).store,false);
  }
  assert.equal(createProvider({enabled:false,configured:true}),null);
});
