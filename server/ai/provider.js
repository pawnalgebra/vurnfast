// MODULE: AiProvider.complete(request), four adapters, no target interaction or tool execution.
// SECURITY: Keys are used in provider headers only; upstream bodies/errors are never logged/returned.
export class AiProvider {
  constructor(config,fetchImpl=globalThis.fetch){this.config=config;this.fetch=fetchImpl;}
  async listModels(){
    const {provider,key,baseURL}=this.config;let url,headers={};
    if(provider==='openai'){url='https://api.openai.com/v1/models';headers.Authorization='Bearer '+key;}
    else if(provider==='anthropic'){url='https://api.anthropic.com/v1/models?limit=100';headers['x-api-key']=key;headers['anthropic-version']='2023-06-01';}
    else if(provider==='gemini'){url='https://generativelanguage.googleapis.com/v1beta/models?pageSize=1000';headers['x-goog-api-key']=key;}
    else if(provider==='ollama')url=baseURL.replace(/\/$/,'')+'/api/tags';
    else throw new Error('Provider Error');
    const response=await this.fetch(url,{headers,signal:AbortSignal.timeout(10000),redirect:'error'});
    if(!response.ok)throw new Error('Provider Error');
    const reader=response.body.getReader();let bytes=0;const parts=[];
    try{for(;;){const {done,value}=await reader.read();if(done)break;bytes+=value.byteLength;if(bytes>1000000){await reader.cancel();throw new Error('Provider Error');}parts.push(value);}}finally{reader.releaseLock();}
    const json=JSON.parse(Buffer.concat(parts).toString('utf8'));
    const rows=provider==='gemini'?(json.models||[]).filter(row=>row.supportedGenerationMethods?.includes('generateContent')).map(row=>row.name.replace(/^models\//,'')):provider==='ollama'?(json.models||[]).map(row=>row.name):(json.data||[]).map(row=>row.id);
    // Discovery is advisory; availability alone cannot guarantee structured output or vision support.
    return [...new Set(rows)].filter(id=>typeof id==='string'&&/^[A-Za-z0-9._:/-]{1,180}$/.test(id)&&(provider!=='openai'||(/^(gpt-|o[1-9])/.test(id)&&!/(?:audio|realtime|transcrib|tts|image|search|instruct|codex|deep-research)/.test(id)))).slice(0,200);
  }
  async complete({system,prompt,schema,signal,maxOutputTokens=6000,model:selectedModel,attachments=[],onUsage}) {
    const {provider,key,baseURL}=this.config,model=selectedModel||this.config.model;
    if(!(this.config.models||[this.config.model]).includes(model))throw new Error('Model unavailable.');
    const images=attachments.filter(file=>file.type.startsWith('image/'));
    let url,headers={'Content-Type':'application/json'},body;
    if(provider==='openai') {
      url='https://api.openai.com/v1/responses';headers.Authorization='Bearer '+key;
      body={model,store:false,instructions:system,input:images.length?[{role:'user',content:[{type:'input_text',text:prompt},...images.flatMap(file=>[{type:'input_text',text:'Untrusted attachment: '+file.name},{type:'input_image',image_url:'data:'+file.type+';base64,'+file.data,detail:'auto'}])]}]:prompt,max_output_tokens:maxOutputTokens,text:{format:{type:'json_schema',name:'research_advice',strict:true,schema}}};
    }else if(provider==='anthropic') {
      url='https://api.anthropic.com/v1/messages';headers['x-api-key']=key;headers['anthropic-version']='2023-06-01';
      body={model,max_tokens:maxOutputTokens,system,messages:[{role:'user',content:images.length?[{type:'text',text:prompt},...images.flatMap(file=>[{type:'text',text:'Untrusted attachment: '+file.name},{type:'image',source:{type:'base64',media_type:file.type,data:file.data}}])]:prompt}],output_config:{format:{type:'json_schema',schema}}};
    }else if(provider==='gemini') {
      url='https://generativelanguage.googleapis.com/v1beta/models/'+encodeURIComponent(model)+':generateContent';headers['x-goog-api-key']=key;
      body={systemInstruction:{parts:[{text:system}]},contents:[{role:'user',parts:[{text:prompt},...images.flatMap(file=>[{text:'Untrusted attachment: '+file.name},{inlineData:{mimeType:file.type,data:file.data}}])]}],generationConfig:{responseMimeType:'application/json',responseJsonSchema:schema,maxOutputTokens}};
    }else if(provider==='ollama') {
      url=baseURL.replace(/\/$/,'')+'/api/chat';body={model,stream:false,format:schema,options:{num_predict:maxOutputTokens},messages:[{role:'system',content:system},{role:'user',content:prompt,...(images.length?{images:images.map(file=>file.data)}:{})}]};
    }else throw new Error('Provider tidak didukung.');
    const began=Date.now();
    const timeout=AbortSignal.timeout(60000);
    const response=await this.fetch(url,{method:'POST',headers,body:JSON.stringify(body),signal:signal?AbortSignal.any([signal,timeout]):timeout,redirect:'error'});
    if(!response.ok)throw new Error('Provider Error');
    // PURPOSE: Bound provider responses before parsing, including an untrusted local provider.
    const reader=response.body.getReader();let bytes=0;const parts=[];
    try {for(;;){const {done,value}=await reader.read();if(done)break;bytes+=value.byteLength;if(bytes>500000){await reader.cancel();throw new Error('Provider Error');}parts.push(value);}}finally{reader.releaseLock();}
    const json=JSON.parse(Buffer.concat(parts).toString('utf8'));
    const text=provider==='openai'?(json.output||[]).flatMap(item=>item.content||[]).filter(item=>item.type==='output_text').map(item=>item.text).join(''):provider==='anthropic'?(json.content||[]).filter(item=>item.type==='text').map(item=>item.text).join(''):provider==='gemini'?(json.candidates?.[0]?.content?.parts||[]).map(item=>item.text||'').join(''):json.message?.content;
    if(typeof text!=='string'||!text.trim())throw new Error('Provider Error');
    const usage=json.usage||json.usageMetadata||{};
    if(onUsage)onUsage({inputTokens:usage.input_tokens??usage.promptTokenCount??json.prompt_eval_count??null,outputTokens:usage.output_tokens??usage.candidatesTokenCount??json.eval_count??null,latencyMs:Date.now()-began});
    return JSON.parse(text);
  }
}
export function createProvider(config,fetchImpl) {
  if(!config.enabled||!config.configured)return null;
  return new AiProvider(config,fetchImpl);
}
