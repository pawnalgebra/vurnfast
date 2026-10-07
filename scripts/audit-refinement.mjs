// Static architecture inventory only. Never read research databases, .env or credentials.
import {existsSync,readdirSync,readFileSync,writeFileSync} from 'node:fs';
import {resolve,relative,dirname} from 'node:path';
import {featureRegistry} from '../client/js/feature-registry.js';
import {routes,navigationGroups} from '../client/js/router.js';
import {agentStages} from '../client/js/services/agent-schema.js';
import {knowledgeOperations} from '../client/js/services/knowledge-schema.js';
const root=resolve('.'),walk=dir=>readdirSync(dir,{withFileTypes:true}).flatMap(entry=>entry.isDirectory()?walk(resolve(dir,entry.name)):entry.name.endsWith('.js')?[resolve(dir,entry.name)]:[]);
const sources=[...walk(resolve('client/js')),...walk(resolve('server'))].filter(path=>!['bundle.js','domain-data.js','feature-registry.js','technique-data.js','knowledge-data.js'].includes(path.split(/[\\/]/).at(-1)));
const sourceRows=sources.map(path=>({path:relative(root,path).replaceAll('\\','/'),absolute:path,source:readFileSync(path,'utf8')}));
const weights=(researchValue,usageValue,workflowImportance,complexity,maintenanceCost,aiCost,dataValue,growthPotential)=>({researchValue,usageValue,workflowImportance,complexity,maintenanceCost,aiCost,dataValue,growthPotential});
const changes={
  dashboard:['SIMPLIFY','Removed non-decision metrics, repeated formulas, technique progress and repeated agent summaries; shared Next Manual Work now leads both dashboards.'],
  actors:['MERGE','Actor CRUD remains inside Attack Surface and its contextual tabs; a standalone sidebar entry adds no capability.'],
  objects:['MERGE','Object CRUD remains inside Attack Surface and its contextual tabs.'],
  boundaries:['MERGE','Boundary mapping remains inside Attack Surface; existing IDs/deep links survive.'],
  queue:['MERGE','The same hypothesis planning board is optional within Hypotheses; no separate sidebar detour.'],
  terminology:['MERGE','Terminology remains in contextual Target Understanding/Domain navigation.'],
  'critical-assets':['MERGE','Assets remain contextual to target/domain understanding.'],
  'research-questions':['MERGE','Questions stay connected to domain knowledge and hypothesis conversion.'],
  'ai-techniques':['MERGE','Optional reasoning operation remains in one Research Assistant selector.'],
  'ai-tools':['MERGE','Optional reasoning remains in the shared assistant; manual tool selection is contextual to Techniques.'],
  'ai-findings':['MERGE','Finding reasoning stays optional in the shared assistant and selected message context.'],
  'ai-analyze-scope':['MERGE','Local policy checker replaces a provider call for exact supplied scope/rule assessment.'],
  'ai-restrictions':['MERGE','Existing rules engine supplies exact restrictions locally.'],
  'ai-helper-advisor':['MERGE','Existing helper catalog is selected locally from records; no model ranking needed.'],
  'ai-gaps':['MERGE','One deterministic coverage analyzer replaces a duplicate gap page/model call; legacy route remains.'],
  'helper-trust-boundary':['REMOVE','Removed from normal helper picker: it only forwarded to canonical boundary CRUD. Compatibility mode remains.'],
  'helper-report-builder':['REMOVE','Removed from normal helper picker: it only forwarded to Reports. Findings already provide the action.'],
  'helper-gap-analyzer':['REMOVE','Removed from normal helper picker: the same coverage view is available from Next Manual Work. Compatibility mode remains.'],
  'helper-authorization-matrix':['STRENGTHEN','Expected controls can open editable hypotheses instead of remaining isolated helper rows.'],
  'helper-state-transition':['STRENGTHEN','Transition notes can open editable hypotheses with state/authority context.'],
  hypotheses:['SIMPLIFY','Planning/metadata fields are optional details; queue is collapsed. All values and existing records survive.'],
  tests:['SIMPLIFY','Actual result and manual plan remain visible; authentication/request metadata is optional.'],
  findings:['STRENGTHEN','Inline completeness, alternative explanations and local duplicate checks sit before report preparation.'],
  coverage:['STRENGTHEN','Stable actor/object IDs survive renames; legacy text snapshots still match when IDs are unavailable.'],
  'helper-evidence-comparator':['STRENGTHEN','Set lookup removes quadratic line membership scans without changing output ordering.'],
  'ai':['SIMPLIFY','Reasoning/refinement operations remain; four simple record/policy operations use local replacements. Identical valid requests reuse cache.'],
  'backup':['MERGE','Backups are contextual under Settings; duplicate Import Backup/Import Workspace controls are reduced to one normal import action. Recovery retains its explicit Import Backup.'],
  'ai-provider':['MERGE','Provider settings remain contextual in Settings.'],
  'agentic-settings':['MERGE','Optional agent settings remain contextual in Settings.'],
  'tool-inventory':['MERGE','Executable-capability inventory remains contextual in Settings and distinct from curated manual tool knowledge.'],
  'research-environment':['SIMPLIFY','Optional account/auth metadata stays linked from target dashboard/settings; never required for manual research.'],
  'agent-history':['MERGE','History remains contextual to agent workflow; repeated dashboard history summaries removed.'],
  'manual-analysis':['SIMPLIFY','Researcher corrections/replanning remain optional agent controls; manual notes are directly accessible from Next Manual Work.'],
  'agentic-research':['SIMPLIFY','Supervised pipeline is optional; local contradictions/tests and shared manual work precede agent progress display.'],
  'research-priority':['SIMPLIFY','Prioritization remains a research heuristic; it never claims severity or exhaustiveness.']
};
const complex=new Set(['workspace-storage','knowledge-ai','domain-knowledge','research-environment','agentic-research','agent-message','agent-review','knowledge-provenance','ai-review','ai-privacy']);
const features=featureRegistry.map(f=>{
  const ai=(!!f.operation&&!['analyze_scope','identify_restrictions','recommend_helpers','gap_analysis'].includes(f.operation))||['knowledge-ai','agentic-research','agent-message'].includes(f.id),core=['targets','scope','engagement-guard','rules-engine','evidence','tests','findings','reports','hypotheses','backup','workspace-storage','knowledge-provenance'].includes(f.id),highComplexity=complex.has(f.id),low=changes[f.id]?.[0]==='REMOVE';
  return {id:f.id,name:f.name,classification:changes[f.id]?.[0]||'KEEP',scores:low?weights(1,1,1,1,1,0,0,1):weights(core?5:4,core?5:3,core?5:4,highComplexity?5:ai?3:2,highComplexity?4:2,f.id==='agentic-research'?5:ai?3:0,core?5:3,core?5:4),rationale:changes[f.id]?.[1]||f.purpose,workflowContribution:f.purpose,routes:f.routes,operation:f.operation};
});
for(const [id,name,classification,rationale] of [
  ['relationship-analysis','Normalized observations / causal graph / contradictions','KEEP','Evidence-derived state/authority reasoning helps identify what requires a matched control. Scope and raw provenance remain authoritative.'],
  ['chain-discovery','Bounded multi-hop discovery','SIMPLIFY','Retain bounded candidates and explicit omissions; templates are research aids, not novelty or vulnerability proof.'],
  ['target-constraints','Reviewed target constraint evaluation','KEEP','Distinguishes target policy from generic security assumptions.'],
  ['uncertainty-competing','Uncertainty / competing explanations','KEEP','Keeps UNKNOWN and required evidence visible; does not settle explanations through model confidence.'],
  ['next-test-ranking','Information-gain manual test selection','SIMPLIFY','Retain useful matched controls, describe fixed scoring/template limits honestly.'],
  ['observation-extraction','Reviewed structured observation extraction','KEEP','Proposed fields require unchanged raw input and researcher review.'],
  ['logical-operation','Logical operation matching','KEEP','Explicit business intent/object/context compare replaces misleading URL-only comparisons.'],
  ['failed-path-memory','Reviewed rejected/explained path memory','KEEP','Avoids repeated hypotheses until related dependencies change.'],
  ['context-retrieval','Dependency-aware context selection','STRENGTHEN','Set lookups improve selection; evidence omissions cap conclusions.'],
  ['result-cache','Research and model result caches','SIMPLIFY','Removed nested discovery cache; one graph analysis cache tracks all mapping dependencies. Advisor and provider-scoped specialist caches stay bounded.']
])features.push({id,name,classification,scores:weights(4,3,4,4,3,id==='observation-extraction'?3:0,4,4),rationale,workflowContribution:'Observation -> hypothesis -> discriminating test -> evidence review',routes:[],operation:null});
const files=sourceRows.map(row=>{
  const imports=[...row.source.matchAll(/^import .*? from ['"](.+?)['"];?/gm)].map(match=>match[1]).filter(path=>path.startsWith('.')).map(path=>relative(root,resolve(dirname(row.absolute),path)).replaceAll('\\','/'));
  const incoming=sourceRows.filter(source=>[...source.source.matchAll(/^import .*? from ['"](.+?)['"];?/gm)].some(match=>match[1].startsWith('.')&&resolve(dirname(source.absolute),match[1])===row.absolute)).map(source=>source.path);
  return {path:row.path,lines:row.source.split('\n').length,imports,incoming,classification:/advanced-research|analysis\.js|advisor|context-selection|dashboard|forms|hypotheses|tests\.js|findings\.js|router|navigation|workflow/.test(row.path)?'SIMPLIFY':'KEEP',boundary:row.path.startsWith('server/')?'Server providers/policy/orchestration':row.path.includes('/modules/')?'UI/review actions':'Shared local contracts/reasoning/storage',exports:[...row.source.matchAll(/export (?:async )?(?:class|function|const) (\w+)/g)].map(match=>match[1])};
});
const agents=[['general','General'],...agentStages.map(([id,name])=>[id,name])].map(([id,name])=>({id,name,classification:['scope','technique','general'].includes(id)?'SIMPLIFY':'KEEP',scores:weights(4,3,4,3,3,3,3,4),rationale:id==='domain-knowledge'?'Generic patterns must stay separate from target facts':id==='target-intelligence'?'Target-specific sourced context must stay separate from generic domain knowledge':id==='false-positive'?'An adversarial review has a different purpose from constructing the primary hypothesis':id==='duplicate'?'Program-specific duplicate uncertainty differs from evidence validity':'Retained for explicit or supervised reasoning; never needed for manual research. Exact lookup/traversal/comparison uses local processing.'}));
const api=sourceRows.flatMap(row=>[...row.source.matchAll(/app\.(get|post)\(['"](\/api\/[^'"]+)/g)].map(match=>({method:match[1].toUpperCase(),path:match[2],source:row.path})));
const dataModels=[['workspace','Schema 2.0.0, target separation, timestamps, domain overrides and tool inventory','KEEP'],['research-records','Actors/objects/boundaries/techniques/hypotheses/tests/evidence/findings/notes/lessons','KEEP'],['intelligence','Profile, reviewed source provenance, domain links and AI suggestions','KEEP'],['researchModel','Normalized snapshots, events, invariants, relations, constraints, decisions and failed paths','KEEP'],['agentResearch','Optional proposals/history/steps/messages/manual corrections and review state','SIMPLIFY'],['researchEnvironment','Optional metadata/account/auth profiles; separate encrypted vault references','KEEP'],['AI drafts','Advisor and knowledge suggestions use distinct schemas and remain reviewable drafts','KEEP'],['derived analysis','Graph/chain/scoring/context payloads remain transient; repeated discovery cache removed','SIMPLIFY']].map(([id,purpose,classification])=>({id,purpose,classification}));
writeFileSync('SYSTEM_FEATURE_AUDIT.json',JSON.stringify({basis:'Static source and regression workflow audit; 1–5 ordinal judgement, no usage telemetry. Complexity/maintenance/AI cost are burdens; other dimensions are value. AI cost 0 means no model call in that feature path, not no CPU/storage cost.',primaryNavigation:{before:40,after:navigationGroups.flatMap(([,keys])=>keys).length,compatibleRoutes:routes.length},features,files,agents,api,dataModels,knowledgeOperations},null,2)+'\n');
console.log(JSON.stringify({features:features.length,sourceFiles:files.length,agents:agents.length,api:api.length,classifications:Object.fromEntries(['KEEP','STRENGTHEN','SIMPLIFY','MERGE','REMOVE'].map(c=>[c,features.filter(f=>f.classification===c).length]))}));
const report='SYSTEM_REFINEMENT_REPORT.md',marker='<!-- FEATURE_DECISIONS -->';
if(existsSync(report)){
  const source=readFileSync(report,'utf8');
  if(source.includes(marker)){
    const cell=value=>String(value||'').replaceAll('|','/').replaceAll('\n',' ');
    const rows=features.map(f=>{const s=f.scores;return `| ${cell(f.id)} | ${f.classification} | ${s.researchValue}/${s.usageValue}/${s.workflowImportance} | ${s.complexity}/${s.maintenanceCost}/${s.aiCost} | ${s.dataValue}/${s.growthPotential} | ${cell(f.rationale)} |`;});
    writeFileSync(report,source.split(marker)[0]+marker+'\n\n| Capability | Decision | R/U/W | C/M/A | D/G | Why / resulting behavior |\n|---|---|---|---|---|---|\n'+rows.join('\n')+'\n');
  }
}
