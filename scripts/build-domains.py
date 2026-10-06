"""Bundle data for HTTP and file://. UI contains no hardcoded sector knowledge."""
import json
from pathlib import Path
ROOT=Path(__file__).resolve().parents[1]
packs=[json.loads(p.read_text(encoding='utf-8')) for p in sorted((ROOT/'data/domains').glob('*.json'))]
if len({p['id'] for p in packs})!=len(packs): raise ValueError('Duplicate domain pack id')
(ROOT/'client/js/domain-data.js').write_text('// Generated from data/domains/*.json by scripts/build-domains.py.\nexport const DOMAIN_PACKS='+json.dumps(packs,ensure_ascii=False,indent=2)+';\n',encoding='utf-8',newline='\n')
print(f'{len(packs)} data-driven domain packs bundled.')
