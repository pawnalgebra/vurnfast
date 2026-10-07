"""Real IndexedDB recovery, concurrent-tab and sharing regressions; isolated Chrome profile, mock AI only."""
import argparse,base64,json,os,socket,subprocess,time,urllib.request,uuid
from pathlib import Path
from browser import CDP
ROOT=Path(__file__).resolve().parents[1]
def free_port():
    with socket.socket() as sock:sock.bind(('127.0.0.1',0));return sock.getsockname()[1]
def run(chrome_path,node_path):
    output=ROOT/'.qa'/('reliability-ui-'+str(time.time_ns()));output.mkdir(parents=True)
    api,debug=free_port(),free_port();env=os.environ.copy();env.update(QA_AGENTIC='true',QA_PORT=str(api));flags=getattr(subprocess,'CREATE_NO_WINDOW',0)
    backend=subprocess.Popen([node_path,'tests/mock-server.mjs'],cwd=ROOT,env=env,stdout=subprocess.DEVNULL,stderr=subprocess.DEVNULL,creationflags=flags)
    chrome=subprocess.Popen([chrome_path,'--headless=new','--no-first-run','--no-default-browser-check','--disable-background-networking','--disable-component-update','--disable-sync',f'--remote-debugging-port={debug}',f'--user-data-dir={output / "profile"}','about:blank'],stdout=subprocess.DEVNULL,stderr=subprocess.DEVNULL,creationflags=flags)
    try:
        for _ in range(30):
            try:urllib.request.urlopen(f'http://127.0.0.1:{api}/api/config',timeout=.5).close();pages=json.load(urllib.request.urlopen(f'http://127.0.0.1:{debug}/json',timeout=.5));break
            except Exception:time.sleep(.2)
        else:raise RuntimeError('QA services did not start')
        c=CDP(next(p['webSocketDebuggerUrl'] for p in pages if p['type']=='page'))
        for method in ['Page.enable','Runtime.enable','Log.enable']:c.call(method)
        c.call('Emulation.setDeviceMetricsOverride',{'width':1440,'height':1000,'deviceScaleFactor':1,'mobile':False});c.call('Browser.setDownloadBehavior',{'behavior':'allow','downloadPath':str(output)})
        origin=f'http://127.0.0.1:{api}/';c.go(origin);c.js('window.confirm=()=>true');c.click('+ Create Target');c.submit({'name':'Owned recovery fixture','asset':'app.test','platform':'Private'})
        def note(browser,text):browser.route('notes');browser.js("(()=>{const n=document.querySelector('.scratchpad');n.value="+json.dumps(text)+";n.dispatchEvent(new Event('input'));})()");browser.wait(600)
        def restore(data):
            c.js('window.confirm=()=>true');c.js("(()=>{const f=document.getElementById('json-file'),d=new DataTransfer();d.items.add(new File(["+json.dumps(json.dumps(data))+"],'owned.json',{type:'application/json'}));f.files=d.files;f.dispatchEvent(new Event('change'));})()");c.wait(600)
        note(c,'Owned original');original=c.state();c.js("localStorage.setItem('universal-bounty-pending-v2','{broken')");c.call('Page.reload');c.wait(900)
        assert c.state()==original and 'primary dipertahankan' in c.js('document.body.textContent')
        note(c,'Owned recovered edit');assert c.state()['targets'][0]['id']==original['targets'][0]['id'];saved=c.state()
        c.js("new Promise(resolve=>{const r=indexedDB.open('universal-research-workspace',1);r.onsuccess=()=>{const db=r.result,tx=db.transaction('workspace','readwrite');tx.objectStore('workspace').put({broken:true},'primary');tx.oncomplete=()=>{db.close();resolve()}}})");c.call('Page.reload');c.wait(900)
        assert c.js("document.querySelector('.page-heading button').disabled")
        assert c.js("document.body.textContent.includes('editing/autosave diblokir')")
        assert c.state()=={'broken':True}
        restore(saved);assert c.state()==saved;assert not c.js("document.querySelector('.page-heading button').disabled")
        print('PASS real IndexedDB: corrupt journal preserves primary; corrupt primary locks editor; validated Import Backup restores exact data.',flush=True)
        target=c.call('Target.createTarget',{'url':'about:blank'})['targetId'];pages=json.load(urllib.request.urlopen(f'http://127.0.0.1:{debug}/json'));second=CDP(next(p['webSocketDebuggerUrl'] for p in pages if p['id']==target))
        for method in ['Page.enable','Runtime.enable','Log.enable']:second.call(method)
        second.go(origin);note(c,'Tab A committed');note(second,'Tab B unsaved')
        assert c.state()['targets'][0]['notes'][0]['content']=='Tab A committed'
        assert second.js("document.querySelector('.scratchpad').disabled && document.body.textContent.includes('Tab lain menyimpan workspace')")
        assert second.js("document.querySelector('.scratchpad').value")== 'Tab B unsaved'
        second.js("document.getElementById('agent-message-launcher').click()")
        assert second.js("document.querySelector('.agent-message-composer .primary').disabled")
        c.call('Target.closeTarget',{'targetId':target});c.call('Page.reload');c.wait(900);assert c.state()['targets'][0]['notes'][0]['content']=='Tab A committed'
        print('PASS concurrent tabs: stale save blocked, primary retained, unsaved text remains available for export, stale journal does not replay.',flush=True)
        data=c.state();evidence_id,finding_id=str(uuid.uuid4()),str(uuid.uuid4());data['targets'][0]['evidence'].append({'id':evidence_id,'label':'Owned sensitive observation','type':'http-response','content':'Authorization: Bearer OWNED_UI_DUMMY_TOKEN\nOwned response'})
        data['targets'][0]['findings'].append({'id':finding_id,'title':'Owned report','status':'confirmed','severity':'Unknown','evidenceIds':[evidence_id]});restore(data)
        c.route('reports');c.click('Generate Report');c.click('Download .md');assert c.js("!!document.querySelector('dialog[aria-label=\"Review sensitive data\"][open]')")
        assert 'OWNED_UI_DUMMY_TOKEN' not in c.js("document.querySelector('dialog pre').textContent")
        c.click('Use Redacted');c.wait(300);assert 'OWNED_UI_DUMMY_TOKEN' not in (output/'report.md').read_text(encoding='utf-8')
        c.click('↓ Export');c.click('Cancel');assert not (output/'workspace.json').exists()
        c.click('↓ Export');c.click('Export Original Backup');c.wait(400);assert json.loads((output/'workspace.json').read_text(encoding='utf-8'))==c.state()
        c.route('evidence');c.click('Edit');c.submit({'content':'Owned revised response'});c.route('reports');assert 'Draft stale' in c.js('document.body.textContent');c.click('Mark Sources Reviewed');assert 'Draft follows' in c.js('document.body.textContent')
        assert not c.errors,c.errors
        (output/'report-source-review.png').write_bytes(base64.b64decode(c.call('Page.captureScreenshot',{'format':'png','captureBeyondViewport':False})['data']))
        print('PASS sharing: sensitive preview, cancelled export, redacted report download, exact original backup after explicit confirmation, report stale/reviewed states.',flush=True)
        print('Artifacts: '+str(output),flush=True)
    finally:
        for process in [chrome,backend]:
            process.terminate()
            try:process.wait(timeout=5)
            except subprocess.TimeoutExpired:process.kill()
if __name__=='__main__':
    parser=argparse.ArgumentParser();parser.add_argument('--chrome',required=True);parser.add_argument('--node',default='node');args=parser.parse_args();run(args.chrome,args.node)
