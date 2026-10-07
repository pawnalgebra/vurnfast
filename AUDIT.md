# System Audit

Re-assessment 7 Oktober 2026 setelah perbaikan: **63/63 test lulus**, workflow Chrome lengkap lulus (offline/HTTP, manual, Copilot, Agentic, Environment, Message, mobile), dan regression browser recovery/dua-tab/sharing lulus. Provider memakai mock; kualitas inference live tidak dinilai ulang. Skor merupakan penilaian engineering, bukan sertifikasi.

Verifikasi lanjutan untuk Agent Message grup: **68/68 test lulus** dan workflow Chrome lengkap lulus kembali. Suite khusus grup membuktikan autocomplete langsung di atas input, semua agent tersedia, multi-mention, routing General/domain otomatis, pemilihan model dalam request dan setiap record, preview/remove file, redaksi teks, gambar, reload, mobile serta Pause. Crash saat reset target kosong yang ditemukan pada regresi sudah diperbaiki. Smoke live terbatas memakai OpenAI `gpt-5.4-mini`: General dan Domain Knowledge sama-sama COMPLETED dengan lampiran JSON sintetis; canonical research tidak berubah. Dua panggilan mencatat reservasi estimasi $0.06; billing aktual tetap Unknown. Smoke ini bukan evaluasi kualitas seluruh specialist/model. Skor di bawah tetap memakai basis re-assessment sebelumnya.

## Score

Functional: 8.5/10  
Flow: 8.3/10  
UI/UX: 7.8/10  
Data: 8.4/10  
Agentic AI: 8.2/10  
Security: 8/10  
Overall: 8.2/10

Sebelumnya: Functional 7.5, Flow 6, Data 6, Agentic AI 6.5, Overall 6.7.

## Critical Issues

**Tidak ada P0/P1 lama yang masih terulang dalam kasus audit yang diuji.** Path: **C** = client/js, **S** = server/services.

| Priority | Area | Problem | Fix |
|---|---|---|---|
| P2 | Vault lifecycle | Backup JSON tidak memulihkan credential vault; delete target belum membersihkan ciphertext yatim. (C/services/secret-store.js, C/store.js:deleteTarget) | Tambahkan backup vault terenkripsi dan cleanup terikat target. |
| P2 | Konteks besar | Sequential research membatasi koleksi; record lama di luar cap dapat luput dari analisis. (C/services/agent-context.js:buildAgentContext) | Retrieval berdasarkan hubungan/prioritas dan indikator konteks yang tidak disertakan. |
| P2 | Navigasi | Settings/Provider/Backup berbagi renderer; menu Agentic tetap tampil saat disabled. (C/app.js, C/router.js) | Fokuskan halaman/section dan sembunyikan kontrol runtime yang tidak relevan. |

Perbaikan terverifikasi:

- **Recovery:** primary valid tetap terbaca ketika journal rusak; journal stale dikarantina; semua salinan invalid membuat store read-only, lalu Import Backup valid memulihkan data. (C/storage.js:createStorageSession, C/store.js, C/app.js)
- **Dua tab:** revision check dalam transaksi IndexedDB membatalkan stale write; teks unsaved tetap tersedia untuk export. Snapshot/journal dicoalesce saat typing. (C/storage.js:write/makePersistence)
- **Review freshness:** canonical edit menandai proposal stale dan membatalkan pending approval; acceptance memeriksa revision, dengan kelanjutan sibling batch yang direview. (C/services/agent-research.js:decide, C/store.js:touch)
- **Re-analysis:** perubahan hypothesis/test/evidence/finding mengulang fase dependent; confirmed finding baru membuka report meskipun run sebelumnya selesai. (S/research-orchestrator.js:run)
- **Tool feedback:** hasil native adapter masuk specialist berikutnya dengan provenance local-derived, bukan observation target baru. (S/research-orchestrator.js, C/modules/agent-research.js)
- **Scope/snapshot:** Copilot dan Agentic memakai policy yang sama; fingerprint sumber penuh mengatasi preview evidence 4.000 versus 8.000 karakter. (C/services/rules.js, C/services/research-integrity.js)
- **Report/sharing:** draft menunjukkan perubahan sumber; copy/download/print/export memeriksa redaksi, sedangkan original backup memerlukan review/konfirmasi khusus. (C/modules/reports.js, C/services/share-review.js)

## Feature Status

| Feature | Status | Note |
|---|---|---|
| Target, Scope, Surface | GOOD | CRUD dan evaluator scope konsisten. |
| Intelligence, Domain, Technique | GOOD | Conversion mempertahankan hubungan dan provenance. |
| Hypothesis, Test, Evidence, Finding | GOOD | Referensi/observasi manual tetap canonical. |
| Report | GOOD | Draft sumber, redaction preview, dan download nyata teruji. |
| IndexedDB, migration, recovery, JSON | GOOD | Recovery/CAS/round trip teruji; konflik memerlukan reload. |
| Copilot/provider adapters/flags | GOOD | Guard runtime nyata; stale async response ditahan. |
| Supervised Orchestrator | GOOD | Phase invalidation dan feedback native tool teruji. |
| Review Queue/Manual Analysis/History | GOOD | Proposal stale ditahan; phase replan peneliti dipertahankan. |
| Agent Message | GOOD | Finding diteruskan ke false-positive/duplicate sebelum konfirmasi. |
| Native tools/approval/budget | GOOD | Permission, replay protection, dan estimasi budget tetap berjalan. |
| HTTP/browser/scanner executor | MISSING | Adapter eksternal tetap sengaja ditolak. |
| Research Environment | PARTIAL | Readiness metadata belum membuktikan credential/sesi aktif. |
| Credential Vault | PARTIAL | Enkripsi berjalan; backup/cleanup lifecycle belum lengkap. |
| Dashboard/helpers/search/coverage | GOOD | Dashboard menyertakan Next Manual Work dan coverage. |

## Flow Problems

- **Record lama di luar context cap -> Agent:** retrieval belum menjamin semua hubungan terkait masuk konteks.
- **Backup JSON -> authentication:** secret references tidak membawa ciphertext; vault harus tersedia pada browser asal.
- **Target deletion -> vault:** credential tidak lagi terhubung tetapi ciphertext masih tersimpan.

## UI/UX Problems

- Alias navigasi dan layar Settings terlalu padat; menu Agentic disabled masih terlihat.
- Konflik dua-tab aman tetapi penyelesaiannya masih export/reload/import manual.
- Agent Message sudah berada paling kanan; desktop/mobile dan buka/collapse/close terverifikasi.

## Missing / Unnecessary

- Missing: encrypted vault portability/cleanup, retrieval untuk workspace besar, dan conflict merge UI.
- Sederhanakan alias route; katalog tool dan executable inventory perlu tetap dibedakan dengan jelas.
- Redaksi berbasis pola serta kualitas inference tetap memerlukan pemeriksaan peneliti.

## Recommended Priority

1. **P2:** Lengkapi encrypted vault backup/restore dan cleanup target.
2. **P2:** Prioritaskan linked records dalam retrieval dan tampilkan batas konteks.
3. **P2:** Tambahkan preview perubahan untuk menyelesaikan konflik antar-tab.
4. **P2:** Ringkas navigasi dan kontrol disabled.
5. **P2:** Ukur typing/retrieval pada workspace besar dengan data representatif.

## Final Assessment

Sistem lebih siap dipakai untuk riset manual dan Agentic supervised. Functional, Flow, Data, dan Agentic meningkat karena recovery, freshness, re-analysis, serta feedback tool kini mempunyai regression test yang lulus. Data lokal tidak lagi tertimpa pada skenario journal rusak maupun stale save antar-tab yang diuji. Evidence/finding/report tetap dikendalikan observation canonical dan keputusan peneliti. Development berikutnya sebaiknya fokus pada lifecycle vault, retrieval skala besar, dan penyederhanaan navigasi.
