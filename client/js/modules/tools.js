import {el,panel,badge,empty} from '../utils.js';
import {TOOL_KB,HELPER_KB} from '../knowledge-data.js';
import {buildResearchContext} from '../services/context.js';
import {policyFor,filterCandidates} from '../services/rules.js';
// MODULE: Offline curated tool recommendations; names/descriptions are never invented by AI.
export function recommendLocalTools(target,techniqueId='') {
  const context=buildResearchContext(target,{techniqueId}),policy=policyFor(context);
  const technique=target.techniques.find(t=>t.id===techniqueId);
  const tags=[technique?.domain||'',...(technique?.name.toLowerCase().includes('websocket')?['realtime']:[]),...(technique?.domain==='auth'?['authorization']:[])];
  return {policy,tools:policy.canRecommend?filterCandidates(TOOL_KB,policy.rules).map(tool=>({...tool,relevance:tool.categories.filter(category=>tags.includes(category)).length})).filter(tool=>!techniqueId||tool.relevance>0).sort((a,b)=>b.relevance-a.relevance):[]};
}
export function renderTools(ctx,target) {
  const root=el('div',{},ctx.heading('Tool & Helper Knowledge','Katalog offline dengan mode penggunaan manual. Aplikasi tidak menjalankan tools.'));
  const select=el('select',{'aria-label':'Technique untuk tool recommendation'},el('option',{value:''},'Semua teknik'),target.techniques.map(t=>el('option',{value:t.id},t.name)));select.value=ctx.toolTechniqueId||'';select.addEventListener('change',()=>{ctx.toolTechniqueId=select.value;ctx.render();});root.append(panel('Technique → Tool KB → Hard Scope Filter',select));
  const {policy,tools}=recommendLocalTools(target,select.value);root.append(el('div',{class:'notice'},policy.assessment.status+' · '+policy.assessment.reason));
  if(!tools.length)root.append(empty('Tidak ada rekomendasi dalam scope yang dicatat. Lengkapi checklist izin dan scope, atau pilih teknik lain.'));
  for(const tool of tools)root.append(panel(tool.name,el('div',{class:'badges'},badge('manual'),tool.categories.map(badge)),el('p',{},tool.description),el('p',{class:'muted'},tool.scopeWarning),el('p',{class:'mono'},tool.documentation)));
  root.append(panel('Internal Helpers',HELPER_KB.map(helper=>el('p',{},el('strong',{},helper.name+' · '),helper.purpose)),el('a',{href:'#helpers'},'Buka helpers →')));return root;
}
