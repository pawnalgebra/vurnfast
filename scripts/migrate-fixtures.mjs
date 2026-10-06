import {readFile,writeFile,access} from 'node:fs/promises';
import {migrateWorkspace} from '../client/js/storage.js';
import {DEFAULT_TECHNIQUES} from '../client/js/technique-data.js';
// MODULE: Migrate shipped examples only; never overwrite browser storage or a nonempty root data.json.
const example=JSON.parse(await readFile('data/example-workspace.json','utf8'));
if(example.schemaVersion==='1.0.0')await writeFile('data/example-workspace-v1.json',JSON.stringify(example,null,2)+'\n');
const migrated=migrateWorkspace(example);
for(const target of migrated.targets)for(const technique of target.techniques){
  const reference=DEFAULT_TECHNIQUES.find(item=>item.id===technique.libraryId||item.name===technique.name);
  if(reference){technique.category??=reference.category;if(technique.securityInvariant===technique.hypothesisTemplate)technique.securityInvariant=reference.securityInvariant;}
}
await writeFile('data/example-workspace.json',JSON.stringify(migrated,null,2)+'\n');
const empty={schemaVersion:'2.0.0',applicationVersion:'0.2.0',updatedAt:'2026-10-06T08:00:00.000Z',targets:[]};
await writeFile('workspace.json',JSON.stringify(empty,null,2)+'\n');
console.log('v2 example and legacy fixture prepared.');
