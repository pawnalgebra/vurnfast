import {environmentReadiness} from '../services/environment.js';
import {el,button,panel,badge,empty,uuid,now,dateLabel} from '../utils.js';
import {editDialog,field,formulaFields} from '../forms.js';
import {routeTo} from '../router.js';
import {actorFields,objectFields,boundaryFields} from './attack-surface.js';
import {agentStages,manualAnalysisTypes,capabilityPermissions,validateAgentResearch} from '../services/agent-schema.js';
import {AgentResearchService,compactAgentResearch,mergeAgentResearch} from '../services/agent-research.js';
import {buildAgentContext} from '../services/agent-context.js';
import {aiConnection,agentPost} from '../services/ai-client.js';
import {SecretRedactor} from '../services/redactor.js';
import {coverageAnalysis} from '../services/analysis.js';
const pendingReviews=research=>research.reviewQueue.filter(p=>p.status==='PROPOSED'&&!p.stale);
function agentViewState(ctx,target){return ctx.agentBusy?.targetId===target.id&&ctx.agentPreview||AgentResearchService.get(target);}
function agentActionButton(label,handler,disabled=false,className=''){const control=button(label,handler,className);control.disabled=disabled;return control;}
function agentAvailable(){return !!(aiConnection.enabled&&aiConnection.agentic.enabled&&aiConnection.agentic.configured);}
async function pauseResearch(ctx){
  if(!ctx.agentBusy)return;try{await agentPost('/api/agent/pause',{runId:ctx.agentBusy.runId});ctx.toast('Pause diminta; output setelah pause tidak diterapkan.');}catch(error){ctx.toast(error.message);}
}
function previewAgentRun(ctx,target){
  if(ctx.agentBusy||ctx.agentMessageBusy||!agentAvailable()){ctx.toast('Aktifkan AI_ENABLED dan AGENTIC_AI_ENABLED pada backend localhost.');return;}
  const context=SecretRedactor.context(buildAgentContext(ctx.store.get(),target));
  const dialog=el('dialog',{class:'editor'},el('h2',{},'Review Agentic Research Context'),el('p',{class:'notice'},'Selected target, capped domain/research data, evidence dan manual analysis. Manual corrections memiliki priority lebih tinggi dari AI inference. Semua context dire­daksi. Agent hanya analysis/planning dan native local adapters; tidak ada target/network execution.'));
  const form=el('form',{class:'form-grid'});field(form,['agentPrivacy','Privacy Mode','select',['LOCAL_ONLY','REDACTED_CLOUD','CLOUD']],aiConnection.privacyMode);
  form.append(el('pre',{class:'wide'},JSON.stringify(context,null,2)),el('div',{class:'actions wide'},button('Cancel',()=>dialog.close()),el('button',{type:'submit',class:'primary'},'Start Supervised Research')));
  form.addEventListener('submit',event=>{event.preventDefault();const privacyMode=form.elements.agentPrivacy.value;if(privacyMode==='LOCAL_ONLY'&&aiConnection.provider!=='ollama'){ctx.toast('LOCAL_ONLY memerlukan Ollama localhost.');return;}dialog.close();void continueAgentRun(ctx,target,context,privacyMode);});
  dialog.append(form);dialog.addEventListener('close',()=>dialog.remove());document.body.append(dialog);dialog.showModal();
}
async function continueAgentRun(ctx,target,context,privacyMode){
  const runId=uuid(),research=compactAgentResearch(AgentResearchService.get(target)),revision=target.researchRevision||0;
  const payload={runId,context,research,inventory:ctx.store.get().toolInventory,privacyMode};
  if(new TextEncoder().encode(JSON.stringify(payload)).length>280000){ctx.toast('Selected research payload melebihi 280 KB. Kurangi catatan/evidence panjang sebelum mengirim.');return;}
  ctx.agentBusy={runId,targetId:target.id,revision};ctx.agentPreview={...research,state:'RUNNING',currentTask:'Planning next research task…'};ctx.render();
  let polling=false;
  const poll=setInterval(async()=>{if(polling||!ctx.agentBusy)return;polling=true;try{const status=await agentPost('/api/agent/status',{runId});if(status.research){ctx.agentPreview=status.research;if(['dashboard','research-details','agent-history'].includes(ctx.route))ctx.render();}}catch{}finally{polling=false;}},1000);
  const unsubscribe=ctx.store.subscribe(()=>{const current=ctx.store.target(target.id);if(!current||current!==target||current.researchRevision!==revision){if(ctx.agentBusy&&!ctx.agentBusy.stale){ctx.agentBusy.stale=true;void agentPost('/api/agent/pause',{runId}).catch(()=>{});}}});
  try{
    const response=await agentPost('/api/agent/run',payload,Math.min(600000,(aiConnection.agentic.maxSteps||8)*65000+15000));validateAgentResearch(response.research);
    const current=ctx.store.target(target.id);
    if(current&&current===target&&current.researchRevision===revision)AgentResearchService.update(ctx.store,current,mergeAgentResearch(AgentResearchService.get(current),response.research));
    else if(current){const preserved=structuredClone(AgentResearchService.get(current));preserved.history.push({id:uuid(),agent:'Orchestrator',task:'Context changed',startedAt:now(),completedAt:now(),status:'PAUSED',toolsUsed:[],resultSummary:'Run output discarded because canonical research/manual analysis changed.',researcherDecision:'',estimatedCostUSD:response.research.runs.find(r=>r.id===runId)?.estimatedCostUSD||0});preserved.state='PAUSED';preserved.reason='Context berubah; hasil run ditahan. Continue untuk replan.';AgentResearchService.update(ctx.store,current,preserved);}
    ctx.toast(response.research.reason);
  }catch(error){const current=ctx.store.target(target.id);if(current){const research=structuredClone(AgentResearchService.get(current));research.state='PAUSED';research.reason='Run interrupted: '+error.message;AgentResearchService.update(ctx.store,current,research);}ctx.toast(error.message);void agentPost('/api/agent/pause',{runId}).catch(()=>{});}
  finally{clearInterval(poll);unsubscribe();ctx.agentBusy=null;ctx.agentPreview=null;ctx.render();}
}
function researchControls(ctx,target){
  const research=AgentResearchService.get(target);
  return el('div',{class:'actions agent-primary'},agentActionButton(research.runs.length?'Continue Research':'Start Research',()=>previewAgentRun(ctx,target),!!(ctx.agentBusy||ctx.agentMessageBusy)||!agentAvailable(),'primary'),button('Review Queue ('+pendingReviews(research).length+')',()=>routeTo('review-queue')),button('Manual Analysis',()=>routeTo('manual-analysis')),ctx.agentBusy?button('Pause Research',()=>pauseResearch(ctx)):null);
}
function stageProgress(research){
  return el('ol',{class:'agent-stage-progress'},agentStages.map(([id,,label])=>el('li',{class:research.completedStages.includes(id)?'complete':research.currentStage===id?'current':''},el('span',{},research.completedStages.includes(id)?'✓':research.currentStage===id?'→':'○'),label)));
}
function historyTable(research,limit=30){
  const root=el('div');
  for(const row of research.history.slice(-limit).reverse())root.append(el('article',{class:'record'},el('div',{class:'badges'},badge(row.agent),badge(row.status),badge(dateLabel(row.completedAt||row.startedAt))),el('h3',{},row.task),el('p',{},row.resultSummary),el('small',{class:'muted'},'Tools: '+(row.toolsUsed?.join(', ')||'None')+' · Decision: '+(row.researcherDecision||'Pending / not required')+' · Estimated reservation: $'+Number(row.estimatedCostUSD||0).toFixed(4))));
  if(!research.history.length)root.append(empty('Belum ada activity. History berisi action/result/status/timestamp, tanpa private chain-of-thought.'));return root;
}
export function renderAgentDashboard(ctx,target){
  const research=agentViewState(ctx,target),phase=agentStages.find(s=>s[0]===research.currentStage)?.[2]||'Target Created';
  const root=el('div',{},ctx.heading('Research Dashboard',target.name+' · Agents research. Researcher reviews and decides.'));
  root.append(el('a',{href:'#research-environment'},'Environment: '+environmentReadiness(target)));
  root.append(researchControls(ctx,target));
  const progress=el('progress',{max:100,value:research.progress,'aria-label':'Research stage progress'});
  root.append(panel('Research Progress',el('strong',{class:'agent-percent'},research.progress+'%'),progress,el('p',{},'Current Phase: '+phase),el('p',{},'Current Task: '+(research.currentTask||'Ready to start supervised research.')),el('p',{class:'muted'},research.reason),el('div',{class:'badges'},badge(ctx.agentBusy?'Running':research.state),badge('Execution: Supervised'),badge('No target requests')),el('details',{},el('summary',{},'Research stages'),stageProgress(research))));
  root.append(el('div',{class:'stats'},[['Needs Your Review',pendingReviews(research).length],['Potential Findings',pendingReviews(research).filter(p=>p.kind==='potential-finding').length],['Manual Analysis',research.manualAnalysis.length],['Confirmed Findings',target.findings.filter(f=>f.status==='confirmed').length]].map(([label,value])=>el('div',{class:'stat'},el('strong',{},value),el('small',{},label)))));
  const nextWork=panel('Next Manual Work',el('p',{class:'muted'},'Agent progress does not replace manual testing or evidence.'));
  const tasks=[...target.testCases.filter(t=>!t.result||t.result==='not-tested').slice(0,3).map(row=>({row,route:'tests',kind:'Test'})),...target.hypotheses.filter(h=>['Next','Testing'].includes(h.queue)).slice(0,3).map(row=>({row,route:'hypotheses',kind:'Hypothesis'}))];
  for(const {row,route,kind} of tasks)nextWork.append(button(kind+': '+row.title,()=>{ctx.filterState[route]={query:row.title};routeTo(route);}));
  if(!tasks.length)nextWork.append(el('p',{},'No pending manual tasks recorded. Add a hypothesis or review coverage gaps.'));
  nextWork.append(el('div',{class:'badges'},coverageAnalysis(target).coverage.map(g=>badge(g.label+': '+g.covered+' / '+g.total))),button('Review Coverage Gaps',()=>routeTo('coverage')));root.append(nextWork);
  root.append(panel('Important Discoveries',research.history.length?research.history.slice(-2).map(h=>el('p',{},h.resultSummary.slice(0,500))):el('p',{class:'muted'},'Observations, uncertainty dan draft analisis akan muncul setelah research berjalan.')),panel('System Status',el('p',{},'Agentic AI: '+(agentAvailable()?ctx.agentBusy?'Running':'Ready':'Disabled / Misconfigured')),el('p',{},'Available tools: '+ctx.store.get().toolInventory.filter(t=>t.installed&&t.agentAccess!=='DENIED').length+' / '+ctx.store.get().toolInventory.length),el('p',{},'Today estimated reservations: '+(Number.isFinite(research.dailyEstimatedCostUSD)?'$'+research.dailyEstimatedCostUSD.toFixed(4):'Unknown until a run')),el('small',{class:'muted'},'Stage progress is workflow completion, bukan security coverage. Actual provider billing: Unknown.')));
  root.append(el('details',{class:'panel'},el('summary',{},'Agent Activity'),historyTable(research,6)),panel('Research Workspace',el('div',{class:'actions'},[['research-details','Research Details'],['evidence','Evidence'],['findings','Findings'],['reports','Reports'],['knowledge','Knowledge'],['tool-inventory','Tool Inventory'],['agent-history','Agent History'],['agentic-settings','Agentic Settings']].map(([route,title])=>button(title,()=>routeTo(route))))));return root;
}
function editAgentProposal(ctx,target,proposal,decision){
  const techniques=[['','Unknown / pilih technique'],...target.techniques.map(t=>[t.id,t.name])],base=[['title','Title','required']],notes=[['notes','Researcher Review Notes','textarea']];
  let fields;
  if(proposal.kind==='actor')fields=[...base,...actorFields];
  else if(proposal.kind==='object')fields=[...base,...objectFields];
  else if(proposal.kind==='boundary')fields=[...base,...boundaryFields];
  else if(proposal.kind==='hypothesis')fields=[...base,['relatedTechniqueId','Technique','select',techniques],['invariant','Security Invariant','textarea'],['expectedBehavior','Expected Behavior','textarea'],['potentialFailure','Potential Failure / Hypothesis','textarea'],...formulaFields(target),...notes];
  else if(proposal.kind==='test-plan')fields=[...base,['relatedHypothesisId','Reviewed Hypothesis','select',target.hypotheses.map(h=>[h.id,h.title])],['relatedTechniqueId','Technique','select',techniques],['preconditions','Preconditions','textarea'],['steps','Manual Test Steps','textarea'],['expectedResult','Expected Result','textarea'],...formulaFields(target),...notes];
  else if(proposal.kind==='potential-finding')fields=[...base,['startingAuthority','Starting Authority','textarea'],['securityRestriction','Broken Security Invariant / Restriction','textarea'],['protectedResource','Protected Resource'],...formulaFields(target),['preconditions','Preconditions','textarea'],['steps','Steps','textarea'],['expectedResult','Expected Result','textarea'],['actualResult','Actual Observed Result','textarea'],['rootCause','Potential Root Cause','textarea'],['impact','Observed Impact','textarea'],['vulnerabilityClass','Potential Class'],...notes];
  else if(proposal.kind==='report')fields=[...base,['reportMarkdown','Report Draft — replaces selected finding draft after Save','textarea'],...notes];
  else if(proposal.kind==='technique')fields=[...base,['relatedTechniqueId','Existing Technique','select',techniques],['analysis','Review Reason','textarea'],...notes];
  else if(proposal.kind==='tool-recommendation')fields=[...base,['analysis','Manual Tool Recommendation','textarea'],...notes];
  else fields=[...base,['analysis','Analysis / researcher edit','textarea'],...notes];
  const values={...proposal.content,title:proposal.title,analysis:proposal.analysis,notes:proposal.notes,relatedTechniqueId:target.techniques.find(t=>t.id===proposal.relatedTechniqueId||t.libraryId===proposal.relatedTechniqueId)?.id||'',relatedHypothesisId:proposal.relatedHypothesisId};
  if(['actor','object'].includes(proposal.kind)&&!values.name)values.name=proposal.title;
  editDialog((decision==='CONFIRM_FINDING'?'Confirm Finding':decision==='EDIT'?'Edit Proposal':'Review / Accept Proposal')+' — '+proposal.kind,fields,values,edited=>{AgentResearchService.decide(ctx.store,target,proposal.id,decision,edited);ctx.render();});
}
function reviewProposalCard(ctx,target,proposal){
  const card=panel(proposal.title,el('div',{class:'badges'},badge(proposal.kind),badge(proposal.sourceType==='ai'?'AI INFERENCE · AI GENERATED':'LOCAL POLICY'),badge('Confidence '+Math.round(proposal.confidence*100)+'%'),badge(proposal.stale?'Stale — replan required':proposal.status)),el('p',{},proposal.analysis),el('p',{class:'muted'},'Reason: '+proposal.reason),el('p',{class:'muted'},proposal.notes));
  const technique=target.techniques.find(t=>t.id===proposal.relatedTechniqueId||t.libraryId===proposal.relatedTechniqueId);
  card.append(el('p',{},'Target: '+target.name+' · Technique: '+(technique?.name||'Unknown')),el('p',{},'Evidence: '+(proposal.evidenceIds.map(id=>target.evidence.find(e=>e.id===id)?.label||'Missing').join(', ')||'None supplied')),el('small',{class:'muted'},'Recommended Decision: '+(proposal.recommendedDecision||'Researcher review')));
  if(proposal.kind==='tool-recommendation')card.append(el('p',{},'Tool: '+(ctx.store.get().toolInventory.find(t=>t.id===proposal.relatedToolId)?.name||'Tool unavailable')+' · Required capability: '+proposal.content.type+' · Execution mode: Manual'));
  if(proposal.kind==='potential-finding')card.append(el('dl',{class:'details'},['securityRestriction','who','object','state','expectedResult','actualResult','rootCause','impact'].map(k=>[el('dt',{},k),el('dd',{},proposal.content[k]||'Unknown')])),el('p',{},'False Positive Analysis: '+(proposal.falsePositiveAnalysis||'Pending')),el('p',{},'Duplicate Risk: '+(proposal.duplicateRisk||'Pending')));
  if(proposal.status==='PROPOSED'){
    const blocked=!!(ctx.agentBusy||ctx.agentMessageBusy)||proposal.stale;
    const controls=el('div',{class:'actions'},agentActionButton('Accept',()=>editAgentProposal(ctx,target,proposal,'ACCEPT'),blocked||proposal.kind==='potential-finding'&&!proposal.analysisCompleted,'primary'),agentActionButton(proposal.kind==='potential-finding'?'Edit Analysis':'Edit',()=>editAgentProposal(ctx,target,proposal,'EDIT'),blocked||proposal.kind==='potential-finding'&&!proposal.analysisCompleted),agentActionButton('Reject',()=>{AgentResearchService.decide(ctx.store,target,proposal.id,'REJECT');ctx.render();},!!(ctx.agentBusy||ctx.agentMessageBusy),'danger'));
    if(proposal.kind==='potential-finding')controls.prepend(agentActionButton('Confirm Finding',()=>editAgentProposal(ctx,target,proposal,'CONFIRM_FINDING'),blocked||!proposal.analysisCompleted,'primary'),agentActionButton('Need More Testing',()=>{AgentResearchService.decide(ctx.store,target,proposal.id,'REJECT');AgentResearchService.addManual(ctx.store,target,{type:'Next Test Suggestion',title:'Need more testing: '+proposal.title,content:'Perlu evidence tambahan sebelum menyimpulkan invariant failure. '+proposal.analysis,replanFrom:'evidence'});ctx.render();},blocked));
    card.append(controls);
  }return card;
}
async function approveLocalAction(ctx,target,action,decision='APPROVE_ONCE'){
  try{
    const revision=target.researchRevision,context=SecretRedactor.context(buildAgentContext(ctx.store.get(),target));const data=await agentPost('/api/agent/action',{action,context,inventory:ctx.store.get().toolInventory,decision});
    if(ctx.store.target(target.id)!==target||target.researchRevision!==revision)throw new Error('Context changed; local result discarded. Review a fresh action.');
    const research=structuredClone(AgentResearchService.get(target)),current=research.pendingActions.find(a=>a.id===action.id);if(!current)return;
    current.status='EXECUTED';current.result=SecretRedactor.redact(data.result.result);current.resultEvidenceIds=data.result.evidenceIds;current.approvalToken='';current.researcherDecision=decision;
    research.history.push({id:uuid(),agent:'Local Tool Adapter',task:action.goal,startedAt:now(),completedAt:now(),status:'EXECUTED',toolsUsed:[action.adapter],resultSummary:data.result.summary,researcherDecision:decision,estimatedCostUSD:0});research.state='PAUSED';research.reason='Local action selesai. Continue Research untuk analisis berikutnya.';AgentResearchService.update(ctx.store,target,research);ctx.render();
  }catch(error){ctx.toast(error.message);}
}
function editLocalAction(ctx,target,action){
  editDialog('Edit Local Action',[['goal','Goal','required'],['reason','Reason','textarea'],['query','Local Knowledge Query'],['json','JSON Input (local parsing)','textarea'],['leftEvidenceId','Left Evidence','select',[['','None'],...target.evidence.map(e=>[e.id,e.label])]],['rightEvidenceId','Right Evidence','select',[['','None'],...target.evidence.map(e=>[e.id,e.label])]]],{...action.input,goal:action.goal,reason:action.reason},values=>{
    const revised={...action,goal:values.goal,reason:values.reason,input:{...action.input,query:values.query,json:values.json,leftEvidenceId:values.leftEvidenceId,rightEvidenceId:values.rightEvidenceId}};
    void agentPost('/api/agent/review-action',{action:revised,context:SecretRedactor.context(buildAgentContext(ctx.store.get(),target)),inventory:ctx.store.get().toolInventory}).then(({action})=>{const research=structuredClone(AgentResearchService.get(target));research.pendingActions=research.pendingActions.map(a=>a.id===action.id?action:a);AgentResearchService.update(ctx.store,target,research);ctx.render();}).catch(error=>ctx.toast(error.message));
  });
}
function actionApprovalCard(ctx,target,action){
  const card=panel('Action Approval — '+action.goal,el('div',{class:'badges'},badge(action.status),badge(action.permission)),el('p',{},'Target: '+target.name),el('p',{},'Tool: '+(ctx.store.get().toolInventory.find(t=>t.id===action.toolId)?.name||'Unavailable')),el('p',{},'Capability: '+action.capability),el('p',{},'Reason: '+action.reason),el('p',{},'Scope Status: '+action.policyReason),el('p',{},'Risk: '+action.risk),el('p',{},'Expected Result: '+action.expectedResult),el('p',{},'Stop Conditions: '+action.stopConditions.join(' · ')),el('details',{},el('summary',{},'Exact structured input'),el('pre',{},JSON.stringify(action.input,null,2))));
  if(action.status==='PROPOSED')card.append(el('div',{class:'actions'},agentActionButton('Approve Once',()=>approveLocalAction(ctx,target,action),!!(ctx.agentBusy||ctx.agentMessageBusy),'primary'),agentActionButton('Approve Plan',async()=>{const actions=AgentResearchService.get(target).pendingActions.filter(a=>a.planId===action.planId&&a.status==='PROPOSED');if(actions.length>3){ctx.toast('Plan maksimal tiga local actions.');return;}for(const item of actions)await approveLocalAction(ctx,target,item,'APPROVE_PLAN');},!!(ctx.agentBusy||ctx.agentMessageBusy)),agentActionButton('Edit',()=>editLocalAction(ctx,target,action),!!(ctx.agentBusy||ctx.agentMessageBusy)),agentActionButton('Reject Action',()=>{const research=structuredClone(AgentResearchService.get(target));research.pendingActions=research.pendingActions.map(a=>a.id===action.id?{...a,status:'REJECTED',approvalToken:'',researcherDecision:'REJECT'}:a);AgentResearchService.update(ctx.store,target,research);ctx.render();},!!(ctx.agentBusy||ctx.agentMessageBusy),'danger')));
  if(action.result)card.append(el('details',{},el('summary',{},'Local result'),el('pre',{},action.result)));return card;
}
function editInventoryTool(ctx,previous){
  editDialog(previous?'Edit Tool Inventory':'Manual Tool Entry',[['name','Tool Name','required'],['installed','Installed','select',[['yes','Yes'],['no','No']]],['version','Version'],['path','Path (metadata only)'],['capabilities','Capabilities (comma separated)'],['agentAccess','Agent Access','select',capabilityPermissions],['notes','Notes','textarea']],{installed:'no',agentAccess:'APPROVAL_REQUIRED',...previous,installed:previous?.installed?'yes':'no',capabilities:previous?.capabilities.join(', ')||''},values=>{ctx.store.saveTool({...values,id:previous?.id||uuid(),installed:values.installed==='yes',capabilities:values.capabilities.split(',').map(v=>v.trim()).filter(Boolean)});ctx.render();});
}
export function renderToolInventory(ctx){
  const root=el('div',{},ctx.heading('Tool Inventory','Tools yang dicatat untuk perangkat Anda. Native adapters tersedia; executable/path inventory tidak dijalankan oleh agent.',button('Manual Tool Entry',()=>editInventoryTool(ctx),'primary')));
  root.append(panel('Local Detection',el('p',{},'Detect Installed Tools / Versions memeriksa fixed version commands pada perangkat backend localhost. Tidak menginstal tool atau menghubungi target.'),agentActionButton('Detect Installed Tools / Versions',async()=>{try{const {tools}=await agentPost('/api/tools/detect',{});for(const tool of tools){const previous=ctx.store.get().toolInventory.find(t=>t.name===tool.name);ctx.store.saveTool(previous?{...previous,installed:tool.installed,version:tool.version,path:tool.path}:tool);}ctx.toast('Inventory perangkat backend diperbarui.');ctx.render();}catch(error){ctx.toast(error.message);}},!aiConnection.baseURL||aiConnection.agentic.localToolAccess===false)));
  for(const tool of ctx.store.get().toolInventory)root.append(panel(tool.name,el('div',{class:'badges'},badge(tool.installed?'Installed / Available':'Tool unavailable'),badge(tool.agentAccess)),el('p',{},'Version: '+(tool.version||'Unknown')),el('p',{},'Path: '+(tool.path||'Unknown')),el('p',{},'Capabilities: '+tool.capabilities.join(', ')),el('p',{class:'muted'},tool.notes),el('div',{class:'actions'},button('Edit Tool',()=>editInventoryTool(ctx,tool)),button('Remove Tool',()=>{if(confirm('Hapus tool inventory ini? Adapter terkait akan dianggap unavailable.')){ctx.store.removeTool(tool.id);ctx.render();}},'danger'))));return root;
}
export function renderAgenticSettings(ctx){
  const config=aiConnection.agentic;
  const root=el('div',{},ctx.heading('Agentic AI Settings','Flags dan batas backend. AI keys tetap hanya pada .env server.'));
  const settings=[['Agentic AI Enabled',config.enabled?'Yes':'No'],['Provider Configured',config.configured?'Yes':'No'],['Execution Mode','Supervised'],['Human Approval','Required for proposals and permission-gated local actions'],['Max Steps',config.maxSteps||8],['Run Budget','$'+(config.runBudgetUSD??.25)],['Daily Budget','$'+(config.dailyBudgetUSD??2)],['Per-call Reservation','$'+(config.callBudgetUSD??.03)],['Local Tool Access',config.localToolAccess===false?'Denied':'Native adapters + fixed local detection'],['Target Interaction','No external adapter available'],['Current Policy','Scope → hard rules → inventory permission → bound approval → native adapter']];
  root.append(panel('Current Agentic Policy',el('dl',{class:'details'},settings.map(([label,value])=>[el('dt',{},label),el('dd',{},String(value))])),el('p',{class:'muted'},'AGENT_ALLOW_TARGET_REQUESTS='+String(config.allowTargetRequests||false)+' tidak membuka network/shell access. External execution belum tersedia.'),el('p',{class:'muted'},'Budget adalah estimasi konservatif yang dikonfigurasi, bukan tagihan nyata provider. Reservasi persist di backend dan dihitung harian UTC; failed calls tetap dihitung.'),el('div',{class:'actions'},button('AI Provider Settings',()=>routeTo('ai-provider')),button('Tool Inventory',()=>routeTo('tool-inventory')))));
  root.append(panel('Configure Backend',el('pre',{},'AI_ENABLED=true\nAGENTIC_AI_ENABLED=true\nAGENT_MAX_STEPS=8\nAGENT_RUN_BUDGET_USD=0.25\nAGENT_DAILY_BUDGET_USD=2.00\nAGENT_CALL_BUDGET_USD=0.03\nAGENT_ALLOW_LOCAL_TOOLS=true\nAGENT_ALLOW_TARGET_REQUESTS=false'),el('p',{},'Edit .env backend, isi provider/model yang existing, lalu restart dan Connect Backend. AI_ENABLED=false selalu menonaktifkan Agentic AI.')));return root;
}
export function renderAgentResearch(ctx,target){
  const titles={'review-queue':'Review Queue','manual-analysis':'Manual Analysis','research-details':'Research Details','agent-history':'Agent History'};
  const research=agentViewState(ctx,target),root=el('div',{},ctx.heading(titles[ctx.route],target.name+' · Progress, review, evidence, researcher decisions.'));
  root.append(el('a',{href:'#research-environment'},'Environment: '+environmentReadiness(target)));
  root.append(researchControls(ctx,target));
  if(ctx.route==='review-queue'){
    for(const proposal of research.reviewQueue.filter(p=>p.status==='PROPOSED').slice().reverse())root.append(reviewProposalCard(ctx,target,proposal));
    for(const action of research.pendingActions.filter(a=>['PROPOSED','DENIED','FAILED'].includes(a.status)))root.append(actionApprovalCard(ctx,target,action));
    if(!research.reviewQueue.some(p=>p.status==='PROPOSED')&&!research.pendingActions.some(a=>a.status==='PROPOSED'))root.append(empty('Review queue kosong. Continue Research atau tambahkan manual analysis.'));
  }else if(ctx.route==='manual-analysis'){
    root.append(panel('Researcher Analysis',el('p',{class:'muted'},'Observation, assessment, corrections dan ideas memiliki prioritas tinggi di context agent berikutnya.'),button('+ Add Manual Analysis',()=>editDialog('Manual Analysis',[['type','Type','select',manualAnalysisTypes],['title','Title','required'],['content','Researcher Analysis','textarea'],['replanFrom','Re-analyze from Phase','select',agentStages.map(([id,,label])=>[id,label])]],{type:'Observation',replanFrom:'hypothesis'},values=>{AgentResearchService.addManual(ctx.store,target,values);ctx.render();}),'primary')));
    for(const row of research.manualAnalysis.slice().reverse())root.append(panel(row.title,badge('RESEARCHER INPUT · '+row.type),el('p',{},row.content),el('small',{},dateLabel(row.createdAt))));
  }else if(ctx.route==='agent-history'){
    root.append(panel('Run Budgets & Outcomes',research.runs.slice().reverse().map(run=>el('p',{},dateLabel(run.startedAt)+' · '+run.status+' · '+run.steps+' steps · Estimated $'+run.estimatedCostUSD.toFixed(4)+' · Actual cost Unknown'))),historyTable(research,200),panel('Tool Activity',research.pendingActions.map(action=>actionApprovalCard(ctx,target,action))));
  }else{
    root.append(panel('Current Research',badge(research.state),el('p',{},research.currentTask||'Not started'),el('p',{},research.reason),stageProgress(research),button('Replan Research',()=>editDialog('Replan Research',[['phase','From Phase','select',agentStages.map(([id,,label])=>[id,label])],['reason','Researcher Reason','textarea']],{phase:'target-intelligence'},values=>{AgentResearchService.addManual(ctx.store,target,{type:'Correction',title:'Research plan correction',content:values.reason,replanFrom:values.phase});ctx.render();}))),panel('Reviewed Proposals',research.reviewQueue.filter(p=>p.status!=='PROPOSED').slice(-30).reverse().map(p=>el('p',{},p.title+' · '+p.status+' · '+p.decision))));
  }return root;
}
