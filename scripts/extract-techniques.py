"""Preserve the original playbook and extract its complete technique documentation."""
import re, json, html
from pathlib import Path
root = Path(__file__).resolve().parents[1]
source = (root / 'universal_bug_bounty_playbook.html').read_text(encoding='utf-8')
source = re.sub(r'<!--[\s\S]*?-->', '', source)
def clean(value):
    text = html.unescape(re.sub('<[^>]+>', '', value)).strip()
    return text.replace('â†’', '→')
items = []
for attributes, body in re.findall(r'<article\s+([^>]*class="card technique"[^>]*)>([\s\S]*?)</article>', source):
    attrs = dict(re.findall(r'([\w-]+)="([^"]*)"', attributes))
    fields = {clean(k): clean(v) for k,v in re.findall(r'<dt>(.*?)</dt><dd>(.*?)</dd>', body)}
    rank = int(attrs['data-rank'])
    items.append(dict(id=f'tech_{rank:02}', rank=rank, name=clean(re.search(r'<h3>(.*?)</h3>', body)[1]), rarity='very-rare' if rank <= 7 else attrs['data-rarity'], difficulty=attrs['data-difficulty'], domain=attrs['data-domain'], description=clean(re.search(r'<p>(.*?)</p>', body)[1]), hypothesisTemplate=fields.get('Hypothesis',''), testTemplate=fields.get('Test',''), signals=[fields.get('Signal','')], stopCondition=fields.get('Stop','')))
assert len(items) == 20
categories=['State Machine','Async / Queue','Approval / Capability','Session','API','Browser / Extension','State Machine','Race Condition','Webhook','Realtime / WebSocket','Parser Differential','Cache','OAuth / SSO','Tenant Isolation','File Boundary','Authorization','Authorization','Business Logic','Authentication','API']
for item,category in zip(items,categories):item['category']=category
invariants=[
 'Actor, object, state, authority, dan context harus konsisten pada setiap keputusan authorization.',
 'Worker harus memvalidasi kembali authority dan state saat job benar-benar dijalankan.',
 'Approval harus terikat pada actor, action, object, destination, context, dan lifecycle penggunaan yang diizinkan.',
 'Restart/resume tidak boleh mengembalikan permission atau capability yang sudah tidak valid.',
 'Semua surface harus menegakkan invariant authorization yang sama.',
 'Pesan lintas browser/extension/app harus memvalidasi asal, destination, dan authority sebelum aksi terlindungi.',
 'Object yang revoked/deleted/expired tidak boleh tetap dapat diakses melalui authority lama.',
 'Pemeriksaan authority dan perubahan state harus konsisten terhadap interleaving transaksi.',
 'Callback destination dan webhook harus tetap terikat pada owner dan tenant yang diotorisasi.',
 'Channel realtime harus memvalidasi authority terbaru setelah role/session/resource berubah.',
 'Parser di setiap surface harus menafsirkan object/action/context secara konsisten.',
 'Cache harus memisahkan protected content berdasarkan authority, tenant, dan variant yang relevan.',
 'Identitas, issuer, session, dan account linking harus terikat pada akun yang benar.',
 'Authority suatu tenant tidak boleh digunakan untuk resource tenant lain.',
 'File, share, dan export harus menegakkan owner, ACL, expiry, dan revocation secara konsisten.',
 'Role rendah tidak boleh menjalankan fungsi yang membutuhkan role lebih tinggi.',
 'Identifier object tidak boleh menggantikan pemeriksaan kepemilikan dan authorization.',
 'Transisi business state harus memenuhi prasyarat dan authority yang berlaku.',
 'Session yang expired/revoked/logout tidak boleh tetap memberikan authority aktif.',
 'Validasi dan konfigurasi harus menjaga protected outcome sesuai batas authority yang ditentukan.'
]
for item,invariant in zip(items,invariants):item['securityInvariant']=invariant
(root/'data/default-techniques.json').write_text(json.dumps(items,ensure_ascii=False,indent=2),encoding='utf-8')
(root/'client/js/technique-data.js').write_text('// MODULE: Bundled technique reference; regenerate using scripts/extract-techniques.py.\nexport const DEFAULT_TECHNIQUES = '+json.dumps(items,ensure_ascii=False,indent=2)+';\n',encoding='utf-8')
