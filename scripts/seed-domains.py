"""Author initial domain packs as data, never target-company facts.

Run only to deliberately regenerate the shipped catalogs. User edits live in workspace.
"""
import json
from pathlib import Path
ROOT = Path(__file__).resolve().parents[1]
FINANCE_TERMS = [
 ('Account','Rekening atau identitas pembukuan untuk pemilik dana/aktivitas.','Ownership account menentukan authority transaksi.','Balance,Ledger'),
 ('Ledger','Catatan entri pembukuan yang merekam perubahan posisi.','Kontrol integritas harus mengikuti state transaksi.','Ledger Entry,Balance,Reconciliation'),
 ('Balance','Posisi saldo berdasarkan catatan pada suatu saat.','Bedakan saldo tercatat dan dana yang dapat digunakan.','Ledger,Available Balance'),
 ('Available Balance','Bagian saldo yang tersedia untuk digunakan setelah pembatasan/hold.','Jangan menyamakan dana tersedia dengan saldo keseluruhan.','Balance,Authorization'),
 ('Settlement','Penyelesaian kewajiban melalui perpindahan dana atau aset.','Keputusan authorization dan finalitas dapat terjadi pada tahap berbeda.','Clearing,Transaction,Reconciliation'),
 ('Clearing','Proses pertukaran dan pencocokan instruksi sebelum settlement.','State sebelum settlement perlu dipahami saat review kontrol.','Settlement,Reconciliation'),
 ('Transaction','Record suatu aktivitas ekonomi atau perpindahan nilai.','State dan pemilik transaksi menentukan aksi yang sah.','Transfer,Ledger'),
 ('Transfer','Instruksi memindahkan nilai dari sumber ke tujuan.','Sumber dana, beneficiary dan authority harus konsisten.','Account,Beneficiary,Transaction'),
 ('Beneficiary','Penerima yang dituju oleh transfer.','Perubahan penerima dapat mengubah context authorization.','Transfer,Account'),
 ('Merchant','Pihak yang menerima pembayaran atas barang/jasa.','Merchant mempunyai hak dan resource berbeda dari customer.','Payment,Settlement'),
 ('Payment','Aktivitas pembayaran beserta proses dan record terkait.','Bedakan request, authorization dan penyelesaiannya.','Authorization,Capture,Refund'),
 ('Authorization','Persetujuan atau keputusan izin untuk aksi pembayaran tertentu.','Persetujuan perlu terikat pada actor, jumlah dan tujuan yang sesuai.','Capture,Payment'),
 ('Capture','Tahap menindaklanjuti pembayaran yang telah diotorisasi sesuai proses produk.','Jangan menganggap authorization sama dengan dana sudah terselesaikan.','Authorization,Settlement'),
 ('Refund','Pengembalian nilai berdasarkan pembayaran/ketentuan yang relevan.','Hak dan penggunaan ulang aksi harus ditinjau.','Payment,Reversal'),
 ('Reversal','Pembalikan operasi atau entri sesuai mekanisme produk.','Bedakan pembalikan dari refund dan retry.','Transaction,Refund'),
 ('Reconciliation','Pencocokan record antar pihak atau sistem untuk mencari perbedaan.','Perbedaan state ledger dan settlement perlu penjelasan, bukan langsung vulnerability.','Ledger,Settlement,Clearing'),
 ('Chargeback','Proses sengketa atau pengembalian melalui mekanisme pembayaran yang berlaku.','Authority dan state dispute berbeda dari refund biasa.','Payment,Refund'),
 ('Withdrawal','Penarikan nilai dari account menurut aturan produk.','Periksa ownership dan prasyarat aksi pada data dummy.','Account,Limit'),
 ('Deposit','Penambahan dana/record masuk menurut proses produk.','Jangan menyimpulkan saldo final hanya dari request sukses.','Account,Settlement'),
 ('Limit','Batas aktivitas atau jumlah yang ditentukan produk.','Batas dapat bergantung actor, state atau periode.','Transfer,Withdrawal'),
 ('KYC','Proses mengenali customer sesuai kebijakan penyedia.','Status verifikasi adalah data dan authority sensitif.','Customer,Account'),
 ('AML','Kebijakan/proses untuk mengendalikan penyalahgunaan keuangan menurut penyedia.','Ini konteks domain, bukan panduan kepatuhan atau izin testing.','KYC,Transaction')]

# id, name, description, concepts, actors, objects, flow steps, invariants, techniques, terms
DEFS = [
 ('finance','Finance','Layanan untuk mencatat atau memindahkan nilai; flow generik perlu dicocokkan dengan produk aktual.',
  ['Ownership rekening','Integritas pembukuan','Finalitas dan state transaksi'],
  ['Customer','Merchant','Beneficiary','Bank','Payment Processor','Administrator','Compliance Officer','Service Account'],
  ['Account','Wallet','Transaction','Ledger Entry','Beneficiary','Payment','Refund','Settlement','Invoice','API Credential'],
  ['User','Create Transfer','Validate Account','Authorization','Balance Check','Transaction Created','Ledger Update','Settlement','Reconciliation'],
  ['Transaksi harus terikat pada account yang diotorisasi.','Refund yang selesai tidak boleh dieksekusi dua kali.','Authority yang dicabut tidak boleh mengizinkan eksekusi terlindungi.','Ledger harus konsisten dengan transisi transaksi yang diizinkan.'],
  ['tech_17','tech_08','tech_18','tech_02','tech_03'],FINANCE_TERMS),
 ('banking','Banking','Produk rekening dan layanan bank; istilah proses dapat berbeda antar penyedia.',
  ['Pemilik rekening','Mandat transaksi','Instruksi versus finalitas'],
  ['Customer','Account Holder','Teller','Bank Administrator','Approver','Compliance Officer','Service Account'],
  ['Account','Transfer Instruction','Beneficiary','Statement','Mandate','Ledger Entry','Deposit'],
  ['Customer','Create Instruction','Validate Mandate','Authorize','Post Entry','Settle','Reconcile'],
  ['Instruksi hanya dijalankan dengan mandat pemilik yang masih berlaku.','Statement tidak boleh terbaca oleh actor tanpa hak.','Approval harus terikat pada instruksi yang disetujui.'],
  ['tech_17','tech_03','tech_02','tech_18'],
  [('Mandate','Aturan atau pemberian authority untuk suatu rekening/aksi.','Perubahan mandat mengubah siapa boleh bertindak.','Account,Authorization'),('Statement','Ringkasan record aktivitas rekening pada periode tertentu.','Merupakan resource sensitif yang ownership-nya perlu dijaga.','Account,Ledger'),*FINANCE_TERMS[:7]]),
 ('fintech','Fintech','Produk teknologi untuk layanan nilai/pembayaran; pola ini tidak mengasumsikan lisensi atau mekanisme perusahaan.',
  ['Wallet dan account','Retry versus duplikasi','Proses async pembayaran'],
  ['Customer','Merchant','Beneficiary','Payment Processor','Administrator','Service Account'],
  ['Wallet','Payment','Refund','Settlement','API Credential','Webhook Event','Transaction'],
  ['Customer','Create Payment','Authorize','Submit','Process','Webhook','Reconciliation'],
  ['Retry tidak boleh menghasilkan efek ekonomi ganda yang tidak diizinkan.','Webhook harus terikat pada owner/merchant yang sah.','Worker memeriksa authority/state ketika menjalankan aksi.'],
  ['tech_18','tech_08','tech_09','tech_02'],
  [('Idempotency','Properti bahwa pengulangan operasi yang sama tidak menambah efek yang tidak diinginkan.','Penting ketika retry terjadi.','Retry,Payment'),('Wallet','Resource penyimpanan/representasi nilai sesuai model produk.','Ownership wallet menentukan authority.','Account,Transfer'),*FINANCE_TERMS[4:8],FINANCE_TERMS[15]]),
 ('saas','SaaS','Aplikasi sebagai layanan dengan organisasi, workspace dan resource; bentuk tenancy harus dikonfirmasi pada target.',
  ['Tenancy','Lifecycle membership','Role dan capability'],
  ['Guest','User','Member','Manager','Admin','Owner','Organization','Service Account'],
  ['Workspace','Organization','Project','Resource','Invitation','Role','Export','Session'],
  ['User','Organization','Workspace','Resource','Invite Member','Assign Role','Share Resource','Revoke Access'],
  ['Workspace A tidak boleh mengakses resource Workspace B tanpa izin.','Member yang dihapus harus kehilangan capability terlindungi sesuai kebijakan.','Viewer tidak boleh menjalankan operasi Owner.','Resource privat harus mengikuti perubahan state sharing.'],
  ['tech_14','tech_17','tech_16','tech_07','tech_15'],
  [('Tenant','Unit pemisahan customer/organisasi dalam layanan.','Context tenant harus ikut keputusan akses.','Workspace,Organization'),('Workspace','Area resource dan membership yang dikelola bersama.','Ownership dan role menentukan akses.','Tenant,Role'),('Role','Kelompok hak yang diberikan pada actor.','Nama role belum membuktikan permission efektif.','Authority,Member'),('Revocation','Pencabutan hak atau capability.','Perubahan harus diperiksa pada surface yang relevan.','Role,Session'),('Export','Hasil pengambilan data untuk suatu context.','File/worker bisa memiliki lifecycle sendiri.','Resource,Revocation')]),
 ('ai','Artificial Intelligence','Layanan model, aplikasi atau agent; pola generik bukan deskripsi arsitektur perusahaan tertentu.',
  ['Model dan inference','Authority agent/tool','Data input/output dan context'],
  ['Consumer User','Developer','Workspace Member','Administrator','API Client','Agent','Tool','Connector','Service'],
  ['Account','Conversation','Project','File','Model','API Key','Agent','Tool','Connector','Workspace','Organization','Session'],
  ['User','Account','Project','API Credential','Request','Model','Tool / Connector','Output'],
  ['Authority tool tidak boleh melebihi hak yang diberikan pengguna.','Data workspace harus tetap tenant isolated.','Connector hanya mengakses resource yang diotorisasi.','Credential revoked tidak boleh terus mengotorisasi operasi terlindungi.'],
  ['tech_03','tech_06','tech_14','tech_07','tech_17'],
  [('Inference','Proses menghasilkan output model dari input/context.','Output model bukan fakta yang otomatis terverifikasi.','Model,Context'),('Agent','Komponen yang dapat menyusun langkah atau menggunakan kemampuan yang diberikan.','Authority delegasi perlu dibatasi.','Tool,Connector'),('Connector','Integrasi yang mengakses resource pada layanan lain.','Resource dan consent membentuk trust boundary.','Tool,Authority'),('Model','Komponen yang menghasilkan prediksi atau output.','Bedakan model dari sistem yang memberi akses data.','Inference'),('Context','Informasi yang diberikan untuk pemrosesan model/sistem.','Dapat memuat data sensitif dan instruksi tidak tepercaya.','Inference,Connector')]),
 ('ecommerce','E-Commerce','Penjualan dan pemenuhan barang/jasa dengan checkout, order, dan refund.',
  ['Ownership order','State order/payment','Inventory dan fulfillment'],
  ['Customer','Seller','Buyer','Merchant','Warehouse Operator','Support','Administrator'],
  ['Product','Cart','Order','Payment','Coupon','Inventory','Shipment','Refund','Seller','Buyer'],
  ['Customer','Cart','Checkout','Payment','Order','Inventory','Fulfillment','Delivery','Refund'],
  ['Order harus terikat pada customer dan merchant yang benar.','Transisi refund harus memenuhi state serta hak yang berlaku.','Perubahan order tidak boleh melewati prasyarat pembayaran/fulfillment.'],
  ['tech_17','tech_18','tech_08','tech_09'],
  [('Fulfillment','Proses memenuhi order hingga siap dikirim/diserahkan.','State ini dapat mengubah aksi pembatalan/refund yang tersedia.','Order,Shipment'),('Inventory','Catatan ketersediaan resource/barang.','Konsistensi perubahan state perlu dijaga.','Order,Product'),('Checkout','Tahap memfinalkan pilihan dan informasi order.','Harga/pemilik/context perlu konsisten.','Cart,Payment'),('Coupon','Aturan manfaat/potongan untuk kondisi tertentu.','Prasyarat dan penggunaan perlu sesuai aturan.','Cart,Order')]),
 ('healthcare','Healthcare','Platform informasi dan pelayanan kesehatan; gunakan data sintetis dan batas izin yang ditentukan pemilik.',
  ['Consent dan purpose','Keterkaitan patient/resource','Role klinis dan administratif'],
  ['Patient','Clinician','Caregiver','Receptionist','Lab Operator','Administrator','Service Account'],
  ['Patient Record','Encounter','Observation','Appointment','Consent','Prescription','Document'],
  ['Patient','Appointment','Encounter','Observation','Review','Authorized Sharing','Consent Update'],
  ['Record pasien hanya tersedia bagi actor dan purpose yang diotorisasi.','Consent/context yang berubah harus diperhitungkan dalam akses berikutnya.','Resource tidak boleh tertaut pada identitas pasien yang salah.'],
  ['tech_17','tech_16','tech_07','tech_13','tech_15'],
  [('Consent','Catatan pilihan izin untuk aksi, penerima dan context tertentu.','Consent bukan izin universal untuk seluruh data.','Patient,Sharing'),('Encounter','Context pertemuan/layanan kesehatan pada model informasi.','Menentukan hubungan resource dan role.','Patient,Observation'),('Observation','Record pengamatan/hasil dalam model informasi.','Dapat mengandung data sensitif.','Patient,Encounter'),('FHIR Resource','Unit struktur data pada model FHIR.','Reference dan akses tetap harus diotorisasi.','Patient,Consent')]),
 ('cloud','Cloud','Layanan komputasi bersama dengan pengelolaan resource, identity, dan control/data plane.',
  ['Control plane dan data plane','Resource isolation','Credential lifecycle'],
  ['Tenant Administrator','Developer','Operator','Service Account','Workload','Support'],
  ['Account','Project','Compute Resource','Storage Object','Policy','Credential','Snapshot','Job'],
  ['Tenant','Project','Assign Policy','Provision Resource','Access Data','Rotate Credential','Delete Resource'],
  ['Identity suatu tenant tidak boleh mengelola resource tenant lain tanpa izin.','Policy dicabut harus dihormati pada operasi terlindungi.','Snapshot/storage harus mempertahankan ownership dan sensitivitas.'],
  ['tech_14','tech_16','tech_07','tech_02','tech_15'],
  [('Control Plane','Bagian layanan yang mengatur konfigurasi dan resource.','Authority administrasi berbeda dari akses data.','Data Plane,Policy'),('Data Plane','Bagian yang menjalankan atau membawa operasi/data layanan.','Akses data tetap membutuhkan izin efektif.','Control Plane'),('Policy','Aturan pemberian atau penolakan hak.','Policy aktual perlu ditinjau, bukan hanya nama role.','Credential,Authority'),('Snapshot','Salinan state/resource pada waktu tertentu.','Salinan bisa mempertahankan data sensitif.','Storage,Resource')]),
 ('developer-platform','Developer Platform','Layanan untuk proyek developer, API, build, release, dan integrasi.',
  ['Credential project','Delegasi integrasi','Lifecycle build/release'],
  ['Developer','Maintainer','Organization Owner','CI Worker','API Client','Service Account'],
  ['Project','Repository','API Credential','Build','Artifact','Release','Webhook','Integration'],
  ['Developer','Project','Credential','Request / Build','Artifact','Release','Webhook'],
  ['Credential harus terikat pada project dan capability yang diberikan.','Worker build tidak boleh memakai authority yang tidak berlaku.','Artifact privat harus mempertahankan aturan akses setelah publikasi/perubahan state.'],
  ['tech_17','tech_03','tech_02','tech_09','tech_15'],
  [('Artifact','Output build/proses yang disimpan untuk penggunaan berikutnya.','Ownership/lifecycle berbeda dari request awal.','Build,Release'),('API Credential','Credential yang dipakai client untuk akses API.','Scope dan revoke harus ditegakkan.','Project,API Client'),('Build','Proses menghasilkan artifact dari input.','Worker dan input membentuk boundary.','Artifact,Worker'),('Webhook','Pengiriman event ke destination yang dikonfigurasi.','Destination harus terikat pada owner sah.','Integration,Event')]),
 ('social-media','Social Platform','Interaksi pengguna, posting, sharing, moderasi, dan pesan.',
  ['Visibility resource','Membership dan moderasi','Identitas dan relasi pengguna'],
  ['User','Follower','Group Member','Moderator','Creator','Administrator','API Client'],
  ['Profile','Post','Message','Group','Media','Invitation','Moderation Action','Session'],
  ['User','Create Content','Set Visibility','Share','Join Group','Moderate','Remove Access'],
  ['Konten privat harus mengikuti visibility dan membership terkini.','Moderator hanya boleh melakukan aksi dalam context authority yang diberikan.','Identity/account linking harus tetap terikat pada akun yang benar.'],
  ['tech_17','tech_16','tech_07','tech_10','tech_13'],
  [('Visibility','Aturan siapa dapat melihat suatu resource.','Perubahan sharing bukan sekadar state UI.','Post,Group'),('Moderation','Aksi mengatur konten/pengguna dalam context komunitas.','Authority moderator perlu terikat context.','Role,Group'),('Direct Message','Pesan dengan penerima dan akses terbatas menurut produk.','Ownership/penerima harus jelas.','User,Message')]),
 ('telecommunication','Telecommunication','Pengelolaan subscriber, layanan konektivitas dan provisioning.',
  ['Subscriber identity','Provisioning state','Delegasi operator'],
  ['Subscriber','Account Owner','Operator','Support Agent','Partner','Service Account'],
  ['Subscriber Account','Subscription','Service Profile','Provisioning Job','Usage Record','Invoice','Credential'],
  ['Subscriber','Subscription','Validate Identity','Authorize Change','Provision','Activate','Usage','Billing'],
  ['Perubahan layanan harus terikat pada subscriber dan authority sah.','Job provisioning memvalidasi ulang state/izin ketika berjalan.','Usage record harus tetap terisolasi berdasarkan pemilik.'],
  ['tech_17','tech_16','tech_02','tech_18'],
  [('Provisioning','Proses mengonfigurasi atau menyediakan layanan/resource.','Job dapat berjalan setelah keputusan izin awal.','Subscription,Activation'),('Subscriber','Identitas pelanggan yang memperoleh layanan.','Bedakan subscriber, pengguna dan owner account.','Account,Subscription'),('Usage Record','Catatan penggunaan layanan.','Dapat mengandung metadata sensitif.','Billing,Subscriber')]),
 ('education','Education','Platform pembelajaran, enrollment, assessment, dan resource kelas.',
  ['Role pada kelas','State enrollment','Integritas assessment'],
  ['Student','Teacher','Guardian','Course Owner','Institution Administrator','Service Account'],
  ['Course','Enrollment','Assignment','Submission','Grade','Roster','Certificate','File'],
  ['Student','Enrollment','Course Access','Assignment','Submission','Assessment','Grade','Completion'],
  ['Student tidak boleh mengubah grade tanpa authority yang diberikan.','Resource kelas mengikuti enrollment terkini.','Submission/record tidak boleh berpindah pemilik tanpa izin.'],
  ['tech_16','tech_17','tech_07','tech_18','tech_15'],
  [('Enrollment','Keanggotaan/pendaftaran pada course atau institusi.','Lifecycle-nya menentukan akses resource.','Course,Student'),('Assessment','Proses penilaian pekerjaan/kompetensi.','Authority dan state perubahan perlu dipahami.','Grade,Submission'),('Roster','Daftar participant dalam suatu context kelas.','Merupakan resource identitas yang dapat sensitif.','Course,Enrollment')]),
 ('enterprise-software','Enterprise Software','Aplikasi proses organisasi dengan workflow, approval dan integrasi.',
  ['Authority berbasis organisasi','Approval workflow','Integrasi dan data export'],
  ['Employee','Manager','Approver','Administrator','Auditor','Integration Account'],
  ['Organization','Record','Approval','Document','Workflow','Export','Role','Integration'],
  ['Employee','Create Record','Request Approval','Manager Review','Authorize','Execute','Audit','Export'],
  ['Approval harus terikat pada record/action/context yang disetujui.','Employee tidak boleh memakai operasi administrator di luar authority.','Export dan integrasi hanya membawa data yang diotorisasi.'],
  ['tech_03','tech_16','tech_02','tech_15','tech_14'],
  [('Workflow','Urutan state/aksi bisnis yang mempunyai prasyarat.','Kontrol perlu mengikuti transisi aktual.','Approval,Record'),('Approval','Keputusan izin untuk actor/action/resource tertentu.','Replay atau context berubah perlu dipertimbangkan.','Workflow,Authority'),('Audit Trail','Record aktivitas untuk meninjau proses.','Catatan bukan bukti bahwa seluruh kontrol efektif.','Workflow,Record')])
]

SENSITIVE = {
 'finance':['Account identity and beneficiary details','Payment instructions and transaction history','Ledger and settlement records','Payment/API credentials'],
 'banking':['Account identity and mandates','Statements and transfer instructions','Ledger and customer verification records'],
 'fintech':['Wallet and merchant identity','Payment/refund events','API credentials and webhook secrets'],
 'saas':['Private workspace resources','Membership and role assignments','Exports and session credentials'],
 'ai':['Private prompts, conversations and files','Workspace and connector resource data','API keys and tool credentials'],
 'ecommerce':['Buyer addresses and contact details','Orders and payment references','Seller financial and inventory records'],
 'healthcare':['Patient identity and clinical observations','Prescriptions and encounter documents','Consent and recipient records'],
 'cloud':['Storage objects and snapshots','IAM policies and workload credentials','Tenant usage and audit records'],
 'developer-platform':['Source code and private artifacts','Build secrets and API credentials','Webhook and release configuration'],
 'social-media':['Private messages and restricted media','Identity and account-linking records','Group membership and moderation records'],
 'telecommunication':['Subscriber identity and service details','Usage and billing records','Provisioning credentials'],
 'education':['Student identity and class rosters','Submissions, grades and assessment records','Guardian and enrollment details'],
 'enterprise-software':['Confidential documents and exports','Approval and organizational records','Integration credentials']
}
ASSETS = {
 'finance':['Account','Transaction','Ledger Entry','Payment','Refund','Settlement','API Credential'],
 'banking':['Account','Mandate','Transfer Instruction','Ledger Entry','Statement'],
 'fintech':['Wallet','Payment','Refund','Settlement','API Credential','Webhook Event'],
 'saas':['Workspace','Resource','Role','Export','Session'],
 'ai':['API Key','Project','File','Conversation','Connector','Workspace'],
 'ecommerce':['Order','Payment','Inventory','Shipment','Refund'],
 'healthcare':['Patient Record','Observation','Consent','Prescription'],
 'cloud':['Storage Object','Policy','Credential','Snapshot'],
 'developer-platform':['API Credential','Repository','Artifact','Release','Integration'],
 'social-media':['Message','Media','Group','Moderation Action','Session'],
 'telecommunication':['Subscriber Account','Service Profile','Provisioning Job','Usage Record'],
 'education':['Submission','Grade','Roster','Certificate'],
 'enterprise-software':['Approval','Document','Workflow','Export','Integration']
}
REASONS = {
 'tech_01':'State machine: bandingkan prasyarat dan authority pada setiap transisi bisnis.',
 'tech_02':'Async revalidation: periksa apakah worker memakai authority/state yang masih berlaku ketika job dieksekusi.',
 'tech_03':'Capability context: persetujuan harus terikat pada actor, action, resource dan context yang diberikan.',
 'tech_06':'Cross-context boundary: bandingkan authority yang didelegasikan antar app, agent, tool dan connector.',
 'tech_07':'Revocation/lifecycle: periksa capability dan resource turunan setelah izin, membership atau credential dicabut.',
 'tech_08':'Race/TOCTOU: tinjau apakah validasi dan efek bisnis tetap konsisten saat transisi berdekatan.',
 'tech_09':'Webhook ownership: event dan destination harus tetap terikat pada owner serta context bisnis yang sah.',
 'tech_10':'Realtime authorization: subscription/socket perlu mengikuti perubahan visibility, membership dan authority.',
 'tech_13':'Account linking: identitas dan consent harus terikat pada akun serta recipient yang benar.',
 'tech_14':'Tenant isolation: resource dan capability satu organisasi tidak memberi akses ke organisasi lain.',
 'tech_15':'File/share/export: salinan, link dan export harus mempertahankan ownership serta perubahan akses.',
 'tech_16':'Vertical authority: operasi privilege tinggi harus menolak actor tanpa hak efektif yang sesuai.',
 'tech_17':'Object ownership: actor harus berhak atas object, account atau record yang dirujuk pada flow.',
 'tech_18':'Business logic: retry, urutan aksi dan state terminal tidak boleh menambah efek bisnis yang melanggar invariant.'
}

def build():
    directory = ROOT/'data/domains'; directory.mkdir(exist_ok=True)
    for id,name,description,concepts,actors,objects,steps,invariants,techniques,terms in DEFS:
        provenance = dict(sourceType='domain',source='Pack riset generik lokal; bukan fakta perusahaan',confidence=0.8,verified=False,notes='Adaptasikan dengan dokumentasi target dan scope; pola bukan vulnerability target.')
        def item(kind,index,title,content=''):
            return dict(id=f'{id}-{kind}-{index+1}',title=title,content=content,**provenance)
        act = [item('actor',i,a,'Peran tipikal; hak efektif harus dikonfirmasi pada target.') for i,a in enumerate(actors)]
        obj = [item('object',i,o,'Resource bisnis tipikal; ownership, state dan sensitivitas perlu dipetakan.') for i,o in enumerate(objects)]
        flowid=f'{id}-flow-1'
        inv=[dict(**item('invariant',i,v,v),flowId=flowid,techniqueIds=[techniques[i%len(techniques)]]) for i,v in enumerate(invariants)]
        boundary=[dict(**item('boundary',0,'Authorization → Execution','Authority harus tetap sesuai ketika aksi terlindungi benar-benar dijalankan.'),fromComponent='User / Client',toComponent='Backend / Worker',channel='request / job',authority='Izin actor untuk object dan state yang berlaku',flowId=flowid)]
        flow=dict(**item('flow',0,name+' — flow generik',description),steps=steps,actorIds=[a['id'] for a in act],objectIds=[o['id'] for o in obj],boundaryIds=[b['id'] for b in boundary],invariantIds=[v['id'] for v in inv],transitions=[dict(id=f'{id}-transition-{i+1}',fromState=steps[i],toState=steps[i+1],action=f'{steps[i]} → {steps[i+1]}',critical=any(word in (steps[i]+' '+steps[i+1]).lower() for word in ['author','revoke','refund','execute','settle','share','credential','approval']),invariantIds=[v['id'] for v in inv]) for i in range(len(steps)-1)])
        patterns=[item('pattern',0,'Authorization mismatch','Bandingkan authority efektif, owner, state dan context sebelum menyimpulkan kontrol gagal.'),item('pattern',1,'Stale authorization','Pertanyaan generik: apakah authority lama masih dipakai setelah perubahan state?'),item('pattern',2,'State desynchronization','Perbedaan state antarkomponen perlu kontrol timing dan evidence; belum tentu vulnerability.')]
        mappings=[dict(**item('mapping',i,'Technique '+tid,REASONS[tid]+' Tinjau '+name+' flow bersama invariant terkait; gunakan hanya scope yang diotorisasi.'),techniqueId=tid,flowId=flowid,invariantId=inv[i%len(inv)]['id'],researchPriority=60+(i%3)*10) for i,tid in enumerate(techniques)]
        questions=[dict(**item('question',i,'Bagaimana memastikan: '+v['title'],v['content']+' Apa expected behavior jika owner, authority atau state berubah sebelum execution; apa evidence yang membedakan kontrol efektif dari pelanggaran?'),flowId=flowid,invariantId=v['id'],techniqueId=v['techniqueIds'][0]) for i,v in enumerate(inv)]
        glossary=[dict(**item('term',i,t,d),term=t,definition=d,whyImportant=w,relatedTerms=r.split(',')) for i,(t,d,w,r) in enumerate(terms)]
        pack=dict(id=id,name=name,description=description,notes='Contoh pembelajaran; bukan klaim tentang perusahaan atau izin testing.',provenance=provenance,coreConcepts=concepts,terminology=glossary,actors=act,businessObjects=obj,businessFlows=[flow],sensitiveData=[item('sensitive',0,'Identity / account data','Gunakan alias dan data sintetis untuk penelitian.'),item('sensitive',1,'Credentials dan protected business records','Jangan memakai credential/data pihak lain; redaksi evidence sebelum dibagikan.')],criticalAssets=[item('asset',0,objects[0],'Ownership menentukan siapa dapat melakukan aksi terlindungi.'),item('asset',1,objects[-1],'Lifecycle dan authority resource perlu dicatat.')],commonTrustBoundaries=boundary,securityInvariants=inv,commonFailurePatterns=patterns,relevantTechniques=mappings,researchQuestions=questions,references=[])
        pack['sensitiveData']=[item('sensitive',i,title,'Kategori data generik '+name+'; konfirmasi sensitivitas pada target dan gunakan data dummy/redaksi.') for i,title in enumerate(SENSITIVE[id])]
        pack['criticalAssets']=[item('asset',i,title,'Nilai bisnis terkait integritas, ownership dan authority pada '+name+' flow; bukan penilaian severity target.') for i,title in enumerate(ASSETS[id])]
        if id=='finance':
            inv[1]['flowId']='finance-flow-2'
            inv[1]['techniqueIds']=['tech_08','tech_18']
            refund_steps=['Merchant','Select Payment','Authorize Refund','Validate Refund State','Execute Refund','Ledger Update','Refund Completed','Reconciliation']
            refund=dict(**item('flow',1,'Finance — refund generik','Flow pengembalian nilai; prasyarat aktual harus dikonfirmasi.'),steps=refund_steps,actorIds=flow['actorIds'],objectIds=flow['objectIds'],boundaryIds=flow['boundaryIds'],invariantIds=[inv[1]['id'],inv[2]['id'],inv[3]['id']],transitions=[dict(id=f'finance-refund-transition-{i+1}',fromState=refund_steps[i],toState=refund_steps[i+1],action=f'{refund_steps[i]} → {refund_steps[i+1]}',critical=i in [1,2,3,4,5],invariantIds=[inv[1]['id'],inv[2]['id'],inv[3]['id']]) for i in range(len(refund_steps)-1)])
            pack['businessFlows'].append(refund)
            flow['invariantIds'].remove(inv[1]['id'])
            for transition in flow['transitions']:transition['invariantIds']=flow['invariantIds'][:]
            questions[1]['flowId']=refund['id']
            mappings[1]['flowId']=refund['id']
        if id in ['finance','banking','fintech']:
            pack['references']=[dict(title='BIS CPMI — glossary clearing/settlement/reconciliation',url='https://www.bis.org/cpmi/publ/d00b.htm',notes='Referensi istilah proses pembayaran; invariant dan contoh penelitian adalah kurasi lokal.')]
        elif id in ['saas','cloud']:
            pack['references']=[dict(title='NIST SP 800-145 — cloud service models',url='https://www.nist.gov/publications/nist-definition-cloud-computing',notes='Referensi model layanan; mapping kontrol adalah pola riset generik.')]
        elif id=='healthcare':
            pack['references']=[dict(title='HL7 FHIR R4 — Consent',url='https://hl7.org/fhir/R4/consent.html',notes='Referensi representasi consent; bukan panduan hukum/klinis atau klaim sistem target.')]
        elif id=='ai':
            pack['references']=[dict(title='NIST AI Risk Management Framework',url='https://www.nist.gov/itl/ai-risk-management-framework',notes='Referensi kerangka istilah AI; contoh agent/tool adalah kurasi riset generik.')]
        (directory/(id+'.json')).write_text(json.dumps(pack,ensure_ascii=False,indent=2)+'\n',encoding='utf-8',newline='\n')
    print('13 domain packs generated.')

if __name__=='__main__': build()
