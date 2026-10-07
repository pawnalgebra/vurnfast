# Agentic AI Research — v2.0.0

Agents research. Policy controls. Researcher reviews. Researcher decides. Evidence proves.

Dashboard mengutamakan **Next Manual Work**; estimasi stage/progress berada dalam detail opsional. History, Review Queue, Manual Analysis dan pengaturan tetap tersedia melalui navigasi konteks. Seluruh 13 specialist dan General dipertahankan karena konteks target, pengetahuan domain, hypothesis, FP review dan duplicate review memiliki tujuan berbeda. Core manual tidak membutuhkan agent.

Empat operasi advisor sederhana (scope, restrictions, helper selection, recorded gaps) memakai layanan lokal. Reasoning advisor identik dapat memakai cache terbatas; evidence/policy/model baru membatalkannya. Cache specialist terpisah per instance provider. Angka budget tetap estimasi dan tidak menunjukkan tagihan aktual.

Orchestrator memilih pekerjaan berikutnya berdasarkan progress, proposal, scope, hypotheses, test dan evidence yang tersedia. Specialist bekerja di backend; frontend berfokus pada progress, review dan manual analysis. Engine tidak menjalankan testing target atau membuat vulnerability confirmed dari inference.

## Feature Flags dan Setup

Gunakan provider/model/config localhost yang sudah ada. API key tetap hanya pada `.env` backend. Tidak ada provider atau agent yang dijalankan saat AI disabled.

| AI_ENABLED | AGENTIC_AI_ENABLED | Perilaku |
| --- | --- | --- |
| false | false | Seluruh core manual dan knowledge offline |
| false | true | Agentic tetap disabled; aplikasi tidak crash |
| true | false | Copilot/Knowledge AI dapat dipakai manual; orchestrator disabled |
| true | true | Supervised Agentic Research tersedia bila provider configured |

```env
AI_ENABLED=false
AGENTIC_AI_ENABLED=false
AGENT_MAX_STEPS=8
AGENT_RUN_BUDGET_USD=0.25
AGENT_DAILY_BUDGET_USD=2.00
AGENT_CALL_BUDGET_USD=0.03
AGENT_ALLOW_LOCAL_TOOLS=true
AGENT_ALLOW_TARGET_REQUESTS=false
```

Edit flags/provider yang diperlukan, restart backend, dan buka HTTP localhost atau Connect Backend. File mode tetap menyediakan research manual, review data tersimpan, manual analysis dan inventory; membutuhkan backend untuk AI/detection.

AGENT_CALL_BUDGET_USD adalah reservasi estimasi konservatif per call. Nilai contoh bukan harga model/provider. Sesuaikan dengan model, batas output dan estimasi biaya Anda. Actual billed cost tetap Unknown; cek tagihan provider. Budget hanya menghitung Agentic calls, bukan Copilot manual.

## Workflow Example SaaS

1. Create Target: Example SaaS Lab, asset `lab.example.test`, lingkungan milik sendiri.
2. Scope: tambahkan `lab.example.test` sebagai satu entri In Scope, restrictions/rate limits, exclusions dan ketentuan program. Konfirmasi izin target, akun dan data. Agentic policy memakai pencocokan asset teks tepat; wildcard, path dan interpretasi scope lain membutuhkan penjelasan/review manual.
3. Target Intelligence: pilih SaaS, isi profil/knowledge sesuai sumber, pelajari flow membership/resource/revocation. Domain knowledge tetap pola umum; inference belum menjadi fakta target.
4. Tool Inventory: catat Burp/curl/jq atau tool yang benar-benar tersedia pada perangkat penelitian. Permissions tidak memberi shell access. Native adapters Workspace Knowledge Search/JSON Parser/Evidence Comparator sudah tersedia.
5. Dashboard → Start Research → review selected context dan privacy → Start Supervised Research.
6. Target Intelligence, Domain, Scope dan specialist berikutnya berjalan otomatis sampai ada keputusan penting, limit, policy block atau ketidakpastian. Start/Continue tidak memerlukan pemilihan agent satu per satu.
7. Review Queue: baca title/type/analysis/reason/confidence/target/technique/evidence/recommended decision. Accept/Edit membuka editor; Save baru menerapkan canonical record. Reject mempertahankan audit dan tidak mengubah data penting.
8. Manual Analysis: catat correction/assessment/observation/idea dan phase untuk re-analysis. Correction adalah input peneliti berprioritas tinggi. Proposal lama ditandai stale; Continue merencanakan ulang dari phase yang dipilih.
9. Continue menghasilkan kandidat hypotheses dan test plans untuk review. Setelah test plans tersedia, engine berhenti pada TESTING bila belum ada evidence. Jalankan testing terotorisasi secara manual, catat actual result dan attach evidence menggunakan fitur existing.
10. Continue: Evidence → Finding → False Positive → Duplicate. Kandidat finding hanya menerima actual observation/evidence yang disuplai, bukan hasil testing yang dikarang AI. Confirm Finding belum tersedia bila analysis false positive/duplicate belum lengkap.
11. Potential Finding: Confirm Finding setelah memeriksa authority, restriction, protected resource, expected/actual, steps, impact dan evidence. Need More Testing membuat manual-analysis task dan replan; Edit Analysis/Reject tersedia. Confirm adalah keputusan peneliti; severity tetap Unknown sampai Researcher Estimate diubah manual.
12. Continue: Report Agent membuat proposal draft Indonesia untuk finding confirmed dengan evidence. Review/Edit/Save sebelum draft masuk report existing. Export/print/report tetap fitur v1. Tanpa confirmed finding, engine selesai tanpa membuat report AI.

Loop melewati phase yang sudah dianalisis/review, bukan menjalankan ulang semua agent pada setiap Continue. Perubahan scope/rules membatalkan checkpoints downstream dan approvals; perubahan evidence mengulang analysis evidence/finding. Manual analysis atau Research Details → Replan Research menentukan phase re-analysis untuk perubahan bisnis/arsitektur lain. Rejected proposals disertakan pada context terbatas supaya agent dapat mempertimbangkan keputusan peneliti.

## Specialist Responsibilities

| Specialist | Responsibility |
| --- | --- |
| Target Intelligence | Business knowledge supplied, sourced facts, unknown information |
| Domain Knowledge | Concepts/glossary/business flows generik |
| Scope | Restrictions, exact scope, authorization uncertainty |
| Attack Surface | Candidate actors/objects/surfaces; tidak melakukan discovery network |
| Trust Boundary | Perpindahan authority/context antar komponen |
| Technique | Existing technique IDs dan tool capabilities yang tersedia |
| Hypothesis | Questions dan invariant hypotheses dengan formula lengkap |
| Test Planner | Manual test plans untuk hypotheses yang sudah direview |
| Evidence | Observations/control comparisons, missing evidence, sensitivity |
| Finding | Potential invariant failure dengan supplied actual result/evidence |
| False Positive | Penjelasan alternatif, effective authority, reproducibility |
| Duplicate | Kemiripan supplied findings/lessons; risk heuristic |
| Report | Draft faktual Indonesia untuk confirmed finding bersumber |

Setiap specialist menggunakan prompt/responsibility tersendiri dan structured JSON schema. Tidak ada giant prompt yang mengerjakan seluruh penelitian. Source/confidence/notes pada proposal dicatat backend; AI tidak boleh mengubah policy, verified facts, severity atau finding status otomatis.

## Review, State, dan Progress

Research state/progress disimpan per target di IndexedDB dan JSON backup: TARGET_CREATED, INTELLIGENCE_READY, SCOPE_VALIDATED, SURFACE_MAPPED, BOUNDARIES_MAPPED, TECHNIQUES_SELECTED, HYPOTHESES_READY, TEST_PLANNED, WAITING_REVIEW, WAITING_APPROVAL, TESTING, EVIDENCE_READY, FINDING_REVIEW, REPORT_READY, COMPLETED, PAUSED dan RUNNING.

Proposal status adalah PROPOSED/ACCEPTED/EDITED/REJECTED. Accepted adalah keputusan review, bukan bukti bahwa inference benar. Actors/objects/boundaries/techniques/hypotheses/tests/knowledge/findings/report masuk koleksi existing melalui store yang sama. Evidence Analysis, False Positive dan Duplicate review disimpan sebagai research notes; tidak menjadi observation baru atau confirmed vulnerability otomatis.

Progress menghitung jumlah stage yang sudah diproses dari 13 stages. Ini progress workflow, bukan persentase keamanan/coverage test. Research Dashboard aktif ketika kedua flags dan provider configured; mode manual mempertahankan dashboard existing. Main actions: Start/Continue, Review Queue, Manual Analysis. Research Details/Evidence/Findings/Reports/Knowledge/Tools/History/Settings tetap secondary pages.

Agent Activity collapsed menampilkan action/result/status/timestamp. History mencatat agent/task/start/completion/tools/summary/researcher decision/estimated reservation; tidak menyimpan private chain-of-thought. Review/analysis baru mengubah research revision; output run lama ditahan dan run dipause jika canonical context berubah selama AI berjalan.

## Tool Inventory dan Capability Policy

Manual entry: name, installed, version, path, capabilities, Agent Access, notes. Metadata Linux device boleh dicatat manual; Detect Installed Tools / Versions memeriksa perangkat yang benar-benar menjalankan backend localhost, termasuk Windows saat pengembangan. Tidak mendeteksi perangkat remote.

Detection memanggil daftar tetap `curl --version`, `jq --version`, `git --version`, `node --version`, `python --version`, `docker --version` dengan timeout/output limit dan tanpa shell. Path memakai resolver lokal. Tidak menerima executable/arguments dari AI, tidak menginstal tool, dan tidak menghubungi target. Tool yang tidak ditemukan ditampilkan Tool unavailable.

| Capability | Permission/implementation |
| --- | --- |
| Selected local knowledge search | Native adapter; SAFE_AUTO default |
| Bounded JSON parsing | Native adapter; SAFE_AUTO default |
| Existing evidence comparison | Native adapter; SAFE_AUTO default |
| Native adapter diubah ke APPROVAL_REQUIRED | Signed, single-use approval diperlukan |
| Tool inventory DENIED/unavailable | Ditolak sebelum execution |
| HTTP/browser/network tool | External adapters belum tersedia; DENIED pada v2 ini |
| Installation/root/destructive action | DENIED |

AGENT_ALLOW_TARGET_REQUESTS=false adalah default. Mengubahnya menjadi true **tidak membuka network execution**: versi ini tidak memiliki adapter eksternal. Rekomendasi Burp/curl/tool lain adalah rencana manual. Agent tidak mendapat `shell.exec(anything)` atau akses ke Path inventory. Supervised execution yang tersedia adalah native local adapters, bukan testing remote. Ini batas implementasi v2 yang disengaja; adapter target di masa depan memerlukan scope, rate/third-party policy, bound approval dan adapter tersendiri.

Action Approval menampilkan goal/target/tool/capability/reason/scope/risk/expected result/stop conditions serta exact structured input. Approve Once mengeksekusi satu native action. Approve Plan mencakup maksimal tiga pending native actions dengan plan ID sama, bukan izin global/future actions. Edit menerbitkan approval baru setelah policy check. Reject menolak action. Token single-use, expired sepuluh menit, terikat pada action/input/target/revision/scope/rules; restart backend atau perubahan context memerlukan replan/review ulang.

Local results tersimpan pada action/history sebagai derived analysis, bukan observation target. View local result tersedia pada Agent History. Perbedaan evidence tidak langsung membuktikan vulnerability.

## Stop Conditions, Pause, dan Cost

Run berhenti ketika review/approval diperlukan, scope unclear, policy denied, sensitive evidence terdeteksi, maximum steps tercapai, estimated run/daily budget tercapai, provider gagal, user Pause, atau stages selesai. Testing/evidence yang belum tersedia menghentikan loop untuk pekerjaan manual. Pause memakai abort signal pada provider; hasil setelah pause tidak diterapkan.

Secrets/PII sederhana pada selected evidence terdeteksi dengan redactor existing. Engine berhenti sebelum provider dan meminta researcher sensitive-result review; source sudah dire­daksi pada context preview/output. Konfirmasi review bukan verifikasi independen bahwa seluruh informasi sensitif telah ditemukan. Redactor tidak mengenali semua bentuk data rahasia; review evidence sebelum mengirim.

Backend menyimpan reservasi biaya pada `.runtime/agent-cost-ledger.json`; workspace tetap di browser. Reservasi ditulis sebelum AI call, dihitung hari UTC, dan tidak dibatalkan saat provider gagal/crash karena call mungkin sudah dibebankan. Restart tidak mereset daily total. Ledger corrupt/locked/unavailable menyebabkan pause, bukan fallback unlimited. Jangan menghapus ledger untuk melanjutkan run; cek konfigurasi/limit dan tagihan provider. File dan API key tidak disajikan static client.

Default run mempunyai maksimal delapan AI calls dan budget estimasi $0.25; per-call reservation default $0.03. Stage berikutnya dilanjutkan melalui Continue dengan run budget baru, sambil tetap tunduk pada daily budget $2.00. Model/pricing/output berbeda dapat membuat biaya nyata berbeda; aplikasi tidak menghitung invoice provider. Actual cost ditampilkan Unknown.

<a id="agent-message"></a>

## Agent Message: companion saat research

Panel paling kanan aktif hanya ketika kedua flags AI dan Agentic true. Open, Collapse, Close dan pilihan terakhir tersimpan pada browser; mobile memakai drawer dari kanan dan focus trap. Close tidak menghapus conversation atau membatalkan analisis; gunakan Pause untuk membatalkan call.

Pilih target → buka Finding/Evidence/Hypothesis → **Ask Agent** pada record. Context chip menunjukkan selection; × melepas record. Halaman dengan satu record atau Report terpilih memakai context otomatis. Pada daftar dengan beberapa record, klik record atau Ask Agent agar selection tidak ambigu. Target aktif, halaman dan scope tetap context dasar.

Alias: `@general`, `@target`, `@domain`, `@scope`, `@surface`, `@boundary`, `@technique`, `@hypothesis`, `@test`, `@evidence`, `@finding`, `@false-positive`, `@duplicate`, `@report`; `@orchestrator` tetap diterima sebagai alias routing otomatis. Ketik `@` untuk daftar seluruh agent tepat di atas input, dengan deskripsi domain masing-masing. Maksimal empat mention: `@evidence @finding review observation ini` hanya memanggil kedua specialist. Tanpa tag, General menjawab lalu hingga tiga specialist relevan mengikuti berdasarkan pertanyaan dan references. Semua specialist eligible; anggota terpilih terlihat pada composer. General tidak berpura-pura sebagai specialist. Tiap anggota benar-benar dipanggil ke model, mendapat ringkasan jawaban sebelumnya sebagai diskusi yang belum terverifikasi, dan memiliki bubble, nama, waktu, model, history serta proposal sendiri.

Ketik `#` untuk memilih reference target aktif. References memakai internal ID: `#evidence:<id>`, `#finding:<id>`, `#hypothesis:<id>`, `#test:<id>`, `#actor:<id>`, `#object:<id>`, `#boundary:<id>`, `#technique:<id>`, `#report:<finding-id>`, `#target:<target-id>`, `#scope:<target-id>`. Nama manusia hanya label. Unknown/deleted/foreign IDs ditolak sebelum call. Tags bebas tanpa colon seperti `#authorization` adalah topic tags, bukan workspace references.

Enter atau Ctrl/Cmd+Enter mengirim dari composer; Shift+Enter membuat baris baru. Ctrl/Cmd+K membuka command palette saat tidak mengedit field lain atau membuka dialog. Arrow Up/Down dan Enter memilih autocomplete; Escape menutup suggestion lalu collapse panel. Quick Actions mengisi pertanyaan; researcher memilih Send. Review membuka Review Queue existing.

Tombol **+** menambah file; paste gambar dan drag/drop file juga tersedia. Format: teks UTF-8 (.txt/.md/.json/.csv/.log/.har/.http/.yaml/.yml/.xml), HTML/kode sebagai teks inert, PNG/JPEG/WebP. PDF/file biner lain ditolak secara jelas. Maksimal tiga file, 750 KB per file dan 1 MB total; teks maksimal 60.000 karakter per file/90.000 total. Preview/remove tersedia sebelum Send. Teks diredaksi berdasarkan pola pada browser dan backend; gambar dikirim sebagaimana preview, sehingga periksa informasi sensitif sendiri. File adalah context yang diberikan peneliti, tidak otomatis menjadi canonical evidence atau fakta terverifikasi. Conversation menyimpan metadata dan preview teks hingga 600 karakter; original file hanya di memori draft/request. Setelah reload, reattach original untuk retry dengan lampiran.

**LLM model** memilih model untuk request berikutnya pada provider backend aktif; tidak mengganti provider/key/privacy mode. **Refresh models** meminta daftar model dari provider melalui backend, dengan cache lima menit. `AI_ALLOWED_MODELS=model-a,model-b` membatasi pilihan tanpa discovery, sementara model configured tetap tersedia. Model ID yang tidak terdaftar ditolak sebelum provider dipanggil. Katalog tidak menjamin setiap model mendukung structured JSON atau vision; error model ditampilkan aman dan dapat dicoba ulang. Tidak ada label gratis atau harga asumsi. Model terpilih tersimpan sebagai preferensi browser per provider dan tercatat di tiap bubble.

Related Terms memakai exact terminology/related-term edges, selected Domain Knowledge, Technique Library, Target Knowledge, workspace index dan vocabulary generik lokal. Cache dibatasi 100 query dan invalid ketika data berubah. Lookup di-debounce 150 ms tanpa provider request. Scores adalah similarity heuristik, bukan probabilitas. Klik suggested tag untuk memakai; jika local match kurang, kirim semantic question secara eksplisit ke `@domain`.

`ResearchContextBuilder` mengambil references dan linked hypothesis/test/evidence/finding, maksimal empat tiap koleksi (actor/object/boundary tiga), empat techniques, satu domain excerpt relevan, accepted knowledge cocok dan tiga manual analysis terakhir. Scope/rules tetap lengkap; account/profile metadata hanya yang dirujuk hypothesis/test. Vault tidak diakses. Request memakai maksimal empat recent relevant messages dan summary lokal sampai 1600 karakter. Context details menjelaskan selection. Seluruh workspace, chat history, evidence dan domain catalog tidak dikirim.

Jawaban ringkas tampil sebagai bubble percakapan; Expand analysis membuka Reason, Evidence, Risk, Next dan detail. Setiap panggilan agent dibatasi default 2500 output tokens/dua proposals; permintaan detail/rinci/lengkap dapat memakai batas existing 6000 tokens. Group message memakai ResearchOrchestrator, ledger, privacy, redactor, policy, token dan shared concurrency existing. Budget/maximum steps diperiksa sebelum setiap anggota; estimasi dihitung per call. Jika budget habis atau satu specialist gagal, jawaban yang sudah selesai tetap dikembalikan dengan identitas aslinya. Deadline keseluruhan 240 detik, timeout tiap provider 60 detik. Indikator agent aktif mengambil status run sebenarnya. Channel ini hanya analisis; tool suggestions tidak dieksekusi. Proposal masuk Review Queue. Potential finding tetap memerlukan false-positive/duplicate analysis melalui supervised Research sebelum konfirmasi. Scope unknown/sensitive selected evidence memerlukan review; provider error tidak mengubah canonical records.

Conversation per target/session tersimpan di workspace IndexedDB dan JSON export: sender, agent, targetId, researchSessionId, contextRefs, tags, timestamp, redacted message dan bounded answer. Redactor berjalan sebelum storage dan lagi sebelum provider; review data sebelum Send karena deteksi pola tidak mengenali semua secrets. Summary extractive lokal dicache saat messages lama belum berubah, tanpa model call. Panel memuat 20 pesan terakhir; Earlier/Newer messages berpindah window 20; limit 1000 per target, DOM conversation tetap dibatasi 20. Clear conversation membuat session baru tanpa menghapus canonical research; export dahulu untuk backup discussion.

Ketikan tidak merender ulang main workspace. Duplicate sends diblokir. Pause, perubahan target/page/selection/canonical revision membatalkan request dan menahan hasil lama. Reservasi estimasi tetap dihitung setelah abort/error; actual billing Unknown. Local lookup/manual research tetap tersedia saat provider gagal.

Icons memakai SVG lokal tanpa CDN/dependency runtime. License vendored Lucide/Feather: `client/assets/icons/lucide/LICENSE`; plus/refresh memakai path sederhana lokal. Sumber: [Lucide repository](https://github.com/lucide-icons/lucide). Kontrak model/vision mengikuti [OpenAI Models](https://developers.openai.com/api/reference/resources/models/methods/list), [OpenAI Images and vision](https://developers.openai.com/api/docs/guides/images-vision), [Claude Models](https://platform.claude.com/docs/en/api/models/list), [Claude Vision](https://platform.claude.com/docs/en/build-with-claude/vision), [Gemini Models](https://ai.google.dev/api/models), [Gemini Image Understanding](https://ai.google.dev/gemini-api/docs/image-understanding), [Ollama Chat](https://docs.ollama.com/api/chat) dan [Ollama Models](https://docs.ollama.com/api/tags).

## Persistence dan Compatibility

Canonical edits menandai proposal lama stale dan membatalkan pending action approval. Accept/Edit/Confirm memeriksa research revision; perubahan hasil review dapat meneruskan sibling proposals dari batch yang sama. Test/evidence memakai fingerprint sumber canonical penuh, sehingga preview Message 4.000 karakter tidak menjadi dasar perbandingan dengan evidence 8.000 karakter. Hasil finding tetap mengambil observation canonical, bukan teks yang dikarang atau dipangkas model.

Continue memeriksa perubahan intelligence, scope/environment, surface, technique, hypothesis, test, evidence, dan finding untuk mengulang tahap dependent terawal. Manual Analysis tetap memakai phase replan yang dipilih peneliti. Potential finding dari Message diteruskan ke false-positive/duplicate sebelum konfirmasi; confirmed finding baru membuka tahap report lagi. Native tool results dikirim ke specialist berikutnya sebagai local-derived results dengan referensi evidence existing, bukan observasi target baru. Hasil dari revision lama tidak dipakai. Dashboard menyertakan Next Manual Work dan coverage di samping progress agent.

Rilis aplikasi v2.0.0 tetap memakai schema workspace 2.0.0 dengan extension yang divalidasi. Workspace dari v1.0.0 aplikasi mendapat target.agentResearch/researchRevision serta toolInventory default; actors/objects/techniques/hypotheses/evidence/findings/report/knowledge/intelligence lama dipertahankan. Legacy schema 1.0.0 juga tetap dimigrasikan. Export/Reset/Import mempertahankan proposal, decisions, manual analysis, runs, history, inventory dan relationships.

Context agent hanya target aktif: hingga tiga selected domain excerpts, 20 enabled techniques, capped hypotheses/tests/evidence/findings/lessons/manual analysis dan prior proposals terbatas. Tidak ada target lain, API key, full database, filesystem evidence atau automatic company lookup. Output history tetap lokal; transient run di backend berhenti/lost jika server restart. Jika tab/server terputus, lihat budget ledger/provider usage dan Continue/Replan setelah mereview state tersimpan.

Live smoke test OpenAI gpt-5.4-mini berhasil untuk koneksi structured JSON dan satu tahap Target Intelligence Agent pada dummy context: output valid, run berhenti WAITING_REVIEW, dan canonical research tidak berubah. Tes ini tidak membuktikan seluruh specialist atau provider lain; alur lengkap tetap diuji dengan mock. JSON/policy validation mengurangi risiko malformed output dan perubahan otomatis, tetapi tidak membuktikan semua inference benar. Seluruh fakta, testing, finding dan report tetap perlu review peneliti.

## Advanced Research Signals

Dashboard sekarang memiliki **Research Signals** untuk normalized observation, event timeline, contradiction, hypothesis terurut dan next discriminating test. Ini reasoning layer di atas raw evidence; tidak menjalankan target request atau mengonfirmasi vulnerability. Scope/checklist tetap mengikat perencanaan.

1. Catat actor/object dan raw evidence pada target dummy atau target yang telah diotorisasi.
2. Pilih **Record Observation** untuk memasangkan actor, object, tenant, surface, effective authority, logical operation, dan observed outcome dengan evidence. **Normalize Test Observations** menyalin observation dari test tanpa menebak apakah backend mengizinkan/menolak: outcome tetap `unknown` sampai dipetakan researcher.
3. Pilih **Record Event** untuk grant, queue, revoke, execute; gunakan logical order bila tidak ada timestamp. Unknown ordering tidak dianggap “setelah revoke”.
4. **Review Model** mengedit JSON `researchModel.version=1`: events, observations, invariants, relations, signalDecisions, rejectedExplanations, unresolvedQuestions. Untuk approval chain, gunakan `version`, `approvedVersion`, `approvalEventId`; untuk refund aggregate, tambahkan invariant `rule=aggregate-limit`, `objectId`, `operation=refund`, `maximum`, serta event berbeda dengan `operationId`, `amount` dan `concurrentWith`.
5. Setiap event/observation/invariant menyimpan `evidenceRefs` dan provenance `{status,source,confidence,evidenceRefs}`. Status: OBSERVED, RESEARCHER_CONFIRMED, AI_INFERRED, UNKNOWN. Semua referensi harus menunjuk record target aktif. AI_INFERRED tidak menjadi fakta atau sumber temporal observed. Raw evidence yang berubah membuat snapshot normalized lama tidak dipakai untuk contradiction sampai direview ulang.
6. **Investigate/Edit** membuka hypothesis dengan actor/object/boundary ID, invariant candidate, evidence, alternatif dan confirm/reject criteria. **Reject/Mark Explained** menyimpan keputusan researcher. **Ask Agent** menyiapkan draft dengan explicit evidence references; kirim setelah mereview konteks.
7. Continue Research dapat berhenti di **HYPOTHESIS_REANALYSIS** untuk mereview hypothesis lokal tanpa call model tambahan. Setelah diterima, next discriminating test menjadi proposal **TEST_PLANNED** dan tetap perlu review/manual execution.
8. Untuk kontrol pembantah, Record Observation dengan **Discriminating control for**, raw evidence baru, actor/object yang sesuai, dan **Researcher control interpretation** primary/alternative. Ini penilaian researcher terhadap hasil kontrol, bukan keputusan AI. Alternative yang didukung membuat signal explained; konflik atau kontrol kosong tetap NEEDS_TESTING.

Rules lokal saat ini mengenali cross-tenant authority, execution setelah ordered revoke, insufficient role, stale approval version, aggregate concurrent execution, dan matched cross-surface allow/deny. Candidate invariant adalah pertanyaan riset sampai business policy target diketahui. Job dengan independent authority tidak otomatis stale: exemption memerlukan invariant `independent-job-authority` untuk object/operation yang sama dengan provenance RESEARCHER_CONFIRMED dan event `independentAuthority=confirmed`.

Finding menyimpan beberapa `testIds` serta evidence relationship SUPPORTS, CONTRADICTS, CONTROL, CONTEXT, PREREQUISITE, OUTCOME; test utama tetap dipertahankan untuk compatibility. Finding agent dapat mempertahankan evidence dari tests yang berbagi hypothesis atau terhubung signal. Finding yang terhubung normalized contradiction tetap NEEDS_TESTING sampai ada observed discriminating control. Jalur finding manual/legacy tetap memakai review peneliti; rule engine tidak membaca bebas semua jenis evidence atau membuktikan semantic validity dari deklarasi kontrol.

Context sequential memilih explicit references, dependencies, research relevance lalu recency. Stable IDs dan knowledgeLinks tetap dikirim; `contextManifest` mencatat included/omitted records, dependencies yang tidak muat, serta field truncation. Chat tetap memiliki budget lebih kecil, sehingga source dependencies yang terpotong dicatat. Relevant graph dibatasi node/edge dan signal summary mencatat signal yang tidak dikirim. `COMPLETED` berarti current research path selesai, bukan seluruh ruang riset sudah diuji.

Benchmark dummy: `npm run test:advanced`. Tests menguji relationship yang diharapkan, benign variants, provenance, replanning, multi-test grounding, stale controls dan scope gates. Ini benchmark deterministic engine/integration, belum evaluasi reasoning model live.

## Discovery Intelligence V3

**Discovery Intelligence** mencari chain umum 2–8 hop, mengevaluasi target constraints, menyimpan UNKNOWN dan competing explanations, lalu memilih manual test berdasarkan information gain. `VIOLATED` berarti observed data bertentangan dengan reviewed rule target, bukan vulnerability confirmed.

**Review Constraints** menerima array JSON dengan `id`, `targetId`, `category`, `subject` (actor ID), `object` (object ID), `operation`, `condition`, `expected`, `sourceType`, `sourceRef`, `confidence`, `verified`, dan `notes`. Kosongkan subject/object untuk rule lebih luas. Contoh predicates target khusus:

```json
{
  "condition": {"all": [{"field": "outcome", "operator": "eq", "value": "allowed"}]},
  "expected": {"all": [{"field": "tenant", "operator": "eqField", "other": "authorityTenant"}]}
}
```

Operators: `eq`, `neq`, `in`, `exists`, `lte`, `gte`, `eqField`, `neqField`. `condition.prior` memiliki `same` identity fields dan `all` predicates untuk memilih latest matching ordered predecessor; `other: "prior.version"` membandingkan field dengan versi predecessor. `expected.aggregate` memiliki `field`, `groupBy`, `distinctBy`, dan `all`; predicate `field: "total"` membandingkan total execution yang berbeda. Source AI_INFERRED/DOMAIN_KNOWLEDGE/UNKNOWN tidak dapat verified. Source verified wajib PROGRAM_RULE, TARGET_DOCUMENTATION, atau RESEARCHER_CONFIRMED dengan sourceRef. Applicability predicates dapat menyatakan exception policy target; generic templates tidak menjadi universal policy.

**Extract Observation** menampilkan PROPOSED extraction dari JSON raw evidence sebelum researcher menerima. Actor/object/tenant tidak ditebak. Preview harus cocok dengan extraction: untuk koreksi, perbaiki raw dan extract ulang. Prose/HTTP payload ambigu masih memerlukan normalisasi manual. Raw fingerprint yang berubah membatalkan proposal lama.

**Investigate**, **Create Test**, **Ask Agent**, **Mark Explained**, dan **Reject** tetap tindakan researcher. Ask Agent menyiapkan draft `#signal:ID`; chat juga menerima `#chain:ID`, `#constraint:ID`, dan `#unknown:ID`. Context mengikuti explicit references dan dependencies sebelum recency. `contextManifest.omittedCriticalDependencies` mencatat bukti penting yang tidak muat; confidence hasil local/provider dibatasi. Failed-path memory menekan relationship yang telah dijelaskan/ditolak; perubahan dependency terkait membuka ulang dengan alasan.

Server model tiers memakai `AI_CHEAP_MODEL`/`AI_REASONING_MODEL`, atau configured default bila kosong. Graph, constraint, extraction dan ranking deterministic. Cache transient dibatasi dan memakai revision, operation, tier serta fingerprint context, evidence dan constraints.

`npm run test:discovery` menjalankan 22 skenario sintetis × suspicious/benign/missing-evidence (66 inputs) plus integration checks. `npm run benchmark:discovery:live` opsional, membutuhkan `AI_ENABLED=true` dan provider configured; default tiga case, `DISCOVERY_LIVE_CASES=66` untuk lengkap. Tokens, latency, dan cost estimate jika tersedia disimpan tanpa key. Benchmark terstruktur belum membuktikan discovery pada target nyata atau Level 4.
