"""Exercise the advanced reasoning UI offline; only a disposable Chrome profile is used."""
import argparse, json, socket, subprocess, sys, time, urllib.request
from pathlib import Path
sys.path.insert(0,str(Path(__file__).resolve().parents[1]))
from browser import CDP, ROOT

def run(chrome):
    output=ROOT/'.qa'/('advanced-'+str(time.time_ns()));output.mkdir(parents=True,exist_ok=True)
    with socket.socket() as probe:probe.bind(('127.0.0.1',0));port=probe.getsockname()[1]
    process=subprocess.Popen([chrome,'--headless=new','--no-first-run','--no-default-browser-check','--disable-background-networking','--disable-component-update','--disable-sync',f'--remote-debugging-port={port}',f'--user-data-dir={output / "profile"}','about:blank'],stdout=subprocess.DEVNULL,stderr=subprocess.DEVNULL,creationflags=getattr(subprocess,'CREATE_NO_WINDOW',0))
    try:
        for _ in range(60):
            try:pages=json.load(urllib.request.urlopen(f'http://127.0.0.1:{port}/json',timeout=1));break
            except Exception:time.sleep(.2)
        else:raise RuntimeError('Chrome DevTools did not start')
        c=CDP(next(page['webSocketDebuggerUrl'] for page in pages if page['type']=='page'));c.call('Runtime.enable');c.call('Page.enable');c.call('Network.enable')
        c.go(ROOT.joinpath('index.html').as_uri());c.click('+ Create Target');c.submit({'name':'Owned Advanced Lab','platform':'Private','asset':'app.test'})
        c.route('scope');c.js("const s=document.querySelector('[name=inScope]');s.value='app.test';s.dispatchEvent(new Event('input'));for(const label of ['Target confirmed in-scope','Testing account authorized','Testing data owned'])document.querySelector('input[aria-label=\"'+label+'\"]').click()");c.wait()
        c.route('attack-surface');c.click('+ Tambah');c.submit({'name':'Owned Member'})
        c.js("document.querySelectorAll('.panel')[1].querySelector('button').click()");c.submit({'name':'Dummy Export','owner':'Owned Member','tenant':'A','state':'queued'})
        c.route('evidence')
        for label in ['Grant','Revoke','Execution']:
            c.click('+ Attach Evidence');c.submit({'label':label,'type':'manual-note','content':'Owned dummy '+label+' observation'})
        target=c.state()['targets'][0];actor=target['actors'][0]['id'];obj=target['objects'][0]['id'];raw=list(target['evidence'])
        c.route('dashboard')
        for i,values in enumerate([{'order':'1','authorityAfter':'granted','outcome':'unknown'},{'order':'2','authorityBefore':'granted','authorityAfter':'revoked','outcome':'unknown'},{'order':'3','authorityBefore':'revoked','outcome':'allowed'}]):
            c.click('Record Event');c.js('document.querySelector("dialog form").elements['+json.dumps('evidence:'+raw[i]['id'])+'].checked=true');c.submit({'actorId':actor,'objectId':obj,'operation':'export','state':'queued','effectiveAuthority':'member','tenant':'A',**values})
        body=c.js('document.body.textContent');assert 'allowed after ordered revocation' in body;assert 'independent, irrevocable authority' in body;assert 'NEEDS_TESTING' in body
        c.click('Investigate');c.submit({'title':'Investigate stale export authority'})
        target=c.state()['targets'][0];assert target['hypotheses'][0]['actorId']==actor;assert target['hypotheses'][0]['objectId']==obj;assert len(target['hypotheses'][0]['evidenceIds'])==2
        c.route('hypotheses');c.click('Buat Test Case');assert c.js("document.querySelector('dialog form').elements.steps.value.includes('post-revocation')");c.submit({})
        target=c.state()['targets'][0];assert target['testCases'][0]['actorId']==actor;assert target['testCases'][0]['result']=='not-tested';assert target['evidence']==raw
        c.route('dashboard');c.call('Emulation.setDeviceMetricsOverride',{'width':390,'height':844,'deviceScaleFactor':1,'mobile':True});assert c.js('document.documentElement.scrollWidth<=window.innerWidth'),'advanced mobile overflow'
        c.call('Emulation.setDeviceMetricsOverride',{'width':1440,'height':1000,'deviceScaleFactor':1,'mobile':False});c.click('Mark Explained');c.submit({'reason':'Owned lab policy gives job independent authority; verified manually'})
        assert 'No supported contradiction detected' in c.js('document.body.textContent');saved=c.state();c.call('Page.reload');c.wait(800);assert c.state()==saved;assert not c.errors,c.errors
        assert not any(r['url'].startswith(('http:','https:')) for r in c.requests),'offline workflow must not contact targets or models'
        print('PASS advanced UI: raw evidence-linked grant/revoke/execute, local contradiction and alternative, stable hypothesis/test references, manual investigation, explained decision, persistence and mobile.')
    finally:
        process.terminate()
        try:process.wait(timeout=8)
        except subprocess.TimeoutExpired:process.kill()

if __name__=='__main__':
    parser=argparse.ArgumentParser();parser.add_argument('--chrome',required=True);run(parser.parse_args().chrome)
