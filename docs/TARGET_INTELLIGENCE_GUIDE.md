# Target Intelligence & Domain Knowledge Engine

Understand the business before testing the technology. Engine ini membantu memahami company/sector/business/actor/object/flow sebelum menyusun rencana pengujian. Materi domain adalah pola umum, bukan deskripsi perusahaan nyata atau klaim vulnerability.

## Mulai dengan Example Finance

1. Create Target: Example Finance, Private, asset `finance.example.test`, environment laboratorium sendiri.
2. Isi Scope/Rules/Guard dengan izin laboratorium, akun dan data dummy; aturan pembayaran/settlement domain tidak memberi izin menjalankan transaksi nyata.
3. Target Intelligence → pilih Finance pada Primary Sector; Fintech boleh menjadi Secondary Domain jika sesuai laboratorium. Tekan Save Domain Classification.
4. Edit Intelligence Profile: company, business model, products/services, users, assets, sensitive data, operations/dependencies/surfaces/notes. Nilai menjadi RESEARCHER INPUT; kosong berarti Unknown.
5. Pilih pack Finance lalu Learn This Domain. Pilih Beginner terlebih dahulu, kemudian Intermediate/Advanced. Gunakan Browse Full Pack untuk semua sections.
6. Terminology → baca Account, Ledger, Balance/Available Balance, Settlement, Clearing, Reconciliation, Authorization/Capture/Refund dan istilah lain. Glossary Finance memiliki 22 istilah.
7. Domain Knowledge → Browse Full Pack → Actors. Review / Import actor membuka editor; isi authority nyata dan Simpan. Objects memakai langkah review yang sama. Tidak ada akun/resource target yang dibuat otomatis.
8. Business Flows → pelajari flow generik transfer, pilih transition Authorization → tahap berikutnya, baca invariant dan relasinya. Mark / Unmark Critical dan Edit Flow Relationships menyimpan override pack di workspace.
9. Review / Save Business Flow atau Flow → Invariant → Question. Editor review menjaga source/confidence/notes; knowledge masuk target hanya setelah Simpan.
10. Research Questions → Convert to Hypothesis. Review invariant, technique, WHO/WHAT/OBJECT/STATE/AUTHORITY/CONTEXT, expected behavior, priority dan scope. Simpan lalu Buat Test Case.
11. Lanjutkan manual authorized testing, evidence, finding dan report memakai [Workflow Guide](WORKFLOW_GUIDE.md). Knowledge engine tidak membuat finding tanpa tindakan peneliti.

## Fakta, Pengetahuan, dan Inferensi

| Badge / sourceType | Arti | Batas |
| --- | --- | --- |
| TARGET FACT / target | Informasi target yang dinyatakan terverifikasi oleh peneliti | Source/reference wajib dan verified=true; software tidak memeriksa sumber secara independen |
| DOMAIN KNOWLEDGE / domain | Konsep, flow, actor, invariant atau pola generik sektor | Tidak membuktikan target memakai mekanisme tersebut |
| RESEARCHER INPUT / researcher | Catatan peneliti, termasuk profil yang diisi manual | Belum otomatis terverifikasi |
| AI INFERENCE / ai | Draft model dari context supplied | AI GENERATED, confidence 0–1, verified=false, notes wajib |
| External / external | Reference/catatan eksternal yang dimasukkan peneliti | Bukan TARGET FACT tanpa verifikasi eksplisit |
| UNKNOWN / unknown | Informasi belum tersedia | Jangan menggantinya dengan tebakan |

Accept / Edit Knowledge menyimpan draft dengan asalnya. Jika title/content domain diadaptasi saat review, source menjadi RESEARCHER INPUT dengan catatan sumber domain. Edit flow/relationships atau critical marking juga menjadi input peneliti. Verify as Target Fact hanya digunakan setelah memeriksa sumber: isi reference dan konfirmasi verifikasi. Item yang berasal dari AI tetap menyimpan origin AI GENERATED. Edit isi target fact menurunkan verifikasi; review ulang sebelum menjadikannya fact lagi.

Contoh: API key merupakan credential sensitif adalah domain knowledge. Company tertentu menyediakan API hanya target fact bila sumber sudah Anda periksa. Worker mungkin memproses export asynchronous tetap inference sampai ada informasi/bukti yang memadai.

## Pack dan Learning Mode

Pack awal: Artificial Intelligence, Finance, Banking, Fintech, SaaS, E-Commerce, Healthcare, Cloud, Developer Platform, Social Platform, Telecommunication, Education, Enterprise Software. Satu target boleh menggunakan beberapa domain, tetapi memilih materi pada Knowledge Domain tidak otomatis mengganti klasifikasi target; Save Domain Classification diperlukan.

Beginner menampilkan concepts, tiga term awal dan flow. Intermediate menambah actor/object, sensitive data, critical operations dan invariants. Advanced menambah lebih banyak terminology, research patterns dan technique mapping. Materi offline tersedia tanpa AI. Penjelasan AI dipilih melalui Operation Explain Domain/Explain Terminology dan hanya dipanggil sesudah preview/send.

Packs tersimpan sebagai JSON pada `data/domains/`. Aplikasi memakai bundle data untuk file://; domain tidak di-hardcode pada renderer UI. Default pack tidak berubah ketika user membuat override. Override/custom tersimpan di `workspace.domainPacks` dan ikut IndexedDB/JSON backup. Domain Knowledge → Remove Custom / Restore Default menghapus override/custom saja; snapshot knowledge/research yang sudah diimpor tetap ada.

## Custom Domain dan Relationships

+ Custom Domain Pack menyediakan name, description, core concepts, glossary (`term | definition | whyImportant | related,terms`), actors, objects, flows (`Create → Authorize → Execute`), sensitive data, assets, invariants, patterns, notes.

Custom form menghasilkan entri dasar, bukan pengetahuan lengkap otomatis. Setelah dibuat:

1. Business Flows → Edit Flow Relationships untuk memilih actors, objects, boundaries dan invariants terkait.
2. Mark / Unmark Critical untuk transition yang memang perlu perhatian.
3. Domain Knowledge → + Technique Mapping untuk technique, reason, related flow/invariant dan research priority 0–100.
4. Edit Pack JSON untuk advanced boundaries, questions, references, serta metadata/relationship detail. Struktur dapat ditiru dari Export Domain Pack. Import Domain Pack maksimal 1 MB dan divalidasi sebelum save.

Referensi domain item memakai ID yang stabil. Jangan mengubah ID tanpa memperbarui relationships. Import pack bukan merge otomatis; mengganti ID pack yang sama menjadi override setelah konfirmasi. Custom pack yang dihapus dapat meninggalkan classification reference lama; pilih klasifikasi yang tersedia kembali. Historical knowledgeLinks adalah snapshot untuk penelusuran, bukan foreign-key yang selalu direwrite setelah pack berubah.

## Business Flow → Research Flow

```text
Domain / Sector
  → Business Flow
  → Actor + Object + Trust Boundary
  → Critical Transition
  → Security Invariant
  → Research Question
  → Technique Mapping
  → Hypothesis (review dan Save)
  → Test Case (pengujian manual)
  → Evidence → Finding → Report
```

Flow → Invariant → Question memakai invariant yang dikaitkan ke flow/transition. Bila belum ada kaitan, aplikasi meminta peneliti melengkapinya. Flow → Hypothesis membuka draft dengan invariant/technique yang tersedia; tidak menjalankan test. Question/invariant dapat dikonversi langsung dengan Convert to Hypothesis.

Hypothesis menyimpan knowledgeLinks domainId/flowId/transitionId/invariantId/questionId/sourceType. Relasi tersebut diteruskan ke test dan finding ketika dibuat/promoted dari sumber. Mengedit atau menghapus pack tidak mengganti fakta historis pada hasil test. Priority mapping adalah prioritas riset, bukan severity finding.

Actor/object/boundary suggestions selalu membuka editor sebelum masuk mapping riset. Peneliti harus mengisi ownership/tenant/authority/trust yang sesuai target; generic role name belum membuktikan permission. Provenance asal dibawa pada record mapping hasil import.

## AI Knowledge Assistant

Prasyarat dan provider/privacy sama dengan [panduan AI](USER_GUIDE.md#cara-menggunakan-ai). AI_ENABLED=false mempertahankan semua fungsi manual. Generate Target Knowledge memerlukan AI configured; button/action tidak memberikan data perusahaan dari layanan lookup lain.

| Operation | Input yang penting | Output / kapan dipakai |
| --- | --- | --- |
| Generate Target Knowledge | Profil/knowledge target, domain, notes, scope | Draft company/sector/business/actors/objects/assets/data/flow/term/boundary/invariant/question sebelum mapping |
| Analyze Target | Target knowledge dan pertanyaan bisnis | Penjelasan dan Unknown information ketika profil belum lengkap |
| Suggest Domain | Catatan produk/services dan katalog label sektor | Primary/secondary suggestions; final classification direview peneliti |
| Explain Domain | Selected domain dan depth | Penjelasan ringkas concepts/flows/invariants saat belajar |
| Explain Terminology | Selected term | Definition/relations/context yang perlu direview |
| Ask About Target | Pertanyaan spesifik + supplied target/domain context | Jawaban inference/Unknown, bukan klaim fakta dari ingatan brand |
| Analyze Business Flow | Selected flow/critical context | Boundary/invariant/question draft sebelum hypothesis |
| Identify Critical Assets | Domain dan business context | Asset/sensitive-data candidates untuk mapping |
| Generate Security Invariants | Flow, authority, object dan context | Aturan kandidat untuk review/conversion |
| Generate Research Questions | Domain/flow/invariant | Question drafts yang dapat diterima dan dikonversi |
| Recommend Techniques | Mapping domain, technique enabled dan scope | Teknik kandidat tersedia; tidak ada library/tool baru yang dieksekusi |

Pilih operasi pada form AI Knowledge Assistant, lalu term/flow/current hypothesis bila relevan. Preview Knowledge Context menampilkan payload pilihan: hanya target aktif, selected pack yang dibatasi, label katalog domain, profile/accepted knowledge yang dibatasi, hingga delapan actor/object/boundary, satu current hypothesis, dan teknik mapping relevan. Tidak ada evidence binary/raw, key provider, target lain, atau seluruh database dalam request knowledge ini.

Send Knowledge Analysis baru menghubungi provider. Results tersimpan sebagai suggestion pending, bukan facts/mapping otomatis. Setiap item memiliki sourceType/confidence/notes/verified dan label AI GENERATED. Backend menahan company overview sebagai Unknown bila context tidak memuat TARGET FACT terverifikasi, menolak output schema invalid, membatasi sector/technique IDs, dan memakai hard scope policy. Tidak ada browsing perusahaan otomatis. Model masih dapat menghasilkan inferensi yang salah; review isi sebelum menerima.

Accept / Edit Knowledge menyimpan item target unverified; Reject Item/Reject Sector/Reject Suggestion menolak draft. Review Sector Classification meminta primary/secondary choice sebelum mengubah klasifikasi. Setelah semua item/sector ditinjau, status batch terselesaikan; status accepted adalah status review, bukan validity atau verifikasi fakta. Mapping/konversi tetap tindakan eksplisit terpisah.

Research Assistant lama dapat menerima accepted intelligence dan selected domain summaries melalui opsi Include Knowledge Base. Default opt-in tetap off. Request lama memakai context risetnya sendiri; request Knowledge Assistant memakai context yang dipilih dan dibatasi seperti di atas.

## Search, Storage, dan Batasan

Global Search sekarang mencakup targets/profile, terminology, flow, techniques, invariants, research patterns, findings, lessons dan catatan riset. Cari `reconciliation` untuk melihat Finance Terminology, Finance Business Flow, related invariants dan technique mappings. Relasi flow text membantu discovery hasil terkait; ini pencarian teks lokal, bukan semantic search/Internet search. Maksimal 200 hasil ditampilkan. Filter target membatasi catatan target; domain packs tetap katalog global workspace.

IndexedDB autosave dan Export Workspace/Backup memuat target.intelligence, suggestions/decisions, custom/override domainPacks, dan knowledgeLinks. Schema tetap 2.0.0 dengan extension fields yang divalidasi; workspace v1/v2 lama mendapat struktur intelligence/domainPacks kosong saat dibaca. Backup/restore bukan merge, tidak terenkripsi, dan binary evidence tetap dikelola terpisah.

System ini tidak mengetahui perusahaan hanya dari namanya. Domain packs merupakan materi pembelajaran awal dengan flow generik; custom/JSON editor diperlukan untuk model bisnis yang lebih detail. Tidak ada graph visual interaktif, connector lookup perusahaan, atau verifikasi independen URL. Knowledge relationships tersedia sebagai data dan daftar relasi/diagram teks, lalu trace links pada riset. Tidak ada vulnerability atau severity yang ditentukan knowledge engine.

## Referensi Materi Generik

Istilah clearing/settlement/reconciliation diringkas dari [BIS CPMI glossary](https://www.bis.org/cpmi/publ/d00b.htm). Model SaaS/cloud mengacu pada [NIST SP 800-145](https://www.nist.gov/publications/nist-definition-cloud-computing). Consent healthcare memakai [HL7 FHIR R4 Consent](https://hl7.org/fhir/R4/consent.html). Pack AI menautkan [NIST AI RMF](https://www.nist.gov/itl/ai-risk-management-framework) sebagai kerangka referensi.

Actors, flows, invariant dan technique mapping dalam packs adalah kurasi riset generik lokal. Referensi tersebut tidak membuktikan implementasi target atau memberikan izin pengujian.
