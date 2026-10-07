import {buildAgentContext} from './agent-context.js';
import {SecretRedactor} from './redactor.js';
import {contextCollections,messageReferenceRows} from './agent-messages.js';
export class ResearchContextBuilder{
  build({workspace,target,page,contextRefs,message,recentMessages=[],summary=''}){
    const ids={};for(const kind of Object.keys(contextCollections))ids[kind]=new Set();
    const references=messageReferenceRows(target);
    for(const ref of contextRefs){if(!references.some(r=>r.kind===ref.kind&&r.id===ref.id))throw new Error('Context reference sudah dihapus atau bukan target aktif.');ids[ref.kind]?.add(ref.id);}
    const add=(kind,id)=>{if(id)ids[kind].add(id);};
    for(const id of ids.report)add('finding',id);
    const selectedFindings=target.findings.filter(r=>ids.finding.has(r.id));
    for(const row of selectedFindings){add('test',row.testCaseId);add('technique',row.techniqueId);for(const id of (row.evidenceIds||[]).slice(0,4))add('evidence',id);}
    for(const row of target.evidence.filter(r=>ids.evidence.has(r.id))){add('test',row.testCaseId);add('finding',row.findingId);}
    for(const row of target.testCases.filter(r=>ids.test.has(r.id))){add('hypothesis',row.hypothesisId);add('technique',row.techniqueId);for(const id of (row.evidenceIds||[]).slice(0,4))add('evidence',id);}
    for(const row of target.hypotheses.filter(r=>ids.hypothesis.has(r.id)))add('technique',row.techniqueId);
    const query=[message,...selectedFindings.map(f=>f.title)].join(' ').toLowerCase(),tokens=query.split(/[^\p{L}\p{N}]+/u).filter(t=>t.length>3&&!['finding','evidence','hypothesis','jelaskan','analisis'].includes(t));
    const rank=rows=>rows.map((row,index)=>({row,index,score:tokens.filter(t=>[row.term,row.title,row.name,row.content,row.securityInvariant].filter(Boolean).join(' ').toLowerCase().includes(t)).length})).filter(r=>r.score>0).sort((a,b)=>b.score-a.score||a.index-b.index).map(r=>r.row);
    const choose=(kind,limit)=>target[contextCollections[kind]].filter(r=>ids[kind].has(r.id)).slice(0,limit);
    const profile={};for(const key of ['company','businessModel'])if(target.intelligence.profile[key]?.value)profile[key]=target.intelligence.profile[key];
    for(const [key,value] of Object.entries(target.intelligence.profile))if(Object.keys(profile).length<3&&value.value&&tokens.some(token=>key.toLowerCase().includes(token)))profile[key]=value;
    const selected={...target,actors:choose('actor',3),objects:choose('object',3),boundaries:choose('boundary',3),hypotheses:choose('hypothesis',4),testCases:choose('test',4),evidence:choose('evidence',4),findings:choose('finding',4),knowledgeBase:rank(target.knowledgeBase).slice(0,2),techniques:[...choose('technique',4),...rank(target.techniques.filter(t=>t.enabled&&!ids.technique.has(t.id))).slice(0,2)].slice(0,4),intelligence:{...target.intelligence,profile,items:rank(target.intelligence.items.filter(r=>r.status==='accepted')).slice(0,4)},agentResearch:{...target.agentResearch,manualAnalysis:target.agentResearch.manualAnalysis.slice(-3)}};
    // Preserve actor/object mapping only when its name is used by a selected research record.
    for(const key of ['actors','objects'])for(const row of target[key])if(selected[key].length<3&&[...selected.hypotheses,...selected.testCases,...selected.findings].some(r=>(key==='actors'?r.who:r.object)===row.name)&&!selected[key].some(r=>r.id===row.id))selected[key].push(row);
    const context=buildAgentContext(workspace,selected);
    context.knowledge.actors=context.knowledge.actors.map((row,index)=>({...row,id:selected.actors[index].id}));
    context.knowledge.objects=context.knowledge.objects.map((row,index)=>({...row,id:selected.objects[index].id}));
    if(context.environment){const profiles=new Set([...selected.hypotheses,...selected.testCases].map(r=>r.authProfileId).filter(Boolean));context.environment.profiles=context.environment.profiles.filter(p=>profiles.has(p.id));const accounts=new Set(context.environment.profiles.map(p=>p.accountId));context.environment.accounts=context.environment.accounts.filter(a=>accounts.has(a.id));}
    for(const ref of contextRefs){const key=({actor:'actors',object:'objects',boundary:'boundaries',technique:'techniques',hypothesis:'hypotheses',test:'tests',evidence:'evidence',finding:'findings',report:'findings'})[ref.kind];if(key&&!(['actor','object','boundary','technique'].includes(ref.kind)?context.knowledge[key]:context[key]).some(r=>r.id===ref.id))throw new Error('Terlalu banyak #'+ref.kind+' references. Pilih maksimal '+(['actor','object','boundary'].includes(ref.kind)?3:4)+'.');}
    context.knowledge.research={...context.knowledge.research,question:message.slice(0,4000),level:'Advanced',notes:'Current page: '+page+'; selected references only. Missing information is Unknown.'};
    context.knowledge.domains=context.knowledge.domains.slice(0,1).map(domain=>{const out={...domain,coreConcepts:domain.coreConcepts.slice(0,2)};for(const [key,value] of Object.entries(domain))if(Array.isArray(value)&&key!=='coreConcepts')out[key]=rank(value).slice(0,key==='terminology'?4:key==='businessFlows'?1:2);return out;});
    context.knowledge.domainCatalog=context.knowledge.domains.map(d=>({id:d.id,name:d.name}));
    // Explicit report references alone may include a small existing report draft.
    for(const row of context.findings)if(ids.report.has(row.id))row.reportMarkdown=(target.findings.find(f=>f.id===row.id)?.reportMarkdown||'').slice(0,4000);
    const trim=(value,key='')=>typeof value==='string'?value.slice(0,['id','targetId'].includes(key)?120:['content','actualResult','steps','reportMarkdown'].includes(key)?4000:1600):Array.isArray(value)?value.map(v=>trim(v)):value&&typeof value==='object'?Object.fromEntries(Object.entries(value).map(([k,v])=>[k,trim(v,k)])):value;
    // Scope is authoritative. Never truncate a rule or exclusion and accidentally loosen policy.
    const scope=context.knowledge.scope;const safe=SecretRedactor.context(trim(context));safe.knowledge.scope=SecretRedactor.context(scope);
    if(JSON.stringify(safe).length>90000)throw new Error('Selected context terlalu besar. Kurangi references atau ringkas scope.');
    const recent=recentMessages.filter(m=>m.targetId===target.id&&m.status!=='error'&&(m.contextRefs.some(r=>contextRefs.some(c=>c.kind===r.kind&&c.id===r.id))||!contextRefs.some(r=>!['target','scope'].includes(r.kind)))).slice(-4).map(m=>({sender:m.sender,agent:m.agent,message:m.message.slice(0,1200)}));
    return {context:safe,memory:SecretRedactor.context({summary:summary.slice(0,1600),recent}),researchState:{state:target.agentResearch.state,currentStage:target.agentResearch.currentStage,currentTask:target.agentResearch.currentTask.slice(0,300),progress:target.agentResearch.progress}};
  }
}
