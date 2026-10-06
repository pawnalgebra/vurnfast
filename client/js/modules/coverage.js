import {el,panel,badge,empty} from '../utils.js';
import {coverageAnalysis} from '../services/analysis.js';
export function renderCoverage(ctx,target) {
  const root=el('div',{},ctx.heading('Research Gap Analyzer','Coverage dihitung dari test case yang sudah dicatat hasilnya.'));root.append(coveragePanels(target));return root;
}
export function coveragePanels(target) {
  const {coverage,gaps}=coverageAnalysis(target),grid=el('div',{class:'grid'});
  for(const group of coverage)grid.append(panel(group.label+' Coverage',badge(group.covered+' / '+group.total),el('p',{class:'muted'},'Untested:'),group.untested.length?el('ul',{},group.untested.map(item=>el('li',{},item))):empty(group.total?'Semua entri memiliki test tercatat.':'Belum ada entri yang dipetakan.')));
  grid.append(panel('Lifecycle & Surface Gaps',gaps.length?el('ul',{},gaps.map(g=>el('li',{},g))):el('p',{},'Revocation, async, dan cross-surface tests sudah tercatat.')));return grid;
}
