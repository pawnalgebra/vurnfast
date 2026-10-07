# Feature Reference

Referensi pengguna untuk aplikasi 2.0.0, schema 2.0.0. Nama UI saat ini Universal Research Workspace. Isi mengikuti modul frontend, storage, backend, policy, katalog dan adapter yang diimplementasikan.

**Active:** fungsi tersedia dengan prasyarat yang dijelaskan. **Partial:** fungsi tersedia dengan kemampuan terbatas. **Coming Soon:** placeholder belum berfungsi; tidak ada menu placeholder pada versi yang diaudit. AI tanpa konfigurasi berstatus Disabled/Misconfigured, bukan Coming Soon.

Mulai dari [User Guide](USER_GUIDE.md) atau ikuti [Workflow Example SaaS](WORKFLOW_GUIDE.md). Gunakan pencarian browser (Ctrl+F) untuk menemukan field, helper, atau operasi.

## Daftar Fitur

- [Dashboard](#dashboard) — Active
- [Target Management](#targets) — Active
- [Scope Management](#scope) — Active
- [Engagement Guard](#engagement-guard) — Active
- [Hard Program Rules dan Rules Engine](#rules-engine) — Active
- [Actors](#actors) — Active
- [Objects](#objects) — Active
- [Attack Surface Mapping](#attack-surface) — Partial
- [Trust Boundaries](#boundaries) — Active
- [Technique Library](#technique-library) — Active
- [Hypotheses](#hypotheses) — Active
- [Test Cases](#tests) — Active
- [Research Queue](#queue) — Active
- [Evidence](#evidence) — Active
- [Findings dan Promotion](#findings) — Active
- [Report Generator](#reports) — Active
- [Research Notes](#notes) — Active
- [Knowledge Base](#knowledge) — Active
- [Tool Knowledge dan Offline Tool Recommendation](#tools) — Active
- [Internal Helpers](#helpers) — Active
- [Authorization Matrix Builder](#helper-authorization-matrix) — Partial
- [State Transition Builder](#helper-state-transition) — Partial
- [Trust Boundary Mapper](#helper-trust-boundary) — Active
- [Evidence Comparator](#helper-evidence-comparator) — Partial
- [Secret Redactor](#helper-secret-redactor) — Partial
- [Hypothesis Generator — Offline Template](#helper-hypothesis-generator) — Active
- [Scope Checker](#helper-scope-checker) — Active
- [Finding Checklist](#helper-finding-checklist) — Active
- [Duplicate Comparator](#helper-duplicate-comparator) — Partial
- [Report Builder](#helper-report-builder) — Active
- [Research Gap Analyzer — Helper](#helper-gap-analyzer) — Partial
- [Research Gaps dan Research Coverage](#coverage) — Partial
- [Research Priority](#research-priority) — Active
- [Settings dan System Health](#settings) — Active
- [AI Configuration dan Connection](#ai-provider) — Active
- [AI Privacy Modes dan Context Preview](#ai-privacy) — Active
- [Research Assistant](#ai) — Active
- [AI Analyze Scope](#ai-analyze-scope) — Active
- [AI Technique Advisor](#ai-techniques) — Active
- [AI Tool Advisor](#ai-tools) — Active
- [AI Helper Advisor](#ai-helper-advisor) — Active
- [AI Research Questions](#ai-questions) — Active
- [AI Hypothesis Generator](#ai-hypothesis-generator) — Active
- [AI Finding Analyzer](#ai-findings) — Active
- [AI False Positive Analyzer](#ai-false-positive) — Partial
- [AI Duplicate Analyzer](#ai-duplicate) — Partial
- [AI Gap Analyzer](#ai-gaps) — Active
- [AI Report Assistant](#ai-report-assistant) — Active
- [AI Evidence Summarizer](#ai-evidence-summary) — Active
- [AI Safe Next Steps](#ai-safe-next-steps) — Active
- [AI Restrictions](#ai-restrictions) — Active
- [AI Suggestions — Preview, Accept, Edit, Reject](#ai-review) — Active
- [Global Search dan List Filters](#search) — Active
- [Workspace Storage dan Autosave](#workspace-storage) — Active
- [Backup / Restore](#backup) — Active
- [Connect workspace.json — Optional File Save](#connected-file) — Active
- [Reset Workspace](#reset) — Active
- [Contextual Help dan Documentation](#in-app-help) — Active
- [Target Intelligence](#target-intelligence) — Active
- [Domain Knowledge Packs dan Learning Mode](#domain-knowledge) — Active
- [Domain Terminology](#terminology) — Active
- [Business Flows dan Critical Transitions](#business-flows) — Active
- [Critical Assets dan Sensitive Data](#critical-assets) — Active
- [Domain Research Questions dan Invariant Conversion](#research-questions) — Active
- [Knowledge Provenance dan Verification](#knowledge-provenance) — Active
- [AI Knowledge Assistant](#knowledge-ai) — Active
- [Generate Target Knowledge](#knowledge-op-generate_target_knowledge) — Active
- [Analyze Target](#knowledge-op-analyze_target) — Active
- [Suggest Domain](#knowledge-op-suggest_domains) — Active
- [Explain Domain](#knowledge-op-explain_domain) — Active
- [Explain Terminology](#knowledge-op-explain_terminology) — Active
- [Ask About Target](#knowledge-op-ask_about_target) — Active
- [Analyze Business Flow](#knowledge-op-analyze_business_flow) — Active
- [Identify Critical Assets](#knowledge-op-identify_critical_assets) — Active
- [Generate Security Invariants](#knowledge-op-generate_security_invariants) — Active
- [Generate Research Questions](#knowledge-op-generate_domain_questions) — Active
- [Recommend Techniques — Domain](#knowledge-op-recommend_domain_techniques) — Active
- [Agentic Research Orchestrator](#agentic-research) — Active
- [Review Queue](#agent-review) — Active
- [Manual Analysis](#manual-analysis) — Active
- [Agent History](#agent-history) — Active
- [Tool Inventory](#tool-inventory) — Active
- [Agentic AI Settings](#agentic-settings) — Active
- [Target Research Environment](#research-environment) — Partial
- [Agent Message](#agent-message) — Active
- [State-Machine & Context Confusion](#tech_01) — Active
- [Async Authorization / Queue Revalidation](#tech_02) — Active
- [Approval / Capability Context Confusion](#tech_03) — Active
- [Restart / Resume Persistence](#tech_04) — Active
- [Differential Multi-Surface Testing](#tech_05) — Active
- [Cross-Context / App-Extension-Browser Trust](#tech_06) — Active
- [Object Lifecycle & Revocation](#tech_07) — Active
- [Race Condition / TOCTOU](#tech_08) — Active
- [Webhook / Callback Ownership](#tech_09) — Active
- [WebSocket / Realtime Stale Authorization](#tech_10) — Active
- [Parser Differential](#tech_11) — Active
- [Cache Authorization & Variant Confusion](#tech_12) — Active
- [OAuth / SSO / Account Linking](#tech_13) — Active
- [Cross-Tenant / Workspace Isolation](#tech_14) — Active
- [File / Share / Export Boundary](#tech_15) — Active
- [BFLA / Vertical Privilege Escalation](#tech_16) — Active
- [IDOR / BOLA / Object Ownership](#tech_17) — Active
- [Business Logic State Transition](#tech_18) — Active
- [Authentication & Session Lifecycle](#tech_19) — Active
- [Basic Validation & Misconfiguration With Impact](#tech_20) — Active

<a id="dashboard"></a>

# Dashboard

Status: Active

## Fungsi

Next manual work for the selected target, followed by optional relationship analysis and recorded coverage.

## Kenapa Feature Ini Penting

Membantu memilih pekerjaan berikutnya berdasarkan riset yang sudah dicatat.

## Kapan Digunakan

Saat membuka engagement dan sebelum menentukan test berikutnya.

## Input

CURRENT TARGET; hypotheses, test cases, findings, actors, objects, states, boundaries dan enabled techniques.

## Output

Scope review, hypothesis refinement, pending manual tests, missing evidence, result/finding review or report work. Agent progress and coverage remain optional details.

## Cara Menggunakan

1. Select target.
2. Follow Next Manual Work.
3. Record actual results/evidence.
4. Review findings and prepare reports.

## Contoh

Example SaaS memiliki dua actor dan satu test Member; Actor Coverage dapat menunjukkan 1 / 2.

## Hubungan dengan Feature Lain

Membaca data modul riset; tautan menuju Scope, mapping, Techniques, Hypotheses, Tests, Evidence, Findings, Reports dan Coverage.

## Tips

Recorded coverage and agent progress are not security assurance. Technique progress bars and duplicate formula/summary widgets were removed.
<a id="targets"></a>

# Target Management

Status: Active

## Fungsi

Membuat, memilih, mengedit, dan menghapus profil engagement beserta konteks aset.

## Kenapa Feature Ini Penting

Memisahkan riset tiap program dan menyediakan identitas target untuk laporan.

## Kapan Digunakan

Pertama kali memulai program atau berganti aset/engagement.

## Input

Program Name wajib; Platform Bugcrowd/HackerOne/Intigriti/Private/Other; Program URL; Target / Asset; Environment; Version / Build; Status active/paused/archived; Custom Notes.

## Output

Target baru dengan ID, timestamps, koleksi riset kosong, tiga program rules false, dan salinan 20 techniques.

## Cara Menggunakan

1. Target → + Create Target.
2. Isi nama dan profil.
3. Simpan.
4. Pilih target lewat kartu atau CURRENT TARGET.
5. Gunakan Edit jika konteks berubah.

## Contoh

Program Example SaaS; Asset https://app.example.test; Environment laboratorium sendiri; Version demo-1.

## Hubungan dengan Feature Lain

Semua modul riset/KB/helpers/AI suggestions berada pada target ini; Reports mengambil target terdampak dari profil aktif.

## Tips

Program URL hanya referensi teks, tidak di-fetch. Status paused/archived tidak mengunci riset. Hapus target menghapus semua isinya setelah konfirmasi: ekspor backup dahulu.
<a id="scope"></a>

# Scope Management

Status: Active

## Fungsi

Catatan batas aset, aturan, known issues, dan resource pengujian yang diotorisasi.

## Kenapa Feature Ini Penting

Menentukan pertanyaan yang boleh diuji sebelum merencanakan tindakan.

## Kapan Digunakan

Sebelum mapping, advisor, dan pengujian; review lagi jika rules berubah.

## Input

In Scope, Out of Scope, Known Issues, Rate Limits, Automation Rules, Safe Harbor Notes, Testing Restrictions, Test Accounts alias, Owned Domains, Test Workspaces, Dummy Markers.

## Output

Scope per target yang autosave dan dipakai context/rules serta review manual.

## Cara Menggunakan

1. Buka Scope.
2. Salin batas program sebagai catatan yang sudah direview.
3. Catat akun/data sendiri dan stop conditions.
4. Tunggu Saved locally.

## Contoh

Example SaaS hanya laboratorium https://app.example.test, Tenant Demo, dua akun sendiri; layanan pihak ketiga out-of-scope.

## Hubungan dengan Feature Lain

Engagement Guard dan Hard Program Rules melengkapi scope; Scope Checker, Tool Knowledge dan AI menerima catatan ini.

## Tips

Jangan menyimpan password di Test Accounts. Scope bukan parser rules otomatis; daftar teks dan izin pemilik tetap harus diperiksa peneliti.
<a id="engagement-guard"></a>

# Engagement Guard

Status: Active

## Fungsi

Tujuh checklist konfirmasi manual sebelum menjalankan pengujian.

## Kenapa Feature Ini Penting

Mengurangi lupa memeriksa izin, data, rate limit dan pembatasan.

## Kapan Digunakan

Sesudah membaca program rules dan sebelum setiap rangkaian test.

## Input

Target confirmed in-scope; testing account authorized; testing data owned; automation rules understood; rate limits understood; restrictions reviewed/destructive testing understood; known issues reviewed.

## Output

Flags guard tersimpan dalam scope target. Tiga flags pertama memengaruhi gating rekomendasi.

## Cara Menggunakan

1. Scope → Engagement Guard.
2. Review bukti/ketentuan masing-masing.
3. Centang hanya yang sudah Anda konfirmasi.
4. Hapus centang jika konfirmasi tidak lagi berlaku.

## Contoh

Owner/Member Example SaaS adalah akun uji sendiri; centang account/data setelah ownership diperiksa.

## Hubungan dengan Feature Lain

Scope Checker dan AI context membaca konfirmasi target, akun dan data. Empat checklist lain tetap membantu review manual.

## Tips

Checklist tidak membuktikan izin secara independen. Automation rules understood berbeda dari automationAllowed. Mengisi checkbox tidak menjalankan test atau memberi izin hukum.
<a id="rules-engine"></a>

# Hard Program Rules dan Rules Engine

Status: Active

## Fungsi

Program rules membatasi kandidat dan rekomendasi AI melalui policy filter.

## Kenapa Feature Ini Penting

Menjaga rekomendasi mengikuti aturan engagement yang dicatat peneliti.

## Kapan Digunakan

Sebelum meminta rekomendasi tools/techniques dan setiap rules berubah.

## Input

automationAllowed, dosAllowed, thirdPartyTesting; asset, In/Out of Scope, tiga guard awal, restrictions dan automation rules. Ketiga izin default false.

## Output

Scope assessment within_supplied_scope/outside_supplied_scope/unclear_scope/requires_manual_review; restrictions; kandidat yang lolos filter dan output AI yang difilter kembali.

## Cara Menggunakan

1. Scope → Hard Program Rules.
2. Centang izin hanya bila program eksplisit mengizinkan.
3. Periksa Scope Checker.
4. Review rekomendasi sesuai rules asli.

## Contoh

automationAllowed=false membatasi kandidat automation. Workspace tetap tidak menyarankan mass scanning; tindakan destructive, credential attack dan mass fuzzing difilter walaupun flag automation true.

## Hubungan dengan Feature Lain

Program Rules → Hard Policy Filter → Technique / Tool Candidates → AI Recommendation → output filter → Researcher Decision.

## Tips

AI tidak bisa mengubah flags. Asset out-of-scope dibanding sebagai teks persis yang dinormalisasi, bukan wildcard/path matching. Asset + In Scope + tiga guard memadai untuk within_supplied_scope walaupun asset belum terbukti cocok daftar scope; review manual wajib. Filter bahasa berbasis pola tidak menjamin seluruh narasi AI aman.
<a id="actors"></a>

# Actors

Status: Active

## Fungsi

Daftar pelaku/peran dan authority yang relevan untuk pengujian.

## Kenapa Feature Ini Penting

Membuat perbedaan hak antarrole terlihat ketika menilai authorization.

## Kapan Digunakan

Saat mapping dan sebelum mengisi WHO pada hypothesis/test.

## Input

Actor / Role wajib; Authority; Notes. Nama bebas, termasuk Anonymous, User, Viewer, Member, Editor, Admin, Owner, Service Account.

## Output

Catatan actor per target dan saran nama pada form WHO.

## Cara Menggunakan

1. Actors → + Tambah.
2. Isi role dan authority aktual.
3. Simpan.
4. Pakai nama yang sama pada hypothesis/test. Edit/hapus sesuai kebutuhan.

## Contoh

Member Example SaaS boleh export saat membership aktif; Owner dapat mencabut Member.

## Hubungan dengan Feature Lain

Attack Surface menampilkan actor; Hypotheses/Tests/Findings memakai snapshot WHO; Coverage mencocokkan nama actor.

## Tips

Actor bukan akun target yang dibuat otomatis. Rename tidak memperbarui snapshot WHO lama; ejaan berbeda mengubah matching coverage.
<a id="objects"></a>

# Objects

Status: Active

## Fungsi

Daftar protected resource, ownership, tenant, state, dan sensitivitasnya.

## Kenapa Feature Ini Penting

Membantu membedakan object yang memang boleh diakses dari akses tidak sah.

## Kapan Digunakan

Saat mapping dan merancang pembanding ownership/tenant/lifecycle.

## Input

Object Name wajib; Type Account/File/Project/Workspace/Conversation/Token/Invitation/Approval/Invoice/Webhook/Job/Profile/API Resource/Custom; Owner; Tenant; State; Sensitivity; Notes.

## Output

Catatan object, saran OBJECT pada editor, dan state yang masuk denominator coverage.

## Cara Menggunakan

1. Objects → + Tambah.
2. Pilih tipe terdekat dan isi ownership/state.
3. Simpan.
4. Gunakan nama konsisten pada hypothesis/test.

## Contoh

Project Demo bertipe Project; Export Demo bertipe File, Tenant Demo, state queued. Export bukan tipe dropdown tersendiri.

## Hubungan dengan Feature Lain

Attack Surface, Hypotheses, Tests, Findings, AI context dan Coverage memakai catatan ini.

## Tips

Owner/tenant/state adalah teks manual, bukan hasil sinkronisasi resource target. Update object tidak mengubah snapshot test historis.
<a id="attack-surface"></a>

# Attack Surface Mapping

Status: Partial

## Fungsi

Tampilan gabungan Actors, Objects, dan Trust Boundary Map untuk mapping manual.

## Kenapa Feature Ini Penting

Menghubungkan pelaku, resource, komponen dan perpindahan authority.

## Kapan Digunakan

Sebelum memilih technique dan saat arsitektur berkembang.

## Input

Actor/object/boundary records; nama komponen pada From/To, channel dan notes; Custom Notes profil untuk arsitektur tambahan.

## Output

Kartu daftar tiga jenis entri. Belum ada inventaris surface/endpoint terpisah, discovery, atau graph arsitektur otomatis.

## Cara Menggunakan

1. Catat arsitektur di Custom Notes/Notes.
2. Attack Surface → tambah actor/object/boundary.
3. Gunakan nama Web, API, Desktop, Mobile, Browser Extension, WebSocket, Worker, Storage, OAuth jika relevan.
4. Catat protokol/endpoint pada Channel/Notes.

## Contoh

Example SaaS: Browser → Backend API → Export Worker → Storage; OAuth hanya ditambahkan jika ada di laboratorium.

## Hubungan dengan Feature Lain

Menggabungkan data Actors/Objects/Boundaries yang juga bisa diedit lewat menu masing-masing.

## Tips

Status Partial menandai mapping yang terbatas pada daftar manual. Menulis endpoint bukan berarti aplikasi menemukan atau menguji endpoint.
<a id="boundaries"></a>

# Trust Boundaries

Status: Active

## Fungsi

Hubungan komponen dengan trust atau privilege berbeda, beserta aturan authority.

## Kenapa Feature Ini Penting

Mengidentifikasi titik ketika izin/context dapat berubah atau hilang.

## Kapan Digunakan

Saat mapping hubungan komponen dan memilih boundary test.

## Input

From dan To wajib; Channel; Trust restricted/trusted/untrusted; Authority; Notes.

## Output

Row From → To tersimpan dan pilihan Trust Boundary pada test editor.

## Cara Menggunakan

1. Trust Boundaries → + Tambah.
2. Isi komponen asal/tujuan dan channel.
3. Jelaskan authority yang harus diverifikasi.
4. Pilih row ini pada Test Case yang relevan.

## Contoh

Backend API → Export Worker melalui queue; worker wajib mengecek Member masih aktif. Browser → Extension → Backend → Worker → Storage dapat dicatat sebagai beberapa row.

## Hubungan dengan Feature Lain

Attack Surface menampilkan row; Trust Boundary Mapper membuka editor ini; Tests mengaitkan boundary ID; Coverage membaca relasi eksplisit.

## Tips

Label trust mencatat klasifikasi manual. From/To bukan node graph yang memvalidasi arsitektur. Hapus boundary melepas relasi test, tanpa menghapus test.
<a id="technique-library"></a>

# Technique Library

Status: Active

## Fungsi

20 teknik bawaan dan custom technique dengan invariant, template, signals, dan stop condition.

## Kenapa Feature Ini Penting

Memberi kerangka memilih pertanyaan keamanan yang sesuai arsitektur dan scope.

## Kapan Digunakan

Sebelum hypothesis atau saat memilih gap berikutnya.

## Input

Search/filter rarity, difficulty, domain, category; sort Rare First/Easy First/Highest Research Priority/Lowest Duplicate Risk/Lowest Testing Cost; editor name, description, invariant, templates, signals, false positives, stop condition, notes dan skor 0–100.

## Output

Kartu teknik target dengan Enabled/Tested/Interesting manual, detail referensi, dan tombol Buat hypothesis. Metadata dimensions enam formula tersimpan pada teknik awal.

## Cara Menggunakan

1. Techniques → filter dan buka detail.
2. Pilih invariant yang sesuai.
3. Edit nilai/skor jika perlu.
4. Buat hypothesis dan lengkapi invariant.
5. Gunakan + Custom Technique untuk pendekatan yang belum ada.

## Contoh

Async Authorization / Queue Revalidation dipilih untuk memeriksa permission worker ketika membership berubah setelah enqueue.

## Hubungan dengan Feature Lain

Teknik menjadi referensi Hypotheses/Tests/Findings, kandidat Technique Advisor, tag Tool Knowledge, dan denominator Coverage jika enabled.

## Tips

Tested/Interesting tidak disinkronkan dengan hasil test. Custom/edit bersifat per target. Kategori tersedia mencakup Authorization, Authentication, Session, State Machine, Business Logic, OAuth / SSO, Tenant Isolation, File Boundary, Browser / Extension, API, Realtime / WebSocket, Async / Queue, Webhook, Cache, Parser Differential, Race Condition, Approval / Capability, Sandbox, Trust Boundary, Custom. Sandbox belum memiliki teknik bawaan tersendiri. Rincian seluruh 20 teknik tercantum di bawah.
<a id="hypotheses"></a>

# Hypotheses

Status: Active

## Fungsi

Dugaan kegagalan security invariant yang dipisahkan dari observasi pengujian.

## Kenapa Feature Ini Penting

Mencegah asumsi root cause atau impact dianggap sebagai fakta terlalu dini.

## Kapan Digunakan

Setelah memilih technique dan sebelum membuat test.

## Input

Title wajib; Technique; Invariant; Expected Behavior; Potential Failure; WHO/WHAT/OBJECT/STATE/AUTHORITY/CONTEXT; Priority high/medium/low; Confidence low/medium/high; Status idea/planned/testing/interesting/confirmed/rejected/duplicate/out-of-scope; Queue Backlog/Next/Testing/Interesting/Done; Notes.

## Output

Hypothesis editable yang dapat menghasilkan beberapa Test Cases dan dipindahkan dalam queue.

## Cara Menggunakan

1. + Create Hypothesis atau Buat hypothesis dari library.
2. Nyatakan invariant dan dugaan terpisah.
3. Isi formula, priority/confidence/status.
4. Simpan lalu Buat Test Case.

## Contoh

Invariant: Revoked Member tidak boleh melakukan export. Potential Failure: background worker masih memakai authorization lama.

## Hubungan dengan Feature Lain

Menerima template technique/manual helper/draft AI yang direview. Test menyimpan hypothesisId; promotion finding mengambil invariant/potential failure.

## Tips

Status confirmed adalah keputusan peneliti, tidak otomatis membuat finding confirmed. Queue dan status terpisah. Menghapus hypothesis melepas referensi test, bukan menghapus observasi.
<a id="tests"></a>

# Test Cases

Status: Active

## Fungsi

Rencana dan hasil pengujian manual dengan expected/actual, formula, serta evidence.

## Kenapa Feature Ini Penting

Memungkinkan review dan reproduksi dengan kondisi pengujian yang jelas.

## Kapan Digunakan

Sesudah hypothesis; diedit lagi setelah menjalankan tindakan terotorisasi.

## Input

Title wajib; Hypothesis/Technique; Preconditions; Steps satu per baris; Expected/Actual Result; enam dimensi; Request/Response Notes; Security Control; Timestamp; Trust Boundary; Research Notes; evidence selection.

## Output

Test record, label hasil, relasi evidence/boundary, kontribusi coverage, dan draft finding bila dipromosikan.

## Cara Menggunakan

1. Hypothesis → Buat Test Case atau + Create Test Case.
2. Isi kondisi/langkah; pilih boundary.
3. Simpan NOT TESTED.
4. Lakukan test sendiri.
5. Isi actual/evidence/timestamp dan hasil.
6. Review sebelum Promote to Finding.

## Contoh

Pada Example SaaS, expected akses export ditolak sesudah revoke. PASS jika kontrol bekerja; FAIL jika invariant gagal; INCONCLUSIVE bila timing belum jelas; NOT TESTED jika belum diuji. VULNERABILITY adalah opsi tambahan untuk konfirmasi peneliti.

## Hubungan dengan Feature Lain

Menerima hypothesis/template; Evidence dikaitkan; Findings menerima promotion; Dashboard dan Coverage membaca hasil.

## Tips

FAIL bukan aplikasi test rusak. Hasil tercatat tidak membuktikan seluruh resource aman. Promosi tersedia pada semua hasil dan selalu membuka draft, bukan konfirmasi otomatis. Queue/status hypothesis tetap diubah sendiri.
<a id="queue"></a>

# Research Queue

Status: Active

## Fungsi

Optional planning view of the same hypotheses, available inside the Hypotheses page.

## Kenapa Feature Ini Penting

Memisahkan rencana prioritas berikutnya dari status kebenaran dugaan.

## Kapan Digunakan

Ketika merencanakan sesi riset dan menutup tindak lanjut.

## Input

Hypotheses, filters, dan pilihan Queue Backlog/Next/Testing/Interesting/Done pada setiap kartu.

## Output

Lima kolom berisi judul/jumlah hypothesis dan dropdown perpindahan. Menu Hypotheses juga memuat queue yang sama.

## Cara Menggunakan

1. Buka Research Queue.
2. Taruh ide di Backlog, calon sesi berikutnya di Next.
3. Pindah Testing saat bekerja.
4. Interesting untuk tindak lanjut; Done ketika ditutup.
5. Perbarui status hypothesis terpisah.

## Contoh

Dugaan export revoke berada di Next sebelum pengujian dan Interesting ketika butuh bukti timing.

## Hubungan dengan Feature Lain

Queue milik Hypotheses; Dashboard menampilkan Next/Testing/Interesting.

## Tips

The queue is collapsed on Hypotheses and available through the existing #queue deep link. Queue/status data remain distinct and preserved.
<a id="evidence"></a>

# Evidence

Status: Active

## Fungsi

Menyimpan teks observasi dan metadata referensi file yang terkait test/finding.

## Kenapa Feature Ini Penting

Mendukung reproduksi serta membatasi laporan pada bukti yang tersedia.

## Kapan Digunakan

Selama/sesudah test dan sebelum review finding/report.

## Input

Label wajib; Type screenshot/http-request/http-response/console-output/log/video-reference/file-reference/manual-note; Path/reference; Description; Content; Test Case/Finding associations.

## Output

Evidence record dan evidenceIds pada test/finding terkait. Teks/metadata ikut workspace dan report; file binary tidak ikut.

## Cara Menggunakan

1. Test/Finding → Attach Evidence atau Evidence → + Attach Evidence.
2. Redaksi teks sebelum memasukkan.
3. Isi label, type, description dan relasi.
4. Simpan dan periksa daftar evidence terkait.

## Contoh

Response dummy berisi SECRET_ACCOUNT_A_123 pada export akun A; akun B memakai SECRET_ACCOUNT_B_456. Kedua marker adalah label dummy untuk melacak asal data, bukan secret sebenarnya.

## Hubungan dengan Feature Lain

Tests/Findings memilih evidenceIds; promotion menyalin evidence test yang ada saat itu; Reports memasukkan teksnya; AI menerima evidence hanya opt-in.

## Tips

Warning tidak otomatis meredaksi sebelum Save. Path bukan upload/binary/open-file. Evidence yang ditambahkan setelah promotion perlu dikaitkan juga ke finding. Marker tidak disisipkan/dideteksi otomatis. Hapus evidence melepas relasi dari test/finding.
<a id="findings"></a>

# Findings dan Promotion

Status: Active

## Fungsi

Kandidat temuan dengan authority, restriction, resource, observasi, impact, dan evidence.

## Kenapa Feature Ini Penting

Menyusun hasil test menjadi materi review dan laporan tanpa mencampur dugaan dengan fakta.

## Kapan Digunakan

Ketika observasi layak ditinjau sebagai temuan setelah review scope dan kontrol.

## Input

Title wajib; Status draft/investigating/confirmed/reported/resolved/duplicate/rejected/out-of-scope; Severity Unknown/P1–P5 Researcher Estimate; Component/Version/Class/Technique/Source Test; enam dimensi; Starting Authority; Restriction; Protected Resource; Unauthorized Outcome; Root Cause Hypothesis; Impact; Preconditions/Steps/Expected/Actual; Mitigation; Research Notes; Evidence.

## Output

Finding editable. Promotion menyalin source test/formula/expected/actual/steps/evidence dan invariant/potential failure hypothesis, lalu membuka status draft dan severity Unknown.

## Cara Menggunakan

1. Test → Promote to Finding atau + Create Finding.
2. Periksa semua nilai prefill.
3. Lengkapi restriction/resource/impact/evidence.
4. Review false positives dan duplicate.
5. Tentukan status/severity sendiri; Generate Report.

## Contoh

Example SaaS: Component Export Worker; Resource Export Demo; outcome akun B memperoleh file setelah revoke hanya jika benar teramati. Root cause snapshot authorization tetap hipotesis.

## Hubungan dengan Feature Lain

Evidence -> Finding -> inline completeness/alternative/duplicate review -> Report. Manual duplicate details remain available from each finding.

## Tips

Inline completeness and text similarity do not establish validity, severity or duplicate status. Root cause remains a hypothesis and confirmation remains a researcher decision.
<a id="reports"></a>

# Report Generator

Status: Active

## Fungsi

Template laporan Indonesia yang dapat diedit, dipreview, disalin, diekspor, dan dicetak.

## Kenapa Feature Ini Penting

Menyajikan fakta dan evidence dalam struktur review yang konsisten.

## Kapan Digunakan

Setelah finding lengkap dan direview; regenerate setelah facts/evidence berubah.

## Input

Finding pilihan, target, technique terkait, evidenceIds dan reportMarkdown yang diedit.

## Output

Laporan berisi Ringkasan, Target, Severity Estimate, Prasyarat, Starting Authority, Restriction, Steps, Expected/Actual, Impact, Root Cause Hypothesis, Evidence, Mitigation, Catatan; Copy Markdown; file .md/.txt/.html; Print.

## Cara Menggunakan

1. Finding → Generate Report.
2. Di Reports pilih finding dan tekan Generate Report untuk menyimpan template.
3. Preview dan edit.
4. Review redaksi.
5. Copy/download/print.

## Contoh

Laporan export Example SaaS memuat severity Unknown dan root cause berlabel hipotesis sampai peneliti memiliki bukti tambahan.

## Hubungan dengan Feature Lain

Membaca Findings/Target/Evidence; draft disimpan di finding.reportMarkdown; Report Assistant dapat menghasilkan draft pengganti yang harus diterima eksplisit.

## Tips

Template default Indonesia; input user tidak diterjemahkan. Preview hanya heading sederhana dan paragraf, bukan full Markdown. HTML adalah Markdown escaped dalam pre. Draft tersimpan tidak otomatis diperbarui ketika finding berubah; Generate ulang meminta konfirmasi. Aplikasi tidak membuat submission program.
<a id="notes"></a>

# Research Notes

Status: Active

## Fungsi

Scratchpad target dan catatan tambahan hasil import, redaksi, atau review AI.

## Kenapa Feature Ini Penting

Menyimpan observasi sementara, pertanyaan dan alasan keputusan tanpa memaksanya menjadi finding.

## Kapan Digunakan

Sepanjang riset dan sebelum memindahkan lesson ke Knowledge Base.

## Input

Teks/Markdown pada scratchpad dan editor note non-scratchpad.

## Output

Satu scratchpad per target dan catatan lain yang dapat diedit/delete; autosave content.

## Cara Menggunakan

1. Research Notes → ketik observasi.
2. Tunggu Saved locally.
3. Edit note tambahan hasil AI/import bila perlu.
4. Pindahkan lesson terstruktur ke KB manual.

## Contoh

Catat urutan waktu enqueue/revoke/execute/download Example SaaS sebelum menyimpulkan kontrol gagal.

## Hubungan dengan Feature Lain

AI Accept as Note dan Secret Redactor Save Redacted Note menambahkan note; Global Search mencarinya.

## Tips

Markdown disimpan sebagai teks, tanpa preview kaya. Jangan menyimpan kredensial hanya karena note lokal; IndexedDB tidak terenkripsi.
<a id="knowledge"></a>

# Knowledge Base

Status: Active

## Fungsi

Catatan terstruktur untuk pola riset, false positive, disclosed report, dan lessons per target.

## Kenapa Feature Ini Penting

Menghindari pengulangan investigasi serta menyimpan alasan kontrol bekerja atau gagal.

## Kapan Digunakan

Sesudah review test/finding dan ketika mempelajari issue sebelumnya.

## Input

Title wajib; Category Technique Notes/Research Patterns/False Positives/Finding Patterns/Program Notes/Architecture Patterns/Lessons/Disclosed Reports; Content; Source; Root Cause; Security Boundary; Primitive; Component; Impact.

## Output

Knowledge records yang dapat dicari/filter/edit/delete; kandidat duplicate comparator dari tiga kategori tertentu.

## Cara Menggunakan

1. Knowledge Base → + Add Knowledge.
2. Pilih kategori dan isi lesson/source.
3. Lengkapi metadata bila ingin membandingkan duplicate.
4. Simpan dan gunakan filter untuk mencari.

## Contoh

Lesson Example SaaS: catat waktu eksekusi worker, bukan hanya waktu job dibuat. Simpan kontrol PASS sebagai pelajaran juga.

## Hubungan dengan Feature Lain

Duplicate Comparator membaca Disclosed Reports/Finding Patterns/False Positives target aktif. AI menerima KB hanya Include Knowledge Base. Backup membawa seluruh KB.

## Tips

KB per target, belum shared lintas target atau auto retrieval. Salin lesson yang relevan ke target baru secara manual. Source/disclosed URL adalah teks, bukan fetch. Import JSON mengganti workspace, bukan menggabungkan KB.
<a id="tools"></a>

# Tool Knowledge dan Offline Tool Recommendation

Status: Active

## Fungsi

Rekomendasi katalog tools manual berdasarkan technique dan hard scope filter, tanpa AI.

## Kenapa Feature Ini Penting

Menghubungkan kebutuhan observasi dengan alat yang relevan dalam batas izin.

## Kapan Digunakan

Sesudah memilih technique atau untuk melihat opsi manual yang tersedia.

## Input

Target, asset/scope/guard/rules, pilihan technique atau Semua teknik; domain dan tag authorization/realtime.

## Output

Tool yang lolos policy, urutan relevance, kategori, mode manual, deskripsi, scope warning dan referensi dokumentasi; daftar helper internal.

## Cara Menggunakan

1. Lengkapi Scope/Guard.
2. Tool Knowledge → pilih technique.
3. Baca mode penggunaan dan scope warning.
4. Buka tool eksternal sendiri jika memang diperlukan dan diizinkan.

## Contoh

IDOR / BOLA / Object Ownership adalah technique; Burp Repeater adalah tool eksternal; Authorization Matrix Builder adalah helper internal untuk ownership/permission rows.

## Hubungan dengan Feature Lain

Teknik/scope memberi kandidat offline; AI Tool Advisor meranking kandidat katalog yang dibatasi backend; Helpers menyediakan fitur internal.

## Tips

Bukan katalog tanpa konteks: asset/scope/guard/rules memengaruhi gating, domain/tag memengaruhi relevance. Tidak ada scanning/probing target. Semua entri curated manual; konfigurasi otomatis tool tidak dicakup. URL dokumentasi tool tampil sebagai teks di kartu.

## Katalog Tool yang Tersedia

Berikut deskripsi mode yang dikurasi dalam aplikasi; seluruhnya manual, tidak dijalankan workspace. Flag requiresAutomation/requiresThirdParty/requiresDos/destructive seluruh entri saat ini false karena mode yang dideskripsikan terbatas. Tetap ikuti scope warning dan ketentuan penggunaan tool/program yang Anda review sendiri.

| Tool | Kategori katalog | Fungsi mode manual dalam katalog | Referensi tersimpan |
| --- | --- | --- | --- |
| Burp Repeater | api, authorization, business-logic | Membandingkan request secara manual dan terkontrol. | [Dokumentasi Burp Repeater](https://portswigger.net/burp/documentation/desktop/tools/repeater) |
| Caido | api, authorization | Workflow proxy/replay manual; aksi otomatis memerlukan izin program terpisah. | [Dokumentasi Caido](https://docs.caido.io/) |
| mitmproxy | api, browser | Memeriksa traffic yang diotorisasi; script otomatis tidak termasuk mode rekomendasi ini. | [Dokumentasi mitmproxy](https://docs.mitmproxy.org/) |
| Postman | api, auth | Mengirim dan memeriksa satu request API yang diotorisasi secara manual. | [Dokumentasi Postman](https://learning.postman.com/) |
| curl | api, state | Mencatat request manual ke endpoint yang diotorisasi. | [Dokumentasi curl](https://curl.se/docs/) |
| jq | api, parser | Membandingkan dan memfilter JSON lokal. | [Dokumentasi jq](https://jqlang.org/manual/) |
| Browser DevTools | browser, state, auth | Memeriksa state lokal, catatan network, dan context aplikasi. | [Dokumentasi Browser DevTools](https://developer.chrome.com/docs/devtools/) |
| Wireshark | realtime, infra | Memeriksa file capture traffic lokal yang diotorisasi. | [Dokumentasi Wireshark](https://www.wireshark.org/docs/) |
| Git | state, infra | Mencatat perubahan notes atau fixture milik peneliti secara lokal. | [Dokumentasi Git](https://git-scm.com/docs) |
| Docker | infra, sandbox | Reproduksi pada lingkungan uji terisolasi milik peneliti. | [Dokumentasi Docker](https://docs.docker.com/) |
| websocat | realtime, api | Memeriksa koneksi WebSocket yang diotorisasi secara manual. | [Dokumentasi websocat](https://github.com/vi/websocat) |
<a id="helpers"></a>

# Internal Helpers

Status: Active

## Fungsi

Sebelas alat internal lokal untuk menyusun, membandingkan, dan meninjau catatan.

## Kenapa Feature Ini Penting

Menyediakan dukungan praktis riset tanpa membutuhkan provider AI.

## Kapan Digunakan

Saat mapping, merancang test, membersihkan evidence, atau mereview finding.

## Input

Pilihan Internal Helper; input manual yang berbeda menurut helper.

## Output

Rows/notes/hypotheses tersimpan bila ada Save; hasil perbandingan/preview lokal; atau tautan ke modul terkait.

## Cara Menggunakan

1. Internal Helpers → pilih helper.
2. Baca ? untuk input/output/batasannya.
3. Isi dan jalankan action lokal.
4. Simpan secara eksplisit jika helper menyediakan Save.

## Contoh

Example SaaS menggunakan State Transition untuk revoke, Secret Redactor untuk log, dan Finding Checklist sebelum report.

## Hubungan dengan Feature Lain

Helper Advisor AI merekomendasikan nama dari katalog ini, tanpa membuka/mengeksekusinya. Setiap helper memiliki entri tersendiri di bawah.

## Tips

Helper adalah fitur aplikasi; Burp/curl/Docker adalah tool eksternal. Evidence Comparator dan Duplicate Comparator menghasilkan preview yang hilang saat pindah view.
<a id="helper-authorization-matrix"></a>

# Authorization Matrix Builder

Status: Partial

## Fungsi

Menyimpan row manual actor × object × action dengan expected permission.

## Kenapa Feature Ini Penting

Membuat kontrol permission yang diharapkan eksplisit sebelum membandingkan role.

## Kapan Digunakan

Saat mapping hak actor atau menyiapkan kontrol pembanding authorization.

## Input

Actor, Object, Action wajib; Required Authority; Expected permission/invariant.

## Output

helperRecords tipe authorization-matrix dalam kartu row yang dapat diedit/delete.

## Cara Menggunakan

1. Internal Helpers → Authorization Matrix Builder.
2. + Add Row.
3. Isi actor/object/action dan expected permission.
4. Simpan; ulangi untuk role lain.

## Contoh

Owner → export → Project Demo diizinkan; Member revoked → export → Project Demo harus ditolak.

## Hubungan dengan Feature Lain

Saved expected-control rows can open a reviewed Hypothesis, then a manual Test and Evidence.

## Tips

Review Hypothesis copies expected controls into an editable draft. It does not infer permissions or confirm a vulnerability.
<a id="helper-state-transition"></a>

# State Transition Builder

Status: Partial

## Fungsi

Menyimpan row state asal/tujuan, action, authority, dan invariant.

## Kenapa Feature Ini Penting

Mengidentifikasi kapan hak harus berubah sepanjang lifecycle.

## Kapan Digunakan

Sebelum test revoke/expiry/approval/async state.

## Input

From State dan To State wajib; Action; Required Authority; Security Invariant; Notes.

## Output

helperRecords tipe state-transition dengan row editable/delete.

## Cara Menggunakan

1. Internal Helpers → State Transition Builder.
2. + Add Row.
3. Isi state dan authority transisi.
4. Simpan dan jadikan rujukan test.

## Contoh

active → revoked; action Owner mencabut Member; invariant Member tidak menerima export baru sesudah revoke efektif.

## Hubungan dengan Feature Lain

Saved transitions can open a reviewed Hypothesis with state/authority context.

## Tips

Expected transitions are researcher notes, not observations. Review the hypothesis before manual tests.
<a id="helper-trust-boundary"></a>

# Trust Boundary Mapper

Status: Active

## Fungsi

Membuka modul Trust Boundaries untuk mencatat perpindahan trust/authority.

## Kenapa Feature Ini Penting

Menggunakan satu tempat penyimpanan boundary agar mapping tetap konsisten.

## Kapan Digunakan

Ketika helper diperlukan untuk mapping komponen.

## Input

Pada modul tujuan: From/To, Channel, Trust, Authority, Notes.

## Output

Navigasi ke Trust Boundaries; row tersimpan setelah Anda mengisi dan Save di sana.

## Cara Menggunakan

1. Internal Helpers → Trust Boundary Mapper.
2. Open Trust Boundaries.
3. Tambah/edit row seperti dijelaskan pada Trust Boundaries.

## Contoh

API → Worker export Example SaaS dengan revalidation membership terbaru.

## Hubungan dengan Feature Lain

Memakai Boundaries yang sama dengan Attack Surface/Tests/Coverage.

## Tips

Compatibility launcher retained but hidden in the normal helper picker. Map boundaries directly under Attack Surface.
<a id="helper-evidence-comparator"></a>

# Evidence Comparator

Status: Partial

## Fungsi

Membandingkan keberadaan baris unik pada dua teks evidence lokal.

## Kenapa Feature Ini Penting

Membantu melihat perbedaan respons kontrol dan percobaan tanpa mengirim data ke AI.

## Kapan Digunakan

Sesudah merekam dua observasi yang dapat dibandingkan.

## Input

Evidence A/B yang ditempel atau content dari evidence tersimpan pilihan.

## Output

Preview baris sama, − hanya A, + hanya B; hasil tidak otomatis disimpan.

## Cara Menggunakan

1. Pilih Evidence Comparator.
2. Tempel A/B atau pilih stored evidence.
3. Compare Evidence.
4. Catat perbedaan bermakna dalam test/notes.

## Contoh

Bandingkan respons Member aktif versus revoked untuk marker Export Demo.

## Hubungan dengan Feature Lain

Membaca content Evidence; peneliti menyalin hasil relevan ke Test/Finding/Notes.

## Tips

Partial: bukan diff yang mempertahankan urutan atau jumlah duplikasi baris, bukan JSON structural/semantic comparator. Preview hilang ketika pindah view.
<a id="helper-secret-redactor"></a>

# Secret Redactor

Status: Partial

## Fungsi

Preview redaksi pola kredensial, header sensitif, JWT, dan email pada teks.

## Kenapa Feature Ini Penting

Mengurangi data sensitif pada evidence, note, report, atau context AI yang Anda review.

## Kapan Digunakan

Sebelum menyimpan/membagikan evidence atau mengirim context cloud.

## Input

Teks mentah pada Text to redact. Pola mencakup Authorization/Proxy-Authorization, Bearer, Cookie/Set-Cookie, API Key, JWT, session ID/token, password, access/refresh token, CSRF/XSRF token, beberapa key prefixes dan email.

## Output

Redacted preview; Save Redacted Note menyimpan output preview sebagai note, bukan mengganti evidence.

## Cara Menggunakan

1. Pilih Secret Redactor.
2. Paste teks → Redact Preview.
3. Review manual semua bagian.
4. Salin hasil ke evidence atau Save Redacted Note.

## Contoh

Authorization: Bearer token-dummy menjadi Authorization: [REDACTED]; label dummy SECRET_ACCOUNT_A_123 dapat tetap ada jika tidak cocok pola secret.

## Hubungan dengan Feature Lain

AI privacy memakai redactor yang sama secara otomatis pada mode/flag yang mensyaratkannya; Notes menerima Save output; evidence manual perlu Anda ubah sendiri.

## Tips

Partial: redaksi berbasis pola tidak mengenali seluruh secret/PII dan bukan enkripsi. Raw input hanya berada di form helper, bukan disimpan helper; output baru disimpan bila memilih Save. Metadata/teks naratif dapat tetap sensitif.
<a id="helper-hypothesis-generator"></a>

# Hypothesis Generator — Offline Template

Status: Active

## Fungsi

Membuka editor hypothesis yang diprefill dari teknik tanpa AI.

## Kenapa Feature Ini Penting

Mempercepat penulisan dugaan sambil mempertahankan review peneliti.

## Kapan Digunakan

Sesudah memilih technique dan sebelum test.

## Input

Technique for hypothesis dari daftar target.

## Output

Editor dengan judul, techniqueId, invariant, potential failure dan notes template; record dibuat hanya saat Simpan.

## Cara Menggunakan

1. Pilih Hypothesis Generator di Internal Helpers.
2. Pilih technique.
3. Preview / Edit Hypothesis.
4. Lengkapi formula/expected behavior.
5. Simpan atau Batal.

## Contoh

Pilih Async Authorization untuk draft invariant worker mengecek authority pada execution.

## Hubungan dengan Feature Lain

Membaca Technique Library dan membuat Hypotheses; berbeda dari Operation AI generate_hypotheses.

## Tips

Template bukan analisis target. Review relevansi invariant/stop conditions, walaupun teks awal sudah terisi.
<a id="helper-scope-checker"></a>

# Scope Checker

Status: Active

## Fungsi

Menampilkan assessment dan restrictions dari scope/guard/rules yang dicatat.

## Kenapa Feature Ini Penting

Membantu melihat data izin yang masih kurang sebelum meminta rekomendasi.

## Kapan Digunakan

Sebelum Tool Knowledge/AI atau ketika rules berubah.

## Input

Target asset, In/Out of Scope, tiga guard awal, flags rules, testing/automation restrictions.

## Output

Status assessment, alasan, daftar restrictions, dan tombol Edit Scope & Rules.

## Cara Menggunakan

1. Pilih Scope Checker.
2. Baca status/alasan.
3. Edit Scope & Rules untuk memperbaiki catatan.
4. Review izin aktual secara manual.

## Contoh

Tanpa konfirmasi data owned, Example SaaS menunjukkan requires_manual_review.

## Hubungan dengan Feature Lain

Menggunakan rules service yang sama dengan offline tool recommendations dan backend AI.

## Tips

Tidak memindai asset, mengambil rules program, atau mengevaluasi wildcard/path. within_supplied_scope hanya kesesuaian catatan manual; lihat batasan Rules Engine.
<a id="helper-finding-checklist"></a>

# Finding Checklist

Status: Active

## Fungsi

Checklist kelengkapan delapan unsur finding dan evidence.

## Kenapa Feature Ini Penting

Menunjukkan informasi dasar yang belum disediakan sebelum review/report.

## Kapan Digunakan

Sesudah promotion dan sebelum membuat report.

## Input

Finding pilihan; Expected, Actual, Starting Authority, Protected Resource, Security Restriction, Steps, Evidence attached, Impact.

## Output

Tanda ada/belum ada pada delapan unsur berdasarkan isi field/evidenceIds.

## Cara Menggunakan

1. Pilih Finding Checklist.
2. Pilih finding.
3. Periksa item kosong.
4. Edit finding/attach evidence lalu review ulang.

## Contoh

Finding export tanpa starting authority menunjukkan item tersebut belum lengkap.

## Hubungan dengan Feature Lain

Membaca Findings; peneliti memperbaiki Findings/Evidence sebelum Reports.

## Tips

Checklist kelengkapan, bukan false-positive validator, severity estimator, atau bukti validity. Semua centang dapat muncul walau isi field masih salah.
<a id="helper-duplicate-comparator"></a>

# Duplicate Comparator

Status: Partial

## Fungsi

Membandingkan kemiripan teks lima unsur finding dengan kandidat lokal/manual.

## Kenapa Feature Ini Penting

Memberi petunjuk risiko issue sama sambil menampilkan ketidakpastian.

## Kapan Digunakan

Sesudah finding cukup terisi dan sebelum laporan/submission manual.

## Input

Finding sumber; kandidat finding lain target aktif, KB Disclosed Reports/Finding Patterns/False Positives, atau manual; Root Cause, Security Boundary, Primitive/Class, Component, Impact.

## Output

Likely Unique/Possible Variant/Likely Duplicate/Unknown, score text similarity %, dan catatan keterbatasan.

## Cara Menggunakan

1. Pilih Duplicate Comparator dan finding.
2. Pilih kandidat atau isi lima field.
3. Compare Duplicate Risk.
4. Review kesamaan root cause/boundary secara manual.

## Contoh

Bandingkan export-worker revalidation Example SaaS dengan disclosed report dummy tentang job yang memakai izin lama.

## Hubungan dengan Feature Lain

Membaca Findings/KB target aktif; Known Issues hanya memprefill root cause kandidat manual; tidak mengubah finding status.

## Tips

Partial: Jaccard kata >2 karakter per field, rata-rata field berisi pada kedua sisi. Kurang dari dua field → Unknown; ≥80% Likely Duplicate; ≥35% Possible Variant; lainnya Likely Unique. Bukan keputusan program, pencarian internet, embedding, atau pembandingan semua target. Nilai mirip rendah tidak membuktikan unik.
<a id="helper-report-builder"></a>

# Report Builder

Status: Active

## Fungsi

Membuka Reports untuk menyusun laporan Indonesia dari finding.

## Kenapa Feature Ini Penting

Memberi akses langsung dari helper workflow ke generator deterministik.

## Kapan Digunakan

Sesudah finding dan evidence direview.

## Input

Finding target aktif dipilih pada halaman Reports.

## Output

Navigasi Reports; draft/export dihasilkan lewat controls Reports.

## Cara Menggunakan

1. Pilih Report Builder.
2. Open Indonesian Reports.
3. Pilih finding, Generate Report, review/edit dan export.

## Contoh

Buat report dummy export Example SaaS dengan impact sesuai observasi.

## Hubungan dengan Feature Lain

Shortcut ke Report Generator yang sama; tidak membuat template atau penyimpanan terpisah.

## Tips

Compatibility launcher retained but hidden in the normal helper picker. Findings -> Generate Report opens the canonical report workspace.
<a id="helper-gap-analyzer"></a>

# Research Gap Analyzer — Helper

Status: Partial

## Fungsi

Menampilkan panel coverage dan lifecycle/surface gaps lokal.

## Kenapa Feature Ini Penting

Membantu mencari catatan pengujian berikutnya dari entri yang belum tercakup.

## Kapan Digunakan

Setelah mencatat beberapa test atau sebelum sesi berikutnya.

## Input

Technique enabled, actors, objects, states, boundaries, test results target aktif.

## Output

Panel rasio dan Untested serta pesan heuristic yang sama dengan Research Gaps.

## Cara Menggunakan

1. Pilih Research Gap Analyzer.
2. Baca Untested dan Lifecycle & Surface Gaps.
3. Cocokkan dengan scope/risiko.
4. Buat hypothesis/test manual.

## Contoh

Owner belum muncul di test Example SaaS; pilih kontrol Owner bila relevan.

## Hubungan dengan Feature Lain

Memakai Coverage service yang sama, berbeda dari AI Gap Analyzer.

## Tips

Compatibility view retained but hidden in the normal helper picker. Dashboard -> Research Gaps uses the same analysis.
<a id="coverage"></a>

# Research Gaps dan Research Coverage

Status: Partial

## Fungsi

Rasio dan daftar actor/object/state/boundary/technique yang belum mempunyai hasil test.

## Kenapa Feature Ini Penting

Mengubah backlog riset menjadi prioritas berbasis catatan yang tersedia.

## Kapan Digunakan

Setelah test dan saat merencanakan sesi berikutnya.

## Input

Test dengan result nonempty selain not-tested; techniques enabled; actor/object names; state unik dari objects+hypotheses+tests; boundary IDs.

## Output

Covered / total, Untested per lima dimensi; missing revocation/async/cross-surface heuristic. Tidak ada persen category Authorization/Async/OAuth atau grafik lengkap kombinasi.

## Cara Menggunakan

1. Research Gaps → baca lima panel.
2. Periksa ejaan snapshot dan boundary selection bila rasio mengejutkan.
3. Pilih gap relevan dengan scope.
4. Buat hypothesis/test.
5. Catat hasil untuk memperbarui rasio.

## Contoh

Actor 1 / 2: Member mempunyai hasil test, Owner belum. Boundary 0 / 1 tetap nol jika test tidak memilih boundary walau context menyebut API → Worker.

## Hubungan dengan Feature Lain

One deterministic analyzer powers recorded coverage, the legacy gap helper and #ai-gaps compatibility view.

## Tips

Partial recorded coverage only. Actor/object IDs take precedence; legacy WHO/OBJECT snapshots fall back to names. Lifecycle messages are heuristic, not proof of untested vulnerability classes.
<a id="research-priority"></a>

# Research Priority

Status: Active

## Fungsi

Skor prioritas riset 0–100 dan urutan teknik untuk membantu menentukan tindak lanjut.

## Kenapa Feature Ini Penting

Mempertimbangkan nilai pembelajaran, biaya, scope, bukti dan duplicate risk.

## Kapan Digunakan

Saat memilih technique atau membaca rekomendasi AI.

## Input

Technique editor: manual researchPriority/duplicateRisk/testingCost 0–100. AI: potentialImpact, likelihood, novelty, testingCost, duplicateRisk, scopeConfidence, evidenceQuality masing-masing 0–100.

## Output

Skor dan reason dalam structured AI result; sorting technique memakai skor manual. Hypothesis priority high/medium/low adalah field terpisah.

## Cara Menggunakan

1. Tentukan skor manual technique jika berguna.
2. Gunakan sorting priority/risk/cost.
3. Jika AI aktif, baca score beserta alasan dan quality context.
4. Putuskan next step manual.

## Contoh

Dugaan export-worker dapat diprioritaskan setelah evidence timing membaik, walau severity finding masih Unknown.

## Hubungan dengan Feature Lain

Technique Library, Hypotheses dan AI Results memiliki bentuk prioritas berbeda; severity berada pada Findings.

## Tips

Research Priority bukan Vulnerability Severity. AI score dihitung ulang sebagai round((impact + likelihood + novelty + (100-cost) + (100-duplicateRisk) + scopeConfidence + evidenceQuality) / 7); input tetap estimasi AI. Score tidak otomatis menulis skor technique atau P1–P5.
<a id="settings"></a>

# Settings dan System Health

Status: Active

## Fungsi

Ringkasan storage/autosave/schema/AI dan akses konfigurasi serta backup.

## Kenapa Feature Ini Penting

Membantu melihat apakah catatan tersimpan dan backend opsional siap.

## Kapan Digunakan

Saat startup, storage error, konfigurasi AI, atau sebelum backup.

## Input

Status storage/persistence, safe backend config, Backend localhost origin; actions backup/file/reset.

## Output

Storage IndexedDB OK/Error; Autosave Active/Pending; schema; AI status; privacy mode; provider/model. Settings, AI Provider, Backup berbagi tampilan panel yang sama.

## Cara Menggunakan

1. Buka Settings.
2. Periksa storage/autosave.
3. Periksa AI atau Connect Backend bila diperlukan.
4. Gunakan backup jika ada error penyimpanan.

## Contoh

AI Disabled pada Example SaaS tetap memungkinkan report manual dan export.

## Hubungan dengan Feature Lain

Mengambil status storage dan AI bridge, serta controls Backup/Reset/Optional file.

## Tips

System Health bukan monitoring uptime/model atau koneksi provider live. IndexedDB OK mengikuti status pembacaan/penulisan aplikasi terakhir; indikator header menunjukkan status save lebih langsung.
<a id="ai-provider"></a>

# AI Configuration dan Connection

Status: Active

## Fungsi

Menghubungkan frontend ke backend lokal dengan provider/model yang dikonfigurasi server.

## Kenapa Feature Ini Penting

Mempertahankan workflow manual sekaligus memberi opsi AI tanpa menaruh key di browser.

## Kapan Digunakan

Sebelum meminta AI atau ketika mengganti provider/model.

## Input

Server .env: AI_ENABLED; AI_PROVIDER openai/anthropic/gemini/ollama; OPENAI_MODEL+OPENAI_API_KEY, ANTHROPIC_MODEL+ANTHROPIC_API_KEY, GEMINI_MODEL+GEMINI_API_KEY, atau OLLAMA_MODEL+OLLAMA_BASE_URL; AI_PRIVACY_MODE; AI_REDACT_SECRETS; SERVER_HOST/PORT.

## Output

Safe config tanpa API key; status Disabled/Misconfigured/Connected/Provider Error dan token request session internal.

## Cara Menggunakan

1. Review .env.example, edit .env server.
2. AI_ENABLED=false untuk manual; true + model/key untuk cloud, atau model/server Ollama lokal.
3. Restart backend.
4. Buka URL backend atau AI Provider → Connect Backend dengan origin localhost.
5. Coba context dummy untuk memeriksa request.

## Contoh

AI_PROVIDER=ollama; OLLAMA_BASE_URL=http://127.0.0.1:11434; OLLAMA_MODEL nama model terpasang; LOCAL_ONLY. Tidak ada model bawaan/default.

## Hubungan dengan Feature Lain

AI modules menggunakan bridge ini. Backend halaman utama otomatis menghubungkan safe config; mode file:// tetap manual karena Origin null ditolak.

## Tips

AI_ENABLED=true belum cukup tanpa config valid. Disabled tidak menginisialisasi provider. Connected awal berarti config siap, bukan key/model sudah teruji. Backend loopback; Connect Backend bukan URL asset target. Key hanya di .env server; jangan masukkan ke Notes/Evidence/AI goal. Provider nyata memerlukan layanan/model dan kemampuan structured output yang kompatibel.
<a id="ai-privacy"></a>

# AI Privacy Modes dan Context Preview

Status: Active

## Fungsi

Mengatur provider lokal/cloud, redaksi pola, dan persetujuan payload sebelum request.

## Kenapa Feature Ini Penting

Membuat peneliti melihat data yang akan meninggalkan browser.

## Kapan Digunakan

Sebelum setiap request AI, terutama evidence/finding/report sensitif.

## Input

LOCAL_ONLY/REDACTED_CLOUD/CLOUD; server AI_REDACT_SECRETS; target aktif; goal/notes, technique/finding pilihan, evidence/KB opt-in.

## Output

Preview JSON; allowlist context; request hanya setelah Send for Analysis. LOCAL_ONLY hanya Ollama loopback; REDACTED_CLOUD selalu redaksi; CLOUD masih redaksi jika flag server true.

## Cara Menggunakan

1. Pilih mode pada form AI.
2. Centang evidence/KB hanya bila perlu.
3. Preview AI Context dan baca seluruh payload.
4. Batalkan/perbaiki jika belum aman.
5. Send for Analysis.

## Contoh

Untuk finding Example SaaS, evidence opt-in membawa teks/description/type/label dari evidence terkait finding; path file tidak dikirim.

## Hubungan dengan Feature Lain

Context builder membaca target aktif saja, termasuk profil/scope/actors/objects/boundaries/enabled techniques/hypotheses/tests/finding summaries/selected finding; request/response notes test hanya bila evidence opt-in. Report Assistant membawa report draft. Redactor berjalan frontend dan backend jika diwajibkan.

## Tips

Evidence/KB opt-in default off, tetapi actual/expected, selected finding research notes, arsitektur dan goal tetap bisa sensitif. REDACTED_CLOUD bukan anonymization sempurna. CLOUD + AI_REDACT_SECRETS=false bisa mengirim raw context. API keys tidak dimasukkan context. Config/token bridge hanya memory session; research/suggestions tetap autosave lokal.
<a id="ai"></a>

# Research Assistant

Status: Active

## Fungsi

Saran terstruktur tentang riset target berdasarkan context yang direview peneliti.

## Kenapa Feature Ini Penting

Membantu merumuskan pertanyaan, missing context dan langkah aman tanpa eksekusi pengujian.

## Kapan Digunakan

Sesudah target/scope/mapping terisi atau ketika arah riset belum jelas.

## Input

Operation research_advice; target aktif/scope/rules/mapping/riset; goal/notes; technique/finding opsional; privacy mode dan evidence/KB opt-in.

## Output

Structured JSON scope assessment/rules, recommendations, safe next steps/avoid/stop/missing context, confidence 0–1, questions/hypotheses/finding analysis/research priority/gaps/report draft; field tidak relevan dapat kosong.

## Cara Menggunakan

1. Research Assistant → pilih Operation Research Assistant.
2. Isi goal/context.
3. Preview → Send.
4. Baca structured result.
5. Reject atau Accept/Edit Note; review hypothesis/report terpisah.

## Contoh

Goal Example SaaS: menilai kapan worker perlu revalidate permission export setelah revoke.

## Hubungan dengan Feature Lain

Satu form melayani 15 operasi. Lima menu AI memberi pilihan awal; pilihan Operation terakhir dapat tetap tersimpan selama session. Tiap operasi memiliki entri berikut.

## Tips

Tidak ada command terpisah Analyze Target; gunakan research_advice. AI disabled/misconfigured menampilkan petunjuk konfigurasi. Schema JSON divalidasi sebelum suggestion disimpan pending; tidak ada auto confirm/severity/execution. Pengujian provider nyata bergantung konfigurasi Anda.

## Daftar Operation yang Tersedia

Semua operasi memakai context preview, schema output, policy filter dan provider yang sama. Operation mengarahkan prompt; bukan pipeline yang otomatis mengeksekusi target atau mengambil database eksternal.

| Operation | Label UI / referensi | Kapan | Output utama |
| --- | --- | --- | --- |
| `research_advice` | [Research Assistant](#ai) | Sesudah target/scope/mapping terisi atau ketika arah riset belum jelas. | Structured JSON scope assessment/rules, recommendations, safe next steps/avoid/stop/missing context, confidence 0–1, questions/hypotheses/finding analysis/research priority/gaps/report draft; field tidak relevan dapat kosong. |
| `analyze_scope` | [AI Analyze Scope](#ai-analyze-scope) | Sesudah mengisi Scope dan ketika ketentuan belum jelas. | Supplied-scope assessment, recorded restrictions, missing external verification and stop conditions. |
| `recommend_techniques` | [AI Technique Advisor](#ai-techniques) | Sesudah mapping atau saat memilih prioritas baru. | recommendedTechniques: name, priority 0–100, reason, securityInvariant; researchPriority umum dan missing context. |
| `recommend_tools` | [AI Tool Advisor](#ai-tools) | Sesudah memilih technique dan sebelum menyiapkan test manual. | toolSuggestions dengan id/name/category/purpose/usageMode manual/whyUseful/scopeWarning; tool di luar kandidat dihapus. |
| `recommend_helpers` | [AI Helper Advisor](#ai-helper-advisor) | Saat mapping, evidence preparation, atau review finding. | Existing helper IDs/names matching mapped context, evidence and findings. |
| `research_questions` | [AI Research Questions](#ai-questions) | Saat mapping awal atau hasil test masih inconclusive. | researchQuestions dan missingContext serta struktur umum AI. |
| `generate_hypotheses` | [AI Hypothesis Generator](#ai-hypothesis-generator) | Sesudah mapping/technique selection dan sebelum test. | Draft title/technique/invariant/expectedBehavior/potentialFailure/enam dimensi; tombol Review Hypothesis membuka editor. |
| `analyze_finding` | [AI Finding Analyzer](#ai-findings) | Sesudah finding draft dan evidence disiapkan. | findingAnalysis: assessment, potentialClass, brokenInvariant, potentialRootCause, falsePositiveChecks, missingEvidence, potentialImpact, duplicateRisk, safeValidation; priority/confidence umum. |
| `false_positive_analysis` | [AI False Positive Analyzer](#ai-false-positive) | Sesudah finding draft dan sebelum confirmation/report. | falsePositiveChecks, missingEvidence, safeValidation dan assessment Hypothesis pada finding analysis. |
| `duplicate_analysis` | [AI Duplicate Analyzer](#ai-duplicate) | Sesudah finding dan known issues/KB pembanding tersedia. | duplicateRisk Likely Unique/Possible Variant/Likely Duplicate/Unknown dalam findingAnalysis, confidence/missing context dan saran review. |
| `gap_analysis` | [AI Gap Analyzer](#ai-gaps) | Saat merencanakan sesi baru setelah mencatat hasil test. | Recorded dimensions and untested mapped entries, without a model call. |
| `improve_report` | [AI Report Assistant](#ai-report-assistant) | Sesudah report awal dan finding/evidence direview. | reportDraft, tombol Preview / Edit Report Draft; Save memperbarui reportMarkdown sumber dan menandai suggestion accepted. |
| `evidence_summary` | [AI Evidence Summarizer](#ai-evidence-summary) | Sesudah evidence redacted dan sebelum analisis/report. | Saran naratif dalam structured result, terutama findingAnalysis/safeNextSteps/missingContext bila relevan. Tidak ada field terpisah evidenceSummary atau artifact ringkasan otomatis. |
| `safe_next_steps` | [AI Safe Next Steps](#ai-safe-next-steps) | Ketika hasil inconclusive atau missing evidence masih ada. | safeNextSteps, avoid, stopConditions dan missingContext. |
| `identify_restrictions` | [AI Restrictions](#ai-restrictions) | Sebelum test dan setiap rules/arsitektur berubah. | Recorded policy restrictions and manual review limits. |
| `generate_target_knowledge` | [Generate Target Knowledge](#knowledge-op-generate_target_knowledge) | Sebelum mapping riset target. | items berjenis overview/model/actor/object/asset/data/flow/term/boundary/invariant/question dan unknownInformation. |
| `analyze_target` | [Analyze Target](#knowledge-op-analyze_target) | Saat profil target mulai lengkap. | Penjelasan, missing/unknown informasi dan pertanyaan review. |
| `suggest_domains` | [Suggest Domain](#knowledge-op-suggest_domains) | Sebelum menentukan sektor utama. | suggestedDomains dengan reason/confidence; klasifikasi akhir harus disetujui peneliti. |
| `explain_domain` | [Explain Domain](#knowledge-op-explain_domain) | Saat mempelajari sektor baru. | Kartu penjelasan concepts/actor/object/flow/invariant, bukan fakta target. |
| `explain_terminology` | [Explain Terminology](#knowledge-op-explain_terminology) | Ketika glossary belum cukup jelas. | Item terminology/explanation berlabel AI inference. |
| `ask_about_target` | [Ask About Target](#knowledge-op-ask_about_target) | Ketika ada pertanyaan bisnis tertentu. | Explanation dan unknownInformation dengan source/confidence. |
| `analyze_business_flow` | [Analyze Business Flow](#knowledge-op-analyze_business_flow) | Sebelum invariant/hypothesis. | Flow/boundary/invariant/question drafts; bukan proses perusahaan confirmed. |
| `identify_critical_assets` | [Identify Critical Assets](#knowledge-op-identify_critical_assets) | Saat mapping ownership/impact. | Asset/sensitive-data items untuk review peneliti. |
| `generate_security_invariants` | [Generate Security Invariants](#knowledge-op-generate_security_invariants) | Sebelum membuat pertanyaan/test. | Invariant draft dengan domain/flow/technique references yang valid. |
| `generate_domain_questions` | [Generate Research Questions](#knowledge-op-generate_domain_questions) | Sesudah mempelajari flow. | Question drafts yang dapat diterima lalu Convert to Hypothesis. |
| `recommend_domain_techniques` | [Recommend Techniques — Domain](#knowledge-op-recommend_domain_techniques) | Saat memilih technique berikutnya. | Item invariant/question/explanation dengan techniqueId yang dibatasi kandidat supplied. |
<a id="ai-analyze-scope"></a>

# AI Analyze Scope

Status: Active

## Fungsi

Compatibility operation using the local scope/policy checker, without a provider call.

## Kenapa Feature Ini Penting

Mengidentifikasi informasi scope/rules yang masih kurang sebelum menyusun test.

## Kapan Digunakan

Sesudah mengisi Scope dan ketika ketentuan belum jelas.

## Input

Operation analyze_scope; profil target, scope/guard/rules, research goal/notes.

## Output

Supplied-scope assessment, recorded restrictions, missing external verification and stop conditions.

## Cara Menggunakan

Use Scope or Scope Checker. The existing analyze_scope API operation delegates to local processing.

## Contoh

Tanyakan informasi yang kurang untuk memastikan export-worker Example SaaS termasuk scope laboratorium.

## Hubungan dengan Feature Lain

Rules Engine menetapkan assessment final; AI tidak mengubah scope atau flags.

## Tips

Supplied rules are not independently verified. Use optional Research Assistant for interpretation requiring reasoning.
<a id="ai-techniques"></a>

# AI Technique Advisor

Status: Active

## Fungsi

Meranking teknik enabled yang tersedia berdasarkan context dan hard policy.

## Kenapa Feature Ini Penting

Membantu memilih invariant relevan tanpa menciptakan teknik di luar katalog target.

## Kapan Digunakan

Sesudah mapping atau saat memilih prioritas baru.

## Input

Operation recommend_techniques; enabled techniques, target/scope/actors/objects/boundaries/goal dan context riset.

## Output

recommendedTechniques: name, priority 0–100, reason, securityInvariant; researchPriority umum dan missing context.

## Cara Menggunakan

1. Technique Advisor atau pilih Operation di form AI.
2. Isi goal.
3. Preview → Send.
4. Review alasan dan pilih teknik manual di library.

## Contoh

Async Authorization dipertimbangkan karena Example SaaS memakai worker dengan perubahan membership.

## Hubungan dengan Feature Lain

Teknik kandidat dari Technique Library target aktif; dapat dilanjutkan ke Hypothesis Generator atau manual hypothesis.

## Tips

AI tidak otomatis mengaktifkan/mengubah skor technique. Jika AI mati, seluruh library/filter/sorting/manual selection tetap tersedia. Scope yang belum memadai membatasi rekomendasi.
<a id="ai-tools"></a>

# AI Tool Advisor

Status: Active

## Fungsi

Saran tools manual dari Tool KB yang sudah difilter policy dan technique relevance.

## Kenapa Feature Ini Penting

Menghubungkan pertanyaan pengujian dengan alat observasi yang sesuai.

## Kapan Digunakan

Sesudah memilih technique dan sebelum menyiapkan test manual.

## Input

Operation recommend_tools; technique context, target/scope/rules/mapping/goal. Backend membangun kandidat domain/tag dari teknik.

## Output

toolSuggestions dengan id/name/category/purpose/usageMode manual/whyUseful/scopeWarning; tool di luar kandidat dihapus.

## Cara Menggunakan

1. Tool Advisor → pilih technique context.
2. Jelaskan tujuan observasi.
3. Preview → Send.
4. Review mode manual/rules.
5. Gunakan tool eksternal sendiri bila dibolehkan.

## Contoh

Technique IDOR/BOLA → Burp Repeater sebagai replay manual → Authorization Matrix Builder sebagai helper internal.

## Hubungan dengan Feature Lain

Tool KB + Rules Engine → kandidat → AI ranking → filter output. Offline Tool Knowledge tetap tersedia tanpa AI.

## Tips

Relevance adalah domain/tag dan context supplied, bukan hasil discovery target. Tidak ada install/execute command. Tool yang punya automation tidak berarti seluruh kemampuan tersebut diizinkan.
<a id="ai-helper-advisor"></a>

# AI Helper Advisor

Status: Active

## Fungsi

Compatibility operation selecting relevant existing helpers from supplied records locally.

## Kenapa Feature Ini Penting

Mengarahkan peneliti ke fitur pencatatan atau review yang sesuai kebutuhan.

## Kapan Digunakan

Saat mapping, evidence preparation, atau review finding.

## Input

Operation recommend_helpers; target/mapping/research goal dan context.

## Output

Existing helper IDs/names matching mapped context, evidence and findings.

## Cara Menggunakan

Use Internal Helpers; recommend_helpers requires no model call.

## Contoh

State Transition Builder untuk active → revoked; Finding Checklist sebelum laporan export.

## Hubungan dengan Feature Lain

HELPER_KB membatasi nama; helper lokal menyediakan action sebenarnya.

## Tips

Selection does not execute a helper or create canonical records.
<a id="ai-questions"></a>

# AI Research Questions

Status: Active

## Fungsi

Menghasilkan pertanyaan riset dari mapping, invariant, dan missing context.

## Kenapa Feature Ini Penting

Membantu mengurai ketidakjelasan sebelum mengubahnya menjadi hypothesis.

## Kapan Digunakan

Saat mapping awal atau hasil test masih inconclusive.

## Input

Operation research_questions; target/scope/mapping/riset, goal/notes.

## Output

researchQuestions dan missingContext serta struktur umum AI.

## Cara Menggunakan

1. Pilih Research Questions.
2. Jelaskan ketidakjelasan.
3. Preview → Send.
4. Simpan pertanyaan relevan sebagai note/hypothesis manual.

## Contoh

Apakah worker Example SaaS mengecek membership saat enqueue atau execution?

## Hubungan dengan Feature Lain

Pertanyaan dapat mengarah ke Hypotheses/Test Cases/KB setelah peneliti mereview.

## Tips

Pertanyaan bukan bukti kegagalan dan tidak otomatis menjadi test atau checklist.
<a id="ai-hypothesis-generator"></a>

# AI Hypothesis Generator

Status: Active

## Fungsi

Menghasilkan draft hypothesis dari context dan technique kandidat.

## Kenapa Feature Ini Penting

Mempercepat ide pengujian yang tetap harus disesuaikan dengan scope dan fakta.

## Kapan Digunakan

Sesudah mapping/technique selection dan sebelum test.

## Input

Operation generate_hypotheses; goal/mapping, teknik enabled atau pilihan, scope/rules dan riwayat riset.

## Output

Draft title/technique/invariant/expectedBehavior/potentialFailure/enam dimensi; tombol Review Hypothesis membuka editor.

## Cara Menggunakan

1. Pilih Hypothesis Generator pada form AI.
2. Preview → Send.
3. Review Hypothesis.
4. Perbaiki field, simpan atau batal.
5. Buat test sendiri.

## Contoh

Draft Member revoked tidak memperoleh export worker Example SaaS dengan confidence awal low dan status idea pada editor.

## Hubungan dengan Feature Lain

Menerima context/techniques; editor membuat Hypotheses setelah Simpan. Offline helper memakai template tanpa AI.

## Tips

Menyimpan satu hypothesis tidak menandai batch suggestion accepted; status batch tetap pending sampai note/report diterima atau Reject. AI tidak menambah hypothesis sebelum persetujuan editor.
<a id="ai-findings"></a>

# AI Finding Analyzer

Status: Active

## Fungsi

Saran analisis invariant, class, root cause, impact, missing evidence dan safe validation.

## Kenapa Feature Ini Penting

Membantu mereview kelemahan argumen finding sebelum menyimpulkan atau melapor.

## Kapan Digunakan

Sesudah finding draft dan evidence disiapkan.

## Input

Operation analyze_finding; Finding context wajib; facts/formula/evidence metadata/text opt-in, related research dan goal.

## Output

findingAnalysis: assessment, potentialClass, brokenInvariant, potentialRootCause, falsePositiveChecks, missingEvidence, potentialImpact, duplicateRisk, safeValidation; priority/confidence umum.

## Cara Menggunakan

1. Finding Analyzer → pilih Finding context.
2. Sertakan evidence hanya jika sudah aman dan perlu.
3. Preview → Send.
4. Review saran dan validasi manual yang diizinkan.
5. Edit finding sendiri jika bukti mendukung.

## Contoh

AI dapat menduga worker memakai izin enqueue; peneliti tetap harus membuktikan waktu/revalidation pada Example SaaS.

## Hubungan dengan Feature Lain

Membaca selected finding dan context target aktif; tidak menulis facts/status/severity. Saran bisa disimpan sebagai note.

## Tips

Observed berarti fakta yang tercatat; Confirmed berarti kesimpulan yang sudah diverifikasi peneliti; Hypothesis berarti dugaan; Unknown berarti belum cukup data. Walau schema memuat empat label, backend saat ini memaksa generated finding assessment menjadi Hypothesis jika finding dipilih, atau Unknown jika tidak ada finding. AI tidak mengeluarkan konfirmasi otomatis.
<a id="ai-false-positive"></a>

# AI False Positive Analyzer

Status: Partial

## Fungsi

Mengusulkan alasan perilaku mungkin sah dan kontrol pembanding yang masih diperlukan.

## Kenapa Feature Ini Penting

Menguji penjelasan alternatif sebelum menganggap observasi sebagai vulnerability.

## Kapan Digunakan

Sesudah finding draft dan sebelum confirmation/report.

## Input

Operation false_positive_analysis; Finding context wajib; expected/actual/authority/ownership/context, goal/notes dan evidence opt-in.

## Output

falsePositiveChecks, missingEvidence, safeValidation dan assessment Hypothesis pada finding analysis.

## Cara Menggunakan

1. Pilih False Positive Analyzer dan finding.
2. Jelaskan role/ownership/timing.
3. Preview → Send.
4. Verifikasi checks manual dan catat hasilnya.

## Contoh

Periksa documented behavior, shared/public object, eventual consistency, supported role capability, atau capability export yang masih berlaku.

## Hubungan dengan Feature Lain

Membaca Findings/Evidence/context; hasil menjadi note dan rencana kontrol Test Cases.

## Tips

Partial: menghasilkan pertanyaan/draft, tidak men-fetch dokumentasi program atau menjalankan kontrol untuk membuktikan false positive. Finding Checklist offline memeriksa kelengkapan, bukan validitas.
<a id="ai-duplicate"></a>

# AI Duplicate Analyzer

Status: Partial

## Fungsi

Estimasi duplicate dari finding dan pembanding dalam context yang supplied.

## Kenapa Feature Ini Penting

Membantu meninjau kesamaan akar masalah dengan issue yang diketahui.

## Kapan Digunakan

Sesudah finding dan known issues/KB pembanding tersedia.

## Input

Operation duplicate_analysis; Finding context wajib; known issues, ringkasan finding target aktif, KB opt-in dengan rootCause/boundary/class/component/impact.

## Output

duplicateRisk Likely Unique/Possible Variant/Likely Duplicate/Unknown dalam findingAnalysis, confidence/missing context dan saran review.

## Cara Menggunakan

1. Masukkan Known Issues/KB pembanding.
2. Pilih Duplicate Analyzer dan finding.
3. Centang KB jika relevan.
4. Preview → Send.
5. Review persamaan lima unsur secara manual.

## Contoh

Bandingkan stale worker authority Example SaaS dengan report dummy yang memiliki root cause dan protected boundary sama.

## Hubungan dengan Feature Lain

Membaca context lokal supplied; berbeda dari helper Duplicate Comparator yang menghitung text similarity deterministik.

## Tips

Partial: tidak mencari seluruh internet/disclosed reports/target lain atau memutuskan duplicate program. Output adalah estimasi AI, bukan ambang similarity helper. Pembanding kosong seharusnya dinilai Unknown, bukan bukti unik.
<a id="ai-gaps"></a>

# AI Gap Analyzer

Status: Active

## Fungsi

Merged with deterministic recorded research coverage; the #ai-gaps link remains supported.

## Kenapa Feature Ini Penting

Membantu menanyakan actor/object/state/boundary atau lifecycle yang belum jelas.

## Kapan Digunakan

Saat merencanakan sesi baru setelah mencatat hasil test.

## Input

Operation gap_analysis; actor/object/boundary/technique/hypothesis/test context, goal/notes.

## Output

Recorded dimensions and untested mapped entries, without a model call.

## Cara Menggunakan

Dashboard -> Research Gaps. The gap_analysis operation uses the same local analyzer.

## Contoh

AI menyarankan membedakan execution worker dan download result setelah revoke pada Example SaaS.

## Hubungan dengan Feature Lain

Membaca context riset; tidak mengubah coverage lokal atau otomatis membuat test.

## Tips

Semantic research questions still belong in optional Research Assistant. Recorded counts are not security conclusions.
<a id="ai-report-assistant"></a>

# AI Report Assistant

Status: Active

## Fungsi

Draft perbaikan report yang dipreview dan diedit sebelum mengganti Markdown tersimpan.

## Kenapa Feature Ini Penting

Membantu kejelasan tulisan tanpa mengubah keputusan faktual peneliti secara otomatis.

## Kapan Digunakan

Sesudah report awal dan finding/evidence direview.

## Input

Operation improve_report; Finding context wajib; reportMarkdown saat ini atau template jika belum ada; facts dan evidence opt-in.

## Output

reportDraft, tombol Preview / Edit Report Draft; Save memperbarui reportMarkdown sumber dan menandai suggestion accepted.

## Cara Menggunakan

1. Pilih Report Assistant dan finding.
2. Preview context termasuk draft.
3. Send → baca reportDraft.
4. Preview / Edit Report Draft.
5. Pastikan fakta/severity tidak berubah; Simpan atau Batal.

## Contoh

Perbaiki alur penjelasan enqueue/revoke/execute pada laporan Example SaaS sambil mempertahankan severity Unknown.

## Hubungan dengan Feature Lain

Membaca Findings/Reports; acceptance hanya mengganti Markdown, bukan fields fakta/status/severity finding.

## Tips

Model tetap dapat mengarang narasi meskipun prompt melarangnya; review setiap klaim. Bila finding sumber sudah dihapus, draft tidak dapat diterapkan ke finding tersebut.
<a id="ai-evidence-summary"></a>

# AI Evidence Summarizer

Status: Active

## Fungsi

Ringkasan/analisis evidence yang disertakan melalui context opt-in.

## Kenapa Feature Ini Penting

Membantu merangkum observasi panjang menjadi note yang bisa direview.

## Kapan Digunakan

Sesudah evidence redacted dan sebelum analisis/report.

## Input

Operation evidence_summary; Include evidence text, finding opsional, goal dan teks evidence terkait/seluruh target sesuai pilihan.

## Output

Saran naratif dalam structured result, terutama findingAnalysis/safeNextSteps/missingContext bila relevan. Tidak ada field terpisah evidenceSummary atau artifact ringkasan otomatis.

## Cara Menggunakan

1. Pilih Evidence Summarizer.
2. Centang evidence dan pilih finding jika ingin membatasi relasi.
3. Preview seluruh teks.
4. Send; review lalu simpan note yang relevan.

## Contoh

Ringkas log timing export dummy Example SaaS tanpa memasukkan token session.

## Hubungan dengan Feature Lain

Membaca Evidence text; Accept/Edit Note menyimpan ringkasan pilihan peneliti ke Notes.

## Tips

Bukan pembaca screenshot/video/path binary atau parser HAR. Jika evidence opt-in off, model tidak menerima evidence text. Output selalu memakai schema umum, bisa tidak mengisi bagian tertentu.
<a id="ai-safe-next-steps"></a>

# AI Safe Next Steps

Status: Active

## Fungsi

Draft tindakan tindak lanjut yang dibatasi scope/rules dan stop conditions.

## Kenapa Feature Ini Penting

Membantu memperjelas langkah review berikutnya tanpa eksekusi target.

## Kapan Digunakan

Ketika hasil inconclusive atau missing evidence masih ada.

## Input

Operation safe_next_steps; scope/rules, goal, test/finding context yang relevan.

## Output

safeNextSteps, avoid, stopConditions dan missingContext.

## Cara Menggunakan

1. Pilih Safe Next Steps.
2. Jelaskan hambatan.
3. Preview → Send.
4. Review izin aktual sebelum mengubah rencana manual.

## Contoh

Lengkapi bukti revoke efektif pada laboratorium Example SaaS sebelum mengulang satu test terkontrol.

## Hubungan dengan Feature Lain

Rules filter membatasi saran; peneliti memperbarui Notes/Hypotheses/Tests manual.

## Tips

Nama safe bukan jaminan seluruh saran valid. Jika scope belum lengkap, backend mengganti next steps dengan permintaan melengkapi scope/izin/data.
<a id="ai-restrictions"></a>

# AI Restrictions

Status: Active

## Fungsi

Compatibility operation that returns recorded hard rules locally, without a provider call.

## Kenapa Feature Ini Penting

Membantu memeriksa batas yang mungkin terlupakan ketika menyusun test.

## Kapan Digunakan

Sebelum test dan setiap rules/arsitektur berubah.

## Input

Operation identify_restrictions; scope testing/automation rules, flags, rate limits, safe harbor dan research goal.

## Output

Recorded policy restrictions and manual review limits.

## Cara Menggunakan

Use Scope and its recorded restrictions. The identify_restrictions operation remains compatible.

## Contoh

Example SaaS: manual only, no third-party testing, stop jika data bukan milik peneliti.

## Hubungan dengan Feature Lain

Rules Engine mempertahankan prioritas program rules; tidak mengubah flags.

## Tips

No legal guarantee, policy fetching or model-generated permission.
<a id="ai-review"></a>

# AI Suggestions — Preview, Accept, Edit, Reject

Status: Active

## Fungsi

Review eksplisit suggestion pending sebelum diterapkan sebagai note, hypothesis, atau report.

## Kenapa Feature Ini Penting

Memisahkan draft model dari keputusan dan fakta yang disimpan peneliti.

## Kapan Digunakan

Sesudah setiap request AI yang berhasil.

## Input

Output JSON valid, operation/sourceFindingId/provider/privacy/timestamp; keputusan peneliti dan edit content.

## Output

Suggestion pending/accepted/rejected; Notes hasil Accept/Edit; Hypotheses setelah editor Save; reportMarkdown setelah Review Report Save; suggestion dapat dihapus.

## Cara Menggunakan

1. Baca structured preview/status/priority/confidence.
2. Reject bila tidak relevan.
3. Accept as Research Note atau Edit / Accept Note bila ingin menyimpan.
4. Review Hypothesis untuk membuat record yang diperiksa.
5. Preview/Edit Report Draft untuk menerapkan draft ke finding sumber.

## Contoh

AI draft tentang izin worker Example SaaS belum mengubah hypothesis/finding; peneliti melengkapi invariant/formula di editor lalu Simpan.

## Hubungan dengan Feature Lain

Schema validator frontend/backend memvalidasi data; storage menyimpan suggestion; Notes/Hypotheses/Reports menerima hasil yang disetujui.

## Tips

Accept Note menandai batch accepted, bukan membuktikan rekomendasi benar. Review Hypothesis Save tidak menandai batch accepted. Tidak ada auto update facts/severity/rules/confirmed. Error provider/JSON menghasilkan pesan dan workflow manual tetap tersedia.
<a id="search"></a>

# Global Search dan List Filters

Status: Active

## Fungsi

Pencarian lintas target dan domain untuk research, profil bisnis, terminology, business flows, invariants, failure patterns, related techniques, KB dan lessons.

## Kenapa Feature Ini Penting

Menemukan catatan lama dan menyempitkan review tanpa mengganti data.

## Kapan Digunakan

Ketika jumlah catatan bertambah atau mencari observasi tertentu.

## Input

Global query teks; filter target hasil; query/status/technique/actor/object/severity/category sesuai daftar modul.

## Output

Tombol hasil dengan nama target/jenis/status; navigasi target dan modul hasil; daftar modul yang difilter.

## Cara Menggunakan

1. Ketik pada search global di header.
2. Pilih target filter jika perlu.
3. Klik hasil untuk berpindah target/modul.
4. Gunakan search/filter lokal untuk menyempitkan daftar.
5. Kosongkan search untuk kembali.

## Contoh

Cari revoke untuk menemukan hypothesis dan test Example SaaS lintas target; filter finding berdasarkan Unknown atau P1–P5.

## Hubungan dengan Feature Lain

Membaca research dan KB seluruh workspace serta curated/custom domain packs; relasi flow menghubungkan hasil glossary dengan invariant dan technique mapping.

## Tips

Global Search dibatasi 200 hasil; evidence mentah, actors dan objects tidak diindeks sebagai koleksi mandiri. Hasil menuju modul, tanpa highlight/deep link record tertentu. Query daftar lokal diterapkan saat change, misalnya Enter/blur; filter bisa tetap tersimpan selama target belum berubah.
<a id="workspace-storage"></a>

# Workspace Storage dan Autosave

Status: Active

## Fungsi

IndexedDB sebagai autosave utama, journal recovery opsional, dan JSON portabel schema v2.

## Kenapa Feature Ini Penting

Mempertahankan catatan lokal serta mendukung recovery/migrasi dan perpindahan origin.

## Kapan Digunakan

Otomatis ketika mengubah data; export sebelum pindah browser/origin.

## Input

Seluruh target/koleksi riset; schemaVersion 2.0.0, applicationVersion 2.0.0 dan timestamps.

## Output

Snapshot IndexedDB; indikator Unsaved/Saving/Saved locally/error dan Last saved; journal localStorage opsional; migrasi v1 mempertahankan IDs/content.

## Cara Menggunakan

1. Buat/edit catatan.
2. Tunggu Saved locally.
3. Jika error, export snapshot memory sebagai backup.
4. Import backup jika pindah origin.
5. Hindari pengeditan concurrent di beberapa tab.

## Contoh

Example SaaS dapat direload pada origin sama; berpindah file:// ke http://127.0.0.1:3001 memerlukan export/import jika storage berbeda.

## Hubungan dengan Feature Lain

Semua mutations jadwalkan autosave debounce; Backup mengekspor current workspace; legacy localStorage v1 dipertahankan sesudah migrasi.

## Tips

Tidak terenkripsi, tidak sync cloud/multiuser, tidak merge konflik tab. IndexedDB = autosave lokal; workspace.json = backup portabel, tidak dibaca/ditulis root otomatis. Recovery journal opsional tidak menggantikan backup. Startup error tidak otomatis menimpa data lama; hindari perubahan sebelum recovery/backup diperiksa.
<a id="backup"></a>

# Backup / Restore

Status: Active

## Fungsi

Export/import seluruh workspace JSON dengan validasi dan konfirmasi penggantian.

## Kenapa Feature Ini Penting

Menghindari kehilangan data browser dan membuat riset dapat dipindahkan.

## Kapan Digunakan

Rutin, sebelum reset/import, atau ketika berpindah origin/profil browser.

## Input

Workspace aktif untuk Export; file JSON v1/v2 maksimal 20 MB untuk Import.

## Output

workspace.json atau backup-YYYY-MM-DD.json; workspace diganti jika valid dan dikonfirmasi; JSON invalid ditolak tanpa perubahan.

## Cara Menggunakan

1. Export Workspace/Export Backup; simpan file.
2. Backup data aktif sebelum restore.
3. Import Workspace/Import Backup → pilih JSON.
4. Review jumlah target dan konfirmasi replace.
5. Tunggu saved; periksa finding/report.

## Contoh

Backup Example SaaS membawa seluruh target, evidence text/metadata, KB, helper rows, AI suggestions dan report drafts.

## Hubungan dengan Feature Lain

Header Export/Import dan halaman Backup memakai actions yang sama; validation/migration dilakukan sebelum store.replace.

## Tips

Import bukan merge. Screenshot/video binary tidak ikut; simpan terpisah. JSON plaintext perlu dilindungi. Export membaca snapshot memory saat itu; tetap periksa indikator storage untuk durability lokal. Hanya schema v1/v2 yang didukung; invalid refs/duplicate IDs ditolak.
<a id="connected-file"></a>

# Connect workspace.json — Optional File Save

Status: Active

## Fungsi

Menghubungkan file pilihan browser dan menulis workspace saat action Save eksplisit.

## Kenapa Feature Ini Penting

Menyediakan backup ke file yang sama tanpa menganggap autosave browser sebagai filesystem save.

## Kapan Digunakan

Jika browser/context mendukung File System Access API.

## Input

File handle dari native picker dan workspace aktif saat Save.

## Output

File JSON ditulis hanya pada Save to workspace.json; handle disimpan memory selama session.

## Cara Menggunakan

1. Settings/Backup → Connect workspace.json.
2. Pilih lokasi melalui dialog browser.
3. Tekan Save to workspace.json.
4. Hubungkan ulang sesudah reload.

## Contoh

Simpan snapshot Example SaaS ke file backup pilihan Anda sesudah satu sesi riset.

## Hubungan dengan Feature Lain

Menggunakan snapshot store yang sama dengan Export; IndexedDB autosave tetap terpisah.

## Tips

Connect bukan import/read-existing-file dan tidak autosave filesystem. Save dapat menimpa file yang dipilih; perhatikan native picker. Jika API tidak tersedia, gunakan download Export biasa.
<a id="reset"></a>

# Reset Workspace

Status: Active

## Fungsi

Mengosongkan seluruh target dan riset workspace browser aktif setelah konfirmasi.

## Kenapa Feature Ini Penting

Memulai workspace baru ketika peneliti sudah menyimpan backup yang diperlukan.

## Kapan Digunakan

Hanya ketika ingin menghapus seluruh data workspace aktif.

## Input

Keputusan peneliti melalui Reset Workspace dan konfirmasi dialog.

## Output

Fresh workspace tanpa target, tersimpan melalui autosave. Backup download dan legacy v1 tidak ikut dihapus.

## Cara Menggunakan

1. Export Backup terlebih dahulu dan periksa file.
2. Settings/Backup → Reset Workspace.
3. Baca peringatan seluruh koleksi.
4. Konfirmasi hanya jika siap kehilangan workspace aktif.

## Contoh

Setelah laboratorium Example SaaS selesai, backup lalu reset sebelum latihan baru.

## Hubungan dengan Feature Lain

Menghapus target/hypothesis/test/finding/evidence/knowledge/helper/suggestion/note/report aktif; Backup digunakan untuk restore.

## Tips

PERINGATAN: reset menghapus semua target, bukan hanya CURRENT TARGET. Tidak ada Undo bawaan; restore memerlukan backup. Ini bukan secure erase file binary/download atau legacy storage.
<a id="in-app-help"></a>

# Contextual Help dan Documentation

Status: Active

## Fungsi

Tombol ? dengan tooltip singkat, penjelasan purpose/status, dan View Documentation.

## Kenapa Feature Ini Penting

Membantu pengguna belajar fitur dari tempat mereka sedang bekerja.

## Kapan Digunakan

Saat membuka menu/operation/helper yang belum dipahami.

## Input

Route aktif, helper/operation pilihan dan metadata featureRegistry.

## Output

Dialog help dan tautan langsung ke bagian referensi; halaman HTML dokumentasi lokal dengan daftar isi dan navigasi lima panduan.

## Cara Menggunakan

1. Arahkan pointer ke ? untuk tooltip.
2. Klik ? untuk description/purpose/status.
3. View Documentation membuka bagian yang sesuai.
4. Ikuti tautan User Guide/Workflow Guide bila perlu.

## Contoh

Pada Trust Boundaries, ? menjelaskan perpindahan trust/authority dan membuka referensi boundary.

## Hubungan dengan Feature Lain

Metadata bersama menghasilkan UI help, status, dan Feature Reference. Seluruh menu, helper, dan operasi AI mempunyai entry.

## Tips

Dokumentasi HTML dibundel lokal dan tidak membutuhkan cloud atau fetch file://. Markdown tetap tersedia pada docs/ untuk dibaca langsung. Tidak ada fitur scanner atau approval eksternal yang tersembunyi dalam bantuan.
<a id="target-intelligence"></a>

# Target Intelligence

Status: Active

## Fungsi

Profil bisnis target, klasifikasi sektor multi-domain, knowledge provenance, dan review saran.

## Kenapa Feature Ini Penting

Membantu memahami bisnis sebelum menyusun pengujian teknologi.

## Kapan Digunakan

Sesudah Create Target dan sebelum mapping/technique selection.

## Input

Company/Organization, Sector, Industry, Business Model, Company Type, Products, Services, Users, Customer Types, Revenue Model, Important Assets, Sensitive Data, Critical Operations, Dependencies, Technical Surfaces, Notes; primary sector dan secondary domains.

## Output

Profil RESEARCHER INPUT, klasifikasi eksplisit, ringkasan domain, accepted knowledge, AI suggestions terpisah; field kosong Unknown.

## Cara Menggunakan

1. Target Intelligence → Edit Intelligence Profile.
2. Pilih Primary Sector/Secondary Domains dan Save Domain Classification.
3. Learn This Domain.
4. Review domain/AI knowledge.
5. Import actors/objects atau Convert to Hypothesis melalui editor.

## Contoh

Example Finance memilih Finance primary dan Fintech secondary; company/business model dari catatan laboratorium sendiri, bukan tebakan brand.

## Hubungan dengan Feature Lain

Menyimpan target.intelligence; terhubung Domain Knowledge, glossary, flows, invariant, questions, research models, AI context dan backup.

## Tips

Profil tidak diisi otomatis dari nama perusahaan. Company overview AI menjadi Unknown tanpa TARGET FACT terverifikasi dalam context. Accept tidak membuktikan kebenaran. Tidak ada browsing perusahaan otomatis atau pembuatan finding dari knowledge.
<a id="domain-knowledge"></a>

# Domain Knowledge Packs dan Learning Mode

Status: Active

## Fungsi

13 pack generik lokal, custom/override packs, dan materi Beginner/Intermediate/Advanced.

## Kenapa Feature Ini Penting

Menghubungkan istilah, pelaku, resource, flow, invariant, dan teknik secara terstruktur.

## Kapan Digunakan

Sebelum testing dan ketika sektor bisnis belum familiar.

## Input

Knowledge Domain pilihan; Learn This Domain; learning depth; Custom Pack fields atau JSON valid; import file maksimal 1 MB.

## Output

Overview, terminology, actors, objects, flow, assets, boundaries, invariants, patterns, mapping; override/custom tersimpan pada root domainPacks workspace.

## Cara Menggunakan

1. Pilih domain.
2. Learn This Domain dan depth.
3. Browse Full Pack untuk membuka section lain.
4. Review/Import actor/object.
5. + Custom Domain Pack atau Edit Pack JSON.
6. Edit Flow Relationships dan tambah Technique Mapping bila diperlukan.

## Contoh

Finance menyediakan Account/Ledger/Settlement/Reconciliation dan flow generik transfer. SaaS menyediakan tenancy/membership/resource sharing.

## Hubungan dengan Feature Lain

Pack data ada di data/domains; bundled untuk file://. Global Search membaca pack. Selected domain/flow/term menjadi context AI opsional.

## Tips

Domain knowledge bukan fakta target atau vulnerability. Learning manual tetap aktif tanpa AI. Custom form membuat entri dasar; advanced boundary/question/relationships dapat diedit melalui JSON atau flow relationship editor. Mengedit pack default membuat override workspace; tidak mengubah file static. Restore Default menghapus override, bukan snapshot riset.
<a id="terminology"></a>

# Domain Terminology

Status: Active

## Fungsi

Glossary domain dengan definition, whyImportant, related terms dan provenance.

## Kenapa Feature Ini Penting

Mencegah salah menafsirkan proses bisnis sebelum merancang test.

## Kapan Digunakan

Saat belajar sektor dan meninjau konsep yang muncul dalam flow.

## Input

Knowledge Domain dan Search Terminology; term dipilih untuk Explain Terminology AI bila aktif.

## Output

Kartu istilah, definisi Indonesia, kaitan istilah, confidence/source; Finance mempunyai 22 istilah awal.

## Cara Menggunakan

1. Terminology → pilih Finance.
2. Cari Settlement atau Reconciliation.
3. Baca definition/whyImportant/related terms.
4. Ask / Explain Term memilih term pada form AI; preview/send tetap diperlukan.

## Contoh

Ledger adalah catatan pembukuan; Balance adalah posisi saldo; Available Balance adalah bagian yang tersedia setelah pembatasan. Settlement berbeda dari Clearing.

## Hubungan dengan Feature Lain

Glossary dari domain pack; Global Search juga menampilkan flow/invariant/technique yang terkait melalui flow text.

## Tips

Definisi generik harus dibandingkan dengan istilah produk aktual. Materi keuangan bukan nasihat transaksi/kepatuhan. Explain Terminology tidak memanggil provider sebelum preview/send.
<a id="business-flows"></a>

# Business Flows dan Critical Transitions

Status: Active

## Fungsi

Flow bisnis terstruktur dengan actor/object/boundary/invariant relationships dan transisi kritis.

## Kenapa Feature Ini Penting

Mengubah proses bisnis menjadi pertanyaan keamanan yang mempunyai konteks.

## Kapan Digunakan

Sesudah memilih domain, sebelum hypothesis dan test.

## Input

Selected domain, flow steps, actor/object/boundary/invariant IDs; transition pilihan; Mark/Unmark Critical; Edit Flow Relationships.

## Output

Diagram teks flow, relationship list, critical transition, mapped techniques; review question atau draft hypothesis dengan knowledgeLinks.

## Cara Menggunakan

1. Business Flows → baca langkah.
2. Pilih transition.
3. Review tanda CRITICAL.
4. Edit Flow Relationships untuk melengkapi kaitan.
5. Flow → Invariant → Question menyimpan hanya setelah review.
6. Flow → Hypothesis membuka editor riset.

## Contoh

Finance: Create Transfer → Authorization → Ledger Update → Settlement → Reconciliation. Tanyakan apakah authority masih berlaku ketika execution terjadi.

## Hubungan dengan Feature Lain

Sector → Flow → Actor/Object → Boundary → Invariant → Technique → Hypothesis → Test → Finding. knowledgeLinks diteruskan sepanjang promotion.

## Tips

Flow generik bukan proses target yang terbukti. Konversi tidak menjalankan test. Flow AI diterima sebagai draft dengan steps dan provenance; critical transition/invariant untuk flow tersebut harus direview peneliti. Editing hubungan memperbarui override pack, bukan source static.
<a id="critical-assets"></a>

# Critical Assets dan Sensitive Data

Status: Active

## Fungsi

Asset/data bernilai tinggi dari pola domain dan knowledge target yang direview.

## Kenapa Feature Ini Penting

Membantu menjelaskan resource terlindungi serta dampak yang perlu dibuktikan.

## Kapan Digunakan

Saat mapping ownership/authority dan memilih research questions.

## Input

Pack criticalAssets/sensitiveData, target profile, accepted item kind asset/sensitive-data.

## Output

Kartu sumber/confidence, preview generik dan review/save knowledge.

## Cara Menggunakan

1. Critical Assets → pilih domain.
2. Baca resource dan sensitivitas.
3. Review / Save Knowledge bila relevan.
4. Lengkapi Objects dan test scope manual.

## Contoh

Account, Ledger Entry, API Credential pada finance adalah kandidat asset bernilai tinggi; belum berarti target memiliki implementasi tertentu.

## Hubungan dengan Feature Lain

Domain Pack/Target Knowledge → mapping Objects → Hypotheses/Tests → evidence/impact finding.

## Tips

Daftar generik tidak memvalidasi kepemilikan atau sensitivitas aktual. Dummy data diperlukan dalam latihan; jangan menyimpan secret karena label asset terlihat umum.
<a id="research-questions"></a>

# Domain Research Questions dan Invariant Conversion

Status: Active

## Fungsi

Pertanyaan domain/target yang dapat direview lalu dikonversi menjadi hypothesis.

## Kenapa Feature Ini Penting

Mengubah pemahaman bisnis menjadi rencana investigasi yang terarah.

## Kapan Digunakan

Sesudah flow/invariant dipahami dan sebelum manual authorized testing.

## Input

Domain researchQuestions, accepted question/invariant, invariant/flow/technique relationships, formula dan scope yang diisi peneliti.

## Output

Kartu pertanyaan dan editable hypothesis draft; record baru hanya sesudah Simpan.

## Cara Menggunakan

1. Research Questions → baca question/invariant.
2. Review / Save Knowledge bila perlu.
3. Convert to Hypothesis.
4. Isi actor/object/state/authority/expected.
5. Simpan → Buat Test Case.

## Contoh

Apakah revoked beneficiary masih dapat dipakai? Bagaimana worker settlement memvalidasi authority terbaru? Ini pertanyaan generik, bukan temuan.

## Hubungan dengan Feature Lain

Flows/Domain Invariants/AI → Questions → existing Hypothesis Engine; knowledgeLinks memuat domain, flow, invariant, question dan sourceType.

## Tips

Hypothesis tidak otomatis confirmed dan confidence awal tetap low. Jika invariant/mapping belum ada, isi sendiri saat review. Tidak ada evidence atau finding yang dibuat otomatis.
<a id="knowledge-provenance"></a>

# Knowledge Provenance dan Verification

Status: Active

## Fungsi

Memisahkan TARGET FACT, DOMAIN KNOWLEDGE, RESEARCHER INPUT, AI INFERENCE dan UNKNOWN.

## Kenapa Feature Ini Penting

Mencegah inferensi perusahaan menjadi fakta hanya karena diterima ke workspace.

## Kapan Digunakan

Pada setiap profile, domain item, AI suggestion dan imported research record.

## Input

sourceType researcher/target/domain/ai/external/unknown; source, confidence 0–1, verified, notes; explicit verification source dan konfirmasi peneliti.

## Output

Badge sumber/confidence/verified; AI GENERATED origin dipertahankan ketika peneliti memverifikasi item menjadi target fact.

## Cara Menggunakan

1. Baca badge dan source.
2. Accept/Edit menyimpan draft tanpa verifikasi.
3. Verify as Target Fact hanya setelah memeriksa sumber.
4. Isi reference dan konfirmasi eksplisit.
5. Edit content menurunkan verifikasi dan perlu review ulang.

## Contoh

API key sensitif = domain knowledge. Target menyediakan API = target fact hanya bila source/verifikasi ada. Worker mungkin async = AI inference.

## Hubungan dengan Feature Lain

Profile/Domain/Accepted Items/Actors/Objects/Boundaries/AI context/Backup menggunakan provenance.

## Tips

Verified adalah pernyataan peneliti, bukan verifikasi independen software. AI schema menolak source target/verified true. TARGET FACT tanpa source atau verified ditolak. Imported packs boleh merepresentasikan fakta yang diverifikasi peneliti, tetapi tidak berasal dari konfirmasi model otomatis.
<a id="knowledge-ai"></a>

# AI Knowledge Assistant

Status: Active

## Fungsi

11 operasi knowledge opsional dengan context pilihan, preview/redaksi, output JSON dan review per item.

## Kenapa Feature Ini Penting

Membantu memahami bisnis tanpa mengarang fakta atau menjalankan pengujian.

## Kapan Digunakan

Sesudah membuat target dan memilih domain; untuk penjelasan, pertanyaan dan saran draft.

## Input

Operation; selected domain/term/flow; Question/Goal; Notes; Learning Depth; current hypothesis opsional; privacy mode. Backend/provider config existing.

## Output

items dengan kind/title/content/sourceType/confidence/notes/relations/steps; suggestedDomains; unknownInformation. Semua AI items unverified dan inference/unknown.

## Cara Menggunakan

1. Pilih operation pada form AI Knowledge Assistant.
2. Pilih term/flow/hypothesis yang relevan.
3. Preview Knowledge Context.
4. Send Knowledge Analysis.
5. Accept/Edit/Reject item atau review sector.
6. Import/Convert lewat editor terpisah.

## Contoh

Generate Target Knowledge untuk Example Finance menyarankan pola Finance supplied; Company Overview tetap Unknown tanpa target fact terverifikasi.

## Hubungan dengan Feature Lain

Shared localhost/config/provider/redactor/policy dengan AI lama, tetapi endpoint/schema knowledge terpisah. Selected knowledge juga dapat masuk Research Assistant lama melalui opt-in Include Knowledge Base.

## Tips

Tidak ada browsing perusahaan otomatis, provider model default, execution tool, severity atau finding auto. AI_DISABLED tidak menginisialisasi provider; seluruh knowledge manual aktif. Context hanya satu selected pack lengkap terbatas, label katalog domain, capped target knowledge/mapping dan satu hypothesis; bukan seluruh database. Provider nyata belum dibuktikan oleh mock tests.
<a id="knowledge-op-generate_target_knowledge"></a>

# Generate Target Knowledge

Status: Active

## Fungsi

Menyusun draft overview, actors/objects/flows/invariants/questions dari context.

## Kenapa Feature Ini Penting

Membantu peneliti memahami context bisnis sambil menjaga provenance.

## Kapan Digunakan

Sebelum mapping riset target.

## Input

Selected target/domain/term/flow, profile/accepted knowledge dengan provenance, scope/rules, Question/Notes, learning depth, current hypothesis opsional; privacy mode.

## Output

items berjenis overview/model/actor/object/asset/data/flow/term/boundary/invariant/question dan unknownInformation.

## Cara Menggunakan

1. Pilih Operation Generate Target Knowledge.
2. Isi context relevan.
3. Preview Knowledge Context → Send Knowledge Analysis.
4. Review confidence/Unknown.
5. Accept/Edit/Reject; penerapan ke model riset membutuhkan editor terpisah.

## Contoh

Gunakan Example Finance dan domain Finance untuk latihan. Architecture/roles yang tidak supplied tidak boleh dianggap confirmed.

## Hubungan dengan Feature Lain

AI Knowledge Assistant → Target Intelligence → existing mapping/hypothesis workflow setelah persetujuan.

## Tips

Output memakai schema knowledge yang sama; bagian yang tidak relevan dapat kosong. Tidak ada fetch perusahaan atau eksekusi test. Accept bukan verifikasi fakta.
<a id="knowledge-op-analyze_target"></a>

# Analyze Target

Status: Active

## Fungsi

Menganalisis hubungan bisnis dan context target yang supplied.

## Kenapa Feature Ini Penting

Membantu peneliti memahami context bisnis sambil menjaga provenance.

## Kapan Digunakan

Saat profil target mulai lengkap.

## Input

Selected target/domain/term/flow, profile/accepted knowledge dengan provenance, scope/rules, Question/Notes, learning depth, current hypothesis opsional; privacy mode.

## Output

Penjelasan, missing/unknown informasi dan pertanyaan review.

## Cara Menggunakan

1. Pilih Operation Analyze Target.
2. Isi context relevan.
3. Preview Knowledge Context → Send Knowledge Analysis.
4. Review confidence/Unknown.
5. Accept/Edit/Reject; penerapan ke model riset membutuhkan editor terpisah.

## Contoh

Gunakan Example Finance dan domain Finance untuk latihan. Architecture/roles yang tidak supplied tidak boleh dianggap confirmed.

## Hubungan dengan Feature Lain

AI Knowledge Assistant → Target Intelligence → existing mapping/hypothesis workflow setelah persetujuan.

## Tips

Output memakai schema knowledge yang sama; bagian yang tidak relevan dapat kosong. Tidak ada fetch perusahaan atau eksekusi test. Accept bukan verifikasi fakta.
<a id="knowledge-op-suggest_domains"></a>

# Suggest Domain

Status: Active

## Fungsi

Menyarankan klasifikasi dari label domain yang tersedia.

## Kenapa Feature Ini Penting

Membantu peneliti memahami context bisnis sambil menjaga provenance.

## Kapan Digunakan

Sebelum menentukan sektor utama.

## Input

Selected target/domain/term/flow, profile/accepted knowledge dengan provenance, scope/rules, Question/Notes, learning depth, current hypothesis opsional; privacy mode.

## Output

suggestedDomains dengan reason/confidence; klasifikasi akhir harus disetujui peneliti.

## Cara Menggunakan

1. Pilih Operation Suggest Domain.
2. Isi context relevan.
3. Preview Knowledge Context → Send Knowledge Analysis.
4. Review confidence/Unknown.
5. Accept/Edit/Reject; penerapan ke model riset membutuhkan editor terpisah.

## Contoh

Gunakan Example Finance dan domain Finance untuk latihan. Architecture/roles yang tidak supplied tidak boleh dianggap confirmed.

## Hubungan dengan Feature Lain

AI Knowledge Assistant → Target Intelligence → existing mapping/hypothesis workflow setelah persetujuan.

## Tips

Output memakai schema knowledge yang sama; bagian yang tidak relevan dapat kosong. Tidak ada fetch perusahaan atau eksekusi test. Accept bukan verifikasi fakta.
<a id="knowledge-op-explain_domain"></a>

# Explain Domain

Status: Active

## Fungsi

Menjelaskan domain menurut kedalaman belajar.

## Kenapa Feature Ini Penting

Membantu peneliti memahami context bisnis sambil menjaga provenance.

## Kapan Digunakan

Saat mempelajari sektor baru.

## Input

Selected target/domain/term/flow, profile/accepted knowledge dengan provenance, scope/rules, Question/Notes, learning depth, current hypothesis opsional; privacy mode.

## Output

Kartu penjelasan concepts/actor/object/flow/invariant, bukan fakta target.

## Cara Menggunakan

1. Pilih Operation Explain Domain.
2. Isi context relevan.
3. Preview Knowledge Context → Send Knowledge Analysis.
4. Review confidence/Unknown.
5. Accept/Edit/Reject; penerapan ke model riset membutuhkan editor terpisah.

## Contoh

Gunakan Example Finance dan domain Finance untuk latihan. Architecture/roles yang tidak supplied tidak boleh dianggap confirmed.

## Hubungan dengan Feature Lain

AI Knowledge Assistant → Target Intelligence → existing mapping/hypothesis workflow setelah persetujuan.

## Tips

Output memakai schema knowledge yang sama; bagian yang tidak relevan dapat kosong. Tidak ada fetch perusahaan atau eksekusi test. Accept bukan verifikasi fakta.
<a id="knowledge-op-explain_terminology"></a>

# Explain Terminology

Status: Active

## Fungsi

Menjelaskan term pilihan dan kaitan bisnis/keamanannya.

## Kenapa Feature Ini Penting

Membantu peneliti memahami context bisnis sambil menjaga provenance.

## Kapan Digunakan

Ketika glossary belum cukup jelas.

## Input

Selected target/domain/term/flow, profile/accepted knowledge dengan provenance, scope/rules, Question/Notes, learning depth, current hypothesis opsional; privacy mode.

## Output

Item terminology/explanation berlabel AI inference.

## Cara Menggunakan

1. Pilih Operation Explain Terminology.
2. Isi context relevan.
3. Preview Knowledge Context → Send Knowledge Analysis.
4. Review confidence/Unknown.
5. Accept/Edit/Reject; penerapan ke model riset membutuhkan editor terpisah.

## Contoh

Gunakan Example Finance dan domain Finance untuk latihan. Architecture/roles yang tidak supplied tidak boleh dianggap confirmed.

## Hubungan dengan Feature Lain

AI Knowledge Assistant → Target Intelligence → existing mapping/hypothesis workflow setelah persetujuan.

## Tips

Output memakai schema knowledge yang sama; bagian yang tidak relevan dapat kosong. Tidak ada fetch perusahaan atau eksekusi test. Accept bukan verifikasi fakta.
<a id="knowledge-op-ask_about_target"></a>

# Ask About Target

Status: Active

## Fungsi

Menjawab question dari target knowledge, domain dan context riset.

## Kenapa Feature Ini Penting

Membantu peneliti memahami context bisnis sambil menjaga provenance.

## Kapan Digunakan

Ketika ada pertanyaan bisnis tertentu.

## Input

Selected target/domain/term/flow, profile/accepted knowledge dengan provenance, scope/rules, Question/Notes, learning depth, current hypothesis opsional; privacy mode.

## Output

Explanation dan unknownInformation dengan source/confidence.

## Cara Menggunakan

1. Pilih Operation Ask About Target.
2. Isi context relevan.
3. Preview Knowledge Context → Send Knowledge Analysis.
4. Review confidence/Unknown.
5. Accept/Edit/Reject; penerapan ke model riset membutuhkan editor terpisah.

## Contoh

Gunakan Example Finance dan domain Finance untuk latihan. Architecture/roles yang tidak supplied tidak boleh dianggap confirmed.

## Hubungan dengan Feature Lain

AI Knowledge Assistant → Target Intelligence → existing mapping/hypothesis workflow setelah persetujuan.

## Tips

Output memakai schema knowledge yang sama; bagian yang tidak relevan dapat kosong. Tidak ada fetch perusahaan atau eksekusi test. Accept bukan verifikasi fakta.
<a id="knowledge-op-analyze_business_flow"></a>

# Analyze Business Flow

Status: Active

## Fungsi

Menganalisis flow pilihan dan critical transitions.

## Kenapa Feature Ini Penting

Membantu peneliti memahami context bisnis sambil menjaga provenance.

## Kapan Digunakan

Sebelum invariant/hypothesis.

## Input

Selected target/domain/term/flow, profile/accepted knowledge dengan provenance, scope/rules, Question/Notes, learning depth, current hypothesis opsional; privacy mode.

## Output

Flow/boundary/invariant/question drafts; bukan proses perusahaan confirmed.

## Cara Menggunakan

1. Pilih Operation Analyze Business Flow.
2. Isi context relevan.
3. Preview Knowledge Context → Send Knowledge Analysis.
4. Review confidence/Unknown.
5. Accept/Edit/Reject; penerapan ke model riset membutuhkan editor terpisah.

## Contoh

Gunakan Example Finance dan domain Finance untuk latihan. Architecture/roles yang tidak supplied tidak boleh dianggap confirmed.

## Hubungan dengan Feature Lain

AI Knowledge Assistant → Target Intelligence → existing mapping/hypothesis workflow setelah persetujuan.

## Tips

Output memakai schema knowledge yang sama; bagian yang tidak relevan dapat kosong. Tidak ada fetch perusahaan atau eksekusi test. Accept bukan verifikasi fakta.
<a id="knowledge-op-identify_critical_assets"></a>

# Identify Critical Assets

Status: Active

## Fungsi

Menyarankan resource dan data sensitif yang perlu dipetakan.

## Kenapa Feature Ini Penting

Membantu peneliti memahami context bisnis sambil menjaga provenance.

## Kapan Digunakan

Saat mapping ownership/impact.

## Input

Selected target/domain/term/flow, profile/accepted knowledge dengan provenance, scope/rules, Question/Notes, learning depth, current hypothesis opsional; privacy mode.

## Output

Asset/sensitive-data items untuk review peneliti.

## Cara Menggunakan

1. Pilih Operation Identify Critical Assets.
2. Isi context relevan.
3. Preview Knowledge Context → Send Knowledge Analysis.
4. Review confidence/Unknown.
5. Accept/Edit/Reject; penerapan ke model riset membutuhkan editor terpisah.

## Contoh

Gunakan Example Finance dan domain Finance untuk latihan. Architecture/roles yang tidak supplied tidak boleh dianggap confirmed.

## Hubungan dengan Feature Lain

AI Knowledge Assistant → Target Intelligence → existing mapping/hypothesis workflow setelah persetujuan.

## Tips

Output memakai schema knowledge yang sama; bagian yang tidak relevan dapat kosong. Tidak ada fetch perusahaan atau eksekusi test. Accept bukan verifikasi fakta.
<a id="knowledge-op-generate_security_invariants"></a>

# Generate Security Invariants

Status: Active

## Fungsi

Mengubah context flow/authority menjadi aturan keamanan kandidat.

## Kenapa Feature Ini Penting

Membantu peneliti memahami context bisnis sambil menjaga provenance.

## Kapan Digunakan

Sebelum membuat pertanyaan/test.

## Input

Selected target/domain/term/flow, profile/accepted knowledge dengan provenance, scope/rules, Question/Notes, learning depth, current hypothesis opsional; privacy mode.

## Output

Invariant draft dengan domain/flow/technique references yang valid.

## Cara Menggunakan

1. Pilih Operation Generate Security Invariants.
2. Isi context relevan.
3. Preview Knowledge Context → Send Knowledge Analysis.
4. Review confidence/Unknown.
5. Accept/Edit/Reject; penerapan ke model riset membutuhkan editor terpisah.

## Contoh

Gunakan Example Finance dan domain Finance untuk latihan. Architecture/roles yang tidak supplied tidak boleh dianggap confirmed.

## Hubungan dengan Feature Lain

AI Knowledge Assistant → Target Intelligence → existing mapping/hypothesis workflow setelah persetujuan.

## Tips

Output memakai schema knowledge yang sama; bagian yang tidak relevan dapat kosong. Tidak ada fetch perusahaan atau eksekusi test. Accept bukan verifikasi fakta.
<a id="knowledge-op-generate_domain_questions"></a>

# Generate Research Questions

Status: Active

## Fungsi

Membuat pertanyaan riset berdasarkan domain/invariant.

## Kenapa Feature Ini Penting

Membantu peneliti memahami context bisnis sambil menjaga provenance.

## Kapan Digunakan

Sesudah mempelajari flow.

## Input

Selected target/domain/term/flow, profile/accepted knowledge dengan provenance, scope/rules, Question/Notes, learning depth, current hypothesis opsional; privacy mode.

## Output

Question drafts yang dapat diterima lalu Convert to Hypothesis.

## Cara Menggunakan

1. Pilih Operation Generate Research Questions.
2. Isi context relevan.
3. Preview Knowledge Context → Send Knowledge Analysis.
4. Review confidence/Unknown.
5. Accept/Edit/Reject; penerapan ke model riset membutuhkan editor terpisah.

## Contoh

Gunakan Example Finance dan domain Finance untuk latihan. Architecture/roles yang tidak supplied tidak boleh dianggap confirmed.

## Hubungan dengan Feature Lain

AI Knowledge Assistant → Target Intelligence → existing mapping/hypothesis workflow setelah persetujuan.

## Tips

Output memakai schema knowledge yang sama; bagian yang tidak relevan dapat kosong. Tidak ada fetch perusahaan atau eksekusi test. Accept bukan verifikasi fakta.
<a id="knowledge-op-recommend_domain_techniques"></a>

# Recommend Techniques — Domain

Status: Active

## Fungsi

Memetakan business context ke teknik yang tersedia dan scope policy.

## Kenapa Feature Ini Penting

Membantu peneliti memahami context bisnis sambil menjaga provenance.

## Kapan Digunakan

Saat memilih technique berikutnya.

## Input

Selected target/domain/term/flow, profile/accepted knowledge dengan provenance, scope/rules, Question/Notes, learning depth, current hypothesis opsional; privacy mode.

## Output

Item invariant/question/explanation dengan techniqueId yang dibatasi kandidat supplied.

## Cara Menggunakan

1. Pilih Operation Recommend Techniques — Domain.
2. Isi context relevan.
3. Preview Knowledge Context → Send Knowledge Analysis.
4. Review confidence/Unknown.
5. Accept/Edit/Reject; penerapan ke model riset membutuhkan editor terpisah.

## Contoh

Gunakan Example Finance dan domain Finance untuk latihan. Architecture/roles yang tidak supplied tidak boleh dianggap confirmed.

## Hubungan dengan Feature Lain

AI Knowledge Assistant → Target Intelligence → existing mapping/hypothesis workflow setelah persetujuan.

## Tips

Output memakai schema knowledge yang sama; bagian yang tidak relevan dapat kosong. Tidak ada fetch perusahaan atau eksekusi test. Accept bukan verifikasi fakta.
<a id="agentic-research"></a>

# Agentic Research Orchestrator

Status: Active

## Fungsi

Start/Continue memilih specialist berikutnya dari state, scope, proposal dan evidence.

## Kenapa Feature Ini Penting

Mengurangi pekerjaan operasional dengan tetap mempertahankan keputusan peneliti.

## Kapan Digunakan

Setelah Create Target, scope/rules/guard dan knowledge tersedia; pages manual/history tetap offline.

## Input

Selected target/context, researcher analysis, program rules, evidence, inventory dan bounded settings.

## Output

Progress, current task, bounded runs dan review stop; bukan otomatis testing target.

## Cara Menggunakan

1. Read Agentic Guide.
2. Configure flags/provider.
3. Start/Continue dan review context.
4. Review/edit/reject proposals.
5. Tambahkan manual analysis/evidence.
6. Continue sampai report review atau completed.

## Contoh

Example SaaS Lab memakai owned dummy accounts: invariant -> hypothesis -> manual test -> observation/evidence -> reviewed finding.

## Hubungan dengan Feature Lain

ResearchOrchestrator dan 13 specialists memakai provider/rules/knowledge/store serta canonical modules existing.

## Tips

AI_ENABLED=false menonaktifkan agentic walau flag agentic=true. Native local adapters saja; HTTP/browser/network/installation/root/destructive execution denied. Budget adalah estimasi, actual billing Unknown. Tidak ada company fact atau confirmed finding otomatis.
<a id="agent-review"></a>

# Review Queue

Status: Active

## Fungsi

Review AI proposals dan native action approvals sebelum canonical data berubah.

## Kenapa Feature Ini Penting

Mengurangi pekerjaan operasional dengan tetap mempertahankan keputusan peneliti.

## Kapan Digunakan

Setelah Create Target, scope/rules/guard dan knowledge tersedia; pages manual/history tetap offline.

## Input

Selected target/context, researcher analysis, program rules, evidence, inventory dan bounded settings.

## Output

Accept/Edit/Reject, Confirm Finding dengan evidence serta false-positive/duplicate analysis; signed local approvals.

## Cara Menggunakan

1. Read Agentic Guide.
2. Configure flags/provider.
3. Start/Continue dan review context.
4. Review/edit/reject proposals.
5. Tambahkan manual analysis/evidence.
6. Continue sampai report review atau completed.

## Contoh

Example SaaS Lab memakai owned dummy accounts: invariant -> hypothesis -> manual test -> observation/evidence -> reviewed finding.

## Hubungan dengan Feature Lain

ResearchOrchestrator dan 13 specialists memakai provider/rules/knowledge/store serta canonical modules existing.

## Tips

AI_ENABLED=false menonaktifkan agentic walau flag agentic=true. Native local adapters saja; HTTP/browser/network/installation/root/destructive execution denied. Budget adalah estimasi, actual billing Unknown. Tidak ada company fact atau confirmed finding otomatis.
<a id="manual-analysis"></a>

# Manual Analysis

Status: Active

## Fungsi

Observation, Assessment, Correction, Research Idea, Potential Root Cause, Next Test Suggestion dan Notes peneliti.

## Kenapa Feature Ini Penting

Mengurangi pekerjaan operasional dengan tetap mempertahankan keputusan peneliti.

## Kapan Digunakan

Setelah Create Target, scope/rules/guard dan knowledge tersedia; pages manual/history tetap offline.

## Input

Selected target/context, researcher analysis, program rules, evidence, inventory dan bounded settings.

## Output

Input priority tinggi, stale proposal invalidation dan re-analysis dari phase pilihan.

## Cara Menggunakan

1. Read Agentic Guide.
2. Configure flags/provider.
3. Start/Continue dan review context.
4. Review/edit/reject proposals.
5. Tambahkan manual analysis/evidence.
6. Continue sampai report review atau completed.

## Contoh

Example SaaS Lab memakai owned dummy accounts: invariant -> hypothesis -> manual test -> observation/evidence -> reviewed finding.

## Hubungan dengan Feature Lain

ResearchOrchestrator dan 13 specialists memakai provider/rules/knowledge/store serta canonical modules existing.

## Tips

AI_ENABLED=false menonaktifkan agentic walau flag agentic=true. Native local adapters saja; HTTP/browser/network/installation/root/destructive execution denied. Budget adalah estimasi, actual billing Unknown. Tidak ada company fact atau confirmed finding otomatis.
<a id="agent-history"></a>

# Agent History

Status: Active

## Fungsi

Audit action/result/status/timestamp, researcher decision, tools dan estimated cost.

## Kenapa Feature Ini Penting

Mengurangi pekerjaan operasional dengan tetap mempertahankan keputusan peneliti.

## Kapan Digunakan

Setelah Create Target, scope/rules/guard dan knowledge tersedia; pages manual/history tetap offline.

## Input

Selected target/context, researcher analysis, program rules, evidence, inventory dan bounded settings.

## Output

Run outcomes dan concise summaries; tidak ada private chain-of-thought.

## Cara Menggunakan

1. Read Agentic Guide.
2. Configure flags/provider.
3. Start/Continue dan review context.
4. Review/edit/reject proposals.
5. Tambahkan manual analysis/evidence.
6. Continue sampai report review atau completed.

## Contoh

Example SaaS Lab memakai owned dummy accounts: invariant -> hypothesis -> manual test -> observation/evidence -> reviewed finding.

## Hubungan dengan Feature Lain

ResearchOrchestrator dan 13 specialists memakai provider/rules/knowledge/store serta canonical modules existing.

## Tips

AI_ENABLED=false menonaktifkan agentic walau flag agentic=true. Native local adapters saja; HTTP/browser/network/installation/root/destructive execution denied. Budget adalah estimasi, actual billing Unknown. Tidak ada company fact atau confirmed finding otomatis.
<a id="tool-inventory"></a>

# Tool Inventory

Status: Active

## Fungsi

Installed/version/path/capabilities/agent permissions untuk perangkat lokal.

## Kenapa Feature Ini Penting

Mengurangi pekerjaan operasional dengan tetap mempertahankan keputusan peneliti.

## Kapan Digunakan

Setelah Create Target, scope/rules/guard dan knowledge tersedia; pages manual/history tetap offline.

## Input

Selected target/context, researcher analysis, program rules, evidence, inventory dan bounded settings.

## Output

Manual entry dan fixed local detection; tidak memasang atau menjalankan path AI.

## Cara Menggunakan

1. Read Agentic Guide.
2. Configure flags/provider.
3. Start/Continue dan review context.
4. Review/edit/reject proposals.
5. Tambahkan manual analysis/evidence.
6. Continue sampai report review atau completed.

## Contoh

Example SaaS Lab memakai owned dummy accounts: invariant -> hypothesis -> manual test -> observation/evidence -> reviewed finding.

## Hubungan dengan Feature Lain

ResearchOrchestrator dan 13 specialists memakai provider/rules/knowledge/store serta canonical modules existing.

## Tips

AI_ENABLED=false menonaktifkan agentic walau flag agentic=true. Native local adapters saja; HTTP/browser/network/installation/root/destructive execution denied. Budget adalah estimasi, actual billing Unknown. Tidak ada company fact atau confirmed finding otomatis.
<a id="agentic-settings"></a>

# Agentic AI Settings

Status: Active

## Fungsi

Flag gabungan AI/Agentic, supervised mode, budget/steps/local access dan target policy.

## Kenapa Feature Ini Penting

Mengurangi pekerjaan operasional dengan tetap mempertahankan keputusan peneliti.

## Kapan Digunakan

Setelah Create Target, scope/rules/guard dan knowledge tersedia; pages manual/history tetap offline.

## Input

Selected target/context, researcher analysis, program rules, evidence, inventory dan bounded settings.

## Output

Safe backend configuration tanpa API key; external adapters belum tersedia.

## Cara Menggunakan

1. Read Agentic Guide.
2. Configure flags/provider.
3. Start/Continue dan review context.
4. Review/edit/reject proposals.
5. Tambahkan manual analysis/evidence.
6. Continue sampai report review atau completed.

## Contoh

Example SaaS Lab memakai owned dummy accounts: invariant -> hypothesis -> manual test -> observation/evidence -> reviewed finding.

## Hubungan dengan Feature Lain

ResearchOrchestrator dan 13 specialists memakai provider/rules/knowledge/store serta canonical modules existing.

## Tips

AI_ENABLED=false menonaktifkan agentic walau flag agentic=true. Native local adapters saja; HTTP/browser/network/installation/root/destructive execution denied. Budget adalah estimasi, actual billing Unknown. Tidak ada company fact atau confirmed finding otomatis.
<a id="research-environment"></a>

# Target Research Environment

Status: Partial

## Fungsi

Optional testing metadata, accounts, authentication profiles, encrypted secret refs and target-specific rules.

## Kenapa Feature Ini Penting

Separate target metadata from secrets and enforce explicit program rules.

## Kapan Digunakan

When configuring authorized testing; manual research works without credentials.

## Input

Program/scope, account roles, authentication method, headers, rules, restrictions and vault passphrase.

## Output

Per-target metadata, role/account matrix, protected credential references and policy review states.

## Cara Menggunakan

1. Target -> Research Environment.
2. Configure metadata/rules/accounts/profiles.
3. Unlock vault and update protected secrets.
4. Select authentication context in hypothesis/test.

## Contoh

Owned SaaS lab uses two dummy accounts; no real target request.

## Hubungan dengan Feature Lain

Reuses Target/Scope/Policy/Agentic/SecretRedactor/Workspace Storage.

## Tips

Encrypted local vault only. Export excludes secrets. Remote execution, session verification and secure secret export unavailable.
<a id="agent-message"></a>

# Agent Message

Status: Active

## Fungsi

Right group conversation with mentions above input, attachments and model selection.

## Kenapa Feature Ini Penting

Analyze selected research without leaving the workspace.

## Kapan Digunakan

When both AI flags are enabled; local lookup works without a configured provider.

## Input

Active target/page, up to four @specialists, #record:id, selected model and optional files.

## Output

Concise analysis, redacted target/session conversation and review proposals.

## Cara Menggunakan

1. Select target and open a record.
2. Ask Agent; adjust context chips.
3. Type @finding and #evidence reference.
4. Enter sends a bounded group analysis; Shift+Enter adds a line.
5. Review proposal in Review Queue; close/collapse to continue research.

## Contoh

Owned dummy finding and evidence; no target request.

## Hubungan dengan Feature Lain

Reuses ResearchOrchestrator, specialists, ledger, redactor, policy and canonical review workflow.

## Tips

Related Terms/autocomplete are local. Ctrl/Cmd+K commands; Escape dismisses suggestions/drawer. General + up to three relevant specialists without tags; explicit tags select members. Per-agent model/history. Text and PNG/JPEG/WebP files with preview; PDF unsupported. Model selection is validated server-side. History window 20 messages, max 1000 per target. Mobile drawer; disabled UI hidden. No tool execution or auto-confirmed findings.
<a id="tech_01"></a>

# State-Machine & Context Confusion

Status: Active

## Fungsi

Uji kombinasi state yang valid secara individual tetapi tidak boleh coexist dalam satu transaksi.

## Kenapa Feature Ini Penting

Menguji invariant berikut: Actor, object, state, authority, dan context harus konsisten pada setiap keputusan authorization.

## Kapan Digunakan

Ketika arsitektur dan scope target memiliki kondisi yang sesuai; review relevansi sebelum memilih teknik.

## Input

Rarity: very-rare; Difficulty: advanced; Domain: state; Category: State Machine.

Security invariant: Actor, object, state, authority, dan context harus konsisten pada setiap keputusan authorization.

Dimensions: WHO, WHAT, OBJECT, STATE, AUTHORITY, CONTEXT. Target baru menambahkan priority/risk/cost manual masing-masing 50/100 dan flags Enabled=true, Tested=false, Interesting=false.

## Output

Template hypothesis: Backend gagal mengikat actor, object, state, dan context sebagai satu keputusan authorization.

Template test: Ganti satu dimensi: account, session, profile, tenant, origin, destination, lalu kombinasikan dua dimensi.

Signals: UI/backend berbeda pendapat tentang user, scope, object, atau authority aktif.

False positive indicators awal: Periksa role efektif, kepemilikan data, state terbaru, dan respons backend.

Stop condition: Berhenti setelah protected action/data dummy terbukti melewati boundary.

## Cara Menggunakan

1. Techniques → cari nama teknik.
2. Buka detail invariant/template/signals/stop.
3. Review scope.
4. Buat hypothesis dan isi invariant/formula spesifik.
5. Buat test manual serta kontrol pembanding.

## Contoh

Pada Example SaaS, bandingkan aksi export oleh Member pada state active dan revoked dalam tenant sama; pastikan actor/action/object/state/authority/context yang dicatat cocok keputusan backend. Ini rencana/ilustrasi dummy, bukan klaim vulnerability aktual.

## Hubungan dengan Feature Lain

Technique Library → Hypotheses → Test Cases → Evidence → Findings. Tool Knowledge/AI dapat memakai teknik sebagai context.

## Tips

Signals memicu investigasi, bukan bukti vulnerability. Stop condition harus direview sebelum test. False positives dan score awal bersifat umum; sesuaikan dengan target. Dimensions tersimpan sebagai metadata; UI teknik tidak menyediakan editor dimensi khusus. Nama/rank/libraryId sumber bawaan tetap dirujuk di sini; teknik per target dapat diedit.
<a id="tech_02"></a>

# Async Authorization / Queue Revalidation

Status: Active

## Fungsi

Authorization valid saat job dibuat belum tentu masih valid saat worker menjalankannya.

## Kenapa Feature Ini Penting

Menguji invariant berikut: Worker harus memvalidasi kembali authority dan state saat job benar-benar dijalankan.

## Kapan Digunakan

Ketika arsitektur dan scope target memiliki kondisi yang sesuai; review relevansi sebelum memilih teknik.

## Input

Rarity: very-rare; Difficulty: advanced; Domain: state; Category: Async / Queue.

Security invariant: Worker harus memvalidasi kembali authority dan state saat job benar-benar dijalankan.

Dimensions: WHO, WHAT, OBJECT, STATE, AUTHORITY, CONTEXT. Target baru menambahkan priority/risk/cost manual masing-masing 50/100 dan flags Enabled=true, Tested=false, Interesting=false.

## Output

Template hypothesis: Worker menggunakan authorization snapshot lama tanpa re-check state terbaru.

Template test: Queue action → revoke permission / role / share → tunggu job diproses.

Signals: Job tetap membaca, mengubah, mengirim, atau mengeksekusi resource setelah hak dicabut.

False positive indicators awal: Periksa role efektif, kepemilikan data, state terbaru, dan respons backend.

Stop condition: Pakai data dummy dan hentikan setelah satu unauthorized outcome terbukti.

## Cara Menggunakan

1. Techniques → cari nama teknik.
2. Buka detail invariant/template/signals/stop.
3. Review scope.
4. Buat hypothesis dan isi invariant/formula spesifik.
5. Buat test manual serta kontrol pembanding.

## Contoh

Job Export Demo dibuat ketika Member aktif, lalu membership dicabut sebelum worker berjalan. Amati apakah worker atau akses hasil memvalidasi ulang izin, pada timing yang bisa dikendalikan di laboratorium. Ini rencana/ilustrasi dummy, bukan klaim vulnerability aktual.

## Hubungan dengan Feature Lain

Technique Library → Hypotheses → Test Cases → Evidence → Findings. Tool Knowledge/AI dapat memakai teknik sebagai context.

## Tips

Signals memicu investigasi, bukan bukti vulnerability. Stop condition harus direview sebelum test. False positives dan score awal bersifat umum; sesuaikan dengan target. Dimensions tersimpan sebagai metadata; UI teknik tidak menyediakan editor dimensi khusus. Nama/rank/libraryId sumber bawaan tetap dirujuk di sini; teknik per target dapat diedit.
<a id="tech_03"></a>

# Approval / Capability Context Confusion

Status: Active

## Fungsi

Valid approval harus terikat ke actor, action, object, destination, dan context yang tepat.

## Kenapa Feature Ini Penting

Menguji invariant berikut: Approval harus terikat pada actor, action, object, destination, context, dan lifecycle penggunaan yang diizinkan.

## Kapan Digunakan

Ketika arsitektur dan scope target memiliki kondisi yang sesuai; review relevansi sebelum memilih teknik.

## Input

Rarity: very-rare; Difficulty: intermediate; Domain: auth; Category: Approval / Capability.

Security invariant: Approval harus terikat pada actor, action, object, destination, context, dan lifecycle penggunaan yang diizinkan.

Dimensions: WHO, WHAT, OBJECT, STATE, AUTHORITY, CONTEXT. Target baru menambahkan priority/risk/cost manual masing-masing 50/100 dan flags Enabled=true, Tested=false, Interesting=false.

## Output

Template hypothesis: Capability terlalu luas atau tidak terikat pada seluruh konteks yang relevan.

Template test: Replay, revoke, expire, switch action, switch origin, switch recipient, switch session.

Signals: Approval untuk X berhasil digunakan untuk Y.

False positive indicators awal: Periksa role efektif, kepemilikan data, state terbaru, dan respons backend.

Stop condition: Jangan melanjutkan ke aksi destruktif setelah mismatch terbukti.

## Cara Menggunakan

1. Techniques → cari nama teknik.
2. Buka detail invariant/template/signals/stop.
3. Review scope.
4. Buat hypothesis dan isi invariant/formula spesifik.
5. Buat test manual serta kontrol pembanding.

## Contoh

Jika laboratorium Example SaaS memiliki approval export, bandingkan context project/actor/destination yang disetujui dengan context ketika approval dipakai. Catat apakah capability masih valid setelah digunakan. Ini rencana/ilustrasi dummy, bukan klaim vulnerability aktual.

## Hubungan dengan Feature Lain

Technique Library → Hypotheses → Test Cases → Evidence → Findings. Tool Knowledge/AI dapat memakai teknik sebagai context.

## Tips

Signals memicu investigasi, bukan bukti vulnerability. Stop condition harus direview sebelum test. False positives dan score awal bersifat umum; sesuaikan dengan target. Dimensions tersimpan sebagai metadata; UI teknik tidak menyediakan editor dimensi khusus. Nama/rank/libraryId sumber bawaan tetap dirujuk di sini; teknik per target dapat diedit.
<a id="tech_04"></a>

# Restart / Resume Persistence

Status: Active

## Fungsi

Restart sering membuat state browser, extension, desktop app, dan backend tidak sinkron.

## Kenapa Feature Ini Penting

Menguji invariant berikut: Restart/resume tidak boleh mengembalikan permission atau capability yang sudah tidak valid.

## Kapan Digunakan

Ketika arsitektur dan scope target memiliki kondisi yang sesuai; review relevansi sebelum memilih teknik.

## Input

Rarity: very-rare; Difficulty: intermediate; Domain: state; Category: Session.

Security invariant: Restart/resume tidak boleh mengembalikan permission atau capability yang sudah tidak valid.

Dimensions: WHO, WHAT, OBJECT, STATE, AUTHORITY, CONTEXT. Target baru menambahkan priority/risk/cost manual masing-masing 50/100 dan flags Enabled=true, Tested=false, Interesting=false.

## Output

Template hypothesis: Old authority/capability bertahan melewati restart atau reconnect.

Template test: Grant → restart/reconnect/re-login → switch account → reuse action.

Signals: Old session, approval, profile, atau permission tetap dihormati.

False positive indicators awal: Periksa role efektif, kepemilikan data, state terbaru, dan respons backend.

Stop condition: Catat komponen mana yang menyimpan stale state.

## Cara Menggunakan

1. Techniques → cari nama teknik.
2. Buka detail invariant/template/signals/stop.
3. Review scope.
4. Buat hypothesis dan isi invariant/formula spesifik.
5. Buat test manual serta kontrol pembanding.

## Contoh

Jika klien laboratorium mendukung resume, catat apakah restart/resume memakai capability Member yang sudah revoked. Periksa respons backend aktual, bukan hanya state UI lama. Ini rencana/ilustrasi dummy, bukan klaim vulnerability aktual.

## Hubungan dengan Feature Lain

Technique Library → Hypotheses → Test Cases → Evidence → Findings. Tool Knowledge/AI dapat memakai teknik sebagai context.

## Tips

Signals memicu investigasi, bukan bukti vulnerability. Stop condition harus direview sebelum test. False positives dan score awal bersifat umum; sesuaikan dengan target. Dimensions tersimpan sebagai metadata; UI teknik tidak menyediakan editor dimensi khusus. Nama/rank/libraryId sumber bawaan tetap dirujuk di sini; teknik per target dapat diedit.
<a id="tech_05"></a>

# Differential Multi-Surface Testing

Status: Active

## Fungsi

Operasi yang sama dari UI, API, mobile, desktop, atau extension harus menghasilkan keputusan security yang konsisten.

## Kenapa Feature Ini Penting

Menguji invariant berikut: Semua surface harus menegakkan invariant authorization yang sama.

## Kapan Digunakan

Ketika arsitektur dan scope target memiliki kondisi yang sesuai; review relevansi sebelum memilih teknik.

## Input

Rarity: very-rare; Difficulty: intermediate; Domain: api; Category: API.

Security invariant: Semua surface harus menegakkan invariant authorization yang sama.

Dimensions: WHO, WHAT, OBJECT, STATE, AUTHORITY, CONTEXT. Target baru menambahkan priority/risk/cost manual masing-masing 50/100 dan flags Enabled=true, Tested=false, Interesting=false.

## Output

Template hypothesis: Salah satu surface memakai middleware, policy, atau validator berbeda.

Template test: Jalankan object/action yang sama melalui surface berbeda.

Signals: Satu surface menolak sementara surface lain menerima request identik secara semantik.

False positive indicators awal: Periksa role efektif, kepemilikan data, state terbaru, dan respons backend.

Stop condition: Bandingkan authorization path, bukan sekadar perbedaan UX.

## Cara Menggunakan

1. Techniques → cari nama teknik.
2. Buka detail invariant/template/signals/stop.
3. Review scope.
4. Buat hypothesis dan isi invariant/formula spesifik.
5. Buat test manual serta kontrol pembanding.

## Contoh

Bandingkan penolakan export Member revoked pada Web dan API laboratorium Example SaaS. Gunakan actor/object/state yang sama agar perbedaan surface tidak tercampur ownership. Ini rencana/ilustrasi dummy, bukan klaim vulnerability aktual.

## Hubungan dengan Feature Lain

Technique Library → Hypotheses → Test Cases → Evidence → Findings. Tool Knowledge/AI dapat memakai teknik sebagai context.

## Tips

Signals memicu investigasi, bukan bukti vulnerability. Stop condition harus direview sebelum test. False positives dan score awal bersifat umum; sesuaikan dengan target. Dimensions tersimpan sebagai metadata; UI teknik tidak menyediakan editor dimensi khusus. Nama/rank/libraryId sumber bawaan tetap dirujuk di sini; teknik per target dapat diedit.
<a id="tech_06"></a>

# Cross-Context / App-Extension-Browser Trust

Status: Active

## Fungsi

Komponen yang saling percaya sering salah memvalidasi sender, origin, profile, tab, atau account.

## Kenapa Feature Ini Penting

Menguji invariant berikut: Pesan lintas browser/extension/app harus memvalidasi asal, destination, dan authority sebelum aksi terlindungi.

## Kapan Digunakan

Ketika arsitektur dan scope target memiliki kondisi yang sesuai; review relevansi sebelum memilih teknik.

## Input

Rarity: very-rare; Difficulty: advanced; Domain: browser; Category: Browser / Extension.

Security invariant: Pesan lintas browser/extension/app harus memvalidasi asal, destination, dan authority sebelum aksi terlindungi.

Dimensions: WHO, WHAT, OBJECT, STATE, AUTHORITY, CONTEXT. Target baru menambahkan priority/risk/cost manual masing-masing 50/100 dan flags Enabled=true, Tested=false, Interesting=false.

## Output

Template hypothesis: Restricted component bisa impersonate trusted caller.

Template test: Uji origin/profile/session mismatch pada message channel yang memang exposed dan in-scope.

Signals: Protected data/functionality tersedia untuk caller yang tidak tepat.

False positive indicators awal: Periksa role efektif, kepemilikan data, state terbaru, dan respons backend.

Stop condition: Gunakan website/profile milik sendiri.

## Cara Menggunakan

1. Techniques → cari nama teknik.
2. Buka detail invariant/template/signals/stop.
3. Review scope.
4. Buat hypothesis dan isi invariant/formula spesifik.
5. Buat test manual serta kontrol pembanding.

## Contoh

Jika ada extension milik peneliti pada laboratorium, petakan Browser → Extension → Backend dan aturan asal pesan sebelum memeriksa protected action. Tanpa extension, pilih teknik lain. Ini rencana/ilustrasi dummy, bukan klaim vulnerability aktual.

## Hubungan dengan Feature Lain

Technique Library → Hypotheses → Test Cases → Evidence → Findings. Tool Knowledge/AI dapat memakai teknik sebagai context.

## Tips

Signals memicu investigasi, bukan bukti vulnerability. Stop condition harus direview sebelum test. False positives dan score awal bersifat umum; sesuaikan dengan target. Dimensions tersimpan sebagai metadata; UI teknik tidak menyediakan editor dimensi khusus. Nama/rank/libraryId sumber bawaan tetap dirujuk di sini; teknik per target dapat diedit.
<a id="tech_07"></a>

# Object Lifecycle & Revocation

Status: Active

## Fungsi

Authorization sering benar pada create/read, lalu rusak setelah share, revoke, archive, restore, atau delete.

## Kenapa Feature Ini Penting

Menguji invariant berikut: Object yang revoked/deleted/expired tidak boleh tetap dapat diakses melalui authority lama.

## Kapan Digunakan

Ketika arsitektur dan scope target memiliki kondisi yang sesuai; review relevansi sebelum memilih teknik.

## Input

Rarity: very-rare; Difficulty: intermediate; Domain: business; Category: State Machine.

Security invariant: Object yang revoked/deleted/expired tidak boleh tetap dapat diakses melalui authority lama.

Dimensions: WHO, WHAT, OBJECT, STATE, AUTHORITY, CONTEXT. Target baru menambahkan priority/risk/cost manual masing-masing 50/100 dan flags Enabled=true, Tested=false, Interesting=false.

## Output

Template hypothesis: Secondary endpoint mempertahankan stale access setelah state berubah.

Template test: Create → share → revoke → preview/download/export/copy/search/history.

Signals: Jalur alternatif masih mengakses object yang sudah revoked/deleted/private.

False positive indicators awal: Periksa role efektif, kepemilikan data, state terbaru, dan respons backend.

Stop condition: Jangan menyentuh object pengguna lain.

## Cara Menggunakan

1. Techniques → cari nama teknik.
2. Buka detail invariant/template/signals/stop.
3. Review scope.
4. Buat hypothesis dan isi invariant/formula spesifik.
5. Buat test manual serta kontrol pembanding.

## Contoh

Catat apakah Export Demo yang dicabut atau dihapus masih dapat diakses melalui authority lama pada dua akun sendiri. Bedakan data cache UI dari akses baru yang diotorisasi backend. Ini rencana/ilustrasi dummy, bukan klaim vulnerability aktual.

## Hubungan dengan Feature Lain

Technique Library → Hypotheses → Test Cases → Evidence → Findings. Tool Knowledge/AI dapat memakai teknik sebagai context.

## Tips

Signals memicu investigasi, bukan bukti vulnerability. Stop condition harus direview sebelum test. False positives dan score awal bersifat umum; sesuaikan dengan target. Dimensions tersimpan sebagai metadata; UI teknik tidak menyediakan editor dimensi khusus. Nama/rank/libraryId sumber bawaan tetap dirujuk di sini; teknik per target dapat diedit.
<a id="tech_08"></a>

# Race Condition / TOCTOU

Status: Active

## Fungsi

Uji operasi yang seharusnya atomic, sekali pakai, atau mutually exclusive.

## Kenapa Feature Ini Penting

Menguji invariant berikut: Pemeriksaan authority dan perubahan state harus konsisten terhadap interleaving transaksi.

## Kapan Digunakan

Ketika arsitektur dan scope target memiliki kondisi yang sesuai; review relevansi sebelum memilih teknik.

## Input

Rarity: uncommon; Difficulty: intermediate; Domain: state; Category: Race Condition.

Security invariant: Pemeriksaan authority dan perubahan state harus konsisten terhadap interleaving transaksi.

Dimensions: WHO, WHAT, OBJECT, STATE, AUTHORITY, CONTEXT. Target baru menambahkan priority/risk/cost manual masing-masing 50/100 dan flags Enabled=true, Tested=false, Interesting=false.

## Output

Template hypothesis: Dua request lolos validasi sebelum state pertama committed.

Template test: Gunakan concurrency minimal pada resource dummy milik sendiri.

Signals: Dua operasi sukses saat hanya satu yang seharusnya boleh.

False positive indicators awal: Periksa role efektif, kepemilikan data, state terbaru, dan respons backend.

Stop condition: Hindari traffic besar; jangan berubah menjadi DoS.

## Cara Menggunakan

1. Techniques → cari nama teknik.
2. Buka detail invariant/template/signals/stop.
3. Review scope.
4. Buat hypothesis dan isi invariant/formula spesifik.
5. Buat test manual serta kontrol pembanding.

## Contoh

Pada laboratorium yang mengizinkan kontrol interleaving transaksi, petakan waktu pemeriksaan izin dan perubahan state export. Dokumentasikan observasi terbatas; jangan menganggap pengujian race/volume diizinkan semua program. Ini rencana/ilustrasi dummy, bukan klaim vulnerability aktual.

## Hubungan dengan Feature Lain

Technique Library → Hypotheses → Test Cases → Evidence → Findings. Tool Knowledge/AI dapat memakai teknik sebagai context.

## Tips

Signals memicu investigasi, bukan bukti vulnerability. Stop condition harus direview sebelum test. False positives dan score awal bersifat umum; sesuaikan dengan target. Dimensions tersimpan sebagai metadata; UI teknik tidak menyediakan editor dimensi khusus. Nama/rank/libraryId sumber bawaan tetap dirujuk di sini; teknik per target dapat diedit.
<a id="tech_09"></a>

# Webhook / Callback Ownership

Status: Active

## Fungsi

Event delivery harus terikat pada tenant, endpoint, event, dan recipient yang benar.

## Kenapa Feature Ini Penting

Menguji invariant berikut: Callback destination dan webhook harus tetap terikat pada owner dan tenant yang diotorisasi.

## Kapan Digunakan

Ketika arsitektur dan scope target memiliki kondisi yang sesuai; review relevansi sebelum memilih teknik.

## Input

Rarity: uncommon; Difficulty: intermediate; Domain: api; Category: Webhook.

Security invariant: Callback destination dan webhook harus tetap terikat pada owner dan tenant yang diotorisasi.

Dimensions: WHO, WHAT, OBJECT, STATE, AUTHORITY, CONTEXT. Target baru menambahkan priority/risk/cost manual masing-masing 50/100 dan flags Enabled=true, Tested=false, Interesting=false.

## Output

Template hypothesis: Callback dapat direplay, diarahkan, atau digunakan lintas tenant.

Template test: Uji revoke, rotation, duplicate delivery, wrong resource, wrong endpoint pada environment milik sendiri.

Signals: Data/event tenant A dikirim ke endpoint yang tidak lagi authorized.

False positive indicators awal: Periksa role efektif, kepemilikan data, state terbaru, dan respons backend.

Stop condition: Jangan target endpoint pihak ketiga.

## Cara Menggunakan

1. Techniques → cari nama teknik.
2. Buka detail invariant/template/signals/stop.
3. Review scope.
4. Buat hypothesis dan isi invariant/formula spesifik.
5. Buat test manual serta kontrol pembanding.

## Contoh

Jika Example SaaS memiliki webhook export ke endpoint laboratorium sendiri, catat tenant/owner destination sebelum dan setelah perubahan konfigurasi. Jangan mengarahkan callback ke endpoint pihak lain. Ini rencana/ilustrasi dummy, bukan klaim vulnerability aktual.

## Hubungan dengan Feature Lain

Technique Library → Hypotheses → Test Cases → Evidence → Findings. Tool Knowledge/AI dapat memakai teknik sebagai context.

## Tips

Signals memicu investigasi, bukan bukti vulnerability. Stop condition harus direview sebelum test. False positives dan score awal bersifat umum; sesuaikan dengan target. Dimensions tersimpan sebagai metadata; UI teknik tidak menyediakan editor dimensi khusus. Nama/rank/libraryId sumber bawaan tetap dirujuk di sini; teknik per target dapat diedit.
<a id="tech_10"></a>

# WebSocket / Realtime Stale Authorization

Status: Active

## Fungsi

Socket yang sudah terhubung kadang tidak kehilangan privilege setelah role atau membership berubah.

## Kenapa Feature Ini Penting

Menguji invariant berikut: Channel realtime harus memvalidasi authority terbaru setelah role/session/resource berubah.

## Kapan Digunakan

Ketika arsitektur dan scope target memiliki kondisi yang sesuai; review relevansi sebelum memilih teknik.

## Input

Rarity: uncommon; Difficulty: intermediate; Domain: api; Category: Realtime / WebSocket.

Security invariant: Channel realtime harus memvalidasi authority terbaru setelah role/session/resource berubah.

Dimensions: WHO, WHAT, OBJECT, STATE, AUTHORITY, CONTEXT. Target baru menambahkan priority/risk/cost manual masing-masing 50/100 dan flags Enabled=true, Tested=false, Interesting=false.

## Output

Template hypothesis: Authorization hanya diperiksa saat connect/subscribe.

Template test: Connect → subscribe → revoke role/share → observe authorized dummy events.

Signals: Client tetap menerima event setelah akses dicabut.

False positive indicators awal: Periksa role efektif, kepemilikan data, state terbaru, dan respons backend.

Stop condition: Gunakan channel dan data milik akun pengujian.

## Cara Menggunakan

1. Techniques → cari nama teknik.
2. Buka detail invariant/template/signals/stop.
3. Review scope.
4. Buat hypothesis dan isi invariant/formula spesifik.
5. Buat test manual serta kontrol pembanding.

## Contoh

Jika laboratorium mengirim progres Export Demo lewat WebSocket, catat apakah channel Member revoked masih menerima event baru. Bedakan event lama di buffer dari event sesudah revoke efektif. Ini rencana/ilustrasi dummy, bukan klaim vulnerability aktual.

## Hubungan dengan Feature Lain

Technique Library → Hypotheses → Test Cases → Evidence → Findings. Tool Knowledge/AI dapat memakai teknik sebagai context.

## Tips

Signals memicu investigasi, bukan bukti vulnerability. Stop condition harus direview sebelum test. False positives dan score awal bersifat umum; sesuaikan dengan target. Dimensions tersimpan sebagai metadata; UI teknik tidak menyediakan editor dimensi khusus. Nama/rank/libraryId sumber bawaan tetap dirujuk di sini; teknik per target dapat diedit.
<a id="tech_11"></a>

# Parser Differential

Status: Active

## Fungsi

Dua komponen dapat menafsirkan URL, parameter, header, atau body secara berbeda.

## Kenapa Feature Ini Penting

Menguji invariant berikut: Parser di setiap surface harus menafsirkan object/action/context secara konsisten.

## Kapan Digunakan

Ketika arsitektur dan scope target memiliki kondisi yang sesuai; review relevansi sebelum memilih teknik.

## Input

Rarity: uncommon; Difficulty: advanced; Domain: api; Category: Parser Differential.

Security invariant: Parser di setiap surface harus menafsirkan object/action/context secara konsisten.

Dimensions: WHO, WHAT, OBJECT, STATE, AUTHORITY, CONTEXT. Target baru menambahkan priority/risk/cost manual masing-masing 50/100 dan flags Enabled=true, Tested=false, Interesting=false.

## Output

Template hypothesis: Validator melihat representasi A, executor melihat representasi B.

Template test: Bandingkan duplicate params, body/query mismatch, normalization, case, scalar/array.

Signals: Security check dan backend bertindak pada nilai berbeda.

False positive indicators awal: Periksa role efektif, kepemilikan data, state terbaru, dan respons backend.

Stop condition: Fokus pada semantic mismatch, bukan fuzzing massal.

## Cara Menggunakan

1. Techniques → cari nama teknik.
2. Buka detail invariant/template/signals/stop.
3. Review scope.
4. Buat hypothesis dan isi invariant/formula spesifik.
5. Buat test manual serta kontrol pembanding.

## Contoh

Jika laboratorium menyediakan beberapa parser input API, bandingkan makna object/action/context dari data dummy yang sama. Catat input dan interpretasi, bukan hanya perbedaan status HTTP. Ini rencana/ilustrasi dummy, bukan klaim vulnerability aktual.

## Hubungan dengan Feature Lain

Technique Library → Hypotheses → Test Cases → Evidence → Findings. Tool Knowledge/AI dapat memakai teknik sebagai context.

## Tips

Signals memicu investigasi, bukan bukti vulnerability. Stop condition harus direview sebelum test. False positives dan score awal bersifat umum; sesuaikan dengan target. Dimensions tersimpan sebagai metadata; UI teknik tidak menyediakan editor dimensi khusus. Nama/rank/libraryId sumber bawaan tetap dirujuk di sini; teknik per target dapat diedit.
<a id="tech_12"></a>

# Cache Authorization & Variant Confusion

Status: Active

## Fungsi

Response private/user-specific harus memiliki cache key dan invalidation yang benar.

## Kenapa Feature Ini Penting

Menguji invariant berikut: Cache harus memisahkan protected content berdasarkan authority, tenant, dan variant yang relevan.

## Kapan Digunakan

Ketika arsitektur dan scope target memiliki kondisi yang sesuai; review relevansi sebelum memilih teknik.

## Input

Rarity: uncommon; Difficulty: intermediate; Domain: api; Category: Cache.

Security invariant: Cache harus memisahkan protected content berdasarkan authority, tenant, dan variant yang relevan.

Dimensions: WHO, WHAT, OBJECT, STATE, AUTHORITY, CONTEXT. Target baru menambahkan priority/risk/cost manual masing-masing 50/100 dan flags Enabled=true, Tested=false, Interesting=false.

## Output

Template hypothesis: Cache mengabaikan actor, tenant, auth state, atau variant penting.

Template test: Bandingkan akun/profil sendiri dan perubahan permission dengan request yang semantik sama.

Signals: Response stale atau milik context lain muncul.

False positive indicators awal: Periksa role efektif, kepemilikan data, state terbaru, dan respons backend.

Stop condition: Gunakan marker data dummy agar sumber response jelas.

## Cara Menggunakan

1. Techniques → cari nama teknik.
2. Buka detail invariant/template/signals/stop.
3. Review scope.
4. Buat hypothesis dan isi invariant/formula spesifik.
5. Buat test manual serta kontrol pembanding.

## Contoh

Bandingkan respons export yang diperoleh dua akun sendiri pada tenant lab berbeda bila caching memang ada. Gunakan marker dummy terpisah dan periksa authority/variant cache yang relevan. Ini rencana/ilustrasi dummy, bukan klaim vulnerability aktual.

## Hubungan dengan Feature Lain

Technique Library → Hypotheses → Test Cases → Evidence → Findings. Tool Knowledge/AI dapat memakai teknik sebagai context.

## Tips

Signals memicu investigasi, bukan bukti vulnerability. Stop condition harus direview sebelum test. False positives dan score awal bersifat umum; sesuaikan dengan target. Dimensions tersimpan sebagai metadata; UI teknik tidak menyediakan editor dimensi khusus. Nama/rank/libraryId sumber bawaan tetap dirujuk di sini; teknik per target dapat diedit.
<a id="tech_13"></a>

# OAuth / SSO / Account Linking

Status: Active

## Fungsi

Identity, authorization response, session, dan target account harus terikat konsisten.

## Kenapa Feature Ini Penting

Menguji invariant berikut: Identitas, issuer, session, dan account linking harus terikat pada akun yang benar.

## Kapan Digunakan

Ketika arsitektur dan scope target memiliki kondisi yang sesuai; review relevansi sebelum memilih teknik.

## Input

Rarity: uncommon; Difficulty: intermediate; Domain: auth; Category: OAuth / SSO.

Security invariant: Identitas, issuer, session, dan account linking harus terikat pada akun yang benar.

Dimensions: WHO, WHAT, OBJECT, STATE, AUTHORITY, CONTEXT. Target baru menambahkan priority/risk/cost manual masing-masing 50/100 dan flags Enabled=true, Tested=false, Interesting=false.

## Output

Template hypothesis: Identity A dapat terikat atau memberi authority pada Account B.

Template test: State/session switching, account linking, revoke, re-login, scope changes.

Signals: Account misbinding, privilege inheritance salah, atau stale linked authority.

False positive indicators awal: Periksa role efektif, kepemilikan data, state terbaru, dan respons backend.

Stop condition: Gunakan seluruh identity/account milik sendiri.

## Cara Menggunakan

1. Techniques → cari nama teknik.
2. Buka detail invariant/template/signals/stop.
3. Review scope.
4. Buat hypothesis dan isi invariant/formula spesifik.
5. Buat test manual serta kontrol pembanding.

## Contoh

Jika OAuth/SSO tersedia di laboratorium sendiri, catat issuer, session, identity dan account-linking untuk akun dummy A/B. Tanpa integrasi yang diotorisasi, teknik tidak digunakan. Ini rencana/ilustrasi dummy, bukan klaim vulnerability aktual.

## Hubungan dengan Feature Lain

Technique Library → Hypotheses → Test Cases → Evidence → Findings. Tool Knowledge/AI dapat memakai teknik sebagai context.

## Tips

Signals memicu investigasi, bukan bukti vulnerability. Stop condition harus direview sebelum test. False positives dan score awal bersifat umum; sesuaikan dengan target. Dimensions tersimpan sebagai metadata; UI teknik tidak menyediakan editor dimensi khusus. Nama/rank/libraryId sumber bawaan tetap dirujuk di sini; teknik per target dapat diedit.
<a id="tech_14"></a>

# Cross-Tenant / Workspace Isolation

Status: Active

## Fungsi

Object, search, export, job, audit, dan realtime event harus selalu tenant-scoped.

## Kenapa Feature Ini Penting

Menguji invariant berikut: Authority suatu tenant tidak boleh digunakan untuk resource tenant lain.

## Kapan Digunakan

Ketika arsitektur dan scope target memiliki kondisi yang sesuai; review relevansi sebelum memilih teknik.

## Input

Rarity: uncommon; Difficulty: intermediate; Domain: auth; Category: Tenant Isolation.

Security invariant: Authority suatu tenant tidak boleh digunakan untuk resource tenant lain.

Dimensions: WHO, WHAT, OBJECT, STATE, AUTHORITY, CONTEXT. Target baru menambahkan priority/risk/cost manual masing-masing 50/100 dan flags Enabled=true, Tested=false, Interesting=false.

## Output

Template hypothesis: Endpoint tertentu hanya memvalidasi object ID tanpa tenant ownership.

Template test: Gunakan dua workspace milik sendiri dengan object marker berbeda.

Signals: Workspace A membaca atau memodifikasi resource Workspace B.

False positive indicators awal: Periksa role efektif, kepemilikan data, state terbaru, dan respons backend.

Stop condition: Minimum proof saja.

## Cara Menggunakan

1. Techniques → cari nama teknik.
2. Buka detail invariant/template/signals/stop.
3. Review scope.
4. Buat hypothesis dan isi invariant/formula spesifik.
5. Buat test manual serta kontrol pembanding.

## Contoh

Buat Tenant Demo A/B milik peneliti bila laboratorium mendukungnya; bandingkan akses Member terhadap Project Demo yang ownership-nya berbeda. Isi CONTEXT tenant dan evidence marker secara eksplisit. Ini rencana/ilustrasi dummy, bukan klaim vulnerability aktual.

## Hubungan dengan Feature Lain

Technique Library → Hypotheses → Test Cases → Evidence → Findings. Tool Knowledge/AI dapat memakai teknik sebagai context.

## Tips

Signals memicu investigasi, bukan bukti vulnerability. Stop condition harus direview sebelum test. False positives dan score awal bersifat umum; sesuaikan dengan target. Dimensions tersimpan sebagai metadata; UI teknik tidak menyediakan editor dimensi khusus. Nama/rank/libraryId sumber bawaan tetap dirujuk di sini; teknik per target dapat diedit.
<a id="tech_15"></a>

# File / Share / Export Boundary

Status: Active

## Fungsi

Preview, download, export, copy, share, revoke, dan redirect sering punya authorization path berbeda.

## Kenapa Feature Ini Penting

Menguji invariant berikut: File, share, dan export harus menegakkan owner, ACL, expiry, dan revocation secara konsisten.

## Kapan Digunakan

Ketika arsitektur dan scope target memiliki kondisi yang sesuai; review relevansi sebelum memilih teknik.

## Input

Rarity: uncommon; Difficulty: intermediate; Domain: business; Category: File Boundary.

Security invariant: File, share, dan export harus menegakkan owner, ACL, expiry, dan revocation secara konsisten.

Dimensions: WHO, WHAT, OBJECT, STATE, AUTHORITY, CONTEXT. Target baru menambahkan priority/risk/cost manual masing-masing 50/100 dan flags Enabled=true, Tested=false, Interesting=false.

## Output

Template hypothesis: Secondary file endpoint kehilangan ownership/share validation.

Template test: Test setiap operasi setelah perubahan state share/revoke/private.

Signals: Satu jalur masih mengizinkan akses saat jalur utama menolak.

False positive indicators awal: Periksa role efektif, kepemilikan data, state terbaru, dan respons backend.

Stop condition: Gunakan file dummy, bukan data sensitif nyata.

## Cara Menggunakan

1. Techniques → cari nama teknik.
2. Buka detail invariant/template/signals/stop.
3. Review scope.
4. Buat hypothesis dan isi invariant/formula spesifik.
5. Buat test manual serta kontrol pembanding.

## Contoh

Catat owner, ACL, share expiry dan revoke pada Export Demo dummy; periksa apakah akses file mengikuti izin terkini. Bedakan link publik yang memang didokumentasikan dari protected resource. Ini rencana/ilustrasi dummy, bukan klaim vulnerability aktual.

## Hubungan dengan Feature Lain

Technique Library → Hypotheses → Test Cases → Evidence → Findings. Tool Knowledge/AI dapat memakai teknik sebagai context.

## Tips

Signals memicu investigasi, bukan bukti vulnerability. Stop condition harus direview sebelum test. False positives dan score awal bersifat umum; sesuaikan dengan target. Dimensions tersimpan sebagai metadata; UI teknik tidak menyediakan editor dimensi khusus. Nama/rank/libraryId sumber bawaan tetap dirujuk di sini; teknik per target dapat diedit.
<a id="tech_16"></a>

# BFLA / Vertical Privilege Escalation

Status: Active

## Fungsi

Tombol tersembunyi bukan security control. Backend harus memeriksa capability role.

## Kenapa Feature Ini Penting

Menguji invariant berikut: Role rendah tidak boleh menjalankan fungsi yang membutuhkan role lebih tinggi.

## Kapan Digunakan

Ketika arsitektur dan scope target memiliki kondisi yang sesuai; review relevansi sebelum memilih teknik.

## Input

Rarity: common; Difficulty: intermediate; Domain: auth; Category: Authorization.

Security invariant: Role rendah tidak boleh menjalankan fungsi yang membutuhkan role lebih tinggi.

Dimensions: WHO, WHAT, OBJECT, STATE, AUTHORITY, CONTEXT. Target baru menambahkan priority/risk/cost manual masing-masing 50/100 dan flags Enabled=true, Tested=false, Interesting=false.

## Output

Template hypothesis: Member/viewer bisa memanggil fungsi owner/admin.

Template test: Replay action owner dengan session role lebih rendah milik sendiri.

Signals: Protected function berhasil tanpa role yang diperlukan.

False positive indicators awal: Periksa role efektif, kepemilikan data, state terbaru, dan respons backend.

Stop condition: Pakai aksi reversible/non-destructive bila tersedia.

## Cara Menggunakan

1. Techniques → cari nama teknik.
2. Buka detail invariant/template/signals/stop.
3. Review scope.
4. Buat hypothesis dan isi invariant/formula spesifik.
5. Buat test manual serta kontrol pembanding.

## Contoh

Bandingkan aksi administrasi Project Demo antara Owner dan Member laboratorium. Nyatakan authority yang dibutuhkan dan respons kontrol sebelum menyimpulkan privilege escalation. Ini rencana/ilustrasi dummy, bukan klaim vulnerability aktual.

## Hubungan dengan Feature Lain

Technique Library → Hypotheses → Test Cases → Evidence → Findings. Tool Knowledge/AI dapat memakai teknik sebagai context.

## Tips

Signals memicu investigasi, bukan bukti vulnerability. Stop condition harus direview sebelum test. False positives dan score awal bersifat umum; sesuaikan dengan target. Dimensions tersimpan sebagai metadata; UI teknik tidak menyediakan editor dimensi khusus. Nama/rank/libraryId sumber bawaan tetap dirujuk di sini; teknik per target dapat diedit.
<a id="tech_17"></a>

# IDOR / BOLA / Object Ownership

Status: Active

## Fungsi

Object identifier bukan authorization. Selalu cek ownership pada read/write/delete/share/export.

## Kenapa Feature Ini Penting

Menguji invariant berikut: Identifier object tidak boleh menggantikan pemeriksaan kepemilikan dan authorization.

## Kapan Digunakan

Ketika arsitektur dan scope target memiliki kondisi yang sesuai; review relevansi sebelum memilih teknik.

## Input

Rarity: common; Difficulty: easy; Domain: auth; Category: Authorization.

Security invariant: Identifier object tidak boleh menggantikan pemeriksaan kepemilikan dan authorization.

Dimensions: WHO, WHAT, OBJECT, STATE, AUTHORITY, CONTEXT. Target baru menambahkan priority/risk/cost manual masing-masing 50/100 dan flags Enabled=true, Tested=false, Interesting=false.

## Output

Template hypothesis: Backend percaya object ID tanpa memastikan actor berhak.

Template test: Dua akun sendiri: ganti object A dengan object B pada semua operasi.

Signals: Cross-account access atau mutation.

False positive indicators awal: Periksa role efektif, kepemilikan data, state terbaru, dan respons backend.

Stop condition: Jangan enumerasi object pihak lain.

## Cara Menggunakan

1. Techniques → cari nama teknik.
2. Buka detail invariant/template/signals/stop.
3. Review scope.
4. Buat hypothesis dan isi invariant/formula spesifik.
5. Buat test manual serta kontrol pembanding.

## Contoh

Bandingkan object milik akun A/B sendiri pada Example SaaS. Identifier adalah input resource; expected behavior tetap membutuhkan pemeriksaan ownership/authorization, bukan sekadar identifier valid. Ini rencana/ilustrasi dummy, bukan klaim vulnerability aktual.

## Hubungan dengan Feature Lain

Technique Library → Hypotheses → Test Cases → Evidence → Findings. Tool Knowledge/AI dapat memakai teknik sebagai context.

## Tips

Signals memicu investigasi, bukan bukti vulnerability. Stop condition harus direview sebelum test. False positives dan score awal bersifat umum; sesuaikan dengan target. Dimensions tersimpan sebagai metadata; UI teknik tidak menyediakan editor dimensi khusus. Nama/rank/libraryId sumber bawaan tetap dirujuk di sini; teknik per target dapat diedit.
<a id="tech_18"></a>

# Business Logic State Transition

Status: Active

## Fungsi

Sistem sering memvalidasi request, tapi lupa memvalidasi urutan state bisnis.

## Kenapa Feature Ini Penting

Menguji invariant berikut: Transisi business state harus memenuhi prasyarat dan authority yang berlaku.

## Kapan Digunakan

Ketika arsitektur dan scope target memiliki kondisi yang sesuai; review relevansi sebelum memilih teknik.

## Input

Rarity: common; Difficulty: intermediate; Domain: business; Category: Business Logic.

Security invariant: Transisi business state harus memenuhi prasyarat dan authority yang berlaku.

Dimensions: WHO, WHAT, OBJECT, STATE, AUTHORITY, CONTEXT. Target baru menambahkan priority/risk/cost manual masing-masing 50/100 dan flags Enabled=true, Tested=false, Interesting=false.

## Output

Template hypothesis: Step dapat dilewati, diulang, atau dilakukan dalam urutan ilegal.

Template test: 1→2→3, lalu 1→3, 3 langsung, 1(A)→2(B), repeat step.

Signals: Final state tercapai tanpa precondition wajib.

False positive indicators awal: Periksa role efektif, kepemilikan data, state terbaru, dan respons backend.

Stop condition: Gunakan resource test, jangan transaksi dunia nyata.

## Cara Menggunakan

1. Techniques → cari nama teknik.
2. Buka detail invariant/template/signals/stop.
3. Review scope.
4. Buat hypothesis dan isi invariant/formula spesifik.
5. Buat test manual serta kontrol pembanding.

## Contoh

Petakan transisi export queued → processing → ready dan prasyaratnya di laboratorium. Dokumentasikan apakah aksi Member memenuhi state dan authority yang seharusnya berlaku. Ini rencana/ilustrasi dummy, bukan klaim vulnerability aktual.

## Hubungan dengan Feature Lain

Technique Library → Hypotheses → Test Cases → Evidence → Findings. Tool Knowledge/AI dapat memakai teknik sebagai context.

## Tips

Signals memicu investigasi, bukan bukti vulnerability. Stop condition harus direview sebelum test. False positives dan score awal bersifat umum; sesuaikan dengan target. Dimensions tersimpan sebagai metadata; UI teknik tidak menyediakan editor dimensi khusus. Nama/rank/libraryId sumber bawaan tetap dirujuk di sini; teknik per target dapat diedit.
<a id="tech_19"></a>

# Authentication & Session Lifecycle

Status: Active

## Fungsi

Test perubahan password, logout, revoke, downgrade role, unlink identity, dan session expiration.

## Kenapa Feature Ini Penting

Menguji invariant berikut: Session yang expired/revoked/logout tidak boleh tetap memberikan authority aktif.

## Kapan Digunakan

Ketika arsitektur dan scope target memiliki kondisi yang sesuai; review relevansi sebelum memilih teknik.

## Input

Rarity: common; Difficulty: easy; Domain: auth; Category: Authentication.

Security invariant: Session yang expired/revoked/logout tidak boleh tetap memberikan authority aktif.

Dimensions: WHO, WHAT, OBJECT, STATE, AUTHORITY, CONTEXT. Target baru menambahkan priority/risk/cost manual masing-masing 50/100 dan flags Enabled=true, Tested=false, Interesting=false.

## Output

Template hypothesis: Token/session lama mempertahankan privilege yang sudah tidak valid.

Template test: Before/after logout, revoke, role change, workspace removal.

Signals: Old token masih bisa melakukan protected action.

False positive indicators awal: Periksa role efektif, kepemilikan data, state terbaru, dan respons backend.

Stop condition: Bedakan behavior yang memang didokumentasikan oleh program.

## Cara Menggunakan

1. Techniques → cari nama teknik.
2. Buka detail invariant/template/signals/stop.
3. Review scope.
4. Buat hypothesis dan isi invariant/formula spesifik.
5. Buat test manual serta kontrol pembanding.

## Contoh

Catat apakah session akun B masih memberi akses export baru setelah logout/expiry/revoke yang sudah efektif. Gunakan kontrol untuk membedakan session aktif lain atau capability terpisah. Ini rencana/ilustrasi dummy, bukan klaim vulnerability aktual.

## Hubungan dengan Feature Lain

Technique Library → Hypotheses → Test Cases → Evidence → Findings. Tool Knowledge/AI dapat memakai teknik sebagai context.

## Tips

Signals memicu investigasi, bukan bukti vulnerability. Stop condition harus direview sebelum test. False positives dan score awal bersifat umum; sesuaikan dengan target. Dimensions tersimpan sebagai metadata; UI teknik tidak menyediakan editor dimensi khusus. Nama/rank/libraryId sumber bawaan tetap dirujuk di sini; teknik per target dapat diedit.
<a id="tech_20"></a>

# Basic Validation & Misconfiguration With Impact

Status: Active

## Fungsi

Headers, CORS, redirects, version leaks, atau config aneh hanya menarik jika ada exploitability nyata.

## Kenapa Feature Ini Penting

Menguji invariant berikut: Validasi dan konfigurasi harus menjaga protected outcome sesuai batas authority yang ditentukan.

## Kapan Digunakan

Ketika arsitektur dan scope target memiliki kondisi yang sesuai; review relevansi sebelum memilih teknik.

## Input

Rarity: common; Difficulty: easy; Domain: api; Category: API.

Security invariant: Validasi dan konfigurasi harus menjaga protected outcome sesuai batas authority yang ditentukan.

Dimensions: WHO, WHAT, OBJECT, STATE, AUTHORITY, CONTEXT. Target baru menambahkan priority/risk/cost manual masing-masing 50/100 dan flags Enabled=true, Tested=false, Interesting=false.

## Output

Template hypothesis: Misconfiguration menghasilkan unauthorized data/action, bukan sekadar scanner finding.

Template test: Validasi dampak konkret dengan resource milik sendiri.

Signals: Security boundary benar-benar terlewati.

False positive indicators awal: Periksa role efektif, kepemilikan data, state terbaru, dan respons backend.

Stop condition: Jangan report noise tanpa impact.

## Cara Menggunakan

1. Techniques → cari nama teknik.
2. Buka detail invariant/template/signals/stop.
3. Review scope.
4. Buat hypothesis dan isi invariant/formula spesifik.
5. Buat test manual serta kontrol pembanding.

## Contoh

Pada API laboratorium Example SaaS, catat perbedaan validasi/konfigurasi dan protected outcome menggunakan input dummy terbatas. Perbedaan error saja belum membuktikan dampak keamanan. Ini rencana/ilustrasi dummy, bukan klaim vulnerability aktual.

## Hubungan dengan Feature Lain

Technique Library → Hypotheses → Test Cases → Evidence → Findings. Tool Knowledge/AI dapat memakai teknik sebagai context.

## Tips

Signals memicu investigasi, bukan bukti vulnerability. Stop condition harus direview sebelum test. False positives dan score awal bersifat umum; sesuaikan dengan target. Dimensions tersimpan sebagai metadata; UI teknik tidak menyediakan editor dimensi khusus. Nama/rank/libraryId sumber bawaan tetap dirujuk di sini; teknik per target dapat diedit.
