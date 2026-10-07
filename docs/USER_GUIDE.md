# Advanced Bug Bounty Research Workspace

V2 menambahkan [Agentic AI Research](AGENTIC_RESEARCH_GUIDE.md): Start/Continue otomatis memilih specialist berikutnya, dengan review queue, manual analysis, tool inventory, history dan estimated budgets. Kedua flags AI/Agentic harus aktif untuk menjalankan orchestrator; semua core manual tetap tersedia.

Pelajari bisnis sebelum menguji teknologi: buka **Target Intelligence** untuk profil dan klasifikasi sektor, lalu **Domain Knowledge**, **Terminology**, dan **Business Flows**. Panduan [Target Intelligence & Domain Knowledge](TARGET_INTELLIGENCE_GUIDE.md) menyediakan latihan Finance manual, provenance, custom packs, serta 11 operasi AI knowledge yang terpisah dari Research Assistant. Semua pembelajaran domain bekerja tanpa AI.

## Apa Itu Sistem Ini

Aplikasi ini membantu peneliti menyusun riset bug bounty: mencatat izin, memetakan sistem, merumuskan dugaan, mendokumentasikan pengujian manual, dan menghasilkan laporan. Nama yang tampil pada aplikasi saat ini adalah **Universal Research Workspace**. Panduan ini mengikuti implementasi aplikasi versi 2.0.0 dengan schema workspace 2.0.0.

Alur utama:

```text
Target → Scope → Actors & Objects → Trust Boundaries
       → Technique → Hypothesis → Test Case → Evidence → Finding → Report
```

Peneliti menjalankan pengujian sendiri di lingkungan yang diotorisasi. Aplikasi menyimpan catatan; aplikasi tidak menghubungi aset target, menjalankan scanner, atau mengirim laporan ke program. Backend opsional mengirim context yang Anda setujui ke provider AI.

Mulailah dengan membaca panduan ini, kemudian jalankan [contoh lengkap Example SaaS](WORKFLOW_GUIDE.md). Gunakan [Feature Reference](FEATURE_REFERENCE.md) untuk mempelajari input, output, batasan, serta hubungan tiap fitur. Tombol `?` pada aplikasi membuka penjelasan singkat dan **View Documentation** menuju bagian terkait.

**Active** berarti fungsi sudah tersedia, dengan prasyarat yang dijelaskan. **Partial** berarti fungsi sudah tersedia tetapi kemampuannya terbatas. **Coming Soon** dipakai untuk placeholder yang belum berfungsi; saat audit ini tidak ada menu placeholder yang perlu diberi status tersebut. AI yang belum dikonfigurasi berstatus Disabled atau Misconfigured, bukan Coming Soon.

## Konsep Dasar

Security invariant adalah aturan keamanan yang seharusnya selalu berlaku. Contoh: **Member yang sudah dicabut tidak boleh memperoleh export baru dari Project milik tenant yang sama**. Dugaan kegagalan aturan disebut hypothesis; fakta hasil pengujian dicatat sebagai actual result dan evidence.

Enam dimensi membantu menjelaskan kondisi pengujian secara lengkap:

| Dimensi | Artinya | Contoh Example SaaS |
| --- | --- | --- |
| WHO | Actor atau peran yang melakukan aksi | Member dengan akun uji B |
| WHAT | Aksi yang diminta | Mengunduh export |
| OBJECT | Resource yang dilindungi | Export dari Project Demo |
| STATE | Kondisi lifecycle saat aksi terjadi | Membership revoked |
| AUTHORITY | Hak atau capability yang dimiliki | Session Member yang belum logout |
| CONTEXT | Lingkungan keputusan tersebut | Tenant Demo, API → Worker |

Actor berbeda dari authority: actor adalah pelaku, authority adalah hak yang sedang dibawanya. Object berbeda dari state: export adalah resource, sedangkan queued atau ready adalah kondisinya. Context menjelaskan tenant, origin, surface, atau hubungan komponen yang relevan.

Isilah WHO dan OBJECT dengan nama yang konsisten dengan daftar Actors dan Objects. Form memberi saran nama, tetapi nilai tersebut merupakan snapshot teks. Mengganti nama actor tidak otomatis mengganti semua test lama.

## Cara Menjalankan Aplikasi

### Mode manual tanpa backend

Buka `index.html` di root project menggunakan browser modern. Bundle lokal sudah disertakan, sehingga mode `file://` bisa dipakai tanpa instalasi Node. AI tidak tersedia melalui mode ini.

Alternatif HTTP statis dari folder project, jika Python tersedia:

```powershell
python -m http.server 8000 --bind 127.0.0.1 --directory client
```

Buka `http://127.0.0.1:8000`. Dokumentasi tersedia dari bantuan aplikasi. File playbook asli berada di root project; tautan playbook tersebut tidak tersedia apabila server statis hanya menyajikan folder client. Backend di bawah menyajikan playbook asli melalui rute khusus.

### Mode dengan backend opsional

Diperlukan Node minimal 20.19, npm, dan dependensi project. Dari folder project:

```powershell
npm install
npm start
```

Buka `http://127.0.0.1:3001`. Pada Windows, jika Node default terlalu lama tetapi versi modern sudah terpasang melalui nvm, gunakan:

```powershell
powershell -NoProfile -File scripts/workspace.ps1 -Action install
powershell -NoProfile -File scripts/workspace.ps1 -Action start
```

Gunakan `.env.example` sebagai acuan konfigurasi `.env`; jangan menimpa `.env` yang sudah berisi konfigurasi Anda. `AI_ENABLED=false` mempertahankan seluruh alur manual. Mengaktifkan AI dijelaskan di bagian AI. Jika port diubah melalui `SERVER_PORT`, gunakan URL dengan port tersebut.

Data browser terpisah menurut origin/profil browser. `file://`, `localhost`, `127.0.0.1`, atau port yang berbeda dapat memiliki workspace berbeda. **Export Workspace** sebelum pindah cara menjalankan, lalu **Import Workspace** pada origin baru. Browser tidak membaca `workspace.json` root secara otomatis.

## Cara Membuat Target Pertama

1. Buka **Target** dan tekan **+ Create Target**.
2. Isi Program Name `Example SaaS`, Platform `Private`, Target / Asset `https://app.example.test`, Environment `Laboratorium sendiri`, Version / Build `demo-1`, dan Status `active`.
3. Program URL boleh dikosongkan untuk contoh. Untuk engagement nyata, isi referensi halaman program; aplikasi tidak mengambil rules dari URL tersebut.
4. Simpan, lalu pastikan **CURRENT TARGET** menunjukkan Example SaaS.

Program Name wajib; field lain membantu konteks dan laporan. Setiap target memiliki riset, knowledge, dan 20 teknik awal sendiri. Status `paused` atau `archived` merupakan label; status tersebut tidak mengunci editor. Menghapus target menghapus seluruh catatan target tersebut.

## Cara Memasukkan Scope dan Rules

Buka **Scope** sebelum memilih saran tools atau mulai menguji. Form disimpan saat diketik. Untuk latihan:

| Field | Contoh isi |
| --- | --- |
| In Scope | `https://app.example.test` — hanya laboratorium sendiri |
| Out of Scope | Integrasi pembayaran dan seluruh layanan pihak ketiga |
| Known Issues | Tidak ada untuk skenario dummy ini |
| Rate Limits | Maksimal satu aksi manual setiap lima detik, sesuai aturan laboratorium |
| Automation Rules | Hanya manual; tanpa scanner atau loop otomatis |
| Testing Restrictions | Gunakan dua akun sendiri dan resource dummy; hentikan jika data asing muncul |
| Safe Harbor Notes | Catatan izin pemilik laboratorium; bukan kesimpulan hukum aplikasi |
| Test Accounts | `A = Owner`, `B = Member`; gunakan alias, bukan password |
| Owned Domains / Test Workspaces | Domain `.test` dan Tenant Demo yang Anda kelola |
| Dummy Markers | `SECRET_ACCOUNT_A_123` dan `SECRET_ACCOUNT_B_456` |

Engagement Guard memiliki tujuh checklist: target in-scope, akun authorized, data owned, aturan automation dipahami, rate limits dipahami, restrictions/destructive testing dipahami, known issues ditinjau. Centang setelah benar-benar memeriksanya. Checklist merupakan catatan konfirmasi Anda, bukan pemeriksaan otomatis.

**Hard Program Rules** mempunyai tiga izin eksplisit: automation, DoS, dan testing pihak ketiga. Semuanya default false. Memahami aturan automation tidak berarti automation diizinkan. AI tidak dapat mengubah flags ini. Rules program tetap menentukan tindakan yang boleh dilakukan.

Scope Checker, Copilot, dan Agentic memakai evaluator yang sama: asset harus cocok tepat dengan entri In Scope setelah normalisasi huruf/spasi/trailing slash, tidak cocok dengan Out of Scope, dan memiliki tiga konfirmasi izin pertama. Wildcard, annotation, atau path yang belum cocok memerlukan review dan pencatatan asset eksplisit. Status `within_supplied_scope` mengikuti catatan peneliti, bukan validasi izin independen. Review ketujuh checklist tetap diperlukan.

## Cara Mapping Attack Surface

**Attack Surface** menampilkan Actors, Objects, dan Trust Boundary Map bersama-sama. Tidak ada discovery otomatis, inventaris endpoint terpisah, atau diagram arsitektur interaktif.

Tuliskan arsitektur di Custom Notes target atau Notes pada boundary. Misalnya `Web/API → Worker → Storage`. Untuk Web, API, Desktop, Mobile, Browser Extension, WebSocket, Worker, Storage, atau OAuth, gunakan nama komponen pada **From/To**, lalu jelaskan protokol pada **Channel**. Hanya petakan surface yang benar-benar ada pada sistem Anda.

Untuk Example SaaS, cukup petakan browser, backend API, worker export, dan storage. Catat endpoint dummy yang relevan sebagai channel/notes, bukan seolah aplikasi telah menemukannya.

## Cara Membuat Actor

Buka **Actors**, tekan **+ Tambah**, isi nama, authority, dan notes. Buat:

- `Owner`: berhak mengelola Project Demo dan mencabut Member.
- `Member`: hak export selama membership aktif; akun uji milik peneliti.

Nama actor bebas. Anonymous, User, Viewer, Member, Editor, Admin, Owner, atau Service Account dapat dipakai sesuai peran aktual. Ini bukan pembuatan akun pada target. Actor membantu membandingkan hak antarperan dan melengkapi WHO pada hypothesis/test.

## Cara Membuat Object

Buka **Objects**, tekan **+ Tambah**, isi name, type, owner, tenant, state, sensitivity, dan notes. Buat `Project Demo` bertipe Project, owner `Owner`, tenant `Tenant Demo`, state `active`. Buat `Export Demo` bertipe File, state `queued`, dengan notes bahwa file dibuat worker dari Project Demo.

Jenis Export tidak ada pada dropdown; gunakan File, Job, API Resource, atau Custom sesuai resource yang dimaksud. Owner dan tenant adalah catatan teks, bukan koneksi ke akun target. Gunakan label sensitivitas seperti `dummy data only`.

## Cara Membuat Trust Boundary

Trust boundary adalah hubungan komponen yang mempunyai tingkat kepercayaan atau hak berbeda. Buka **Trust Boundaries**, tekan **+ Tambah**, lalu isi:

```text
From: Backend API
To: Export Worker
Channel: queue export-job
Authority: Member aktif pada Project Demo saat worker berjalan
Trust: restricted
Notes: Worker harus mengecek membership terbaru, bukan hanya izin saat enqueue.
```

Boundary tidak otomatis diwariskan ke test. Pilih **Trust Boundary** pada editor Test Case agar coverage boundary terhitung. Jika arsitektur memiliki Browser → Extension → Backend → Worker → Storage, catat setiap hubungan relevan sebagai row terpisah.

## Cara Memilih Technique

Buka **Techniques**. Gunakan pencarian/filter rarity, difficulty, domain, category, atau sorting berdasarkan priority/risk/cost. Buka detail invariant, hypothesis, test, signals, false positives, dan stop condition.

Untuk skenario ini pilih **Async Authorization / Queue Revalidation**. Pelajari invariant: worker harus memvalidasi authority dan state ketika job benar-benar dijalankan. Gunakan **Enabled** untuk daftar kandidat AI/coverage. **Tested** dan **Interesting** pada kartu adalah penanda manual; coverage dihitung dari Test Cases, bukan checkbox ini.

Semua 20 teknik awal didokumentasikan pada [referensi teknik](FEATURE_REFERENCE.md#technique-library). Kategori Sandbox tersedia untuk custom technique, tetapi belum mempunyai teknik bawaan tersendiri. **+ Custom Technique** membuat catatan teknik target ini; tidak mengubah library target lain.

## Cara Membuat Hypothesis

Tekan **Buat hypothesis** pada technique, atau **+ Create Hypothesis** pada Hypotheses. Isi judul, invariant, expected behavior, potential failure, technique, enam dimensi, priority, confidence, status, queue, dan notes.

```text
Title: Member revoked tidak boleh memperoleh Export Demo
Invariant: Member yang sudah dicabut tidak boleh menerima hasil export baru.
Expected Behavior: Worker menolak job atau menolak akses hasil bagi Member revoked.
Potential Failure: Worker masih memakai snapshot authorization saat enqueue.
WHO: Member
WHAT: Memperoleh export
OBJECT: Export Demo
STATE: revoked
AUTHORITY: Session akun uji B
CONTEXT: Tenant Demo; Backend API → Export Worker
Priority: medium | Confidence: low | Status: idea | Queue: Backlog
```

Tombol dari library mengisi technique, potential failure, dan notes template; isilah invariant sendiri. **Internal Helpers → Hypothesis Generator** juga mengisi invariant template sebelum Anda review. Satu hypothesis bisa mempunyai beberapa test case. Dugaan worker memakai snapshot izin belum merupakan root cause yang terbukti.

## Cara Membuat Test Case

Dari hypothesis tekan **Buat Test Case**. Periksa field yang diwariskan: technique, enam dimensi, judul, expected result, dan steps template. Sesuaikan preconditions, steps, expected result, boundary, request/response notes, timestamp, dan notes.

Gunakan langkah sesuai laboratorium: Owner dan Member aktif; buat job dummy; Owner mencabut Member; catat apakah worker atau akses hasil menolak Member. Jangan menganggap langkah ini dibolehkan pada setiap program nyata. Aplikasi tidak menjalankan langkah tersebut.

Setelah menguji, isi actual result dan pilih hasil:

| Label | Makna |
| --- | --- |
| NOT TESTED | Belum ada pengujian yang dicatat |
| PASS | Kontrol keamanan bekerja; invariant bertahan pada kondisi ini |
| FAIL | Invariant keamanan gagal pada observasi ini |
| INCONCLUSIVE | Hasil menarik atau belum cukup jelas; perlu investigasi |
| VULNERABILITY | Opsi tambahan untuk hasil yang dinyatakan terkonfirmasi oleh peneliti |

FAIL bukan error pada aplikasi workspace. Status hasil tidak otomatis mengonfirmasi finding, mengubah queue, atau menetapkan severity. Simpan waktu dan kondisi yang cukup agar observasi dapat diulang.

## Cara Menyimpan Evidence

Pada test tekan **Attach Evidence** atau gunakan **Evidence → + Attach Evidence**. Pilih jenis, isi label, path/reference opsional, description, teks redacted, dan relasi Test Case/Finding.

Jenis tersedia: screenshot, HTTP request, HTTP response, console output, log, video reference, file reference, manual note. Path screenshot/video hanya metadata; workspace tidak membuka, mengunggah, atau membackup binary file tersebut. Simpan file aslinya secara terpisah.

Marker `SECRET_ACCOUNT_A_123` dan `SECRET_ACCOUNT_B_456` adalah **label dummy**, bukan secret asli. Isi resource dummy akun A/B dengan label berbeda untuk melacak asal data yang tampak dalam respons. Aplikasi tidak menyisipkan atau mendeteksi marker secara otomatis.

Warning sensitif pada editor tidak otomatis meredaksi teks yang disimpan. Gunakan **Internal Helpers → Secret Redactor → Redact Preview**, periksa hasil, lalu salin hasil aman ke evidence. Save Redacted Note menyimpan ke Notes; tidak mengganti evidence asli. Redaksi berbasis pola bisa melewatkan secret yang formatnya tidak dikenal.

## Cara Membuat Finding

Setelah meninjau observasi, tekan **Promote to Finding** pada test. Editor membuka draft dengan data test, invariant hypothesis, dan evidence terkait. Status awal `draft`, severity `Unknown`. Promosi dapat dilakukan dari hasil apa pun; Anda harus menentukan apakah hasil cukup untuk menjadi temuan.

Lengkapi affected component/version, vulnerability class, starting authority, security restriction, protected resource, unauthorized outcome, root cause hypothesis, impact faktual, preconditions, steps, expected/actual result, mitigation, research notes, dan evidence. Target terdampak berasal dari CURRENT TARGET.

Misalnya actual result dummy menunjukkan akun B memperoleh Export Demo sesudah dicabut. Catat observasi tersebut dan marker yang ditemukan; jangan menyatakan seluruh tenant dapat diakses tanpa bukti. Gunakan **Finding Checklist**, review false positive dan duplicate, lalu tentukan status sendiri. P1–P5 adalah estimasi peneliti, bukan CVSS atau keputusan final program.

## Cara Generate Report

Tekan **Generate Report** pada finding untuk membuka **Reports**. Pilih finding, tekan **Generate Report** di halaman Reports untuk menyimpan template, baca preview, lalu edit Markdown bila diperlukan. Heading laporan default berbahasa Indonesia; teks user tidak diterjemahkan otomatis.

Template memuat target, severity estimate, prasyarat, authority, restriction, langkah, expected/actual, impact, root cause hypothesis, evidence, mitigation, dan catatan pengujian. Field kosong ditandai belum dicatat. Evidence teks ikut masuk laporan; review redaksi sekali lagi.

Gunakan **Copy Markdown**, **Download .md**, **Download .txt**, **Download .html**, atau **Print**. HTML berisi teks Markdown yang sudah di-escape dalam blok preformatted. Preview mendukung heading sederhana, bukan seluruh sintaks Markdown. Perubahan finding/evidence tidak otomatis memperbarui draft yang sudah tersimpan; Generate ulang meminta konfirmasi jika ada draft.

## Cara Menggunakan AI

AI opsional memerlukan backend lokal. Isi `.env` di server dengan `AI_ENABLED=true`, provider dan model yang benar-benar tersedia untuk Anda. Adapter yang diimplementasikan: `openai`, `anthropic`, `gemini`, dan `ollama`. Cloud membutuhkan API key; Ollama membutuhkan server lokal dan model lokal. Tidak ada nama model default.

```env
AI_ENABLED=true
AI_PROVIDER=ollama
OLLAMA_BASE_URL=http://127.0.0.1:11434
OLLAMA_MODEL=nama-model-lokal-yang-sudah-terpasang
AI_PRIVACY_MODE=LOCAL_ONLY
AI_REDACT_SECRETS=true
```

Nama model di atas adalah placeholder konfigurasi, bukan model yang dibundel aplikasi. Restart backend sesudah mengubah `.env`, buka URL backend, lalu periksa **AI Provider**. `Connected` mula-mula berarti konfigurasi siap, bukan bukti key/model telah berhasil dipanggil. `Provider Error` muncul jika request gagal; alur manual tetap tersedia.

Pilih Operation pada **Research Assistant**, isi goal/context, pilih technique/finding bila relevan. Evidence dan KB tidak dikirim kecuali opsi terkait dicentang. Expected/actual dan ringkasan riset tetap termasuk context biasa, jadi periksa seluruh preview, bukan hanya evidence.

1. Pilih privacy mode.
2. Tekan **Preview AI Context** dan baca seluruh payload yang akan dikirim.
3. Tekan **Send for Analysis** bila context sudah tepat.
4. Baca structured recommendation, missing context, stop conditions, confidence, dan priority.
5. Pilih Reject, Accept as Research Note, atau Edit / Accept Note. Review Hypothesis membuka form yang harus Anda simpan. Report Draft harus direview dan disimpan secara eksplisit.

Hasil AI disimpan sebagai suggestion pending. Menyimpan hypothesis dari suggestion tidak otomatis mengubah status seluruh suggestion menjadi accepted; terima note/report atau reject batch sesuai hasil review. AI tidak mengubah facts, severity, rules, atau status confirmed secara otomatis.

| Mode | Perilaku |
| --- | --- |
| LOCAL_ONLY | Hanya Ollama localhost; context tidak dikirim melalui adapter cloud |
| REDACTED_CLOUD | Context dan output melewati redaksi pola; cloud menerima context hasil redaksi jika provider cloud dipilih |
| CLOUD | Memungkinkan context tanpa redaksi jika `AI_REDACT_SECRETS=false`; bila flag tetap true, redaksi tetap berjalan |

Redaksi tidak berarti anonim sempurna: arsitektur, judul, narasi, dan data yang tidak dikenali dapat tetap terkirim. LOCAL_ONLY tetap mengikuti perilaku model/server Ollama yang Anda kelola. Lihat [AI Privacy Modes](FEATURE_REFERENCE.md#ai-privacy) dan daftar 15 operasi di Feature Reference.

## Cara Menggunakan Tool Advisor

Technique adalah pendekatan pengujian; tool adalah aplikasi eksternal; helper adalah fitur internal untuk menyusun/menganalisis catatan. Contoh: IDOR / BOLA / Object Ownership → Burp Repeater → Authorization Matrix Builder. Nama Object Ownership Matrix bukan helper tersendiri pada aplikasi ini.

Tanpa AI, buka **Tool Knowledge**, pilih technique, lalu baca rekomendasi offline beserta scope warning. Daftar difilter menurut izin yang dicatat dan kecocokan domain/tag technique. Dengan AI, buka **Tool Advisor** atau pilih Operation **Tool Advisor**; rekomendasi dibatasi kandidat Tool KB setelah hard policy filter. Aplikasi tidak menginstal atau menjalankan tools.

Tool KB memuat Burp Repeater, Caido, mitmproxy, Postman, curl, jq, Browser DevTools, Wireshark, Git, Docker, dan websocat dalam mode manual yang dijelaskan. Jika rekomendasi kosong, periksa asset, In Scope, tiga konfirmasi awal, exclusions, dan kecocokan technique. Tidak ada saran otomatis berbasis scan target.

## Cara Menggunakan Helper Advisor

Dengan AI, pilih Operation **Helper Advisor**; baca helperSuggestions dan alasan kegunaannya. Pemilihan helper tidak mengeksekusi helper. Buka **Internal Helpers** dan pilih helper sendiri.

Tanpa AI, langsung gunakan dropdown Internal Helper. Tersedia 11 helper: Authorization Matrix Builder, State Transition Builder, Trust Boundary Mapper, Evidence Comparator, Secret Redactor, Hypothesis Generator, Scope Checker, Finding Checklist, Duplicate Comparator, Report Builder, dan Research Gap Analyzer.

Authorization Matrix dan State Transition menyimpan row manual, bukan diagram atau generator semua kombinasi. Comparator evidence membandingkan keberadaan baris teks, bukan urutan/semantik respons. Duplicate Comparator memakai kemiripan teks lokal, bukan keputusan program. Input comparator/redactor yang belum disimpan hilang saat berganti view.

## Cara Membaca Research Coverage

Dashboard dan **Research Gaps** menunjukkan rasio **covered / total** untuk Technique, Actor, Object, State, dan Boundary. Contoh `Actor: 1 / 2` berarti satu dari dua actor yang dipetakan muncul dalam test yang hasilnya sudah dicatat.

Test PASS, FAIL, INCONCLUSIVE, dan VULNERABILITY semuanya berkontribusi karena sudah mempunyai hasil; NOT TESTED tidak. Actor/object/state dicocokkan melalui teks persis, technique/boundary lewat ID. Boundary hanya dihitung jika dipilih pada test. Teknik disabled tidak masuk denominator technique. State berasal dari Objects, Hypotheses, dan Test Cases.

Tidak ada grafik coverage per kategori Authorization/Async/OAuth dalam bentuk persen. Progress bar Dashboard hanya menunjukkan hasil tercatat dibanding seluruh test yang dibuat per technique. `0 / 0` berarti belum ada entri/test, bukan bukti aman. Coverage bukan penilaian kelengkapan semua kombinasi actor × object × state.

Daftar Untested membantu memilih langkah berikutnya. Pesan missing revocation/async/cross-surface memakai kata pada nama technique dan state test; bukan inspeksi semantik langkah/evidence. Review manual, lalu buat hypothesis/test baru untuk gap yang relevan. **AI Gap Analyzer** memberi saran draft tambahan dari context, bukan mengganti rasio lokal.

## Cara Menggunakan Knowledge Base

Buka **Knowledge Base → + Add Knowledge**. Isi judul, kategori, content, source/reference, dan metadata perbandingan bila relevan. Kategori: Technique Notes, Research Patterns, False Positives, Finding Patterns, Program Notes, Architecture Patterns, Lessons, Disclosed Reports.

Contoh lesson: `Pisahkan waktu enqueue, revoke, eksekusi worker, dan download ketika menguji export`. Simpan hasil PASS juga; pengetahuan tentang kontrol yang benar dapat mencegah pengujian berulang.

KB tersimpan per target. Global Search dapat menemukan lessons/KB lintas target; salin lesson yang relevan secara manual ke target baru. Reference disclosed report disimpan sebagai teks, tidak diunduh. Duplicate Comparator dapat memilih entri kategori Disclosed Reports/Finding Patterns/False Positives dari target aktif. AI hanya menerima KB bila Anda mencentang Include Knowledge Base.

## Backup dan Restore Workspace

IndexedDB adalah autosave lokal browser. `workspace.json` adalah backup portabel yang Anda ekspor; file root bukan database yang selalu ditulis aplikasi. Tunggu indikator **Saved locally** dan waktu Last saved. Jika storage error, Export Workspace untuk menyelamatkan snapshot memory saat ini.

Journal dipadatkan setelah jeda typing sekitar 80 ms dan primary setelah 350 ms; flush ketika tab disembunyikan/ditutup. Journal rusak atau dari revisi lama dikarantina dan tidak menimpa primary valid. Jika semua salinan tidak valid, editor read-only: gunakan **Export Recovery Data**, lalu **Import Backup** yang valid. Konflik save antar-tab memblokir penulisan tab stale; export perubahan lokal dan reload sebelum melanjutkan. Aplikasi belum menggabungkan perubahan antar-tab otomatis.

Export/connected-file memeriksa pola data sensitif dan menawarkan preview **Use Redacted**. Redacted JSON dapat mengubah identifier; **Export Original Backup** tersedia setelah konfirmasi tambahan untuk backup privat yang lossless. Reports memakai preview redaksi sebelum copy/download/print; pola yang tidak dikenal tetap perlu review manual. Draft report menampilkan status stale ketika sumber berubah; Generate Report atau Mark Sources Reviewed hanya setelah memeriksa sumber terbaru.

1. Tekan **↓ Export** pada header atau **Backup → Export Workspace/Export Backup**. Simpan JSON di lokasi yang Anda kelola.
2. Sebelum restore, ekspor workspace saat ini.
3. Tekan **Import Workspace/Import Backup**, pilih JSON, baca konfirmasi jumlah target, lalu setujui penggantian.
4. Import mengganti seluruh workspace aktif, bukan merge. JSON invalid ditolak tanpa mengganti data. Format v1 dimigrasikan ke v2; ID dan isi riset dipertahankan.
5. Tunggu Saved locally dan pastikan findings serta draft laporan masih tersedia.

Batas import 20 MB. Tidak ada enkripsi IndexedDB/JSON, sinkronisasi cloud, atau attachment binary dalam backup. Cadangkan screenshot/video asli dan lindungi JSON sesuai kebutuhan engagement. Jangan mengedit workspace yang sama di beberapa tab; tidak ada penggabungan konflik tab.

Jika browser menyediakan **Connect workspace.json**, pilih file dan tekan **Save to workspace.json** untuk menulis eksplisit. Hubungan file harus dibuat ulang setelah reload; Connect tidak membaca file sebagai import dan tidak mengaktifkan autosave filesystem.

**Reset Workspace menghapus seluruh target dan riset workspace browser aktif.** Ekspor backup dahulu. File download dan salinan legacy v1 tidak ikut dihapus. Menghapus data browser juga dapat menghapus autosave; export rutin sebelum menutup engagement atau berpindah browser.
