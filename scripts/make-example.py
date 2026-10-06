"""Create a fictional, fully related workspace fixture; never a real vulnerability claim."""
import json, uuid
from pathlib import Path
root=Path(__file__).resolve().parents[1]
uid=lambda:str(uuid.uuid4())
stamp='2026-10-06T08:00:00.000Z'
def entity(**values):return dict(id=uid(),createdAt=stamp,updatedAt=stamp,**values)
workspace=dict(schemaVersion='1.0.0',applicationVersion='0.1.0',updatedAt=stamp,targets=[])
(root/'data.json').write_text(json.dumps(workspace,ensure_ascii=False,indent=2)+'\n',encoding='utf-8')
techniques=[]
for original in json.loads((root/'data/default-techniques.json').read_text(encoding='utf-8')):
    technique=dict(original);technique.update(id=uid(),libraryId=original['id'],enabled=True,tested=False,interesting=False,notes='');techniques.append(technique)
technique=techniques[2]
formula=dict(who='Member',what='Approve',object='Approval',state='Used',authority='Approval dummy',context='Workspace B')
h=entity(title='Approval yang sudah digunakan mungkin dapat direplay.',invariant='Approval yang sudah digunakan MUST NOT dapat digunakan kembali.',expectedBehavior='Penggunaan kedua ditolak.',potentialFailure='Hipotesis fiktif: capability mungkin tidak divalidasi terhadap state terbaru.',techniqueId=technique['id'],priority='medium',confidence='low',status='planned',queue='Next',notes='CONTOH FIKTIF, bukan hasil pengujian produk nyata.',**formula)
t=entity(title='Replay approval dummy (contoh fiktif)',hypothesisId=h['id'],techniqueId=technique['id'],preconditions='Hanya environment dummy lokal yang diotorisasi.',steps='Buat approval dummy.\nGunakan approval dummy.\nCatat hasil penggunaan kedua.',expectedResult='Penggunaan kedua ditolak.',actualResult='Contoh observasi fiktif: dummy diterima kembali.',requestNotes='Marker: OWNED-DUMMY-EXAMPLE',responseNotes='Tidak ada token atau data nyata.',result='interesting',timestamp=stamp,evidenceIds=[],**formula)
e=entity(type='manual-note',label='Catatan dummy',path='',description='Fixture untuk mempelajari workflow.',content='CONTOH FIKTIF. Tidak ada pengujian terhadap OpenAI atau target eksternal.',testCaseId=t['id'],findingId='')
t['evidenceIds']=[e['id']]
f=entity(title='Replay approval dummy — contoh draft',status='draft',severity='Unknown',testCaseId=t['id'],techniqueId=technique['id'],affectedComponent='Codex Desktop (contoh profil saja)',affectedVersion='',vulnerabilityClass='Capability lifecycle',startingAuthority='Member menggunakan approval dummy milik peneliti.',securityRestriction=h['invariant'],protectedResource='Approval dummy',unauthorizedOutcome=t['actualResult'],rootCause=h['potentialFailure'],impact='Impact belum diverifikasi. Ini hanya contoh data.',preconditions=t['preconditions'],steps=t['steps'],expectedResult=t['expectedResult'],actualResult=t['actualResult'],evidenceIds=[e['id']],mitigation='Contoh rekomendasi: validasi penggunaan capability secara atomik.',researchNotes='Seluruh data ini fiktif dan tidak boleh disampaikan sebagai vulnerability nyata.',**formula)
target=entity(name='OpenAI Codex',platform='Bugcrowd',programUrl='',asset='Codex Desktop',environment='Dummy example only',version='',status='active',customNotes='CONTOH PROFIL FIKTIF; tidak menyatakan scope program sebenarnya.',scope=dict(inScope='Isi scope yang sebenarnya sebelum testing.',outOfScope='Semua aset yang tidak diotorisasi.',knownIssues='',rateLimits='',automationRules='',safeHarbor='',testingRestrictions='Tidak ada interaksi dengan target dari aplikasi.',testAccounts='Alias akun: Owner, Member',ownedDomains='',testWorkspaces='Workspace dummy B',dummyMarkers='OWNED-DUMMY-EXAMPLE',guard={}),actors=[entity(name='Owner',authority='Pemilik akun dummy',notes=''),entity(name='Member',authority='Anggota dummy',notes='')],objects=[entity(name='Approval',type='Approval',owner='Owner',tenant='Workspace B',state='Used',sensitivity='Dummy',notes='')],boundaries=[entity(**{'from':'Browser','to':'Backend','trust':'restricted','authority':'Approval dummy','notes':'Boundary fiktif.'})],techniques=techniques,hypotheses=[h],testCases=[t],findings=[f],evidence=[e],notes=[entity(type='scratchpad',title='Research Notes',content='Contoh fiktif untuk mencoba workspace. Import ini tidak membuktikan adanya vulnerability.')])
workspace['targets']=[target]
(root/'data/example-workspace.json').write_text(json.dumps(workspace,ensure_ascii=False,indent=2)+'\n',encoding='utf-8')
print('Canonical empty workspace and fictional example written.')
