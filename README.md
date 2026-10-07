# Advanced Bug Bounty Research Workspace · v2.0.0

Rilis **v2.0.0** menambahkan Agentic AI Research ke fitur v1.0.0. Schema workspace tetap **2.0.0**, terpisah dari versi rilis aplikasi; backup dan migrasi data existing tetap didukung.

Platform local-first untuk riset bug bounty manual lintas program: target → scope/rules → actors/objects/trust boundaries → techniques → hypotheses → test cases → evidence → findings → laporan Indonesia. **Researcher First · AI Optional · Program Rules First · Evidence Required.**

Core tetap offline dan tidak bergantung backend. AI memberi rekomendasi dan draft yang harus direview; workspace tidak menjalankan scanner, commands, fuzzing, brute force, atau interaksi otomatis dengan asset target.

## Dokumentasi Pengguna

- [USER_GUIDE](docs/USER_GUIDE.md): mulai dari instalasi, konsep WHO/WHAT/OBJECT/STATE/AUTHORITY/CONTEXT, sampai report dan backup.
- [FEATURE_REFERENCE](docs/FEATURE_REFERENCE.md): fungsi, input, output, contoh, hubungan, status Active/Partial, dan batasan setiap fitur, helper, operasi AI, serta 20 teknik bawaan.
- [WORKFLOW_GUIDE](docs/WORKFLOW_GUIDE.md): latihan Example SaaS dalam 20 langkah, dengan alur AI aktif dan tanpa AI.
- [TARGET_INTELLIGENCE_GUIDE](docs/TARGET_INTELLIGENCE_GUIDE.md): profil bisnis, provenance, 13 domain pack, glossary, critical transitions, dan latihan Finance tanpa AI.
- [AGENTIC_RESEARCH_GUIDE](docs/AGENTIC_RESEARCH_GUIDE.md): supervised orchestrator, 13 specialist, review/manual analysis, tool permissions, history, stop conditions dan estimated budgets.

Di aplikasi, tombol **?** menyediakan tooltip singkat dan dialog bantuan. **View Documentation** membuka bagian terkait dalam dokumentasi HTML lokal; bekerja pada file://, HTTP statis folder client, dan backend Fastify. Halaman dokumentasi mempunyai daftar isi, tautan lima panduan, dan download Markdown.

## Agentic AI Research — v2

Agent Message tersedia di kanan ketika kedua AI flags aktif. Autocomplete `@agent`/`#reference` muncul tepat di atas input; Enter mengirim, Shift+Enter menambah baris. Percakapan grup menampilkan identitas, waktu dan model setiap agent. Tanpa tag, General mengajak hingga tiga specialist sesuai pertanyaan/context; hingga empat mention memilih anggota secara eksplisit. Tombol + mendukung file teks/kode/log/JSON/HAR dan gambar PNG/JPEG/WebP, preview/remove, paste dan drop. Model selector mengirim pilihan ke provider; Refresh models mengambil katalog provider, atau batasi pilihan dengan `AI_ALLOWED_MODELS`. Setiap panggilan memakai budget/policy/review existing. Detail: [Agent Message Guide](docs/AGENTIC_RESEARCH_GUIDE.md#agent-message).

Default `AI_ENABLED=false` dan `AGENTIC_AI_ENABLED=false`. AI=true + Agentic=false mempertahankan Copilot manual; AI=false selalu menonaktifkan agentic, termasuk bila flag agentic=true. Jika kedua flags aktif dan provider configured, Dashboard menampilkan Start/Continue Research, Review Queue dan Manual Analysis. Orchestrator backend memilih 13 specialist, berhenti untuk review/approval/testing/uncertainty/policy/limits, lalu melanjutkan setelah keputusan peneliti. Actors/objects/boundaries/hypotheses/test plans/potential findings/report adalah proposals sebelum diterapkan ke koleksi existing.

Tool Inventory mendukung manual entry dan fixed local version detection. Native knowledge-search/JSON-parse/evidence-compare adapters mempunyai SAFE_AUTO/APPROVAL_REQUIRED/DENIED policy; signed approvals terikat pada exact action/scope dan sekali pakai. Tidak ada unrestricted shell, instalasi otomatis atau external target execution. `AGENT_ALLOW_TARGET_REQUESTS=false` adalah default; true tetap tidak menjalankan HTTP/browser/network karena external adapters belum tersedia pada rilis ini. Tool network yang direkomendasikan dijalankan manual oleh peneliti.

`AGENT_MAX_STEPS=8`, `AGENT_RUN_BUDGET_USD=0.25`, `AGENT_DAILY_BUDGET_USD=2.00`, `AGENT_CALL_BUDGET_USD=0.03` mengontrol reservasi **estimasi yang dikonfigurasi**, bukan harga model/tagihan aktual. Reservasi sebelum call tersimpan di `.runtime/agent-cost-ledger.json` untuk cap harian UTC yang bertahan saat restart. Actual billed cost Unknown. Evidence dan false-positive/duplicate review diperlukan sebelum Confirm Finding; konfirmasi/severity tetap keputusan peneliti. Detail setup, latihan lengkap dan batasan tersedia di Agentic Guide.

## How to Learn This System

Ikuti urutan berikut sambil menjalankan [workflow Example SaaS](docs/WORKFLOW_GUIDE.md). Buat satu catatan pada tiap tahap sebelum melanjutkan.

Sebelum Actors & Objects, pelajari **Target Intelligence → Domain Knowledge → Terminology → Business Flows**. Tentukan primary sector dan secondary domains, bedakan fakta bersumber dari pola domain, lalu review actor/object suggestions. Gunakan [latihan Finance](docs/TARGET_INTELLIGENCE_GUIDE.md) untuk menurunkan flow → critical transition → invariant → research question → hypothesis → test case.

1. [Target](docs/USER_GUIDE.md#cara-membuat-target-pertama): identitas program/aset dan lingkungan.
2. [Scope](docs/USER_GUIDE.md#cara-memasukkan-scope-dan-rules): batas izin, guard, rules, dan stop conditions.
3. [Actors & Objects](docs/USER_GUIDE.md#cara-membuat-actor): pelaku, resource, ownership, tenant, state.
4. [Trust Boundaries](docs/USER_GUIDE.md#cara-membuat-trust-boundary): perpindahan trust/authority antar komponen.
5. [Techniques](docs/USER_GUIDE.md#cara-memilih-technique): pilih invariant yang sesuai sistem.
6. [Hypotheses](docs/USER_GUIDE.md#cara-membuat-hypothesis): pisahkan aturan yang diharapkan dari dugaan kegagalan.
7. [Test Cases](docs/USER_GUIDE.md#cara-membuat-test-case): langkah manual serta expected/actual dan PASS/FAIL.
8. [Evidence](docs/USER_GUIDE.md#cara-menyimpan-evidence): observasi redacted dan referensi file.
9. [Findings](docs/USER_GUIDE.md#cara-membuat-finding): authority, restriction, resource, outcome, impact.
10. [Reports](docs/USER_GUIDE.md#cara-generate-report): review, edit, dan export laporan Indonesia.
11. [AI Tools](docs/USER_GUIDE.md#cara-menggunakan-ai): konfigurasi, preview, privacy, dan keputusan peneliti.
12. [Coverage / Knowledge Base](docs/USER_GUIDE.md#cara-membaca-research-coverage): pilih gap berikutnya dan simpan lessons.

## Memperbarui Dokumentasi dan Bantuan

`scripts/feature_catalog.py` adalah sumber bersama description, purpose, status, mapping route/operation/helper, dan isi referensi fitur. `data/default-techniques.json` menyediakan metadata 20 teknik. Edit kedua sumber sesuai perubahan implementasi; `docs/USER_GUIDE.md` dan `docs/WORKFLOW_GUIDE.md` ditulis langsung. Jalankan `python scripts/build.py` untuk menghasilkan `docs/FEATURE_REFERENCE.md`, `client/js/feature-registry.js`, seluruh halaman `client/docs/`, dan bundle offline. Jangan mengedit output generated secara langsung.

Build memeriksa tautan antarbagian. Test dokumentasi memeriksa cakupan semua menu, operasi AI, helper, teknik, dan ketersediaan halaman/anchor melalui backend yang hanya menyajikan client. Sumber frontend/dependensi dan alur manual tidak berubah oleh status dokumentasi.

## Menjalankan

Gunakan **Node >=20.19**, disarankan **Node 22+**. Dependency backend sudah tercantum di lockfile.

```powershell
npm install
npm start
```

Buka **http://127.0.0.1:3001**. `.env` default menggunakan `AI_ENABLED=false`. Backend bind loopback dan hanya menyajikan folder `client/`; `.env`, server source, research JSON, dan node_modules tidak disajikan.

Jika Node default Windows masih lama, helper ini memilih versi modern yang sudah ada di nvm tanpa mengganti konfigurasi global:

```powershell
powershell -File scripts/workspace.ps1 -Action start
powershell -File scripts/workspace.ps1 -Action test
```

Untuk **core offline tanpa Node**, buka `index.html` root langsung atau `client/index.html`. File mode memakai bundle dari source ES Modules. Untuk pengembangan frontend saja, jalankan `python -m http.server 8000 --bind 127.0.0.1 --directory client`. Jangan memakai HTTP server umum pada root project yang berisi `.env`.

AI memerlukan HTTP localhost; backend sengaja menolak Origin `null` dari file://. Dari frontend HTTP pada port berbeda, buka AI Provider → Connect Backend dengan origin localhost. Pada Fastify, koneksi otomatis memperoleh safe config. Seluruh core manual tetap berfungsi bila backend dimatikan atau AI gagal.

## Arsitektur

```text
client/
  index.html, assets/styles.css
  js/app.js, store.js, storage.js, router.js, utils.js, forms.js
  js/modules/                      View CRUD, reporting, knowledge, helpers, AI
  js/services/
    domain-schema.js                Pack/provenance validation
    domain-knowledge.js             Local packs, profile, flows and relationships
    knowledge-context.js            Selected, bounded intelligence context
    knowledge-schema.js             Separate 11-operation AI contract
    knowledge-search.js             Global research/domain knowledge search
    rules.js                       Scope assessment dan hard policy filter
    redactor.js                    SecretRedactor browser/backend
    context.js                     Allowlisted, selected-target AI context
    ai-schema.js                   Strict structured response validation
    ai-client.js                   Optional localhost bridge, session memory
    analysis.js                    Coverage, text comparison, duplicate heuristics
  js/templates/report-id.js        Deterministic Indonesian template
  js/knowledge-data.js              Generated tool/helper catalogs
  js/technique-data.js              Seluruh 20 teknik original
  js/loader.js, bundle.js           Modules on HTTP, generated file:// bundle
server/
  index.js, app.js                  Fastify entry, localhost API/static root
  config.js                        Server-only .env and safe config
  ai/provider.js                   AiProvider.complete(request), four adapters
  services/advisor.js               CyberResearchAdvisor and output constraints
  services/target-knowledge.js      Optional knowledge AI; no automatic facts/findings
data/
  domains/*.json                    13 offline packs, editable workspace overrides
  default-techniques.json
  tools/tools.json, helpers/helpers.json
  example-workspace.json            Fiktif schema v2
  example-workspace-v1.json         Legacy migration fixture
scripts/                           Build, fixture migration, local launcher
tests/                             Node tests, real Chrome workflow, mock provider
.env, .env.example                 Backend-only AI config; .env ignored by Git
workspace.json                     Canonical empty v2 template
index.html                         Root entry preserves original browser context
universal_bug_bounty_playbook.html  Original documentation retained
style.css                          Original documentation stylesheet
docs/v1-architecture.md            Previous architecture reference
```

Source ES Modules tetap modular. Store memiliki satu jalur mutation, timestamps, subscriptions, dan reference cleanup. Backend hanya memberi analisis; tidak menyimpan workspace atau evidence ke filesystem/server DB. Shared rules, redaction, dan output schema tidak memiliki dependency DOM. Runtime dependency hanya Fastify dan static-serving plugin.

## Persistence, migration, dan backup

**IndexedDB** database `universal-research-workspace`, object store `workspace`, key `primary`, adalah persistence utama. Autosave memakai debounce 350 ms, snapshot terpisah, dan write queue berurutan. UI menampilkan Saved locally, Unsaved changes, Saving..., error, dan Last saved.

Journal localStorage `universal-bounty-pending-v2` bersifat opsional untuk recovery perubahan saat tab crash/ditutup. Journal dihapus setelah snapshot yang sama berhasil commit ke IndexedDB. Jika localStorage tidak tersedia atau penuh, IndexedDB tetap dapat bekerja. Tab menunggu/pengingat perubahan pending saat close. Jika IndexedDB gagal, data di memory tetap dapat diekspor; UI tidak mengklaim berhasil tersimpan.

Saat pertama kali v2 dibuka pada **origin/context yang sama**, `migrateWorkspace(data)` membaca legacy localStorage `universal-bounty-workspace-v1`, meng-upgrade schema, dan menulis IndexedDB. Salinan legacy tidak dihapus. Gunakan root `index.html` untuk mempertahankan konteks path awal. Storage file:// bergantung browser; HTTP/ports/browser berbeda memiliki storage berbeda, sehingga gunakan export/import untuk memindahkan workspace.

**Export Workspace → `workspace.json`**, Export Backup → file bertanggal. Import menerima v1 dan v2, memvalidasi dahulu, lalu confirmation penggantian. Reset selalu meminta confirmation. Export → Reset → Import mempertahankan **state v2 identik**, termasuk UUID, timestamps, evidence, drafts, KB, helper records, dan AI suggestions. Migration v1 menambah field v2 tanpa membuang catatan lama. JSON invalid tidak mengganti state.

File System Access tetap opsional: Connect workspace.json → Save to workspace.json. Autosave tidak menulis file ini. File connection tidak membaca/mengimpor otomatis dan perlu dibuat lagi setelah reload. Browser/context dapat membatasi API. `data.json` lama tetap ada sebagai template v1; kedua file root bukan lokasi autosave browser.

## Schema v2

```json
{
  "schemaVersion": "2.0.0",
  "applicationVersion": "2.0.0",
  "updatedAt": "ISO-8601",
  "targets": [],
  "domainPacks": []
}
```

Setiap target mempertahankan profile, scope/guard, actors, objects, boundaries, techniques, hypotheses, testCases, findings, evidence, notes. V2 menambah:

- `programRules`: boolean `automationAllowed`, `dosAllowed`, `thirdPartyTesting`, default false.
- `knowledgeBase`: category, title, content, source dan comparison metadata opsional.
- `helperRecords`: authorization matrix rows dan state transitions.
- `aiSuggestions`: UUID, operation, provider/model, privacyMode, sourceFindingId, validated response, status pending/accepted/rejected.
- `intelligence`: 16-field profile with provenance, primary/secondary domain IDs, accepted items, reviewed AI suggestions and classification provenance. Existing v1/v2 imports receive empty intelligence fields; existing records stay intact.
- Workspace `domainPacks` stores custom packs and overrides. Default packs load from `data/domains/`; build generates an offline module. JSON backups carry overrides; `knowledgeLinks` carries domain/flow/invariant/question references through hypotheses, tests and findings.

The core includes AI, Finance, Banking, Fintech, SaaS, E-commerce, Healthcare, Cloud, Developer Platform, Social Media, Telecommunication, Education and Enterprise Software. Beginner/Intermediate/Advanced learning, glossary and technique mappings work with `AI_ENABLED=false`. The separate `/api/knowledge` endpoint offers 11 reviewed operations using selected context, existing provider/config/privacy settings, and explicit researcher acceptance. Domain patterns and AI inference never establish a vulnerability or confirmed company fact automatically.

Technique memiliki category, securityInvariant, dimensions, signals, falsePositiveIndicators, stopConditions, researchPriority, duplicateRisk, testingCost. Skor manual bernilai 0–100 dan dapat diedit. Sorting Rare First, Easy First, Highest Research Priority, Lowest Duplicate Risk, Lowest Testing Cost. Blueprint ranking bukan severity.

Relasi memakai UUID: techniqueId, hypothesisId, testCaseId, findingId, boundaryId, evidenceIds. Formula WHO/WHAT/OBJECT/STATE/AUTHORITY/CONTEXT memakai snapshot teks. Boundary memiliki from/to/channel/authority/trust/notes; test dapat dihubungkan ke boundary untuk coverage. Entity deletion melepaskan reference tanpa menghapus research lain. Import memeriksa tipe, IDs unik, references, unsafe keys, AI output, schema, ukuran JSON 20 MB, kedalaman dan field besar. Extension fields aman dipertahankan.

## Manual research dan knowledge

Seluruh fitur v1 tetap tersedia. Isi scope dan Engagement Guard, tentukan **Hard Program Rules**, lalu petakan actors/objects/boundaries. Pilih technique, tulis invariant, expected behavior dan dugaan, lalu buat test manual. **FAIL** berarti invariant gagal; PASS berarti kontrol bekerja; INCONCLUSIVE membutuhkan investigasi. Catat actual result dan evidence yang dire­daksi sebelum promosi ke finding.

Finding dibuat sebagai draft dengan severity **Unknown**; peneliti memilih Researcher Estimate. Indonesian report bekerja tanpa AI dan membedakan observasi versus root cause hypothesis. Preview, copy Markdown, export .md/.txt/.html dan print tersedia. Draft report autosave; Generate ulang meminta confirmation jika draft tersimpan.

Dashboard menampilkan research counts dan coverage Technique, Actor, Object, State, Boundary. Coverage menghitung test yang hasilnya sudah dicatat, **bukan keberhasilan security controls**. Gap Analyzer mengungkap entri untested dan ketiadaan revocation, async, atau cross-surface tests.

KB mendukung Technique Notes, Research Patterns, False Positives, Finding Patterns, Program Notes, Architecture Patterns, Lessons, Disclosed Reports. Search/filter dan CRUD lokal. KB baru masuk context AI jika checkbox Include Knowledge Base dipilih.

Internal helpers bekerja lokal: Authorization Matrix Builder, State Transition Builder, Trust Boundary Mapper, Evidence Comparator, Secret Redactor, template Hypothesis Generator, Scope Checker, Finding Checklist, Duplicate Comparator, Report Builder, Research Gap Analyzer. Matrix/state rows disimpan; redactor raw input tidak autosave. Duplicate comparison menilai kemiripan teks root cause/boundary/primitive/component/impact dengan status Likely Unique/Possible Variant/Likely Duplicate/Unknown. Ini heuristik dan memerlukan review manual, terutama bila metadata known issues tidak lengkap.

## AI config dan provider

`.env.example` menunjukkan seluruh konfigurasi. Tidak ada default model: pilih model yang tersedia di akun/provider dan mendukung structured JSON sesuai kontrak.

```env
AI_ENABLED=false
AI_PROVIDER=openai
OPENAI_API_KEY=
OPENAI_MODEL=
ANTHROPIC_API_KEY=
ANTHROPIC_MODEL=
GEMINI_API_KEY=
GEMINI_MODEL=
OLLAMA_BASE_URL=http://127.0.0.1:11434
OLLAMA_MODEL=
AI_REDACT_SECRETS=true
AI_PRIVACY_MODE=REDACTED_CLOUD
SERVER_HOST=127.0.0.1
SERVER_PORT=3001
```

Ubah `.env`, restart backend, lalu reconnect jika frontend terpisah. AI_DISABLED tidak membutuhkan key/model, tidak menginisialisasi provider, dan menyembunyikan AI actions. Safe config hanya provider/model/status/enabled/configured/privacy flags dan token sesi localhost; API key tidak pernah dikirim ke browser, IndexedDB, localStorage, log, atau API response. Token sesi adalah anti-CSRF token aplikasi, bukan API key provider.

Provider adapters memakai `AiProvider.complete({system,prompt,schema})`. OpenAI Responses memakai strict JSON schema dan `store:false` ([official OpenAI structured outputs](https://developers.openai.com/api/docs/guides/structured-outputs?api-mode=responses)). Anthropic memakai Messages/JSON output config ([Claude API](https://platform.claude.com/docs/en/api/messages/create)), Gemini generateContent/responseJsonSchema ([Gemini API](https://ai.google.dev/api/generate-content)), Ollama chat/format schema ([Ollama API](https://docs.ollama.com/api/chat)). Vendor/model yang tidak mendukung schema akan menghasilkan Provider Error tanpa mengubah core workspace. Provider requests tidak memiliki tools/function execution.

Status: Disabled, Misconfigured, Connected, Provider Error. Connected berarti backend/provider terkonfigurasi dan siap menerima request; bukan bukti credentials/model telah diverifikasi melalui panggilan live. Error provider memakai pesan generik dan tidak mengungkap upstream body/stack/keys. Request timeout 60 s, response limit 500 KB, satu provider request aktif.

## AI context, privacy, dan acceptance

Context memakai allowlist selected target: profile, recorded authorization, scope/rules, actors/objects/boundaries, techniques, hypotheses/tests/findings, research goal dan notes. Evidence dan KB **opt-in**; evidence hanya text metadata, tidak membaca file path. Report Assistant menggunakan draft/deterministic template sebagai input. Target lain atau config secrets tidak dibawa.

- **LOCAL_ONLY:** Ollama pada localhost saja; tidak boleh memakai cloud provider. Backend LOCAL_ONLY tidak menerima mode lain.
- **REDACTED_CLOUD (default):** redaksi frontend dan backend wajib sebelum data masuk provider, meskipun AI_REDACT_SECRETS=false.
- **CLOUD:** dapat mengirim unredacted context hanya jika backend AI_REDACT_SECRETS=false; preview jelas menyebut transmisi cloud. Default true tetap melakukan redaksi.

SecretRedactor memeriksa Authorization/Bearer, Cookie/Set-Cookie, API keys/passwords, JWT, session IDs, CSRF tokens, email. Pattern redaction **bukan jaminan semua secrets ditemukan**; review preview sebelum Send. Redactor tidak memiliki reversible mapping.

Flow **Preview AI Context → Send for Analysis → structured recommendation → Accept/Edit/Reject**. Request tidak otomatis membuat hypothesis/finding atau mengubah scope/severity/report. Hanya `aiSuggestions` pending disimpan. Accept as Research Note membuat note; Edit/Accept memberi editor; Review Hypothesis membuka editor existing; Report Draft harus direview/edit sebelum mengganti Markdown. Reject tidak mengubah catatan research. Analis AI dapat meminta missing context, menilai false positives/duplicate uncertainty, memberi safe next steps, atau merangkum evidence.

AI research priority 0–100 menilai potential impact, likelihood, novelty, testing cost, duplicate risk, scope confidence dan evidence quality; score bukan bounty severity. Root cause/impact dari AI adalah dugaan. AI tidak menetapkan confirmed vulnerability.

## Program rules dan tool knowledge

Program rules adalah authoritative. **Hard Policy → curated candidates → AI ranking → hard output filter → researcher review.** Scope assessment memakai data/checklist yang diberikan, tanpa scanning/validasi eksternal: within_supplied_scope, outside_supplied_scope, unclear_scope, requires_manual_review. Status bukan keputusan legal atau bukti scope independen.

Rekomendasi tool memerlukan scope/checklist authorization yang lengkap. Kandidat datang dari `data/tools/tools.json`, relevan terhadap technique/domain, dipakai dalam mode manual. Tool KB mencakup Burp Repeater, Caido, mitmproxy, Postman, curl, jq, Browser DevTools, Wireshark, Git, Docker, websocat. Helper catalog terpisah. Provider tidak boleh menciptakan tool baru; ID/name yang tidak ada dibuang. Automation, destructive/credential/mass fuzzing, DoS, dan third-party flags disaring, lalu respons disaring ulang. Free-form AI guidance tetap perlu review terhadap seluruh aturan tertulis program.

## Security

No telemetry/analytics/CDN. Imported/user/AI content memakai text nodes; HTML export escaped, raw Markdown HTML inert. CSP hanya local resources dan localhost AI bridge. Backend menggunakan loopback, host/origin checks, CORS localhost, session request token, request JSON schema, body limit 300 KB, generic errors, logger disabled. Static root hanya `client/`; dotfiles dan directory listing tidak disajikan. Keamanan dependency diperiksa dengan npm audit.

Local storage tidak terenkripsi; file backup dapat memuat research sensitif. File references tidak membawa binary. Program rules tidak dapat diganti AI. Backend tidak menerima command/payload execution dan tidak menghubungi target.

## Development dan tests

```powershell
npm test
python scripts/build-knowledge.py
python scripts/build.py
python tests/browser.py --chrome "C:/Program Files/Google/Chrome/Application/chrome.exe" --node "C:/path/to/modern/node.exe"
python tests/reliability-browser.py --chrome "C:/Program Files/Google/Chrome/Application/chrome.exe" --node "C:/path/to/modern/node.exe"
```

Node tests meliputi disabled/enabled/misconfigured/error provider, semua adapter dengan transport mock, migration, exact JSON round trip, validation, redaction, rules/tool filtering, context allowlist, reporting, autosave/write queue, CORS/host/token/body limits dan private files.

Reliability regressions mencakup recovery journal/primary, atomic revision check antar-tab, proposal stale dan sibling review, dependent phase re-analysis, hasil native tool, finding Message dengan observation panjang, report source version, policy scope konsisten, serta preview redaksi. `tests/reliability-browser.py` memverifikasi IndexedDB asli, read-only recovery/Import Backup, konflik dua tab termasuk Send Agent disabled, dan download report/backup yang direview. Penilaian setelah perbaikan tersedia di [AUDIT.md](AUDIT.md).

Browser test menggunakan profile sementara di `.qa/`, menjalankan workflow manual di file:// dan HTTP ES Modules, download aktual, IndexedDB/reload, v1 localStorage migration, invalid import, KB/helpers, mobile, console errors, real Fastify disabled, serta enabled mock provider acceptance flows. Mock server berada hanya di tests, bukan config runtime. Tidak ada panggilan live cloud pada tests. Hentikan server test setelah selesai; `.qa/` di-ignore Git.

Untuk menambah teknik, gunakan Custom Technique per target atau edit library default dan source technique-data. `scripts/extract-techniques.py` mengekstrak ulang dokumentasi original. Untuk tool/helper, edit JSON/source builder dan regenerate `knowledge-data.js`. Template report baru mengikuti `(target,finding) -> Markdown`. Setelah mengubah source, build ulang bundle untuk file://. Migration schema ditempatkan terpusat di storage.js.

## Batasan dan roadmap

- Tidak ada live AI request yang diverifikasi tanpa key/model terkonfigurasi. Dukungan structured output mengikuti kemampuan model/provider.
- Scope checker mengandalkan recorded context; hard boolean rules bukan parser legal untuk seluruh rules teks.
- JSON import 20 MB, AI context 300 KB; gunakan context/evidence yang relevan jika limit tercapai.
- Evidence besar tetap file reference, preview Markdown sederhana, workspace belum terenkripsi.
- Tidak ada multi-tab/team merge; hindari simultaneous edits pada origin yang sama.
- Core offline memakai local files/static server aktif; tidak ada remote-host offline service worker.
- Tidak ada CVSS/VRT mapping, HAR/Burp import, evidence bundling, automatic screenshot management, Git integration atau team sync. Extension point berada di services, templates, schema migration dan catalog.

Researcher menjalankan pengujian manual sesuai program rules. AI suggests. Rules constrain. Researcher decides. System records. Evidence proves.

## Optional Target Research Environment

Target -> Research Environment adds accounts, authentication profiles, headers, tenant/data metadata and tri-state program rules. Secrets live in a separate encrypted local vault; workspace export includes references only. Remote credential execution and Active-session verification are not available. See [Research Environment Guide](docs/RESEARCH_ENVIRONMENT_GUIDE.md).
