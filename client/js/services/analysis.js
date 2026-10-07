// MODULE: Deterministic manual helpers; recommendations never certify a vulnerability.
export function coverageAnalysis(target) {
  const tested=target.testCases.filter(t=>t.result && t.result!=='not-tested');
  const dimensions=[['Technique',target.techniques.filter(t=>t.enabled).map(t=>[t.id,t.name]),'techniqueId'],['Actor',target.actors.map(a=>[a.id,a.name]),'actorId'],['Object',target.objects.map(o=>[o.id,o.name]),'objectId'],['State',[...new Set([...target.objects.map(o=>o.state),...target.hypotheses.map(h=>h.state),...target.testCases.map(t=>t.state)].filter(Boolean))].map(s=>[s,s]),'state'],['Boundary',target.boundaries.map(b=>[b.id,b.from+' → '+b.to]),'boundaryId']];
  const recordedMatch=(test,key,value,name)=>test[key]?test[key]===value:(key==='actorId'?test.who===name:key==='objectId'?test.object===name:false);
  const coverage=dimensions.map(([label,items,key])=>({label,total:items.length,covered:items.filter(([value,name])=>tested.some(t=>recordedMatch(t,key,value,name))).length,untested:items.filter(([value,name])=>!tested.some(t=>recordedMatch(t,key,value,name))).map(([,name])=>name)}));
  const names=tested.map(t=>(target.techniques.find(v=>v.id===t.techniqueId)?.name||'')+' '+t.state).join(' ').toLowerCase();
  const gaps=[];if(!/revok|revoke|revocation|dicabut/.test(names))gaps.push('Belum ada revocation test yang dicatat.');if(!/async|queue|worker/.test(names))gaps.push('Belum ada async/queue test yang dicatat.');if(!/multi-surface|cross.surface|differential/.test(names))gaps.push('Belum ada differential multi-surface test yang dicatat.');
  return {coverage,gaps};
}
export function compareText(left,right) {
  const a=String(left).split('\n'),b=String(right).split('\n');
  const leftLines=new Set(a),rightLines=new Set(b);
  return [...new Set([...a,...b])].map(line=>({line,status:leftLines.has(line)&&rightLines.has(line)?'same':leftLines.has(line)?'left-only':'right-only'}));
}
export function duplicateComparison(finding,candidate) {
  const fields=['rootCause','securityRestriction','vulnerabilityClass','affectedComponent','impact'];
  const words=text=>new Set(String(text||'').toLowerCase().split(/[^\p{L}\p{N}]+/u).filter(w=>w.length>2));
  const matches=fields.map(key=>{const a=words(finding[key]),b=words(candidate[key]);const union=new Set([...a,...b]);return {field:key,score:union.size?[...a].filter(w=>b.has(w)).length/union.size:0,present:a.size>0&&b.size>0};});
  const present=matches.filter(m=>m.present),score=present.length?present.reduce((n,m)=>n+m.score,0)/present.length:0;
  return {status:present.length<2?'Unknown':score>=.8?'Likely Duplicate':score>=.35?'Possible Variant':'Likely Unique',score:Math.round(score*100),matches,note:'Kemiripan teks lokal, bukan keputusan duplicate program. Periksa root cause, boundary, primitive, component, dan impact secara manual.'};
}
export function findingChecklist(finding) {
  return [['Expected result',!!finding.expectedResult],['Actual observation',!!finding.actualResult],['Starting authority',!!finding.startingAuthority],['Protected resource',!!finding.protectedResource],['Security restriction',!!finding.securityRestriction],['Reproduction steps',!!finding.steps],['Evidence attached',(finding.evidenceIds||[]).length>0],['Impact documented',!!finding.impact]].map(([label,present])=>({label,present}));
}
