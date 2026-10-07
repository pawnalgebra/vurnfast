import {uuid,now} from '../utils.js';
import {emptyAgentResearch,validateAgentResearch,validateToolInventory} from './agent-schema.js';
import {TargetIntelligenceService} from './domain-knowledge.js';
import {SecretRedactor} from './redactor.js';
import {observationFingerprint,reportSourceFingerprint} from './research-integrity.js';
import {analyzeAdvancedResearch} from './advanced-research.js';
import {AdversarialValidationService} from './next-hypothesis.js';
export const AgentResearchService={
  get:target=>target.agentResearch||emptyAgentResearch(),
  update(store,target,research,canonical=false){validateAgentResearch(research);store.updateResearch(target.id,research,{canonical});},
  addManual(store,target,values){const research=structuredClone(this.get(target));const phase=values.replanFrom||(values.type==='Correction'?'target-intelligence':'hypothesis');research.manualAnalysis.push({id:uuid(),type:values.type,title:values.title,content:values.content,sourceType:'researcher',createdAt:now()});research.replanFrom=phase;research.state='PAUSED';research.reason='Manual analysis has priority; Continue replans from '+phase+'.';research.revision++;for(const p of research.reviewQueue.filter(p=>p.status==='PROPOSED'))p.stale=true;this.update(store,target,research,true);},
  decide(store,target,id,decision,values={}){
    const research=structuredClone(this.get(target)),proposal=research.reviewQueue.find(p=>p.id===id);
    if(!proposal||proposal.status!=='PROPOSED')throw new Error('Proposal sudah diputuskan/tidak ditemukan.');
    const beforeRevision=target.researchRevision;
    if(decision!=='REJECT'&&(proposal.stale||proposal.contextRevision!==beforeRevision))throw new Error('Context berubah; replan sebelum menerima proposal ini.');
    let canonicalId='';
    if(decision!=='REJECT'){
      for(const [field,rows] of [['relatedTechniqueId',target.techniques],['relatedHypothesisId',target.hypotheses]])if(values[field]!==undefined){if(values[field]&&!rows.some(r=>r.id===values[field]||r.libraryId===values[field]))throw new Error('Related record tidak valid.');proposal[field]=values[field];}
      const title=(values.title??proposal.title).trim(),content={...proposal.content,...values};if(!title)throw new Error('Title wajib diisi.');
      const technique=target.techniques.find(t=>t.id===proposal.relatedTechniqueId||t.libraryId===proposal.relatedTechniqueId);
      const provenance={sourceType:proposal.sourceType==='ai'?'ai':'unknown',source:proposal.source,confidence:proposal.confidence,verified:false,notes:proposal.notes};
      if(proposal.kind==='tool-recommendation'&&!store.get().toolInventory.some(t=>t.id===proposal.relatedToolId&&t.installed&&t.agentAccess!=='DENIED'&&t.capabilities.includes(content.type)))throw new Error('Tool unavailable; inventory/capability berubah.');
      const metadata={agentProposalId:proposal.id,knowledgeProvenance:provenance,notes:values.notes||proposal.notes,...Object.fromEntries(['actorId','objectId','boundaryId','invariantId','signalId','confirmEvidence','rejectEvidence','alternativeExplanation','discriminatingTest'].filter(k=>proposal[k]).map(k=>[k,proposal[k]])),...(proposal.researchRanking?{priorityFactors:proposal.researchRanking.factors}:{}),...(proposal.evidenceIds.length?{evidenceIds:[...proposal.evidenceIds]}:{})};
      if(proposal.kind==='actor'){if(!content.name.trim())throw new Error('Actor name wajib diisi.');canonicalId=store.upsert(target.id,'actors',{name:content.name,authority:content.authority,...metadata}).id;}
      else if(proposal.kind==='object'){if(!content.name.trim())throw new Error('Object name wajib diisi.');canonicalId=store.upsert(target.id,'objects',{name:content.name,type:content.type||'Custom',owner:content.owner,tenant:content.tenant,state:content.state,sensitivity:content.sensitivity,...metadata}).id;}
      else if(proposal.kind==='boundary'){if(!content.from.trim()||!content.to.trim())throw new Error('Boundary from/to wajib diisi.');canonicalId=store.upsert(target.id,'boundaries',{from:content.from,to:content.to,channel:content.channel,authority:content.authority,trust:content.trust||'restricted',...metadata}).id;}
      else if(proposal.kind==='technique'){if(!technique)throw new Error('Pilih existing technique yang valid.');canonicalId=store.upsert(target.id,'techniques',{id:technique.id,enabled:true,notes:proposal.analysis+'\n'+(values.notes||proposal.notes),agentProposalId:proposal.id}).id;}
      else if(proposal.kind==='hypothesis'){
        if(!content.invariant.trim()||!content.expectedBehavior.trim())throw new Error('Invariant dan expected behavior wajib diisi.');
        canonicalId=store.upsert(target.id,'hypotheses',{title,techniqueId:technique?.id||'',invariant:content.invariant,expectedBehavior:content.expectedBehavior,potentialFailure:content.potentialFailure,who:content.who,what:content.what,object:content.object,state:content.state,authority:content.authority,context:content.context,status:'idea',queue:'Next',priority:'medium',confidence:'low',...metadata}).id;
      }else if(proposal.kind==='test-plan'){
        const h=target.hypotheses.find(h=>h.id===proposal.relatedHypothesisId);if(!h||!content.steps.trim())throw new Error('Reviewed hypothesis dan langkah test wajib tersedia.');
        canonicalId=store.upsert(target.id,'testCases',{title,hypothesisId:h.id,authProfileId:h.authProfileId||'',actorId:h.actorId||'',objectId:h.objectId||'',boundaryId:h.boundaryId||'',signalId:h.signalId||'',authorityProfileId:h.authorityProfileId||'',techniqueId:technique?.id||h.techniqueId||'',preconditions:content.preconditions,steps:content.steps,expectedResult:content.expectedResult||h.expectedBehavior,actualResult:'',result:'not-tested',timestamp:now(),who:content.who||h.who,what:content.what||h.what,object:content.object||h.object,state:content.state||h.state,authority:content.authority||h.authority,context:content.context||h.context,...(h.knowledgeLinks?{knowledgeLinks:{...h.knowledgeLinks}}:{}),...metadata,evidenceIds:[]}).id;
      }else if(proposal.kind==='potential-finding'){
        const snapshot=proposal.observationSnapshot,test=target.testCases.find(t=>t.id===proposal.relatedTestId);
        const validTest=snapshot&&test&&(snapshot.testFingerprint?snapshot.testFingerprint===observationFingerprint(test):test.actualResult===snapshot.actualResult&&test.result===snapshot.testResult);
        const validEvidence=snapshot&&proposal.evidenceIds.length&&proposal.evidenceIds.every(id=>snapshot.evidence.some(e=>e.id===id&&target.evidence.some(live=>live.id===id&&(e.sourceFingerprint?observationFingerprint(live)===e.sourceFingerprint:SecretRedactor.redact((live.content||'').slice(0,8000))===e.content))));
        const validTests=(snapshot?.tests||[]).every(row=>target.testCases.some(live=>live.id===row.id&&(row.sourceFingerprint?observationFingerprint(live)===row.sourceFingerprint:live.actualResult===row.actualResult&&live.result===row.result)));
        if(!proposal.analysisCompleted||!validTest||!validEvidence||!validTests)throw new Error('Observation/evidence berubah atau analisis false positive/duplicate belum lengkap. Replan diperlukan.');
        const signals=target.researchModel?analyzeAdvancedResearch(target).signals.filter(s=>(proposal.signalIds||[]).includes(s.id)):[];
        if(decision==='CONFIRM_FINDING'&&(proposal.signalIds?.length&&!signals.length||signals.some(s=>AdversarialValidationService.assess(s,target.researchModel,target).status!=='READY_FOR_RESEARCHER_REVIEW')))throw new Error('NEEDS_TESTING: unresolved alternative explanation requires observed discriminating control evidence.');
        for(const k of ['actualResult','expectedResult','steps','who','what','object','state','authority','context'])content[k]=test[k]||'';
        if(['startingAuthority','securityRestriction','protectedResource','expectedResult','actualResult','steps','impact'].some(k=>!content[k].trim()))throw new Error('Lengkapi authority, restriction, resource, expected/actual, steps dan impact sebelum menerima finding.');
        canonicalId=store.upsert(target.id,'findings',{title,status:decision==='CONFIRM_FINDING'?'confirmed':'draft',validationStatus:signals.some(s=>AdversarialValidationService.assess(s,target.researchModel,target).status!=='READY_FOR_RESEARCHER_REVIEW')?'NEEDS_TESTING':'READY_FOR_RESEARCHER_REVIEW',severity:'Unknown',techniqueId:technique?.id||test.techniqueId||'',testCaseId:test.id,testIds:proposal.testIds||[test.id],evidenceLinks:proposal.evidenceLinks||[],signalIds:proposal.signalIds||[],startingAuthority:content.startingAuthority,securityRestriction:content.securityRestriction,protectedResource:content.protectedResource,unauthorizedOutcome:content.unauthorizedOutcome||content.actualResult,rootCause:content.rootCause,impact:content.impact,vulnerabilityClass:content.vulnerabilityClass,preconditions:content.preconditions,steps:content.steps,expectedResult:content.expectedResult,actualResult:content.actualResult,who:content.who,what:content.what,object:content.object,state:content.state,authority:content.authority,context:content.context,evidenceIds:[...proposal.evidenceIds],researchNotes:proposal.falsePositiveAnalysis+'\nDuplicate Risk: '+proposal.duplicateRisk,agentProposalId:proposal.id,...(test.knowledgeLinks?{knowledgeLinks:{...test.knowledgeLinks}}:{})}).id;
      }else if(proposal.kind==='report'){
        const finding=target.findings.find(f=>f.id===proposal.relatedFindingId);if(!finding||finding.status!=='confirmed'||!finding.evidenceIds?.length||!content.reportMarkdown.trim())throw new Error('Confirmed finding/evidence/report tidak tersedia.');
        if(proposal.findingFingerprint&&proposal.findingFingerprint!==observationFingerprint(finding))throw new Error('Finding berubah; replan report sebelum menerima.');
        canonicalId=store.upsert(target.id,'findings',{id:finding.id,reportMarkdown:content.reportMarkdown,reportSourceFingerprint:reportSourceFingerprint(target,finding),agentReportProposalId:proposal.id}).id;
      }else if(['knowledge','question'].includes(proposal.kind)){
        canonicalId=TargetIntelligenceService.accept(store,target,{id:proposal.id,kind:proposal.kind==='question'?'question':'explanation',title,content:values.analysis??proposal.analysis,...provenance,domainId:target.intelligence.primaryDomainId,flowId:'',invariantId:'',techniqueId:technique?.libraryId||technique?.id||'',steps:[]}).id;
      }else if(content.type==='sensitive-review'){research.sensitiveReviewedKey=content.context;}
      else canonicalId=store.upsert(target.id,'notes',{title,content:values.analysis??proposal.analysis,type:'agent-review',source:proposal.source,agentProposalId:proposal.id}).id;
      proposal.title=title;proposal.content=content;
    }
    proposal.status=decision==='REJECT'?'REJECTED':decision==='EDIT'?'EDITED':'ACCEPTED';proposal.decision=decision;proposal.canonicalId=canonicalId;proposal.reviewedAt=now();
    // Only a reviewed mutation can advance the other proposals from this same batch.
    for(const sibling of research.reviewQueue)if(sibling.status==='PROPOSED'&&!sibling.stale&&sibling.contextRevision===beforeRevision)sibling.contextRevision=target.researchRevision;
    research.pendingActions=structuredClone(target.agentResearch.pendingActions);
    research.history.push({id:uuid(),agent:proposal.agentId,task:proposal.title,startedAt:now(),completedAt:now(),status:proposal.status,toolsUsed:[],resultSummary:'Researcher decision: '+decision,researcherDecision:decision,estimatedCostUSD:0});research.revision++;
    const pending=research.reviewQueue.some(p=>p.status==='PROPOSED'&&!p.stale);
    research.state=pending?'WAITING_REVIEW':'PAUSED';research.reason=pending?'Needs your review.':'Review selesai. Continue Research untuk replan dan melanjutkan.';
    this.update(store,target,research);return canonicalId;
  }
};
export function compactAgentResearch(research){
  const clone=structuredClone(research);
  // Conversation belongs to the message channel, never the sequential research payload.
  delete clone.messages;delete clone.messageSessionId;delete clone.conversationSummary;
  clone.reviewQueue=clone.reviewQueue.filter(p=>p.status==='PROPOSED'||clone.reviewQueue.slice(-12).some(v=>v.id===p.id)).slice(-60);
  clone.pendingActions=clone.pendingActions.filter(a=>a.status==='PROPOSED'||clone.pendingActions.slice(-8).some(v=>v.id===a.id)).slice(-30);
  clone.history=clone.history.slice(-12);clone.runs=clone.runs.slice(-8);clone.manualAnalysis=clone.manualAnalysis.slice(-12);return clone;
}
export function mergeAgentResearch(original,returned){
  const merged={...original,...returned};
  for(const key of ['reviewQueue','pendingActions','history','runs','manualAnalysis']){const byId=new Map(original[key].map(row=>[row.id,row]));for(const row of returned[key])byId.set(row.id,row);merged[key]=[...byId.values()];}
  validateAgentResearch(merged);return merged;
}
