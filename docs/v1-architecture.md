# Universal Bug Bounty Research Workspace

Workspace **local-first** untuk analisis bug bounty manual lintas program. Mengembangkan playbook existing menjadi alur target → scope → attack surface → technique → hypothesis → manual test → evidence → finding → laporan Bahasa Indonesia. Tidak ada scanner, backend wajib, telemetry, atau interaksi otomatis dengan target.

## Menjalankan

Buka `index.html` langsung di Chrome, Edge, atau Firefox modern. Mode `file://` memakai `js/bundle.js` yang dibangun dari source ES Modules; tidak membutuhkan instalasi atau jaringan. Dokumentasi awal tersedia di `universal_bug_bounty_playbook.html`, dengan stylesheet aslinya `style.css`.

Untuk pengembangan memakai source modules, jalankan server statis lokal:

```powershell
python -m http.server 8000 --bind 127.0.0.1
```

Buka `http://127.0.0.1:8000`. Server ini hanya menyajikan file lokal, bukan backend aplikasi. Setelah mengubah source, perbarui bundle untuk penggunaan langsung:

```powershell
python scripts/build.py
```

File System Access API bersifat opsional dan bergantung browser, secure context, serta permission. Membuka `index.html` langsung dapat membatasi API ini. JSON import/export selalu tersedia. Data `file://` dan HTTP/port berbeda dapat memakai storage berbeda; pindahkan melalui export/import.

## Arsitektur & struktur

```text
index.html                          UI shell
universal_bug_bounty_playbook.html   Dokumentasi awal dipertahankan
style.css                           Style dokumentasi awal
assets/styles.css                   Style aplikasi responsive
js/app.js                           Composition, global search, import/export
js/store.js                         CRUD, timestamps, relasi entity
js/storage.js                       Validasi, migrasi, autosave, optional file API
js/router.js                        Hash navigation
js/utils.js                         Safe DOM, download, preview
js/forms.js                         Editor dan input reusable
js/technique-data.js                 Referensi teknik offline
js/loader.js                        Memilih ES Modules / bundle file lokal
js/bundle.js                        Generated; jangan edit langsung
js/modules/                         Dashboard, targets, scope, attack surface,
                                    techniques, hypotheses, tests, evidence,
                                    findings, reports, notes, settings
js/templates/report-id.js            Template laporan Indonesia deterministik
data/default-techniques.json         Seluruh 20 teknik playbook
data/example-workspace.json          Contoh fiktif workflow
data.json                           Workspace kosong canonical, bukan autosave
scripts/extract-techniques.py        Ekstrak dokumentasi teknik existing
scripts/build.py                     Build bundle tanpa dependency
tests/core.cjs                       Data integrity regression
tests/browser.py                    Workflow Chrome melalui DevTools
```

Semua perubahan melewati store. Module view menerima context `ctx` kecil, sementara persistence dan migrasi terpusat. DOM dibuat memakai `textContent`/text nodes. Komentar `MODULE`, `PURPOSE`, `DATA CONTRACT`, `SECURITY`, dan `EXTENSION POINT` menandai kontrak penting.

## Persistence & backup

1. **Autosave:** localStorage key `universal-bounty-workspace-v1`, debounce 350 ms; juga flush ketika export, pagehide, atau tab disembunyikan. UI menunjukkan Saved locally, Unsaved changes, Saving..., storage error, dan waktu simpan. Bila storage penuh/ditolak, perubahan masih ada di memory; segera Export Workspace.
2. **JSON:** Export Workspace mengunduh `data.json`; Export Backup mengunduh file dengan tanggal. Import memvalidasi seluruh file sebelum confirmation penggantian. JSON invalid tidak mengubah workspace. Reset selalu meminta confirmation. Export → reset → import mempertahankan state canonical, termasuk UUID, timestamps, relasi, custom techniques, notes, dan draft laporan.
3. **File System Access:** Settings → Connect data.json → Save to data.json. Connection tidak membaca file atau mengimpor otomatis, tidak ditulis saat autosave, dan perlu disambungkan kembali setelah reload. Pilih Import untuk membaca file existing. Penulisan hanya terjadi melalui tombol Save.

JavaScript tidak menulis arbitrary `data.json` di folder project. File `data.json` yang disediakan adalah awal kosong; mengubahnya tidak otomatis mengubah browser storage. Autosave bukan backup permanen: menghapus browser data menghapus workspace. Data lokal tidak terenkripsi.

## Schema JSON

```json
{
  "schemaVersion": "1.0.0",
  "applicationVersion": "0.1.0",
  "updatedAt": "ISO-8601",
  "targets": []
}
```

Target memiliki UUID, profile (`name`, `platform`, `programUrl`, `asset`, `environment`, `version`, `status`, `customNotes`), timestamps, scope dengan engagement `guard`, serta collections `actors`, `objects`, `boundaries`, `techniques`, `hypotheses`, `testCases`, `findings`, `evidence`, `notes`. Entity internal menggunakan UUID. Teknik bawaan di-clone per target dengan UUID dan `libraryId` referensi.

Relasi menggunakan `techniqueId`, `hypothesisId`, `testCaseId`, `findingId`, `evidenceIds`. Enam dimensi adalah `who`, `what`, `object`, `state`, `authority`, `context`. Actor/object pada formula disimpan sebagai snapshot teks agar catatan pengujian tidak berubah ketika pemetaan diubah. Penghapusan entity melepaskan referensi terkait, tanpa menghapus hasil riset lain. Menghapus target menghapus seluruh koleksinya setelah confirmation.

Migration terpusat di `migrateWorkspace(data)`. Versi schema yang belum didukung ditolak. Import memeriksa root, collections, duplicate IDs, tipe field, reference integrity, ukuran file (20 MB), batas kedalaman dan field besar, serta keys berbahaya. Extension fields aman dipertahankan, bukan dieksekusi. `evidence` yang tidak ada pada struktur minimal v1 dinormalisasi menjadi array kosong.

## Workflow contoh

1. Create Target **OpenAI Codex**, platform **Bugcrowd**, asset **Codex Desktop**. Catat scope dan izin sebenarnya sebelum pengujian.
2. Attack Surface → tambah actors **Owner**, **Member**, dan object **Approval**.
3. Techniques → **Approval / Capability Context Confusion** → Buat hypothesis.
4. Isi judul **Approval yang sudah digunakan mungkin dapat direplay.**, invariant dan enam dimensi.
5. Hypotheses → Buat Test Case → catat langkah, expected/actual result.
6. Test Cases → Attach Evidence → simpan metadata/teks yang sudah dire­daksi.
7. Promote to Finding → tinjau status dan impact. Severity awal selalu **Unknown**; hanya peneliti yang menetapkannya.
8. Findings → Generate Report → tinjau/edit Bahasa Indonesia → Download .md.
9. Export Workspace → refresh → data tetap tersedia. Import file itu pada browser/context baru untuk memindahkan seluruh workspace.

`data/example-workspace.json` berisi contoh fiktif dengan marker data dummy, bukan klaim vulnerability nyata. Impor contoh hanya pada workspace kosong atau setelah backup.

## Laporan & evidence

Template laporan bekerja sepenuhnya offline. Struktur berisi ringkasan, target, **Researcher Estimate**, prasyarat, authority awal, restriction, langkah reproduksi, expected/actual result, impact, root cause hypothesis, evidence, mitigasi, dan catatan. Fakta berasal dari catatan peneliti; root cause diberi label sebagai dugaan. Template tidak menyimpulkan severity, menerjemahkan teks input, atau mengarang dampak. Isi field dalam Bahasa Indonesia untuk laporan yang konsisten.

Editor Markdown autosave ke `finding.reportMarkdown`. Preview menampilkan subset Markdown secara aman; HTML dan links input tetap inert. Setelah memperbarui finding/evidence, tekan Generate Report untuk meregenerasi draft (confirmation jika draft tersimpan). Copy, `.md`, `.txt`, `.html`, dan Print tersedia. Tidak ada PDF generator; dialog print browser dapat digunakan secara manual.

Evidence besar tidak ditanam dalam JSON. `path` hanya metadata; simpan screenshot/video sendiri bersama backup. Teks HTTP/log dapat disimpan langsung. Warning pola secrets membantu review, **bukan jaminan redaksi**. Jangan menyimpan password, tokens, API keys, atau data pribadi yang tidak diperlukan.

## Security/privacy

Tidak ada CDN, remote fetch, analytics, telemetry, atau AI API. Resource yang dibaca adalah file aplikasi lokal. CSP membatasi scripts/resources. User input dan imported content dirender sebagai text nodes. HTML export meng-escape konten. Import tidak menjalankan code. LocalStorage dapat dibaca oleh script lain pada origin yang sama; gunakan origin lokal khusus dan backup yang aman. Data rusak pada startup tidak dihapus atau ditimpa otomatis; perubahan baru atau import/reset dapat menggantikannya.

## Menambah teknik dan template

Tambahkan custom technique melalui UI untuk target aktif. Untuk library bawaan lintas target, edit `data/default-techniques.json` dan perbarui export `DEFAULT_TECHNIQUES` di `js/technique-data.js`, lalu build bundle. Untuk mengekstrak ulang referensi asli, jalankan `python scripts/extract-techniques.py`; ini mengganti kedua file dari dokumentasi original. Library baru berlaku bagi target baru; target existing mempertahankan status dan catatannya.

Tambahkan template per program di `js/templates/` melalui kontrak `(target, finding) -> Markdown`. Jangan menempatkan migration atau network calls di template. Tetap gunakan data teramati, label dugaan secara eksplisit, dan severity pilihan peneliti.

## Verifikasi

```powershell
node tests/core.cjs
python tests/browser.py --chrome "C:/Program Files/Google/Chrome/Application/chrome.exe"
```

Core tests mendukung Node 12+. Aplikasi membutuhkan browser modern (ES Modules, UUID fallback, optional chaining). Browser tests memakai profile sementara di `.qa/`, bukan profile pengguna, dan menjalankan HTTP server hanya selama pengujian. Menguji workflow lengkap, downloads aktual, persistence/reload, import invalid, exact JSON round trip, navigation, input HTML inert, layout mobile, dan error console. Artifacts QA dapat memuat contoh workspace; jangan masukkan research nyata ke tests.

## Batasan & roadmap

- Desktop diprioritaskan; mobile memakai menu horizontal.
- Preview Markdown sederhana; tidak ada rich-text editor, graphical boundary editor, atau binary evidence storage.
- Tidak ada enkripsi workspace, sinkronisasi antar browser, atau conflict resolution multi-tab. Hindari mengedit workspace yang sama dari beberapa tab bersamaan.
- Clipboard dan File System Access mengikuti permission/support browser. Copy fallback memakai selection clipboard; teks tetap dapat disalin manual.
- Pembukaan langsung file lokal mendukung offline. HTTP mode membutuhkan static server lokal aktif; tidak ada service worker atau caching hosting.
- Roadmap extension: encrypted storage, evidence bundling, HAR/Burp import, CVSS/VRT/weakness mapping, per-program templates, optional AI rewriting dan team collaboration. Belum ada UI palsu untuk fitur tersebut.
