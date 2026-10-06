import {el,button,panel,badge,empty} from '../utils.js';
import {editDialog} from '../forms.js';
export const knowledgeCategories=['Technique Notes','Research Patterns','False Positives','Finding Patterns','Program Notes','Architecture Patterns','Lessons','Disclosed Reports'];
export function renderKnowledge(ctx,target) {
  const root=el('div',{},ctx.heading('Knowledge Base','Pola riset, false positives, disclosed reports, dan pelajaran per target.',button('+ Add Knowledge',()=>edit(),'primary')));
  const edit=row=>editDialog(row?'Edit Knowledge':'Add Knowledge',[['title','Title','required'],['category','Category','select',knowledgeCategories],['content','Content','textarea'],['source','Source / disclosed report reference'],['rootCause','Root Cause'],['securityRestriction','Security Boundary'],['vulnerabilityClass','Primitive'],['affectedComponent','Affected Component'],['impact','Impact']],row||{},values=>{ctx.store.upsert(target.id,'knowledgeBase',{...row,...values});ctx.render();});
  root.append(ctx.filters('knowledge',[['category','Category',knowledgeCategories]]));
  const rows=ctx.filtered(target.knowledgeBase,'knowledge');if(!rows.length)root.append(empty());
  for(const row of rows)root.append(panel(row.title,badge(row.category),el('pre',{},row.content||''),el('p',{class:'muted'},row.source||''),el('div',{class:'actions'},button('Edit',()=>edit(row)),ctx.deleteButton(target,'knowledgeBase',row))));return root;
}
