# Workflow Guide — Example SaaS

Pelajari bisnis sebelum menguji teknologi: buka **Target Intelligence** untuk profil dan klasifikasi sektor, lalu **Domain Knowledge**, **Terminology**, dan **Business Flows**. Panduan [Target Intelligence & Domain Knowledge](TARGET_INTELLIGENCE_GUIDE.md) menyediakan latihan Finance manual, provenance, custom packs, serta 11 operasi AI knowledge yang terpisah dari Research Assistant. Semua pembelajaran domain bekerja tanpa AI.

Panduan ini memakai sistem dan hasil dummy. `https://app.example.test`, Tenant Demo, Owner, Member, dan seluruh marker merupakan contoh untuk laboratorium sendiri, bukan izin menguji target nyata. Hasil gagal pada contoh adalah skenario pembelajaran; catat hanya hasil yang benar-benar Anda amati.

Mulai dengan [cara menjalankan aplikasi](USER_GUIDE.md#cara-menjalankan-aplikasi). Gunakan CURRENT TARGET secara konsisten, dan tunggu Saved locally sebelum meninggalkan pekerjaan. Setiap tahap berikut menjelaskan mengapa, tindakan, output, dan langkah berikutnya.

## Workflow Manual Lengkap

### 1. Create Target

**Mengapa:** Memisahkan catatan engagement dan menyediakan identitas laporan.

**Yang dilakukan:** Target → + Create Target. Program Name Example SaaS; Platform Private; Asset `https://app.example.test`; Environment laboratorium sendiri; Version demo-1; Status active. Simpan dan pilih target.

**Output yang diharapkan:** Profil target dengan 20 technique awal dan koleksi riset kosong.

**Langkah berikutnya:** Catat scope sebelum menyusun pengujian.

### 2. Define Scope

**Mengapa:** Dugaan menarik hanya layak diuji dalam batas izin engagement.

**Yang dilakukan:** Scope → isi In Scope dengan asset dummy. Catat Out of Scope pihak ketiga, Known Issues, rate limit manual laboratorium, automation rules, restrictions, safe harbor notes, alias akun A/B, dan Tenant Demo. Catat marker `SECRET_ACCOUNT_A_123` dan `SECRET_ACCOUNT_B_456` sebagai data dummy.

**Output yang diharapkan:** Batas aset, data, akun, dan kondisi penghentian yang bisa dibaca ulang.

**Langkah berikutnya:** Catat konfirmasi izin dan flags program.

### 3. Define Program Rules

**Mengapa:** Program rules membatasi rekomendasi dan keputusan pengujian.

**Yang dilakukan:** Review semua tujuh Engagement Guard; centang hanya yang telah diperiksa. Biarkan automationAllowed, dosAllowed, thirdPartyTesting false pada latihan. Isi larangan automation dan third-party testing dalam teks restrictions juga.

**Output yang diharapkan:** Checklist terdokumentasi dan hard flags false. Scope Checker dapat menunjukkan within_supplied_scope setelah asset, In Scope, dan tiga konfirmasi awal lengkap; tetap review batas izin secara manual.

**Langkah berikutnya:** Definisikan pelaku dan haknya.

### 4. Create Actors

**Mengapa:** Authorization harus dibaca dari hak actor yang melakukan aksi.

**Yang dilakukan:** Actors → + Tambah Owner dan Member. Owner mengelola Project Demo; Member boleh export hanya selama membership aktif. Catat keduanya merupakan akun uji milik peneliti.

**Output yang diharapkan:** Dua actor sebagai referensi WHO, bukan dua akun yang dibuat otomatis pada target.

**Langkah berikutnya:** Catat resource yang dilindungi.

### 5. Create Objects

**Mengapa:** Menjelaskan kepemilikan, tenant, state, dan data yang mungkin keluar.

**Yang dilakukan:** Objects → + Tambah Project Demo bertipe Project, state active, owner Owner, tenant Tenant Demo. Tambah Export Demo bertipe File, state queued, sensitivity dummy. Export bukan tipe dropdown tersendiri; notes menjelaskan hubungan dengan project dan job.

**Output yang diharapkan:** Dua object yang namanya dipakai konsisten dalam hypothesis/test.

**Langkah berikutnya:** Petakan komponen yang memproses object.

### 6. Map Architecture

**Mengapa:** Izin dapat diperiksa pada satu komponen tetapi dipakai pada waktu atau komponen berbeda.

**Yang dilakukan:** Target → Edit → Custom Notes, tulis arsitektur laboratorium `Browser → Backend API → Export Worker → Storage`. Catat kapan enqueue, kapan worker berjalan, dan bagaimana hasil diambil. Gunakan Attack Surface untuk melihat Actors/Objects/Boundaries bersama.

**Output yang diharapkan:** Catatan arsitektur manual. Tidak ada endpoint discovery atau graph otomatis.

**Langkah berikutnya:** Tentukan boundary yang menjadi fokus.

### 7. Create Trust Boundary

**Mengapa:** Membuat aturan perpindahan authority antar komponen eksplisit.

**Yang dilakukan:** Trust Boundaries → + Tambah. From Backend API; To Export Worker; Channel queue export-job; Trust restricted; Authority Member harus aktif saat worker berjalan; Notes worker mengecek membership terbaru.

**Output yang diharapkan:** Row boundary yang nanti dipilih secara eksplisit pada Test Case.

**Langkah berikutnya:** Cari technique yang memeriksa invariant tersebut.

### 8. Review Technique Library

**Mengapa:** Technique mengubah dugaan abstrak menjadi pertanyaan yang dapat diuji.

**Yang dilakukan:** Techniques → baca Async Authorization / Queue Revalidation, Object Lifecycle & Revocation, dan File / Share / Export Boundary. Buka detail invariant, signals, false positives, dan stop condition masing-masing.

**Output yang diharapkan:** Pemahaman tentang aturan authorization saat enqueue, execution, dan akses hasil.

**Langkah berikutnya:** Pilih satu technique untuk test pertama.

### 9. Select Technique

**Mengapa:** Fokus tunggal memudahkan menafsirkan hasil dan memilih alat manual.

**Yang dilakukan:** Pilih Async Authorization / Queue Revalidation sebagai fokus; pastikan Enabled. Buka Tool Knowledge bila membutuhkan saran alat manual; gunakan sesuai scope, bukan menganggap seluruh kemampuan tool diizinkan.

**Output yang diharapkan:** Technique dan kebutuhan observasi yang jelas. Checkbox Tested belum menjadi evidence pengujian.

**Langkah berikutnya:** Tulis hypothesis konkret.

### 10. Create Hypothesis

**Mengapa:** Memisahkan invariant yang diharapkan dari dugaan kegagalan.

**Yang dilakukan:** Pada technique tekan Buat hypothesis. Title Member revoked tidak boleh memperoleh Export Demo. Invariant Member revoked tidak boleh menerima export baru. Expected Behavior worker/akses hasil menolak Member. Potential Failure worker memakai snapshot izin enqueue. Isi WHO Member, WHAT memperoleh export, OBJECT Export Demo, STATE revoked, AUTHORITY session akun uji B, CONTEXT Tenant Demo; API → Worker. Priority medium, confidence low, status idea, queue Next.

**Output yang diharapkan:** Hypothesis tersimpan. Invariant perlu diisi sendiri jika memakai tombol dari kartu library.

**Langkah berikutnya:** Buat rencana reproduksi.

### 11. Create Test Case

**Mengapa:** Satu hypothesis memerlukan kondisi dan langkah yang dapat diulang.

**Yang dilakukan:** Hypotheses → Buat Test Case. Preconditions: dua akun sendiri, project dummy, kontrol waktu job di laboratorium. Steps: konfirmasi hak Member aktif; buat job dummy; Owner revoke Member; amati worker/akses hasil; catat waktu dan marker. Expected Result Member revoked tidak memperoleh export baru. Pilih boundary Backend API → Export Worker; result NOT TESTED. Periksa enam dimensi dan simpan.

**Output yang diharapkan:** Rencana test yang belum mengklaim hasil. Test tidak dijalankan aplikasi.

**Langkah berikutnya:** Jalankan tindakan manual yang sudah diotorisasi.

### 12. Perform Manual Authorized Testing

**Mengapa:** Catatan dugaan harus diuji melalui observasi nyata yang terbatas.

**Yang dilakukan:** Jalankan rencana pada laboratorium sendiri mengikuti rate limit. Bedakan waktu enqueue, revoke, worker execution, dan download. Catat role efektif dan ownership aktual. Hentikan jika muncul data asing, scope tidak jelas, atau kondisi stop technique terpenuhi.

**Output yang diharapkan:** Observasi aktual: misalnya akses ditolak, export masih diperoleh, atau timing belum dapat ditentukan. Jangan menyalin hasil gagal ilustrasi sebagai fakta.

**Langkah berikutnya:** Rekam bukti sebelum mengubah kesimpulan.

### 13. Record Evidence

**Mengapa:** Evidence membantu membedakan role/timing/ownership dari asumsi.

**Yang dilakukan:** Redaksi request/response dan log melalui Secret Redactor lalu review manual. Test Cases → Attach Evidence → label/tipenya, description, content aman, timestamp dalam description bila perlu. Hubungkan ke test. Simpan screenshot/video asli di lokasi terpisah dan catat path metadata. Marker A/B tetap dummy, bukan kredensial.

**Output yang diharapkan:** Evidence terkait test dan file asli yang Anda kelola sendiri. Export workspace hanya membawa teks/metadata.

**Langkah berikutnya:** Bandingkan expected dan actual.

### 14. Analyze Result

**Mengapa:** Respons sukses belum tentu berarti kontrol keamanan gagal.

**Yang dilakukan:** Edit test, isi actual result faktual, request/response notes, timestamp. PASS jika penolakan sesuai invariant; FAIL jika invariant benar-benar gagal; INCONCLUSIVE jika membership/timing belum jelas. Gunakan Evidence Comparator untuk membandingkan baris respons kontrol dan percobaan; periksa urutan/timing secara manual.

**Output yang diharapkan:** Hasil test dengan konteks/evidence. FAIL berarti invariant gagal, bukan aplikasi test rusak. Hypothesis status dan queue masih harus diubah sendiri.

**Langkah berikutnya:** Promosikan hanya observasi yang layak ditinjau menjadi finding.

### 15. Promote to Finding

**Mengapa:** Menyusun observasi menjadi kandidat laporan dengan authority, resource, dan dampak jelas.

**Yang dilakukan:** Test Cases → Promote to Finding. Review draft, source test, technique, evidence dan enam dimensi. Isi Component Export Worker, Version demo-1, Class sesuai observasi, Starting Authority Member/session B, Security Restriction invariant, Protected Resource Export Demo, Unauthorized Outcome aktual, impact terbatas pada data dummy yang diamati, mitigation dan notes. Pisahkan root cause hypothesis dari fakta. Simpan severity Unknown selama belum dinilai.

**Output yang diharapkan:** Finding draft. Promosi tidak mengubah hasil menjadi confirmed dan tidak menetapkan P1–P5.

**Langkah berikutnya:** Cari alasan perilaku mungkin valid.

### 16. Check False Positive

**Mengapa:** Perilaku yang terlihat aneh bisa sesuai desain atau kondisi role sebenarnya.

**Yang dilakukan:** Internal Helpers → Finding Checklist untuk kelengkapan. Review dokumentasi laboratorium: apakah export memang tetap dimiliki Member, object public/shared, capability masih sah, revoke belum efektif, eventual consistency terdokumentasi, atau hak Owner masih terbawa? Tambahkan kontrol manual yang diotorisasi jika dibutuhkan. Dengan AI aktif, False Positive Analyzer memberi pertanyaan tambahan, bukan validasi otomatis.

**Output yang diharapkan:** Alasan dugaan bertahan atau ditolak, bukti tambahan, serta status investigating/confirmed/rejected yang ditentukan peneliti.

**Langkah berikutnya:** Bandingkan dengan issue sebelumnya.

### 17. Check Duplicate Risk

**Mengapa:** Temuan yang tampak berbeda dapat memiliki akar masalah atau boundary sama.

**Yang dilakukan:** Review Known Issues. Jika ada laporan dummy terdahulu, masukkan ke KB kategori Disclosed Reports/Finding Patterns berikut rootCause, securityRestriction, vulnerabilityClass, affectedComponent, impact. Internal Helpers → Duplicate Comparator → pilih finding dan kandidat atau isi manual → Compare Duplicate Risk.

**Output yang diharapkan:** Likely Unique/Possible Variant/Likely Duplicate/Unknown dan kemiripan teks. Jika belum ada data pembanding, Unknown merupakan hasil yang wajar; tidak ada pencarian internet otomatis.

**Langkah berikutnya:** Lengkapi finding dan susun report.

### 18. Generate Report

**Mengapa:** Menggabungkan fakta, reproduksi, evidence, dan batas kesimpulan secara konsisten.

**Yang dilakukan:** Findings → Generate Report → di Reports pilih finding dan tekan Generate Report. Baca semua bagian; lengkapi field Belum dicatat. Periksa expected/actual, marker, prasyarat, impact, severity estimate, dan label root cause hypothesis. Edit draft sesuai hasil review.

**Output yang diharapkan:** Draft laporan Indonesia yang tersimpan. Template tidak mengarang severity atau menerjemahkan input user secara otomatis.

**Langkah berikutnya:** Ekspor format yang dibutuhkan.

### 19. Export Report

**Mengapa:** Menyediakan artifact yang bisa direview dan dikirim melalui kanal program sendiri.

**Yang dilakukan:** Copy Markdown atau Download .md/.txt/.html; Print bila diperlukan. Buka hasil download dan pastikan secret tidak terbawa. HTML adalah teks Markdown escaped dalam pre, bukan renderer rich Markdown. Lengkapi attachment binary secara terpisah jika dibutuhkan program.

**Output yang diharapkan:** File report lokal. Aplikasi tidak mengirim report atau membuat submission program.

**Langkah berikutnya:** Cadangkan workspace beserta lesson.

### 20. Save Workspace

**Mengapa:** Autosave browser dapat hilang jika profil/origin/storage berubah.

**Yang dilakukan:** Tunggu Saved locally; Backup → Export Backup. Simpan JSON dan file screenshot/video terpisah. Bila memakai Connect workspace.json, tekan Save to workspace.json eksplisit. Catat lesson di KB; atur queue Done/status hypothesis dan finding sesuai keputusan Anda. Setelah KB diubah, ekspor snapshot terbaru.

**Output yang diharapkan:** Workspace JSON schema 2.0.0, draft report, evidence teks/metadata, dan lesson yang dapat dipulihkan. Import mengganti workspace, jadi backup data aktif sebelum mencoba restore.

**Langkah berikutnya:** Review Research Gaps; pilih actor/object/state/boundary yang belum mempunyai hasil test, lalu mulai hypothesis baru yang relevan.

## AI Enabled Workflow

Prasyarat: backend lokal, AI_ENABLED=true, provider/model/key atau Ollama yang siap, dan scope lengkap. [Panduan AI](USER_GUIDE.md#cara-menggunakan-ai) menjelaskan privacy mode dan preview.

```text
Target + Scope + Rules + Mapping
  → Research Assistant (research_advice)
  → Technique Advisor → Tool Advisor → Hypothesis Generator
  → Researcher Review → Manual Test → Evidence → Finding draft
  → Finding Analyzer → False Positive Analyzer → Duplicate Analyzer
  → Report Assistant → Researcher Review/Edit → Export
```

Label **Analyze Target** pada alur pembelajaran merujuk pada Operation **Research Assistant** (`research_advice`), bukan command terpisah. Pilihan **Analyze Scope** tersedia untuk meninjau scope. Kelima menu AI menggunakan satu form Operation; periksa operasi yang sedang dipilih sebelum mengirim.

| Tahap | Input yang ditinjau | Output yang dipakai |
| --- | --- | --- |
| Research Assistant | Target, scope, mapping, goal memeriksa export setelah revoke | Pertanyaan, missing context, safe next steps |
| Technique Advisor | Technique enabled dan arsitektur API/Worker | Nama teknik yang tersedia, priority, alasan, invariant |
| Tool Advisor | Technique pilihan dan rules manual | Kandidat Tool KB manual dengan alasan/scope warning |
| Hypothesis Generator | Invariant, aktor/object/state dalam context | Draft hypothesis; Review Hypothesis membuka editor, Simpan membuat record |
| Researcher Review | Seluruh draft dan scope | Hypothesis/rencana test yang Anda setujui; belum ada pengujian otomatis |
| Finding Analyzer | Finding pilihan dan evidence opt-in bila aman | Dugaan broken invariant/class/root cause/impact dan missing evidence |
| False Positive Analyzer | Finding, role/ownership/timing dan notes pembanding | Penjelasan alternatif yang harus diverifikasi manual |
| Duplicate Analyzer | Finding, Known Issues, KB opt-in dan finding target aktif | Estimasi status duplicate serta ketidakpastian, bukan pencarian seluruh laporan publik |
| Report Assistant | Finding pilihan dan draft report | Draft baru yang dipreview/diedit, lalu disimpan eksplisit |

Setiap request harus melalui **Preview AI Context → Send for Analysis**. Jangan memasukkan bukti sensitif karena menganggap checkbox evidence yang tidak dicentang menghilangkan semua narasi sensitif; fields actual result dan research notes masih dapat masuk context.

Setelah menerima suggestion, Reject atau simpan note yang relevan. Menyimpan hypothesis sendiri tidak menandai batch suggestion accepted. Mengedit/menyimpan AI Report Draft hanya mengubah reportMarkdown; fakta finding/status/severity tetap memerlukan review terpisah. Backend memaksa assessment analisis finding menjadi Hypothesis atau Unknown. **AI suggests. Researcher decides.**

## AI Disabled Workflow

Dengan `AI_ENABLED=false`, provider tidak diinisialisasi dan menu AI disembunyikan. Form AI yang diakses lewat hash menunjukkan petunjuk konfigurasi. Seluruh 20 langkah manual di atas tetap dapat dilakukan.

```text
Target + Scope + Rules
  → Actors & Objects → Trust Boundaries
  → Manual Technique Selection
  → Manual Hypothesis / offline Hypothesis Generator
  → Manual Test → Evidence → Finding
  → Finding Checklist + manual false-positive review
  → Duplicate Comparator + manual Known Issues review
  → Indonesian Report → Export → Backup
```

Tool Knowledge, Authorization Matrix, State Transition, Secret Redactor, Evidence Comparator, Finding Checklist, Duplicate Comparator, Research Gaps, dan Report Builder bekerja tanpa provider AI. Tidak ada tombol offline khusus False Positive Analyzer; gunakan checklist kelengkapan dan review alternatif perilaku secara manual. Rasio coverage serta priority technique manual tetap tersedia.

Jika AI gagal saat workflow, simpan catatan dan lanjutkan dari tahap manual yang sesuai. Tidak perlu menunggu provider untuk menyimpan hypothesis, test, finding, laporan, atau backup.
