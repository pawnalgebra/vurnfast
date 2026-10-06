"""Real-browser workflow verification via the DevTools protocol, using only Python stdlib.
Run: python tests/browser.py --chrome "C:/path/to/chrome.exe"
Temporary browser profiles and artifacts stay inside .qa/; no user profile is used.
"""
import argparse, base64, hashlib, http.server, json, os, socket, struct, subprocess, threading, time, urllib.request
from pathlib import Path
ROOT=Path(__file__).resolve().parents[1]
class CDP:
    def __init__(self,url):
        from urllib.parse import urlparse
        parsed=urlparse(url);self.sock=socket.create_connection((parsed.hostname,parsed.port),timeout=12)
        key=base64.b64encode(os.urandom(16)).decode()
        self.sock.sendall(f'GET {parsed.path} HTTP/1.1\r\nHost: {parsed.netloc}\r\nUpgrade: websocket\r\nConnection: Upgrade\r\nSec-WebSocket-Key: {key}\r\nSec-WebSocket-Version: 13\r\n\r\n'.encode())
        response=b''
        while b'\r\n\r\n' not in response:response+=self.sock.recv(1)
        assert b'101' in response,response
        self.sequence=0;self.errors=[]
    def exact(self,n):
        data=b''
        while len(data)<n:
            part=self.sock.recv(n-len(data))
            if not part:raise RuntimeError('Browser socket closed')
            data+=part
        return data
    def receive(self):
        head=self.exact(2);length=head[1]&127
        if length==126:length=struct.unpack('!H',self.exact(2))[0]
        elif length==127:length=struct.unpack('!Q',self.exact(8))[0]
        mask=self.exact(4) if head[1]&128 else None
        payload=self.exact(length)
        if mask:payload=bytes(c^mask[i%4] for i,c in enumerate(payload))
        return json.loads(payload)
    def call(self,method,params=None):
        self.sequence+=1;ident=self.sequence
        payload=json.dumps(dict(id=ident,method=method,params=params or {})).encode();mask=os.urandom(4)
        length=len(payload);frame=bytes([0x81,0x80|length]) if length<126 else bytes([0x81,0xfe])+struct.pack('!H',length) if length<65536 else bytes([0x81,0xff])+struct.pack('!Q',length)
        self.sock.sendall(frame+mask+bytes(c^mask[i%4] for i,c in enumerate(payload)))
        while True:
            message=self.receive()
            if message.get('method')=='Runtime.exceptionThrown':self.errors.append(message['params'])
            if message.get('method')=='Log.entryAdded' and message['params']['entry']['level']=='error':self.errors.append(message['params']['entry'])
            if message.get('id')==ident:
                if 'error' in message:raise RuntimeError(message['error'])
                return message.get('result',{})
    def js(self,expression):
        result=self.call('Runtime.evaluate',dict(expression=expression,returnByValue=True,awaitPromise=True,userGesture=True))
        if 'exceptionDetails' in result:raise RuntimeError(result['exceptionDetails'])
        return result.get('result',{}).get('value')
    def wait(self,ms=450):
        for attempt in range(5):
            try:self.js(f'new Promise(resolve=>setTimeout(resolve,{ms}))');return
            except RuntimeError as error:
                if not any(word in str(error) for word in ['navigated','context','closed']):raise
                time.sleep(.1)
        raise RuntimeError('Browser navigation did not settle')
    def go(self,url):self.call('Page.navigate',{'url':url});self.wait(800)
    def route(self,key):self.js('location.hash='+json.dumps(key));self.wait(100)
    def click(self,label):self.js(f"(()=>{{const b=[...document.querySelectorAll('button')].find(b=>b.textContent==={json.dumps(label)});if(!b)throw Error('Missing button: '+{json.dumps(label)});b.click();}})()");self.wait(60)
    def submit(self,values):
        self.js("(()=>{const f=document.querySelector('dialog form');if(!f)throw Error('Missing dialog');for(const [key,value] of Object.entries("+json.dumps(values)+")){if(!f.elements[key])throw Error('Missing field '+key);f.elements[key].value=value;}f.requestSubmit();})()")
        self.wait()
        assert not self.js("!!document.querySelector('dialog[open]')"),self.js("document.querySelector('dialog')?.textContent")
    def state(self):
        return self.js("new Promise((resolve,reject)=>{const request=indexedDB.open('universal-research-workspace',1);request.onsuccess=()=>{const db=request.result;const tx=db.transaction('workspace','readonly');const get=tx.objectStore('workspace').get('primary');get.onsuccess=()=>{resolve(get.result);db.close()};get.onerror=()=>reject(Error('IDB read failed'))};request.onerror=()=>reject(Error('IDB open failed'))})")
class QuietHandler(http.server.SimpleHTTPRequestHandler):
    def log_message(self,*args):pass
    def handle(self):
        try:super().handle()
        except (ConnectionResetError,BrokenPipeError):pass
def run(chrome,node='node'):
    output=ROOT/'.qa'/('run-'+str(time.time_ns()));output.mkdir(parents=True,exist_ok=True)
    server=http.server.ThreadingHTTPServer(('127.0.0.1',0),lambda *a,**kw:QuietHandler(*a,directory=str(ROOT),**kw))
    threading.Thread(target=server.serve_forever,daemon=True).start()
    probe=socket.socket();probe.bind(('127.0.0.1',0));port=probe.getsockname()[1];probe.close()
    profile=output/('profile-'+str(int(time.time())))
    process=subprocess.Popen([chrome,'--headless=new','--no-first-run','--no-default-browser-check','--disable-background-networking','--disable-component-update','--disable-sync',f'--remote-debugging-port={port}',f'--user-data-dir={profile}','about:blank'],stdout=subprocess.DEVNULL,stderr=subprocess.DEVNULL,creationflags=getattr(subprocess,'CREATE_NO_WINDOW',0))
    backends=[]
    try:
        for attempt in range(60):
            try:
                pages=json.load(urllib.request.urlopen(f'http://127.0.0.1:{port}/json',timeout=1));break
            except Exception:time.sleep(.2)
        else:raise RuntimeError('Chrome DevTools did not start')
        c=CDP(next(page['webSocketDebuggerUrl'] for page in pages if page['type']=='page'))
        c.call('Runtime.enable');c.call('Page.enable');c.call('Log.enable')
        c.call('Browser.setDownloadBehavior',{'behavior':'allow','downloadPath':str(output)})
        c.go(ROOT.joinpath('index.html').as_uri());assert c.js("document.querySelector('h1').textContent")=='Research Dashboard'
        c.js('window.confirm=()=>true')
        c.click('+ Create Target');c.submit({'name':'OpenAI Codex','platform':'Bugcrowd','asset':'Codex Desktop'})
        assert c.state()['targets'][0]['name']=='OpenAI Codex'
        c.route('scope');c.js("const scopeInput=document.querySelector('[name=inScope]');scopeInput.value='Codex Desktop (authorized test environment)';scopeInput.dispatchEvent(new Event('input'));for(const label of ['Target confirmed in-scope','Testing account authorized','Testing data owned'])document.querySelector('input[aria-label=\"'+label+'\"]').click()");c.wait()
        c.route('attack-surface');c.click('+ Tambah');c.submit({'name':'Owner'})
        c.click('+ Tambah');c.submit({'name':'Member'})
        c.js("document.querySelectorAll('.panel')[1].querySelector('button').click()");c.submit({'name':'Approval','type':'Approval','owner':'Owner','state':'Used'})
        c.js("document.querySelectorAll('.panel')[2].querySelector('button').click()");c.submit({'from':'Browser','to':'Worker','channel':'Approval channel','authority':'Approval dummy'})
        c.route('techniques');assert c.js("document.querySelectorAll('article.record').length")==20
        c.js("document.querySelectorAll('article.record')[2].querySelector('button').click()")
        c.submit({'title':'Approval yang sudah digunakan mungkin dapat direplay.','invariant':'Approval yang sudah digunakan tidak boleh dipakai kembali.','expectedBehavior':'Replay ditolak.','who':'Member','what':'Approve','object':'Approval','state':'Used','authority':'Approval dummy','context':'Workspace B','queue':'Next'})
        c.route('hypotheses');c.click('Buat Test Case');c.submit({'preconditions':'Dua akun pengujian milik peneliti.','steps':'Buat approval dummy.\nGunakan approval.\nUlangi penggunaan approval.','actualResult':'Approval dummy diterima kembali.','result':'failed'})
        c.route('tests');c.click('Attach Evidence');c.submit({'label':'Response dummy','type':'http-response','content':'HTTP/1.1 200 OK\nX-Dummy-Marker: owned'})
        c.click('Promote to Finding');c.submit({'status':'confirmed','impact':'Approval dummy dapat digunakan dua kali dalam pengujian.','mitigation':'Validasi penggunaan capability secara atomik.'})
        target=c.state()['targets'][0];assert len(target['actors'])==2 and len(target['objects'])==1
        assert target['findings'][0]['evidenceIds']==target['testCases'][0]['evidenceIds'] and len(target['findings'][0]['evidenceIds'])==1
        assert target['findings'][0]['severity']=='Unknown'
        c.route('findings');c.click('Generate Report');c.click('Generate Report');report=c.js("document.querySelector('.report-editor').value")
        assert '## Ringkasan' in report and 'Researcher Estimate: Unknown' in report and 'Response dummy' in report and 'Hipotesis, belum terverifikasi' in report
        c.click('Download .md');c.wait(350);c.click('Download .txt');c.wait(350);c.click('Download .html');c.wait(600)
        for name in ['report.md','report.txt','report.html']:assert (output/name).is_file(),name
        c.route('notes');c.js("const n=document.querySelector('.scratchpad');n.value='<img src=x onerror=alert(1)> research note';n.dispatchEvent(new Event('input'))");c.wait()
        c.route('knowledge');c.click('+ Add Knowledge');c.submit({'title':'Approval pattern','category':'Research Patterns','content':'Replay dummy requires state review.'})
        c.route('helpers');c.click('+ Add Row');c.submit({'who':'Member','object':'Approval','what':'Approve','expectedResult':'MUST NOT replay used approval'})
        c.js("document.querySelector('select[aria-label=\"Internal Helper\"]').value='secret-redactor';document.querySelector('select[aria-label=\"Internal Helper\"]').dispatchEvent(new Event('change'))");c.wait(100)
        c.js("document.querySelector('textarea[aria-label=\"Text to redact\"]').value='Authorization: Bearer SECRET_BROWSER_TEST'");c.click('Redact Preview');assert 'SECRET_BROWSER_TEST' not in c.js("document.querySelector('#view pre').textContent")
        c.route('tools');assert 'Burp Repeater' in c.js("document.querySelector('#view').textContent")
        c.route('notes')
        c.js("document.getElementById('global-search').value='research note';document.getElementById('global-search').dispatchEvent(new Event('input'))");c.wait()
        assert c.js("document.querySelectorAll('.search-result').length")==1
        c.route('dashboard');c.click('↓ Export');c.wait(600);assert (output/'workspace.json').is_file()
        exported=json.loads((output/'workspace.json').read_text(encoding='utf-8'));assert exported==c.state()
        c.call('Page.reload');c.wait(700);assert exported==c.state()
        c.js('window.confirm=()=>true');c.route('settings');c.click('Reset Workspace');c.wait();assert not c.state()['targets']
        def import_data(text):
            c.js("(()=>{const f=document.getElementById('json-file');const d=new DataTransfer();d.items.add(new File(["+json.dumps(text)+"],'data.json',{type:'application/json'}));f.files=d.files;f.dispatchEvent(new Event('change'));})()")
            c.wait(500)
        import_data(json.dumps(exported));assert c.state()==exported,'exact UI export/reset/import round trip'
        import_data('{bad');assert c.state()==exported
        assert 'Import ditolak' in c.js("document.getElementById('toast').textContent")
        # Attempt HTML injection via notes remains plain text.
        c.route('notes');assert c.js("document.querySelectorAll('#view img').length")==0
        # Every sidebar route is rendered without runtime errors.
        for route in ['dashboard','targets','scope','attack-surface','actors','objects','boundaries','techniques','hypotheses','tests','queue','evidence','findings','reports','notes','knowledge','tools','helpers','coverage','ai','settings','ai-provider','backup']:c.route(route);assert c.js("!!document.querySelector('main h1')"),route
        c.call('Emulation.setDeviceMetricsOverride',{'width':390,'height':844,'deviceScaleFactor':1,'mobile':True});c.route('dashboard')
        assert c.js('document.documentElement.scrollWidth<=window.innerWidth'), 'mobile overflow'
        c.call('Emulation.setDeviceMetricsOverride',{'width':1440,'height':1000,'deviceScaleFactor':1,'mobile':False});c.route('dashboard')
        image=c.call('Page.captureScreenshot',{'format':'png','captureBeyondViewport':False})['data'];(output/'dashboard.png').write_bytes(base64.b64decode(image))
        assert not c.errors,c.errors
        print('PASS phase 1: file:// shell, target CRUD, IndexedDB autosave and reload.')
        print('PASS phase 2: actors/objects/boundaries, rules, 20 techniques, hypothesis -> test and search.')
        print('PASS phase 3: evidence -> finding, Indonesian report and actual .md/.txt/.html downloads.')
        print('PASS phase 4: KB/helpers/redactor/tools/coverage, exact JSON round trip, invalid import, routes, mobile layout, no console errors.')
        # Fresh origin: HTTP ES modules must work independently of the compatibility bundle.
        c.go(f'http://127.0.0.1:{server.server_port}/index.html');assert c.js("document.querySelector('h1').textContent")=='Research Dashboard'
        c.js('window.confirm=()=>true');import_data(json.dumps(exported));assert c.state()==exported,'fresh browser-origin import'
        c.route('reports');assert c.js("document.querySelector('.report-editor').value")==report
        assert not c.errors,c.errors
        print('PASS HTTP ES Modules: fresh-origin import retains all data and generated report.')
        # Verify a real browser migrates existing v1 localStorage into IndexedDB without deleting v1.
        legacy=json.loads((ROOT/'data/example-workspace-v1.json').read_text(encoding='utf-8'))
        c.js("new Promise((resolve,reject)=>{const r=indexedDB.open('universal-research-workspace',1);r.onsuccess=()=>{const db=r.result;const t=db.transaction('workspace','readwrite');t.objectStore('workspace').clear();t.oncomplete=()=>{db.close();resolve()}};r.onerror=()=>reject(Error('failed'))})")
        c.js("localStorage.setItem('universal-bounty-workspace-v1',"+json.dumps(json.dumps(legacy))+");localStorage.removeItem('universal-bounty-pending-v2')")
        c.call('Page.reload');c.wait(900);migrated=c.state();assert migrated['schemaVersion']=='2.0.0';assert migrated['targets'][0]['id']==legacy['targets'][0]['id'];assert migrated['targets'][0]['findings']==legacy['targets'][0]['findings']
        assert json.loads(c.js("localStorage.getItem('universal-bounty-workspace-v1')"))==legacy
        print('PASS browser migration: v1 localStorage -> v2 IndexedDB; legacy source retained.')
        def launch_backend(script,enabled):
            probe=socket.socket();probe.bind(('127.0.0.1',0));backend_port=probe.getsockname()[1];probe.close()
            env={**os.environ,'QA_PORT':str(backend_port),'SERVER_PORT':str(backend_port),'AI_ENABLED':'true' if enabled else 'false'}
            backend=subprocess.Popen([node,str(ROOT/script)],cwd=ROOT,env=env,stdout=subprocess.DEVNULL,stderr=subprocess.DEVNULL,creationflags=getattr(subprocess,'CREATE_NO_WINDOW',0));backends.append(backend)
            for attempt in range(70):
                try:
                    urllib.request.urlopen(f'http://127.0.0.1:{backend_port}/api/config',timeout=1).read();return f'http://127.0.0.1:{backend_port}'
                except Exception:
                    if backend.poll() is not None:raise RuntimeError('Backend exited; ensure --node uses Node 20.19+ or 22+')
                    time.sleep(.1)
            raise RuntimeError('Backend not ready')
        disabled_url=launch_backend(Path('server/index.js'),False)
        c.go(disabled_url);c.js('window.confirm=()=>true');import_data(json.dumps(exported));c.route('reports')
        assert c.js("document.querySelector('.report-editor').value")==report
        assert c.js("document.querySelectorAll('#navigation a[href=\"#ai\"]').length")==0
        c.route('settings');assert 'Disabled' in c.js("document.querySelector('#view').textContent")
        assert not c.errors,c.errors
        print('PASS real Fastify AI_DISABLED: manual report, restore and disabled navigation.')
        enabled_url=launch_backend(Path('tests/mock-server.mjs'),True)
        c.go(enabled_url);c.js('window.confirm=()=>true');import_data(json.dumps(exported));c.route('ai')
        assert c.js("document.querySelectorAll('#navigation a[href=\"#ai\"]').length")==1
        source_finding=exported['targets'][0]['findings'][0]['id']
        def request_ai(operation='generate_hypotheses'):
            c.js("(()=>{const f=document.querySelector('#view form');f.elements.operation.value="+json.dumps(operation)+";f.elements.findingId.value="+json.dumps(source_finding)+";f.elements.notes.value='Authorization: Bearer PRIVATE_AI_CONTEXT';f.requestSubmit();})()")
            c.wait(100);assert 'PRIVATE_AI_CONTEXT' not in c.js("document.querySelector('dialog pre').textContent")
            c.click('Send for Analysis');c.wait(800)
        request_ai();state=c.state()['targets'][0];assert len(state['aiSuggestions'])==1,{'toast':c.js("document.getElementById('toast').textContent"),'errors':c.errors,'view':c.js("document.querySelector('#view').textContent").__str__()[:1200]}
        assert state['hypotheses']==exported['targets'][0]['hypotheses'] and state['findings']==exported['targets'][0]['findings'],'AI did not modify research before acceptance'
        c.click('Reject');c.wait();assert c.state()['targets'][0]['aiSuggestions'][0]['status']=='rejected'
        request_ai();c.click('Review Hypothesis: AI draft owned capability hypothesis');c.submit({'title':'Reviewed by researcher: owned capability hypothesis'})
        assert len(c.state()['targets'][0]['hypotheses'])==2
        c.click('Accept as Research Note');c.wait();assert any(n.get('type')=='ai-advice' for n in c.state()['targets'][0]['notes'])
        request_ai('improve_report');c.click('Preview / Edit Report Draft');c.submit({'reportMarkdown':'# Researcher Reviewed AI Draft\n\nObserved fixture only.'})
        assert c.state()['targets'][0]['findings'][0]['reportMarkdown']=='# Researcher Reviewed AI Draft\n\nObserved fixture only.'
        assert c.state()['targets'][0]['findings'][0]['severity']=='Unknown'
        c.route('reports');assert c.js("document.querySelector('.report-editor').value").startswith('# Researcher Reviewed')
        c.call('Page.reload');c.wait(900);assert len(c.state()['targets'][0]['aiSuggestions'])==3
        assert not c.errors,c.errors
        print('PASS AI_ENABLED mock UI: redacted context preview, JSON validation, no automatic research mutation, Reject, edited hypothesis Accept, note Accept, report Edit/Accept, reload.')
    finally:
        for backend in backends:
            backend.terminate()
            try:backend.wait(timeout=5)
            except subprocess.TimeoutExpired:backend.kill()
        process.terminate()
        try:process.wait(timeout=8)
        except subprocess.TimeoutExpired:process.kill()
        server.shutdown()
if __name__=='__main__':
    parser=argparse.ArgumentParser();parser.add_argument('--chrome',required=True);parser.add_argument('--node',default='node');args=parser.parse_args();run(args.chrome,args.node)
