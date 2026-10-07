# Target Research Environment

Research Environment optional dan terpisah untuk setiap target. Target Intelligence, knowledge, hypotheses dan notes tetap bekerja tanpa account atau credential. Buka Target → Research Environment. Program/platform/URL memakai profil Target existing; Scope memakai halaman Scope existing. Tidak ada aturan khusus platform yang di-hardcode.

## Metadata dan Rules

Testing Environment menyimpan name, base URL, exact allowed assets per baris, workspace/organization/tenant, owned test data, dummy identifiers, rate limit, User-Agent requirement dan researcher identification requirement. Restrictions menyimpan automation/testing restrictions, program rules, safe harbor, known issues, out-of-scope notes, special instructions dan notes. Semua optional; jangan masukkan password/cookie/token pada metadata.

Structured Rules mendukung Allowed, Not Allowed dan Unknown untuk automation, authenticated testing, multiple accounts, third-party, production, destructive testing, social engineering, DoS, scanner, custom header dan researcher identification. Default seluruhnya Unknown. Setelah environment dibuat, structured rules menjadi source of truth menggantikan tiga checkbox legacy untuk policy/context AI; Unknown tidak memberikan izin. Existing scope dan engagement guard tetap diperlukan. Rate Limit adalah teks per program, bukan aturan universal.

Ready adalah kelengkapan metadata minimum (base URL, scope, rate limit dan keputusan automation), bukan verifikasi credential, izin independen atau kesiapan semua action. Dashboard hanya menampilkan Environment: Ready/Incomplete. Lihat halaman environment untuk detail.

## Accounts dan Authentication

Tambahkan multiple Test Accounts dengan role, purpose, username, tenant dan ownership. Buat Authentication Profiles dan hubungkan account/actor. Metode: None, Cookie, Bearer Token, API Key, Basic Auth, Custom Header, Manual. Role/account matrix memakai profile, actor dan account existing untuk authorization, ownership, tenant, lifecycle dan business logic research.

Hypothesis dan Test Case memiliki pilihan Authentication Context optional. Test dari hypothesis mewarisi profile. Profile hanya berlaku pada target tersebut; penghapusan profile melepas link hypothesis/test, dan penghapusan actor melepas actor link. Penghapusan account menghapus credential refs account serta profile yang terkait, tanpa menghapus research.

Session cookie dapat diperbarui secara terpisah dari authentication secret. Update tidak melakukan login/verifikasi, sehingga status selalu Unknown. Expired dapat ditandai manual. Active belum tersedia karena belum ada verifier/session executor; aplikasi tidak menyatakan cookie aktif berdasarkan input peneliti. Cookie Last Updated adalah waktu penyimpanan, bukan waktu verifikasi.

## Encrypted SecretStore

Create / Unlock Vault menggunakan passphrase minimal 12 karakter. Vault berada pada IndexedDB terpisah `universal-research-secret-vault`, encrypted AES-256-GCM dengan IV random per write dan key PBKDF2-SHA256, salt random, 310000 iterations. Record terikat pada secretRef/target/owner melalui authenticated additional data. Passphrase dan non-extractable key tidak disimpan, tidak masuk localStorage/journal/workspace, dan tidak dikirim backend/AI. Auto-lock setelah 10 menit idle, reload/page close; tersedia Lock Vault manual. Tidak ada plaintext fallback.

Update Credential/Authentication Secret/Session Cookie/Header Secret memakai input password kosong; existing secret tidak dibaca kembali atau ditampilkan. UI hanya Configured (reference) atau Not configured. Ref dapat ada setelah import sementara ciphertext tidak ada pada browser ini: label reference bukan jaminan availability. `SecretStore.getForAdapter` memerlukan unlocked vault dan binding target/owner yang tepat; credential tidak tersedia menyebabkan WAITING_FOR_ENVIRONMENT. Executor credential-aware belum tersedia pada v2; method ini bukan izin mengeksekusi network tool.

Headers memiliki nama/value, Secret dan Enabled. Default Secret Yes. Authorization/Cookie/API-key/token/session/CSRF header selalu secret, meskipun dipilih No; raw value ditolak pada editor metadata. Value non-secret adalah metadata yang memang boleh diekspor. Nama header harus valid dan value tidak boleh CR/LF. Tidak ada header provider yang dibuat otomatis.

Vault membutuhkan Web Crypto dan IndexedDB pada browser/origin yang mendukungnya. Jika tidak tersedia, secret operations gagal dengan pesan dan metadata tetap bekerja; jangan menganggap credential protected/available. Enkripsi at rest tidak melindungi terhadap script berbahaya yang berjalan ketika vault unlocked, passphrase lemah, malware/browser compromise atau kehilangan profile browser. Tidak ada recovery passphrase dan tidak ada secure vault export/backup mechanism. Simpan credential asal di password manager Anda.

## Export dan Persistence

Workspace JSON/connected-file/autosave/journal berisi metadata dan secretRef saja. Default export tidak memiliki plaintext atau ciphertext secrets. Import dapat memulihkan account/profile/rules/matrix, tetapi tidak memindahkan vault. Reload membutuhkan unlock kembali. Reset workspace tidak menghapus vault terpisah; orphan ciphertext bisa tetap ada agar import metadata tidak menghancurkan credential lokal. Hapus row account/profile/header melalui environment untuk menghapus ciphertext yang dirujuk; penghapusan Target/Reset dapat meninggalkan orphan ciphertext, bukan plaintext. Tidak ada export secrets atau evidence copy button.

Metadata import strict, menolak raw credential fields, unsafe keys, invalid/cross-target refs, duplicate rows, invalid rules dan authentication links. Known secret patterns yang ditempel ke environment metadata ditolak. Redactor adalah pattern detector, bukan jaminan semua data sensitif ditemukan; jangan tempel credential ke notes/evidence/report. Peneliti tetap bertanggung jawab pada informasi yang ditulis sendiri pada field bebas existing.

## Agentic Integration dan Limitasi

Agent context memakai metadata account/profile/role/tenant, credential configured flags, rules, rate limit dan restrictions. Tidak memakai username, raw credential, cookie, header secret value, ciphertext, secretRef atau vault key. Metadata juga melewati SecretRedactor. AI tidak memiliki akses SecretStore; normal report/evidence generation tidak membaca vault.

Native local adapters (knowledge search, JSON parse, evidence comparison) tetap bisa berjalan tanpa environment. Future target action gate memeriksa exact scope/allowed environment asset, tool permission, automation, authentication/multiple account/third-party/production/scanner rules, rate limit, required headers/identification, credential availability dan approval. Unknown → REQUIRES_REVIEW; missing/locked/expired authentication → WAITING_FOR_ENVIRONMENT; forbidden → DENIED. Bahkan pemeriksaan lengkap hanya menghasilkan APPROVAL_REQUIRED, bukan auto Allowed.

Implementasi masih **Partial untuk remote execution/session verification**: v2 tidak mempunyai HTTP/browser/network credential-aware adapter, rate-limit scheduler atau cookie verifier. AGENT_ALLOW_TARGET_REQUESTS=true tidak membuka network access. Local vault tidak dikirim ke backend; adapter masa depan harus mengambil credential setelah policy dan bound approval, lalu meredaksi hasil sebelum LLM. Jangan mengarang execution sukses, Active session atau permission untuk third-party.
