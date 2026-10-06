import {el,button,badge,formulaView,empty} from '../utils.js';
import {editDialog,formulaFields,formulaSuggestions} from '../forms.js';
import {editTest} from './tests.js';
export const hypothesisStatuses=['idea','planned','testing','interesting','confirmed','rejected','duplicate','out-of-scope'];
export const queueStages=['Backlog','Next','Testing','Interesting','Done'];
export const techniqueOptions=target=>[['','— Pilih technique —'],...target.techniques.map(t=>[t.id,t.name])];
export function editHypothesis(ctx,target,row,defaults={}) {
  const fields=[['title','Title','required'],['techniqueId','Technique','select',techniqueOptions(target)],['invariant','Security Invariant','textarea'],['expectedBehavior','Expected Behavior','textarea'],['potentialFailure','Potential Failure / Hypothesis','textarea'],...formulaFields(target),['priority','Priority','select',['high','medium','low']],['confidence','Confidence','select',['low','medium','high']],['status','Status','select',hypothesisStatuses],['queue','Research Queue','select',queueStages],['notes','Notes','textarea']];
  editDialog(row?'Edit Hypothesis':'Create Hypothesis',fields,{priority:'medium',confidence:'low',status:'idea',queue:'Backlog',...defaults,...row},values=>{ctx.store.upsert(target.id,'hypotheses',{...row,...values});ctx.render();},form=>formulaSuggestions(form,target));
}
export function researchFilters(ctx,target,key,statuses,extra=[]) {
  return ctx.filters(key,[['techniqueId','Technique',target.techniques.map(t=>[t.id,t.name])],['status','Status',statuses],['who','Actor',target.actors.map(a=>a.name)],['object','Object',target.objects.map(o=>o.name)],...extra]);
}
export function renderHypotheses(ctx,target) {
  const root=el('div',{},ctx.heading(ctx.route==='queue'?'Research Queue':'Hypotheses','Mulai dari invariant. Catat dugaan secara terpisah dari fakta yang teramati.',button('+ Create Hypothesis',()=>editHypothesis(ctx,target),'primary')));
  root.append(researchFilters(ctx,target,'hypotheses',hypothesisStatuses));
  const rows=ctx.filtered(target.hypotheses,'hypotheses');
  const queue=el('div',{class:'queue'});
  for(const stage of queueStages) {
    const group=rows.filter(h=>(h.queue||'Backlog')===stage);
    const column=el('section',{class:'queue-column'},el('h3',{},stage+' / '+group.length));
    for(const h of group) {const select=el('select',{'aria-label':'Queue '+h.title},queueStages.map(s=>el('option',{value:s},s)));select.value=stage;select.addEventListener('change',()=>{ctx.store.upsert(target.id,'hypotheses',{id:h.id,queue:select.value});ctx.render();});column.append(el('div',{class:'queue-item'},h.title,select));}
    queue.append(column);
  }
  root.append(queue);
  if(!rows.length)root.append(empty());
  for(const row of rows)root.append(el('article',{class:'record'},el('div',{class:'record-header'},el('h3',{},row.title),el('div',{class:'actions'},button('Buat Test Case',()=>editTest(ctx,target,null,row),'primary'),button('Edit',()=>editHypothesis(ctx,target,row)),ctx.deleteButton(target,'hypotheses',row))),el('div',{class:'badges'},badge(row.status),badge('Priority: '+row.priority),badge('Confidence: '+row.confidence),badge(target.techniques.find(t=>t.id===row.techniqueId)?.name||'Tanpa technique')),formulaView(row),el('dl',{class:'details'},el('dt',{},'Invariant'),el('dd',{},row.invariant||'—'),el('dt',{},'Expected Behavior'),el('dd',{},row.expectedBehavior||'—'),el('dt',{},'Potential Failure · dugaan'),el('dd',{},row.potentialFailure||'—'),el('dt',{},'Notes'),el('dd',{},row.notes||'—'))));
  return root;
}
