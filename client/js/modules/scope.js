import {el,button,panel} from '../utils.js';
import {field} from '../forms.js';
export const scopeFields=[['inScope','In Scope','textarea'],['outOfScope','Out of Scope','textarea'],['knownIssues','Known Issues','textarea'],['rateLimits','Rate Limits','textarea'],['automationRules','Automation Rules','textarea'],['safeHarbor','Safe Harbor Notes','textarea'],['testingRestrictions','Testing Restrictions','textarea'],['testAccounts','Test Accounts (alias; hindari password)','textarea'],['ownedDomains','Owned Domains','textarea'],['testWorkspaces','Test Workspaces','textarea'],['dummyMarkers','Dummy Markers','textarea']];
export const guards=[['inScope','Target confirmed in-scope'],['account','Testing account authorized'],['data','Testing data owned'],['automation','Automation rules understood'],['rateLimits','Rate limits understood'],['destructive','Restrictions reviewed / destructive testing understood'],['knownIssues','Known issues reviewed']];
export function renderScope(ctx,target) {
  const root=el('div',{},ctx.heading('Scope & Engagement Guard','Catat batas engagement sebelum menjalankan pengujian manual.'));
  const checks=el('div',{class:'checklist'});
  for(const [key,label] of guards) {const input=el('input',{type:'checkbox','aria-label':label});input.checked=!!target.scope.guard?.[key];input.addEventListener('change',()=>ctx.store.updateTarget(target.id,{scope:{...target.scope,guard:{...target.scope.guard,[key]:input.checked}}}));checks.append(el('label',{},input,label));}
  root.append(panel('Engagement Guard',el('p',{class:'muted'},'Checklist dokumentasi manual. Catatan ini tidak memvalidasi target secara otomatis.'),checks));
  const rules=el('div',{class:'checklist'});
  for(const [key,label] of [['automationAllowed','Program secara eksplisit mengizinkan automation'],['dosAllowed','Program secara eksplisit mengizinkan DoS testing'],['thirdPartyTesting','Program secara eksplisit mengizinkan testing pihak ketiga']]){const input=el('input',{type:'checkbox','aria-label':label});input.checked=target.programRules[key];input.addEventListener('change',()=>ctx.store.updateTarget(target.id,{programRules:{...target.programRules,[key]:input.checked}}));rules.append(el('label',{},input,label));}
  root.append(panel('Hard Program Rules',el('p',{class:'notice'},'Default: tidak diizinkan. Centang hanya jika rules program menyatakan izin. AI tidak dapat mengubah flags ini. Aplikasi tetap hanya membantu riset manual.'),rules));
  const form=el('form',{class:'form-grid'});
  for(const definition of scopeFields) {const input=field(form,definition,target.scope[definition[0]]);input.addEventListener('input',()=>ctx.store.updateTarget(target.id,{scope:{...target.scope,[definition[0]]:input.value}}));}
  form.addEventListener('submit',e=>e.preventDefault());root.append(panel('Scope & testing resources',form));return root;
}
