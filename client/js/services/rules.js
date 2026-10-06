// MODULE: Hard program rules are authoritative; AI ranking receives only filtered candidates.
export const defaultProgramRules=()=>({automationAllowed:false,dosAllowed:false,thirdPartyTesting:false});
export const scopeStatuses=['within_supplied_scope','outside_supplied_scope','unclear_scope','requires_manual_review'];
export function assessScope(context) {
  const asset=(context.target?.asset||'').trim().toLowerCase();
  const excluded=(context.scope?.outOfScope||[]).map(v=>v.trim().toLowerCase());
  if(asset && excluded.some(line=>line===asset))return {status:'outside_supplied_scope',reason:'Asset cocok dengan entri out-of-scope yang diberikan.'};
  if(!asset || !(context.scope?.inScope||[]).length)return {status:'unclear_scope',reason:'Asset atau daftar in-scope belum dicatat.'};
  const auth=context.authorization||{};
  if(!auth.authorized || !auth.ownedAccountsOnly || !auth.ownedDataOnly)return {status:'requires_manual_review',reason:'Konfirmasi target, akun terotorisasi, dan kepemilikan data belum lengkap.'};
  return {status:'within_supplied_scope',reason:'Berdasarkan scope dan checklist yang dicatat peneliti; bukan validasi izin independen.'};
}
export function filterCandidates(candidates,rules={}) {
  return candidates.filter(candidate=>
    candidate.destructive!==true && candidate.credentialAttack!==true && candidate.massFuzzing!==true &&
    (!candidate.requiresAutomation || rules.automationAllowed===true) &&
    (!candidate.requiresThirdParty || rules.thirdPartyTesting===true) &&
    (!candidate.requiresDos || rules.dosAllowed===true) &&
    (!candidate.automationLevel || candidate.automationLevel==='manual' || rules.automationAllowed===true));
}
export function policyFor(context) {
  const rules={...defaultProgramRules(),...context.programRules};
  const assessment=assessScope(context);
  const restrictions=['Program rules mengikat seluruh rekomendasi.','Semua testing dijalankan manual oleh peneliti.','Tidak ada eksekusi tool atau interaksi target dari aplikasi.'];
  if(!rules.automationAllowed)restrictions.push('Automation tidak diizinkan oleh rules yang dicatat.');
  if(!rules.dosAllowed)restrictions.push('DoS dilarang.');
  if(!rules.thirdPartyTesting)restrictions.push('Testing pihak ketiga dilarang.');
  restrictions.push(...(context.scope?.testingRules||[]),...(context.scope?.automationRules||[]));
  return {rules,assessment,restrictions,canRecommend:assessment.status==='within_supplied_scope'};
}
