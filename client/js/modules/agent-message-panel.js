import {el,button,uuid} from '../utils.js';
import {companionIcon} from '../icons.js';
import {agentStages} from '../services/agent-schema.js';
import {aiConnection,agentPost} from '../services/ai-client.js';
import {AgentMessageService,messageAgents,messageAgentDomains,messageReferenceRows,parseMessageTags,planMessageAgents} from '../services/agent-messages.js';
import {readMessageAttachment,validateMessageAttachments,attachmentMetadata,attachmentAccept} from '../services/message-attachments.js';
import {RelatedTermService} from '../services/related-terms.js';
import {ResearchContextBuilder} from '../services/research-context-builder.js';
import {SecretRedactor} from '../services/redactor.js';
import {routeTo} from '../router.js';
const panelStatusLabels={RUNNING:'Researching',WAITING_REVIEW:'Waiting Review',WAITING_APPROVAL:'Waiting Approval',PAUSED:'Paused',COMPLETED:'Completed',ERROR:'Error',FINDING_REVIEW:'Waiting Review'};
const pageContextKinds={actors:'actor',objects:'object',boundaries:'boundary',techniques:'technique',hypotheses:'hypothesis',queue:'hypothesis',tests:'test',evidence:'evidence',findings:'finding',reports:'report',scope:'scope'};
const messageActionSets={evidence:[['Analyze','@evidence analisis evidence terpilih'],['Compare','@evidence tentukan control pembanding yang diperlukan'],['Potential Finding','@finding nilai apakah observation mendukung potential finding']],hypothesis:[['Explain','@hypothesis jelaskan invariant ini'],['Generate Test','@test susun manual test plan dari hypothesis ini'],['Find Variant','@hypothesis cari variant yang relevan']],finding:[['Analyze','@finding analisis finding ini'],['False Positive','@false-positive periksa penjelasan alternatif'],['Duplicate Check','@duplicate periksa risiko duplicate'],['Report','@report susun draft report dari finding confirmed ini']],report:[['Explain','@report jelaskan gap laporan ini'],['Review','@report review kelengkapan report dan evidence']]};
export function createAgentMessagePanel(ctx){
  let enabled=false,mode='collapsed',fingerprint='',targetKey='',autoRefs=[],removed=new Set(),historyOffset=0,conversationKey='',timer,suggestions=[],suggestionIndex=0,completion=null,lastError='',lastDraft='',paused=false,controller;
  let attachments=[],lastFiles=[],lastModel='',lastRunId='',readingFiles=false,modelsLoading=false,modelKey='',progressTimer;
  try{mode=localStorage.getItem('research-agent-panel')||'collapsed';}catch{}
  if(!['open','collapsed','closed'].includes(mode))mode='collapsed';
  const relatedService=new RelatedTermService(),builder=new ResearchContextBuilder(),mobile=matchMedia('(max-width: 760px)');
  const iconButton=(label,icon,click)=>{const node=button(companionIcon(icon),click,'agent-icon-button');node.setAttribute('aria-label',label);node.title=label;return node;};
  const launcher=iconButton('Open Agent Message','message-square-text',()=>setMode('open'));launcher.id='agent-message-launcher';launcher.setAttribute('aria-controls','agent-message-panel');
  const agentName=el('strong',{}),task=el('p',{class:'agent-task'}),status=el('span',{class:'agent-message-status',role:'status','aria-live':'polite'});
  const conversation=el('div',{class:'agent-conversation','aria-label':'Recent Agent Messages'}),contextArea=el('div',{class:'agent-context-chips'}),quick=el('div',{class:'agent-quick-actions'}),relatedArea=el('div',{class:'agent-related-terms'});
  const input=el('textarea',{id:'agent-message-input',rows:'3',maxlength:'6000',placeholder:'Ask about this research… @agent #reference','aria-label':'Message Agent','aria-autocomplete':'list','aria-controls':'agent-message-suggestions','aria-expanded':'false',autocomplete:'off'});
  const list=el('div',{id:'agent-message-suggestions',class:'agent-suggestions',role:'listbox','aria-label':'Agent and context suggestions',hidden:true});
  const send=button(el('span',{},companionIcon('send'),'Send'),()=>void sendMessage(),'primary'),pause=iconButton('Pause message','pause',()=>cancelMessage('Paused by researcher.'));
  const feedback=el('p',{class:'agent-message-feedback',role:'status','aria-live':'polite'});
  const fileInput=el('input',{id:'agent-message-files',type:'file',multiple:true,accept:attachmentAccept,hidden:true,'aria-label':'Attach files'});
  const fileArea=el('div',{class:'agent-attachments'}),routing=el('small',{class:'agent-routing','aria-live':'polite'});
  const addFiles=iconButton('Add files','plus',()=>fileInput.click());
  const modelSelect=el('select',{id:'agent-message-model','aria-label':'LLM model',title:'Model for the next message'});
  const refreshModels=iconButton('Refresh models','refresh-cw',()=>void loadModels());
  modelSelect.addEventListener('change',()=>{try{localStorage.setItem('research-chat-model:'+aiConnection.provider,modelSelect.value);}catch{}feedback.textContent='Next message: '+modelSelect.value;});
  const composer=el('form',{class:'agent-message-composer',onsubmit:event=>{event.preventDefault();void sendMessage();}},fileArea,routing,el('div',{class:'agent-input-wrap'},list,input),fileInput,el('div',{class:'agent-composer-tools'},addFiles,modelSelect,refreshModels),el('div',{class:'actions'},send,pause,el('small',{},'Enter send · Shift+Enter newline')),feedback);
  const contextDetails=el('details',{},el('summary',{},'Context details'),el('div',{class:'agent-context-preview'}));
  const header=el('header',{class:'agent-message-header'},el('strong',{},'Agent Message'),el('div',{class:'actions'},iconButton('Collapse Agent Message','panel-right-close',()=>setMode('collapsed')),iconButton('Close Agent Message','x',()=>setMode('closed'))));
  const guideURL=new URL('../docs/AGENTIC_RESEARCH_GUIDE.html#agent-message',document.querySelector('script[src$="loader.js"]').src).href;
  const panel=el('aside',{id:'agent-message-panel',class:'agent-message-panel','aria-label':'Agent Message',hidden:true},header,el('div',{class:'agent-current'},agentName,status,task),el('section',{class:'agent-context'},el('small',{},'Context'),contextArea,contextDetails),quick,conversation,relatedArea,composer,el('details',{class:'agent-message-options'},el('summary',{},'Options & shortcuts'),el('p',{},'Ctrl/⌘ K commands · @ agent · # context · Esc dismiss'),button('Clear conversation',()=>{const target=ctx.store.target(ctx.targetId);if(ctx.agentBusy||ctx.agentMessageBusy){feedback.textContent='Wait for the current analysis or pause it.';return;}if(target&&confirm('Clear this target’s conversation? Export a backup first if needed.')){AgentMessageService.clear(ctx.store,target);sync();}}),el('a',{href:guideURL,target:'_blank',rel:'noopener'},'Message guide')));
  const overlay=el('div',{class:'agent-message-overlay',hidden:true,onclick:()=>setMode('collapsed')});document.body.append(overlay,launcher,panel);
  function currentTarget(){return ctx.store.target(ctx.targetId);}
  function chatAgentName(id){return id==='general'?'General':agentStages.find(s=>s[0]===id)?.[1]||id||'General';}
  function updateModels(){
    const key=aiConnection.provider+':'+aiConnection.models.join(',');if(key===modelKey)return;modelKey=key;
    let previous=modelSelect.value;try{previous||=localStorage.getItem('research-chat-model:'+aiConnection.provider)||'';}catch{}
    modelSelect.replaceChildren(...aiConnection.models.map(id=>el('option',{value:id},id)));
    modelSelect.value=aiConnection.models.includes(previous)?previous:aiConnection.model;
  }
  async function loadModels(){
    if(modelsLoading||ctx.agentMessageBusy||ctx.agentBusy)return;modelsLoading=true;refreshModels.disabled=true;const origin=aiConnection.baseURL,provider=aiConnection.provider;
    feedback.textContent='Loading models from '+provider+'…';
    try{const result=await agentPost('/api/agent/models',{},15000);if(origin!==aiConnection.baseURL||provider!==aiConnection.provider)return;
      if(!Array.isArray(result.models)||!result.models.length||result.models.some(id=>typeof id!=='string'||id.length>180))throw new Error('Invalid catalog');
      aiConnection.models=result.models;updateModels();feedback.textContent=result.source+' · '+result.models.length+' models. Availability does not guarantee image/structured-output support.';
    }catch{feedback.textContent='Could not refresh models. Configured models remain available.';}finally{modelsLoading=false;refreshModels.disabled=false;sync();}
  }
  function renderAttachments(){
    fileArea.replaceChildren(...attachments.map(file=>el('div',{class:'agent-attachment'},el('div',{class:'record-header'},el('small',{},file.name+' · '+Math.ceil(file.size/1024)+' KB'),iconButton('Remove file '+file.name,'x',()=>{attachments=attachments.filter(row=>row.id!==file.id);renderAttachments();})),file.type==='text/plain'?el('details',{},el('summary',{},'Preview redacted text'),el('pre',{},file.text.slice(0,4000))):el('div',{},el('img',{src:'data:'+file.type+';base64,'+file.data,alt:file.name}),el('small',{},'Image sent as shown; check sensitive information.')))));
  }
  async function attachFiles(files){
    if(!files.length||readingFiles||ctx.agentMessageBusy||ctx.agentBusy||ctx.store.isReadOnly())return;
    const target=currentTarget();if(!target){feedback.textContent='Select a target before attaching files.';return;}
    if(files.length+attachments.length>3){feedback.textContent='Maximum three files per message.';return;}
    readingFiles=true;sync();feedback.textContent='Reading files…';
    try{const selected=await Promise.all(files.map(readMessageAttachment));if(currentTarget()!==target)return;
      const next=[...attachments,...selected];validateMessageAttachments(next);attachments=next;renderAttachments();feedback.textContent='Files ready. Text is redacted; images are sent as shown.';
    }catch(error){feedback.textContent=error.message||'Could not read the selected file.';}finally{fileInput.value='';readingFiles=false;sync();}
  }
  fileInput.addEventListener('change',()=>void attachFiles([...fileInput.files]));
  input.addEventListener('paste',event=>{const files=[...event.clipboardData?.files||[]];if(files.length){event.preventDefault();void attachFiles(files);}});
  composer.addEventListener('dragover',event=>{if([...event.dataTransfer.types].includes('Files')){event.preventDefault();composer.classList.add('dragging');}});
  composer.addEventListener('dragleave',()=>composer.classList.remove('dragging'));
  composer.addEventListener('drop',event=>{if(event.dataTransfer.files.length){event.preventDefault();composer.classList.remove('dragging');void attachFiles([...event.dataTransfer.files]);}});
  function openReview(){routeTo('review-queue');if(mobile.matches)setMode('collapsed');}
  function closeSuggestions(){list.hidden=true;input.setAttribute('aria-expanded','false');input.removeAttribute('aria-activedescendant');suggestions=[];completion=null;}
  function activeRefs(){const target=currentTarget();if(!target)return [];let explicit=[];try{explicit=parseMessageTags(input.value,target).contextRefs;}catch{}const refs=[...autoRefs.filter(r=>!removed.has(r.kind+':'+r.id)),...explicit];return refs.filter((r,i)=>refs.findIndex(v=>v.kind===r.kind&&v.id===r.id)===i).slice(0,12);}
  function updateContext(){
    const target=currentTarget(),refs=activeRefs(),all=messageReferenceRows(target);contextArea.replaceChildren(...refs.map(ref=>{const label=all.find(r=>r.kind===ref.kind&&r.id===ref.id)?.label||ref.id;const remove=iconButton('Remove '+ref.kind+' context','x',()=>{removed.add(ref.kind+':'+ref.id);const token='#'+ref.kind+':'+ref.id;input.value=input.value.split(token).join('').replace(new RegExp('#'+ref.kind+'(?=\\s|$)','g'),'').trim();updateContext();updateRelated();});return el('span',{class:'agent-context-chip'},el('span',{},ref.kind+' · '+label),remove);}));
    if(!refs.length)contextArea.append(el('small',{class:'muted'},'Target & page only. Add #reference.'));
    const box=contextDetails.querySelector('.agent-context-preview');box.replaceChildren(el('small',{},'Target: '+(target?.name||'None')+' · Page: '+(ctx.route||'dashboard')),refs.map(ref=>el('small',{},ref.kind+': '+(all.find(r=>r.kind===ref.kind&&r.id===ref.id)?.label||'Unknown')+' · '+ref.id)),el('small',{},'Selected records + linked test/hypothesis/evidence (max 4 each). Relevant knowledge; up to 4 recent messages. Scope rules always included. Secrets redacted.'));
    const kind=refs.findLast(r=>!['target','scope'].includes(r.kind))?.kind;
    const actions=messageActionSets[kind]||[['Explain','jelaskan context research saat ini'],['Next Step','apa next step manual yang paling relevan?']];
    quick.replaceChildren(...actions.map(([label,value])=>button(label,()=>{input.value=value;closeSuggestions();input.focus();updateContext();})),button('Related Terms',()=>{updateRelated(true);input.focus();}));
    try{const parsed=parseMessageTags(input.value,target),team=planMessageAgents({...parsed,text:input.value},refs);routing.textContent=(parsed.routing!=='mentions'&&['general','orchestrator'].includes(parsed.agent)?'Auto · ':'To · ')+team.map(chatAgentName).join(' + ');}catch{routing.textContent=target?'Type @ to choose agents · # to add context':'Select a target to chat';}
  }
  function updateRelated(force=false){
    const target=currentTarget();if(!target)return;
    const selected=input.value.slice(input.selectionStart,input.selectionEnd).trim(),tokens=input.value.trim().split(/\s+/),term=selected||tokens.at(-1)?.replace(/^[@#]/,'')||messageReferenceRows(target).find(r=>r.kind===activeRefs().at(-1)?.kind&&r.id===activeRefs().at(-1)?.id)?.label||'';
    const result=relatedService.search({term,target,workspace:ctx.store.get()});relatedArea.replaceChildren();
    if(!result.related.length){if(force)relatedArea.append(el('small',{class:'muted'},'No local match. Select a term or ask @domain for semantic analysis.'));return;}
    relatedArea.append(el('small',{},'Related · local lookup'),el('div',{class:'agent-tags'},result.related.map(row=>{const token=row.reference?'#'+row.reference.kind+':'+row.reference.id:'#'+row.term.toLowerCase().replace(/[^\p{L}\p{N}]+/gu,'-');const action=button(row.term,()=>{input.value=input.value.trim()+' '+token+' ';input.focus();updateContext();},'agent-tag');action.title=row.source+' · local similarity '+row.score.toFixed(2);return action;})));
  }
  function completeSuggestions(){
    closeSuggestions();const target=currentTarget();if(!target)return;
    const prefix=input.value.slice(0,input.selectionStart),match=prefix.match(/(?:^|\s)([@#])([^\s]*)$/);if(!match)return;
    const [,type,query]=match,needle=query.toLowerCase();completion={start:prefix.length-query.length-1,end:input.selectionStart};
    suggestions=type==='@'?messageAgents.filter(([alias,name])=>(alias+' '+name).toLowerCase().includes(needle)).map(([alias,name])=>({token:'@'+alias,label:'@'+alias+' · '+name})):messageReferenceRows(target).filter(r=>(r.kind+':'+r.id+' '+r.label).toLowerCase().includes(needle)).map(r=>({token:'#'+r.kind+':'+r.id,label:'#'+r.kind+' · '+r.label}));
    suggestions=suggestions.slice(0,type==='@'?messageAgents.length:20);suggestionIndex=0;drawSuggestions();
  }
  function drawSuggestions(){
    if(!suggestions.length){closeSuggestions();return;}
    list.replaceChildren(...suggestions.map((row,index)=>el('div',{id:'agent-suggestion-'+index,role:'option','aria-selected':index===suggestionIndex?'true':'false',onmousedown:event=>event.preventDefault(),onclick:()=>chooseSuggestion(index)},el('span',{},row.label),row.token.startsWith('@')?el('small',{},messageAgentDomains[row.token.slice(1)]):null)));
    list.hidden=false;input.setAttribute('aria-expanded','true');input.setAttribute('aria-activedescendant','agent-suggestion-'+suggestionIndex);
    list.children[suggestionIndex]?.scrollIntoView({block:'nearest'});
  }
  function chooseSuggestion(index){if(!completion)return;input.setRangeText(suggestions[index].token+' ',completion.start,completion.end,'end');closeSuggestions();input.focus();updateContext();updateRelated();}
  input.addEventListener('input',()=>{clearTimeout(timer);completeSuggestions();updateContext();timer=setTimeout(()=>updateRelated(),150);});
  input.addEventListener('keydown',event=>{
    if(event.isComposing)return;
    if((event.ctrlKey||event.metaKey)&&event.key==='Enter'){event.preventDefault();void sendMessage();return;}
    if(!list.hidden&&['ArrowDown','ArrowUp','Enter','Escape'].includes(event.key)){event.preventDefault();event.stopPropagation();if(event.key==='Escape')closeSuggestions();else if(event.key==='Enter')chooseSuggestion(suggestionIndex);else{suggestionIndex=(suggestionIndex+(event.key==='ArrowDown'?1:-1)+suggestions.length)%suggestions.length;drawSuggestions();}}
    else if(event.key==='Enter'&&!event.shiftKey){event.preventDefault();void sendMessage();}
  });
  function renderMessages(){
    const target=currentTarget(),messages=AgentMessageService.list(target);if(!messages.length)historyOffset=0;
    const end=Math.max(0,messages.length-historyOffset),start=Math.max(0,end-20),key=target?.id+':'+messages.length+':'+historyOffset+':'+messages.at(-1)?.id+':'+target?.agentResearch.revision+':'+ctx.agentMessageBusy?.agentId+':'+paused;
    if(key===conversationKey)return;conversationKey=key;
    const bottom=conversation.scrollHeight-conversation.scrollTop-conversation.clientHeight<80;conversation.replaceChildren();
    if(start>0)conversation.append(button('Earlier messages ('+start+')',()=>{historyOffset+=20;conversationKey='';renderMessages();}));
    if(!messages.length)conversation.append(el('p',{class:'muted'},'Ask about a selected record. Analysis stays here; proposals go to Review Queue.'));
    for(const row of messages.slice(start,end)){
      const answer=row.answer,name=row.sender==='researcher'?'You':chatAgentName(row.agent),card=el('article',{class:'agent-message '+(row.sender==='researcher'?'agent-question':'agent-answer'),'data-agent':row.agent,'data-run':row.runId||''},el('div',{class:'agent-bubble-header'},el('span',{class:'agent-avatar','aria-hidden':'true'},name.split(/\s+/).map(word=>word[0]).slice(0,2).join('')),el('strong',{},name),el('time',{datetime:row.timestamp},new Date(row.timestamp).toLocaleTimeString([],{hour:'2-digit',minute:'2-digit'}))));
      if(row.model)card.append(el('small',{class:'agent-bubble-model'},row.model));
      if(row.sender==='researcher'&&row.members?.length)card.append(el('small',{class:'agent-bubble-model'},'To '+row.members.map(chatAgentName).join(' + ')));
      if(answer){card.append(el('p',{class:'agent-answer-summary'},answer.finding));
        if(row.proposalIds?.length){const pending=row.proposalIds.filter(id=>target.agentResearch.reviewQueue.some(p=>p.id===id&&p.status==='PROPOSED'&&!p.stale));card.append(button(pending.length?'Review ('+pending.length+')':'View review',openReview,pending.length?'primary':''));}
        if(answer.details)card.append(el('details',{},el('summary',{},'Expand analysis'),el('small',{class:'agent-priority'},answer.priority),el('p',{class:'agent-expanded'},answer.details),el('dl',{},el('dt',{},'Reason'),el('dd',{},answer.reason),el('dt',{},'Evidence'),el('dd',{},answer.evidenceIds.length?answer.evidenceIds.map(id=>button(messageReferenceRows(target).find(r=>r.kind==='evidence'&&r.id===id)?.label||id,()=>select({kind:'evidence',id}))):'Not supplied / insufficient'),el('dt',{},'Risk'),el('dd',{},answer.risk),el('dt',{},'Next'),el('dd',{},answer.nextStep))));
        const tags=[...new Set(answer.details.match(/#[a-z][\w-]{1,30}/gi)||[])].slice(0,4);if(tags.length)card.append(el('div',{class:'agent-tags'},tags.map(tag=>button(tag,()=>{input.value=input.value.trim()+' '+tag+' ';input.focus();updateContext();},'agent-tag'))));
      }else card.append(el('p',{},row.message));
      if(row.attachments?.length)card.append(el('div',{class:'agent-message-files'},row.attachments.map(file=>el('details',{},el('summary',{},'+ '+file.name+' · '+Math.ceil(file.size/1024)+' KB'),el('pre',{},file.preview)))));
      if(['error','paused'].includes(row.status)&&row.sender==='agent')card.append(button('Retry',()=>{const question=messages.findLast(m=>m.sender==='researcher'&&(!row.runId||m.runId===row.runId)),retryModel=question?.model||row.model||lastModel;input.value=question?.message||lastDraft;attachments=question?.runId&&question.runId===lastRunId?[...lastFiles]:[];if(aiConnection.models.includes(retryModel))modelSelect.value=retryModel;renderAttachments();if(question?.attachments?.length&&!attachments.length)feedback.textContent='Reattach the original files before retrying; conversation stores previews only.';input.focus();updateContext();}));
      const detail=el('details',{},el('summary',{},'View details'),el('small',{},new Date(row.timestamp).toLocaleString()),el('small',{},row.contextRefs.map(r=>'#'+r.kind+':'+r.id).join(' ')||'Target/page context'));card.append(detail);conversation.append(card);
    }
    if(historyOffset>0)conversation.append(button('Newer messages',()=>{historyOffset=Math.max(0,historyOffset-20);conversationKey='';renderMessages();}));
    if(ctx.agentMessageBusy&&target&&ctx.agentMessageBusy.targetId===target.id&&!historyOffset)conversation.append(el('div',{class:'agent-thinking',role:'status'},chatAgentName(ctx.agentMessageBusy.agentId)+(paused?' · Paused':' is responding…')));
    if(bottom)conversation.scrollTop=conversation.scrollHeight;
  }
  function cancelMessage(reason){
    if(!ctx.agentMessageBusy)return;paused=true;controller?.abort();void agentPost('/api/agent/pause',{runId:ctx.agentMessageBusy.runId}).catch(()=>{});feedback.textContent=reason;
  }
  async function sendMessage(){
    if(ctx.store.isReadOnly()||readingFiles||modelsLoading)return;
    const target=currentTarget();if(!target||!enabled||ctx.agentBusy||ctx.agentMessageBusy||!input.value.trim()){feedback.textContent=ctx.agentBusy||ctx.agentMessageBusy?'An analysis is already running.':'Select a target and enter a message.';return;}
    if(!aiConnection.agentic.configured){feedback.textContent='Provider not configured. Local lookup and manual research remain available.';return;}
    let parsed,selected;
    try{parsed=parseMessageTags(input.value,target);selected=builder.build({workspace:ctx.store.get(),target,page:ctx.route,contextRefs:activeRefs(),message:input.value,recentMessages:AgentMessageService.list(target),summary:target.agentResearch.conversationSummary?.text||''});}catch(error){feedback.textContent=error.message;return;}
    const text=SecretRedactor.redact(input.value.trim()),refs=activeRefs(),revision=target.researchRevision,runId=uuid(),team=planMessageAgents({...parsed,text},refs),agentId=team[0],model=modelSelect.value||aiConnection.model,files=[...attachments],originalTarget=target;
    try{validateMessageAttachments(files);}catch(error){feedback.textContent=error.message;return;}
    if(AgentMessageService.list(target).length>999-team.length){feedback.textContent='Conversation full. Export and Clear conversation before sending.';return;}
    historyOffset=0;try{AgentMessageService.append(ctx.store,target,{sender:'researcher',agent:agentId,runId,model,members:team,attachments:files.map(attachmentMetadata),message:text,contextRefs:refs,tags:parsed.tags});}catch(error){feedback.textContent=error.message;return;}
    lastDraft=text;lastFiles=files;lastModel=model;lastRunId=runId;attachments=[];renderAttachments();input.value='';relatedArea.replaceChildren();closeSuggestions();lastError='';paused=false;controller=new AbortController();ctx.agentMessageBusy={runId,targetId:target.id,revision,agentId};sync();feedback.textContent='Team · '+team.map(chatAgentName).join(' + ');
    let polling=false;progressTimer=setInterval(async()=>{if(polling||!ctx.agentMessageBusy||paused)return;polling=true;try{const progress=await agentPost('/api/agent/status',{runId},5000);if(ctx.agentMessageBusy?.runId===runId&&progress.research?.currentStage){ctx.agentMessageBusy.agentId=progress.research.currentStage;sync();}}catch{}finally{polling=false;}},1200);
    const unsubscribe=ctx.store.subscribe(()=>{const live=ctx.store.target(target.id);if(!live||live!==originalTarget||live.researchRevision!==revision||ctx.targetId!==target.id)cancelMessage('Context changed; analysis cancelled.');});
    try{
      const result=await agentPost('/api/agent/message',{runId,context:selected.context,message:{text,agent:parsed.agent,...(parsed.agents?{agents:parsed.agents}:{}),...(parsed.routing?{routing:parsed.routing}:{}),model,attachments:files,contextRefs:refs,tags:parsed.tags},inventory:ctx.store.get().toolInventory,privacyMode:aiConnection.privacyMode,memory:selected.memory,researchState:selected.researchState},260000,controller.signal);
      const live=ctx.store.target(target.id);if(paused||controller.signal.aborted||live!==target||live.researchRevision!==revision||ctx.targetId!==target.id)return;
      const replies=result.replies||[result],research=structuredClone(live.agentResearch);research.reviewQueue.push(...result.proposals);research.history.push(...replies.map(reply=>reply.history));research.runs.push(result.run);research.revision++;
      if(result.proposals.length){research.state='WAITING_REVIEW';research.reason='Agent message proposals need researcher review.';}
      ctx.store.updateResearch(live.id,research);
      for(const reply of replies)AgentMessageService.append(ctx.store,live,{sender:'agent',agent:reply.agentId,runId,model:reply.model||model,message:reply.answer.finding,answer:reply.answer,status:reply.status==='ERROR'?'error':reply.status==='PAUSED'?'paused':'completed',contextRefs:refs,tags:parsed.tags,proposalIds:reply.proposals.map(p=>p.id)});
      lastError=result.status==='ERROR'?replies.find(reply=>reply.status==='ERROR')?.answer.finding||'Analysis failed.':'';feedback.textContent=result.status==='PAUSED'?replies.at(-1).answer.finding:result.proposals.length?'Needs your review.':replies.at(-1).answer.nextStep;
    }catch{void agentPost('/api/agent/pause',{runId}).catch(()=>{});lastError=paused?'':'Analysis failed. Retry after checking provider settings.';const live=ctx.store.target(target.id);if(live===target&&live.researchRevision===revision)AgentMessageService.append(ctx.store,live,{sender:'agent',agent:agentId,runId,model,message:paused?'Analysis paused.':lastError,status:paused?'paused':'error',contextRefs:refs,tags:parsed.tags});feedback.textContent=paused?'Paused. You can continue manual research.':lastError;}
    finally{clearInterval(progressTimer);unsubscribe();ctx.agentMessageBusy=null;controller=null;sync();}
  }
  function drawerState(){
    const modal=enabled&&mode==='open'&&mobile.matches;overlay.hidden=!modal;document.body.classList.toggle('agent-drawer-open',modal);
    for(const node of document.querySelectorAll('.sidebar,.main-shell'))node.inert=modal;
    if(modal){panel.setAttribute('role','dialog');panel.setAttribute('aria-modal','true');}else{panel.removeAttribute('role');panel.removeAttribute('aria-modal');}
  }
  function setMode(next){const hadFocus=panel.contains(document.activeElement);mode=next;try{localStorage.setItem('research-agent-panel',mode);}catch{}closeSuggestions();sync();if(mode==='open')input.focus();else if(hadFocus)launcher.focus();}
  function select(ref){ctx.agentSelection={...ref,targetId:ctx.targetId,page:ctx.route};removed.clear();fingerprint='';setMode('open');}
  function sync(){
    enabled=aiConnection.enabled&&aiConnection.agentic.enabled;
    document.body.classList.toggle('agent-messages-enabled',enabled);document.body.classList.toggle('agent-panel-open',enabled&&mode==='open');document.body.classList.toggle('agent-panel-closed',enabled&&mode==='closed');
    launcher.hidden=!enabled||mode==='open';launcher.setAttribute('aria-expanded',String(enabled&&mode==='open'));panel.hidden=!enabled||mode!=='open';drawerState();if(!enabled){cancelMessage('Agentic disabled.');return;}
    const target=currentTarget();if(targetKey!==ctx.targetId){if(ctx.agentMessageBusy)cancelMessage('Target changed; analysis cancelled.');targetKey=ctx.targetId;input.value='';attachments=[];lastFiles=[];lastDraft='';lastModel='';lastRunId='';renderAttachments();relatedArea.replaceChildren();historyOffset=0;removed.clear();lastError='';feedback.textContent='';fingerprint='';closeSuggestions();}
    const selection=ctx.agentSelection?.targetId===ctx.targetId&&ctx.agentSelection.page===ctx.route?ctx.agentSelection:null,kind=pageContextKinds[ctx.route],candidates=messageReferenceRows(target).filter(r=>r.kind===kind);
    const auto=selection&&messageReferenceRows(target).some(r=>r.kind===selection.kind&&r.id===selection.id)?selection:ctx.route==='reports'&&ctx.reportFindingId?{kind:'report',id:ctx.reportFindingId}:candidates.length===1?candidates[0]:null;
    const nextFingerprint=ctx.targetId+':'+ctx.route+':'+auto?.kind+':'+auto?.id;
    if(fingerprint!==nextFingerprint){if(fingerprint&&ctx.agentMessageBusy)cancelMessage('Selected page/context changed; analysis cancelled.');fingerprint=nextFingerprint;removed.clear();autoRefs=auto?[{kind:auto.kind,id:auto.id}]:target?[{kind:'target',id:target.id}]:[];closeSuggestions();}
    const research=target?.agentResearch,lastMessage=AgentMessageService.list(target).findLast(m=>m.sender==='agent'),busy=ctx.agentMessageBusy||ctx.agentBusy,currentId=ctx.agentMessageBusy?.agentId||ctx.agentPreview?.currentStage||lastMessage?.agent||research?.currentStage;
    const waiting=research?.pendingActions.some(a=>a.status==='PROPOSED')?'Waiting Approval':research?.reviewQueue.some(p=>p.status==='PROPOSED'&&!p.stale)?'Waiting Review':'';
    agentName.textContent=chatAgentName(currentId);task.textContent=busy?'Analyzing selected research context':!waiting&&lastMessage?.proposalIds?.length?'Review complete. Continue manual research or ask a follow-up.':lastMessage?.answer?.nextStep||research?.currentTask||'General + specialists · Ask or mention an agent';status.textContent=busy?(paused?'Paused':ctx.agentMessageBusy?'Thinking':'Researching'):lastError||lastMessage?.status==='error'?'Error':waiting||({completed:'Completed',paused:'Paused'})[lastMessage?.status]||panelStatusLabels[research?.state]||'Idle';
    updateModels();send.disabled=!!busy||!target||readingFiles||modelsLoading||ctx.store.isReadOnly()||!aiConnection.agentic.configured;pause.hidden=!ctx.agentMessageBusy;
    addFiles.disabled=!!busy||!target||readingFiles||ctx.store.isReadOnly();modelSelect.disabled=!!busy||modelsLoading||!aiConnection.agentic.configured;refreshModels.disabled=!!busy||modelsLoading||!aiConnection.agentic.configured;
    updateContext();renderMessages();
    if(!aiConnection.agentic.configured)feedback.textContent='Provider not configured. Local lookup and manual research are available.';
  }
  function commandPalette(){
    if(!enabled||document.querySelector('dialog[open]'))return;
    const query=el('input',{type:'search','aria-label':'Search agent commands',placeholder:'Agent or workspace record…'}),results=el('div',{class:'agent-command-results'}),close=iconButton('Close commands','x',()=>dialog.close()),dialog=el('dialog',{class:'agent-command-palette','aria-label':'Agent commands'},el('div',{class:'record-header'},el('h2',{},'Research commands'),close),query,results),previous=document.activeElement;
    const all=[{label:'Open Agent Message',run:()=>setMode('open')},{label:'Review Queue',run:openReview},...messageAgents.map(([alias,name])=>({label:'@'+alias+' · '+name,run:()=>{setMode('open');input.value='@'+alias+' ';input.focus();}})),...messageReferenceRows(currentTarget()).map(ref=>({label:'#'+ref.kind+' · '+ref.label,run:()=>select(ref)}))];
    const draw=()=>{results.replaceChildren(...all.filter(row=>row.label.toLowerCase().includes(query.value.toLowerCase())).slice(0,10).map(row=>button(row.label,()=>{dialog.close();row.run();})));};
    query.addEventListener('input',draw);query.addEventListener('keydown',event=>{if(event.key==='ArrowDown'){event.preventDefault();results.querySelector('button')?.focus();}if(event.key==='Enter'){event.preventDefault();results.querySelector('button')?.click();}});results.addEventListener('keydown',event=>{if(['ArrowDown','ArrowUp'].includes(event.key)){event.preventDefault();const rows=[...results.querySelectorAll('button')],index=rows.indexOf(document.activeElement);rows[(index+(event.key==='ArrowDown'?1:-1)+rows.length)%rows.length]?.focus();}});
    dialog.addEventListener('close',()=>{dialog.remove();if(document.activeElement===document.body)previous?.focus();});document.body.append(dialog);draw();dialog.showModal();query.focus();
  }
  document.addEventListener('keydown',event=>{
    if(!enabled||document.querySelector('dialog[open]'))return;
    if((event.ctrlKey||event.metaKey)&&!event.altKey&&event.key.toLowerCase()==='k'&&!event.target.isContentEditable&&(!event.target.matches('input,textarea,select')||event.target===input)){event.preventDefault();commandPalette();return;}
    if(event.key==='Escape'&&mode==='open'){event.preventDefault();if(!list.hidden)closeSuggestions();else setMode('collapsed');}
    if(event.key==='Tab'&&mode==='open'&&mobile.matches){const nodes=[...panel.querySelectorAll('button,input,textarea,select,summary,a')].filter(n=>!n.disabled&&n.getClientRects().length),first=nodes[0],last=nodes.at(-1);if(event.shiftKey&&document.activeElement===first){event.preventDefault();last.focus();}else if(!event.shiftKey&&document.activeElement===last){event.preventDefault();first.focus();}}
  });
  mobile.addEventListener('change',drawerState);
  ctx.store.subscribe(()=>{if(enabled)sync();});
  return {sync,select,open:()=>setMode('open')};
}
