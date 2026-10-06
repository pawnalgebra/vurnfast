import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {featureRegistry,routeFeatures,operationFeatures,helperFeatures} from '../client/js/feature-registry.js';
import {routes} from '../client/js/router.js';
import {aiOperations} from '../client/js/modules/ai.js';
import {HELPER_KB} from '../client/js/knowledge-data.js';
import {DEFAULT_TECHNIQUES} from '../client/js/technique-data.js';
import {knowledgeOperations} from '../client/js/services/knowledge-schema.js';
import {createApp} from '../server/app.js';

test('all navigation routes, actual AI operations, helpers and built-in techniques have documented metadata',()=>{
  assert.equal(new Set(featureRegistry.map(f=>f.id)).size,featureRegistry.length);
  for(const [route] of routes)assert.ok(routeFeatures[route],route);
  for(const [operation] of aiOperations)assert.ok(operationFeatures[operation],operation);
  for(const [operation] of knowledgeOperations)assert.ok(operationFeatures[operation],operation);
  for(const helper of HELPER_KB)assert.ok(helperFeatures[helper.id],helper.id);
  for(const technique of DEFAULT_TECHNIQUES)assert.ok(featureRegistry.some(f=>f.id===technique.id),technique.name);
  for(const feature of featureRegistry){assert.ok(feature.description&&feature.purpose);assert.ok(['Active','Partial','Coming Soon'].includes(feature.status));}
});

test('every feature documentation URL reaches an actual generated section under the safe client root',async()=>{
  const app=await createApp({env:{AI_ENABLED:'false'}});
  try{
    const pages=new Map();
    for(const feature of featureRegistry){
      const [path,anchor]=feature.documentation.split('#');
      if(!pages.has(path)){
        const response=await app.inject('/'+path);assert.equal(response.statusCode,200,path);
        assert.match(response.headers['content-type'],/text\/html/);pages.set(path,response.body);
      }
      assert.ok(pages.get(path).includes('id="'+anchor+'"'),feature.id);
    }
    for(const name of ['USER_GUIDE','FEATURE_REFERENCE','WORKFLOW_GUIDE','TARGET_INTELLIGENCE_GUIDE']){
      assert.equal((await app.inject('/docs/'+name+'.html')).statusCode,200);
      assert.equal(await readFile(new URL('../docs/'+name+'.md',import.meta.url),'utf8'),await readFile(new URL('../client/docs/'+name+'.md',import.meta.url),'utf8'));
    }
    for(const path of ['/.env','/scripts/feature_catalog.py','/docs/../.env'])assert.ok([403,404].includes((await app.inject(path)).statusCode),path);
  }finally{await app.close();}
});
