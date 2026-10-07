"""Offline regressions for the simplified navigation and canonical record handoffs."""
import argparse, json, socket, subprocess, time, urllib.request
from browser import CDP, ROOT

def run(chrome):
    output=ROOT/'.qa'/('refinement-'+str(time.time_ns()));output.mkdir(parents=True,exist_ok=True)
    with socket.socket() as probe:probe.bind(('127.0.0.1',0));port=probe.getsockname()[1]
    process=subprocess.Popen([chrome,'--headless=new','--no-first-run','--no-default-browser-check','--disable-background-networking','--disable-component-update','--disable-sync',f'--remote-debugging-port={port}',f'--user-data-dir={output / "profile"}','about:blank'],stdout=subprocess.DEVNULL,stderr=subprocess.DEVNULL,creationflags=getattr(subprocess,'CREATE_NO_WINDOW',0))
    try:
        for _ in range(60):
            try:pages=json.load(urllib.request.urlopen(f'http://127.0.0.1:{port}/json',timeout=1));break
            except Exception:time.sleep(.2)
        else:raise RuntimeError('Chrome DevTools did not start')
        c=CDP(next(page['webSocketDebuggerUrl'] for page in pages if page['type']=='page'))
        for domain in ['Runtime','Page','Network']:c.call(domain+'.enable')
        c.go(ROOT.joinpath('index.html').as_uri())
        groups=[['attack-surface','actors','objects','boundaries'],['target-intelligence','domain-knowledge','terminology','business-flows','critical-assets','research-questions'],['settings','research-environment','tool-inventory','ai-provider','agentic-settings','backup'],['ai','review-queue','research-details','manual-analysis','agent-history']]
        def verify_tabs():
            for group in groups:
                c.route(group[0])
                for route in group:
                    c.js('document.querySelector(\'nav[aria-label="Related research pages"] a[href="#'+route+'"]\').click()');c.wait(100)
                    assert c.js("document.querySelectorAll('nav[aria-label=\"Related research pages\"]').length")==1,route
                    assert c.js("[...document.querySelectorAll('nav[aria-label=\"Related research pages\"] a')].map(a=>a.hash.slice(1))")==group,route
                    assert c.js("document.querySelector('nav[aria-label=\"Related research pages\"] a[aria-current=page]').hash")==('#'+route),route
                    assert c.js("[...document.querySelectorAll('nav[aria-label=\"Related research pages\"] a')].every(a=>a.getClientRects().length>0)"),route
            for route in ['ai-techniques','ai-tools','ai-gaps','ai-findings']:
                c.route(route);assert c.js("document.querySelector('nav[aria-label=\"Related research pages\"] a[aria-current=page]').hash")=='#ai',route
        verify_tabs()
        c.route('targets');c.click('+ Create Target');c.submit({'name':'Refinement Lab','platform':'Private','asset':'owned.test'})
        verify_tabs()
        c.route('helpers');assert c.js("document.querySelector('select[aria-label=\"Internal Helper\"]').querySelectorAll('option:not([hidden])').length")==8
        c.click('+ Add Row');c.submit({'who':'Owned Member','object':'Owned Export','what':'export','authority':'member','expectedResult':'Only the owner may export'})
        original=c.state()['targets'][0]['helperRecords']
        c.click('Review Hypothesis');assert c.js("document.querySelector('dialog form').elements.invariant.value")=='Only the owner may export'
        assert not c.js("document.querySelector('dialog form').elements.notes.closest('details').open")
        assert c.js("document.querySelector('dialog form').elements.title.getClientRects().length")>0
        c.submit({'title':'Review owner control','notes':'Preserve hidden planning note'})
        assert c.state()['targets'][0]['helperRecords']==original
        c.route('hypotheses');c.click('Edit');c.submit({'title':'Owner control revised'})
        target=c.state()['targets'][0];assert target['hypotheses'][0]['notes']=='Preserve hidden planning note'
        c.click('Buat Test Case');c.submit({'title':'Matched owner control','requestNotes':'Saved request metadata','responseNotes':'Saved response metadata'})
        c.route('tests');c.click('Edit');assert not c.js("document.querySelector('dialog form').elements.requestNotes.closest('details').open")
        c.submit({'title':'Matched owner control revised'})
        test=c.state()['targets'][0]['testCases'][0];assert test['requestNotes']=='Saved request metadata';assert test['responseNotes']=='Saved response metadata'
        c.route('findings');c.click('+ Create Finding');c.submit({'title':'Unreviewed candidate','rootCause':'Research hypothesis','researchNotes':'Retain review notes'})
        assert c.js("document.body.textContent.includes('completeness gaps')")
        c.click('Edit Review Notes');c.submit({'title':'Candidate revised'})
        finding=c.state()['targets'][0]['findings'][0];assert finding['rootCause']=='Research hypothesis';assert finding['researchNotes']=='Retain review notes';assert finding['status']=='draft'
        c.route('ai-gaps');assert 'Coverage' in c.js('document.body.textContent') or 'Gap' in c.js('document.body.textContent')
        c.route('attack-surface');assert c.js("document.querySelector('nav[aria-label=\"Related research pages\"] a[href=\"#boundaries\"]')!==null")
        c.route('dashboard');assert c.js("document.body.textContent.includes('Next Manual Work')")
        c.call('Emulation.setDeviceMetricsOverride',{'width':390,'height':844,'deviceScaleFactor':1,'mobile':True})
        assert c.js('document.documentElement.scrollWidth<=window.innerWidth')
        for group in groups:
            c.route(group[-1]);assert c.js('document.documentElement.scrollWidth<=window.innerWidth'),group
            assert c.js("[...document.querySelectorAll('nav[aria-label=\"Related research pages\"] a')].every(a=>a.getClientRects().length>0)")
        c.route('dashboard')
        saved=c.state();c.call('Page.reload');c.wait(800);assert c.state()==saved
        assert not c.errors,c.errors
        assert not any(r['url'].startswith(('http:','https:')) for r in c.requests),'Manual refinement workflow must stay offline'
        print('PASS refinement UI: all grouped tabs survive real link navigation with/without target and disabled AI, aliases, mobile, local gaps, editable helper handoff, hidden field preservation, draft review, reload persistence and zero network.')
        print('Artifacts:',output)
    finally:
        process.terminate()
        try:process.wait(timeout=8)
        except subprocess.TimeoutExpired:process.kill()

if __name__=='__main__':
    parser=argparse.ArgumentParser();parser.add_argument('--chrome',required=True);run(parser.parse_args().chrome)
