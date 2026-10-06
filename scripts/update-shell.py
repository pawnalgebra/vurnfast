"""Retain both root and client entry points; root preserves the original browser origin."""
from pathlib import Path
root=Path(__file__).resolve().parents[1]
source=(root/'index.html').read_text(encoding='utf-8')
source=source.replace('href="assets/styles.css"','href="client/assets/styles.css"').replace('src="js/loader.js"','src="client/js/loader.js"')
source=source.replace("connect-src 'self';", "connect-src 'self' http://127.0.0.1:* http://localhost:* http://[::1]:*;")
source=source.replace(' http://[::1]:*','') # Chromium does not accept IPv6 CSP host-source literals.
if 'name="workspace-backend"' not in source:source=source.replace('<title>Universal Research Workspace</title>','<title>Universal Research Workspace</title>\n  <meta name="workspace-backend" content="">')
source=source.replace('MANUAL RESEARCH · v0.1','MANUAL RESEARCH · v1.0.0').replace('MANUAL RESEARCH · v0.2','MANUAL RESEARCH · v1.0.0')
(root/'index.html').write_text(source,encoding='utf-8')
client=source.replace('href="client/assets/styles.css"','href="assets/styles.css"').replace('src="client/js/loader.js"','src="js/loader.js"').replace('href="universal_bug_bounty_playbook.html"','href="../universal_bug_bounty_playbook.html"')
(root/'client/index.html').write_text(client,encoding='utf-8')
