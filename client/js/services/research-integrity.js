// Change detection only, not an authentication signature. Full canonical content stays local.
export function researchFingerprint(value){
  const text=JSON.stringify(value);let a=2166136261,b=2246822507;
  for(let i=0;i<text.length;i++){const c=text.charCodeAt(i);a=Math.imul(a^c,16777619);b=Math.imul(b^c,3266489909);}
  return (a>>>0).toString(16).padStart(8,'0')+(b>>>0).toString(16).padStart(8,'0')+':'+text.length;
}
export function observationFingerprint(row){
  const ignored=new Set(['createdAt','updatedAt','reportMarkdown','reportSourceFingerprint','agentReportProposalId']);
  return researchFingerprint(Object.fromEntries(Object.keys(row).filter(k=>!ignored.has(k)).sort().map(k=>[k,row[k]])));
}
export function reportSourceFingerprint(target,finding){
  return researchFingerprint({target:[target.name,target.platform,target.asset,target.environment,target.version],finding:observationFingerprint(finding),technique:target.techniques.find(t=>t.id===finding.techniqueId)||null,evidence:(finding.evidenceIds||[]).map(id=>{const row=target.evidence.find(e=>e.id===id);return row?observationFingerprint(row):null;})});
}
