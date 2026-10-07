// Research interest, never severity. Missing factors remain uncertain rather than certain.
export class ResearchPriorityService {
  static score(row,{scopeConfidence=50}={}){
    const supplied=row.priorityFactors||{},f={potentialImpact:50,likelihood:50,novelty:50,businessCriticality:50,boundaryImportance:row.boundaryId?75:40,stateSensitivity:row.state?65:40,authoritySensitivity:row.authority||row.authorityProfileId?70:40,evidenceStrength:Math.min(100,(row.evidenceRefs||row.evidenceIds||[]).length*25),uncertainty:50,testingCost:row.testingCost??30,duplicateRisk:row.duplicateRisk??30,scopeConfidence,...supplied};
    for(const key of Object.keys(f))f[key]=Number.isFinite(f[key])?Math.max(0,Math.min(100,f[key])):50;
    const benefit=(f.potentialImpact*2+f.likelihood+f.novelty+f.businessCriticality+f.boundaryImportance+f.stateSensitivity+f.authoritySensitivity+f.evidenceStrength*2+f.uncertainty)/11;
    const manualAdjustment=row.priority==='high'?20:row.priority==='low'?-20:0;
    const score=Math.round(benefit*(.4+.6*f.scopeConfidence/100)-f.testingCost*.15-f.duplicateRisk*.15+manualAdjustment);
    return {score:Math.max(0,Math.min(100,score)),factors:f,reason:'Impact, boundary, state/authority, evidence and information gain, discounted by scope uncertainty, cost and duplicate risk.'};
  }
  static rank(rows,options){return rows.map(row=>({row,priority:this.score(row,options)})).sort((a,b)=>b.priority.score-a.priority.score||String(a.row.id).localeCompare(String(b.row.id))).map(({row,priority})=>({...row,researchRanking:priority}));}
}
