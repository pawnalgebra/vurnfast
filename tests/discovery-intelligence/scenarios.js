import {authorizedTarget} from '../fixtures.js';
import {emptyResearchModel} from '../../client/js/services/research-model.js';
// Evaluator labels stay outside the evidence/target supplied to discovery or a live model.
export const scenarioCases=[
  ['Cross Tenant','TENANT','tenant','authorityTenant','read'],
  ['Revocation + Async','ASYNC','effectiveAuthority','authorityAfter','execute'],
  ['Race / Double Execution','TRANSACTION','amount','maximum','settle'],
  ['Approval Version Binding','APPROVAL','version','approvedVersion','publish'],
  ['Cross Surface','AUTHORIZATION','effectiveAuthority','requiredRole','export'],
  ['Ownership Transfer','OWNERSHIP','ownerId','actorId','modify'],
  ['Role Downgrade','AUTHORIZATION','effectiveAuthority','requiredRole','edit'],
  ['Invitation Lifecycle','LIFECYCLE','state','expectedState','accept'],
  ['Session State Change','SESSION','state','expectedState','resume'],
  ['Object Restore','STATE','state','expectedState','restore'],
  ['Webhook Ownership','OWNERSHIP','ownerId','actorId','deliver'],
  ['Cache Isolation','TENANT','tenant','authorityTenant','retrieve'],
  ['Multi-Step Business Workflow','BUSINESS_RULE','state','expectedState','complete'],
  ['Authority Delegation','IDENTITY','effectiveAuthority','expectedAuthority','delegate'],
  ['State Rollback','STATE','version','approvedVersion','rollback'],
  ['Tenant + Async','ASYNC','tenant','authorityTenant','execute'],
  ['Ownership + Webhook + Version','VERSION','version','approvedVersion','deliver'],
  ['Invitation + Session','SESSION','state','expectedState','resume'],
  ['Approval + Restore','APPROVAL','version','approvedVersion','restore'],
  ['Delegation + Surface','AUTHORIZATION','effectiveAuthority','expectedAuthority','export'],
  ['Transaction + Rollback','LIMIT','amount','maximum','settle'],
  ['Cache + Ownership','CUSTOM','ownerId','actorId','retrieve']
];
export function blindScenario(index,variant='suspicious'){
  const [,category,field,other,operation]=scenarioCases[index],{store,target}=authorizedTarget();target.researchModel=emptyResearchModel();
  const actorId=target.actors[0].id,objectId=target.objects[0].id;
  const event=(id,data)=>{const raw=store.upsert(target.id,'evidence',{label:id,content:JSON.stringify(data)});const row={id,actorId,objectId,operation:'observe',evidenceRefs:[raw.id],provenance:{status:'OBSERVED',source:raw.id,confidence:1,evidenceRefs:[raw.id]},...data};target.researchModel.events.push(row);return row;};
  const numeric=['TRANSACTION','LIMIT'].includes(category),base=numeric?10:other==='actorId'?actorId:'value-A',changed=numeric?18:'value-B';
  const first=event('record-a',{order:1,authorityBefore:'unknown',authorityAfter:'granted',stateBefore:'draft',stateAfter:'active',version:'value-A',operationIntent:operation,surface:'web',[other]:base});
  event('noise-a',{order:1.5,objectId:'',operation:'telemetry',state:'idle'});
  const second=event('record-b',{order:2,operation:'prepare',stateBefore:'active',stateAfter:'pending',authorityBefore:'granted',authorityAfter:'revoked',[other]:base});
  const last=event('record-c',{order:3,operation,operationIntent:operation,surface:index%2?'worker':'api',outcome:'allowed',expectedOutcome:'reviewed target outcome',actualOutcome:'recorded completion',businessCriticality:80,[field]:variant==='benign'?base:changed,[other]:base});
  event('noise-b',{order:4,objectId:'',operation:'ui-paint',state:'idle'});
  // A benign async operation has a documented independent capability, rather than being denied.
  if(category==='ASYNC'&&field==='effectiveAuthority'){first.authorityAfter='granted';second.authorityAfter='revoked';last[field]=variant==='benign'?'revoked':'granted';}
  if(variant==='missing'){last.evidenceRefs=[];last.provenance={status:'UNKNOWN',source:'Observation awaiting raw support',confidence:0,evidenceRefs:[]};}
  const condition={all:[{field:'outcome',operator:'eq',value:'allowed'}]};
  let expected={all:[{field,operator:numeric?'lte':'eqField',...(numeric?{value:base}:{other})}]};
  if(category==='ASYNC'&&field==='effectiveAuthority'){condition.prior={same:['actorId','objectId'],all:[{field:'authorityAfter',operator:'eq',value:'revoked'}]};expected={all:[{field:'effectiveAuthority',operator:'eqField',other:'prior.authorityAfter'}]};}
  if(numeric){
    second.operation=operation;second.outcome='allowed';second.operationId='execution-a';second.amount=variant==='benign'?4:6;
    last.operationId='execution-b';last.amount=variant==='benign'?4:6;second.concurrentWith=[last.id];last.concurrentWith=[second.id];
    event('replayed-record',{...second,id:'replayed-record',order:2.1,evidenceRefs:undefined,provenance:undefined});
    // Restore independent provenance on the replay; the same operation ID must not count twice.
    const replay=target.researchModel.events.at(-1),replayRaw=target.evidence.at(-1);replay.evidenceRefs=[replayRaw.id];replay.provenance={status:'OBSERVED',source:replayRaw.id,confidence:1,evidenceRefs:[replayRaw.id]};
    expected={aggregate:{field:'amount',groupBy:['objectId','operation'],distinctBy:'operationId',all:[{field:'outcome',operator:'eq',value:'allowed'}]},all:[{field:'total',operator:'lte',value:10}]};
  }
  if(['APPROVAL','VERSION'].includes(category)||operation==='rollback'){
    first.operation='approve';first.version='value-A';second.operation='modify';second.version='value-B';last.version=variant==='benign'?'value-A':'value-B';
    condition.prior={same:['actorId','objectId'],all:[{field:'operation',operator:'eq',value:'approve'}]};expected={all:[{field:'version',operator:'eqField',other:'prior.version'}]};
  }
  if(category==='OWNERSHIP'||category==='CUSTOM'){
    second.operation='transfer';second.ownerId=actorId;last.ownerId=variant==='benign'?actorId:'former-owner';
    condition.prior={same:['objectId'],all:[{field:'operation',operator:'eq',value:'transfer'}]};expected={all:[{field:'ownerId',operator:'eqField',other:'prior.ownerId'}]};
  }
  if(['STATE','LIFECYCLE','SESSION','BUSINESS_RULE'].includes(category)&&operation!=='rollback'){
    second.operation='transition';second.stateAfter='active';last.state=variant==='benign'?'active':'retired';
    condition.prior={same:['actorId','objectId'],all:[{field:'operation',operator:'eq',value:'transition'}]};expected={all:[{field:'state',operator:'eqField',other:'prior.stateAfter'}]};
  }
  target.researchModel.constraints=[{id:'rule-'+index,targetId:target.id,category,subject:actorId,operation,object:objectId,condition,expected,sourceType:'RESEARCHER_CONFIRMED',sourceRef:'Reviewed owned-lab rule '+index,confidence:1,verified:true,notes:'Target-specific behavior, not a universal security assumption'}];
  const evaluator={name:scenarioCases[index][0],terminal:last.id,criticalEvents:[first.id,second.id,last.id],constraintId:'rule-'+index,expectedStatus:variant==='benign'?'SATISFIED':variant==='missing'?'INSUFFICIENT_EVIDENCE':'VIOLATED',hypothesisFamily:'relationshipFailure',nextTestProperties:['matched-object','matched-intent','before-after-control','authority-source','fresh-evidence','manual-only'],mustNotClaim:['confirmed vulnerability','critical severity']};
  return {store,target,evaluator};
}
