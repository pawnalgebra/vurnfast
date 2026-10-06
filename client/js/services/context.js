// MODULE: Explicit allowlist context builder; keys/config and unrelated targets never enter prompts.
export const lines=value=>String(value||'').split('\n').map(v=>v.trim()).filter(Boolean);
export function buildResearchContext(target,options={}) {
  const scope=target.scope||{},guard=scope.guard||{};
  const choose=(row,keys)=>Object.fromEntries(keys.map(k=>[k,row[k]??'']));
  return {
    operation:options.operation||'research_advice',
    target:{program:target.name,platform:target.platform,asset:target.asset,environment:target.environment||'',version:target.version||''},
    authorization:{authorized:guard.inScope===true,ownedAccountsOnly:guard.account===true,ownedDataOnly:guard.data===true},
    programRules:{automationAllowed:target.programRules?.automationAllowed===true,dosAllowed:target.programRules?.dosAllowed===true,thirdPartyTesting:target.programRules?.thirdPartyTesting===true},
    scope:{inScope:lines(scope.inScope),outOfScope:lines(scope.outOfScope),testingRules:lines(scope.testingRestrictions),automationRules:lines(scope.automationRules),knownIssues:lines(scope.knownIssues),rateLimits:scope.rateLimits||'',safeHarbor:scope.safeHarbor||''},
    research:{goal:options.goal||'',technique:options.techniqueId?target.techniques.find(t=>t.id===options.techniqueId)?.name||'':'',hypothesis:options.hypothesisId?target.hypotheses.find(h=>h.id===options.hypothesisId)?.title||'':'',notes:options.notes||''},
    actors:target.actors.map(row=>choose(row,['name','authority','notes'])),
    objects:target.objects.map(row=>choose(row,['name','type','owner','tenant','state','sensitivity','notes'])),
    boundaries:target.boundaries.map(row=>choose(row,['id','from','to','channel','authority','trust','notes'])),
    techniques:target.techniques.filter(t=>t.enabled).map(row=>choose(row,['id','libraryId','name','domain','description','securityInvariant','stopCondition'])),
    hypotheses:target.hypotheses.map(row=>choose(row,['title','invariant','potentialFailure','who','what','object','state','authority','context','status'])),
    tests:target.testCases.map(row=>choose(row,['id','title','techniqueId','who','what','object','state','authority','context','boundaryId','result','expectedResult','actualResult',...(options.includeEvidence?['requestNotes','responseNotes']:[])])),
    findings:target.findings.map(row=>choose(row,['id','title','affectedComponent','rootCause','securityRestriction','vulnerabilityClass','impact','status'])),
    finding:options.findingId?(()=>{const f=target.findings.find(row=>row.id===options.findingId);return f?choose(f,['title','affectedComponent','affectedVersion','vulnerabilityClass','startingAuthority','securityRestriction','protectedResource','unauthorizedOutcome','rootCause','impact','preconditions','steps','expectedResult','actualResult','researchNotes','severity','testCaseId','who','what','object','state','authority','context']):null;})():null,
    evidence:options.includeEvidence?target.evidence.filter(e=>!options.findingId || target.findings.find(f=>f.id===options.findingId)?.evidenceIds?.includes(e.id)).map(row=>choose(row,['type','label','description','content'])):[],
    knowledge:options.includeKnowledge?target.knowledgeBase.map(row=>choose(row,['category','title','content','source','rootCause','securityRestriction','vulnerabilityClass','affectedComponent','impact'])):[],
    report:options.report||''
  };
}
