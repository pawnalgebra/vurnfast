// MODULE: AiProvider.complete(request), four adapters, no target interaction or tool execution.
// SECURITY: Keys are used in provider headers only; upstream bodies/errors are never logged/returned.
export class AiProvider {
  constructor(config,fetchImpl=globalThis.fetch){this.config=config;this.fetch=fetchImpl;}
  async complete({system,prompt,schema}) {
    const {provider,model,key,baseURL}=this.config;
    let url,headers={'Content-Type':'application/json'},body;
    if(provider==='openai') {
      url='https://api.openai.com/v1/responses';headers.Authorization='Bearer '+key;
      body={model,store:false,instructions:system,input:prompt,max_output_tokens:6000,text:{format:{type:'json_schema',name:'research_advice',strict:true,schema}}};
    }else if(provider==='anthropic') {
      url='https://api.anthropic.com/v1/messages';headers['x-api-key']=key;headers['anthropic-version']='2023-06-01';
      body={model,max_tokens:6000,system,messages:[{role:'user',content:prompt}],output_config:{format:{type:'json_schema',schema}}};
    }else if(provider==='gemini') {
      url='https://generativelanguage.googleapis.com/v1beta/models/'+encodeURIComponent(model)+':generateContent';headers['x-goog-api-key']=key;
      body={systemInstruction:{parts:[{text:system}]},contents:[{role:'user',parts:[{text:prompt}]}],generationConfig:{responseMimeType:'application/json',responseJsonSchema:schema,maxOutputTokens:6000}};
    }else if(provider==='ollama') {
      url=baseURL.replace(/\/$/,'')+'/api/chat';body={model,stream:false,format:schema,messages:[{role:'system',content:system},{role:'user',content:prompt}]};
    }else throw new Error('Provider tidak didukung.');
    const response=await this.fetch(url,{method:'POST',headers,body:JSON.stringify(body),signal:AbortSignal.timeout(60000),redirect:'error'});
    if(!response.ok)throw new Error('Provider Error');
    // PURPOSE: Bound provider responses before parsing, including an untrusted local provider.
    const reader=response.body.getReader();let bytes=0;const parts=[];
    try {for(;;){const {done,value}=await reader.read();if(done)break;bytes+=value.byteLength;if(bytes>500000){await reader.cancel();throw new Error('Provider Error');}parts.push(value);}}finally{reader.releaseLock();}
    const json=JSON.parse(Buffer.concat(parts).toString('utf8'));
    const text=provider==='openai'?(json.output||[]).flatMap(item=>item.content||[]).filter(item=>item.type==='output_text').map(item=>item.text).join(''):provider==='anthropic'?(json.content||[]).filter(item=>item.type==='text').map(item=>item.text).join(''):provider==='gemini'?(json.candidates?.[0]?.content?.parts||[]).map(item=>item.text||'').join(''):json.message?.content;
    if(typeof text!=='string'||!text.trim())throw new Error('Provider Error');
    return JSON.parse(text);
  }
}
export function createProvider(config,fetchImpl) {
  if(!config.enabled||!config.configured)return null;
  return new AiProvider(config,fetchImpl);
}
