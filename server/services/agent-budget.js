import {mkdir,readFile,writeFile,rename,open,unlink} from 'node:fs/promises';
import {dirname,resolve} from 'node:path';
import {randomUUID} from 'node:crypto';
const day=()=>new Date().toISOString().slice(0,10);
function checkLedger(rows){if(!Array.isArray(rows)||rows.length>100000||rows.some(r=>!r||typeof r.id!=='string'||typeof r.runId!=='string'||typeof r.day!=='string'||!Number.isFinite(r.usd)||r.usd<0))throw new Error('Budget ledger unavailable.');return rows;}
function reserveRecord(rows,runId,usd,runBudget,dailyBudget){
  const runSpent=rows.filter(r=>r.runId===runId).reduce((n,r)=>n+r.usd,0),dailySpent=rows.filter(r=>r.day===day()).reduce((n,r)=>n+r.usd,0);
  if(runSpent+usd>runBudget+1e-9||dailySpent+usd>dailyBudget+1e-9)return null;
  const row={id:randomUUID(),runId,day:day(),usd};rows.push(row);return {reservationId:row.id,runSpent:runSpent+usd,dailySpent:dailySpent+usd};
}
// A configurable per-call upper estimate is reserved BEFORE provider invocation.
// Actual billed cost is unknown. Errors/crashes keep reservations; restarting cannot reset today's cap.
export class AgentBudgetLedger{
  constructor(path=resolve('.runtime/agent-cost-ledger.json')){this.path=path;this.queue=Promise.resolve();}
  async read(){try{return checkLedger(JSON.parse(await readFile(this.path,'utf8')));}catch(error){if(error.code==='ENOENT')return [];throw new Error('Budget ledger unavailable.');}}
  async spentToday(){return (await this.read()).filter(r=>r.day===day()).reduce((n,r)=>n+r.usd,0);}
  reserve(runId,usd,runBudget,dailyBudget){
    const operation=this.queue.then(async()=>{
      await mkdir(dirname(this.path),{recursive:true});let lock;
      try{lock=await open(this.path+'.lock','wx');}catch{throw new Error('Budget ledger locked/unavailable.');}
      try{const rows=await this.read(),reservation=reserveRecord(rows,runId,usd,runBudget,dailyBudget);if(!reservation)return null;const temporary=this.path+'.'+randomUUID()+'.tmp';await writeFile(temporary,JSON.stringify(rows));await rename(temporary,this.path);return reservation;}
      finally{await lock.close();await unlink(this.path+'.lock');}
    });this.queue=operation.catch(()=>{});return operation;
  }
}
export class MemoryAgentBudgetLedger{
  constructor(){this.rows=[];}
  async spentToday(){return this.rows.filter(r=>r.day===day()).reduce((n,r)=>n+r.usd,0);}
  async reserve(runId,usd,runBudget,dailyBudget){return reserveRecord(this.rows,runId,usd,runBudget,dailyBudget);}
}
