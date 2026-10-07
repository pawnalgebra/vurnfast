import {randomUUID,createHash} from 'node:crypto';
import {agentStages,emptyAgentContent,validateAgentResearch,validateToolInventory,agentSafeTree} from '../../client/js/services/agent-schema.js';
import {validateKnowledgeContext} from '../../client/js/services/knowledge-schema.js';
import {SecretRedactor} from '../../client/js/services/redactor.js';
import {createSpecialists} from '../agents/specialists.js';
import {agentScopePolicy,evaluateAgentAction} from './agent-tools.js';
import {validateEnvironmentMetadata} from '../../client/js/services/environment.js';
import {planMessageAgents} from '../../client/js/services/agent-messages.js';
import {validateMessageAttachments} from '../../client/js/services/message-attachments.js';
import {validateResearchModel} from '../../client/js/services/research-model.js';
import {analyzeAdvancedResearch,compactAdvancedContext} from '../../client/js/services/advanced-research.js';
import {findingEvidenceGraph} from '../../client/js/services/research-grounding.js';
import {ResearchPriorityService} from '../../client/js/services/research-priority.js';
const iso=()=>new Date().toISOString();
const digest=value=>createHash('sha256').update(JSON.stringify(value)).digest('hex');
function contextResearchTarget(context){return {id:context.targetId,name:'Selected research',asset:context.knowledge.target.asset,scope:{inScope:context.knowledge.scope.inScope.join('\n'),outOfScope:context.knowledge.scope.outOfScope.join('\n'),guard:{inScope:context.knowledge.authorization.authorized,account:context.knowledge.authorization.ownedAccountsOnly,data:context.knowledge.authorization.ownedDataOnly}},programRules:context.knowledge.programRules,actors:context.knowledge.actors,objects:context.knowledge.objects,boundaries:context.knowledge.boundaries,hypotheses:context.hypotheses,testCases:context.tests,evidence:context.evidence,findings:context.findings,techniques:context.knowledge.techniques,researchEnvironment:context.environment?{profiles:context.environment.profiles}:undefined,researchModel:context.researchModel,researchRevision:context.revision};}
function prepareAdvancedContext(input){const {advancedResearch:untrustedAnalysis,...context}=input;if(context.researchModel){context.advancedResearch=analyzeAdvancedResearch(contextResearchTarget(context));context.advancedResearch=compactAdvancedContext(context.advancedResearch);if(context.contextManifest?.omittedCriticalDependencies?.length){context.advancedResearch.conclusionLimit='Critical dependencies omitted: no high-confidence conclusion';for(const r of context.advancedResearch.discovery.relationships)r.confidence=Math.min(.35,r.confidence);}}return {...context,hypotheses:ResearchPriorityService.rank(context.hypotheses,{scopeConfidence:agentScopePolicy(context).canRecommend?100:0})};}
export function validateAgentContext(context){
  agentSafeTree(context);if(!context||typeof context.targetId!=='string'||!context.targetId||!Number.isInteger(context.revision)||context.revision<0)throw new Error('Agent context tidak valid.');
  validateKnowledgeContext(context.knowledge);
  if(context.environment!==undefined)validateEnvironmentMetadata(context.environment);
  for(const key of ['inScope','outOfScope','testingRules','automationRules'])if(!Array.isArray(context.knowledge.scope?.[key])||context.knowledge.scope[key].some(v=>typeof v!=='string'))throw new Error('Agent scope list tidak valid.');
  for(const name of ['hypotheses','tests','evidence','findings','lessons','manualAnalysis'])if(!Array.isArray(context[name])||context[name].length>30||context[name].some(r=>!r||typeof r.id!=='string'||!r.id))throw new Error('Agent context collection tidak valid.');
  if(!Array.isArray(context.sensitiveEvidenceIds)||context.sensitiveEvidenceIds.some(id=>typeof id!=='string'||!context.evidence.some(e=>e.id===id)))throw new Error('Sensitive evidence context tidak valid.');
  if(context.researchModel)validateResearchModel(context.researchModel,contextResearchTarget(context));
  return context;
}
function proposalRecord(proposal,agentId,revision){return {...proposal,id:randomUUID(),status:'PROPOSED',sourceType:'ai',source:'AI GENERATED · '+agentStages.find(s=>s[0]===agentId)?.[1],verified:false,agentId,contextRevision:revision,createdAt:iso(),recommendedDecision:'Review content and evidence before accepting.',decision:'',canonicalId:'',stale:false,falsePositiveAnalysis:'',duplicateRisk:'',analysisCompleted:false};}
function systemReview(kind,title,reason,revision,content={}){return {...proposalRecord({kind,title,analysis:reason,reason,confidence:0,notes:'Local policy check; bukan fakta atau keputusan vulnerability.',relatedTechniqueId:'',relatedToolId:'',relatedHypothesisId:'',relatedTestId:'',relatedFindingId:'',evidenceIds:[],content:{...emptyAgentContent(),...content}},'scope',revision),sourceType:'system',source:'Local policy',agentId:'policy'};}
function constrainProposals(output,context,agentId,inventory){
  const techniqueIds=new Set(context.knowledge.techniques.flatMap(t=>[t.id,t.libraryId]).filter(Boolean));
  const evidenceIds=new Set(context.evidence.map(e=>e.id));
  const rows=output.proposals.map(p=>structuredClone(p));
  for(const p of rows){
    if(p.relatedTechniqueId&&!techniqueIds.has(p.relatedTechniqueId))p.relatedTechniqueId='';
    for(const [field,collection] of [['relatedHypothesisId','hypotheses'],['relatedTestId','tests'],['relatedFindingId','findings']])if(p[field]&&!context[collection].some(r=>r.id===p[field]))p[field]='';
    p.evidenceIds=p.evidenceIds.filter(id=>evidenceIds.has(id));
    if(p.kind==='tool-recommendation'){const tool=inventory.find(t=>t.id===p.relatedToolId);if(!tool?.installed||tool.agentAccess==='DENIED'||!tool.capabilities.includes(p.content.type)){p.kind='uncertain-analysis';p.title='Tool unavailable: '+p.title;p.reason='Tidak ada installed/allowed inventory tool dengan required capability yang diberikan.';p.relatedToolId='';}else{p.content.name=tool.name;p.notes+=' Recommendation is manual; external tool execution unavailable.';}}
    if(p.kind==='potential-finding'){
      const test=context.tests.find(t=>t.id===p.relatedTestId);
      const grounding=findingEvidenceGraph(p,context),observed=grounding.evidence.map(e=>e.id);
      const primaryObserved=observed.some(id=>(test?.evidenceIds||[]).includes(id)||context.evidence.some(e=>e.id===id&&e.testCaseId===test?.id));
      if(!test?.actualResult?.trim()||!primaryObserved||!['failed','interesting','vulnerability'].includes(test.result)){
        p.kind='uncertain-analysis';p.title='Evidence needed: '+p.title;p.analysis='Tidak ada observation/test dan evidence terkait yang cukup. '+p.analysis;p.reason='Finding harus ditopang pengujian manual dan evidence supplied.';p.evidenceIds=[];
      }else{p.evidenceIds=observed;p.testIds=grounding.tests.map(t=>t.id);p.signalIds=grounding.signalIds;p.adversarialValidation=grounding.validation;p.validationStatus=grounding.validation.some(v=>v.status!=='READY_FOR_RESEARCHER_REVIEW')?'NEEDS_TESTING':'READY_FOR_RESEARCHER_REVIEW';p.evidenceLinks=grounding.evidence.map(e=>({evidenceId:e.id,role:e.evidenceRole||'SUPPORTS',provenance:{status:'UNKNOWN',source:'test-link:'+e.testCaseId,confidence:0,evidenceRefs:[e.id]}}));p.observationSnapshot={testId:test.id,actualResult:test.actualResult,testResult:test.result,...(test.sourceFingerprint?{testFingerprint:test.sourceFingerprint}:{}),tests:grounding.tests.map(t=>({id:t.id,sourceFingerprint:t.sourceFingerprint,actualResult:t.actualResult,result:t.result})),evidence:observed.map(id=>{const e=context.evidence.find(e=>e.id===id);return {id,content:e.content,...(e.sourceFingerprint?{sourceFingerprint:e.sourceFingerprint}:{})};})};p.content.actualResult=test.actualResult;p.content.expectedResult=test.expectedResult;for(const key of ['who','what','object','state','authority','context','steps'])p.content[key]=test[key]||'';}
    }
    if(p.kind==='report'&&!context.findings.some(f=>f.id===p.relatedFindingId&&f.status==='confirmed'&&f.evidenceIds?.length)){p.kind='uncertain-analysis';p.content.reportMarkdown='';p.reason='Report memerlukan confirmed finding dengan evidence terlampir.';}
    if(p.kind==='report')p.findingFingerprint=context.findings.find(f=>f.id===p.relatedFindingId)?.sourceFingerprint||'';
    if(p.kind==='test-plan'){p.content.actualResult='';if(!p.relatedHypothesisId){p.kind='uncertain-analysis';p.reason='Test plan harus terkait hypothesis yang sudah direview.';}}
    if(/brute.?force|credential stuffing|mass (?:scan|fuzz)|denial.of.service|destructive (?:test|action)/i.test(JSON.stringify(p))){p.kind='uncertain-analysis';p.content=emptyAgentContent();p.analysis='Saran ditahan policy; gunakan review manual sesuai scope.';p.reason='Tindakan tidak diizinkan.';}
    p.notes='AI INFERENCE; belum terverifikasi. '+p.notes;
  }
  return rows.map(p=>proposalRecord(p,agentId,context.revision));
}
export class ResearchOrchestrator{
  constructor(provider,config,ledger,adapters){this.provider=provider;this.config=config;this.ledger=ledger;this.adapters=adapters;this.agents=createSpecialists(provider);this.active=new Map();}
  pause(runId){const run=this.active.get(runId);if(run)run.controller.abort();return !!run;}
  status(runId){const run=this.active.get(runId);return run?structuredClone(run.research):null;}
  async message({runId,context,message,inventory,privacyMode,memory,researchState}){
    validateAgentContext(context);validateToolInventory(inventory);validateMessageAttachments(message.attachments||[]);
    context=prepareAdvancedContext(context);
    if(this.active.size)throw new Error('Run already active.');
    const team=planMessageAgents(message),model=message.model||this.config.model;
    if(!this.config.models.includes(model))throw new Error('Model unavailable.');
    const controller=new AbortController(),startedAt=iso(),policy=agentScopePolicy(context),config=this.config.agentic;
    const research={state:'RUNNING',currentStage:team[0],currentTask:'Group conversation',team};
    this.active.set(runId,{controller,research});
    const deadline=setTimeout(()=>controller.abort(),240000),replies=[];let estimatedCostUSD=0,steps=0;
    const safeAnswer=(finding,nextStep,priority='Informational')=>({finding,reason:'Analysis only; researcher review controls canonical changes.',evidenceIds:[],risk:'Unknown',nextStep,details:'',priority});
    const addReply=(agentId,status,answer,proposals=[],cost=0,begin=iso())=>{
      const reply={agentId,model,status,answer,proposals,history:{id:randomUUID(),agent:agentId,task:'Agent group message',startedAt:begin,completedAt:iso(),status,toolsUsed:[],resultSummary:answer.finding,researcherDecision:'',estimatedCostUSD:cost}};
      replies.push(reply);return reply;
    };
    const finish=status=>{
      const first=replies[0],proposals=replies.flatMap(row=>row.proposals);
      return SecretRedactor.context({agentId:first.agentId,model,status,answer:first.answer,proposals,history:first.history,replies,team,run:{id:runId,startedAt,completedAt:iso(),status,steps,estimatedCostUSD,actualCostUSD:null,reason:replies.at(-1).answer.finding}});
    };
    try{
      if(!policy.canRecommend&&team.some(id=>!['general','scope','domain-knowledge','target-intelligence'].includes(id))){
        addReply('scope','WAITING_REVIEW',safeAnswer(policy.assessment.reason,'Review scope and authorization first.','Important'),[systemReview('scope-question','Scope needs your review',policy.assessment.reason,context.revision)]);
        return finish('WAITING_REVIEW');
      }
      if(context.sensitiveEvidenceIds.length){
        addReply(team[0],'WAITING_REVIEW',safeAnswer('Sensitive evidence requires review.','Redact the selected evidence before sending.','Important'),[systemReview('uncertain-analysis','Sensitive message evidence','Redact selected evidence before analysis.',context.revision)]);
        return finish('WAITING_REVIEW');
      }
      const safeContext=SecretRedactor.context(context);
      for(const agentId of team){
        research.currentStage=agentId;research.currentTask='Waiting for '+agentId;
        if(controller.signal.aborted||steps>=config.maxSteps){addReply(agentId,'PAUSED',safeAnswer(controller.signal.aborted?'Message paused.':'Maximum steps reached. Remaining agents were not called.','Send a follow-up when ready.'));break;}
        const reservation=await this.ledger.reserve(runId,config.callBudgetUSD,config.runBudgetUSD,config.dailyBudgetUSD);
        if(!reservation){addReply(agentId,'PAUSED',safeAnswer('Budget Limit: this agent was not called.','Review estimated run/daily budget.','Important'));break;}
        estimatedCostUSD=reservation.runSpent;steps++;const begin=iso();
        if(controller.signal.aborted){addReply(agentId,'PAUSED',safeAnswer('Message paused.','Send again when ready.'),[],config.callBudgetUSD,begin);break;}
        try{
          const output=await this.agents.get(agentId).run(SecretRedactor.context({research:safeContext,message:{...message,model,answerStyle:'Answer naturally and concisely as yourself. Empty actions; proposals require review.'},team,sharedReplies:replies.filter(row=>!['ERROR','PAUSED'].includes(row.status)).map(row=>({agentId:row.agentId,summary:row.answer.finding,notes:row.answer.reason})),memory,researchState,manualAnalysisPriority:'Researcher corrections outrank AI inference.',priorProposals:replies.flatMap(row=>row.proposals).slice(-8),inventory:inventory.map(t=>({id:t.id,name:t.name,installed:t.installed,capabilities:t.capabilities,agentAccess:t.agentAccess})),policy:{assessment:policy.assessment,rules:policy.rules,targetRequests:false,externalAdapterAvailable:false},privacyMode}),{signal:controller.signal});
          if(controller.signal.aborted){addReply(agentId,'PAUSED',safeAnswer('Message paused; response discarded.','Send again when ready.'),[],config.callBudgetUSD,begin);break;}
          const proposals=constrainProposals(output,safeContext,agentId,inventory),first=proposals[0];
          const answer={finding:output.summary.slice(0,700),reason:(first?.reason||output.notes||'Supplied context only; inference remains unverified.').slice(0,450),evidenceIds:[...new Set(proposals.flatMap(p=>p.evidenceIds))].slice(0,4),risk:output.unknownInformation.slice(0,2).join(' · ').slice(0,350)||'Unknown; verify with owned controls.',nextStep:proposals.length?'Review '+proposals.length+' proposal(s) in Review Queue.':output.unknownInformation[0]?.slice(0,250)||'Continue manual research and compare an authorized control.',details:[output.summary,output.notes,...output.unknownInformation,output.actions.length?'Tool suggestions withheld. Use supervised Research for tool review.':''].filter(Boolean).join('\n\n').slice(0,8000),priority:proposals.some(p=>p.kind==='potential-finding')?'Important':proposals.length?'Interesting':'Informational'};
          addReply(agentId,proposals.length?'WAITING_REVIEW':'COMPLETED',answer,proposals,config.callBudgetUSD,begin);
        }catch(error){
          addReply(agentId,controller.signal.aborted?'PAUSED':'ERROR',safeAnswer(controller.signal.aborted?'Message paused.':error?.code==='SENSITIVE_AGENT_OUTPUT'?'Sensitive provider output withheld.':'Analysis failed. Model may not support structured output or these attachments.','Review model or selected files, then Retry.','Important'),[],config.callBudgetUSD,begin);
          if(controller.signal.aborted)break;
        }
      }
      return finish(replies.some(row=>row.status==='PAUSED')?'PAUSED':replies.some(row=>row.status==='ERROR')?'ERROR':replies.some(row=>row.proposals.length)?'WAITING_REVIEW':'COMPLETED');
    }catch{
      addReply(research.currentStage||team[0],controller.signal.aborted?'PAUSED':'ERROR',safeAnswer(controller.signal.aborted?'Message paused.':'Analysis failed. Provider or budget service unavailable.','Review settings, then Retry.','Important'));return finish(controller.signal.aborted?'PAUSED':'ERROR');
    }finally{clearTimeout(deadline);this.active.delete(runId);}
  }
  async run({runId,context,research,inventory,privacyMode}){
    validateAgentContext(context);validateAgentResearch(research);validateToolInventory(inventory);
    context=prepareAdvancedContext(context);
    if(this.active.has(runId))throw new Error('Run already active.');
    const state=structuredClone(research),controller=new AbortController(),run={id:runId,startedAt:iso(),completedAt:'',status:'RUNNING',steps:0,estimatedCostUSD:0,actualCostUSD:null,reason:''};
    state.runs.push(run);this.active.set(runId,{controller,research:state});
    const config=this.config.agentic;
    const log=(agent,task,status,summary,cost=0,toolsUsed=[],startedAt=iso())=>state.history.push({id:randomUUID(),agent,task,startedAt,completedAt:iso(),status,toolsUsed,resultSummary:SecretRedactor.redact(summary),researcherDecision:'',estimatedCostUSD:cost});
    const stop=(phase,reason)=>{state.state=phase;state.reason=reason;state.currentTask=reason;run.status=phase;run.reason=reason;run.completedAt=iso();state.progress=Math.round(new Set(state.completedStages).size/agentStages.length*100);state.revision++;return SecretRedactor.context(state);};
    try{
      if(state.replanFrom){const start=agentStages.findIndex(s=>s[0]===state.replanFrom);if(start<0)throw new Error('Replan stage tidak valid.');state.completedStages=state.completedStages.filter(id=>agentStages.findIndex(s=>s[0]===id)<start);for(const p of state.reviewQueue.filter(p=>p.status==='PROPOSED'))p.stale=true;for(const a of state.pendingActions.filter(a=>a.status==='PROPOSED')){a.status='DENIED';a.policyReason='Research replanned; approval invalidated.';}state.replanFrom='';log('Orchestrator','Replan','COMPLETED','Researcher analysis/correction requested re-analysis.');}
      const scopeKey=digest([context.knowledge.scope,context.knowledge.authorization,context.knowledge.programRules]);
      if(state.scopeFingerprint&&state.scopeFingerprint!==scopeKey){state.completedStages=state.completedStages.filter(id=>agentStages.findIndex(s=>s[0]===id)<2);for(const p of state.reviewQueue.filter(p=>p.status==='PROPOSED'&&p.contextRevision!==context.revision))p.stale=true;for(const a of state.pendingActions.filter(a=>a.status==='PROPOSED'&&a.contextRevision!==context.revision)){a.status='DENIED';a.policyReason='Scope/rules changed; approval invalidated.';}}
      state.scopeFingerprint=scopeKey;
      const policy=agentScopePolicy(context);
      if(!policy.canRecommend){if(!state.reviewQueue.some(p=>p.kind==='scope-question'&&p.status==='PROPOSED'&&!p.stale))state.reviewQueue.push(systemReview('scope-question','Scope needs your review',policy.assessment.reason,context.revision));return stop('WAITING_REVIEW',policy.assessment.reason);}
      const sensitiveKey=digest([context.sensitiveEvidenceIds,context.evidence.map(e=>[e.id,SecretRedactor.redact(e.content)])]);
      if(context.sensitiveEvidenceIds.length&&state.sensitiveReviewedKey!==sensitiveKey){if(!state.reviewQueue.some(p=>p.status==='PROPOSED'&&p.content.context===sensitiveKey))state.reviewQueue.push(systemReview('uncertain-analysis','Sensitive evidence needs review','Data sensitif terdeteksi. Periksa/redaksi evidence dan konfirmasi kepemilikan sebelum analisis dilanjutkan.',context.revision,{type:'sensitive-review',context:sensitiveKey}));return stop('WAITING_REVIEW','Unexpected sensitive evidence; researcher review required.');}
      const evidenceKey=digest(context.evidence);
      if(state.evidenceFingerprint&&state.evidenceFingerprint!==evidenceKey){state.completedStages=state.completedStages.filter(id=>agentStages.findIndex(s=>s[0]===id)<8);for(const p of state.reviewQueue.filter(p=>p.status==='PROPOSED'&&p.contextRevision!==context.revision&&['potential-finding','report'].includes(p.kind)))p.stale=true;}
      state.evidenceFingerprint=evidenceKey;
      // Resume the earliest affected dependent stage, preserving valid upstream work.
      const parts={intelligence:[0,[context.knowledge.targetKnowledge,context.knowledge.domains]],scope:[2,[context.knowledge.target,context.knowledge.scope,context.knowledge.authorization,context.knowledge.programRules,context.environment]],surface:[4,[context.knowledge.actors,context.knowledge.objects,context.knowledge.boundaries]],techniques:[6,context.knowledge.techniques],hypotheses:[7,context.hypotheses],tests:[8,context.tests],evidence:[8,context.evidence],findings:[12,context.findings]};
      const fingerprints=Object.fromEntries(Object.entries(parts).map(([key,[,value]])=>[key,digest(value)]));
      let restart=agentStages.length;
      for(const [key,[index]] of Object.entries(parts))if(state.contextFingerprints?.[key]&&state.contextFingerprints[key]!==fingerprints[key])restart=Math.min(restart,index);
      state.contextFingerprints=fingerprints;
      if(restart<agentStages.length){state.completedStages=state.completedStages.filter(id=>agentStages.findIndex(s=>s[0]===id)<restart);for(const p of state.reviewQueue)if(p.status==='PROPOSED'&&p.contextRevision!==context.revision)p.stale=true;log('Orchestrator','Context changed','COMPLETED','Re-analysis from '+agentStages[restart][2]+'.');}
      for(const p of state.reviewQueue)if(p.status==='PROPOSED'&&p.contextRevision!==context.revision)p.stale=true;
      const advanced=context.advancedResearch;
      if(advanced){
        const signalKey=digest([advanced.signals,context.researchModel.observations]);
        if(state.advancedSignalFingerprint!==signalKey&&advanced.signals.length){
          state.completedStages=state.completedStages.filter(id=>agentStages.findIndex(s=>s[0]===id)<6);
          log('Contradiction Analyzer','Targeted hypothesis re-analysis','HYPOTHESIS_REANALYSIS',advanced.signals.length+' grounded research signals; upstream stages preserved.');
        }
        state.advancedSignalFingerprint=signalKey;
        for(const hypothesis of advanced.hypotheses.slice(0,3)){
          if(context.hypotheses.some(h=>h.signalId===hypothesis.signalId)||state.reviewQueue.some(p=>p.signalId===hypothesis.signalId&&!p.stale))continue;
          const actor=context.knowledge.actors.find(a=>a.id===hypothesis.actorId),object=context.knowledge.objects.find(o=>o.id===hypothesis.objectId);
          const p=systemReview('hypothesis',hypothesis.title,hypothesis.reason,context.revision,{invariant:hypothesis.invariant,expectedBehavior:hypothesis.invariant,potentialFailure:hypothesis.reason,who:actor.name,what:advanced.signals.find(s=>s.id===hypothesis.signalId).operation,object:object.name,state:hypothesis.state,authority:hypothesis.authority,context:hypothesis.context,preconditions:'Owned dummy objects and valid recorded scope only.',steps:hypothesis.discriminatingTest});
          Object.assign(p,{agentId:'hypothesis',source:'Deterministic research signals; unverified',signalId:hypothesis.signalId,actorId:hypothesis.actorId,objectId:hypothesis.objectId,boundaryId:hypothesis.boundaryId,invariantId:hypothesis.invariantId,evidenceIds:hypothesis.evidenceRefs,researchRanking:hypothesis.researchRanking,confirmEvidence:hypothesis.confirmEvidence,rejectEvidence:hypothesis.rejectEvidence,alternativeExplanation:hypothesis.alternativeExplanation,discriminatingTest:hypothesis.discriminatingTest,validationStatus:hypothesis.validation.status});state.reviewQueue.push(p);
        }
        if(state.reviewQueue.some(p=>p.status==='PROPOSED'&&!p.stale&&p.signalId&&p.kind==='hypothesis'))return stop('HYPOTHESIS_REANALYSIS','Unexpected evidence generated ranked hypotheses and discriminating tests. Review before further model calls.');
      }
      const unfinishedFinding=state.reviewQueue.some(p=>p.status==='PROPOSED'&&!p.stale&&p.kind==='potential-finding'&&!p.analysisCompleted);
      if(unfinishedFinding)state.completedStages=state.completedStages.filter(id=>agentStages.findIndex(s=>s[0]===id)<10);
      if(state.pendingActions.some(a=>a.status==='PROPOSED'))return stop('WAITING_APPROVAL','Local tool action needs approval.');
      const pending=()=>state.reviewQueue.filter(p=>p.status==='PROPOSED'&&!p.stale);
      if(pending().some(p=>p.kind!=='potential-finding'||p.analysisCompleted))return stop(pending().some(p=>p.kind==='potential-finding'&&p.validationStatus==='NEEDS_TESTING')?'NEEDS_MORE_TESTING':pending().some(p=>p.kind==='potential-finding')?'FINDING_REVIEW':'WAITING_REVIEW','Needs your review before canonical data changes.');
      const safeContext=SecretRedactor.context(context); // Agentic always redacts both LOCAL and cloud context.
      for(;;){
        if(controller.signal.aborted)return stop('PAUSED','Paused by researcher.');
        const stage=agentStages.find(s=>!state.completedStages.includes(s[0]));
        if(!stage)return stop('COMPLETED','Current research path reviewed; research space is not exhausted. Researcher remains responsible for conclusions.');
        const [id,name,label,nextState]=stage;state.currentStage=id;state.currentTask=label;state.state='RUNNING';
        if(id==='hypothesis'&&advanced?.signals.length&&advanced.signals.every(s=>context.hypotheses.some(h=>h.signalId===s.id))){state.completedStages.push(id);continue;}
        if(id==='test-planner'&&advanced?.hypotheses.length){
          const candidate=advanced.hypotheses.find(h=>context.hypotheses.some(row=>row.signalId===h.signalId)&&!context.tests.some(t=>t.hypothesisId===context.hypotheses.find(row=>row.signalId===h.signalId).id));
          if(candidate){const h=context.hypotheses.find(row=>row.signalId===candidate.signalId),p=systemReview('test-plan','Discriminate: '+h.title,candidate.reason,context.revision,{steps:candidate.discriminatingTest,preconditions:'Recorded scope, owned dummy resources; stop on unclear authority or unexpected sensitive data.',expectedResult:h.expectedBehavior,who:h.who,what:h.what,object:h.object,state:h.state,authority:h.authority,context:h.context});p.relatedHypothesisId=h.id;p.agentId='test-planner';p.source='Deterministic discriminating test; manual review';state.reviewQueue.push(p);state.completedStages.push(id);return stop('TEST_PLANNED','Review the highest-ranked discriminating test before manual execution.');}
        }
        if(id==='finding'&&pending().some(p=>p.kind==='potential-finding')){state.completedStages.push(id);continue;}
        if(id==='test-planner'&&!context.hypotheses.length){state.reviewQueue.push(systemReview('uncertain-analysis','Reviewed hypothesis required','Buat atau terima hypothesis sebelum menyusun test plan.',context.revision));return stop('WAITING_REVIEW','No reviewed hypothesis available.');}
        if(id==='evidence'&&!context.evidence.length)return stop('TESTING','Jalankan test terotorisasi secara manual, lalu tambahkan observation dan evidence.');
        if(id==='report'&&!context.findings.some(f=>f.status==='confirmed'&&f.evidenceIds?.length)){state.completedStages.push(id);return stop('COMPLETED','Tidak ada confirmed finding dengan evidence; tidak ada report AI yang dibuat.');}
        if(run.steps>=config.maxSteps)return stop('PAUSED','Maximum steps reached. Continue starts a new bounded run.');
        const reservation=await this.ledger.reserve(runId,config.callBudgetUSD,config.runBudgetUSD,config.dailyBudgetUSD);
        if(!reservation)return stop('PAUSED','Budget Limit: estimated run/daily reservation reached.');
        run.steps++;run.estimatedCostUSD=reservation.runSpent;state.dailyEstimatedCostUSD=reservation.dailySpent;
        let output;const stageStarted=iso();
        const toolResults=state.pendingActions.filter(a=>a.status==='EXECUTED'&&a.contextRevision===context.revision).slice(-8).map(a=>({id:a.id,adapter:a.adapter,toolId:a.toolId,goal:a.goal,contextRevision:a.contextRevision,sourceType:'local-derived',targetObservation:false,evidenceIds:(a.resultEvidenceIds||[]).filter(e=>context.evidence.some(row=>row.id===e)),result:a.result.slice(0,8000)}));
        try{output=await this.agents.get(id).run({research:safeContext,toolResults:SecretRedactor.context(toolResults),manualAnalysisPriority:'Researcher analysis/corrections outrank AI inference. Local tool results are derived analysis, never new target observations.',priorProposals:state.reviewQueue.filter(p=>!p.stale).slice(-24),inventory:inventory.map(t=>({id:t.id,name:t.name,installed:t.installed,capabilities:t.capabilities,agentAccess:t.agentAccess})),policy:{assessment:policy.assessment,rules:policy.rules,targetRequests:config.allowTargetRequests,externalAdapterAvailable:false},privacyMode},{signal:controller.signal});}
        catch(error){const sensitive=error?.code==='SENSITIVE_AGENT_OUTPUT';log(name,label,controller.signal.aborted?'PAUSED':'FAILED',sensitive?'Sensitive provider output withheld. No canonical data changed.':'Provider failed or output invalid. No canonical data changed.',config.callBudgetUSD,[],stageStarted);return stop('PAUSED',controller.signal.aborted?'Paused by researcher.':sensitive?'Unexpected sensitive provider output. Review privacy/evidence before Continue.':'Provider error: review settings, then Continue.');}
        if(controller.signal.aborted){log(name,label,'PAUSED','Result discarded after pause.',config.callBudgetUSD,[],stageStarted);return stop('PAUSED','Paused by researcher.');}
        const proposals=constrainProposals(output,safeContext,id,inventory);
        state.reviewQueue.push(...proposals);state.completedStages.push(id);state.state=nextState;
        const results=[];
        for(const suggestion of output.actions){
          const evaluated=evaluateAgentAction(suggestion,safeContext,inventory,config);
          const action={...suggestion,id:randomUUID(),planId:runId,createdAt:iso(),contextRevision:context.revision,...evaluated,status:evaluated.permission==='DENIED'?'DENIED':'PROPOSED',approvalToken:'',result:'',policyReason:evaluated.reason};
          if(evaluated.permission==='APPROVAL_REQUIRED')action.approvalToken=this.adapters.sign(action,safeContext);
          if(evaluated.permission==='SAFE_AUTO'){try{const result=await this.adapters.execute(action,safeContext);action.status='EXECUTED';action.result=SecretRedactor.redact(result.result);action.resultEvidenceIds=result.evidenceIds;results.push(result.summary);}catch{action.status='FAILED';action.result='Local adapter failed; no target interaction.';}}
          state.pendingActions.push(action);
        }
        log(name,label,'COMPLETED',output.summary+(results.length?'\n'+results.join('\n'):''),config.callBudgetUSD,output.actions.map(a=>a.adapter),stageStarted);
        if(id==='false-positive')for(const p of pending().filter(p=>p.kind==='potential-finding'))p.falsePositiveAnalysis=output.summary;
        if(id==='duplicate')for(const p of pending().filter(p=>p.kind==='potential-finding')){p.duplicateRisk=output.summary;p.analysisCompleted=!!p.falsePositiveAnalysis;}
        state.progress=Math.round(new Set(state.completedStages).size/agentStages.length*100);
        if(state.pendingActions.some(a=>a.planId===runId&&a.status==='DENIED'))return stop('PAUSED','Policy blocked an action. Review Agent History; external adapters are unavailable.');
        if(output.confidence<.35&&!proposals.length){state.reviewQueue.push(systemReview('uncertain-analysis','Uncertain '+label,output.summary+'\n'+output.unknownInformation.join('\n'),context.revision));return stop('WAITING_REVIEW','Uncertain analysis needs researcher input.');}
        if(state.pendingActions.some(a=>a.status==='PROPOSED'))return stop('WAITING_APPROVAL','Review local action before execution.');
        if(pending().some(p=>p.kind!=='potential-finding'))return stop('WAITING_REVIEW','Needs your review. Accept/Edit/Reject proposals.');
        if(pending().some(p=>p.kind==='potential-finding'&&p.analysisCompleted))return stop(pending().some(p=>p.kind==='potential-finding'&&p.validationStatus==='NEEDS_TESTING')?'NEEDS_MORE_TESTING':'FINDING_REVIEW','Potential finding, alternatives and duplicate analyses need discriminating evidence and researcher decision.');
      }
    }catch{log('Orchestrator','Run','FAILED','Context/policy/budget service unavailable.');return stop('PAUSED','Policy or budget ledger unavailable; no further calls.');}
    finally{this.active.delete(runId);}
  }
}
