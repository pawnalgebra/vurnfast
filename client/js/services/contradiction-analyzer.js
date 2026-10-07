import {NormalizedObservationService,supportedResearchObservation} from './research-model.js';
export class ContradictionAnalyzer {
  static analyze(graph){
    const {model,timeline}=graph,events=model.events.filter(row=>supportedResearchObservation(row,graph.target)),observations=model.observations.filter(row=>supportedResearchObservation(row,graph.target)),signals=[],explained=[];
    const emit=(type,rows,expected,observed,alternative,discriminatingTest,rule)=>{
      const invariant=model.invariants.find(i=>i.rule===rule&&(!i.objectId||rows.every(e=>e.objectId===i.objectId))&&(!i.operation||rows.every(e=>!e.operation||e.operation===i.operation)))||null;
      const id=type+':'+rows.map(e=>e.id).sort().join('|'),evidenceRefs=[...new Set(rows.flatMap(e=>e.evidenceRefs))];
      const decision=model.signalDecisions.find(d=>d.signalId===id&&['REJECTED','EXPLAINED'].includes(d.status));
      const signal={id,type,invariantId:invariant?.id||'candidate:'+rule,events:rows.map(e=>e.id),evidenceRefs,expected:invariant?.content||expected,observed,confidence:Math.min(...rows.map(e=>e.provenance.confidence),.85),requiresValidation:true,status:'RESEARCH_SIGNAL',actorId:rows.at(-1).actorId||'',objectId:rows.at(-1).objectId||'',boundaryId:rows.find(e=>e.boundaryId)?.boundaryId||'',state:rows.at(-1).stateAfter||rows.at(-1).state||'Unknown',authority:rows.at(-1).effectiveAuthority||rows.at(-1).authorityBefore||'Unknown',tenant:rows.at(-1).tenant||'',surface:rows.at(-1).surface||'',operation:rows.at(-1).operation||'',alternativeExplanation:alternative,discriminatingTest,provenance:{status:'AI_INFERRED',source:'deterministic-rule:'+rule,confidence:Math.min(...rows.map(e=>e.provenance.confidence),.85),evidenceRefs},candidateInvariant:!invariant};
      // Deterministic inference is still inference; never upgrade supplied observations.
      signal.provenance.status='UNKNOWN';signal.provenance.source='deterministic-rule:'+rule;
      if(decision)explained.push({...signal,decision});else signals.push(signal);
    };
    for(const execution of events.filter(e=>e.outcome==='allowed')){
      const authority=timeline.authorityAt(execution),revocation=events.find(e=>authority.eventIds.includes(e.id)&&e.authorityAfter==='revoked');
      if(revocation){
        const independent=model.invariants.find(i=>i.rule==='independent-job-authority'&&i.objectId===execution.objectId&&i.operation===execution.operation&&i.provenance.status==='RESEARCHER_CONFIRMED'&&supportedResearchObservation(i,graph.target));
        if(execution.independentAuthority==='confirmed'&&independent)explained.push({id:'independent:'+execution.id,type:'independent_authority',events:[revocation.id,execution.id],evidenceRefs:[...revocation.evidenceRefs,...execution.evidenceRefs],reason:'Researcher-confirmed independent job authority; membership revocation does not invalidate this grant.',provenance:independent.provenance});
        else emit('authority_state_contradiction',[revocation,execution],'Revocation must stop future protected execution unless an independent grant is valid.','Protected '+execution.operation+' allowed after ordered revocation.','Job may intentionally receive independent, irrevocable authority.','Compare pre-revocation queued job, post-revocation queue attempt, and explicit job-grant cancellation using owned dummy objects.','revocation');
      }
      if(execution.authorityTenant&&execution.tenant&&execution.authorityTenant!==execution.tenant)emit('tenant_authority_contradiction',[execution],'Authority must be bound to the object tenant.','Authority tenant '+execution.authorityTenant+' reached object tenant '+execution.tenant+'.','An explicit cross-tenant share or delegated grant may permit this operation.','Compare the same owned object with and without explicit cross-tenant share; verify effective grants.','tenant-isolation');
      if(execution.requiredRole&&execution.role&&execution.requiredRole!==execution.role&&execution.effectiveAuthority==='insufficient')emit('role_authority_contradiction',[execution],'Protected operation requires an effective authorized role.','Insufficient '+execution.role+' authority performed '+execution.requiredRole+' operation.','A separate capability or inherited permission may grant the operation.','Remove independent capabilities and compare owner/member/viewer on the same owned object.','role-authorization');
      if(execution.version&&execution.approvedVersion&&execution.version!==execution.approvedVersion){
        const approval=events.find(e=>e.id===execution.approvalEventId&&e.objectId===execution.objectId&&timeline.compare(e,execution)==='BEFORE');
        const modification=events.find(e=>e.objectId===execution.objectId&&e.operation==='modify'&&e.version===execution.version&&approval&&timeline.compare(approval,e)==='BEFORE'&&timeline.compare(e,execution)==='BEFORE');
        if(approval&&modification)emit('approval_version_contradiction',[approval,modification,execution],'Approval must bind the approved object version and destination.','Approval '+execution.approvedVersion+' authorized modified version '+execution.version+'.','Approval may deliberately authorize a class of non-sensitive changes.','Compare sensitive beneficiary/value modification against a cosmetic change, with fresh approval as control.','approval-version');
      }
    }
    for(const invariant of model.invariants.filter(i=>i.rule==='aggregate-limit'&&Number.isFinite(i.maximum))){
      const executions=events.filter(e=>e.objectId===invariant.objectId&&e.operation===invariant.operation&&e.outcome==='allowed'&&Number.isFinite(e.amount)&&e.amount>=0);
      // Operation IDs identify real executions; duplicate log observations must not double-count.
      const distinct=new Map();for(const event of executions)if(event.operationId)distinct.set(event.operationId,event);
      const rows=[...distinct.values()],total=rows.reduce((n,e)=>n+e.amount,0),concurrent=rows.some((e,i)=>rows.slice(i+1).some(other=>timeline.compare(e,other)==='CONCURRENT'));
      if(total>invariant.maximum&&rows.length>1&&concurrent)emit('aggregate_execution_contradiction',rows,'Aggregate '+invariant.operation+' must not exceed '+invariant.maximum,'Distinct concurrent executions total '+total+' > '+invariant.maximum+'.','Entries may be reservations, duplicate telemetry, or later reversals rather than settled outcomes.','Compare distinct operation IDs and final ledger deltas after reconciliation against a serial control.','aggregate-limit');
    }
    for(let i=0;i<observations.length;i++)for(const right of observations.slice(i+1)){
      const left=observations[i],same=['actorId','objectId','operation','role','tenant','state','effectiveAuthority'].every(key=>left[key]&&left[key]===right[key])&&['authorityProfileId','version'].every(key=>(left[key]||'')===(right[key]||''));
      if(same&&left.surface&&right.surface&&left.surface!==right.surface&&new Set([left.outcome,right.outcome]).has('allowed')&&new Set([left.outcome,right.outcome]).has('denied')){
        const comparison=NormalizedObservationService.compare(left,right);
        emit('cross_surface_authority_contradiction',[left,right],'Equivalent logical operations must enforce equivalent authority.','Same actor/object/operation: '+left.surface+' '+left.outcome+', '+right.surface+' '+right.outcome+'.','Session freshness, cache, rollout, or differing logical operation semantics may explain the difference.','Repeat with matched sessions, object version, tenant and operation; inspect backend outcome rather than UI alone.','surface-consistency');
        signals.at(-1)?.id?.startsWith('cross_surface')&&(signals.at(-1).comparison=comparison);
      }
    }
    return {signals,explained,unresolvedQuestions:[...model.unresolvedQuestions,...signals.map(s=>s.alternativeExplanation)]};
  }
}
