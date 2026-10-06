import {createApp} from './app.js';
import {loadEnvironment,resolveConfig} from './config.js';
// MODULE: Entrypoint. Startup output is restricted to local address and safe AI state.
const env=loadEnvironment(),config=resolveConfig(env);
try {
  const app=await createApp({env});
  await app.listen({host:config.host,port:config.port});
  console.log('Universal Research Workspace: http://'+config.host+':'+config.port+' · AI: '+app.safeAIConfig().status);
  for(const signal of ['SIGINT','SIGTERM'])process.on(signal,async()=>{await app.close();process.exit(0);});
}catch{console.error('Backend gagal dimulai. Periksa versi Node, port localhost, dan konfigurasi .env.');process.exitCode=1;}
