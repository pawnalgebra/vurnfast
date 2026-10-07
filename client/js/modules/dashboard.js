import {environmentReadiness} from '../services/environment.js';
import {el,button,panel,badge,formulaView,empty} from '../utils.js';
import {routeTo} from '../router.js';
import {editHypothesis} from './hypotheses.js';
import {editTarget} from './targets.js';
import {coverageAnalysis} from '../services/analysis.js';
import {renderAgentDashboard} from './agent-research.js';
export function renderDashboard(ctx,target) {
  if(target&&ctx.aiConnection.agentic.enabled&&ctx.aiConnection.agentic.configured)return renderAgentDashboard(ctx,target);
  const root=el('div',{},ctx.heading('Research Dashboard',target?'Riset terstruktur, dari invariant hingga evidence.':'Buat workspace untuk memulai riset manual lintas program.',button(target?'+ New Hypothesis':'+ Create Target',()=>target?editHypothesis(ctx,target):editTarget(ctx),'primary')));
  if(!target){root.append(panel('Mulai dengan sebuah target',el('p',{class:'muted'},'Tentukan program dan scope, petakan actor serta object, pilih technique, lalu dokumentasikan pengujian. Seluruh data disimpan di browser ini.'),el('div',{class:'workflow'},['Target','Scope','Attack Surface','Technique','Hypothesis','Test','Finding','Report'].map((v,i)=>[i?'→ ':null,badge(v)]))),panel('Universal Formula',formulaView({who:'Actor',what:'Action',object:'Resource',state:'Lifecycle',authority:'Permission',context:'Environment'})));return root;}
  root.append(el('a',{href:'#research-environment'},'Environment: '+environmentReadiness(target)));
  const metrics=[['Hypotheses',target.hypotheses.length],['Tested',target.testCases.filter(t=>t.result!=='not-tested').length],['Interesting',target.testCases.filter(t=>t.result==='interesting').length+target.hypotheses.filter(h=>h.status==='interesting').length],['Confirmed Findings',target.findings.filter(f=>f.status==='confirmed').length],['Rejected',target.hypotheses.filter(h=>h.status==='rejected').length+target.findings.filter(f=>f.status==='rejected').length],['Out of Scope',target.hypotheses.filter(h=>h.status==='out-of-scope').length+target.findings.filter(f=>f.status==='out-of-scope').length]];
  root.append(el('div',{class:'stats'},metrics.map(([label,value])=>el('div',{class:'stat'},el('strong',{},value),el('small',{},label)))));
  root.append(panel('Research Coverage',el('div',{class:'badges'},coverageAnalysis(target).coverage.map(group=>badge(group.label+': '+group.covered+' / '+group.total))),el('a',{href:'#coverage'},'Review untested actors, objects, states, boundaries, dan techniques →')));
  root.append(panel('Universal Formula',formulaView({who:'Actor / role',what:'Protected action',object:'Owned resource',state:'Current lifecycle',authority:'Session / capability',context:'Tenant / origin'}),el('p',{class:'muted'},'Mulai dari security invariant lalu ubah satu dimensi setiap kali.')),el('div',{class:'workflow'},[['targets','Target'],['scope','Scope'],['attack-surface','Map Surface'],['techniques','Technique'],['hypotheses','Hypothesis'],['tests','Manual Test'],['evidence','Evidence'],['findings','Finding'],['reports','Report']].map(([route,label],i)=>[i?'→':null,el('a',{href:'#'+route},label)])));
  const grid=el('div',{class:'grid'});
  const progress=panel('Technique Progress',el('p',{class:'muted'},'Tested / seluruh test case yang dicatat per technique.'));
  for(const technique of target.techniques.filter(t=>t.enabled)) {
    const tests=target.testCases.filter(t=>t.techniqueId===technique.id),count=tests.filter(t=>t.result!=='not-tested').length;
    const fill=el('div',{class:'progress-fill'});fill.style.width=(tests.length?count/tests.length*100:0)+'%';
    progress.append(el('div',{class:'progress-row'},el('div',{class:'progress-label'},el('span',{},technique.name),el('span',{class:'mono'},count+' / '+tests.length)),el('div',{class:'progress-track'},fill)));
  }
  const queue=panel('Research Queue',el('p',{class:'muted'},'Prioritaskan pertanyaan yang akan diuji berikutnya.'));
  const rows=target.hypotheses.filter(h=>['Next','Testing','Interesting'].includes(h.queue));
  if(!rows.length)queue.append(empty('Pindahkan hypothesis ke Next atau Testing untuk mengisi antrean.'));
  for(const row of rows)queue.append(el('div',{class:'record'},el('h3',{},row.title),badge(row.queue),el('p',{class:'muted'},row.invariant||'Invariant belum dicatat')));
  queue.append(button('Buka hypotheses',()=>routeTo('hypotheses')));grid.append(progress,queue);root.append(grid);return root;
}
