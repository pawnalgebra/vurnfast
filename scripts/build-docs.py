"""Build local, escaped HTML docs and shared UI metadata without dependencies."""
import html
import json
from pathlib import Path
import re
from urllib.parse import urlsplit
from feature_catalog import FEATURES, TECHNIQUE_EXAMPLES, TOOL_DESCRIPTIONS

ROOT = Path(__file__).resolve().parents[1]
DOCS = ('USER_GUIDE', 'FEATURE_REFERENCE', 'WORKFLOW_GUIDE', 'TARGET_INTELLIGENCE_GUIDE')
SECTIONS = [('Fungsi', 'description'), ('Kenapa Feature Ini Penting', 'purpose'),
            ('Kapan Digunakan', 'when'), ('Input', 'inputs'), ('Output', 'outputs'),
            ('Cara Menggunakan', 'how'), ('Contoh', 'example'),
            ('Hubungan dengan Feature Lain', 'related'), ('Tips', 'tips')]


def technique_entries():
    for t in json.loads((ROOT / 'data/default-techniques.json').read_text(encoding='utf-8')):
        yield dict(id=t['id'], name=t['name'], status='Active', routes=[], operation=None, helper=None,
                   description=t['description'], purpose='Menguji invariant berikut: ' + t['securityInvariant'],
                   when='Ketika arsitektur dan scope target memiliki kondisi yang sesuai; review relevansi sebelum memilih teknik.',
                   inputs=f"Rarity: {t['rarity']}; Difficulty: {t['difficulty']}; Domain: {t['domain']}; Category: {t['category']}.\n\n"
                          f"Security invariant: {t['securityInvariant']}\n\nDimensions: WHO, WHAT, OBJECT, STATE, AUTHORITY, CONTEXT. "
                          "Target baru menambahkan priority/risk/cost manual masing-masing 50/100 dan flags Enabled=true, Tested=false, Interesting=false.",
                   outputs='Template hypothesis: ' + t['hypothesisTemplate'] + '\n\nTemplate test: ' + t['testTemplate'] +
                           '\n\nSignals: ' + '; '.join(t['signals']) +
                           '\n\nFalse positive indicators awal: Periksa role efektif, kepemilikan data, state terbaru, dan respons backend.' +
                           '\n\nStop condition: ' + t['stopCondition'],
                   how='1. Techniques → cari nama teknik.\n2. Buka detail invariant/template/signals/stop.\n3. Review scope.\n4. Buat hypothesis dan isi invariant/formula spesifik.\n5. Buat test manual serta kontrol pembanding.',
                   example=TECHNIQUE_EXAMPLES[t['id']] + ' Ini rencana/ilustrasi dummy, bukan klaim vulnerability aktual.',
                   related='Technique Library → Hypotheses → Test Cases → Evidence → Findings. Tool Knowledge/AI dapat memakai teknik sebagai context.',
                   tips='Signals memicu investigasi, bukan bukti vulnerability. Stop condition harus direview sebelum test. False positives dan score awal bersifat umum; sesuaikan dengan target. '
                        'Dimensions tersimpan sebagai metadata; UI teknik tidak menyediakan editor dimensi khusus. Nama/rank/libraryId sumber bawaan tetap dirujuk di sini; teknik per target dapat diedit.')


def build():
    features = [*FEATURES, *technique_entries()]
    ids = [f['id'] for f in features]
    if len(ids) != len(set(ids)):
        raise ValueError('Duplicate feature id')
    intro = '# Feature Reference\n\nReferensi pengguna untuk aplikasi 1.0.0, schema 2.0.0. '
    intro += 'Nama UI saat ini Universal Research Workspace. Isi mengikuti modul frontend, storage, backend, policy, katalog dan adapter yang diimplementasikan.\n\n'
    intro += '**Active:** fungsi tersedia dengan prasyarat yang dijelaskan. **Partial:** fungsi tersedia dengan kemampuan terbatas. '
    intro += '**Coming Soon:** placeholder belum berfungsi; tidak ada menu placeholder pada versi yang diaudit. '
    intro += 'AI tanpa konfigurasi berstatus Disabled/Misconfigured, bukan Coming Soon.\n\n'
    intro += 'Mulai dari [User Guide](USER_GUIDE.md) atau ikuti [Workflow Example SaaS](WORKFLOW_GUIDE.md). '
    intro += 'Gunakan pencarian browser (Ctrl+F) untuk menemukan field, helper, atau operasi.\n\n## Daftar Fitur\n\n'
    intro += '\n'.join(f"- [{f['name']}](#{f['id']}) — {f['status']}" for f in features) + '\n\n'
    content = [intro]
    for f in features:
        content.append(f"<a id=\"{f['id']}\"></a>\n\n# {f['name']}\n\nStatus: {f['status']}\n")
        for title, key in SECTIONS:
            content.append(f'\n## {title}\n\n{f[key]}\n')
        if f['id'] == 'tools':
            content.append('\n## Katalog Tool yang Tersedia\n\n'
                           'Berikut deskripsi mode yang dikurasi dalam aplikasi; seluruhnya manual, tidak dijalankan workspace. '
                           'Flag requiresAutomation/requiresThirdParty/requiresDos/destructive seluruh entri saat ini false karena mode yang dideskripsikan terbatas. '
                           'Tetap ikuti scope warning dan ketentuan penggunaan tool/program yang Anda review sendiri.\n\n'
                           '| Tool | Kategori katalog | Fungsi mode manual dalam katalog | Referensi tersimpan |\n'
                           '| --- | --- | --- | --- |\n')
            for t in json.loads((ROOT / 'data/tools/tools.json').read_text(encoding='utf-8')):
                content.append(f"| {t['name']} | {', '.join(t['categories'])} | {TOOL_DESCRIPTIONS[t['id']]} | [Dokumentasi {t['name']}]({t['documentation']}) |\n")
        if f['id'] == 'ai':
            content.append('\n## Daftar Operation yang Tersedia\n\n'
                           'Semua operasi memakai context preview, schema output, policy filter dan provider yang sama. '
                           'Operation mengarahkan prompt; bukan pipeline yang otomatis mengeksekusi target atau mengambil database eksternal.\n\n'
                           '| Operation | Label UI / referensi | Kapan | Output utama |\n| --- | --- | --- | --- |\n')
            for op in features:
                if op.get('operation'):
                    content.append(f"| `{op['operation']}` | [{op['name']}](#{op['id']}) | {op['when']} | {op['outputs']} |\n")
    (ROOT / 'docs/FEATURE_REFERENCE.md').write_text(''.join(content), encoding='utf-8', newline='\n')
    registry = [{k: f[k] for k in ('id', 'name', 'description', 'purpose', 'status', 'routes', 'operation', 'helper')}
                | {'documentation': f"docs/FEATURE_REFERENCE.html#{f['id']}"} for f in features]
    source = '// Generated by scripts/build-docs.py from scripts/feature_catalog.py and the technique catalog.\n'
    source += 'export const featureRegistry=' + json.dumps(registry, ensure_ascii=False, indent=2) + ';\n'
    source += 'export const routeFeatures=Object.fromEntries(featureRegistry.flatMap(feature=>feature.routes.map(route=>[route,feature.id])));\n'
    source += 'export const operationFeatures=Object.fromEntries(featureRegistry.filter(feature=>feature.operation).map(feature=>[feature.operation,feature.id]));\n'
    source += 'export const helperFeatures=Object.fromEntries(featureRegistry.filter(feature=>feature.helper).map(feature=>[feature.helper,feature.id]));\n'
    (ROOT / 'client/js/feature-registry.js').write_text(source, encoding='utf-8', newline='\n')
    output = ROOT / 'client/docs'
    output.mkdir(exist_ok=True)
    all_pages = {}
    for name in DOCS:
        markdown = (ROOT / 'docs' / (name + '.md')).read_text(encoding='utf-8')
        body, headings, anchors = render(markdown)
        all_pages[name] = anchors
        nav = ' '.join(f'<a href="{doc}.html">{label}</a>' for doc, label in
                       [('USER_GUIDE', 'User Guide'), ('FEATURE_REFERENCE', 'Feature Reference'), ('WORKFLOW_GUIDE', 'Workflow Guide'), ('TARGET_INTELLIGENCE_GUIDE', 'Intelligence Guide')])
        toc = ''.join(f'<li><a href="#{anchor}">{html.escape(label)}</a></li>' for level, label, anchor in headings if level <= 2)
        page = f'''<!doctype html>
<html lang="id"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<meta http-equiv="Content-Security-Policy" content="default-src 'self' file:; script-src 'none'; style-src 'self' file:; img-src 'self' file: data:; object-src 'none'; base-uri 'none'">
<title>{name.replace('_', ' ').title()} — Research Workspace</title><link rel="icon" href="data:,"><link rel="stylesheet" href="../assets/documentation.css"></head>
<body><header><strong>RESEARCH WORKSPACE / LEARN</strong><nav aria-label="Dokumentasi">{nav}</nav><a href="{name}.md" download>Download Markdown</a></header>
<main><details class="contents"><summary>Daftar isi</summary><ul>{toc}</ul></details><article>{body}</article></main>
<footer>Dokumentasi aplikasi 1.0.0 · Local first · Gunakan Ctrl+F untuk mencari.</footer></body></html>'''
        (output / (name + '.html')).write_text(page, encoding='utf-8', newline='\n')
        (output / (name + '.md')).write_bytes((ROOT / 'docs' / (name + '.md')).read_bytes())
    for name in DOCS:
        text = (ROOT / 'docs' / (name + '.md')).read_text(encoding='utf-8')
        for target in re.findall(r'\]\(([^)]+)\)', text):
            parsed = urlsplit(target)
            if parsed.scheme:
                if parsed.scheme not in ('http', 'https'):
                    raise ValueError('Unsupported documentation link: ' + target)
                continue
            document = Path(parsed.path).stem if parsed.path else name
            if document not in all_pages or parsed.fragment and parsed.fragment not in all_pages[document]:
                raise ValueError(f'Broken documentation link in {name}: {target}')
    print(f'Documentation generated: {len(features)} feature entries, {len(DOCS)} offline guides.')


def inline(text):
    pattern = r'(`[^`]+`|\*\*[^*]+\*\*|\[[^\]]+\]\([^\s)]+\))'
    result = []
    for part in re.split(pattern, text):
        if part.startswith('`') and part.endswith('`'):
            result.append('<code>' + html.escape(part[1:-1]) + '</code>')
        elif part.startswith('**') and part.endswith('**'):
            result.append('<strong>' + html.escape(part[2:-2]) + '</strong>')
        elif match := re.fullmatch(r'\[([^\]]+)\]\(([^\s)]+)\)', part):
            label, target = match.groups()
            parsed = urlsplit(target)
            if parsed.scheme not in ('', 'http', 'https') or target.startswith('//'):
                result.append(html.escape(part))
                continue
            target = re.sub(r'\.md(?=#|$)', '.html', target)
            result.append('<a href="' + html.escape(target, quote=True) + '">' + html.escape(label) + '</a>')
        else:
            result.append(html.escape(part))
    return ''.join(result)


def render(markdown):
    lines = markdown.splitlines()
    output, headings, anchors, counts = [], [], set(), {}
    paragraph = []
    i = 0
    pending_anchor = None

    def flush():
        if paragraph:
            output.append('<p>' + inline(' '.join(paragraph)) + '</p>')
            paragraph.clear()

    while i < len(lines):
        line = lines[i]
        if not line.strip():
            flush(); i += 1; continue
        if anchor := re.fullmatch(r'<a id="([a-z0-9_-]+)"></a>', line):
            flush(); pending_anchor = anchor[1]
            if pending_anchor in anchors:
                raise ValueError('Duplicate documentation anchor: ' + pending_anchor)
            anchors.add(pending_anchor)
            output.append(f'<a id="{pending_anchor}" class="section-anchor"></a>')
            i += 1; continue
        if heading := re.match(r'^(#{1,6}) (.+)$', line):
            flush()
            level, label = len(heading[1]), heading[2]
            slug = re.sub(r'[^\w-]+', '-', label.lower()).strip('-')
            count = counts.get(slug, 0); counts[slug] = count + 1
            slug = slug if not count else slug + '-' + str(count)
            while slug in anchors:
                slug += '-heading'
            anchors.add(slug)
            output.append(f'<h{level} id="{slug}">' + inline(label) + f'</h{level}>')
            headings.append((level, label, pending_anchor or slug))
            pending_anchor = None
            i += 1; continue
        if line.startswith('```'):
            flush(); code = []; i += 1
            while i < len(lines) and not lines[i].startswith('```'):
                code.append(lines[i]); i += 1
            output.append('<pre><code>' + html.escape('\n'.join(code)) + '</code></pre>')
            i += 1; continue
        if line.startswith('|') and i + 1 < len(lines) and re.fullmatch(r'[|\s:-]+', lines[i + 1]):
            flush()
            rows = [line]; i += 2
            while i < len(lines) and lines[i].startswith('|'):
                rows.append(lines[i]); i += 1
            table = ['<div class="table-scroll"><table>']
            for index, row in enumerate(rows):
                tag = 'th' if index == 0 else 'td'
                table.append('<tr>' + ''.join(f'<{tag}>' + inline(cell.strip()) + f'</{tag}>' for cell in row.strip('|').split('|')) + '</tr>')
            table.append('</table></div>'); output.extend(table); continue
        if list_item := re.match(r'^(- |\d+\. )(.+)$', line):
            flush(); ordered = list_item[1] != '- '; tag = 'ol' if ordered else 'ul'
            output.append('<' + tag + '>')
            pattern = r'^\d+\. (.+)$' if ordered else r'^- (.+)$'
            while i < len(lines) and (item := re.match(pattern, lines[i])):
                output.append('<li>' + inline(item[1]) + '</li>'); i += 1
            output.append('</' + tag + '>'); continue
        paragraph.append(line); i += 1
    flush()
    return '\n'.join(output), headings, anchors


if __name__ == '__main__':
    build()
