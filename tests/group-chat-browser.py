"""Real Chrome group chat, mentions, model dispatch and attachment workflow. Mock provider only."""
import argparse,base64,json,os,socket,subprocess,time,urllib.request,uuid
from pathlib import Path
from browser import CDP
ROOT=Path(__file__).resolve().parents[1]
def free_port():
    with socket.socket() as sock:sock.bind(('127.0.0.1',0));return sock.getsockname()[1]
def run(chrome_path,node_path):
    output=ROOT/'.qa'/('group-chat-ui-'+str(time.time_ns()));output.mkdir(parents=True)
    api,debug=free_port(),free_port();env=os.environ.copy();env.update(QA_AGENTIC='true',QA_PORT=str(api));flags=getattr(subprocess,'CREATE_NO_WINDOW',0)
    backend=subprocess.Popen([node_path,'tests/mock-server.mjs'],cwd=ROOT,env=env,stdout=subprocess.DEVNULL,stderr=subprocess.DEVNULL,creationflags=flags)
    chrome=subprocess.Popen([chrome_path,'--headless=new','--no-first-run','--no-default-browser-check','--disable-background-networking','--disable-component-update','--disable-sync',f'--remote-debugging-port={debug}',f'--user-data-dir={output / "profile"}','about:blank'],stdout=subprocess.DEVNULL,stderr=subprocess.DEVNULL,creationflags=flags)
    try:
        for _ in range(40):
            try:urllib.request.urlopen(f'http://127.0.0.1:{api}/api/config',timeout=.5).close();pages=json.load(urllib.request.urlopen(f'http://127.0.0.1:{debug}/json',timeout=.5));break
            except Exception:time.sleep(.2)
        else:raise RuntimeError('QA services did not start')
        c=CDP(next(p['webSocketDebuggerUrl'] for p in pages if p['type']=='page'))
        for method in ['Page.enable','Runtime.enable','Log.enable','Network.enable']:c.call(method)
        c.call('Emulation.setDeviceMetricsOverride',{'width':1440,'height':1000,'deviceScaleFactor':1,'mobile':False})
        c.go(f'http://127.0.0.1:{api}/');c.js('window.confirm=()=>true');c.click('+ Create Target');c.submit({'name':'Owned group fixture','asset':'owned.example.test','platform':'Private'})
        c.route('scope');c.js("(()=>{const field=document.querySelector('[name=inScope]');field.value='owned.example.test';field.dispatchEvent(new Event('input'));for(const label of ['Target confirmed in-scope','Testing account authorized','Testing data owned'])document.querySelector('input[aria-label=\"'+label+'\"]').click()})()");c.wait(600)
        data=c.state();target=data['targets'][0];evidence_id,finding_id=str(uuid.uuid4()),str(uuid.uuid4())
        target['evidence'].append({'id':evidence_id,'label':'Owned observation','type':'http-response','content':'HTTP 200 owned dummy response'})
        target['findings'].append({'id':finding_id,'title':'Owned candidate','status':'draft','severity':'Unknown','evidenceIds':[evidence_id]})
        c.js("(()=>{const f=document.getElementById('json-file'),d=new DataTransfer();d.items.add(new File(["+json.dumps(json.dumps(data))+"],'owned.json',{type:'application/json'}));f.files=d.files;f.dispatchEvent(new Event('change'));})()");c.wait(650)
        c.route('findings');c.js("document.querySelector('#view .agent-context-action').click()")
        def type_message(text):
            c.js("(()=>{const i=document.getElementById('agent-message-input');i.value="+json.dumps(text)+";i.focus();i.setSelectionRange(i.value.length,i.value.length);i.dispatchEvent(new Event('input'));})()")
        def key(value,shift=False):
            c.js("document.getElementById('agent-message-input').dispatchEvent(new KeyboardEvent('keydown',{key:"+json.dumps(value)+",shiftKey:"+str(shift).lower()+",bubbles:true,cancelable:true}))")
        def attach(path):
            document=c.call('DOM.getDocument');node=c.call('DOM.querySelector',{'nodeId':document['root']['nodeId'],'selector':'#agent-message-files'})['nodeId'];c.call('DOM.setFileInputFiles',{'nodeId':node,'files':[str(path)]});c.wait(250)
        def wait_reply(count):
            for _ in range(25):
                if c.js("document.querySelector('.agent-message-status').textContent") not in ['Thinking','Researching']:break
                c.wait(100)
            c.wait(450);messages=c.state()['targets'][0]['agentResearch']['messages'];assert len(messages)==count,{'messages':messages,'feedback':c.js("document.querySelector('.agent-message-feedback').textContent")};return messages
        before=len(c.requests);type_message('@')
        assert not c.js("document.getElementById('agent-message-suggestions').hidden"),'Mentions must appear immediately'
        assert c.js("document.querySelectorAll('#agent-message-suggestions [role=option]').length")==15
        assert c.js("document.getElementById('agent-message-suggestions').getBoundingClientRect().bottom<document.getElementById('agent-message-input').getBoundingClientRect().top")
        key('ArrowUp');assert c.js("document.getElementById('agent-message-input').getAttribute('aria-activedescendant')")=='agent-suggestion-14';key('Enter');assert c.js("document.getElementById('agent-message-input').value")=='@report '
        assert not any(r['url'].endswith('/api/agent/message') for r in c.requests[before:])
        type_message('@evidence @finding review owned context');key('Enter');messages=wait_reply(3);assert [m['agent'] for m in messages[1:]]==['evidence','finding'];assert messages[0]['members']==['evidence','finding'];assert len(set(m['runId'] for m in messages))==1
        assert c.js("[...document.querySelectorAll('.agent-answer .agent-bubble-header strong')].map(n=>n.textContent)")==['Evidence Agent','Finding Agent']
        print('PASS immediate mentions above composer, full agent list/keyboard wrap, multi-mention dispatch, group identities and shared run.',flush=True)
        c.js("document.querySelector('[aria-label=\"Refresh models\"]').click()");c.wait(200)
        assert c.js("[...document.getElementById('agent-message-model').options].map(o=>o.value)")==['mock-model','mock-vision']
        c.js("(()=>{const s=document.getElementById('agent-message-model');s.value='mock-vision';s.dispatchEvent(new Event('change'))})()")
        textfile=output/'owned.log';textfile.write_text('Owned log\nAuthorization: Bearer OWNED_ATTACHMENT_SECRET\n<html>inert content</html>',encoding='utf-8')
        attach(textfile);assert c.js("document.querySelectorAll('.agent-attachment').length")==1;assert 'OWNED_ATTACHMENT_SECRET' not in c.js("document.querySelector('.agent-attachments').textContent")
        c.js("document.querySelector('.agent-attachment details').open=true");assert '[REDACTED]' in c.js("document.querySelector('.agent-attachments pre').textContent")
        c.js("document.querySelector('[aria-label=\"Remove file owned.log\"]').click()");assert c.js("document.querySelectorAll('.agent-attachment').length")==0
        pdf=output/'unsupported.pdf';pdf.write_bytes(b'%PDF owned fixture');attach(pdf);assert 'PDF' in c.js("document.querySelector('.agent-message-feedback').textContent");assert not c.js("document.querySelector('.agent-attachment')!==null")
        attach(textfile)
        png='iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+a5t8AAAAASUVORK5CYII='
        image=output/'owned.png';image.write_bytes(base64.b64decode(png));attach(image);assert c.js("document.querySelectorAll('.agent-attachment').length")==2;assert c.js("document.querySelector('.agent-attachment img').src.startsWith('data:image/png;base64,')")
        type_message('Review evidence and finding #evidence:'+evidence_id);assert 'General' in c.js("document.querySelector('.agent-routing').textContent");key('Escape');key('Enter');messages=wait_reply(7)
        assert [m['agent'] for m in messages[4:]]==['general','evidence','finding'];assert all(m['model']=='mock-vision' for m in messages[3:])
        request=[r for r in c.requests if r['url'].endswith('/api/agent/message')][-1];payload=json.loads(request['postData']);assert payload['message']['model']=='mock-vision';assert len(payload['message']['attachments'])==2;assert 'OWNED_ATTACHMENT_SECRET' not in request['postData'];assert payload['message']['attachments'][1]['data']==png
        stored=c.state();assert 'OWNED_ATTACHMENT_SECRET' not in json.dumps(stored);assert png not in json.dumps(stored);assert len(messages[3]['attachments'])==2;assert all('data' not in f and 'text' not in f for f in messages[3]['attachments'])
        assert stored['targets'][0]['findings'][0]['title']=='Owned candidate';assert stored['targets'][0]['findings'][0]['status']=='draft'
        print('PASS model selection reaches the request and every agent record; real file picker, preview/remove, unsupported PDF rejection, text redaction, image input, automatic General/domain group and canonical isolation.',flush=True)
        type_message('@');(output/'desktop.png').write_bytes(base64.b64decode(c.call('Page.captureScreenshot',{'format':'png','captureBeyondViewport':False})['data']))
        for width,height in [(1024,900),(761,800),(390,844),(390,650)]:
            c.call('Emulation.setDeviceMetricsOverride',{'width':width,'height':height,'deviceScaleFactor':1,'mobile':width<=760});c.wait(100);type_message('@finding');assert not c.js("document.getElementById('agent-message-suggestions').hidden")
            assert c.js("document.documentElement.scrollWidth<=window.innerWidth"),('overflow',width)
            assert c.js("document.getElementById('agent-message-suggestions').getBoundingClientRect().bottom<document.getElementById('agent-message-input').getBoundingClientRect().top")
            assert c.js("document.querySelector('.agent-message-composer').getBoundingClientRect().bottom<=window.innerHeight+1"),('composer outside viewport',width,height)
        (output/'mobile.png').write_bytes(base64.b64decode(c.call('Page.captureScreenshot',{'format':'png','captureBeyondViewport':False})['data']))
        key('Escape');assert not c.js("document.getElementById('agent-message-panel').hidden");key('Escape');assert c.js("document.getElementById('agent-message-panel').hidden && !document.querySelector('.main-shell').inert")
        c.call('Emulation.setDeviceMetricsOverride',{'width':1440,'height':1000,'deviceScaleFactor':1,'mobile':False});c.call('Page.reload');c.wait(950);c.js("document.getElementById('agent-message-launcher').click()")
        assert c.js("document.getElementById('agent-message-model').value")=='mock-vision';assert len(c.state()['targets'][0]['agentResearch']['messages'])==7
        c.js("window.confirm=()=>true;document.querySelector('.agent-message-options').open=true;document.querySelector('.agent-message-options button').click()");c.wait(500)
        type_message('QA delayed message review evidence');key('Enter');c.wait(1300);assert c.js("!!document.querySelector('.agent-thinking')")
        c.js("document.querySelector('[aria-label=\"Pause message\"]').click()");c.wait(350);assert c.state()['targets'][0]['agentResearch']['messages'][-1]['status']=='paused';assert not c.js("!!document.querySelector('.agent-thinking')")
        assert not c.errors,c.errors
        print('PASS desktop/mobile autocomplete placement, no overflow, accessible Escape drawer, persistence/model preference and real run thinking/pause.',flush=True)
        print('Artifacts: '+str(output),flush=True)
    finally:
        for process in [chrome,backend]:
            process.terminate()
            try:process.wait(timeout=5)
            except subprocess.TimeoutExpired:process.kill()
if __name__=='__main__':
    parser=argparse.ArgumentParser();parser.add_argument('--chrome',required=True);parser.add_argument('--node',default='node');args=parser.parse_args();run(args.chrome,args.node)
