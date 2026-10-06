import {el,button,panel,badge,empty,uuid,now,download} from '../utils.js';
import {field,editDialog} from '../forms.js';
import {DomainPackRepository,TargetIntelligenceService,DomainKnowledgeService,BusinessFlowService,KnowledgeGraphService,TerminologyService,profileFields,createManualPack,researcherProvenance} from '../services/domain-knowledge.js';
import {validateDomainPack,validateKnowledgeItem} from '../services/domain-schema.js';
import {knowledgeOperations} from '../services/knowledge-schema.js';
import {buildKnowledgeContext} from '../services/knowledge-context.js';
import {aiConnection,requestKnowledge} from '../services/ai-client.js';
import {SecretRedactor} from '../services/redactor.js';
import {editHypothesis} from './hypotheses.js';
import {routeTo} from '../router.js';
export function knowledgeBadges(item){
  const names={researcher:'RESEARCHER INPUT · Researcher Provided',target:'TARGET FACT',domain:'DOMAIN KNOWLEDGE',ai:'AI INFERENCE · AI GENERATED',external:'External · belum menjadi target fact',unknown:'UNKNOWN'};
  return el('div',{class:'badges'},badge(names[item.sourceType]||'UNKNOWN'),item.verified?badge('Verified by researcher'):badge('Unverified'),badge('Confidence: '+Math.round((item.confidence||0)*100)+'%'),item.generatedBy==='ai'&&item.sourceType!=='ai'?badge('Origin: AI GENERATED'):null);
}
function knowledgeDetails(item){return [knowledgeBadges(item),el('p',{},item.content||item.definition||''),el('p',{class:'muted'},'Source: '+(item.source||'Unknown')),item.notes?el('p',{class:'muted'},item.notes):null];}
function saveIntelligence(ctx,target,values){TargetIntelligenceService.update(ctx.store,target,values);ctx.render();}
function finishDecision(ctx,target,suggestion,id,status){
  const intelligence=target.intelligence,decisions={...(suggestion.decisions||{}),[id]:status};
  const ids=[...suggestion.response.items,...suggestion.response.unknownInformation,...suggestion.response.suggestedDomains].map(i=>i.id);
  const settled=ids.every(i=>decisions[i]);const next={...suggestion,decisions,status:settled?(ids.some(i=>decisions[i]==='accepted')?'accepted':'rejected'):'pending'};
  TargetIntelligenceService.update(ctx.store,target,{suggestions:intelligence.suggestions.map(s=>s.id===suggestion.id?next:s)});ctx.render();
}
function reviewKnowledge(ctx,target,item,onAccepted){
  editDialog('Review Knowledge — '+item.sourceType,[['title','Title','required'],['content','Content','textarea'],['confidence','Confidence 0–1','number'],['notes','Review Notes','textarea']],item,values=>{
    const confidence=Number(values.confidence),modified=item.sourceType==='domain'&&(values.title!==item.title||values.content!==item.content);
    const reviewed={...item,...values,confidence,verified:false,...(modified?{sourceType:'researcher',source:'Researcher edit of '+item.source,notes:values.notes+' · Diadaptasi dari DOMAIN KNOWLEDGE; belum diverifikasi sebagai fakta target.'}:{})};validateKnowledgeItem(reviewed);
    TargetIntelligenceService.accept(ctx.store,target,reviewed);onAccepted?.();ctx.render();
  });
}
function manualKnowledge(ctx,target){
  const defaults={id:uuid(),kind:'company-overview',title:'',content:'',...researcherProvenance(),domainId:target.intelligence.primaryDomainId,flowId:'',invariantId:'',techniqueId:'',steps:[]};
  editDialog('Add Target Knowledge',[['kind','Kind','select',['company-overview','business-model','actor','object','asset','sensitive-data','flow','terminology','boundary','invariant','question','explanation','unknown']],['title','Title','required'],['content','Content','textarea'],['sourceType','Source Type','select',['researcher','target','external','unknown']],['source','Source / reference'],['confidence','Confidence 0–1','number'],['verification','Verified by researcher','select',[['no','Belum'],['yes','Ya — sudah diperiksa']]],['notes','Notes','textarea']],{...defaults,verification:'no'},values=>{
    const {verification,...fields}=values;const item={...defaults,...fields,confidence:Number(fields.confidence),verified:verification==='yes'};validateKnowledgeItem(item);TargetIntelligenceService.accept(ctx.store,target,item);ctx.render();
  });
}
function acceptedCard(ctx,target,item){
  const card=panel(item.title,...knowledgeDetails(item));
  if(item.steps?.length)card.append(el('pre',{class:'business-flow'},item.steps.join(' → ')));
  const pack=DomainPackRepository.get(ctx.store.get(),item.domainId);
  card.append(el('div',{class:'actions'},...itemActions(ctx,target,item,pack),button('Edit Knowledge',()=>editDialog('Edit Target Knowledge',[['title','Title','required'],['content','Content','textarea'],['notes','Notes','textarea']],item,values=>{const updated={...item,...values,verified:false,sourceType:item.sourceType==='target'?'researcher':item.sourceType,notes:values.notes+' · Isi diubah; verifikasi perlu ditinjau ulang.'};saveIntelligence(ctx,target,{items:target.intelligence.items.map(i=>i.id===item.id?updated:i)});})),button('Verify as Target Fact',()=>editDialog('Verify as Target Fact',[['source','Source / reference','required'],['notes','Verification Notes','textarea'],['confirmation','Saya sudah memverifikasi isi ini','select',[['no','Belum — jangan ubah menjadi fakta'],['yes','Ya — saya telah memeriksa sumber']]]],{source:item.sourceType==='ai'?'':item.source,notes:item.notes,confirmation:'no'},values=>{if(values.confirmation!=='yes')throw new Error('Konfirmasi verifikasi diperlukan.');saveIntelligence(ctx,target,{items:target.intelligence.items.map(i=>i.id===item.id?{...i,sourceType:'target',source:values.source,notes:values.notes,verified:true,verifiedAt:now()}:i)});})),button('Remove Knowledge',()=>{if(confirm('Hapus knowledge ini? Referensi hypothesis lama tetap menjadi snapshot.')){TargetIntelligenceService.remove(ctx.store,target,item.id);ctx.render();}},'danger')));
  return card;
}
function importResearch(ctx,target,item,kind,domainRow){
  const provenance={sourceType:item.sourceType,source:item.source,confidence:item.confidence,verified:item.verified,notes:item.notes};
  const links={domainId:item.domainId,flowId:item.flowId,invariantId:item.invariantId,knowledgeItemId:item.originId||item.id,sourceType:item.sourceType};
  if(kind==='actor')editDialog('Review Actor Suggestion',[['name','Actor / Role','required'],['authority','Authority'],['notes','Notes','textarea']],{name:item.title,notes:item.content},values=>{ctx.store.upsert(target.id,'actors',{...values,knowledgeProvenance:provenance,knowledgeLinks:links});ctx.render();});
  if(kind==='object')editDialog('Review Object Suggestion',[['name','Object Name','required'],['type','Object Type','select',['Custom','Account','File','Project','Workspace','Token','Invitation','Approval','Invoice','Webhook','Job','API Resource']],['owner','Owner'],['tenant','Tenant'],['state','State'],['sensitivity','Sensitivity'],['notes','Notes','textarea']],{name:item.title,type:'Custom',notes:item.content},values=>{ctx.store.upsert(target.id,'objects',{...values,knowledgeProvenance:provenance,knowledgeLinks:links});ctx.render();});
  if(kind==='boundary')editDialog('Review Boundary Suggestion',[['from','From','required'],['to','To','required'],['channel','Channel'],['trust','Trust','select',['restricted','trusted','untrusted']],['authority','Authority'],['notes','Notes','textarea']],{from:domainRow?.fromComponent||'',to:domainRow?.toComponent||'',channel:domainRow?.channel||'',authority:domainRow?.authority||'',notes:item.content},values=>{ctx.store.upsert(target.id,'boundaries',{...values,knowledgeProvenance:provenance,knowledgeLinks:links});ctx.render();});
}
function itemActions(ctx,target,item,pack,row){
  if(!target)return [];
  const actions=[];
  if(['actor','object','boundary'].includes(item.kind))actions.push(button('Review / Import '+item.kind,()=>importResearch(ctx,target,item,item.kind,row)));
  if(['question','invariant'].includes(item.kind))actions.push(button('Convert to Hypothesis',()=>editHypothesis(ctx,target,null,KnowledgeGraphService.hypothesisDefaults(target,pack,item)),'primary'));
  if(item.kind==='flow')actions.push(button('Flow → Hypothesis',()=>editHypothesis(ctx,target,null,{...KnowledgeGraphService.hypothesisDefaults(target,pack,item),title:'Uji critical transition: '+item.title,potentialFailure:'Apa yang terjadi jika authority/state berubah antara langkah flow ini?',notes:'Review critical transition dan isi invariant sebelum test. Sumber flow: '+item.sourceType+' · '+item.source}),'primary'));
  return actions;
}
function domainCard(ctx,target,pack,row,kind){
  const item=DomainKnowledgeService.asItem(row,kind,pack);
  return panel(row.title,...knowledgeDetails(item),el('div',{class:'actions'},target?button('Review / Save Knowledge',()=>reviewKnowledge(ctx,target,item)):null,...itemActions(ctx,target,item,pack,row)));
}
function profilePanel(ctx,target){
  const intelligence=target.intelligence,profile=intelligence.profile;
  const edit=()=>editDialog('Edit Target Intelligence Profile',profileFields.map(([key,label])=>[key,label,'textarea']),Object.fromEntries(profileFields.map(([key])=>[key,profile[key]?.value||''])),values=>{TargetIntelligenceService.saveProfile(ctx.store,target,values);ctx.render();});
  const body=panel('Company Overview',el('p',{class:'muted'},'Nilai kosong tetap Unknown. Edit profil menghasilkan RESEARCHER INPUT, bukan fakta perusahaan terverifikasi.'),button('Edit Intelligence Profile',edit,'primary'),button('+ Add Target Knowledge',()=>manualKnowledge(ctx,target)));
  for(const key of ['company','businessModel','products','users']){const value=profile[key],label=profileFields.find(f=>f[0]===key)[1];body.append(el('div',{class:'record'},el('strong',{},label),el('p',{},value?.value||'Unknown'),value?knowledgeBadges(value):badge('UNKNOWN')));}
  const details=el('div',{class:'intelligence-profile'});
  for(const [key,label] of profileFields){const value=profile[key];details.append(el('div',{class:'record'},el('h3',{},label),el('p',{},value?.value||'Unknown'),value?knowledgeBadges(value):badge('UNKNOWN')));}
  body.append(el('details',{},el('summary',{},'View Profile Fields (16)'),details));return body;
}
function classificationPanel(ctx,target,packs){
  const intelligence=target.intelligence,form=el('form',{class:'form-grid'});
  field(form,['primaryDomain','Primary Sector','select',[['','Unknown — belum diklasifikasikan'],...packs.map(p=>[p.id,p.name])]],intelligence.primaryDomainId);
  const secondary=el('fieldset',{class:'wide'},el('legend',{},'Secondary Domains — pilih lebih dari satu bila relevan'));
  for(const pack of packs){const check=el('input',{type:'checkbox',name:'secondary',value:pack.id});check.checked=intelligence.secondaryDomainIds.includes(pack.id);secondary.append(el('label',{class:'actions'},check,pack.name));}
  form.append(secondary,el('button',{type:'submit',class:'primary wide'},'Save Domain Classification'));
  form.addEventListener('submit',event=>{event.preventDefault();const primary=form.elements.primaryDomain.value,secondaries=[...secondary.querySelectorAll('input:checked')].map(i=>i.value).filter(id=>id!==primary);saveIntelligence(ctx,target,{primaryDomainId:primary,secondaryDomainIds:secondaries,classificationProvenance:researcherProvenance()});});
  return panel('Primary Sector & Secondary Domains',el('p',{class:'muted'},'Classification dipilih peneliti. Domain pack menggambarkan pola bisnis umum, bukan arsitektur aktual target.'),form);
}
function techniquePanel(ctx,target,pack,flowId=''){
  const body=panel('Domain → Technique Mapping',el('p',{class:'muted'},'Research Priority adalah prioritas riset, bukan vulnerability severity. Teknik dipakai hanya jika relevan dan diotorisasi.'));
  for(const mapping of DomainKnowledgeService.techniques(target,pack,flowId)){
    const invariant=pack.securityInvariants.find(i=>i.id===mapping.invariantId),flow=pack.businessFlows.find(f=>f.id===mapping.flowId);
    body.append(el('div',{class:'record'},el('h3',{},mapping.technique?.name||mapping.techniqueId),badge('Research Priority '+mapping.researchPriority+'/100'),el('p',{},mapping.content),el('p',{class:'muted'},'Related Flow: '+(flow?.title||'Unknown')),el('p',{},'Invariant: '+(invariant?.content||'Unknown')),knowledgeBadges(mapping),target&&invariant?button('Create Mapped Hypothesis',()=>{const item=DomainKnowledgeService.asItem(invariant,'invariant',pack);item.techniqueId=mapping.techniqueId;editHypothesis(ctx,target,null,KnowledgeGraphService.hypothesisDefaults(target,pack,item));}):null));
  }
  if(!pack.relevantTechniques.length)body.append(empty('Belum ada mapping. Tambahkan mapping pada Domain Knowledge.'));
  return body;
}
function flowCard(ctx,target,pack,flow){
  const section=panel(flow.title,...knowledgeDetails(flow),el('pre',{class:'business-flow'},flow.steps.join(' → ')));
  const graphNames=new Map([[pack.id,pack.name],...pack.actors.map(i=>[i.id,i.title]),...pack.businessObjects.map(i=>[i.id,i.title]),...pack.commonTrustBoundaries.map(i=>[i.id,i.title]),...pack.securityInvariants.map(i=>[i.id,i.title]),[flow.id,flow.title]]);
  section.append(el('details',{},el('summary',{},'Knowledge relationships'),el('ul',{},KnowledgeGraphService.edges(pack).filter(e=>e.from===flow.id||e.to===flow.id).map(e=>el('li',{},(graphNames.get(e.from)||e.from)+' → '+e.type+' → '+(graphNames.get(e.to)||e.to))))));
  const transition=el('select',{'aria-label':'Critical Transition '+flow.id},flow.transitions.map(t=>el('option',{value:t.id},(t.critical?'CRITICAL · ':'')+t.action)));
  transition.value=flow.transitions.find(t=>t.critical)?.id||flow.transitions[0]?.id||'';
  section.append(el('label',{},'Transition untuk review ',transition));
  section.append(el('div',{class:'actions'},button('Mark / Unmark Critical',()=>{const next=structuredClone(pack),updated=next.businessFlows.find(f=>f.id===flow.id),selected=updated.transitions.find(t=>t.id===transition.value);if(!selected)return;selected.critical=!selected.critical;Object.assign(updated,researcherProvenance(),{source:'Researcher transition classification; original source: '+flow.source});DomainPackRepository.save(ctx.store,next);ctx.render();}),button('Edit Flow Relationships',()=>editFlowRelations(ctx,pack,flow)),target?button('Review / Save Business Flow',()=>reviewKnowledge(ctx,target,DomainKnowledgeService.asItem(flow,'flow',pack))):null,target?button('Flow → Invariant → Question',()=>{
    const candidates=BusinessFlowService.researchCandidates(pack,flow,transition.value);
    if(!candidates.question){ctx.toast('Hubungkan invariant ke flow/transition dahulu lewat Edit Flow Relationships.');return;}
    reviewKnowledge(ctx,target,candidates.question);
  },'primary'):null,target?button('Flow → Hypothesis',()=>{const c=BusinessFlowService.researchCandidates(pack,flow,transition.value);if(!c.question){ctx.toast('Hubungkan invariant ke flow dahulu.');return;}editHypothesis(ctx,target,null,{...KnowledgeGraphService.hypothesisDefaults(target,pack,c.question),what:c.transition?.action||''});}):null));
  return section;
}
function editFlowRelations(ctx,pack,flow){
  editDialog('Edit Business Flow Relationships',[['title','Title','required'],['stepsText','Flow steps (satu per baris)','textarea']],{title:flow.title,stepsText:flow.steps.join('\n')},values=>{
    const next=structuredClone(pack),updated=next.businessFlows.find(f=>f.id===flow.id),steps=values.stepsText.split('\n').map(s=>s.trim()).filter(Boolean);
    if(steps.length<2)throw new Error('Flow membutuhkan minimal dua langkah.');
    updated.title=values.title;updated.steps=steps;
    for(const [key,collection] of [['actorIds','actors'],['objectIds','businessObjects'],['boundaryIds','commonTrustBoundaries'],['invariantIds','securityInvariants']])updated[key]=next[collection].filter(row=>values['rel:'+row.id]==='on').map(row=>row.id);
    updated.transitions=steps.slice(1).map((step,i)=>{const original=flow.transitions.find(t=>t.fromState===steps[i]&&t.toState===step);return {id:original?.id||updated.id+'-transition-'+uuid(),fromState:steps[i],toState:step,action:steps[i]+' → '+step,critical:original?.critical||false,invariantIds:[...updated.invariantIds]};});
    if(JSON.stringify(updated)!==JSON.stringify(flow))Object.assign(updated,researcherProvenance(),{source:'Researcher flow edit; original source: '+flow.source,notes:'Flow/relationships diubah peneliti; bukan fakta target terverifikasi.'});
    DomainPackRepository.save(ctx.store,next);ctx.render();
  },form=>{for(const [key,collection] of [['actorIds','actors'],['objectIds','businessObjects'],['boundaryIds','commonTrustBoundaries'],['invariantIds','securityInvariants']]){const group=el('fieldset',{class:'wide'},el('legend',{},collection));for(const row of pack[collection]){const input=el('input',{type:'checkbox',name:'rel:'+row.id});input.checked=flow[key].includes(row.id);group.append(el('label',{class:'actions'},input,row.title));}form.append(group);}});
}
function editPack(ctx,previous){
  if(previous){editDialog('Edit Domain Pack JSON',[['json','Pack JSON — preserves relationships','textarea']],{json:JSON.stringify(previous,null,2)},values=>{DomainPackRepository.import(ctx.store,values.json);ctx.render();});return;}
  const fields=[['name','Name','required'],['description','Description','textarea'],['conceptsText','Core Concepts (satu per baris)','textarea'],['termsText','Terminology: term | definition | whyImportant | related,terms','textarea'],['actorsText','Actors (satu per baris)','textarea'],['objectsText','Objects (satu per baris)','textarea'],['flowsText','Business Flows (satu flow per baris, pisahkan langkah dengan →)','textarea'],['sensitiveText','Sensitive Data (satu per baris)','textarea'],['assetsText','Critical Assets (satu per baris)','textarea'],['invariantsText','Security Invariants (satu per baris)','textarea'],['patternsText','Research Patterns (satu per baris)','textarea'],['notes','Notes','textarea']];
  editDialog('Custom Domain Knowledge Pack',fields,{},values=>{const pack=createManualPack(values);DomainPackRepository.save(ctx.store,pack);ctx.domainId=pack.id;ctx.render();});
}
function addMapping(ctx,target,pack){
  editDialog('Add Domain Technique Mapping',[['title','Title / Reason','required'],['content','Reason','textarea'],['techniqueId','Technique','select',target.techniques.map(t=>[t.libraryId||t.id,t.name])],['flowId','Related Business Flow','select',[['','Unknown'],...pack.businessFlows.map(f=>[f.id,f.title])]],['invariantId','Security Invariant','select',[['','Unknown'],...pack.securityInvariants.map(i=>[i.id,i.title])]],['researchPriority','Research Priority 0–100','number']],{researchPriority:50},values=>{const next=structuredClone(pack);next.relevantTechniques.push({...values,id:uuid(),researchPriority:Number(values.researchPriority),...researcherProvenance()});DomainPackRepository.save(ctx.store,next);ctx.render();});
}
function packControls(ctx,target,pack){
  const file=el('input',{type:'file',accept:'.json,application/json',hidden:true});
  file.addEventListener('change',async()=>{const picked=file.files[0];if(!picked)return;try{if(picked.size>1000000)throw new Error('Domain pack maksimal 1 MB.');const data=JSON.parse(await picked.text());validateDomainPack(data);if(DomainPackRepository.get(ctx.store.get(),data.id)&&!confirm('Ganti override domain pack '+data.name+'? Backup workspace dahulu.'))return;DomainPackRepository.save(ctx.store,data);ctx.domainId=data.id;ctx.render();}catch(error){ctx.toast('Domain import ditolak: '+error.message);}});
  return el('div',{class:'actions knowledge-controls'},button('Browse Full Pack',()=>{ctx.domainLearning=false;ctx.render();}),button('+ Custom Domain Pack',()=>editPack(ctx),'primary'),button('Edit Pack JSON',()=>editPack(ctx,pack)),button('Export Domain Pack',()=>download(pack.id+'.json',JSON.stringify(pack,null,2),'application/json')),button('Import Domain Pack',()=>file.click()),target?button('+ Technique Mapping',()=>addMapping(ctx,target,pack)):null,ctx.store.get().domainPacks.some(p=>p.id===pack.id)?button('Remove Custom / Restore Default',()=>{if(confirm('Hapus custom/override pack ini? Knowledge dan snapshot riset yang sudah diimpor tetap tersedia.')){ctx.store.removeDomainPack(pack.id);ctx.domainId='';ctx.render();}},'danger'):null,file);
}
function renderLearning(ctx,target,pack){
  const root=el('div'),level=ctx.domainLevel||'Beginner';
  const select=el('select',{'aria-label':'Learning Depth'},['Beginner','Intermediate','Advanced'].map(l=>el('option',{value:l},l)));select.value=level;select.addEventListener('change',()=>{ctx.domainLevel=select.value;ctx.render();});
  root.append(panel('Learn This Domain — '+pack.name,select,el('p',{class:'muted'},'Materi berikut adalah DOMAIN KNOWLEDGE. Gunakan kartu ringkas sebelum membuka daftar lengkap.'),el('p',{},pack.description),el('ul',{},pack.coreConcepts.map(c=>el('li',{},c)))));
  const limit=level==='Beginner'?3:level==='Intermediate'?6:12;
  for(const term of pack.terminology.slice(0,limit))root.append(panel(term.term,knowledgeBadges(term),el('p',{},term.definition),el('p',{class:'muted'},term.whyImportant)));
  for(const flow of pack.businessFlows.slice(0,2))root.append(flowCard(ctx,target,pack,flow));
  if(level!=='Beginner'){
    root.append(panel('Typical Actors & Objects',el('p',{},pack.actors.map(a=>a.title).join(' · ')),el('p',{},pack.businessObjects.map(o=>o.title).join(' · '))),panel('Sensitive Data & Critical Operations',el('ul',{},pack.sensitiveData.map(s=>el('li',{},s.title+': '+s.content))),el('ul',{},pack.businessFlows.flatMap(f=>f.transitions.filter(t=>t.critical)).map(t=>el('li',{},t.action)))));
    for(const invariant of pack.securityInvariants.slice(0,limit))root.append(domainCard(ctx,target,pack,invariant,'invariant'));
  }
  if(level==='Advanced'){for(const pattern of pack.commonFailurePatterns)root.append(domainCard(ctx,target,pack,pattern,'explanation'));root.append(techniquePanel(ctx,target,pack));}
  root.append(el('div',{class:'actions'},button('See Full Terminology',()=>routeTo('terminology')),button('See Business Flows',()=>routeTo('business-flows')),button('See Research Questions',()=>routeTo('research-questions'))));
  return root;
}
function intelligenceAI(ctx,target,pack){
  const section=panel('AI Knowledge Assistant',ctx.help('knowledge-ai'));
  if(!aiConnection.enabled||!aiConnection.configured){section.append(el('p',{class:'muted'},'AI '+aiConnection.status+'. Profil, domain packs, learning, import suggestions dan konversi hypothesis tetap tersedia manual.'),button('AI Provider Settings',()=>routeTo('ai-provider')));return section;}
  const form=el('form',{class:'form-grid'});
  field(form,['knowledgeOperation','Operation','select',knowledgeOperations],ctx.knowledgeOperation||'generate_target_knowledge');
  field(form,['knowledgePrivacy','Privacy Mode','select',['LOCAL_ONLY','REDACTED_CLOUD','CLOUD']],aiConnection.privacyMode);
  field(form,['knowledgeQuestion','Question / Goal','textarea'],ctx.knowledgeQuestion||'');field(form,['knowledgeNotes','Researcher / Architecture Notes','textarea']);
  field(form,['knowledgeTerm','Selected Terminology','select',[['','Tidak memilih term'],...pack.terminology.map(t=>[t.term,t.term])]],ctx.knowledgeTerm||'');
  field(form,['knowledgeFlow','Selected Business Flow','select',[['','Ringkasan maksimal dua flow'],...pack.businessFlows.map(f=>[f.id,f.title])]],ctx.knowledgeFlow||'');
  field(form,['knowledgeHypothesis','Current Hypothesis','select',[['','Tidak menyertakan hypothesis'],...target.hypotheses.map(h=>[h.id,h.title])]]);
  const submit=el('button',{type:'submit',class:'primary wide'},ctx.knowledgeBusy?'Analysis sedang berjalan…':'Preview Knowledge Context');submit.disabled=!!ctx.knowledgeBusy;form.append(submit);
  form.addEventListener('submit',event=>{
    event.preventDefault();const values=Object.fromEntries(new FormData(form));ctx.knowledgeOperation=values.knowledgeOperation;ctx.knowledgeQuestion=values.knowledgeQuestion;
    if(values.knowledgePrivacy==='LOCAL_ONLY'&&aiConnection.provider!=='ollama'){ctx.toast('LOCAL_ONLY memerlukan Ollama localhost.');return;}
    const context=buildKnowledgeContext(ctx.store.get(),target,{operation:values.knowledgeOperation,question:values.knowledgeQuestion,notes:values.knowledgeNotes,domainId:pack.id,term:values.knowledgeTerm,flowId:values.knowledgeFlow,hypothesisId:values.knowledgeHypothesis,level:ctx.domainLevel||'Beginner'});
    const prepared=values.knowledgePrivacy==='REDACTED_CLOUD'||aiConnection.redactSecrets?SecretRedactor.context(context):context;
    const dialog=el('dialog',{class:'editor'},el('h2',{},'Review Target Knowledge Context'),el('p',{class:'notice'},'Hanya selected target/domain/flow/term dan capped context ditampilkan. Tidak ada browsing perusahaan otomatis. Review semua data sebelum Send.'),el('pre',{},JSON.stringify(prepared,null,2)),el('div',{class:'actions'},button('Cancel',()=>dialog.close()),button('Send Knowledge Analysis',async()=>{
      dialog.close();ctx.knowledgeBusy=true;ctx.render();
      try{const response=await requestKnowledge(prepared,values.knowledgePrivacy);TargetIntelligenceService.update(ctx.store,target,{suggestions:[...target.intelligence.suggestions,{id:uuid(),operation:values.knowledgeOperation,status:'pending',provider:aiConnection.provider,model:aiConnection.model,privacyMode:values.knowledgePrivacy,response,createdAt:now(),decisions:{}}]});ctx.toast('AI knowledge pending. Review sebelum menerima; belum ada model riset yang diubah.');}catch(error){ctx.toast(error.message);}finally{ctx.knowledgeBusy=false;ctx.render();}
    },'primary')));dialog.addEventListener('close',()=>dialog.remove());document.body.append(dialog);dialog.showModal();
  });section.append(form);return section;
}
function suggestionPanels(ctx,target){
  const root=el('div');
  for(const suggestion of target.intelligence.suggestions.slice().reverse()){
    const section=panel('AI GENERATED — '+(knowledgeOperations.find(o=>o[0]===suggestion.operation)?.[1]||suggestion.operation),badge(suggestion.status),badge(suggestion.provider),badge(suggestion.privacyMode));
    for(const item of [...suggestion.response.items,...suggestion.response.unknownInformation]){
      const decision=suggestion.decisions?.[item.id],card=panel(item.title,...knowledgeDetails(item),decision?badge('Review: '+decision):null);
      if(suggestion.status==='pending'&&!decision)card.append(el('div',{class:'actions'},button('Accept / Edit Knowledge',()=>reviewKnowledge(ctx,target,item,()=>finishDecision(ctx,target,suggestion,item.id,'accepted')),'primary'),button('Reject Item',()=>finishDecision(ctx,target,suggestion,item.id,'rejected'),'danger')));
      section.append(card);
    }
    for(const domain of suggestion.response.suggestedDomains){
      const known=DomainPackRepository.get(ctx.store.get(),domain.id),decision=suggestion.decisions?.[domain.id];
      const card=panel('Suggested Domain: '+(known?.name||domain.id),knowledgeBadges(domain),el('p',{},domain.reason),el('p',{class:'muted'},domain.notes));
      if(suggestion.status==='pending'&&!decision)card.append(button('Review Sector Classification',()=>editDialog('Review Domain Classification',[['choice','Classify as','select',[['primary','Primary Sector'],['secondary','Secondary Domain']]],['notes','Review Notes','textarea']],{choice:'secondary',notes:domain.reason},values=>{const intelligence=target.intelligence;TargetIntelligenceService.update(ctx.store,target,{...(values.choice==='primary'?{primaryDomainId:domain.id,secondaryDomainIds:intelligence.secondaryDomainIds.filter(id=>id!==domain.id)}:{secondaryDomainIds:[...new Set([...intelligence.secondaryDomainIds,domain.id])].filter(id=>id!==intelligence.primaryDomainId)}),classificationProvenance:{...domain,notes:values.notes,verified:false}});finishDecision(ctx,target,suggestion,domain.id,'accepted');})),button('Reject Sector',()=>finishDecision(ctx,target,suggestion,domain.id,'rejected')));
      else if(decision)card.append(badge('Review: '+decision));section.append(card);
    }
    if(suggestion.status==='pending')section.append(button('Reject Suggestion',()=>saveIntelligence(ctx,target,{suggestions:target.intelligence.suggestions.map(s=>s.id===suggestion.id?{...s,status:'rejected'}:s)}),'danger'));
    root.append(section);
  }return root;
}
export function renderIntelligence(ctx,target){
  const titles={'target-intelligence':'Target Intelligence','domain-knowledge':'Domain Knowledge','terminology':'Terminology','business-flows':'Business Flows','critical-assets':'Critical Assets','research-questions':'Research Questions'};
  const root=el('div',{},ctx.heading(titles[ctx.route]||'Target Intelligence','Understand the business before testing the technology. Knowledge dan inference belum merupakan vulnerability target.'));
  const packs=DomainPackRepository.all(ctx.store.get()),intelligence=TargetIntelligenceService.get(target);
  const pack=DomainPackRepository.get(ctx.store.get(),ctx.domainId)||DomainPackRepository.get(ctx.store.get(),intelligence.primaryDomainId)||packs.find(p=>p.id==='finance')||packs[0];
  if(!pack){root.append(empty('Buat atau import domain pack untuk mulai.'));return root;}
  const picker=el('select',{'aria-label':'Knowledge Domain'},packs.map(p=>el('option',{value:p.id},p.name)));picker.value=pack.id;picker.addEventListener('change',()=>{ctx.domainId=picker.value;ctx.knowledgeTerm='';ctx.knowledgeFlow='';ctx.render();});
  root.append(panel('Selected Knowledge Pack',picker,el('p',{class:'muted'},'Memilih pack di sini mengganti materi yang dibaca. Simpan klasifikasi target secara eksplisit pada Target Intelligence.'),button('Learn This Domain',()=>{ctx.domainLearning=true;routeTo('domain-knowledge');ctx.render();},'primary')));
  if(ctx.route==='target-intelligence'){
    root.append(classificationPanel(ctx,target,packs),profilePanel(ctx,target));
    const generate=button('Generate Target Knowledge',()=>{ctx.knowledgeOperation='generate_target_knowledge';ctx.render();ctx.toast('Pilih goal lalu Preview Knowledge Context pada form AI di bawah.');});generate.disabled=!aiConnection.enabled||!aiConnection.configured;
    root.append(panel('Knowledge Actions',generate,button('Generate Security Invariants',()=>{ctx.intelligenceSection='invariants';ctx.domainLearning=false;routeTo('domain-knowledge');ctx.render();}),button('Generate Research Questions',()=>routeTo('research-questions'))));
    const overview=el('div',{class:'grid'});
    for(const [title,collection,section] of [['Typical Users / Actors','actors','actors'],['Critical Objects','businessObjects','objects'],['Sensitive Data','sensitiveData','assets'],['Trust Boundaries','commonTrustBoundaries','boundaries'],['Security Invariants','securityInvariants','invariants'],['Research Questions','researchQuestions','questions']])overview.append(panel(title,badge('DOMAIN KNOWLEDGE · '+pack.name),el('ul',{},pack[collection].slice(0,3).map(row=>el('li',{},row.title))),button('Review '+title,()=>{ctx.intelligenceSection=section;ctx.domainLearning=false;routeTo(section==='questions'?'research-questions':'domain-knowledge');ctx.render();})));
    root.append(overview,techniquePanel(ctx,target,pack),panel('Target Knowledge',target.intelligence.items.length?target.intelligence.items.map(item=>acceptedCard(ctx,target,item)):empty('Belum ada knowledge yang direview. Isi profil atau review domain/AI suggestions.')));
    root.append(panel('Business Flow & Terminology',el('p',{},pack.businessFlows.map(f=>f.title).join(' · ')),el('p',{},pack.terminology.slice(0,6).map(t=>t.term).join(' · ')),button('See Business Flows',()=>routeTo('business-flows')),button('See Terminology',()=>routeTo('terminology'))));
  }else if(ctx.route==='terminology'){
    const query=el('input',{type:'search','aria-label':'Search Terminology',placeholder:'Cari term, definition, related terms…'}),results=el('div');
    const render=()=>{results.replaceChildren(...TerminologyService.search([pack],query.value).map(({item})=>panel(item.term,knowledgeBadges(item),el('p',{},item.definition),el('p',{class:'muted'},'Why important: '+item.whyImportant),el('p',{class:'muted'},'Related: '+item.relatedTerms.join(' · ')),button('Ask / Explain Term',()=>{ctx.knowledgeTerm=item.term;ctx.knowledgeOperation='explain_terminology';ctx.render();ctx.toast('Term dipilih pada form AI. Gunakan Preview Knowledge Context.');}))));};query.addEventListener('input',render);render();root.append(query,results);
  }else if(ctx.route==='business-flows'){
    for(const flow of pack.businessFlows)root.append(flowCard(ctx,target,pack,flow),techniquePanel(ctx,target,pack,flow.id));
    for(const item of intelligence.items.filter(i=>i.kind==='flow'))root.append(acceptedCard(ctx,target,item));
  }else if(ctx.route==='critical-assets'){
    for(const row of pack.criticalAssets)root.append(domainCard(ctx,target,pack,row,'asset'));
    for(const row of pack.sensitiveData)root.append(domainCard(ctx,target,pack,row,'sensitive-data'));
    for(const item of intelligence.items.filter(i=>['asset','sensitive-data'].includes(i.kind)))root.append(acceptedCard(ctx,target,item));
  }else if(ctx.route==='research-questions'){
    root.append(el('p',{class:'notice'},'Pertanyaan generik, bukan finding. Review invariant/scope sebelum Convert to Hypothesis.'));
    for(const row of pack.researchQuestions)root.append(domainCard(ctx,target,pack,row,'question'));
    for(const item of intelligence.items.filter(i=>['question','invariant'].includes(i.kind)))root.append(acceptedCard(ctx,target,item));
  }else{
    root.append(packControls(ctx,target,pack));
    if(ctx.domainLearning)root.append(renderLearning(ctx,target,pack));
    else{
      const sections=[['overview','Overview'],['terminology','Terminology'],['actors','Actors'],['objects','Objects'],['flows','Business Flows'],['assets','Critical Assets'],['boundaries','Trust Boundaries'],['invariants','Security Invariants'],['patterns','Research Patterns'],['techniques','Technique Mapping']];
      const tabs=el('div',{class:'actions knowledge-tabs'});for(const [key,label] of sections)tabs.append(button(label,()=>{ctx.intelligenceSection=key;ctx.domainLearning=false;ctx.render();},ctx.intelligenceSection===key?'primary':''));root.append(tabs);
      const section=ctx.intelligenceSection||'overview';
      if(section==='overview')root.append(panel(pack.name,knowledgeBadges(pack.provenance),el('p',{},pack.description),el('ul',{},pack.coreConcepts.map(c=>el('li',{},c))),el('p',{class:'muted'},pack.notes),pack.references.map(r=>el('p',{},el('a',{href:r.url,target:'_blank',rel:'noopener'},r.title),el('small',{},' · '+r.notes)))));
      else if(section==='terminology')for(const term of pack.terminology)root.append(panel(term.term,knowledgeBadges(term),el('p',{},term.definition),el('p',{},term.whyImportant),el('p',{class:'muted'},term.relatedTerms.join(' · '))));
      else if(section==='flows')for(const flow of pack.businessFlows)root.append(flowCard(ctx,target,pack,flow));
      else if(section==='techniques')root.append(techniquePanel(ctx,target,pack));
      else{const map={actors:['actors','actor'],objects:['businessObjects','object'],assets:['criticalAssets','asset'],boundaries:['commonTrustBoundaries','boundary'],invariants:['securityInvariants','invariant'],patterns:['commonFailurePatterns','explanation']};const [collection,kind]=map[section]||['securityInvariants','invariant'];for(const row of pack[collection])root.append(domainCard(ctx,target,pack,row,kind));}
    }
  }
  root.append(intelligenceAI(ctx,target,pack),suggestionPanels(ctx,target));return root;
}
