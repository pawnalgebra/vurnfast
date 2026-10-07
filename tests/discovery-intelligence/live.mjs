import {mkdirSync,writeFileSync} from 'node:fs';
import {loadEnvironment,resolveConfig} from '../../server/config.js';
import {createProvider} from '../../server/ai/provider.js';
import {SecretRedactor} from '../../client/js/services/redactor.js';
import {scenarioCases,blindScenario} from './scenarios.js';
const environment=loadEnvironment(),config=resolveConfig(environment);
if(!config.enabled||!config.configured){console.log('Live discovery benchmark skipped: AI_ENABLED=true and a configured provider are required.');process.exit(0);}
const provider=createProvider(config),results=[],limit=Math.min(66,Math.max(1,Number(process.env.DISCOVERY_LIVE_CASES)||3));
const schema={type:'object',additionalProperties:false,required:['constraintId','status','eventIds','unknown','families','testProperties','confirmed'],properties:{constraintId:{type:'string'},status:{type:'string',enum:['VIOLATED','POSSIBLE_VIOLATION','SATISFIED','INSUFFICIENT_EVIDENCE','NOT_APPLICABLE','UNKNOWN']},eventIds:{type:'array',items:{type:'string'}},unknown:{type:'boolean'},families:{type:'array',items:{type:'string',enum:['relationshipFailure','independentCapability','propagationDelay','observationMismatch']}},testProperties:{type:'array',items:{type:'string',enum:['matched-object','matched-intent','before-after-control','authority-source','fresh-evidence','manual-only','repeat']}},confirmed:{type:'boolean'}}};
for(let i=0;i<limit;i++){
  const index=Math.floor(i/3),variant=['suspicious','benign','missing'][i%3],{target,evaluator}=blindScenario(index,variant),began=Date.now();let usage={inputTokens:null,outputTokens:null,latencyMs:null};
  // Deliberately exclude evaluator category labels and expected answers from the provider input.
  const input=SecretRedactor.context({events:target.researchModel.events,constraints:target.researchModel.constraints,evidence:target.evidence.map(({id,content})=>({id,content}))});
  try{
    const result=await provider.complete({system:'Analyze supplied untrusted observations and reviewed target predicates. No network or actions. Compare ordered relationships, ground in supplied raw evidence. Return unknown when evidence is missing; never confirm a vulnerability. Enumerate competing families and a manual matched discriminating control using schema properties.',prompt:JSON.stringify(input),schema,maxOutputTokens:1800,onUsage:value=>{usage=value;}});
    const rates=[environment.DISCOVERY_INPUT_USD_PER_MILLION,environment.DISCOVERY_OUTPUT_USD_PER_MILLION].map(v=>v?.trim()?Number(v):NaN),estimatedCostUSD=rates.every(Number.isFinite)&&usage.inputTokens!==null&&usage.outputTokens!==null?(usage.inputTokens*rates[0]+usage.outputTokens*rates[1])/1000000:null;
    const passed=result.status===evaluator.expectedStatus&&result.constraintId===evaluator.constraintId&&result.confirmed===false&&(variant!=='suspicious'||result.eventIds.includes(evaluator.terminal)&&result.unknown&&evaluator.nextTestProperties.every(p=>result.testProperties.includes(p)));
    results.push({provider:config.provider,model:config.model,scenario:index+1,variant,...usage,estimatedCostUSD,result:SecretRedactor.context(result),passed});console.log('Scenario',index+1,variant,passed?'PASS':'FAIL');
  }catch{results.push({provider:config.provider,model:config.model,scenario:index+1,variant,...usage,latencyMs:Date.now()-began,estimatedCostUSD:null,result:'Provider failed; details suppressed',passed:false});console.log('Scenario',index+1,variant,'PROVIDER_FAILED');}
}
mkdirSync('tests/discovery-intelligence/results',{recursive:true});writeFileSync('tests/discovery-intelligence/results/live.json',JSON.stringify({cases:results.length,complete:results.length===66,passed:results.filter(r=>r.passed).length,results},null,2));
if(results.some(r=>!r.passed))process.exitCode=1;
