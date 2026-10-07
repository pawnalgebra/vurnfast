import {environmentReadiness} from '../services/environment.js';
import {el,button,panel,badge,formulaView} from '../utils.js';
import {editHypothesis} from './hypotheses.js';
import {editTarget} from './targets.js';
import {coverageAnalysis} from '../services/analysis.js';
import {renderAgentDashboard} from './agent-research.js';
import {renderNextResearchWork} from './research-navigation.js';
import {renderAdvancedResearchPanel} from './advanced-research.js';
export function renderDashboard(ctx,target) {
  if(target&&ctx.aiConnection.agentic.enabled&&ctx.aiConnection.agentic.configured)return renderAgentDashboard(ctx,target);
  const root=el('div',{},ctx.heading('Research Dashboard',target?'Riset terstruktur, dari invariant hingga evidence.':'Buat workspace untuk memulai riset manual lintas program.',button(target?'+ New Hypothesis':'+ Create Target',()=>target?editHypothesis(ctx,target):editTarget(ctx),'primary')));
  if(!target){root.append(panel('Mulai dengan sebuah target',el('p',{class:'muted'},'Tentukan program dan scope, petakan actor serta object, pilih technique, lalu dokumentasikan pengujian. Seluruh data disimpan di browser ini.'),el('div',{class:'workflow'},['Target','Scope','Attack Surface','Technique','Hypothesis','Test','Finding','Report'].map((v,i)=>[i?'→ ':null,badge(v)]))),panel('Universal Formula',formulaView({who:'Actor',what:'Action',object:'Resource',state:'Lifecycle',authority:'Permission',context:'Environment'})));return root;}
  root.append(el('a',{href:'#research-environment'},'Environment: '+environmentReadiness(target)));
  root.append(renderNextResearchWork(ctx,target));
  root.append(el('div',{class:'stats'},[['Pending Tests',target.testCases.filter(t=>!t.result||t.result==='not-tested').length],['Results to Review',target.testCases.filter(t=>['failed','interesting'].includes(t.result)).length],['Findings',target.findings.length]].map(([label,value])=>el('div',{class:'stat'},el('strong',{},value),el('small',{},label)))));
  root.append(el('div',{class:'workflow'},[['scope','Scope'],['target-intelligence','Understand Target'],['attack-surface','Actors / Objects'],['business-flows','Business Flow'],['hypotheses','Hypothesis'],['tests','Manual Test'],['evidence','Evidence'],['findings','Review Finding'],['reports','Report']].map(([route,label],i)=>[i?'?':null,el('a',{href:'#'+route},label)])));
  if(target.researchModel||target.evidence.length)root.append(el('details',{class:'panel',...(target.researchModel?{open:true}:{})},el('summary',{},'Relationship Analysis'),renderAdvancedResearchPanel(ctx,target)));
  root.append(el('details',{class:'panel'},el('summary',{},'Recorded Coverage'),el('p',{class:'muted'},'Recorded tests are not security assurance. Review untested dimensions when selecting the next hypothesis.'),el('div',{class:'badges'},coverageAnalysis(target).coverage.map(g=>badge(g.label+': '+g.covered+' / '+g.total))),el('a',{href:'#coverage'},'Review Research Gaps')));
  return root;
}
