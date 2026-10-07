import {el,button,panel,badge,empty,now} from '../utils.js';
import {field,editDialog} from '../forms.js';
import {aiConnection,requestAdvice} from '../services/ai-client.js';
import {buildResearchContext} from '../services/context.js';
import {SecretRedactor} from '../services/redactor.js';
import {validateAIOutput} from '../services/ai-schema.js';
import {editHypothesis} from './hypotheses.js';
import {routeTo} from '../router.js';
import {generateIndonesianReport} from '../templates/report-id.js';
import {operationFeatures} from '../feature-registry.js';
import {DomainKnowledgeService} from '../services/domain-knowledge.js';
export const aiOperations=[['research_advice','Research Assistant'],['analyze_scope','Analyze Scope'],['recommend_techniques','Technique Advisor'],['recommend_tools','Tool Advisor'],['recommend_helpers','Helper Advisor'],['research_questions','Research Questions'],['generate_hypotheses','Hypothesis Generator'],['analyze_finding','Finding Analyzer'],['false_positive_analysis','False Positive Analyzer'],['duplicate_analysis','Duplicate Analyzer'],['gap_analysis','Gap Analyzer'],['improve_report','Report Assistant'],['evidence_summary','Evidence Summarizer'],['safe_next_steps','Safe Next Steps'],['identify_restrictions','Restrictions']];
const routeOperations={'ai-techniques':'recommend_techniques','ai-tools':'recommend_tools','ai-gaps':'gap_analysis','ai-findings':'analyze_finding'};
export function renderAI(ctx,target) {
  const root=el('div',{},ctx.heading('AI Research Assistant','AI suggests. Rules constrain. Researcher decides. Semua output adalah draft untuk review.'));
  if(!aiConnection.enabled||!aiConnection.configured){root.append(panel('AI: '+aiConnection.status,el('p',{class:'muted'},'Workflow manual tetap tersedia. Konfigurasi provider dan model di .env backend, lalu hubungkan dari AI Provider Settings.'),button('AI Provider Settings',()=>routeTo('ai-provider'))));return root;}
  const form=el('form',{class:'form-grid'});
  field(form,['operation','Operation','select',aiOperations],ctx.aiOperation||routeOperations[ctx.route]||'research_advice');
  const operationHelp=el('div',{class:'wide operation-help'});
  const updateOperationHelp=()=>operationHelp.replaceChildren(ctx.help(operationFeatures[form.elements.operation.value]));
  updateOperationHelp();form.elements.operation.addEventListener('change',updateOperationHelp);form.append(operationHelp);
  field(form,['privacyMode','Privacy Mode','select',['LOCAL_ONLY','REDACTED_CLOUD','CLOUD']],aiConnection.privacyMode||'REDACTED_CLOUD');
  field(form,['techniqueId','Technique context','select',[['','— Semua teknik enabled —'],...target.techniques.filter(t=>t.enabled).map(t=>[t.id,t.name])]],ctx.toolTechniqueId||'');
  field(form,['findingId','Finding context','select',[['','— Tidak ada finding —'],...target.findings.map(f=>[f.id,f.title])]],ctx.reportFindingId||'');
  field(form,['goal','Research Goal','textarea']);field(form,['notes','Additional context','textarea']);
  const evidence=el('input',{type:'checkbox',name:'includeEvidence'}),knowledge=el('input',{type:'checkbox',name:'includeKnowledge'});form.append(el('label',{class:'actions wide'},evidence,'Include evidence text (opsional)'),el('label',{class:'actions wide'},knowledge,'Include Knowledge Base (opsional)'));
  const send=el('button',{type:'submit',class:'primary wide'},ctx.aiBusy?'Analysis sedang berjalan…':'Preview AI Context');send.disabled=!!ctx.aiBusy;form.append(send);
  form.addEventListener('submit',event=>{
    event.preventDefault();const options=Object.fromEntries(new FormData(form));options.includeEvidence=evidence.checked;options.includeKnowledge=knowledge.checked;ctx.aiOperation=options.operation;
    if(['analyze_finding','false_positive_analysis','duplicate_analysis','improve_report'].includes(options.operation)&&!options.findingId){ctx.toast('Pilih finding untuk operasi ini.');return;}
    const finding=target.findings.find(f=>f.id===options.findingId);if(options.operation==='improve_report')options.report=finding?.reportMarkdown||generateIndonesianReport(target,finding);
    if(options.privacyMode==='LOCAL_ONLY'&&aiConnection.provider!=='ollama'){ctx.toast('LOCAL_ONLY memerlukan provider Ollama localhost.');return;}
    options.domainKnowledge=DomainKnowledgeService.selected(ctx.store.get(),target);
    const context=buildResearchContext(target,options),redact=options.privacyMode==='REDACTED_CLOUD'||aiConnection.redactSecrets;
    const prepared=redact?SecretRedactor.context(context):context;
    const dialog=el('dialog',{class:'editor'},el('h2',{},'Review AI Context · '+options.privacyMode),el('p',{class:'notice'},options.privacyMode==='LOCAL_ONLY'?'Context dikirim melalui backend localhost ke Ollama localhost.':'Context ini akan dikirim ke '+aiConnection.provider+' melalui backend. Review redaksi, scope, dan evidence sebelum melanjutkan.'),el('pre',{},JSON.stringify(prepared,null,2)),el('div',{class:'actions'},button('Cancel',()=>dialog.close()),button('Send for Analysis',async()=>{
      const revision=target.researchRevision;dialog.close();ctx.aiBusy=true;ctx.render();
      try {
        const response=validateAIOutput(await requestAdvice(prepared,options.privacyMode));
        if(ctx.store.target(target.id)!==target||target.researchRevision!==revision)throw new Error('Context changed; AI response discarded. Send a fresh analysis.');
        // DATA CONTRACT: Only a suggestion record is saved; no research field is overwritten.
        ctx.store.upsert(target.id,'aiSuggestions',{operation:options.operation,status:'pending',provider:aiConnection.provider,model:aiConnection.model,privacyMode:options.privacyMode,sourceFindingId:options.findingId||'',response,createdAt:now()});ctx.toast('AI suggestion siap direview. Tidak ada finding/hypothesis yang diubah otomatis.');
      }catch(error){ctx.toast(error.message);}finally{ctx.aiBusy=false;ctx.render();}
    },'primary')));
    dialog.addEventListener('close',()=>dialog.remove());document.body.append(dialog);dialog.showModal();
  });
  root.append(panel('Optional analysis request',form));
  const suggestions=target.aiSuggestions.slice().reverse();if(!suggestions.length)root.append(empty('Belum ada AI suggestion.'));
  for(const suggestion of suggestions) {
    const output=suggestion.response;validateAIOutput(output);
    const preview=panel(aiOperations.find(o=>o[0]===suggestion.operation)?.[1]||suggestion.operation,el('div',{class:'badges'},badge(suggestion.status),badge(suggestion.provider),badge(suggestion.privacyMode)),el('p',{class:'notice'},output.scopeAssessment.status+' · '+output.scopeAssessment.reason),el('p',{class:'muted'},'Research Priority: '+output.researchPriority.score+'/100 · bukan severity · Confidence: '+output.confidence),el('details',{},el('summary',{},'Structured recommendation preview'),el('pre',{},JSON.stringify(output,null,2))));
    if(suggestion.status==='pending') {
      const settle=status=>{ctx.store.upsert(target.id,'aiSuggestions',{id:suggestion.id,status});ctx.render();};
      preview.append(el('div',{class:'actions'},button('Accept as Research Note',()=>{ctx.store.upsert(target.id,'notes',{type:'ai-advice',title:'AI recommendation · '+suggestion.operation,content:JSON.stringify(output,null,2)});settle('accepted');}),button('Edit / Accept Note',()=>editDialog('Review AI Note',[['title','Title','required'],['content','Editable recommendation','textarea']],{title:'AI recommendation · '+suggestion.operation,content:JSON.stringify(output,null,2)},values=>{ctx.store.upsert(target.id,'notes',{type:'ai-advice',...values});settle('accepted');})),button('Reject',()=>settle('rejected'),'danger')));
      for(const hypothesis of output.hypotheses)preview.append(button('Review Hypothesis: '+hypothesis.title,()=>{const technique=target.techniques.find(t=>t.name===hypothesis.technique);editHypothesis(ctx,target,null,{...hypothesis,techniqueId:technique?.id||'',status:'idea',confidence:'low',notes:'AI draft. Review invariant dan evidence sebelum testing.'});}));
      if(output.reportDraft)preview.append(button('Preview / Edit Report Draft',()=>{
        const source=target.findings.find(f=>f.id===suggestion.sourceFindingId);if(!source){ctx.toast('Finding sumber tidak ditemukan. Simpan sebagai note.');return;}
        editDialog('Review AI Report',[['reportMarkdown','Report Markdown','textarea']],{reportMarkdown:output.reportDraft},values=>{ctx.store.upsert(target.id,'findings',{id:source.id,...values});settle('accepted');});
      }));
    }
    preview.append(ctx.deleteButton(target,'aiSuggestions',suggestion));root.append(preview);
  }
  return root;
}
