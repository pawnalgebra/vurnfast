import {discoverResearch,compactDiscoveryContext} from './discovery-intelligence.js';
import {CausalResearchGraph} from './causal-research-graph.js';
import {ContradictionAnalyzer} from './contradiction-analyzer.js';
import {NextHypothesisService,SelectiveStateSpaceService} from './next-hypothesis.js';
import {policyFor} from './rules.js';
import {buildResearchContext} from './context.js';
import {researchFingerprint} from './research-integrity.js';
import {ResearchPriorityService} from './research-priority.js';
const advancedResearchCache=new WeakMap();
export function compactAdvancedContext(research,{focusIds=[]}={}){
  const rank=rows=>[...rows].sort((a,b)=>Number(focusIds.includes(b.id)||focusIds.includes(b.signalId))-Number(focusIds.includes(a.id)||focusIds.includes(a.signalId)));
  const nodes=research.relevantGraph.nodes.slice(0,40),ids=new Set(nodes.map(n=>n.id));
  return {...research,discovery:compactDiscoveryContext(research.discovery,{focusIds}),signals:rank(research.signals).slice(0,4),hypotheses:rank(research.hypotheses).slice(0,4),nextTests:rank(research.nextTests).slice(0,4),relevantGraph:{...research.relevantGraph,nodes,edges:research.relevantGraph.edges.filter(e=>ids.has(e.from)&&ids.has(e.to)).slice(0,60)}};
}
export function analyzeAdvancedResearch(target){
  const key=researchFingerprint([target.researchModel,target.researchRevision,target.actors,target.objects,target.boundaries,target.hypotheses,target.testCases,target.findings,target.evidence,target.scope,target.programRules]);
  const cached=advancedResearchCache.get(target);if(cached?.key===key)return structuredClone(cached.value);
  const graph=new CausalResearchGraph(target),fullAnalysis=ContradictionAnalyzer.analyze(graph),scopeConfidence=policyFor(buildResearchContext(target)).canRecommend?100:0;
  const rankedSignals=ResearchPriorityService.rank(fullAnalysis.signals,{scopeConfidence});
  const analysis={...fullAnalysis,signals:rankedSignals.slice(0,12),explained:fullAnalysis.explained.slice(0,12),unresolvedQuestions:fullAnalysis.unresolvedQuestions.slice(0,16)},signalSummary={total:fullAnalysis.signals.length,included:analysis.signals.length,omitted:rankedSignals.slice(12).map(s=>({id:s.id,reason:'signal context budget; inspect model or focus a smaller research path'}))};
  const hypotheses=scopeConfidence?NextHypothesisService.generate({contradictions:analysis.signals,graph,currentHypotheses:target.hypotheses,rejectedExplanations:graph.model.rejectedExplanations,unresolvedQuestions:graph.model.unresolvedQuestions,scopeConfidence}):[];
  const nextTests=scopeConfidence?SelectiveStateSpaceService.select({signals:analysis.signals,observations:graph.model.observations,scopeConfidence}):[];
  const graphRoots=[...analysis.signals.flatMap(s=>[...s.events,...s.evidenceRefs,s.actorId,s.objectId,s.boundaryId]),...hypotheses.map(h=>h.invariantId)];
  const discovery=discoverResearch({graph,target,contradictions:analysis.signals,scopeConfidence});
  const discoverySignals=discovery.relationships.filter(r=>r.status==='VIOLATED').map(r=>{
    const evaluation=discovery.evaluations.find(e=>e.constraintId===r.constraintRefs[0]),constraint=discovery.constraints.find(c=>c.id===r.constraintRefs[0]),row=[...graph.model.events,...graph.model.observations].find(e=>evaluation.eventIds.includes(e.id));
    return {id:r.id,type:'target_constraint_relationship',actorId:row?.actorId||'',objectId:row?.objectId||'',boundaryId:row?.boundaryId||'',state:row?.state||'Unknown',authority:row?.effectiveAuthority||'Unknown',tenant:row?.tenant||'',surface:row?.surface||'',operation:constraint.operation,expected:JSON.stringify(constraint.expected),observed:r.summary,evidenceRefs:r.evidenceRefs,events:evaluation.eventIds,invariantId:constraint.id,confidence:r.confidence,alternativeExplanation:r.possibleExplanations.slice(1).join('; '),discriminatingTest:discovery.nextTests.find(t=>t.relationshipId===r.id)?.title||'Review missing target policy and evidence',requiresValidation:true,status:'RESEARCH_SIGNAL'};
  });
  analysis.signals.push(...discoverySignals.slice(0,Math.max(0,12-analysis.signals.length)));
  if(scopeConfidence)hypotheses.push(...NextHypothesisService.generate({contradictions:discoverySignals,graph,currentHypotheses:target.hypotheses,scopeConfidence}));
  graphRoots.push(...discoverySignals.flatMap(s=>[...s.events,...s.evidenceRefs,s.actorId,s.objectId]));
  const value={discovery,...analysis,signalSummary,hypotheses,nextTests,relevantGraph:graph.relevantSubgraph(graphRoots),scopeConfidence,status:analysis.signals.length?'CONTRADICTION_DETECTED':graph.model.observations.length?'OBSERVATION_READY':'UNKNOWN',completedMeaning:'Only the current research path; research space is not exhausted.'};
  advancedResearchCache.set(target,{key,value});return structuredClone(value);
}
