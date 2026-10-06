// MODULE: Offline Indonesian report template.
// SECURITY: This deterministic template never infers impact or severity; researcher text is retained.
// EXTENSION POINT: Add named per-program templates here without changing stored findings.
export function generateIndonesianReport(target,finding) {
  const text=value=>String(value||'Belum dicatat.').replace(/\r\n/g,'\n');
  const steps=(finding.steps||'').split('\n').map(s=>s.trim().replace(/^\d+[.)]\s*/, '')).filter(Boolean);
  const evidence=(finding.evidenceIds||[]).map(id=>target.evidence.find(e=>e.id===id)).filter(Boolean);
  const technique=target.techniques.find(t=>t.id===finding.techniqueId);
  const summary=`Pada pengujian manual terhadap ${text(target.name)}, peneliti mencatat hasil berikut: ${text(finding.unauthorizedOutcome||finding.actualResult)}\n\nStatus penelitian: ${text(finding.status)}. Klasifikasi yang dicatat peneliti: ${text(finding.vulnerabilityClass)}. Protected resource: ${text(finding.protectedResource)}. Laporan ini mengikuti observasi dan evidence yang dilampirkan; bagian root cause merupakan hipotesis yang perlu diverifikasi.`;
  return `# ${text(finding.title)}

## Ringkasan

${summary}

## Target yang Terdampak

Program: ${text(target.name)}
Platform: ${text(target.platform)}
Aset: ${text(target.asset)}
Komponen: ${text(finding.affectedComponent)}
Versi / build: ${text(finding.affectedVersion||target.version)}
Environment: ${text(target.environment)}
Technique: ${text(technique?.name)}

## Severity Estimate

Researcher Estimate: ${finding.severity==='Unknown'||!finding.severity?'Unknown — belum ditentukan oleh peneliti.':text(finding.severity)+'. Estimasi peneliti; belum merupakan penilaian final program.'}

## Prasyarat

${text(finding.preconditions)}

## Starting Authority

${text(finding.startingAuthority)}

## Security Restriction yang Seharusnya Berlaku

${text(finding.securityRestriction)}

## Langkah Reproduksi

${steps.length?steps.map((s,i)=>(i+1)+'. '+s).join('\n'):'1. Langkah reproduksi belum dicatat.'}

## Expected Result

${text(finding.expectedResult)}

## Actual Result

Observasi yang dicatat peneliti:
${text(finding.actualResult)}

## Dampak Keamanan

${text(finding.impact)}

## Root Cause Hypothesis

Hipotesis, belum terverifikasi sebagai akar penyebab:
${text(finding.rootCause)}

## Evidence

${evidence.length?evidence.map((e,i)=>`${i+1}. ${text(e.label)} (${text(e.type)})\nReferensi lokal: ${e.path||'Tidak ada.'}\n${text(e.description)}${e.content?'\n\nTeks evidence:\n'+e.content:''}`).join('\n\n'):'Evidence belum dilampirkan.'}

## Rekomendasi Mitigasi

${text(finding.mitigation)}

## Catatan Pengujian

${text(finding.researchNotes)}
`;
}
