"""Curated local tools/helpers. No executable commands or provider invented tools."""
import json
from pathlib import Path
root=Path(__file__).resolve().parents[1]
definitions=[
 ('burp-repeater','Burp Repeater','api,authorization,business-logic','Controlled manual request comparison','https://portswigger.net/burp/documentation/desktop/tools/repeater'),
 ('caido','Caido','api,authorization','Manual proxy/replay workflow; automatic actions require separate program permission','https://docs.caido.io/'),
 ('mitmproxy','mitmproxy','api,browser','Inspect explicitly authorized traffic; scripts are outside this manual recommendation','https://docs.mitmproxy.org/'),
 ('postman','Postman','api,auth','Manually send and inspect one authorized API request','https://learning.postman.com/'),
 ('curl','curl','api,state','Manual request recording for an authorized endpoint','https://curl.se/docs/'),
 ('jq','jq','api,parser','Local JSON comparison and filtering','https://jqlang.org/manual/'),
 ('browser-devtools','Browser DevTools','browser,state,auth','Inspect local state, network records, and application contexts','https://developer.chrome.com/docs/devtools/'),
 ('wireshark','Wireshark','realtime,infra','Inspect a locally captured, authorized traffic file','https://www.wireshark.org/docs/'),
 ('git','Git','state,infra','Track researcher-owned notes or fixture changes locally','https://git-scm.com/docs'),
 ('docker','Docker','infra,sandbox','Reproduce behavior in an isolated researcher-owned test environment','https://docs.docker.com/'),
 ('websocat','websocat','realtime,api','Manually inspect an authorized WebSocket connection','https://github.com/vi/websocat')]
tools=[dict(id=id,name=name,categories=categories.split(','),techniques=categories.split(','),automationLevel='manual',description=description,usageMode='manual',requiresAutomation=False,requiresThirdParty=False,requiresDos=False,destructive=False,scopeWarning='Hanya akun/data/asset yang diotorisasi; review program rules dan rate limits. Tidak dijalankan oleh workspace.',documentation=url) for id,name,categories,description,url in definitions]
helper_defs=[('authorization-matrix','Authorization Matrix Builder','WHO × OBJECT × ACTION expected permissions'),('state-transition','State Transition Builder','Catat state asal/tujuan dan authority yang dibutuhkan'),('trust-boundary','Trust Boundary Mapper','Catat from/to/channel/authority/trust'),('evidence-comparator','Evidence Comparator','Bandingkan dua teks evidence lokal'),('secret-redactor','Secret Redactor','Preview redaksi secret dari teks'),('hypothesis-generator','Hypothesis Generator','Draft invariant dan hypothesis dari technique'),('scope-checker','Scope Checker','Review scope/checklist/rules yang diberikan'),('finding-checklist','Finding Checklist','Periksa kelengkapan facts dan evidence'),('duplicate-comparator','Duplicate Comparator','Bandingkan root cause/boundary/primitive/component/impact'),('report-builder','Report Builder','Laporan Indonesia deterministik'),('gap-analyzer','Research Gap Analyzer','Untested actors/objects/states/boundaries/techniques')]
helpers=[dict(id=id,name=name,purpose=purpose) for id,name,purpose in helper_defs]
(root/'data/tools/tools.json').write_text(json.dumps(tools,ensure_ascii=False,indent=2)+'\n',encoding='utf-8')
(root/'data/helpers/helpers.json').write_text(json.dumps(helpers,ensure_ascii=False,indent=2)+'\n',encoding='utf-8')
(root/'client/js/knowledge-data.js').write_text('// MODULE: Curated offline Tool KB and helper catalog. Generated from data/.\nexport const TOOL_KB='+json.dumps(tools,ensure_ascii=False,indent=2)+';\nexport const HELPER_KB='+json.dumps(helpers,ensure_ascii=False,indent=2)+';\n',encoding='utf-8')
print('Tool and helper knowledge catalogs generated.')
