// Compatibility entrypoint. Backend and current tests require Node >=20.19.
if(Number(process.versions.node.split('.')[0])<20){console.error('Gunakan Node >=20.19 (disarankan Node 22+), lalu npm test.');process.exitCode=1;}
else import('./run.mjs').catch(()=>{process.exitCode=1;});
