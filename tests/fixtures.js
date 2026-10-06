import {AI_RESPONSE_SCHEMA} from '../client/js/services/ai-schema.js';
import {createStore} from '../client/js/store.js';
import {buildResearchContext} from '../client/js/services/context.js';
export function emptyAdvice() {
  const make=schema=>schema.type==='object'?Object.fromEntries(Object.entries(schema.properties).map(([key,child])=>[key,make(child)])):schema.type==='array'?[]:schema.type==='number'?schema.minimum||0:schema.enum?schema.enum[0]:'';
  return make(AI_RESPONSE_SCHEMA);
}
export function authorizedTarget() {
  const store=createStore(),target=store.addTarget({name:'Owned Local Fixture',asset:'app.test',platform:'Private'});
  store.updateTarget(target.id,{scope:{guard:{inScope:true,account:true,data:true},inScope:'app.test',outOfScope:'thirdparty.test',automationRules:'No automated scanning.',testingRestrictions:'Dummy data only.'}});
  store.upsert(target.id,'actors',{name:'Member'});store.upsert(target.id,'objects',{name:'Approval',state:'Used'});
  return {store,target,context:buildResearchContext(target)};
}
