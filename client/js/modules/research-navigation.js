import {el,button,panel} from '../utils.js';
import {routeTo,routeSections,routeSectionFor} from '../router.js';
import {nextResearchWork} from '../services/research-workflow.js';
export function researchSectionLinks(section,current){return el('nav',{class:'actions research-tabs','aria-label':'Related research pages'},(routeSections[section]||[]).map(([route,label])=>el('a',{href:'#'+route,'aria-current':route===current?'page':null},label)));}
export function researchRouteLinks(current){
  const section=routeSectionFor(current);if(!section)return null;
  return researchSectionLinks(section,['ai-techniques','ai-tools','ai-gaps','ai-findings'].includes(current)?'ai':current);
}
export function renderNextResearchWork(ctx,target){
  const root=panel('Next Manual Work',el('p',{class:'muted'},'Follow the evidence; optional AI does not replace manual testing or review.'));
  for(const task of nextResearchWork(target))root.append(el('div',{class:'record'},button(task.kind+': '+task.title,()=>{if(task.kind==='Report')ctx.reportFindingId=task.id;else if(task.id&&['tests','hypotheses','findings'].includes(task.route))ctx.filterState[task.route]={query:task.title};routeTo(task.route);}),el('p',{class:'muted'},task.reason)));
  root.append(el('div',{class:'actions'},el('a',{href:'#notes'},'Research Notes'),el('a',{href:'#coverage'},'Research Gaps')));return root;
}
