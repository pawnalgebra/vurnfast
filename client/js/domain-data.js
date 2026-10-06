// Generated from data/domains/*.json by scripts/build-domains.py.
export const DOMAIN_PACKS=[
  {
    "id": "ai",
    "name": "Artificial Intelligence",
    "description": "Layanan model, aplikasi atau agent; pola generik bukan deskripsi arsitektur perusahaan tertentu.",
    "notes": "Contoh pembelajaran; bukan klaim tentang perusahaan atau izin testing.",
    "provenance": {
      "sourceType": "domain",
      "source": "Pack riset generik lokal; bukan fakta perusahaan",
      "confidence": 0.8,
      "verified": false,
      "notes": "Adaptasikan dengan dokumentasi target dan scope; pola bukan vulnerability target."
    },
    "coreConcepts": [
      "Model dan inference",
      "Authority agent/tool",
      "Data input/output dan context"
    ],
    "terminology": [
      {
        "id": "ai-term-1",
        "title": "Inference",
        "content": "Proses menghasilkan output model dari input/context.",
        "sourceType": "domain",
        "source": "Pack riset generik lokal; bukan fakta perusahaan",
        "confidence": 0.8,
        "verified": false,
        "notes": "Adaptasikan dengan dokumentasi target dan scope; pola bukan vulnerability target.",
        "term": "Inference",
        "definition": "Proses menghasilkan output model dari input/context.",
        "whyImportant": "Output model bukan fakta yang otomatis terverifikasi.",
        "relatedTerms": [
          "Model",
          "Context"
        ]
      },
      {
        "id": "ai-term-2",
        "title": "Agent",
        "content": "Komponen yang dapat menyusun langkah atau menggunakan kemampuan yang diberikan.",
        "sourceType": "domain",
        "source": "Pack riset generik lokal; bukan fakta perusahaan",
        "confidence": 0.8,
        "verified": false,
        "notes": "Adaptasikan dengan dokumentasi target dan scope; pola bukan vulnerability target.",
        "term": "Agent",
        "definition": "Komponen yang dapat menyusun langkah atau menggunakan kemampuan yang diberikan.",
        "whyImportant": "Authority delegasi perlu dibatasi.",
        "relatedTerms": [
          "Tool",
          "Connector"
        ]
      },
      {
        "id": "ai-term-3",
        "title": "Connector",
        "content": "Integrasi yang mengakses resource pada layanan lain.",
        "sourceType": "domain",
        "source": "Pack riset generik lokal; bukan fakta perusahaan",
        "confidence": 0.8,
        "verified": false,
        "notes": "Adaptasikan dengan dokumentasi target dan scope; pola bukan vulnerability target.",
        "term": "Connector",
        "definition": "Integrasi yang mengakses resource pada layanan lain.",
        "whyImportant": "Resource dan consent membentuk trust boundary.",
        "relatedTerms": [
          "Tool",
          "Authority"
        ]
      },
      {
        "id": "ai-term-4",
        "title": "Model",
        "content": "Komponen yang menghasilkan prediksi atau output.",
        "sourceType": "domain",
        "source": "Pack riset generik lokal; bukan fakta perusahaan",
        "confidence": 0.8,
        "verified": false,
        "notes": "Adaptasikan dengan dokumentasi target dan scope; pola bukan vulnerability target.",
        "term": "Model",
        "definition": "Komponen yang menghasilkan prediksi atau output.",
        "whyImportant": "Bedakan model dari sistem yang memberi akses data.",
        "relatedTerms": [
          "Inference"
        ]
      },
      {
        "id": "ai-term-5",
        "title": "Context",
        "content": "Informasi yang diberikan untuk pemrosesan model/sistem.",
        "sourceType": "domain",
        "source": "Pack riset generik lokal; bukan fakta perusahaan",
        "confidence": 0.8,
        "verified": false,
        "notes": "Adaptasikan dengan dokumentasi target dan scope; pola bukan vulnerability target.",
        "term": "Context",
        "definition": "Informasi yang diberikan untuk pemrosesan model/sistem.",
        "whyImportant": "Dapat memuat data sensitif dan instruksi tidak tepercaya.",
        "relatedTerms": [
          "Inference",
          "Connector"
        ]
      }
    ],
    "actors": [
      {
        "id": "ai-actor-1",
        "title": "Consumer User",
        "content": "Peran tipikal; hak efektif harus dikonfirmasi pada target.",
        "sourceType": "domain",
        "source": "Pack riset generik lokal; bukan fakta perusahaan",
        "confidence": 0.8,
        "verified": false,
        "notes": "Adaptasikan dengan dokumentasi target dan scope; pola bukan vulnerability target."
      },
      {
        "id": "ai-actor-2",
        "title": "Developer",
        "content": "Peran tipikal; hak efektif harus dikonfirmasi pada target.",
        "sourceType": "domain",
        "source": "Pack riset generik lokal; bukan fakta perusahaan",
        "confidence": 0.8,
        "verified": false,
        "notes": "Adaptasikan dengan dokumentasi target dan scope; pola bukan vulnerability target."
      },
      {
        "id": "ai-actor-3",
        "title": "Workspace Member",
        "content": "Peran tipikal; hak efektif harus dikonfirmasi pada target.",
        "sourceType": "domain",
        "source": "Pack riset generik lokal; bukan fakta perusahaan",
        "confidence": 0.8,
        "verified": false,
        "notes": "Adaptasikan dengan dokumentasi target dan scope; pola bukan vulnerability target."
      },
      {
        "id": "ai-actor-4",
        "title": "Administrator",
        "content": "Peran tipikal; hak efektif harus dikonfirmasi pada target.",
        "sourceType": "domain",
        "source": "Pack riset generik lokal; bukan fakta perusahaan",
        "confidence": 0.8,
        "verified": false,
        "notes": "Adaptasikan dengan dokumentasi target dan scope; pola bukan vulnerability target."
      },
      {
        "id": "ai-actor-5",
        "title": "API Client",
        "content": "Peran tipikal; hak efektif harus dikonfirmasi pada target.",
        "sourceType": "domain",
        "source": "Pack riset generik lokal; bukan fakta perusahaan",
        "confidence": 0.8,
        "verified": false,
        "notes": "Adaptasikan dengan dokumentasi target dan scope; pola bukan vulnerability target."
      },
      {
        "id": "ai-actor-6",
        "title": "Agent",
        "content": "Peran tipikal; hak efektif harus dikonfirmasi pada target.",
        "sourceType": "domain",
        "source": "Pack riset generik lokal; bukan fakta perusahaan",
        "confidence": 0.8,
        "verified": false,
        "notes": "Adaptasikan dengan dokumentasi target dan scope; pola bukan vulnerability target."
      },
      {
        "id": "ai-actor-7",
        "title": "Tool",
        "content": "Peran tipikal; hak efektif harus dikonfirmasi pada target.",
        "sourceType": "domain",
        "source": "Pack riset generik lokal; bukan fakta perusahaan",
        "confidence": 0.8,
        "verified": false,
        "notes": "Adaptasikan dengan dokumentasi target dan scope; pola bukan vulnerability target."
      },
      {
        "id": "ai-actor-8",
        "title": "Connector",
        "content": "Peran tipikal; hak efektif harus dikonfirmasi pada target.",
        "sourceType": "domain",
        "source": "Pack riset generik lokal; bukan fakta perusahaan",
        "confidence": 0.8,
        "verified": false,
        "notes": "Adaptasikan dengan dokumentasi target dan scope; pola bukan vulnerability target."
      },
      {
        "id": "ai-actor-9",
        "title": "Service",
        "content": "Peran tipikal; hak efektif harus dikonfirmasi pada target.",
        "sourceType": "domain",
        "source": "Pack riset generik lokal; bukan fakta perusahaan",
        "confidence": 0.8,
        "verified": false,
        "notes": "Adaptasikan dengan dokumentasi target dan scope; pola bukan vulnerability target."
      }
    ],
    "businessObjects": [
      {
        "id": "ai-object-1",
        "title": "Account",
        "content": "Resource bisnis tipikal; ownership, state dan sensitivitas perlu dipetakan.",
        "sourceType": "domain",
        "source": "Pack riset generik lokal; bukan fakta perusahaan",
        "confidence": 0.8,
        "verified": false,
        "notes": "Adaptasikan dengan dokumentasi target dan scope; pola bukan vulnerability target."
      },
      {
        "id": "ai-object-2",
        "title": "Conversation",
        "content": "Resource bisnis tipikal; ownership, state dan sensitivitas perlu dipetakan.",
        "sourceType": "domain",
        "source": "Pack riset generik lokal; bukan fakta perusahaan",
        "confidence": 0.8,
        "verified": false,
        "notes": "Adaptasikan dengan dokumentasi target dan scope; pola bukan vulnerability target."
      },
      {
        "id": "ai-object-3",
        "title": "Project",
        "content": "Resource bisnis tipikal; ownership, state dan sensitivitas perlu dipetakan.",
        "sourceType": "domain",
        "source": "Pack riset generik lokal; bukan fakta perusahaan",
        "confidence": 0.8,
        "verified": false,
        "notes": "Adaptasikan dengan dokumentasi target dan scope; pola bukan vulnerability target."
      },
      {
        "id": "ai-object-4",
        "title": "File",
        "content": "Resource bisnis tipikal; ownership, state dan sensitivitas perlu dipetakan.",
        "sourceType": "domain",
        "source": "Pack riset generik lokal; bukan fakta perusahaan",
        "confidence": 0.8,
        "verified": false,
        "notes": "Adaptasikan dengan dokumentasi target dan scope; pola bukan vulnerability target."
      },
      {
        "id": "ai-object-5",
        "title": "Model",
        "content": "Resource bisnis tipikal; ownership, state dan sensitivitas perlu dipetakan.",
        "sourceType": "domain",
        "source": "Pack riset generik lokal; bukan fakta perusahaan",
        "confidence": 0.8,
        "verified": false,
        "notes": "Adaptasikan dengan dokumentasi target dan scope; pola bukan vulnerability target."
      },
      {
        "id": "ai-object-6",
        "title": "API Key",
        "content": "Resource bisnis tipikal; ownership, state dan sensitivitas perlu dipetakan.",
        "sourceType": "domain",
        "source": "Pack riset generik lokal; bukan fakta perusahaan",
        "confidence": 0.8,
        "verified": false,
        "notes": "Adaptasikan dengan dokumentasi target dan scope; pola bukan vulnerability target."
      },
      {
        "id": "ai-object-7",
        "title": "Agent",
        "content": "Resource bisnis tipikal; ownership, state dan sensitivitas perlu dipetakan.",
        "sourceType": "domain",
        "source": "Pack riset generik lokal; bukan fakta perusahaan",
        "confidence": 0.8,
        "verified": false,
        "notes": "Adaptasikan dengan dokumentasi target dan scope; pola bukan vulnerability target."
      },
      {
        "id": "ai-object-8",
        "title": "Tool",
        "content": "Resource bisnis tipikal; ownership, state dan sensitivitas perlu dipetakan.",
        "sourceType": "domain",
        "source": "Pack riset generik lokal; bukan fakta perusahaan",
        "confidence": 0.8,
        "verified": false,
        "notes": "Adaptasikan dengan dokumentasi target dan scope; pola bukan vulnerability target."
      },
      {
        "id": "ai-object-9",
        "title": "Connector",
        "content": "Resource bisnis tipikal; ownership, state dan sensitivitas perlu dipetakan.",
        "sourceType": "domain",
        "source": "Pack riset generik lokal; bukan fakta perusahaan",
        "confidence": 0.8,
        "verified": false,
        "notes": "Adaptasikan dengan dokumentasi target dan scope; pola bukan vulnerability target."
      },
      {
        "id": "ai-object-10",
        "title": "Workspace",
        "content": "Resource bisnis tipikal; ownership, state dan sensitivitas perlu dipetakan.",
        "sourceType": "domain",
        "source": "Pack riset generik lokal; bukan fakta perusahaan",
        "confidence": 0.8,
        "verified": false,
        "notes": "Adaptasikan dengan dokumentasi target dan scope; pola bukan vulnerability target."
      },
      {
        "id": "ai-object-11",
        "title": "Organization",
        "content": "Resource bisnis tipikal; ownership, state dan sensitivitas perlu dipetakan.",
        "sourceType": "domain",
        "source": "Pack riset generik lokal; bukan fakta perusahaan",
        "confidence": 0.8,
        "verified": false,
        "notes": "Adaptasikan dengan dokumentasi target dan scope; pola bukan vulnerability target."
      },
      {
        "id": "ai-object-12",
        "title": "Session",
        "content": "Resource bisnis tipikal; ownership, state dan sensitivitas perlu dipetakan.",
        "sourceType": "domain",
        "source": "Pack riset generik lokal; bukan fakta perusahaan",
        "confidence": 0.8,
        "verified": false,
        "notes": "Adaptasikan dengan dokumentasi target dan scope; pola bukan vulnerability target."
      }
    ],
    "businessFlows": [
      {
        "id": "ai-flow-1",
        "title": "Artificial Intelligence — flow generik",
        "content": "Layanan model, aplikasi atau agent; pola generik bukan deskripsi arsitektur perusahaan tertentu.",
        "sourceType": "domain",
        "source": "Pack riset generik lokal; bukan fakta perusahaan",
        "confidence": 0.8,
        "verified": false,
        "notes": "Adaptasikan dengan dokumentasi target dan scope; pola bukan vulnerability target.",
        "steps": [
          "User",
          "Account",
          "Project",
          "API Credential",
          "Request",
          "Model",
          "Tool / Connector",
          "Output"
        ],
        "actorIds": [
          "ai-actor-1",
          "ai-actor-2",
          "ai-actor-3",
          "ai-actor-4",
          "ai-actor-5",
          "ai-actor-6",
          "ai-actor-7",
          "ai-actor-8",
          "ai-actor-9"
        ],
        "objectIds": [
          "ai-object-1",
          "ai-object-2",
          "ai-object-3",
          "ai-object-4",
          "ai-object-5",
          "ai-object-6",
          "ai-object-7",
          "ai-object-8",
          "ai-object-9",
          "ai-object-10",
          "ai-object-11",
          "ai-object-12"
        ],
        "boundaryIds": [
          "ai-boundary-1"
        ],
        "invariantIds": [
          "ai-invariant-1",
          "ai-invariant-2",
          "ai-invariant-3",
          "ai-invariant-4"
        ],
        "transitions": [
          {
            "id": "ai-transition-1",
            "fromState": "User",
            "toState": "Account",
            "action": "User → Account",
            "critical": false,
            "invariantIds": [
              "ai-invariant-1",
              "ai-invariant-2",
              "ai-invariant-3",
              "ai-invariant-4"
            ]
          },
          {
            "id": "ai-transition-2",
            "fromState": "Account",
            "toState": "Project",
            "action": "Account → Project",
            "critical": false,
            "invariantIds": [
              "ai-invariant-1",
              "ai-invariant-2",
              "ai-invariant-3",
              "ai-invariant-4"
            ]
          },
          {
            "id": "ai-transition-3",
            "fromState": "Project",
            "toState": "API Credential",
            "action": "Project → API Credential",
            "critical": true,
            "invariantIds": [
              "ai-invariant-1",
              "ai-invariant-2",
              "ai-invariant-3",
              "ai-invariant-4"
            ]
          },
          {
            "id": "ai-transition-4",
            "fromState": "API Credential",
            "toState": "Request",
            "action": "API Credential → Request",
            "critical": true,
            "invariantIds": [
              "ai-invariant-1",
              "ai-invariant-2",
              "ai-invariant-3",
              "ai-invariant-4"
            ]
          },
          {
            "id": "ai-transition-5",
            "fromState": "Request",
            "toState": "Model",
            "action": "Request → Model",
            "critical": false,
            "invariantIds": [
              "ai-invariant-1",
              "ai-invariant-2",
              "ai-invariant-3",
              "ai-invariant-4"
            ]
          },
          {
            "id": "ai-transition-6",
            "fromState": "Model",
            "toState": "Tool / Connector",
            "action": "Model → Tool / Connector",
            "critical": false,
            "invariantIds": [
              "ai-invariant-1",
              "ai-invariant-2",
              "ai-invariant-3",
              "ai-invariant-4"
            ]
          },
          {
            "id": "ai-transition-7",
            "fromState": "Tool / Connector",
            "toState": "Output",
            "action": "Tool / Connector → Output",
            "critical": false,
            "invariantIds": [
              "ai-invariant-1",
              "ai-invariant-2",
              "ai-invariant-3",
              "ai-invariant-4"
            ]
          }
        ]
      }
    ],
    "sensitiveData": [
      {
        "id": "ai-sensitive-1",
        "title": "Private prompts, conversations and files",
        "content": "Kategori data generik Artificial Intelligence; konfirmasi sensitivitas pada target dan gunakan data dummy/redaksi.",
        "sourceType": "domain",
        "source": "Pack riset generik lokal; bukan fakta perusahaan",
        "confidence": 0.8,
        "verified": false,
        "notes": "Adaptasikan dengan dokumentasi target dan scope; pola bukan vulnerability target."
      },
      {
        "id": "ai-sensitive-2",
        "title": "Workspace and connector resource data",
        "content": "Kategori data generik Artificial Intelligence; konfirmasi sensitivitas pada target dan gunakan data dummy/redaksi.",
        "sourceType": "domain",
        "source": "Pack riset generik lokal; bukan fakta perusahaan",
        "confidence": 0.8,
        "verified": false,
        "notes": "Adaptasikan dengan dokumentasi target dan scope; pola bukan vulnerability target."
      },
      {
        "id": "ai-sensitive-3",
        "title": "API keys and tool credentials",
        "content": "Kategori data generik Artificial Intelligence; konfirmasi sensitivitas pada target dan gunakan data dummy/redaksi.",
        "sourceType": "domain",
        "source": "Pack riset generik lokal; bukan fakta perusahaan",
        "confidence": 0.8,
        "verified": false,
        "notes": "Adaptasikan dengan dokumentasi target dan scope; pola bukan vulnerability target."
      }
    ],
    "criticalAssets": [
      {
        "id": "ai-asset-1",
        "title": "API Key",
        "content": "Nilai bisnis terkait integritas, ownership dan authority pada Artificial Intelligence flow; bukan penilaian severity target.",
        "sourceType": "domain",
        "source": "Pack riset generik lokal; bukan fakta perusahaan",
        "confidence": 0.8,
        "verified": false,
        "notes": "Adaptasikan dengan dokumentasi target dan scope; pola bukan vulnerability target."
      },
      {
        "id": "ai-asset-2",
        "title": "Project",
        "content": "Nilai bisnis terkait integritas, ownership dan authority pada Artificial Intelligence flow; bukan penilaian severity target.",
        "sourceType": "domain",
        "source": "Pack riset generik lokal; bukan fakta perusahaan",
        "confidence": 0.8,
        "verified": false,
        "notes": "Adaptasikan dengan dokumentasi target dan scope; pola bukan vulnerability target."
      },
      {
        "id": "ai-asset-3",
        "title": "File",
        "content": "Nilai bisnis terkait integritas, ownership dan authority pada Artificial Intelligence flow; bukan penilaian severity target.",
        "sourceType": "domain",
        "source": "Pack riset generik lokal; bukan fakta perusahaan",
        "confidence": 0.8,
        "verified": false,
        "notes": "Adaptasikan dengan dokumentasi target dan scope; pola bukan vulnerability target."
      },
      {
        "id": "ai-asset-4",
        "title": "Conversation",
        "content": "Nilai bisnis terkait integritas, ownership dan authority pada Artificial Intelligence flow; bukan penilaian severity target.",
        "sourceType": "domain",
        "source": "Pack riset generik lokal; bukan fakta perusahaan",
        "confidence": 0.8,
        "verified": false,
        "notes": "Adaptasikan dengan dokumentasi target dan scope; pola bukan vulnerability target."
      },
      {
        "id": "ai-asset-5",
        "title": "Connector",
        "content": "Nilai bisnis terkait integritas, ownership dan authority pada Artificial Intelligence flow; bukan penilaian severity target.",
        "sourceType": "domain",
        "source": "Pack riset generik lokal; bukan fakta perusahaan",
        "confidence": 0.8,
        "verified": false,
        "notes": "Adaptasikan dengan dokumentasi target dan scope; pola bukan vulnerability target."
      },
      {
        "id": "ai-asset-6",
        "title": "Workspace",
        "content": "Nilai bisnis terkait integritas, ownership dan authority pada Artificial Intelligence flow; bukan penilaian severity target.",
        "sourceType": "domain",
        "source": "Pack riset generik lokal; bukan fakta perusahaan",
        "confidence": 0.8,
        "verified": false,
        "notes": "Adaptasikan dengan dokumentasi target dan scope; pola bukan vulnerability target."
      }
    ],
    "commonTrustBoundaries": [
      {
        "id": "ai-boundary-1",
        "title": "Authorization → Execution",
        "content": "Authority harus tetap sesuai ketika aksi terlindungi benar-benar dijalankan.",
        "sourceType": "domain",
        "source": "Pack riset generik lokal; bukan fakta perusahaan",
        "confidence": 0.8,
        "verified": false,
        "notes": "Adaptasikan dengan dokumentasi target dan scope; pola bukan vulnerability target.",
        "fromComponent": "User / Client",
        "toComponent": "Backend / Worker",
        "channel": "request / job",
        "authority": "Izin actor untuk object dan state yang berlaku",
        "flowId": "ai-flow-1"
      }
    ],
    "securityInvariants": [
      {
        "id": "ai-invariant-1",
        "title": "Authority tool tidak boleh melebihi hak yang diberikan pengguna.",
        "content": "Authority tool tidak boleh melebihi hak yang diberikan pengguna.",
        "sourceType": "domain",
        "source": "Pack riset generik lokal; bukan fakta perusahaan",
        "confidence": 0.8,
        "verified": false,
        "notes": "Adaptasikan dengan dokumentasi target dan scope; pola bukan vulnerability target.",
        "flowId": "ai-flow-1",
        "techniqueIds": [
          "tech_03"
        ]
      },
      {
        "id": "ai-invariant-2",
        "title": "Data workspace harus tetap tenant isolated.",
        "content": "Data workspace harus tetap tenant isolated.",
        "sourceType": "domain",
        "source": "Pack riset generik lokal; bukan fakta perusahaan",
        "confidence": 0.8,
        "verified": false,
        "notes": "Adaptasikan dengan dokumentasi target dan scope; pola bukan vulnerability target.",
        "flowId": "ai-flow-1",
        "techniqueIds": [
          "tech_06"
        ]
      },
      {
        "id": "ai-invariant-3",
        "title": "Connector hanya mengakses resource yang diotorisasi.",
        "content": "Connector hanya mengakses resource yang diotorisasi.",
        "sourceType": "domain",
        "source": "Pack riset generik lokal; bukan fakta perusahaan",
        "confidence": 0.8,
        "verified": false,
        "notes": "Adaptasikan dengan dokumentasi target dan scope; pola bukan vulnerability target.",
        "flowId": "ai-flow-1",
        "techniqueIds": [
          "tech_14"
        ]
      },
      {
        "id": "ai-invariant-4",
        "title": "Credential revoked tidak boleh terus mengotorisasi operasi terlindungi.",
        "content": "Credential revoked tidak boleh terus mengotorisasi operasi terlindungi.",
        "sourceType": "domain",
        "source": "Pack riset generik lokal; bukan fakta perusahaan",
        "confidence": 0.8,
        "verified": false,
        "notes": "Adaptasikan dengan dokumentasi target dan scope; pola bukan vulnerability target.",
        "flowId": "ai-flow-1",
        "techniqueIds": [
          "tech_07"
        ]
      }
    ],
    "commonFailurePatterns": [
      {
        "id": "ai-pattern-1",
        "title": "Authorization mismatch",
        "content": "Bandingkan authority efektif, owner, state dan context sebelum menyimpulkan kontrol gagal.",
        "sourceType": "domain",
        "source": "Pack riset generik lokal; bukan fakta perusahaan",
        "confidence": 0.8,
        "verified": false,
        "notes": "Adaptasikan dengan dokumentasi target dan scope; pola bukan vulnerability target."
      },
      {
        "id": "ai-pattern-2",
        "title": "Stale authorization",
        "content": "Pertanyaan generik: apakah authority lama masih dipakai setelah perubahan state?",
        "sourceType": "domain",
        "source": "Pack riset generik lokal; bukan fakta perusahaan",
        "confidence": 0.8,
        "verified": false,
        "notes": "Adaptasikan dengan dokumentasi target dan scope; pola bukan vulnerability target."
      },
      {
        "id": "ai-pattern-3",
        "title": "State desynchronization",
        "content": "Perbedaan state antarkomponen perlu kontrol timing dan evidence; belum tentu vulnerability.",
        "sourceType": "domain",
        "source": "Pack riset generik lokal; bukan fakta perusahaan",
        "confidence": 0.8,
        "verified": false,
        "notes": "Adaptasikan dengan dokumentasi target dan scope; pola bukan vulnerability target."
      }
    ],
    "relevantTechniques": [
      {
        "id": "ai-mapping-1",
        "title": "Technique tech_03",
        "content": "Capability context: persetujuan harus terikat pada actor, action, resource dan context yang diberikan. Tinjau Artificial Intelligence flow bersama invariant terkait; gunakan hanya scope yang diotorisasi.",
        "sourceType": "domain",
        "source": "Pack riset generik lokal; bukan fakta perusahaan",
        "confidence": 0.8,
        "verified": false,
        "notes": "Adaptasikan dengan dokumentasi target dan scope; pola bukan vulnerability target.",
        "techniqueId": "tech_03",
        "flowId": "ai-flow-1",
        "invariantId": "ai-invariant-1",
        "researchPriority": 60
      },
      {
        "id": "ai-mapping-2",
        "title": "Technique tech_06",
        "content": "Cross-context boundary: bandingkan authority yang didelegasikan antar app, agent, tool dan connector. Tinjau Artificial Intelligence flow bersama invariant terkait; gunakan hanya scope yang diotorisasi.",
        "sourceType": "domain",
        "source": "Pack riset generik lokal; bukan fakta perusahaan",
        "confidence": 0.8,
        "verified": false,
        "notes": "Adaptasikan dengan dokumentasi target dan scope; pola bukan vulnerability target.",
        "techniqueId": "tech_06",
        "flowId": "ai-flow-1",
        "invariantId": "ai-invariant-2",
        "researchPriority": 70
      },
      {
        "id": "ai-mapping-3",
        "title": "Technique tech_14",
        "content": "Tenant isolation: resource dan capability satu organisasi tidak memberi akses ke organisasi lain. Tinjau Artificial Intelligence flow bersama invariant terkait; gunakan hanya scope yang diotorisasi.",
        "sourceType": "domain",
        "source": "Pack riset generik lokal; bukan fakta perusahaan",
        "confidence": 0.8,
        "verified": false,
        "notes": "Adaptasikan dengan dokumentasi target dan scope; pola bukan vulnerability target.",
        "techniqueId": "tech_14",
        "flowId": "ai-flow-1",
        "invariantId": "ai-invariant-3",
        "researchPriority": 80
      },
      {
        "id": "ai-mapping-4",
        "title": "Technique tech_07",
        "content": "Revocation/lifecycle: periksa capability dan resource turunan setelah izin, membership atau credential dicabut. Tinjau Artificial Intelligence flow bersama invariant terkait; gunakan hanya scope yang diotorisasi.",
        "sourceType": "domain",
        "source": "Pack riset generik lokal; bukan fakta perusahaan",
        "confidence": 0.8,
        "verified": false,
        "notes": "Adaptasikan dengan dokumentasi target dan scope; pola bukan vulnerability target.",
        "techniqueId": "tech_07",
        "flowId": "ai-flow-1",
        "invariantId": "ai-invariant-4",
        "researchPriority": 60
      },
      {
        "id": "ai-mapping-5",
        "title": "Technique tech_17",
        "content": "Object ownership: actor harus berhak atas object, account atau record yang dirujuk pada flow. Tinjau Artificial Intelligence flow bersama invariant terkait; gunakan hanya scope yang diotorisasi.",
        "sourceType": "domain",
        "source": "Pack riset generik lokal; bukan fakta perusahaan",
        "confidence": 0.8,
        "verified": false,
        "notes": "Adaptasikan dengan dokumentasi target dan scope; pola bukan vulnerability target.",
        "techniqueId": "tech_17",
        "flowId": "ai-flow-1",
        "invariantId": "ai-invariant-1",
        "researchPriority": 70
      }
    ],
    "researchQuestions": [
      {
        "id": "ai-question-1",
        "title": "Bagaimana memastikan: Authority tool tidak boleh melebihi hak yang diberikan pengguna.",
        "content": "Authority tool tidak boleh melebihi hak yang diberikan pengguna. Apa expected behavior jika owner, authority atau state berubah sebelum execution; apa evidence yang membedakan kontrol efektif dari pelanggaran?",
        "sourceType": "domain",
        "source": "Pack riset generik lokal; bukan fakta perusahaan",
        "confidence": 0.8,
        "verified": false,
        "notes": "Adaptasikan dengan dokumentasi target dan scope; pola bukan vulnerability target.",
        "flowId": "ai-flow-1",
        "invariantId": "ai-invariant-1",
        "techniqueId": "tech_03"
      },
      {
        "id": "ai-question-2",
        "title": "Bagaimana memastikan: Data workspace harus tetap tenant isolated.",
        "content": "Data workspace harus tetap tenant isolated. Apa expected behavior jika owner, authority atau state berubah sebelum execution; apa evidence yang membedakan kontrol efektif dari pelanggaran?",
        "sourceType": "domain",
        "source": "Pack riset generik lokal; bukan fakta perusahaan",
        "confidence": 0.8,
        "verified": false,
        "notes": "Adaptasikan dengan dokumentasi target dan scope; pola bukan vulnerability target.",
        "flowId": "ai-flow-1",
        "invariantId": "ai-invariant-2",
        "techniqueId": "tech_06"
      },
      {
        "id": "ai-question-3",
        "title": "Bagaimana memastikan: Connector hanya mengakses resource yang diotorisasi.",
        "content": "Connector hanya mengakses resource yang diotorisasi. Apa expected behavior jika owner, authority atau state berubah sebelum execution; apa evidence yang membedakan kontrol efektif dari pelanggaran?",
        "sourceType": "domain",
        "source": "Pack riset generik lokal; bukan fakta perusahaan",
        "confidence": 0.8,
        "verified": false,
        "notes": "Adaptasikan dengan dokumentasi target dan scope; pola bukan vulnerability target.",
        "flowId": "ai-flow-1",
        "invariantId": "ai-invariant-3",
        "techniqueId": "tech_14"
      },
      {
        "id": "ai-question-4",
        "title": "Bagaimana memastikan: Credential revoked tidak boleh terus mengotorisasi operasi terlindungi.",
        "content": "Credential revoked tidak boleh terus mengotorisasi operasi terlindungi. Apa expected behavior jika owner, authority atau state berubah sebelum execution; apa evidence yang membedakan kontrol efektif dari pelanggaran?",
        "sourceType": "domain",
        "source": "Pack riset generik lokal; bukan fakta perusahaan",
        "confidence": 0.8,
        "verified": false,
        "notes": "Adaptasikan dengan dokumentasi target dan scope; pola bukan vulnerability target.",
        "flowId": "ai-flow-1",
        "invariantId": "ai-invariant-4",
        "techniqueId": "tech_07"
      }
    ],
    "references": [
      {
        "title": "NIST AI Risk Management Framework",
        "url": "https://www.nist.gov/itl/ai-risk-management-framework",
        "notes": "Referensi kerangka istilah AI; contoh agent/tool adalah kurasi riset generik."
      }
    ]
  },
  {
    "id": "banking",
    "name": "Banking",
    "description": "Produk rekening dan layanan bank; istilah proses dapat berbeda antar penyedia.",
    "notes": "Contoh pembelajaran; bukan klaim tentang perusahaan atau izin testing.",
    "provenance": {
      "sourceType": "domain",
      "source": "Pack riset generik lokal; bukan fakta perusahaan",
      "confidence": 0.8,
      "verified": false,
      "notes": "Adaptasikan dengan dokumentasi target dan scope; pola bukan vulnerability target."
    },
    "coreConcepts": [
      "Pemilik rekening",
      "Mandat transaksi",
      "Instruksi versus finalitas"
    ],
    "terminology": [
      {
        "id": "banking-term-1",
        "title": "Mandate",
        "content": "Aturan atau pemberian authority untuk suatu rekening/aksi.",
        "sourceType": "domain",
        "source": "Pack riset generik lokal; bukan fakta perusahaan",
        "confidence": 0.8,
        "verified": false,
        "notes": "Adaptasikan dengan dokumentasi target dan scope; pola bukan vulnerability target.",
        "term": "Mandate",
        "definition": "Aturan atau pemberian authority untuk suatu rekening/aksi.",
        "whyImportant": "Perubahan mandat mengubah siapa boleh bertindak.",
        "relatedTerms": [
          "Account",
          "Authorization"
        ]
      },
      {
        "id": "banking-term-2",
        "title": "Statement",
        "content": "Ringkasan record aktivitas rekening pada periode tertentu.",
        "sourceType": "domain",
        "source": "Pack riset generik lokal; bukan fakta perusahaan",
        "confidence": 0.8,
        "verified": false,
        "notes": "Adaptasikan dengan dokumentasi target dan scope; pola bukan vulnerability target.",
        "term": "Statement",
        "definition": "Ringkasan record aktivitas rekening pada periode tertentu.",
        "whyImportant": "Merupakan resource sensitif yang ownership-nya perlu dijaga.",
        "relatedTerms": [
          "Account",
          "Ledger"
        ]
      },
      {
        "id": "banking-term-3",
        "title": "Account",
        "content": "Rekening atau identitas pembukuan untuk pemilik dana/aktivitas.",
        "sourceType": "domain",
        "source": "Pack riset generik lokal; bukan fakta perusahaan",
        "confidence": 0.8,
        "verified": false,
        "notes": "Adaptasikan dengan dokumentasi target dan scope; pola bukan vulnerability target.",
        "term": "Account",
        "definition": "Rekening atau identitas pembukuan untuk pemilik dana/aktivitas.",
        "whyImportant": "Ownership account menentukan authority transaksi.",
        "relatedTerms": [
          "Balance",
          "Ledger"
        ]
      },
      {
        "id": "banking-term-4",
        "title": "Ledger",
        "content": "Catatan entri pembukuan yang merekam perubahan posisi.",
        "sourceType": "domain",
        "source": "Pack riset generik lokal; bukan fakta perusahaan",
        "confidence": 0.8,
        "verified": false,
        "notes": "Adaptasikan dengan dokumentasi target dan scope; pola bukan vulnerability target.",
        "term": "Ledger",
        "definition": "Catatan entri pembukuan yang merekam perubahan posisi.",
        "whyImportant": "Kontrol integritas harus mengikuti state transaksi.",
        "relatedTerms": [
          "Ledger Entry",
          "Balance",
          "Reconciliation"
        ]
      },
      {
        "id": "banking-term-5",
        "title": "Balance",
        "content": "Posisi saldo berdasarkan catatan pada suatu saat.",
        "sourceType": "domain",
        "source": "Pack riset generik lokal; bukan fakta perusahaan",
        "confidence": 0.8,
        "verified": false,
        "notes": "Adaptasikan dengan dokumentasi target dan scope; pola bukan vulnerability target.",
        "term": "Balance",
        "definition": "Posisi saldo berdasarkan catatan pada suatu saat.",
        "whyImportant": "Bedakan saldo tercatat dan dana yang dapat digunakan.",
        "relatedTerms": [
          "Ledger",
          "Available Balance"
        ]
      },
      {
        "id": "banking-term-6",
        "title": "Available Balance",
        "content": "Bagian saldo yang tersedia untuk digunakan setelah pembatasan/hold.",
        "sourceType": "domain",
        "source": "Pack riset generik lokal; bukan fakta perusahaan",
        "confidence": 0.8,
        "verified": false,
        "notes": "Adaptasikan dengan dokumentasi target dan scope; pola bukan vulnerability target.",
        "term": "Available Balance",
        "definition": "Bagian saldo yang tersedia untuk digunakan setelah pembatasan/hold.",
        "whyImportant": "Jangan menyamakan dana tersedia dengan saldo keseluruhan.",
        "relatedTerms": [
          "Balance",
          "Authorization"
        ]
      },
      {
        "id": "banking-term-7",
        "title": "Settlement",
        "content": "Penyelesaian kewajiban melalui perpindahan dana atau aset.",
        "sourceType": "domain",
        "source": "Pack riset generik lokal; bukan fakta perusahaan",
        "confidence": 0.8,
        "verified": false,
        "notes": "Adaptasikan dengan dokumentasi target dan scope; pola bukan vulnerability target.",
        "term": "Settlement",
        "definition": "Penyelesaian kewajiban melalui perpindahan dana atau aset.",
        "whyImportant": "Keputusan authorization dan finalitas dapat terjadi pada tahap berbeda.",
        "relatedTerms": [
          "Clearing",
          "Transaction",
          "Reconciliation"
        ]
      },
      {
        "id": "banking-term-8",
        "title": "Clearing",
        "content": "Proses pertukaran dan pencocokan instruksi sebelum settlement.",
        "sourceType": "domain",
        "source": "Pack riset generik lokal; bukan fakta perusahaan",
        "confidence": 0.8,
        "verified": false,
        "notes": "Adaptasikan dengan dokumentasi target dan scope; pola bukan vulnerability target.",
        "term": "Clearing",
        "definition": "Proses pertukaran dan pencocokan instruksi sebelum settlement.",
        "whyImportant": "State sebelum settlement perlu dipahami saat review kontrol.",
        "relatedTerms": [
          "Settlement",
          "Reconciliation"
        ]
      },
      {
        "id": "banking-term-9",
        "title": "Transaction",
        "content": "Record suatu aktivitas ekonomi atau perpindahan nilai.",
        "sourceType": "domain",
        "source": "Pack riset generik lokal; bukan fakta perusahaan",
        "confidence": 0.8,
        "verified": false,
        "notes": "Adaptasikan dengan dokumentasi target dan scope; pola bukan vulnerability target.",
        "term": "Transaction",
        "definition": "Record suatu aktivitas ekonomi atau perpindahan nilai.",
        "whyImportant": "State dan pemilik transaksi menentukan aksi yang sah.",
        "relatedTerms": [
          "Transfer",
          "Ledger"
        ]
      }
    ],
    "actors": [
      {
        "id": "banking-actor-1",
        "title": "Customer",
        "content": "Peran tipikal; hak efektif harus dikonfirmasi pada target.",
        "sourceType": "domain",
        "source": "Pack riset generik lokal; bukan fakta perusahaan",
        "confidence": 0.8,
        "verified": false,
        "notes": "Adaptasikan dengan dokumentasi target dan scope; pola bukan vulnerability target."
      },
      {
        "id": "banking-actor-2",
        "title": "Account Holder",
        "content": "Peran tipikal; hak efektif harus dikonfirmasi pada target.",
        "sourceType": "domain",
        "source": "Pack riset generik lokal; bukan fakta perusahaan",
        "confidence": 0.8,
        "verified": false,
        "notes": "Adaptasikan dengan dokumentasi target dan scope; pola bukan vulnerability target."
      },
      {
        "id": "banking-actor-3",
        "title": "Teller",
        "content": "Peran tipikal; hak efektif harus dikonfirmasi pada target.",
        "sourceType": "domain",
        "source": "Pack riset generik lokal; bukan fakta perusahaan",
        "confidence": 0.8,
        "verified": false,
        "notes": "Adaptasikan dengan dokumentasi target dan scope; pola bukan vulnerability target."
      },
      {
        "id": "banking-actor-4",
        "title": "Bank Administrator",
        "content": "Peran tipikal; hak efektif harus dikonfirmasi pada target.",
        "sourceType": "domain",
        "source": "Pack riset generik lokal; bukan fakta perusahaan",
        "confidence": 0.8,
        "verified": false,
        "notes": "Adaptasikan dengan dokumentasi target dan scope; pola bukan vulnerability target."
      },
      {
        "id": "banking-actor-5",
        "title": "Approver",
        "content": "Peran tipikal; hak efektif harus dikonfirmasi pada target.",
        "sourceType": "domain",
        "source": "Pack riset generik lokal; bukan fakta perusahaan",
        "confidence": 0.8,
        "verified": false,
        "notes": "Adaptasikan dengan dokumentasi target dan scope; pola bukan vulnerability target."
      },
      {
        "id": "banking-actor-6",
        "title": "Compliance Officer",
        "content": "Peran tipikal; hak efektif harus dikonfirmasi pada target.",
        "sourceType": "domain",
        "source": "Pack riset generik lokal; bukan fakta perusahaan",
        "confidence": 0.8,
        "verified": false,
        "notes": "Adaptasikan dengan dokumentasi target dan scope; pola bukan vulnerability target."
      },
      {
        "id": "banking-actor-7",
        "title": "Service Account",
        "content": "Peran tipikal; hak efektif harus dikonfirmasi pada target.",
        "sourceType": "domain",
        "source": "Pack riset generik lokal; bukan fakta perusahaan",
        "confidence": 0.8,
        "verified": false,
        "notes": "Adaptasikan dengan dokumentasi target dan scope; pola bukan vulnerability target."
      }
    ],
    "businessObjects": [
      {
        "id": "banking-object-1",
        "title": "Account",
        "content": "Resource bisnis tipikal; ownership, state dan sensitivitas perlu dipetakan.",
        "sourceType": "domain",
        "source": "Pack riset generik lokal; bukan fakta perusahaan",
        "confidence": 0.8,
        "verified": false,
        "notes": "Adaptasikan dengan dokumentasi target dan scope; pola bukan vulnerability target."
      },
      {
        "id": "banking-object-2",
        "title": "Transfer Instruction",
        "content": "Resource bisnis tipikal; ownership, state dan sensitivitas perlu dipetakan.",
        "sourceType": "domain",
        "source": "Pack riset generik lokal; bukan fakta perusahaan",
        "confidence": 0.8,
        "verified": false,
        "notes": "Adaptasikan dengan dokumentasi target dan scope; pola bukan vulnerability target."
      },
      {
        "id": "banking-object-3",
        "title": "Beneficiary",
        "content": "Resource bisnis tipikal; ownership, state dan sensitivitas perlu dipetakan.",
        "sourceType": "domain",
        "source": "Pack riset generik lokal; bukan fakta perusahaan",
        "confidence": 0.8,
        "verified": false,
        "notes": "Adaptasikan dengan dokumentasi target dan scope; pola bukan vulnerability target."
      },
      {
        "id": "banking-object-4",
        "title": "Statement",
        "content": "Resource bisnis tipikal; ownership, state dan sensitivitas perlu dipetakan.",
        "sourceType": "domain",
        "source": "Pack riset generik lokal; bukan fakta perusahaan",
        "confidence": 0.8,
        "verified": false,
        "notes": "Adaptasikan dengan dokumentasi target dan scope; pola bukan vulnerability target."
      },
      {
        "id": "banking-object-5",
        "title": "Mandate",
        "content": "Resource bisnis tipikal; ownership, state dan sensitivitas perlu dipetakan.",
        "sourceType": "domain",
        "source": "Pack riset generik lokal; bukan fakta perusahaan",
        "confidence": 0.8,
        "verified": false,
        "notes": "Adaptasikan dengan dokumentasi target dan scope; pola bukan vulnerability target."
      },
      {
        "id": "banking-object-6",
        "title": "Ledger Entry",
        "content": "Resource bisnis tipikal; ownership, state dan sensitivitas perlu dipetakan.",
        "sourceType": "domain",
        "source": "Pack riset generik lokal; bukan fakta perusahaan",
        "confidence": 0.8,
        "verified": false,
        "notes": "Adaptasikan dengan dokumentasi target dan scope; pola bukan vulnerability target."
      },
      {
        "id": "banking-object-7",
        "title": "Deposit",
        "content": "Resource bisnis tipikal; ownership, state dan sensitivitas perlu dipetakan.",
        "sourceType": "domain",
        "source": "Pack riset generik lokal; bukan fakta perusahaan",
        "confidence": 0.8,
        "verified": false,
        "notes": "Adaptasikan dengan dokumentasi target dan scope; pola bukan vulnerability target."
      }
    ],
    "businessFlows": [
      {
        "id": "banking-flow-1",
        "title": "Banking — flow generik",
        "content": "Produk rekening dan layanan bank; istilah proses dapat berbeda antar penyedia.",
        "sourceType": "domain",
        "source": "Pack riset generik lokal; bukan fakta perusahaan",
        "confidence": 0.8,
        "verified": false,
        "notes": "Adaptasikan dengan dokumentasi target dan scope; pola bukan vulnerability target.",
        "steps": [
          "Customer",
          "Create Instruction",
          "Validate Mandate",
          "Authorize",
          "Post Entry",
          "Settle",
          "Reconcile"
        ],
        "actorIds": [
          "banking-actor-1",
          "banking-actor-2",
          "banking-actor-3",
          "banking-actor-4",
          "banking-actor-5",
          "banking-actor-6",
          "banking-actor-7"
        ],
        "objectIds": [
          "banking-object-1",
          "banking-object-2",
          "banking-object-3",
          "banking-object-4",
          "banking-object-5",
          "banking-object-6",
          "banking-object-7"
        ],
        "boundaryIds": [
          "banking-boundary-1"
        ],
        "invariantIds": [
          "banking-invariant-1",
          "banking-invariant-2",
          "banking-invariant-3"
        ],
        "transitions": [
          {
            "id": "banking-transition-1",
            "fromState": "Customer",
            "toState": "Create Instruction",
            "action": "Customer → Create Instruction",
            "critical": false,
            "invariantIds": [
              "banking-invariant-1",
              "banking-invariant-2",
              "banking-invariant-3"
            ]
          },
          {
            "id": "banking-transition-2",
            "fromState": "Create Instruction",
            "toState": "Validate Mandate",
            "action": "Create Instruction → Validate Mandate",
            "critical": false,
            "invariantIds": [
              "banking-invariant-1",
              "banking-invariant-2",
              "banking-invariant-3"
            ]
          },
          {
            "id": "banking-transition-3",
            "fromState": "Validate Mandate",
            "toState": "Authorize",
            "action": "Validate Mandate → Authorize",
            "critical": true,
            "invariantIds": [
              "banking-invariant-1",
              "banking-invariant-2",
              "banking-invariant-3"
            ]
          },
          {
            "id": "banking-transition-4",
            "fromState": "Authorize",
            "toState": "Post Entry",
            "action": "Authorize → Post Entry",
            "critical": true,
            "invariantIds": [
              "banking-invariant-1",
              "banking-invariant-2",
              "banking-invariant-3"
            ]
          },
          {
            "id": "banking-transition-5",
            "fromState": "Post Entry",
            "toState": "Settle",
            "action": "Post Entry → Settle",
            "critical": true,
            "invariantIds": [
              "banking-invariant-1",
              "banking-invariant-2",
              "banking-invariant-3"
            ]
          },
          {
            "id": "banking-transition-6",
            "fromState": "Settle",
            "toState": "Reconcile",
            "action": "Settle → Reconcile",
            "critical": true,
            "invariantIds": [
              "banking-invariant-1",
              "banking-invariant-2",
              "banking-invariant-3"
            ]
          }
        ]
      }
    ],
    "sensitiveData": [
      {
        "id": "banking-sensitive-1",
        "title": "Account identity and mandates",
        "content": "Kategori data generik Banking; konfirmasi sensitivitas pada target dan gunakan data dummy/redaksi.",
        "sourceType": "domain",
        "source": "Pack riset generik lokal; bukan fakta perusahaan",
        "confidence": 0.8,
        "verified": false,
        "notes": "Adaptasikan dengan dokumentasi target dan scope; pola bukan vulnerability target."
      },
      {
        "id": "banking-sensitive-2",
        "title": "Statements and transfer instructions",
        "content": "Kategori data generik Banking; konfirmasi sensitivitas pada target dan gunakan data dummy/redaksi.",
        "sourceType": "domain",
        "source": "Pack riset generik lokal; bukan fakta perusahaan",
        "confidence": 0.8,
        "verified": false,
        "notes": "Adaptasikan dengan dokumentasi target dan scope; pola bukan vulnerability target."
      },
      {
        "id": "banking-sensitive-3",
        "title": "Ledger and customer verification records",
        "content": "Kategori data generik Banking; konfirmasi sensitivitas pada target dan gunakan data dummy/redaksi.",
        "sourceType": "domain",
        "source": "Pack riset generik lokal; bukan fakta perusahaan",
        "confidence": 0.8,
        "verified": false,
        "notes": "Adaptasikan dengan dokumentasi target dan scope; pola bukan vulnerability target."
      }
    ],
    "criticalAssets": [
      {
        "id": "banking-asset-1",
        "title": "Account",
        "content": "Nilai bisnis terkait integritas, ownership dan authority pada Banking flow; bukan penilaian severity target.",
        "sourceType": "domain",
        "source": "Pack riset generik lokal; bukan fakta perusahaan",
        "confidence": 0.8,
        "verified": false,
        "notes": "Adaptasikan dengan dokumentasi target dan scope; pola bukan vulnerability target."
      },
      {
        "id": "banking-asset-2",
        "title": "Mandate",
        "content": "Nilai bisnis terkait integritas, ownership dan authority pada Banking flow; bukan penilaian severity target.",
        "sourceType": "domain",
        "source": "Pack riset generik lokal; bukan fakta perusahaan",
        "confidence": 0.8,
        "verified": false,
        "notes": "Adaptasikan dengan dokumentasi target dan scope; pola bukan vulnerability target."
      },
      {
        "id": "banking-asset-3",
        "title": "Transfer Instruction",
        "content": "Nilai bisnis terkait integritas, ownership dan authority pada Banking flow; bukan penilaian severity target.",
        "sourceType": "domain",
        "source": "Pack riset generik lokal; bukan fakta perusahaan",
        "confidence": 0.8,
        "verified": false,
        "notes": "Adaptasikan dengan dokumentasi target dan scope; pola bukan vulnerability target."
      },
      {
        "id": "banking-asset-4",
        "title": "Ledger Entry",
        "content": "Nilai bisnis terkait integritas, ownership dan authority pada Banking flow; bukan penilaian severity target.",
        "sourceType": "domain",
        "source": "Pack riset generik lokal; bukan fakta perusahaan",
        "confidence": 0.8,
        "verified": false,
        "notes": "Adaptasikan dengan dokumentasi target dan scope; pola bukan vulnerability target."
      },
      {
        "id": "banking-asset-5",
        "title": "Statement",
        "content": "Nilai bisnis terkait integritas, ownership dan authority pada Banking flow; bukan penilaian severity target.",
        "sourceType": "domain",
        "source": "Pack riset generik lokal; bukan fakta perusahaan",
        "confidence": 0.8,
        "verified": false,
        "notes": "Adaptasikan dengan dokumentasi target dan scope; pola bukan vulnerability target."
      }
    ],
    "commonTrustBoundaries": [
      {
        "id": "banking-boundary-1",
        "title": "Authorization → Execution",
        "content": "Authority harus tetap sesuai ketika aksi terlindungi benar-benar dijalankan.",
        "sourceType": "domain",
        "source": "Pack riset generik lokal; bukan fakta perusahaan",
        "confidence": 0.8,
        "verified": false,
        "notes": "Adaptasikan dengan dokumentasi target dan scope; pola bukan vulnerability target.",
        "fromComponent": "User / Client",
        "toComponent": "Backend / Worker",
        "channel": "request / job",
        "authority": "Izin actor untuk object dan state yang berlaku",
        "flowId": "banking-flow-1"
      }
    ],
    "securityInvariants": [
      {
        "id": "banking-invariant-1",
        "title": "Instruksi hanya dijalankan dengan mandat pemilik yang masih berlaku.",
        "content": "Instruksi hanya dijalankan dengan mandat pemilik yang masih berlaku.",
        "sourceType": "domain",
        "source": "Pack riset generik lokal; bukan fakta perusahaan",
        "confidence": 0.8,
        "verified": false,
        "notes": "Adaptasikan dengan dokumentasi target dan scope; pola bukan vulnerability target.",
        "flowId": "banking-flow-1",
        "techniqueIds": [
          "tech_17"
        ]
      },
      {
        "id": "banking-invariant-2",
        "title": "Statement tidak boleh terbaca oleh actor tanpa hak.",
        "content": "Statement tidak boleh terbaca oleh actor tanpa hak.",
        "sourceType": "domain",
        "source": "Pack riset generik lokal; bukan fakta perusahaan",
        "confidence": 0.8,
        "verified": false,
        "notes": "Adaptasikan dengan dokumentasi target dan scope; pola bukan vulnerability target.",
        "flowId": "banking-flow-1",
        "techniqueIds": [
          "tech_03"
        ]
      },
      {
        "id": "banking-invariant-3",
        "title": "Approval harus terikat pada instruksi yang disetujui.",
        "content": "Approval harus terikat pada instruksi yang disetujui.",
        "sourceType": "domain",
        "source": "Pack riset generik lokal; bukan fakta perusahaan",
        "confidence": 0.8,
        "verified": false,
        "notes": "Adaptasikan dengan dokumentasi target dan scope; pola bukan vulnerability target.",
        "flowId": "banking-flow-1",
        "techniqueIds": [
          "tech_02"
        ]
      }
    ],
    "commonFailurePatterns": [
      {
        "id": "banking-pattern-1",
        "title": "Authorization mismatch",
        "content": "Bandingkan authority efektif, owner, state dan context sebelum menyimpulkan kontrol gagal.",
        "sourceType": "domain",
        "source": "Pack riset generik lokal; bukan fakta perusahaan",
        "confidence": 0.8,
        "verified": false,
        "notes": "Adaptasikan dengan dokumentasi target dan scope; pola bukan vulnerability target."
      },
      {
        "id": "banking-pattern-2",
        "title": "Stale authorization",
        "content": "Pertanyaan generik: apakah authority lama masih dipakai setelah perubahan state?",
        "sourceType": "domain",
        "source": "Pack riset generik lokal; bukan fakta perusahaan",
        "confidence": 0.8,
        "verified": false,
        "notes": "Adaptasikan dengan dokumentasi target dan scope; pola bukan vulnerability target."
      },
      {
        "id": "banking-pattern-3",
        "title": "State desynchronization",
        "content": "Perbedaan state antarkomponen perlu kontrol timing dan evidence; belum tentu vulnerability.",
        "sourceType": "domain",
        "source": "Pack riset generik lokal; bukan fakta perusahaan",
        "confidence": 0.8,
        "verified": false,
        "notes": "Adaptasikan dengan dokumentasi target dan scope; pola bukan vulnerability target."
      }
    ],
    "relevantTechniques": [
      {
        "id": "banking-mapping-1",
        "title": "Technique tech_17",
        "content": "Object ownership: actor harus berhak atas object, account atau record yang dirujuk pada flow. Tinjau Banking flow bersama invariant terkait; gunakan hanya scope yang diotorisasi.",
        "sourceType": "domain",
        "source": "Pack riset generik lokal; bukan fakta perusahaan",
        "confidence": 0.8,
        "verified": false,
        "notes": "Adaptasikan dengan dokumentasi target dan scope; pola bukan vulnerability target.",
        "techniqueId": "tech_17",
        "flowId": "banking-flow-1",
        "invariantId": "banking-invariant-1",
        "researchPriority": 60
      },
      {
        "id": "banking-mapping-2",
        "title": "Technique tech_03",
        "content": "Capability context: persetujuan harus terikat pada actor, action, resource dan context yang diberikan. Tinjau Banking flow bersama invariant terkait; gunakan hanya scope yang diotorisasi.",
        "sourceType": "domain",
        "source": "Pack riset generik lokal; bukan fakta perusahaan",
        "confidence": 0.8,
        "verified": false,
        "notes": "Adaptasikan dengan dokumentasi target dan scope; pola bukan vulnerability target.",
        "techniqueId": "tech_03",
        "flowId": "banking-flow-1",
        "invariantId": "banking-invariant-2",
        "researchPriority": 70
      },
      {
        "id": "banking-mapping-3",
        "title": "Technique tech_02",
        "content": "Async revalidation: periksa apakah worker memakai authority/state yang masih berlaku ketika job dieksekusi. Tinjau Banking flow bersama invariant terkait; gunakan hanya scope yang diotorisasi.",
        "sourceType": "domain",
        "source": "Pack riset generik lokal; bukan fakta perusahaan",
        "confidence": 0.8,
        "verified": false,
        "notes": "Adaptasikan dengan dokumentasi target dan scope; pola bukan vulnerability target.",
        "techniqueId": "tech_02",
        "flowId": "banking-flow-1",
        "invariantId": "banking-invariant-3",
        "researchPriority": 80
      },
      {
        "id": "banking-mapping-4",
        "title": "Technique tech_18",
        "content": "Business logic: retry, urutan aksi dan state terminal tidak boleh menambah efek bisnis yang melanggar invariant. Tinjau Banking flow bersama invariant terkait; gunakan hanya scope yang diotorisasi.",
        "sourceType": "domain",
        "source": "Pack riset generik lokal; bukan fakta perusahaan",
        "confidence": 0.8,
        "verified": false,
        "notes": "Adaptasikan dengan dokumentasi target dan scope; pola bukan vulnerability target.",
        "techniqueId": "tech_18",
        "flowId": "banking-flow-1",
        "invariantId": "banking-invariant-1",
        "researchPriority": 60
      }
    ],
    "researchQuestions": [
      {
        "id": "banking-question-1",
        "title": "Bagaimana memastikan: Instruksi hanya dijalankan dengan mandat pemilik yang masih berlaku.",
        "content": "Instruksi hanya dijalankan dengan mandat pemilik yang masih berlaku. Apa expected behavior jika owner, authority atau state berubah sebelum execution; apa evidence yang membedakan kontrol efektif dari pelanggaran?",
        "sourceType": "domain",
        "source": "Pack riset generik lokal; bukan fakta perusahaan",
        "confidence": 0.8,
        "verified": false,
        "notes": "Adaptasikan dengan dokumentasi target dan scope; pola bukan vulnerability target.",
        "flowId": "banking-flow-1",
        "invariantId": "banking-invariant-1",
        "techniqueId": "tech_17"
      },
      {
        "id": "banking-question-2",
        "title": "Bagaimana memastikan: Statement tidak boleh terbaca oleh actor tanpa hak.",
        "content": "Statement tidak boleh terbaca oleh actor tanpa hak. Apa expected behavior jika owner, authority atau state berubah sebelum execution; apa evidence yang membedakan kontrol efektif dari pelanggaran?",
        "sourceType": "domain",
        "source": "Pack riset generik lokal; bukan fakta perusahaan",
        "confidence": 0.8,
        "verified": false,
        "notes": "Adaptasikan dengan dokumentasi target dan scope; pola bukan vulnerability target.",
        "flowId": "banking-flow-1",
        "invariantId": "banking-invariant-2",
        "techniqueId": "tech_03"
      },
      {
        "id": "banking-question-3",
        "title": "Bagaimana memastikan: Approval harus terikat pada instruksi yang disetujui.",
        "content": "Approval harus terikat pada instruksi yang disetujui. Apa expected behavior jika owner, authority atau state berubah sebelum execution; apa evidence yang membedakan kontrol efektif dari pelanggaran?",
        "sourceType": "domain",
        "source": "Pack riset generik lokal; bukan fakta perusahaan",
        "confidence": 0.8,
        "verified": false,
        "notes": "Adaptasikan dengan dokumentasi target dan scope; pola bukan vulnerability target.",
        "flowId": "banking-flow-1",
        "invariantId": "banking-invariant-3",
        "techniqueId": "tech_02"
      }
    ],
    "references": [
      {
        "title": "BIS CPMI — glossary clearing/settlement/reconciliation",
        "url": "https://www.bis.org/cpmi/publ/d00b.htm",
        "notes": "Referensi istilah proses pembayaran; invariant dan contoh penelitian adalah kurasi lokal."
      }
    ]
  },
  {
    "id": "cloud",
    "name": "Cloud",
    "description": "Layanan komputasi bersama dengan pengelolaan resource, identity, dan control/data plane.",
    "notes": "Contoh pembelajaran; bukan klaim tentang perusahaan atau izin testing.",
    "provenance": {
      "sourceType": "domain",
      "source": "Pack riset generik lokal; bukan fakta perusahaan",
      "confidence": 0.8,
      "verified": false,
      "notes": "Adaptasikan dengan dokumentasi target dan scope; pola bukan vulnerability target."
    },
    "coreConcepts": [
      "Control plane dan data plane",
      "Resource isolation",
      "Credential lifecycle"
    ],
    "terminology": [
      {
        "id": "cloud-term-1",
        "title": "Control Plane",
        "content": "Bagian layanan yang mengatur konfigurasi dan resource.",
        "sourceType": "domain",
        "source": "Pack riset generik lokal; bukan fakta perusahaan",
        "confidence": 0.8,
        "verified": false,
        "notes": "Adaptasikan dengan dokumentasi target dan scope; pola bukan vulnerability target.",
        "term": "Control Plane",
        "definition": "Bagian layanan yang mengatur konfigurasi dan resource.",
        "whyImportant": "Authority administrasi berbeda dari akses data.",
        "relatedTerms": [
          "Data Plane",
          "Policy"
        ]
      },
      {
        "id": "cloud-term-2",
        "title": "Data Plane",
        "content": "Bagian yang menjalankan atau membawa operasi/data layanan.",
        "sourceType": "domain",
        "source": "Pack riset generik lokal; bukan fakta perusahaan",
        "confidence": 0.8,
        "verified": false,
        "notes": "Adaptasikan dengan dokumentasi target dan scope; pola bukan vulnerability target.",
        "term": "Data Plane",
        "definition": "Bagian yang menjalankan atau membawa operasi/data layanan.",
        "whyImportant": "Akses data tetap membutuhkan izin efektif.",
        "relatedTerms": [
          "Control Plane"
        ]
      },
      {
        "id": "cloud-term-3",
        "title": "Policy",
        "content": "Aturan pemberian atau penolakan hak.",
        "sourceType": "domain",
        "source": "Pack riset generik lokal; bukan fakta perusahaan",
        "confidence": 0.8,
        "verified": false,
        "notes": "Adaptasikan dengan dokumentasi target dan scope; pola bukan vulnerability target.",
        "term": "Policy",
        "definition": "Aturan pemberian atau penolakan hak.",
        "whyImportant": "Policy aktual perlu ditinjau, bukan hanya nama role.",
        "relatedTerms": [
          "Credential",
          "Authority"
        ]
      },
      {
        "id": "cloud-term-4",
        "title": "Snapshot",
        "content": "Salinan state/resource pada waktu tertentu.",
        "sourceType": "domain",
        "source": "Pack riset generik lokal; bukan fakta perusahaan",
        "confidence": 0.8,
        "verified": false,
        "notes": "Adaptasikan dengan dokumentasi target dan scope; pola bukan vulnerability target.",
        "term": "Snapshot",
        "definition": "Salinan state/resource pada waktu tertentu.",
        "whyImportant": "Salinan bisa mempertahankan data sensitif.",
        "relatedTerms": [
          "Storage",
          "Resource"
        ]
      }
    ],
    "actors": [
      {
        "id": "cloud-actor-1",
        "title": "Tenant Administrator",
        "content": "Peran tipikal; hak efektif harus dikonfirmasi pada target.",
        "sourceType": "domain",
        "source": "Pack riset generik lokal; bukan fakta perusahaan",
        "confidence": 0.8,
        "verified": false,
        "notes": "Adaptasikan dengan dokumentasi target dan scope; pola bukan vulnerability target."
      },
      {
        "id": "cloud-actor-2",
        "title": "Developer",
        "content": "Peran tipikal; hak efektif harus dikonfirmasi pada target.",
        "sourceType": "domain",
        "source": "Pack riset generik lokal; bukan fakta perusahaan",
        "confidence": 0.8,
        "verified": false,
        "notes": "Adaptasikan dengan dokumentasi target dan scope; pola bukan vulnerability target."
      },
      {
        "id": "cloud-actor-3",
        "title": "Operator",
        "content": "Peran tipikal; hak efektif harus dikonfirmasi pada target.",
        "sourceType": "domain",
        "source": "Pack riset generik lokal; bukan fakta perusahaan",
        "confidence": 0.8,
        "verified": false,
        "notes": "Adaptasikan dengan dokumentasi target dan scope; pola bukan vulnerability target."
      },
      {
        "id": "cloud-actor-4",
        "title": "Service Account",
        "content": "Peran tipikal; hak efektif harus dikonfirmasi pada target.",
        "sourceType": "domain",
        "source": "Pack riset generik lokal; bukan fakta perusahaan",
        "confidence": 0.8,
        "verified": false,
        "notes": "Adaptasikan dengan dokumentasi target dan scope; pola bukan vulnerability target."
      },
      {
        "id": "cloud-actor-5",
        "title": "Workload",
        "content": "Peran tipikal; hak efektif harus dikonfirmasi pada target.",
        "sourceType": "domain",
        "source": "Pack riset generik lokal; bukan fakta perusahaan",
        "confidence": 0.8,
        "verified": false,
        "notes": "Adaptasikan dengan dokumentasi target dan scope; pola bukan vulnerability target."
      },
      {
        "id": "cloud-actor-6",
        "title": "Support",
        "content": "Peran tipikal; hak efektif harus dikonfirmasi pada target.",
        "sourceType": "domain",
        "source": "Pack riset generik lokal; bukan fakta perusahaan",
        "confidence": 0.8,
        "verified": false,
        "notes": "Adaptasikan dengan dokumentasi target dan scope; pola bukan vulnerability target."
      }
    ],
    "businessObjects": [
      {
        "id": "cloud-object-1",
        "title": "Account",
        "content": "Resource bisnis tipikal; ownership, state dan sensitivitas perlu dipetakan.",
        "sourceType": "domain",
        "source": "Pack riset generik lokal; bukan fakta perusahaan",
        "confidence": 0.8,
        "verified": false,
        "notes": "Adaptasikan dengan dokumentasi target dan scope; pola bukan vulnerability target."
      },
      {
        "id": "cloud-object-2",
        "title": "Project",
        "content": "Resource bisnis tipikal; ownership, state dan sensitivitas perlu dipetakan.",
        "sourceType": "domain",
        "source": "Pack riset generik lokal; bukan fakta perusahaan",
        "confidence": 0.8,
        "verified": false,
        "notes": "Adaptasikan dengan dokumentasi target dan scope; pola bukan vulnerability target."
      },
      {
        "id": "cloud-object-3",
        "title": "Compute Resource",
        "content": "Resource bisnis tipikal; ownership, state dan sensitivitas perlu dipetakan.",
        "sourceType": "domain",
        "source": "Pack riset generik lokal; bukan fakta perusahaan",
        "confidence": 0.8,
        "verified": false,
        "notes": "Adaptasikan dengan dokumentasi target dan scope; pola bukan vulnerability target."
      },
      {
        "id": "cloud-object-4",
        "title": "Storage Object",
        "content": "Resource bisnis tipikal; ownership, state dan sensitivitas perlu dipetakan.",
        "sourceType": "domain",
        "source": "Pack riset generik lokal; bukan fakta perusahaan",
        "confidence": 0.8,
        "verified": false,
        "notes": "Adaptasikan dengan dokumentasi target dan scope; pola bukan vulnerability target."
      },
      {
        "id": "cloud-object-5",
        "title": "Policy",
        "content": "Resource bisnis tipikal; ownership, state dan sensitivitas perlu dipetakan.",
        "sourceType": "domain",
        "source": "Pack riset generik lokal; bukan fakta perusahaan",
        "confidence": 0.8,
        "verified": false,
        "notes": "Adaptasikan dengan dokumentasi target dan scope; pola bukan vulnerability target."
      },
      {
        "id": "cloud-object-6",
        "title": "Credential",
        "content": "Resource bisnis tipikal; ownership, state dan sensitivitas perlu dipetakan.",
        "sourceType": "domain",
        "source": "Pack riset generik lokal; bukan fakta perusahaan",
        "confidence": 0.8,
        "verified": false,
        "notes": "Adaptasikan dengan dokumentasi target dan scope; pola bukan vulnerability target."
      },
      {
        "id": "cloud-object-7",
        "title": "Snapshot",
        "content": "Resource bisnis tipikal; ownership, state dan sensitivitas perlu dipetakan.",
        "sourceType": "domain",
        "source": "Pack riset generik lokal; bukan fakta perusahaan",
        "confidence": 0.8,
        "verified": false,
        "notes": "Adaptasikan dengan dokumentasi target dan scope; pola bukan vulnerability target."
      },
      {
        "id": "cloud-object-8",
        "title": "Job",
        "content": "Resource bisnis tipikal; ownership, state dan sensitivitas perlu dipetakan.",
        "sourceType": "domain",
        "source": "Pack riset generik lokal; bukan fakta perusahaan",
        "confidence": 0.8,
        "verified": false,
        "notes": "Adaptasikan dengan dokumentasi target dan scope; pola bukan vulnerability target."
      }
    ],
    "businessFlows": [
      {
        "id": "cloud-flow-1",
        "title": "Cloud — flow generik",
        "content": "Layanan komputasi bersama dengan pengelolaan resource, identity, dan control/data plane.",
        "sourceType": "domain",
        "source": "Pack riset generik lokal; bukan fakta perusahaan",
        "confidence": 0.8,
        "verified": false,
        "notes": "Adaptasikan dengan dokumentasi target dan scope; pola bukan vulnerability target.",
        "steps": [
          "Tenant",
          "Project",
          "Assign Policy",
          "Provision Resource",
          "Access Data",
          "Rotate Credential",
          "Delete Resource"
        ],
        "actorIds": [
          "cloud-actor-1",
          "cloud-actor-2",
          "cloud-actor-3",
          "cloud-actor-4",
          "cloud-actor-5",
          "cloud-actor-6"
        ],
        "objectIds": [
          "cloud-object-1",
          "cloud-object-2",
          "cloud-object-3",
          "cloud-object-4",
          "cloud-object-5",
          "cloud-object-6",
          "cloud-object-7",
          "cloud-object-8"
        ],
        "boundaryIds": [
          "cloud-boundary-1"
        ],
        "invariantIds": [
          "cloud-invariant-1",
          "cloud-invariant-2",
          "cloud-invariant-3"
        ],
        "transitions": [
          {
            "id": "cloud-transition-1",
            "fromState": "Tenant",
            "toState": "Project",
            "action": "Tenant → Project",
            "critical": false,
            "invariantIds": [
              "cloud-invariant-1",
              "cloud-invariant-2",
              "cloud-invariant-3"
            ]
          },
          {
            "id": "cloud-transition-2",
            "fromState": "Project",
            "toState": "Assign Policy",
            "action": "Project → Assign Policy",
            "critical": false,
            "invariantIds": [
              "cloud-invariant-1",
              "cloud-invariant-2",
              "cloud-invariant-3"
            ]
          },
          {
            "id": "cloud-transition-3",
            "fromState": "Assign Policy",
            "toState": "Provision Resource",
            "action": "Assign Policy → Provision Resource",
            "critical": false,
            "invariantIds": [
              "cloud-invariant-1",
              "cloud-invariant-2",
              "cloud-invariant-3"
            ]
          },
          {
            "id": "cloud-transition-4",
            "fromState": "Provision Resource",
            "toState": "Access Data",
            "action": "Provision Resource → Access Data",
            "critical": false,
            "invariantIds": [
              "cloud-invariant-1",
              "cloud-invariant-2",
              "cloud-invariant-3"
            ]
          },
          {
            "id": "cloud-transition-5",
            "fromState": "Access Data",
            "toState": "Rotate Credential",
            "action": "Access Data → Rotate Credential",
            "critical": true,
            "invariantIds": [
              "cloud-invariant-1",
              "cloud-invariant-2",
              "cloud-invariant-3"
            ]
          },
          {
            "id": "cloud-transition-6",
            "fromState": "Rotate Credential",
            "toState": "Delete Resource",
            "action": "Rotate Credential → Delete Resource",
            "critical": true,
            "invariantIds": [
              "cloud-invariant-1",
              "cloud-invariant-2",
              "cloud-invariant-3"
            ]
          }
        ]
      }
    ],
    "sensitiveData": [
      {
        "id": "cloud-sensitive-1",
        "title": "Storage objects and snapshots",
        "content": "Kategori data generik Cloud; konfirmasi sensitivitas pada target dan gunakan data dummy/redaksi.",
        "sourceType": "domain",
        "source": "Pack riset generik lokal; bukan fakta perusahaan",
        "confidence": 0.8,
        "verified": false,
        "notes": "Adaptasikan dengan dokumentasi target dan scope; pola bukan vulnerability target."
      },
      {
        "id": "cloud-sensitive-2",
        "title": "IAM policies and workload credentials",
        "content": "Kategori data generik Cloud; konfirmasi sensitivitas pada target dan gunakan data dummy/redaksi.",
        "sourceType": "domain",
        "source": "Pack riset generik lokal; bukan fakta perusahaan",
        "confidence": 0.8,
        "verified": false,
        "notes": "Adaptasikan dengan dokumentasi target dan scope; pola bukan vulnerability target."
      },
      {
        "id": "cloud-sensitive-3",
        "title": "Tenant usage and audit records",
        "content": "Kategori data generik Cloud; konfirmasi sensitivitas pada target dan gunakan data dummy/redaksi.",
        "sourceType": "domain",
        "source": "Pack riset generik lokal; bukan fakta perusahaan",
        "confidence": 0.8,
        "verified": false,
        "notes": "Adaptasikan dengan dokumentasi target dan scope; pola bukan vulnerability target."
      }
    ],
    "criticalAssets": [
      {
        "id": "cloud-asset-1",
        "title": "Storage Object",
        "content": "Nilai bisnis terkait integritas, ownership dan authority pada Cloud flow; bukan penilaian severity target.",
        "sourceType": "domain",
        "source": "Pack riset generik lokal; bukan fakta perusahaan",
        "confidence": 0.8,
        "verified": false,
        "notes": "Adaptasikan dengan dokumentasi target dan scope; pola bukan vulnerability target."
      },
      {
        "id": "cloud-asset-2",
        "title": "Policy",
        "content": "Nilai bisnis terkait integritas, ownership dan authority pada Cloud flow; bukan penilaian severity target.",
        "sourceType": "domain",
        "source": "Pack riset generik lokal; bukan fakta perusahaan",
        "confidence": 0.8,
        "verified": false,
        "notes": "Adaptasikan dengan dokumentasi target dan scope; pola bukan vulnerability target."
      },
      {
        "id": "cloud-asset-3",
        "title": "Credential",
        "content": "Nilai bisnis terkait integritas, ownership dan authority pada Cloud flow; bukan penilaian severity target.",
        "sourceType": "domain",
        "source": "Pack riset generik lokal; bukan fakta perusahaan",
        "confidence": 0.8,
        "verified": false,
        "notes": "Adaptasikan dengan dokumentasi target dan scope; pola bukan vulnerability target."
      },
      {
        "id": "cloud-asset-4",
        "title": "Snapshot",
        "content": "Nilai bisnis terkait integritas, ownership dan authority pada Cloud flow; bukan penilaian severity target.",
        "sourceType": "domain",
        "source": "Pack riset generik lokal; bukan fakta perusahaan",
        "confidence": 0.8,
        "verified": false,
        "notes": "Adaptasikan dengan dokumentasi target dan scope; pola bukan vulnerability target."
      }
    ],
    "commonTrustBoundaries": [
      {
        "id": "cloud-boundary-1",
        "title": "Authorization → Execution",
        "content": "Authority harus tetap sesuai ketika aksi terlindungi benar-benar dijalankan.",
        "sourceType": "domain",
        "source": "Pack riset generik lokal; bukan fakta perusahaan",
        "confidence": 0.8,
        "verified": false,
        "notes": "Adaptasikan dengan dokumentasi target dan scope; pola bukan vulnerability target.",
        "fromComponent": "User / Client",
        "toComponent": "Backend / Worker",
        "channel": "request / job",
        "authority": "Izin actor untuk object dan state yang berlaku",
        "flowId": "cloud-flow-1"
      }
    ],
    "securityInvariants": [
      {
        "id": "cloud-invariant-1",
        "title": "Identity suatu tenant tidak boleh mengelola resource tenant lain tanpa izin.",
        "content": "Identity suatu tenant tidak boleh mengelola resource tenant lain tanpa izin.",
        "sourceType": "domain",
        "source": "Pack riset generik lokal; bukan fakta perusahaan",
        "confidence": 0.8,
        "verified": false,
        "notes": "Adaptasikan dengan dokumentasi target dan scope; pola bukan vulnerability target.",
        "flowId": "cloud-flow-1",
        "techniqueIds": [
          "tech_14"
        ]
      },
      {
        "id": "cloud-invariant-2",
        "title": "Policy dicabut harus dihormati pada operasi terlindungi.",
        "content": "Policy dicabut harus dihormati pada operasi terlindungi.",
        "sourceType": "domain",
        "source": "Pack riset generik lokal; bukan fakta perusahaan",
        "confidence": 0.8,
        "verified": false,
        "notes": "Adaptasikan dengan dokumentasi target dan scope; pola bukan vulnerability target.",
        "flowId": "cloud-flow-1",
        "techniqueIds": [
          "tech_16"
        ]
      },
      {
        "id": "cloud-invariant-3",
        "title": "Snapshot/storage harus mempertahankan ownership dan sensitivitas.",
        "content": "Snapshot/storage harus mempertahankan ownership dan sensitivitas.",
        "sourceType": "domain",
        "source": "Pack riset generik lokal; bukan fakta perusahaan",
        "confidence": 0.8,
        "verified": false,
        "notes": "Adaptasikan dengan dokumentasi target dan scope; pola bukan vulnerability target.",
        "flowId": "cloud-flow-1",
        "techniqueIds": [
          "tech_07"
        ]
      }
    ],
    "commonFailurePatterns": [
      {
        "id": "cloud-pattern-1",
        "title": "Authorization mismatch",
        "content": "Bandingkan authority efektif, owner, state dan context sebelum menyimpulkan kontrol gagal.",
        "sourceType": "domain",
        "source": "Pack riset generik lokal; bukan fakta perusahaan",
        "confidence": 0.8,
        "verified": false,
        "notes": "Adaptasikan dengan dokumentasi target dan scope; pola bukan vulnerability target."
      },
      {
        "id": "cloud-pattern-2",
        "title": "Stale authorization",
        "content": "Pertanyaan generik: apakah authority lama masih dipakai setelah perubahan state?",
        "sourceType": "domain",
        "source": "Pack riset generik lokal; bukan fakta perusahaan",
        "confidence": 0.8,
        "verified": false,
        "notes": "Adaptasikan dengan dokumentasi target dan scope; pola bukan vulnerability target."
      },
      {
        "id": "cloud-pattern-3",
        "title": "State desynchronization",
        "content": "Perbedaan state antarkomponen perlu kontrol timing dan evidence; belum tentu vulnerability.",
        "sourceType": "domain",
        "source": "Pack riset generik lokal; bukan fakta perusahaan",
        "confidence": 0.8,
        "verified": false,
        "notes": "Adaptasikan dengan dokumentasi target dan scope; pola bukan vulnerability target."
      }
    ],
    "relevantTechniques": [
      {
        "id": "cloud-mapping-1",
        "title": "Technique tech_14",
        "content": "Tenant isolation: resource dan capability satu organisasi tidak memberi akses ke organisasi lain. Tinjau Cloud flow bersama invariant terkait; gunakan hanya scope yang diotorisasi.",
        "sourceType": "domain",
        "source": "Pack riset generik lokal; bukan fakta perusahaan",
        "confidence": 0.8,
        "verified": false,
        "notes": "Adaptasikan dengan dokumentasi target dan scope; pola bukan vulnerability target.",
        "techniqueId": "tech_14",
        "flowId": "cloud-flow-1",
        "invariantId": "cloud-invariant-1",
        "researchPriority": 60
      },
      {
        "id": "cloud-mapping-2",
        "title": "Technique tech_16",
        "content": "Vertical authority: operasi privilege tinggi harus menolak actor tanpa hak efektif yang sesuai. Tinjau Cloud flow bersama invariant terkait; gunakan hanya scope yang diotorisasi.",
        "sourceType": "domain",
        "source": "Pack riset generik lokal; bukan fakta perusahaan",
        "confidence": 0.8,
        "verified": false,
        "notes": "Adaptasikan dengan dokumentasi target dan scope; pola bukan vulnerability target.",
        "techniqueId": "tech_16",
        "flowId": "cloud-flow-1",
        "invariantId": "cloud-invariant-2",
        "researchPriority": 70
      },
      {
        "id": "cloud-mapping-3",
        "title": "Technique tech_07",
        "content": "Revocation/lifecycle: periksa capability dan resource turunan setelah izin, membership atau credential dicabut. Tinjau Cloud flow bersama invariant terkait; gunakan hanya scope yang diotorisasi.",
        "sourceType": "domain",
        "source": "Pack riset generik lokal; bukan fakta perusahaan",
        "confidence": 0.8,
        "verified": false,
        "notes": "Adaptasikan dengan dokumentasi target dan scope; pola bukan vulnerability target.",
        "techniqueId": "tech_07",
        "flowId": "cloud-flow-1",
        "invariantId": "cloud-invariant-3",
        "researchPriority": 80
      },
      {
        "id": "cloud-mapping-4",
        "title": "Technique tech_02",
        "content": "Async revalidation: periksa apakah worker memakai authority/state yang masih berlaku ketika job dieksekusi. Tinjau Cloud flow bersama invariant terkait; gunakan hanya scope yang diotorisasi.",
        "sourceType": "domain",
        "source": "Pack riset generik lokal; bukan fakta perusahaan",
        "confidence": 0.8,
        "verified": false,
        "notes": "Adaptasikan dengan dokumentasi target dan scope; pola bukan vulnerability target.",
        "techniqueId": "tech_02",
        "flowId": "cloud-flow-1",
        "invariantId": "cloud-invariant-1",
        "researchPriority": 60
      },
      {
        "id": "cloud-mapping-5",
        "title": "Technique tech_15",
        "content": "File/share/export: salinan, link dan export harus mempertahankan ownership serta perubahan akses. Tinjau Cloud flow bersama invariant terkait; gunakan hanya scope yang diotorisasi.",
        "sourceType": "domain",
        "source": "Pack riset generik lokal; bukan fakta perusahaan",
        "confidence": 0.8,
        "verified": false,
        "notes": "Adaptasikan dengan dokumentasi target dan scope; pola bukan vulnerability target.",
        "techniqueId": "tech_15",
        "flowId": "cloud-flow-1",
        "invariantId": "cloud-invariant-2",
        "researchPriority": 70
      }
    ],
    "researchQuestions": [
      {
        "id": "cloud-question-1",
        "title": "Bagaimana memastikan: Identity suatu tenant tidak boleh mengelola resource tenant lain tanpa izin.",
        "content": "Identity suatu tenant tidak boleh mengelola resource tenant lain tanpa izin. Apa expected behavior jika owner, authority atau state berubah sebelum execution; apa evidence yang membedakan kontrol efektif dari pelanggaran?",
        "sourceType": "domain",
        "source": "Pack riset generik lokal; bukan fakta perusahaan",
        "confidence": 0.8,
        "verified": false,
        "notes": "Adaptasikan dengan dokumentasi target dan scope; pola bukan vulnerability target.",
        "flowId": "cloud-flow-1",
        "invariantId": "cloud-invariant-1",
        "techniqueId": "tech_14"
      },
      {
        "id": "cloud-question-2",
        "title": "Bagaimana memastikan: Policy dicabut harus dihormati pada operasi terlindungi.",
        "content": "Policy dicabut harus dihormati pada operasi terlindungi. Apa expected behavior jika owner, authority atau state berubah sebelum execution; apa evidence yang membedakan kontrol efektif dari pelanggaran?",
        "sourceType": "domain",
        "source": "Pack riset generik lokal; bukan fakta perusahaan",
        "confidence": 0.8,
        "verified": false,
        "notes": "Adaptasikan dengan dokumentasi target dan scope; pola bukan vulnerability target.",
        "flowId": "cloud-flow-1",
        "invariantId": "cloud-invariant-2",
        "techniqueId": "tech_16"
      },
      {
        "id": "cloud-question-3",
        "title": "Bagaimana memastikan: Snapshot/storage harus mempertahankan ownership dan sensitivitas.",
        "content": "Snapshot/storage harus mempertahankan ownership dan sensitivitas. Apa expected behavior jika owner, authority atau state berubah sebelum execution; apa evidence yang membedakan kontrol efektif dari pelanggaran?",
        "sourceType": "domain",
        "source": "Pack riset generik lokal; bukan fakta perusahaan",
        "confidence": 0.8,
        "verified": false,
        "notes": "Adaptasikan dengan dokumentasi target dan scope; pola bukan vulnerability target.",
        "flowId": "cloud-flow-1",
        "invariantId": "cloud-invariant-3",
        "techniqueId": "tech_07"
      }
    ],
    "references": [
      {
        "title": "NIST SP 800-145 — cloud service models",
        "url": "https://www.nist.gov/publications/nist-definition-cloud-computing",
        "notes": "Referensi model layanan; mapping kontrol adalah pola riset generik."
      }
    ]
  },
  {
    "id": "developer-platform",
    "name": "Developer Platform",
    "description": "Layanan untuk proyek developer, API, build, release, dan integrasi.",
    "notes": "Contoh pembelajaran; bukan klaim tentang perusahaan atau izin testing.",
    "provenance": {
      "sourceType": "domain",
      "source": "Pack riset generik lokal; bukan fakta perusahaan",
      "confidence": 0.8,
      "verified": false,
      "notes": "Adaptasikan dengan dokumentasi target dan scope; pola bukan vulnerability target."
    },
    "coreConcepts": [
      "Credential project",
      "Delegasi integrasi",
      "Lifecycle build/release"
    ],
    "terminology": [
      {
        "id": "developer-platform-term-1",
        "title": "Artifact",
        "content": "Output build/proses yang disimpan untuk penggunaan berikutnya.",
        "sourceType": "domain",
        "source": "Pack riset generik lokal; bukan fakta perusahaan",
        "confidence": 0.8,
        "verified": false,
        "notes": "Adaptasikan dengan dokumentasi target dan scope; pola bukan vulnerability target.",
        "term": "Artifact",
        "definition": "Output build/proses yang disimpan untuk penggunaan berikutnya.",
        "whyImportant": "Ownership/lifecycle berbeda dari request awal.",
        "relatedTerms": [
          "Build",
          "Release"
        ]
      },
      {
        "id": "developer-platform-term-2",
        "title": "API Credential",
        "content": "Credential yang dipakai client untuk akses API.",
        "sourceType": "domain",
        "source": "Pack riset generik lokal; bukan fakta perusahaan",
        "confidence": 0.8,
        "verified": false,
        "notes": "Adaptasikan dengan dokumentasi target dan scope; pola bukan vulnerability target.",
        "term": "API Credential",
        "definition": "Credential yang dipakai client untuk akses API.",
        "whyImportant": "Scope dan revoke harus ditegakkan.",
        "relatedTerms": [
          "Project",
          "API Client"
        ]
      },
      {
        "id": "developer-platform-term-3",
        "title": "Build",
        "content": "Proses menghasilkan artifact dari input.",
        "sourceType": "domain",
        "source": "Pack riset generik lokal; bukan fakta perusahaan",
        "confidence": 0.8,
        "verified": false,
        "notes": "Adaptasikan dengan dokumentasi target dan scope; pola bukan vulnerability target.",
        "term": "Build",
        "definition": "Proses menghasilkan artifact dari input.",
        "whyImportant": "Worker dan input membentuk boundary.",
        "relatedTerms": [
          "Artifact",
          "Worker"
        ]
      },
      {
        "id": "developer-platform-term-4",
        "title": "Webhook",
        "content": "Pengiriman event ke destination yang dikonfigurasi.",
        "sourceType": "domain",
        "source": "Pack riset generik lokal; bukan fakta perusahaan",
        "confidence": 0.8,
        "verified": false,
        "notes": "Adaptasikan dengan dokumentasi target dan scope; pola bukan vulnerability target.",
        "term": "Webhook",
        "definition": "Pengiriman event ke destination yang dikonfigurasi.",
        "whyImportant": "Destination harus terikat pada owner sah.",
        "relatedTerms": [
          "Integration",
          "Event"
        ]
      }
    ],
    "actors": [
      {
        "id": "developer-platform-actor-1",
        "title": "Developer",
        "content": "Peran tipikal; hak efektif harus dikonfirmasi pada target.",
        "sourceType": "domain",
        "source": "Pack riset generik lokal; bukan fakta perusahaan",
        "confidence": 0.8,
        "verified": false,
        "notes": "Adaptasikan dengan dokumentasi target dan scope; pola bukan vulnerability target."
      },
      {
        "id": "developer-platform-actor-2",
        "title": "Maintainer",
        "content": "Peran tipikal; hak efektif harus dikonfirmasi pada target.",
        "sourceType": "domain",
        "source": "Pack riset generik lokal; bukan fakta perusahaan",
        "confidence": 0.8,
        "verified": false,
        "notes": "Adaptasikan dengan dokumentasi target dan scope; pola bukan vulnerability target."
      },
      {
        "id": "developer-platform-actor-3",
        "title": "Organization Owner",
        "content": "Peran tipikal; hak efektif harus dikonfirmasi pada target.",
        "sourceType": "domain",
        "source": "Pack riset generik lokal; bukan fakta perusahaan",
        "confidence": 0.8,
        "verified": false,
        "notes": "Adaptasikan dengan dokumentasi target dan scope; pola bukan vulnerability target."
      },
      {
        "id": "developer-platform-actor-4",
        "title": "CI Worker",
        "content": "Peran tipikal; hak efektif harus dikonfirmasi pada target.",
        "sourceType": "domain",
        "source": "Pack riset generik lokal; bukan fakta perusahaan",
        "confidence": 0.8,
        "verified": false,
        "notes": "Adaptasikan dengan dokumentasi target dan scope; pola bukan vulnerability target."
      },
      {
        "id": "developer-platform-actor-5",
        "title": "API Client",
        "content": "Peran tipikal; hak efektif harus dikonfirmasi pada target.",
        "sourceType": "domain",
        "source": "Pack riset generik lokal; bukan fakta perusahaan",
        "confidence": 0.8,
        "verified": false,
        "notes": "Adaptasikan dengan dokumentasi target dan scope; pola bukan vulnerability target."
      },
      {
        "id": "developer-platform-actor-6",
        "title": "Service Account",
        "content": "Peran tipikal; hak efektif harus dikonfirmasi pada target.",
        "sourceType": "domain",
        "source": "Pack riset generik lokal; bukan fakta perusahaan",
        "confidence": 0.8,
        "verified": false,
        "notes": "Adaptasikan dengan dokumentasi target dan scope; pola bukan vulnerability target."
      }
    ],
    "businessObjects": [
      {
        "id": "developer-platform-object-1",
        "title": "Project",
        "content": "Resource bisnis tipikal; ownership, state dan sensitivitas perlu dipetakan.",
        "sourceType": "domain",
        "source": "Pack riset generik lokal; bukan fakta perusahaan",
        "confidence": 0.8,
        "verified": false,
        "notes": "Adaptasikan dengan dokumentasi target dan scope; pola bukan vulnerability target."
      },
      {
        "id": "developer-platform-object-2",
        "title": "Repository",
        "content": "Resource bisnis tipikal; ownership, state dan sensitivitas perlu dipetakan.",
        "sourceType": "domain",
        "source": "Pack riset generik lokal; bukan fakta perusahaan",
        "confidence": 0.8,
        "verified": false,
        "notes": "Adaptasikan dengan dokumentasi target dan scope; pola bukan vulnerability target."
      },
      {
        "id": "developer-platform-object-3",
        "title": "API Credential",
        "content": "Resource bisnis tipikal; ownership, state dan sensitivitas perlu dipetakan.",
        "sourceType": "domain",
        "source": "Pack riset generik lokal; bukan fakta perusahaan",
        "confidence": 0.8,
        "verified": false,
        "notes": "Adaptasikan dengan dokumentasi target dan scope; pola bukan vulnerability target."
      },
      {
        "id": "developer-platform-object-4",
        "title": "Build",
        "content": "Resource bisnis tipikal; ownership, state dan sensitivitas perlu dipetakan.",
        "sourceType": "domain",
        "source": "Pack riset generik lokal; bukan fakta perusahaan",
        "confidence": 0.8,
        "verified": false,
        "notes": "Adaptasikan dengan dokumentasi target dan scope; pola bukan vulnerability target."
      },
      {
        "id": "developer-platform-object-5",
        "title": "Artifact",
        "content": "Resource bisnis tipikal; ownership, state dan sensitivitas perlu dipetakan.",
        "sourceType": "domain",
        "source": "Pack riset generik lokal; bukan fakta perusahaan",
        "confidence": 0.8,
        "verified": false,
        "notes": "Adaptasikan dengan dokumentasi target dan scope; pola bukan vulnerability target."
      },
      {
        "id": "developer-platform-object-6",
        "title": "Release",
        "content": "Resource bisnis tipikal; ownership, state dan sensitivitas perlu dipetakan.",
        "sourceType": "domain",
        "source": "Pack riset generik lokal; bukan fakta perusahaan",
        "confidence": 0.8,
        "verified": false,
        "notes": "Adaptasikan dengan dokumentasi target dan scope; pola bukan vulnerability target."
      },
      {
        "id": "developer-platform-object-7",
        "title": "Webhook",
        "content": "Resource bisnis tipikal; ownership, state dan sensitivitas perlu dipetakan.",
        "sourceType": "domain",
        "source": "Pack riset generik lokal; bukan fakta perusahaan",
        "confidence": 0.8,
        "verified": false,
        "notes": "Adaptasikan dengan dokumentasi target dan scope; pola bukan vulnerability target."
      },
      {
        "id": "developer-platform-object-8",
        "title": "Integration",
        "content": "Resource bisnis tipikal; ownership, state dan sensitivitas perlu dipetakan.",
        "sourceType": "domain",
        "source": "Pack riset generik lokal; bukan fakta perusahaan",
        "confidence": 0.8,
        "verified": false,
        "notes": "Adaptasikan dengan dokumentasi target dan scope; pola bukan vulnerability target."
      }
    ],
    "businessFlows": [
      {
        "id": "developer-platform-flow-1",
        "title": "Developer Platform — flow generik",
        "content": "Layanan untuk proyek developer, API, build, release, dan integrasi.",
        "sourceType": "domain",
        "source": "Pack riset generik lokal; bukan fakta perusahaan",
        "confidence": 0.8,
        "verified": false,
        "notes": "Adaptasikan dengan dokumentasi target dan scope; pola bukan vulnerability target.",
        "steps": [
          "Developer",
          "Project",
          "Credential",
          "Request / Build",
          "Artifact",
          "Release",
          "Webhook"
        ],
        "actorIds": [
          "developer-platform-actor-1",
          "developer-platform-actor-2",
          "developer-platform-actor-3",
          "developer-platform-actor-4",
          "developer-platform-actor-5",
          "developer-platform-actor-6"
        ],
        "objectIds": [
          "developer-platform-object-1",
          "developer-platform-object-2",
          "developer-platform-object-3",
          "developer-platform-object-4",
          "developer-platform-object-5",
          "developer-platform-object-6",
          "developer-platform-object-7",
          "developer-platform-object-8"
        ],
        "boundaryIds": [
          "developer-platform-boundary-1"
        ],
        "invariantIds": [
          "developer-platform-invariant-1",
          "developer-platform-invariant-2",
          "developer-platform-invariant-3"
        ],
        "transitions": [
          {
            "id": "developer-platform-transition-1",
            "fromState": "Developer",
            "toState": "Project",
            "action": "Developer → Project",
            "critical": false,
            "invariantIds": [
              "developer-platform-invariant-1",
              "developer-platform-invariant-2",
              "developer-platform-invariant-3"
            ]
          },
          {
            "id": "developer-platform-transition-2",
            "fromState": "Project",
            "toState": "Credential",
            "action": "Project → Credential",
            "critical": true,
            "invariantIds": [
              "developer-platform-invariant-1",
              "developer-platform-invariant-2",
              "developer-platform-invariant-3"
            ]
          },
          {
            "id": "developer-platform-transition-3",
            "fromState": "Credential",
            "toState": "Request / Build",
            "action": "Credential → Request / Build",
            "critical": true,
            "invariantIds": [
              "developer-platform-invariant-1",
              "developer-platform-invariant-2",
              "developer-platform-invariant-3"
            ]
          },
          {
            "id": "developer-platform-transition-4",
            "fromState": "Request / Build",
            "toState": "Artifact",
            "action": "Request / Build → Artifact",
            "critical": false,
            "invariantIds": [
              "developer-platform-invariant-1",
              "developer-platform-invariant-2",
              "developer-platform-invariant-3"
            ]
          },
          {
            "id": "developer-platform-transition-5",
            "fromState": "Artifact",
            "toState": "Release",
            "action": "Artifact → Release",
            "critical": false,
            "invariantIds": [
              "developer-platform-invariant-1",
              "developer-platform-invariant-2",
              "developer-platform-invariant-3"
            ]
          },
          {
            "id": "developer-platform-transition-6",
            "fromState": "Release",
            "toState": "Webhook",
            "action": "Release → Webhook",
            "critical": false,
            "invariantIds": [
              "developer-platform-invariant-1",
              "developer-platform-invariant-2",
              "developer-platform-invariant-3"
            ]
          }
        ]
      }
    ],
    "sensitiveData": [
      {
        "id": "developer-platform-sensitive-1",
        "title": "Source code and private artifacts",
        "content": "Kategori data generik Developer Platform; konfirmasi sensitivitas pada target dan gunakan data dummy/redaksi.",
        "sourceType": "domain",
        "source": "Pack riset generik lokal; bukan fakta perusahaan",
        "confidence": 0.8,
        "verified": false,
        "notes": "Adaptasikan dengan dokumentasi target dan scope; pola bukan vulnerability target."
      },
      {
        "id": "developer-platform-sensitive-2",
        "title": "Build secrets and API credentials",
        "content": "Kategori data generik Developer Platform; konfirmasi sensitivitas pada target dan gunakan data dummy/redaksi.",
        "sourceType": "domain",
        "source": "Pack riset generik lokal; bukan fakta perusahaan",
        "confidence": 0.8,
        "verified": false,
        "notes": "Adaptasikan dengan dokumentasi target dan scope; pola bukan vulnerability target."
      },
      {
        "id": "developer-platform-sensitive-3",
        "title": "Webhook and release configuration",
        "content": "Kategori data generik Developer Platform; konfirmasi sensitivitas pada target dan gunakan data dummy/redaksi.",
        "sourceType": "domain",
        "source": "Pack riset generik lokal; bukan fakta perusahaan",
        "confidence": 0.8,
        "verified": false,
        "notes": "Adaptasikan dengan dokumentasi target dan scope; pola bukan vulnerability target."
      }
    ],
    "criticalAssets": [
      {
        "id": "developer-platform-asset-1",
        "title": "API Credential",
        "content": "Nilai bisnis terkait integritas, ownership dan authority pada Developer Platform flow; bukan penilaian severity target.",
        "sourceType": "domain",
        "source": "Pack riset generik lokal; bukan fakta perusahaan",
        "confidence": 0.8,
        "verified": false,
        "notes": "Adaptasikan dengan dokumentasi target dan scope; pola bukan vulnerability target."
      },
      {
        "id": "developer-platform-asset-2",
        "title": "Repository",
        "content": "Nilai bisnis terkait integritas, ownership dan authority pada Developer Platform flow; bukan penilaian severity target.",
        "sourceType": "domain",
        "source": "Pack riset generik lokal; bukan fakta perusahaan",
        "confidence": 0.8,
        "verified": false,
        "notes": "Adaptasikan dengan dokumentasi target dan scope; pola bukan vulnerability target."
      },
      {
        "id": "developer-platform-asset-3",
        "title": "Artifact",
        "content": "Nilai bisnis terkait integritas, ownership dan authority pada Developer Platform flow; bukan penilaian severity target.",
        "sourceType": "domain",
        "source": "Pack riset generik lokal; bukan fakta perusahaan",
        "confidence": 0.8,
        "verified": false,
        "notes": "Adaptasikan dengan dokumentasi target dan scope; pola bukan vulnerability target."
      },
      {
        "id": "developer-platform-asset-4",
        "title": "Release",
        "content": "Nilai bisnis terkait integritas, ownership dan authority pada Developer Platform flow; bukan penilaian severity target.",
        "sourceType": "domain",
        "source": "Pack riset generik lokal; bukan fakta perusahaan",
        "confidence": 0.8,
        "verified": false,
        "notes": "Adaptasikan dengan dokumentasi target dan scope; pola bukan vulnerability target."
      },
      {
        "id": "developer-platform-asset-5",
        "title": "Integration",
        "content": "Nilai bisnis terkait integritas, ownership dan authority pada Developer Platform flow; bukan penilaian severity target.",
        "sourceType": "domain",
        "source": "Pack riset generik lokal; bukan fakta perusahaan",
        "confidence": 0.8,
        "verified": false,
        "notes": "Adaptasikan dengan dokumentasi target dan scope; pola bukan vulnerability target."
      }
    ],
    "commonTrustBoundaries": [
      {
        "id": "developer-platform-boundary-1",
        "title": "Authorization → Execution",
        "content": "Authority harus tetap sesuai ketika aksi terlindungi benar-benar dijalankan.",
        "sourceType": "domain",
        "source": "Pack riset generik lokal; bukan fakta perusahaan",
        "confidence": 0.8,
        "verified": false,
        "notes": "Adaptasikan dengan dokumentasi target dan scope; pola bukan vulnerability target.",
        "fromComponent": "User / Client",
        "toComponent": "Backend / Worker",
        "channel": "request / job",
        "authority": "Izin actor untuk object dan state yang berlaku",
        "flowId": "developer-platform-flow-1"
      }
    ],
    "securityInvariants": [
      {
        "id": "developer-platform-invariant-1",
        "title": "Credential harus terikat pada project dan capability yang diberikan.",
        "content": "Credential harus terikat pada project dan capability yang diberikan.",
        "sourceType": "domain",
        "source": "Pack riset generik lokal; bukan fakta perusahaan",
        "confidence": 0.8,
        "verified": false,
        "notes": "Adaptasikan dengan dokumentasi target dan scope; pola bukan vulnerability target.",
        "flowId": "developer-platform-flow-1",
        "techniqueIds": [
          "tech_17"
        ]
      },
      {
        "id": "developer-platform-invariant-2",
        "title": "Worker build tidak boleh memakai authority yang tidak berlaku.",
        "content": "Worker build tidak boleh memakai authority yang tidak berlaku.",
        "sourceType": "domain",
        "source": "Pack riset generik lokal; bukan fakta perusahaan",
        "confidence": 0.8,
        "verified": false,
        "notes": "Adaptasikan dengan dokumentasi target dan scope; pola bukan vulnerability target.",
        "flowId": "developer-platform-flow-1",
        "techniqueIds": [
          "tech_03"
        ]
      },
      {
        "id": "developer-platform-invariant-3",
        "title": "Artifact privat harus mempertahankan aturan akses setelah publikasi/perubahan state.",
        "content": "Artifact privat harus mempertahankan aturan akses setelah publikasi/perubahan state.",
        "sourceType": "domain",
        "source": "Pack riset generik lokal; bukan fakta perusahaan",
        "confidence": 0.8,
        "verified": false,
        "notes": "Adaptasikan dengan dokumentasi target dan scope; pola bukan vulnerability target.",
        "flowId": "developer-platform-flow-1",
        "techniqueIds": [
          "tech_02"
        ]
      }
    ],
    "commonFailurePatterns": [
      {
        "id": "developer-platform-pattern-1",
        "title": "Authorization mismatch",
        "content": "Bandingkan authority efektif, owner, state dan context sebelum menyimpulkan kontrol gagal.",
        "sourceType": "domain",
        "source": "Pack riset generik lokal; bukan fakta perusahaan",
        "confidence": 0.8,
        "verified": false,
        "notes": "Adaptasikan dengan dokumentasi target dan scope; pola bukan vulnerability target."
      },
      {
        "id": "developer-platform-pattern-2",
        "title": "Stale authorization",
        "content": "Pertanyaan generik: apakah authority lama masih dipakai setelah perubahan state?",
        "sourceType": "domain",
        "source": "Pack riset generik lokal; bukan fakta perusahaan",
        "confidence": 0.8,
        "verified": false,
        "notes": "Adaptasikan dengan dokumentasi target dan scope; pola bukan vulnerability target."
      },
      {
        "id": "developer-platform-pattern-3",
        "title": "State desynchronization",
        "content": "Perbedaan state antarkomponen perlu kontrol timing dan evidence; belum tentu vulnerability.",
        "sourceType": "domain",
        "source": "Pack riset generik lokal; bukan fakta perusahaan",
        "confidence": 0.8,
        "verified": false,
        "notes": "Adaptasikan dengan dokumentasi target dan scope; pola bukan vulnerability target."
      }
    ],
    "relevantTechniques": [
      {
        "id": "developer-platform-mapping-1",
        "title": "Technique tech_17",
        "content": "Object ownership: actor harus berhak atas object, account atau record yang dirujuk pada flow. Tinjau Developer Platform flow bersama invariant terkait; gunakan hanya scope yang diotorisasi.",
        "sourceType": "domain",
        "source": "Pack riset generik lokal; bukan fakta perusahaan",
        "confidence": 0.8,
        "verified": false,
        "notes": "Adaptasikan dengan dokumentasi target dan scope; pola bukan vulnerability target.",
        "techniqueId": "tech_17",
        "flowId": "developer-platform-flow-1",
        "invariantId": "developer-platform-invariant-1",
        "researchPriority": 60
      },
      {
        "id": "developer-platform-mapping-2",
        "title": "Technique tech_03",
        "content": "Capability context: persetujuan harus terikat pada actor, action, resource dan context yang diberikan. Tinjau Developer Platform flow bersama invariant terkait; gunakan hanya scope yang diotorisasi.",
        "sourceType": "domain",
        "source": "Pack riset generik lokal; bukan fakta perusahaan",
        "confidence": 0.8,
        "verified": false,
        "notes": "Adaptasikan dengan dokumentasi target dan scope; pola bukan vulnerability target.",
        "techniqueId": "tech_03",
        "flowId": "developer-platform-flow-1",
        "invariantId": "developer-platform-invariant-2",
        "researchPriority": 70
      },
      {
        "id": "developer-platform-mapping-3",
        "title": "Technique tech_02",
        "content": "Async revalidation: periksa apakah worker memakai authority/state yang masih berlaku ketika job dieksekusi. Tinjau Developer Platform flow bersama invariant terkait; gunakan hanya scope yang diotorisasi.",
        "sourceType": "domain",
        "source": "Pack riset generik lokal; bukan fakta perusahaan",
        "confidence": 0.8,
        "verified": false,
        "notes": "Adaptasikan dengan dokumentasi target dan scope; pola bukan vulnerability target.",
        "techniqueId": "tech_02",
        "flowId": "developer-platform-flow-1",
        "invariantId": "developer-platform-invariant-3",
        "researchPriority": 80
      },
      {
        "id": "developer-platform-mapping-4",
        "title": "Technique tech_09",
        "content": "Webhook ownership: event dan destination harus tetap terikat pada owner serta context bisnis yang sah. Tinjau Developer Platform flow bersama invariant terkait; gunakan hanya scope yang diotorisasi.",
        "sourceType": "domain",
        "source": "Pack riset generik lokal; bukan fakta perusahaan",
        "confidence": 0.8,
        "verified": false,
        "notes": "Adaptasikan dengan dokumentasi target dan scope; pola bukan vulnerability target.",
        "techniqueId": "tech_09",
        "flowId": "developer-platform-flow-1",
        "invariantId": "developer-platform-invariant-1",
        "researchPriority": 60
      },
      {
        "id": "developer-platform-mapping-5",
        "title": "Technique tech_15",
        "content": "File/share/export: salinan, link dan export harus mempertahankan ownership serta perubahan akses. Tinjau Developer Platform flow bersama invariant terkait; gunakan hanya scope yang diotorisasi.",
        "sourceType": "domain",
        "source": "Pack riset generik lokal; bukan fakta perusahaan",
        "confidence": 0.8,
        "verified": false,
        "notes": "Adaptasikan dengan dokumentasi target dan scope; pola bukan vulnerability target.",
        "techniqueId": "tech_15",
        "flowId": "developer-platform-flow-1",
        "invariantId": "developer-platform-invariant-2",
        "researchPriority": 70
      }
    ],
    "researchQuestions": [
      {
        "id": "developer-platform-question-1",
        "title": "Bagaimana memastikan: Credential harus terikat pada project dan capability yang diberikan.",
        "content": "Credential harus terikat pada project dan capability yang diberikan. Apa expected behavior jika owner, authority atau state berubah sebelum execution; apa evidence yang membedakan kontrol efektif dari pelanggaran?",
        "sourceType": "domain",
        "source": "Pack riset generik lokal; bukan fakta perusahaan",
        "confidence": 0.8,
        "verified": false,
        "notes": "Adaptasikan dengan dokumentasi target dan scope; pola bukan vulnerability target.",
        "flowId": "developer-platform-flow-1",
        "invariantId": "developer-platform-invariant-1",
        "techniqueId": "tech_17"
      },
      {
        "id": "developer-platform-question-2",
        "title": "Bagaimana memastikan: Worker build tidak boleh memakai authority yang tidak berlaku.",
        "content": "Worker build tidak boleh memakai authority yang tidak berlaku. Apa expected behavior jika owner, authority atau state berubah sebelum execution; apa evidence yang membedakan kontrol efektif dari pelanggaran?",
        "sourceType": "domain",
        "source": "Pack riset generik lokal; bukan fakta perusahaan",
        "confidence": 0.8,
        "verified": false,
        "notes": "Adaptasikan dengan dokumentasi target dan scope; pola bukan vulnerability target.",
        "flowId": "developer-platform-flow-1",
        "invariantId": "developer-platform-invariant-2",
        "techniqueId": "tech_03"
      },
      {
        "id": "developer-platform-question-3",
        "title": "Bagaimana memastikan: Artifact privat harus mempertahankan aturan akses setelah publikasi/perubahan state.",
        "content": "Artifact privat harus mempertahankan aturan akses setelah publikasi/perubahan state. Apa expected behavior jika owner, authority atau state berubah sebelum execution; apa evidence yang membedakan kontrol efektif dari pelanggaran?",
        "sourceType": "domain",
        "source": "Pack riset generik lokal; bukan fakta perusahaan",
        "confidence": 0.8,
        "verified": false,
        "notes": "Adaptasikan dengan dokumentasi target dan scope; pola bukan vulnerability target.",
        "flowId": "developer-platform-flow-1",
        "invariantId": "developer-platform-invariant-3",
        "techniqueId": "tech_02"
      }
    ],
    "references": []
  },
  {
    "id": "ecommerce",
    "name": "E-Commerce",
    "description": "Penjualan dan pemenuhan barang/jasa dengan checkout, order, dan refund.",
    "notes": "Contoh pembelajaran; bukan klaim tentang perusahaan atau izin testing.",
    "provenance": {
      "sourceType": "domain",
      "source": "Pack riset generik lokal; bukan fakta perusahaan",
      "confidence": 0.8,
      "verified": false,
      "notes": "Adaptasikan dengan dokumentasi target dan scope; pola bukan vulnerability target."
    },
    "coreConcepts": [
      "Ownership order",
      "State order/payment",
      "Inventory dan fulfillment"
    ],
    "terminology": [
      {
        "id": "ecommerce-term-1",
        "title": "Fulfillment",
        "content": "Proses memenuhi order hingga siap dikirim/diserahkan.",
        "sourceType": "domain",
        "source": "Pack riset generik lokal; bukan fakta perusahaan",
        "confidence": 0.8,
        "verified": false,
        "notes": "Adaptasikan dengan dokumentasi target dan scope; pola bukan vulnerability target.",
        "term": "Fulfillment",
        "definition": "Proses memenuhi order hingga siap dikirim/diserahkan.",
        "whyImportant": "State ini dapat mengubah aksi pembatalan/refund yang tersedia.",
        "relatedTerms": [
          "Order",
          "Shipment"
        ]
      },
      {
        "id": "ecommerce-term-2",
        "title": "Inventory",
        "content": "Catatan ketersediaan resource/barang.",
        "sourceType": "domain",
        "source": "Pack riset generik lokal; bukan fakta perusahaan",
        "confidence": 0.8,
        "verified": false,
        "notes": "Adaptasikan dengan dokumentasi target dan scope; pola bukan vulnerability target.",
        "term": "Inventory",
        "definition": "Catatan ketersediaan resource/barang.",
        "whyImportant": "Konsistensi perubahan state perlu dijaga.",
        "relatedTerms": [
          "Order",
          "Product"
        ]
      },
      {
        "id": "ecommerce-term-3",
        "title": "Checkout",
        "content": "Tahap memfinalkan pilihan dan informasi order.",
        "sourceType": "domain",
        "source": "Pack riset generik lokal; bukan fakta perusahaan",
        "confidence": 0.8,
        "verified": false,
        "notes": "Adaptasikan dengan dokumentasi target dan scope; pola bukan vulnerability target.",
        "term": "Checkout",
        "definition": "Tahap memfinalkan pilihan dan informasi order.",
        "whyImportant": "Harga/pemilik/context perlu konsisten.",
        "relatedTerms": [
          "Cart",
          "Payment"
        ]
      },
      {
        "id": "ecommerce-term-4",
        "title": "Coupon",
        "content": "Aturan manfaat/potongan untuk kondisi tertentu.",
        "sourceType": "domain",
        "source": "Pack riset generik lokal; bukan fakta perusahaan",
        "confidence": 0.8,
        "verified": false,
        "notes": "Adaptasikan dengan dokumentasi target dan scope; pola bukan vulnerability target.",
        "term": "Coupon",
        "definition": "Aturan manfaat/potongan untuk kondisi tertentu.",
        "whyImportant": "Prasyarat dan penggunaan perlu sesuai aturan.",
        "relatedTerms": [
          "Cart",
          "Order"
        ]
      }
    ],
    "actors": [
      {
        "id": "ecommerce-actor-1",
        "title": "Customer",
        "content": "Peran tipikal; hak efektif harus dikonfirmasi pada target.",
        "sourceType": "domain",
        "source": "Pack riset generik lokal; bukan fakta perusahaan",
        "confidence": 0.8,
        "verified": false,
        "notes": "Adaptasikan dengan dokumentasi target dan scope; pola bukan vulnerability target."
      },
      {
        "id": "ecommerce-actor-2",
        "title": "Seller",
        "content": "Peran tipikal; hak efektif harus dikonfirmasi pada target.",
        "sourceType": "domain",
        "source": "Pack riset generik lokal; bukan fakta perusahaan",
        "confidence": 0.8,
        "verified": false,
        "notes": "Adaptasikan dengan dokumentasi target dan scope; pola bukan vulnerability target."
      },
      {
        "id": "ecommerce-actor-3",
        "title": "Buyer",
        "content": "Peran tipikal; hak efektif harus dikonfirmasi pada target.",
        "sourceType": "domain",
        "source": "Pack riset generik lokal; bukan fakta perusahaan",
        "confidence": 0.8,
        "verified": false,
        "notes": "Adaptasikan dengan dokumentasi target dan scope; pola bukan vulnerability target."
      },
      {
        "id": "ecommerce-actor-4",
        "title": "Merchant",
        "content": "Peran tipikal; hak efektif harus dikonfirmasi pada target.",
        "sourceType": "domain",
        "source": "Pack riset generik lokal; bukan fakta perusahaan",
        "confidence": 0.8,
        "verified": false,
        "notes": "Adaptasikan dengan dokumentasi target dan scope; pola bukan vulnerability target."
      },
      {
        "id": "ecommerce-actor-5",
        "title": "Warehouse Operator",
        "content": "Peran tipikal; hak efektif harus dikonfirmasi pada target.",
        "sourceType": "domain",
        "source": "Pack riset generik lokal; bukan fakta perusahaan",
        "confidence": 0.8,
        "verified": false,
        "notes": "Adaptasikan dengan dokumentasi target dan scope; pola bukan vulnerability target."
      },
      {
        "id": "ecommerce-actor-6",
        "title": "Support",
        "content": "Peran tipikal; hak efektif harus dikonfirmasi pada target.",
        "sourceType": "domain",
        "source": "Pack riset generik lokal; bukan fakta perusahaan",
        "confidence": 0.8,
        "verified": false,
        "notes": "Adaptasikan dengan dokumentasi target dan scope; pola bukan vulnerability target."
      },
      {
        "id": "ecommerce-actor-7",
        "title": "Administrator",
        "content": "Peran tipikal; hak efektif harus dikonfirmasi pada target.",
        "sourceType": "domain",
        "source": "Pack riset generik lokal; bukan fakta perusahaan",
        "confidence": 0.8,
        "verified": false,
        "notes": "Adaptasikan dengan dokumentasi target dan scope; pola bukan vulnerability target."
      }
    ],
    "businessObjects": [
      {
        "id": "ecommerce-object-1",
        "title": "Product",
        "content": "Resource bisnis tipikal; ownership, state dan sensitivitas perlu dipetakan.",
        "sourceType": "domain",
        "source": "Pack riset generik lokal; bukan fakta perusahaan",
        "confidence": 0.8,
        "verified": false,
        "notes": "Adaptasikan dengan dokumentasi target dan scope; pola bukan vulnerability target."
      },
      {
        "id": "ecommerce-object-2",
        "title": "Cart",
        "content": "Resource bisnis tipikal; ownership, state dan sensitivitas perlu dipetakan.",
        "sourceType": "domain",
        "source": "Pack riset generik lokal; bukan fakta perusahaan",
        "confidence": 0.8,
        "verified": false,
        "notes": "Adaptasikan dengan dokumentasi target dan scope; pola bukan vulnerability target."
      },
      {
        "id": "ecommerce-object-3",
        "title": "Order",
        "content": "Resource bisnis tipikal; ownership, state dan sensitivitas perlu dipetakan.",
        "sourceType": "domain",
        "source": "Pack riset generik lokal; bukan fakta perusahaan",
        "confidence": 0.8,
        "verified": false,
        "notes": "Adaptasikan dengan dokumentasi target dan scope; pola bukan vulnerability target."
      },
      {
        "id": "ecommerce-object-4",
        "title": "Payment",
        "content": "Resource bisnis tipikal; ownership, state dan sensitivitas perlu dipetakan.",
        "sourceType": "domain",
        "source": "Pack riset generik lokal; bukan fakta perusahaan",
        "confidence": 0.8,
        "verified": false,
        "notes": "Adaptasikan dengan dokumentasi target dan scope; pola bukan vulnerability target."
      },
      {
        "id": "ecommerce-object-5",
        "title": "Coupon",
        "content": "Resource bisnis tipikal; ownership, state dan sensitivitas perlu dipetakan.",
        "sourceType": "domain",
        "source": "Pack riset generik lokal; bukan fakta perusahaan",
        "confidence": 0.8,
        "verified": false,
        "notes": "Adaptasikan dengan dokumentasi target dan scope; pola bukan vulnerability target."
      },
      {
        "id": "ecommerce-object-6",
        "title": "Inventory",
        "content": "Resource bisnis tipikal; ownership, state dan sensitivitas perlu dipetakan.",
        "sourceType": "domain",
        "source": "Pack riset generik lokal; bukan fakta perusahaan",
        "confidence": 0.8,
        "verified": false,
        "notes": "Adaptasikan dengan dokumentasi target dan scope; pola bukan vulnerability target."
      },
      {
        "id": "ecommerce-object-7",
        "title": "Shipment",
        "content": "Resource bisnis tipikal; ownership, state dan sensitivitas perlu dipetakan.",
        "sourceType": "domain",
        "source": "Pack riset generik lokal; bukan fakta perusahaan",
        "confidence": 0.8,
        "verified": false,
        "notes": "Adaptasikan dengan dokumentasi target dan scope; pola bukan vulnerability target."
      },
      {
        "id": "ecommerce-object-8",
        "title": "Refund",
        "content": "Resource bisnis tipikal; ownership, state dan sensitivitas perlu dipetakan.",
        "sourceType": "domain",
        "source": "Pack riset generik lokal; bukan fakta perusahaan",
        "confidence": 0.8,
        "verified": false,
        "notes": "Adaptasikan dengan dokumentasi target dan scope; pola bukan vulnerability target."
      },
      {
        "id": "ecommerce-object-9",
        "title": "Seller",
        "content": "Resource bisnis tipikal; ownership, state dan sensitivitas perlu dipetakan.",
        "sourceType": "domain",
        "source": "Pack riset generik lokal; bukan fakta perusahaan",
        "confidence": 0.8,
        "verified": false,
        "notes": "Adaptasikan dengan dokumentasi target dan scope; pola bukan vulnerability target."
      },
      {
        "id": "ecommerce-object-10",
        "title": "Buyer",
        "content": "Resource bisnis tipikal; ownership, state dan sensitivitas perlu dipetakan.",
        "sourceType": "domain",
        "source": "Pack riset generik lokal; bukan fakta perusahaan",
        "confidence": 0.8,
        "verified": false,
        "notes": "Adaptasikan dengan dokumentasi target dan scope; pola bukan vulnerability target."
      }
    ],
    "businessFlows": [
      {
        "id": "ecommerce-flow-1",
        "title": "E-Commerce — flow generik",
        "content": "Penjualan dan pemenuhan barang/jasa dengan checkout, order, dan refund.",
        "sourceType": "domain",
        "source": "Pack riset generik lokal; bukan fakta perusahaan",
        "confidence": 0.8,
        "verified": false,
        "notes": "Adaptasikan dengan dokumentasi target dan scope; pola bukan vulnerability target.",
        "steps": [
          "Customer",
          "Cart",
          "Checkout",
          "Payment",
          "Order",
          "Inventory",
          "Fulfillment",
          "Delivery",
          "Refund"
        ],
        "actorIds": [
          "ecommerce-actor-1",
          "ecommerce-actor-2",
          "ecommerce-actor-3",
          "ecommerce-actor-4",
          "ecommerce-actor-5",
          "ecommerce-actor-6",
          "ecommerce-actor-7"
        ],
        "objectIds": [
          "ecommerce-object-1",
          "ecommerce-object-2",
          "ecommerce-object-3",
          "ecommerce-object-4",
          "ecommerce-object-5",
          "ecommerce-object-6",
          "ecommerce-object-7",
          "ecommerce-object-8",
          "ecommerce-object-9",
          "ecommerce-object-10"
        ],
        "boundaryIds": [
          "ecommerce-boundary-1"
        ],
        "invariantIds": [
          "ecommerce-invariant-1",
          "ecommerce-invariant-2",
          "ecommerce-invariant-3"
        ],
        "transitions": [
          {
            "id": "ecommerce-transition-1",
            "fromState": "Customer",
            "toState": "Cart",
            "action": "Customer → Cart",
            "critical": false,
            "invariantIds": [
              "ecommerce-invariant-1",
              "ecommerce-invariant-2",
              "ecommerce-invariant-3"
            ]
          },
          {
            "id": "ecommerce-transition-2",
            "fromState": "Cart",
            "toState": "Checkout",
            "action": "Cart → Checkout",
            "critical": false,
            "invariantIds": [
              "ecommerce-invariant-1",
              "ecommerce-invariant-2",
              "ecommerce-invariant-3"
            ]
          },
          {
            "id": "ecommerce-transition-3",
            "fromState": "Checkout",
            "toState": "Payment",
            "action": "Checkout → Payment",
            "critical": false,
            "invariantIds": [
              "ecommerce-invariant-1",
              "ecommerce-invariant-2",
              "ecommerce-invariant-3"
            ]
          },
          {
            "id": "ecommerce-transition-4",
            "fromState": "Payment",
            "toState": "Order",
            "action": "Payment → Order",
            "critical": false,
            "invariantIds": [
              "ecommerce-invariant-1",
              "ecommerce-invariant-2",
              "ecommerce-invariant-3"
            ]
          },
          {
            "id": "ecommerce-transition-5",
            "fromState": "Order",
            "toState": "Inventory",
            "action": "Order → Inventory",
            "critical": false,
            "invariantIds": [
              "ecommerce-invariant-1",
              "ecommerce-invariant-2",
              "ecommerce-invariant-3"
            ]
          },
          {
            "id": "ecommerce-transition-6",
            "fromState": "Inventory",
            "toState": "Fulfillment",
            "action": "Inventory → Fulfillment",
            "critical": false,
            "invariantIds": [
              "ecommerce-invariant-1",
              "ecommerce-invariant-2",
              "ecommerce-invariant-3"
            ]
          },
          {
            "id": "ecommerce-transition-7",
            "fromState": "Fulfillment",
            "toState": "Delivery",
            "action": "Fulfillment → Delivery",
            "critical": false,
            "invariantIds": [
              "ecommerce-invariant-1",
              "ecommerce-invariant-2",
              "ecommerce-invariant-3"
            ]
          },
          {
            "id": "ecommerce-transition-8",
            "fromState": "Delivery",
            "toState": "Refund",
            "action": "Delivery → Refund",
            "critical": true,
            "invariantIds": [
              "ecommerce-invariant-1",
              "ecommerce-invariant-2",
              "ecommerce-invariant-3"
            ]
          }
        ]
      }
    ],
    "sensitiveData": [
      {
        "id": "ecommerce-sensitive-1",
        "title": "Buyer addresses and contact details",
        "content": "Kategori data generik E-Commerce; konfirmasi sensitivitas pada target dan gunakan data dummy/redaksi.",
        "sourceType": "domain",
        "source": "Pack riset generik lokal; bukan fakta perusahaan",
        "confidence": 0.8,
        "verified": false,
        "notes": "Adaptasikan dengan dokumentasi target dan scope; pola bukan vulnerability target."
      },
      {
        "id": "ecommerce-sensitive-2",
        "title": "Orders and payment references",
        "content": "Kategori data generik E-Commerce; konfirmasi sensitivitas pada target dan gunakan data dummy/redaksi.",
        "sourceType": "domain",
        "source": "Pack riset generik lokal; bukan fakta perusahaan",
        "confidence": 0.8,
        "verified": false,
        "notes": "Adaptasikan dengan dokumentasi target dan scope; pola bukan vulnerability target."
      },
      {
        "id": "ecommerce-sensitive-3",
        "title": "Seller financial and inventory records",
        "content": "Kategori data generik E-Commerce; konfirmasi sensitivitas pada target dan gunakan data dummy/redaksi.",
        "sourceType": "domain",
        "source": "Pack riset generik lokal; bukan fakta perusahaan",
        "confidence": 0.8,
        "verified": false,
        "notes": "Adaptasikan dengan dokumentasi target dan scope; pola bukan vulnerability target."
      }
    ],
    "criticalAssets": [
      {
        "id": "ecommerce-asset-1",
        "title": "Order",
        "content": "Nilai bisnis terkait integritas, ownership dan authority pada E-Commerce flow; bukan penilaian severity target.",
        "sourceType": "domain",
        "source": "Pack riset generik lokal; bukan fakta perusahaan",
        "confidence": 0.8,
        "verified": false,
        "notes": "Adaptasikan dengan dokumentasi target dan scope; pola bukan vulnerability target."
      },
      {
        "id": "ecommerce-asset-2",
        "title": "Payment",
        "content": "Nilai bisnis terkait integritas, ownership dan authority pada E-Commerce flow; bukan penilaian severity target.",
        "sourceType": "domain",
        "source": "Pack riset generik lokal; bukan fakta perusahaan",
        "confidence": 0.8,
        "verified": false,
        "notes": "Adaptasikan dengan dokumentasi target dan scope; pola bukan vulnerability target."
      },
      {
        "id": "ecommerce-asset-3",
        "title": "Inventory",
        "content": "Nilai bisnis terkait integritas, ownership dan authority pada E-Commerce flow; bukan penilaian severity target.",
        "sourceType": "domain",
        "source": "Pack riset generik lokal; bukan fakta perusahaan",
        "confidence": 0.8,
        "verified": false,
        "notes": "Adaptasikan dengan dokumentasi target dan scope; pola bukan vulnerability target."
      },
      {
        "id": "ecommerce-asset-4",
        "title": "Shipment",
        "content": "Nilai bisnis terkait integritas, ownership dan authority pada E-Commerce flow; bukan penilaian severity target.",
        "sourceType": "domain",
        "source": "Pack riset generik lokal; bukan fakta perusahaan",
        "confidence": 0.8,
        "verified": false,
        "notes": "Adaptasikan dengan dokumentasi target dan scope; pola bukan vulnerability target."
      },
      {
        "id": "ecommerce-asset-5",
        "title": "Refund",
        "content": "Nilai bisnis terkait integritas, ownership dan authority pada E-Commerce flow; bukan penilaian severity target.",
        "sourceType": "domain",
        "source": "Pack riset generik lokal; bukan fakta perusahaan",
        "confidence": 0.8,
        "verified": false,
        "notes": "Adaptasikan dengan dokumentasi target dan scope; pola bukan vulnerability target."
      }
    ],
    "commonTrustBoundaries": [
      {
        "id": "ecommerce-boundary-1",
        "title": "Authorization → Execution",
        "content": "Authority harus tetap sesuai ketika aksi terlindungi benar-benar dijalankan.",
        "sourceType": "domain",
        "source": "Pack riset generik lokal; bukan fakta perusahaan",
        "confidence": 0.8,
        "verified": false,
        "notes": "Adaptasikan dengan dokumentasi target dan scope; pola bukan vulnerability target.",
        "fromComponent": "User / Client",
        "toComponent": "Backend / Worker",
        "channel": "request / job",
        "authority": "Izin actor untuk object dan state yang berlaku",
        "flowId": "ecommerce-flow-1"
      }
    ],
    "securityInvariants": [
      {
        "id": "ecommerce-invariant-1",
        "title": "Order harus terikat pada customer dan merchant yang benar.",
        "content": "Order harus terikat pada customer dan merchant yang benar.",
        "sourceType": "domain",
        "source": "Pack riset generik lokal; bukan fakta perusahaan",
        "confidence": 0.8,
        "verified": false,
        "notes": "Adaptasikan dengan dokumentasi target dan scope; pola bukan vulnerability target.",
        "flowId": "ecommerce-flow-1",
        "techniqueIds": [
          "tech_17"
        ]
      },
      {
        "id": "ecommerce-invariant-2",
        "title": "Transisi refund harus memenuhi state serta hak yang berlaku.",
        "content": "Transisi refund harus memenuhi state serta hak yang berlaku.",
        "sourceType": "domain",
        "source": "Pack riset generik lokal; bukan fakta perusahaan",
        "confidence": 0.8,
        "verified": false,
        "notes": "Adaptasikan dengan dokumentasi target dan scope; pola bukan vulnerability target.",
        "flowId": "ecommerce-flow-1",
        "techniqueIds": [
          "tech_18"
        ]
      },
      {
        "id": "ecommerce-invariant-3",
        "title": "Perubahan order tidak boleh melewati prasyarat pembayaran/fulfillment.",
        "content": "Perubahan order tidak boleh melewati prasyarat pembayaran/fulfillment.",
        "sourceType": "domain",
        "source": "Pack riset generik lokal; bukan fakta perusahaan",
        "confidence": 0.8,
        "verified": false,
        "notes": "Adaptasikan dengan dokumentasi target dan scope; pola bukan vulnerability target.",
        "flowId": "ecommerce-flow-1",
        "techniqueIds": [
          "tech_08"
        ]
      }
    ],
    "commonFailurePatterns": [
      {
        "id": "ecommerce-pattern-1",
        "title": "Authorization mismatch",
        "content": "Bandingkan authority efektif, owner, state dan context sebelum menyimpulkan kontrol gagal.",
        "sourceType": "domain",
        "source": "Pack riset generik lokal; bukan fakta perusahaan",
        "confidence": 0.8,
        "verified": false,
        "notes": "Adaptasikan dengan dokumentasi target dan scope; pola bukan vulnerability target."
      },
      {
        "id": "ecommerce-pattern-2",
        "title": "Stale authorization",
        "content": "Pertanyaan generik: apakah authority lama masih dipakai setelah perubahan state?",
        "sourceType": "domain",
        "source": "Pack riset generik lokal; bukan fakta perusahaan",
        "confidence": 0.8,
        "verified": false,
        "notes": "Adaptasikan dengan dokumentasi target dan scope; pola bukan vulnerability target."
      },
      {
        "id": "ecommerce-pattern-3",
        "title": "State desynchronization",
        "content": "Perbedaan state antarkomponen perlu kontrol timing dan evidence; belum tentu vulnerability.",
        "sourceType": "domain",
        "source": "Pack riset generik lokal; bukan fakta perusahaan",
        "confidence": 0.8,
        "verified": false,
        "notes": "Adaptasikan dengan dokumentasi target dan scope; pola bukan vulnerability target."
      }
    ],
    "relevantTechniques": [
      {
        "id": "ecommerce-mapping-1",
        "title": "Technique tech_17",
        "content": "Object ownership: actor harus berhak atas object, account atau record yang dirujuk pada flow. Tinjau E-Commerce flow bersama invariant terkait; gunakan hanya scope yang diotorisasi.",
        "sourceType": "domain",
        "source": "Pack riset generik lokal; bukan fakta perusahaan",
        "confidence": 0.8,
        "verified": false,
        "notes": "Adaptasikan dengan dokumentasi target dan scope; pola bukan vulnerability target.",
        "techniqueId": "tech_17",
        "flowId": "ecommerce-flow-1",
        "invariantId": "ecommerce-invariant-1",
        "researchPriority": 60
      },
      {
        "id": "ecommerce-mapping-2",
        "title": "Technique tech_18",
        "content": "Business logic: retry, urutan aksi dan state terminal tidak boleh menambah efek bisnis yang melanggar invariant. Tinjau E-Commerce flow bersama invariant terkait; gunakan hanya scope yang diotorisasi.",
        "sourceType": "domain",
        "source": "Pack riset generik lokal; bukan fakta perusahaan",
        "confidence": 0.8,
        "verified": false,
        "notes": "Adaptasikan dengan dokumentasi target dan scope; pola bukan vulnerability target.",
        "techniqueId": "tech_18",
        "flowId": "ecommerce-flow-1",
        "invariantId": "ecommerce-invariant-2",
        "researchPriority": 70
      },
      {
        "id": "ecommerce-mapping-3",
        "title": "Technique tech_08",
        "content": "Race/TOCTOU: tinjau apakah validasi dan efek bisnis tetap konsisten saat transisi berdekatan. Tinjau E-Commerce flow bersama invariant terkait; gunakan hanya scope yang diotorisasi.",
        "sourceType": "domain",
        "source": "Pack riset generik lokal; bukan fakta perusahaan",
        "confidence": 0.8,
        "verified": false,
        "notes": "Adaptasikan dengan dokumentasi target dan scope; pola bukan vulnerability target.",
        "techniqueId": "tech_08",
        "flowId": "ecommerce-flow-1",
        "invariantId": "ecommerce-invariant-3",
        "researchPriority": 80
      },
      {
        "id": "ecommerce-mapping-4",
        "title": "Technique tech_09",
        "content": "Webhook ownership: event dan destination harus tetap terikat pada owner serta context bisnis yang sah. Tinjau E-Commerce flow bersama invariant terkait; gunakan hanya scope yang diotorisasi.",
        "sourceType": "domain",
        "source": "Pack riset generik lokal; bukan fakta perusahaan",
        "confidence": 0.8,
        "verified": false,
        "notes": "Adaptasikan dengan dokumentasi target dan scope; pola bukan vulnerability target.",
        "techniqueId": "tech_09",
        "flowId": "ecommerce-flow-1",
        "invariantId": "ecommerce-invariant-1",
        "researchPriority": 60
      }
    ],
    "researchQuestions": [
      {
        "id": "ecommerce-question-1",
        "title": "Bagaimana memastikan: Order harus terikat pada customer dan merchant yang benar.",
        "content": "Order harus terikat pada customer dan merchant yang benar. Apa expected behavior jika owner, authority atau state berubah sebelum execution; apa evidence yang membedakan kontrol efektif dari pelanggaran?",
        "sourceType": "domain",
        "source": "Pack riset generik lokal; bukan fakta perusahaan",
        "confidence": 0.8,
        "verified": false,
        "notes": "Adaptasikan dengan dokumentasi target dan scope; pola bukan vulnerability target.",
        "flowId": "ecommerce-flow-1",
        "invariantId": "ecommerce-invariant-1",
        "techniqueId": "tech_17"
      },
      {
        "id": "ecommerce-question-2",
        "title": "Bagaimana memastikan: Transisi refund harus memenuhi state serta hak yang berlaku.",
        "content": "Transisi refund harus memenuhi state serta hak yang berlaku. Apa expected behavior jika owner, authority atau state berubah sebelum execution; apa evidence yang membedakan kontrol efektif dari pelanggaran?",
        "sourceType": "domain",
        "source": "Pack riset generik lokal; bukan fakta perusahaan",
        "confidence": 0.8,
        "verified": false,
        "notes": "Adaptasikan dengan dokumentasi target dan scope; pola bukan vulnerability target.",
        "flowId": "ecommerce-flow-1",
        "invariantId": "ecommerce-invariant-2",
        "techniqueId": "tech_18"
      },
      {
        "id": "ecommerce-question-3",
        "title": "Bagaimana memastikan: Perubahan order tidak boleh melewati prasyarat pembayaran/fulfillment.",
        "content": "Perubahan order tidak boleh melewati prasyarat pembayaran/fulfillment. Apa expected behavior jika owner, authority atau state berubah sebelum execution; apa evidence yang membedakan kontrol efektif dari pelanggaran?",
        "sourceType": "domain",
        "source": "Pack riset generik lokal; bukan fakta perusahaan",
        "confidence": 0.8,
        "verified": false,
        "notes": "Adaptasikan dengan dokumentasi target dan scope; pola bukan vulnerability target.",
        "flowId": "ecommerce-flow-1",
        "invariantId": "ecommerce-invariant-3",
        "techniqueId": "tech_08"
      }
    ],
    "references": []
  },
  {
    "id": "education",
    "name": "Education",
    "description": "Platform pembelajaran, enrollment, assessment, dan resource kelas.",
    "notes": "Contoh pembelajaran; bukan klaim tentang perusahaan atau izin testing.",
    "provenance": {
      "sourceType": "domain",
      "source": "Pack riset generik lokal; bukan fakta perusahaan",
      "confidence": 0.8,
      "verified": false,
      "notes": "Adaptasikan dengan dokumentasi target dan scope; pola bukan vulnerability target."
    },
    "coreConcepts": [
      "Role pada kelas",
      "State enrollment",
      "Integritas assessment"
    ],
    "terminology": [
      {
        "id": "education-term-1",
        "title": "Enrollment",
        "content": "Keanggotaan/pendaftaran pada course atau institusi.",
        "sourceType": "domain",
        "source": "Pack riset generik lokal; bukan fakta perusahaan",
        "confidence": 0.8,
        "verified": false,
        "notes": "Adaptasikan dengan dokumentasi target dan scope; pola bukan vulnerability target.",
        "term": "Enrollment",
        "definition": "Keanggotaan/pendaftaran pada course atau institusi.",
        "whyImportant": "Lifecycle-nya menentukan akses resource.",
        "relatedTerms": [
          "Course",
          "Student"
        ]
      },
      {
        "id": "education-term-2",
        "title": "Assessment",
        "content": "Proses penilaian pekerjaan/kompetensi.",
        "sourceType": "domain",
        "source": "Pack riset generik lokal; bukan fakta perusahaan",
        "confidence": 0.8,
        "verified": false,
        "notes": "Adaptasikan dengan dokumentasi target dan scope; pola bukan vulnerability target.",
        "term": "Assessment",
        "definition": "Proses penilaian pekerjaan/kompetensi.",
        "whyImportant": "Authority dan state perubahan perlu dipahami.",
        "relatedTerms": [
          "Grade",
          "Submission"
        ]
      },
      {
        "id": "education-term-3",
        "title": "Roster",
        "content": "Daftar participant dalam suatu context kelas.",
        "sourceType": "domain",
        "source": "Pack riset generik lokal; bukan fakta perusahaan",
        "confidence": 0.8,
        "verified": false,
        "notes": "Adaptasikan dengan dokumentasi target dan scope; pola bukan vulnerability target.",
        "term": "Roster",
        "definition": "Daftar participant dalam suatu context kelas.",
        "whyImportant": "Merupakan resource identitas yang dapat sensitif.",
        "relatedTerms": [
          "Course",
          "Enrollment"
        ]
      }
    ],
    "actors": [
      {
        "id": "education-actor-1",
        "title": "Student",
        "content": "Peran tipikal; hak efektif harus dikonfirmasi pada target.",
        "sourceType": "domain",
        "source": "Pack riset generik lokal; bukan fakta perusahaan",
        "confidence": 0.8,
        "verified": false,
        "notes": "Adaptasikan dengan dokumentasi target dan scope; pola bukan vulnerability target."
      },
      {
        "id": "education-actor-2",
        "title": "Teacher",
        "content": "Peran tipikal; hak efektif harus dikonfirmasi pada target.",
        "sourceType": "domain",
        "source": "Pack riset generik lokal; bukan fakta perusahaan",
        "confidence": 0.8,
        "verified": false,
        "notes": "Adaptasikan dengan dokumentasi target dan scope; pola bukan vulnerability target."
      },
      {
        "id": "education-actor-3",
        "title": "Guardian",
        "content": "Peran tipikal; hak efektif harus dikonfirmasi pada target.",
        "sourceType": "domain",
        "source": "Pack riset generik lokal; bukan fakta perusahaan",
        "confidence": 0.8,
        "verified": false,
        "notes": "Adaptasikan dengan dokumentasi target dan scope; pola bukan vulnerability target."
      },
      {
        "id": "education-actor-4",
        "title": "Course Owner",
        "content": "Peran tipikal; hak efektif harus dikonfirmasi pada target.",
        "sourceType": "domain",
        "source": "Pack riset generik lokal; bukan fakta perusahaan",
        "confidence": 0.8,
        "verified": false,
        "notes": "Adaptasikan dengan dokumentasi target dan scope; pola bukan vulnerability target."
      },
      {
        "id": "education-actor-5",
        "title": "Institution Administrator",
        "content": "Peran tipikal; hak efektif harus dikonfirmasi pada target.",
        "sourceType": "domain",
        "source": "Pack riset generik lokal; bukan fakta perusahaan",
        "confidence": 0.8,
        "verified": false,
        "notes": "Adaptasikan dengan dokumentasi target dan scope; pola bukan vulnerability target."
      },
      {
        "id": "education-actor-6",
        "title": "Service Account",
        "content": "Peran tipikal; hak efektif harus dikonfirmasi pada target.",
        "sourceType": "domain",
        "source": "Pack riset generik lokal; bukan fakta perusahaan",
        "confidence": 0.8,
        "verified": false,
        "notes": "Adaptasikan dengan dokumentasi target dan scope; pola bukan vulnerability target."
      }
    ],
    "businessObjects": [
      {
        "id": "education-object-1",
        "title": "Course",
        "content": "Resource bisnis tipikal; ownership, state dan sensitivitas perlu dipetakan.",
        "sourceType": "domain",
        "source": "Pack riset generik lokal; bukan fakta perusahaan",
        "confidence": 0.8,
        "verified": false,
        "notes": "Adaptasikan dengan dokumentasi target dan scope; pola bukan vulnerability target."
      },
      {
        "id": "education-object-2",
        "title": "Enrollment",
        "content": "Resource bisnis tipikal; ownership, state dan sensitivitas perlu dipetakan.",
        "sourceType": "domain",
        "source": "Pack riset generik lokal; bukan fakta perusahaan",
        "confidence": 0.8,
        "verified": false,
        "notes": "Adaptasikan dengan dokumentasi target dan scope; pola bukan vulnerability target."
      },
      {
        "id": "education-object-3",
        "title": "Assignment",
        "content": "Resource bisnis tipikal; ownership, state dan sensitivitas perlu dipetakan.",
        "sourceType": "domain",
        "source": "Pack riset generik lokal; bukan fakta perusahaan",
        "confidence": 0.8,
        "verified": false,
        "notes": "Adaptasikan dengan dokumentasi target dan scope; pola bukan vulnerability target."
      },
      {
        "id": "education-object-4",
        "title": "Submission",
        "content": "Resource bisnis tipikal; ownership, state dan sensitivitas perlu dipetakan.",
        "sourceType": "domain",
        "source": "Pack riset generik lokal; bukan fakta perusahaan",
        "confidence": 0.8,
        "verified": false,
        "notes": "Adaptasikan dengan dokumentasi target dan scope; pola bukan vulnerability target."
      },
      {
        "id": "education-object-5",
        "title": "Grade",
        "content": "Resource bisnis tipikal; ownership, state dan sensitivitas perlu dipetakan.",
        "sourceType": "domain",
        "source": "Pack riset generik lokal; bukan fakta perusahaan",
        "confidence": 0.8,
        "verified": false,
        "notes": "Adaptasikan dengan dokumentasi target dan scope; pola bukan vulnerability target."
      },
      {
        "id": "education-object-6",
        "title": "Roster",
        "content": "Resource bisnis tipikal; ownership, state dan sensitivitas perlu dipetakan.",
        "sourceType": "domain",
        "source": "Pack riset generik lokal; bukan fakta perusahaan",
        "confidence": 0.8,
        "verified": false,
        "notes": "Adaptasikan dengan dokumentasi target dan scope; pola bukan vulnerability target."
      },
      {
        "id": "education-object-7",
        "title": "Certificate",
        "content": "Resource bisnis tipikal; ownership, state dan sensitivitas perlu dipetakan.",
        "sourceType": "domain",
        "source": "Pack riset generik lokal; bukan fakta perusahaan",
        "confidence": 0.8,
        "verified": false,
        "notes": "Adaptasikan dengan dokumentasi target dan scope; pola bukan vulnerability target."
      },
      {
        "id": "education-object-8",
        "title": "File",
        "content": "Resource bisnis tipikal; ownership, state dan sensitivitas perlu dipetakan.",
        "sourceType": "domain",
        "source": "Pack riset generik lokal; bukan fakta perusahaan",
        "confidence": 0.8,
        "verified": false,
        "notes": "Adaptasikan dengan dokumentasi target dan scope; pola bukan vulnerability target."
      }
    ],
    "businessFlows": [
      {
        "id": "education-flow-1",
        "title": "Education — flow generik",
        "content": "Platform pembelajaran, enrollment, assessment, dan resource kelas.",
        "sourceType": "domain",
        "source": "Pack riset generik lokal; bukan fakta perusahaan",
        "confidence": 0.8,
        "verified": false,
        "notes": "Adaptasikan dengan dokumentasi target dan scope; pola bukan vulnerability target.",
        "steps": [
          "Student",
          "Enrollment",
          "Course Access",
          "Assignment",
          "Submission",
          "Assessment",
          "Grade",
          "Completion"
        ],
        "actorIds": [
          "education-actor-1",
          "education-actor-2",
          "education-actor-3",
          "education-actor-4",
          "education-actor-5",
          "education-actor-6"
        ],
        "objectIds": [
          "education-object-1",
          "education-object-2",
          "education-object-3",
          "education-object-4",
          "education-object-5",
          "education-object-6",
          "education-object-7",
          "education-object-8"
        ],
        "boundaryIds": [
          "education-boundary-1"
        ],
        "invariantIds": [
          "education-invariant-1",
          "education-invariant-2",
          "education-invariant-3"
        ],
        "transitions": [
          {
            "id": "education-transition-1",
            "fromState": "Student",
            "toState": "Enrollment",
            "action": "Student → Enrollment",
            "critical": false,
            "invariantIds": [
              "education-invariant-1",
              "education-invariant-2",
              "education-invariant-3"
            ]
          },
          {
            "id": "education-transition-2",
            "fromState": "Enrollment",
            "toState": "Course Access",
            "action": "Enrollment → Course Access",
            "critical": false,
            "invariantIds": [
              "education-invariant-1",
              "education-invariant-2",
              "education-invariant-3"
            ]
          },
          {
            "id": "education-transition-3",
            "fromState": "Course Access",
            "toState": "Assignment",
            "action": "Course Access → Assignment",
            "critical": false,
            "invariantIds": [
              "education-invariant-1",
              "education-invariant-2",
              "education-invariant-3"
            ]
          },
          {
            "id": "education-transition-4",
            "fromState": "Assignment",
            "toState": "Submission",
            "action": "Assignment → Submission",
            "critical": false,
            "invariantIds": [
              "education-invariant-1",
              "education-invariant-2",
              "education-invariant-3"
            ]
          },
          {
            "id": "education-transition-5",
            "fromState": "Submission",
            "toState": "Assessment",
            "action": "Submission → Assessment",
            "critical": false,
            "invariantIds": [
              "education-invariant-1",
              "education-invariant-2",
              "education-invariant-3"
            ]
          },
          {
            "id": "education-transition-6",
            "fromState": "Assessment",
            "toState": "Grade",
            "action": "Assessment → Grade",
            "critical": false,
            "invariantIds": [
              "education-invariant-1",
              "education-invariant-2",
              "education-invariant-3"
            ]
          },
          {
            "id": "education-transition-7",
            "fromState": "Grade",
            "toState": "Completion",
            "action": "Grade → Completion",
            "critical": false,
            "invariantIds": [
              "education-invariant-1",
              "education-invariant-2",
              "education-invariant-3"
            ]
          }
        ]
      }
    ],
    "sensitiveData": [
      {
        "id": "education-sensitive-1",
        "title": "Student identity and class rosters",
        "content": "Kategori data generik Education; konfirmasi sensitivitas pada target dan gunakan data dummy/redaksi.",
        "sourceType": "domain",
        "source": "Pack riset generik lokal; bukan fakta perusahaan",
        "confidence": 0.8,
        "verified": false,
        "notes": "Adaptasikan dengan dokumentasi target dan scope; pola bukan vulnerability target."
      },
      {
        "id": "education-sensitive-2",
        "title": "Submissions, grades and assessment records",
        "content": "Kategori data generik Education; konfirmasi sensitivitas pada target dan gunakan data dummy/redaksi.",
        "sourceType": "domain",
        "source": "Pack riset generik lokal; bukan fakta perusahaan",
        "confidence": 0.8,
        "verified": false,
        "notes": "Adaptasikan dengan dokumentasi target dan scope; pola bukan vulnerability target."
      },
      {
        "id": "education-sensitive-3",
        "title": "Guardian and enrollment details",
        "content": "Kategori data generik Education; konfirmasi sensitivitas pada target dan gunakan data dummy/redaksi.",
        "sourceType": "domain",
        "source": "Pack riset generik lokal; bukan fakta perusahaan",
        "confidence": 0.8,
        "verified": false,
        "notes": "Adaptasikan dengan dokumentasi target dan scope; pola bukan vulnerability target."
      }
    ],
    "criticalAssets": [
      {
        "id": "education-asset-1",
        "title": "Submission",
        "content": "Nilai bisnis terkait integritas, ownership dan authority pada Education flow; bukan penilaian severity target.",
        "sourceType": "domain",
        "source": "Pack riset generik lokal; bukan fakta perusahaan",
        "confidence": 0.8,
        "verified": false,
        "notes": "Adaptasikan dengan dokumentasi target dan scope; pola bukan vulnerability target."
      },
      {
        "id": "education-asset-2",
        "title": "Grade",
        "content": "Nilai bisnis terkait integritas, ownership dan authority pada Education flow; bukan penilaian severity target.",
        "sourceType": "domain",
        "source": "Pack riset generik lokal; bukan fakta perusahaan",
        "confidence": 0.8,
        "verified": false,
        "notes": "Adaptasikan dengan dokumentasi target dan scope; pola bukan vulnerability target."
      },
      {
        "id": "education-asset-3",
        "title": "Roster",
        "content": "Nilai bisnis terkait integritas, ownership dan authority pada Education flow; bukan penilaian severity target.",
        "sourceType": "domain",
        "source": "Pack riset generik lokal; bukan fakta perusahaan",
        "confidence": 0.8,
        "verified": false,
        "notes": "Adaptasikan dengan dokumentasi target dan scope; pola bukan vulnerability target."
      },
      {
        "id": "education-asset-4",
        "title": "Certificate",
        "content": "Nilai bisnis terkait integritas, ownership dan authority pada Education flow; bukan penilaian severity target.",
        "sourceType": "domain",
        "source": "Pack riset generik lokal; bukan fakta perusahaan",
        "confidence": 0.8,
        "verified": false,
        "notes": "Adaptasikan dengan dokumentasi target dan scope; pola bukan vulnerability target."
      }
    ],
    "commonTrustBoundaries": [
      {
        "id": "education-boundary-1",
        "title": "Authorization → Execution",
        "content": "Authority harus tetap sesuai ketika aksi terlindungi benar-benar dijalankan.",
        "sourceType": "domain",
        "source": "Pack riset generik lokal; bukan fakta perusahaan",
        "confidence": 0.8,
        "verified": false,
        "notes": "Adaptasikan dengan dokumentasi target dan scope; pola bukan vulnerability target.",
        "fromComponent": "User / Client",
        "toComponent": "Backend / Worker",
        "channel": "request / job",
        "authority": "Izin actor untuk object dan state yang berlaku",
        "flowId": "education-flow-1"
      }
    ],
    "securityInvariants": [
      {
        "id": "education-invariant-1",
        "title": "Student tidak boleh mengubah grade tanpa authority yang diberikan.",
        "content": "Student tidak boleh mengubah grade tanpa authority yang diberikan.",
        "sourceType": "domain",
        "source": "Pack riset generik lokal; bukan fakta perusahaan",
        "confidence": 0.8,
        "verified": false,
        "notes": "Adaptasikan dengan dokumentasi target dan scope; pola bukan vulnerability target.",
        "flowId": "education-flow-1",
        "techniqueIds": [
          "tech_16"
        ]
      },
      {
        "id": "education-invariant-2",
        "title": "Resource kelas mengikuti enrollment terkini.",
        "content": "Resource kelas mengikuti enrollment terkini.",
        "sourceType": "domain",
        "source": "Pack riset generik lokal; bukan fakta perusahaan",
        "confidence": 0.8,
        "verified": false,
        "notes": "Adaptasikan dengan dokumentasi target dan scope; pola bukan vulnerability target.",
        "flowId": "education-flow-1",
        "techniqueIds": [
          "tech_17"
        ]
      },
      {
        "id": "education-invariant-3",
        "title": "Submission/record tidak boleh berpindah pemilik tanpa izin.",
        "content": "Submission/record tidak boleh berpindah pemilik tanpa izin.",
        "sourceType": "domain",
        "source": "Pack riset generik lokal; bukan fakta perusahaan",
        "confidence": 0.8,
        "verified": false,
        "notes": "Adaptasikan dengan dokumentasi target dan scope; pola bukan vulnerability target.",
        "flowId": "education-flow-1",
        "techniqueIds": [
          "tech_07"
        ]
      }
    ],
    "commonFailurePatterns": [
      {
        "id": "education-pattern-1",
        "title": "Authorization mismatch",
        "content": "Bandingkan authority efektif, owner, state dan context sebelum menyimpulkan kontrol gagal.",
        "sourceType": "domain",
        "source": "Pack riset generik lokal; bukan fakta perusahaan",
        "confidence": 0.8,
        "verified": false,
        "notes": "Adaptasikan dengan dokumentasi target dan scope; pola bukan vulnerability target."
      },
      {
        "id": "education-pattern-2",
        "title": "Stale authorization",
        "content": "Pertanyaan generik: apakah authority lama masih dipakai setelah perubahan state?",
        "sourceType": "domain",
        "source": "Pack riset generik lokal; bukan fakta perusahaan",
        "confidence": 0.8,
        "verified": false,
        "notes": "Adaptasikan dengan dokumentasi target dan scope; pola bukan vulnerability target."
      },
      {
        "id": "education-pattern-3",
        "title": "State desynchronization",
        "content": "Perbedaan state antarkomponen perlu kontrol timing dan evidence; belum tentu vulnerability.",
        "sourceType": "domain",
        "source": "Pack riset generik lokal; bukan fakta perusahaan",
        "confidence": 0.8,
        "verified": false,
        "notes": "Adaptasikan dengan dokumentasi target dan scope; pola bukan vulnerability target."
      }
    ],
    "relevantTechniques": [
      {
        "id": "education-mapping-1",
        "title": "Technique tech_16",
        "content": "Vertical authority: operasi privilege tinggi harus menolak actor tanpa hak efektif yang sesuai. Tinjau Education flow bersama invariant terkait; gunakan hanya scope yang diotorisasi.",
        "sourceType": "domain",
        "source": "Pack riset generik lokal; bukan fakta perusahaan",
        "confidence": 0.8,
        "verified": false,
        "notes": "Adaptasikan dengan dokumentasi target dan scope; pola bukan vulnerability target.",
        "techniqueId": "tech_16",
        "flowId": "education-flow-1",
        "invariantId": "education-invariant-1",
        "researchPriority": 60
      },
      {
        "id": "education-mapping-2",
        "title": "Technique tech_17",
        "content": "Object ownership: actor harus berhak atas object, account atau record yang dirujuk pada flow. Tinjau Education flow bersama invariant terkait; gunakan hanya scope yang diotorisasi.",
        "sourceType": "domain",
        "source": "Pack riset generik lokal; bukan fakta perusahaan",
        "confidence": 0.8,
        "verified": false,
        "notes": "Adaptasikan dengan dokumentasi target dan scope; pola bukan vulnerability target.",
        "techniqueId": "tech_17",
        "flowId": "education-flow-1",
        "invariantId": "education-invariant-2",
        "researchPriority": 70
      },
      {
        "id": "education-mapping-3",
        "title": "Technique tech_07",
        "content": "Revocation/lifecycle: periksa capability dan resource turunan setelah izin, membership atau credential dicabut. Tinjau Education flow bersama invariant terkait; gunakan hanya scope yang diotorisasi.",
        "sourceType": "domain",
        "source": "Pack riset generik lokal; bukan fakta perusahaan",
        "confidence": 0.8,
        "verified": false,
        "notes": "Adaptasikan dengan dokumentasi target dan scope; pola bukan vulnerability target.",
        "techniqueId": "tech_07",
        "flowId": "education-flow-1",
        "invariantId": "education-invariant-3",
        "researchPriority": 80
      },
      {
        "id": "education-mapping-4",
        "title": "Technique tech_18",
        "content": "Business logic: retry, urutan aksi dan state terminal tidak boleh menambah efek bisnis yang melanggar invariant. Tinjau Education flow bersama invariant terkait; gunakan hanya scope yang diotorisasi.",
        "sourceType": "domain",
        "source": "Pack riset generik lokal; bukan fakta perusahaan",
        "confidence": 0.8,
        "verified": false,
        "notes": "Adaptasikan dengan dokumentasi target dan scope; pola bukan vulnerability target.",
        "techniqueId": "tech_18",
        "flowId": "education-flow-1",
        "invariantId": "education-invariant-1",
        "researchPriority": 60
      },
      {
        "id": "education-mapping-5",
        "title": "Technique tech_15",
        "content": "File/share/export: salinan, link dan export harus mempertahankan ownership serta perubahan akses. Tinjau Education flow bersama invariant terkait; gunakan hanya scope yang diotorisasi.",
        "sourceType": "domain",
        "source": "Pack riset generik lokal; bukan fakta perusahaan",
        "confidence": 0.8,
        "verified": false,
        "notes": "Adaptasikan dengan dokumentasi target dan scope; pola bukan vulnerability target.",
        "techniqueId": "tech_15",
        "flowId": "education-flow-1",
        "invariantId": "education-invariant-2",
        "researchPriority": 70
      }
    ],
    "researchQuestions": [
      {
        "id": "education-question-1",
        "title": "Bagaimana memastikan: Student tidak boleh mengubah grade tanpa authority yang diberikan.",
        "content": "Student tidak boleh mengubah grade tanpa authority yang diberikan. Apa expected behavior jika owner, authority atau state berubah sebelum execution; apa evidence yang membedakan kontrol efektif dari pelanggaran?",
        "sourceType": "domain",
        "source": "Pack riset generik lokal; bukan fakta perusahaan",
        "confidence": 0.8,
        "verified": false,
        "notes": "Adaptasikan dengan dokumentasi target dan scope; pola bukan vulnerability target.",
        "flowId": "education-flow-1",
        "invariantId": "education-invariant-1",
        "techniqueId": "tech_16"
      },
      {
        "id": "education-question-2",
        "title": "Bagaimana memastikan: Resource kelas mengikuti enrollment terkini.",
        "content": "Resource kelas mengikuti enrollment terkini. Apa expected behavior jika owner, authority atau state berubah sebelum execution; apa evidence yang membedakan kontrol efektif dari pelanggaran?",
        "sourceType": "domain",
        "source": "Pack riset generik lokal; bukan fakta perusahaan",
        "confidence": 0.8,
        "verified": false,
        "notes": "Adaptasikan dengan dokumentasi target dan scope; pola bukan vulnerability target.",
        "flowId": "education-flow-1",
        "invariantId": "education-invariant-2",
        "techniqueId": "tech_17"
      },
      {
        "id": "education-question-3",
        "title": "Bagaimana memastikan: Submission/record tidak boleh berpindah pemilik tanpa izin.",
        "content": "Submission/record tidak boleh berpindah pemilik tanpa izin. Apa expected behavior jika owner, authority atau state berubah sebelum execution; apa evidence yang membedakan kontrol efektif dari pelanggaran?",
        "sourceType": "domain",
        "source": "Pack riset generik lokal; bukan fakta perusahaan",
        "confidence": 0.8,
        "verified": false,
        "notes": "Adaptasikan dengan dokumentasi target dan scope; pola bukan vulnerability target.",
        "flowId": "education-flow-1",
        "invariantId": "education-invariant-3",
        "techniqueId": "tech_07"
      }
    ],
    "references": []
  },
  {
    "id": "enterprise-software",
    "name": "Enterprise Software",
    "description": "Aplikasi proses organisasi dengan workflow, approval dan integrasi.",
    "notes": "Contoh pembelajaran; bukan klaim tentang perusahaan atau izin testing.",
    "provenance": {
      "sourceType": "domain",
      "source": "Pack riset generik lokal; bukan fakta perusahaan",
      "confidence": 0.8,
      "verified": false,
      "notes": "Adaptasikan dengan dokumentasi target dan scope; pola bukan vulnerability target."
    },
    "coreConcepts": [
      "Authority berbasis organisasi",
      "Approval workflow",
      "Integrasi dan data export"
    ],
    "terminology": [
      {
        "id": "enterprise-software-term-1",
        "title": "Workflow",
        "content": "Urutan state/aksi bisnis yang mempunyai prasyarat.",
        "sourceType": "domain",
        "source": "Pack riset generik lokal; bukan fakta perusahaan",
        "confidence": 0.8,
        "verified": false,
        "notes": "Adaptasikan dengan dokumentasi target dan scope; pola bukan vulnerability target.",
        "term": "Workflow",
        "definition": "Urutan state/aksi bisnis yang mempunyai prasyarat.",
        "whyImportant": "Kontrol perlu mengikuti transisi aktual.",
        "relatedTerms": [
          "Approval",
          "Record"
        ]
      },
      {
        "id": "enterprise-software-term-2",
        "title": "Approval",
        "content": "Keputusan izin untuk actor/action/resource tertentu.",
        "sourceType": "domain",
        "source": "Pack riset generik lokal; bukan fakta perusahaan",
        "confidence": 0.8,
        "verified": false,
        "notes": "Adaptasikan dengan dokumentasi target dan scope; pola bukan vulnerability target.",
        "term": "Approval",
        "definition": "Keputusan izin untuk actor/action/resource tertentu.",
        "whyImportant": "Replay atau context berubah perlu dipertimbangkan.",
        "relatedTerms": [
          "Workflow",
          "Authority"
        ]
      },
      {
        "id": "enterprise-software-term-3",
        "title": "Audit Trail",
        "content": "Record aktivitas untuk meninjau proses.",
        "sourceType": "domain",
        "source": "Pack riset generik lokal; bukan fakta perusahaan",
        "confidence": 0.8,
        "verified": false,
        "notes": "Adaptasikan dengan dokumentasi target dan scope; pola bukan vulnerability target.",
        "term": "Audit Trail",
        "definition": "Record aktivitas untuk meninjau proses.",
        "whyImportant": "Catatan bukan bukti bahwa seluruh kontrol efektif.",
        "relatedTerms": [
          "Workflow",
          "Record"
        ]
      }
    ],
    "actors": [
      {
        "id": "enterprise-software-actor-1",
        "title": "Employee",
        "content": "Peran tipikal; hak efektif harus dikonfirmasi pada target.",
        "sourceType": "domain",
        "source": "Pack riset generik lokal; bukan fakta perusahaan",
        "confidence": 0.8,
        "verified": false,
        "notes": "Adaptasikan dengan dokumentasi target dan scope; pola bukan vulnerability target."
      },
      {
        "id": "enterprise-software-actor-2",
        "title": "Manager",
        "content": "Peran tipikal; hak efektif harus dikonfirmasi pada target.",
        "sourceType": "domain",
        "source": "Pack riset generik lokal; bukan fakta perusahaan",
        "confidence": 0.8,
        "verified": false,
        "notes": "Adaptasikan dengan dokumentasi target dan scope; pola bukan vulnerability target."
      },
      {
        "id": "enterprise-software-actor-3",
        "title": "Approver",
        "content": "Peran tipikal; hak efektif harus dikonfirmasi pada target.",
        "sourceType": "domain",
        "source": "Pack riset generik lokal; bukan fakta perusahaan",
        "confidence": 0.8,
        "verified": false,
        "notes": "Adaptasikan dengan dokumentasi target dan scope; pola bukan vulnerability target."
      },
      {
        "id": "enterprise-software-actor-4",
        "title": "Administrator",
        "content": "Peran tipikal; hak efektif harus dikonfirmasi pada target.",
        "sourceType": "domain",
        "source": "Pack riset generik lokal; bukan fakta perusahaan",
        "confidence": 0.8,
        "verified": false,
        "notes": "Adaptasikan dengan dokumentasi target dan scope; pola bukan vulnerability target."
      },
      {
        "id": "enterprise-software-actor-5",
        "title": "Auditor",
        "content": "Peran tipikal; hak efektif harus dikonfirmasi pada target.",
        "sourceType": "domain",
        "source": "Pack riset generik lokal; bukan fakta perusahaan",
        "confidence": 0.8,
        "verified": false,
        "notes": "Adaptasikan dengan dokumentasi target dan scope; pola bukan vulnerability target."
      },
      {
        "id": "enterprise-software-actor-6",
        "title": "Integration Account",
        "content": "Peran tipikal; hak efektif harus dikonfirmasi pada target.",
        "sourceType": "domain",
        "source": "Pack riset generik lokal; bukan fakta perusahaan",
        "confidence": 0.8,
        "verified": false,
        "notes": "Adaptasikan dengan dokumentasi target dan scope; pola bukan vulnerability target."
      }
    ],
    "businessObjects": [
      {
        "id": "enterprise-software-object-1",
        "title": "Organization",
        "content": "Resource bisnis tipikal; ownership, state dan sensitivitas perlu dipetakan.",
        "sourceType": "domain",
        "source": "Pack riset generik lokal; bukan fakta perusahaan",
        "confidence": 0.8,
        "verified": false,
        "notes": "Adaptasikan dengan dokumentasi target dan scope; pola bukan vulnerability target."
      },
      {
        "id": "enterprise-software-object-2",
        "title": "Record",
        "content": "Resource bisnis tipikal; ownership, state dan sensitivitas perlu dipetakan.",
        "sourceType": "domain",
        "source": "Pack riset generik lokal; bukan fakta perusahaan",
        "confidence": 0.8,
        "verified": false,
        "notes": "Adaptasikan dengan dokumentasi target dan scope; pola bukan vulnerability target."
      },
      {
        "id": "enterprise-software-object-3",
        "title": "Approval",
        "content": "Resource bisnis tipikal; ownership, state dan sensitivitas perlu dipetakan.",
        "sourceType": "domain",
        "source": "Pack riset generik lokal; bukan fakta perusahaan",
        "confidence": 0.8,
        "verified": false,
        "notes": "Adaptasikan dengan dokumentasi target dan scope; pola bukan vulnerability target."
      },
      {
        "id": "enterprise-software-object-4",
        "title": "Document",
        "content": "Resource bisnis tipikal; ownership, state dan sensitivitas perlu dipetakan.",
        "sourceType": "domain",
        "source": "Pack riset generik lokal; bukan fakta perusahaan",
        "confidence": 0.8,
        "verified": false,
        "notes": "Adaptasikan dengan dokumentasi target dan scope; pola bukan vulnerability target."
      },
      {
        "id": "enterprise-software-object-5",
        "title": "Workflow",
        "content": "Resource bisnis tipikal; ownership, state dan sensitivitas perlu dipetakan.",
        "sourceType": "domain",
        "source": "Pack riset generik lokal; bukan fakta perusahaan",
        "confidence": 0.8,
        "verified": false,
        "notes": "Adaptasikan dengan dokumentasi target dan scope; pola bukan vulnerability target."
      },
      {
        "id": "enterprise-software-object-6",
        "title": "Export",
        "content": "Resource bisnis tipikal; ownership, state dan sensitivitas perlu dipetakan.",
        "sourceType": "domain",
        "source": "Pack riset generik lokal; bukan fakta perusahaan",
        "confidence": 0.8,
        "verified": false,
        "notes": "Adaptasikan dengan dokumentasi target dan scope; pola bukan vulnerability target."
      },
      {
        "id": "enterprise-software-object-7",
        "title": "Role",
        "content": "Resource bisnis tipikal; ownership, state dan sensitivitas perlu dipetakan.",
        "sourceType": "domain",
        "source": "Pack riset generik lokal; bukan fakta perusahaan",
        "confidence": 0.8,
        "verified": false,
        "notes": "Adaptasikan dengan dokumentasi target dan scope; pola bukan vulnerability target."
      },
      {
        "id": "enterprise-software-object-8",
        "title": "Integration",
        "content": "Resource bisnis tipikal; ownership, state dan sensitivitas perlu dipetakan.",
        "sourceType": "domain",
        "source": "Pack riset generik lokal; bukan fakta perusahaan",
        "confidence": 0.8,
        "verified": false,
        "notes": "Adaptasikan dengan dokumentasi target dan scope; pola bukan vulnerability target."
      }
    ],
    "businessFlows": [
      {
        "id": "enterprise-software-flow-1",
        "title": "Enterprise Software — flow generik",
        "content": "Aplikasi proses organisasi dengan workflow, approval dan integrasi.",
        "sourceType": "domain",
        "source": "Pack riset generik lokal; bukan fakta perusahaan",
        "confidence": 0.8,
        "verified": false,
        "notes": "Adaptasikan dengan dokumentasi target dan scope; pola bukan vulnerability target.",
        "steps": [
          "Employee",
          "Create Record",
          "Request Approval",
          "Manager Review",
          "Authorize",
          "Execute",
          "Audit",
          "Export"
        ],
        "actorIds": [
          "enterprise-software-actor-1",
          "enterprise-software-actor-2",
          "enterprise-software-actor-3",
          "enterprise-software-actor-4",
          "enterprise-software-actor-5",
          "enterprise-software-actor-6"
        ],
        "objectIds": [
          "enterprise-software-object-1",
          "enterprise-software-object-2",
          "enterprise-software-object-3",
          "enterprise-software-object-4",
          "enterprise-software-object-5",
          "enterprise-software-object-6",
          "enterprise-software-object-7",
          "enterprise-software-object-8"
        ],
        "boundaryIds": [
          "enterprise-software-boundary-1"
        ],
        "invariantIds": [
          "enterprise-software-invariant-1",
          "enterprise-software-invariant-2",
          "enterprise-software-invariant-3"
        ],
        "transitions": [
          {
            "id": "enterprise-software-transition-1",
            "fromState": "Employee",
            "toState": "Create Record",
            "action": "Employee → Create Record",
            "critical": false,
            "invariantIds": [
              "enterprise-software-invariant-1",
              "enterprise-software-invariant-2",
              "enterprise-software-invariant-3"
            ]
          },
          {
            "id": "enterprise-software-transition-2",
            "fromState": "Create Record",
            "toState": "Request Approval",
            "action": "Create Record → Request Approval",
            "critical": true,
            "invariantIds": [
              "enterprise-software-invariant-1",
              "enterprise-software-invariant-2",
              "enterprise-software-invariant-3"
            ]
          },
          {
            "id": "enterprise-software-transition-3",
            "fromState": "Request Approval",
            "toState": "Manager Review",
            "action": "Request Approval → Manager Review",
            "critical": true,
            "invariantIds": [
              "enterprise-software-invariant-1",
              "enterprise-software-invariant-2",
              "enterprise-software-invariant-3"
            ]
          },
          {
            "id": "enterprise-software-transition-4",
            "fromState": "Manager Review",
            "toState": "Authorize",
            "action": "Manager Review → Authorize",
            "critical": true,
            "invariantIds": [
              "enterprise-software-invariant-1",
              "enterprise-software-invariant-2",
              "enterprise-software-invariant-3"
            ]
          },
          {
            "id": "enterprise-software-transition-5",
            "fromState": "Authorize",
            "toState": "Execute",
            "action": "Authorize → Execute",
            "critical": true,
            "invariantIds": [
              "enterprise-software-invariant-1",
              "enterprise-software-invariant-2",
              "enterprise-software-invariant-3"
            ]
          },
          {
            "id": "enterprise-software-transition-6",
            "fromState": "Execute",
            "toState": "Audit",
            "action": "Execute → Audit",
            "critical": true,
            "invariantIds": [
              "enterprise-software-invariant-1",
              "enterprise-software-invariant-2",
              "enterprise-software-invariant-3"
            ]
          },
          {
            "id": "enterprise-software-transition-7",
            "fromState": "Audit",
            "toState": "Export",
            "action": "Audit → Export",
            "critical": false,
            "invariantIds": [
              "enterprise-software-invariant-1",
              "enterprise-software-invariant-2",
              "enterprise-software-invariant-3"
            ]
          }
        ]
      }
    ],
    "sensitiveData": [
      {
        "id": "enterprise-software-sensitive-1",
        "title": "Confidential documents and exports",
        "content": "Kategori data generik Enterprise Software; konfirmasi sensitivitas pada target dan gunakan data dummy/redaksi.",
        "sourceType": "domain",
        "source": "Pack riset generik lokal; bukan fakta perusahaan",
        "confidence": 0.8,
        "verified": false,
        "notes": "Adaptasikan dengan dokumentasi target dan scope; pola bukan vulnerability target."
      },
      {
        "id": "enterprise-software-sensitive-2",
        "title": "Approval and organizational records",
        "content": "Kategori data generik Enterprise Software; konfirmasi sensitivitas pada target dan gunakan data dummy/redaksi.",
        "sourceType": "domain",
        "source": "Pack riset generik lokal; bukan fakta perusahaan",
        "confidence": 0.8,
        "verified": false,
        "notes": "Adaptasikan dengan dokumentasi target dan scope; pola bukan vulnerability target."
      },
      {
        "id": "enterprise-software-sensitive-3",
        "title": "Integration credentials",
        "content": "Kategori data generik Enterprise Software; konfirmasi sensitivitas pada target dan gunakan data dummy/redaksi.",
        "sourceType": "domain",
        "source": "Pack riset generik lokal; bukan fakta perusahaan",
        "confidence": 0.8,
        "verified": false,
        "notes": "Adaptasikan dengan dokumentasi target dan scope; pola bukan vulnerability target."
      }
    ],
    "criticalAssets": [
      {
        "id": "enterprise-software-asset-1",
        "title": "Approval",
        "content": "Nilai bisnis terkait integritas, ownership dan authority pada Enterprise Software flow; bukan penilaian severity target.",
        "sourceType": "domain",
        "source": "Pack riset generik lokal; bukan fakta perusahaan",
        "confidence": 0.8,
        "verified": false,
        "notes": "Adaptasikan dengan dokumentasi target dan scope; pola bukan vulnerability target."
      },
      {
        "id": "enterprise-software-asset-2",
        "title": "Document",
        "content": "Nilai bisnis terkait integritas, ownership dan authority pada Enterprise Software flow; bukan penilaian severity target.",
        "sourceType": "domain",
        "source": "Pack riset generik lokal; bukan fakta perusahaan",
        "confidence": 0.8,
        "verified": false,
        "notes": "Adaptasikan dengan dokumentasi target dan scope; pola bukan vulnerability target."
      },
      {
        "id": "enterprise-software-asset-3",
        "title": "Workflow",
        "content": "Nilai bisnis terkait integritas, ownership dan authority pada Enterprise Software flow; bukan penilaian severity target.",
        "sourceType": "domain",
        "source": "Pack riset generik lokal; bukan fakta perusahaan",
        "confidence": 0.8,
        "verified": false,
        "notes": "Adaptasikan dengan dokumentasi target dan scope; pola bukan vulnerability target."
      },
      {
        "id": "enterprise-software-asset-4",
        "title": "Export",
        "content": "Nilai bisnis terkait integritas, ownership dan authority pada Enterprise Software flow; bukan penilaian severity target.",
        "sourceType": "domain",
        "source": "Pack riset generik lokal; bukan fakta perusahaan",
        "confidence": 0.8,
        "verified": false,
        "notes": "Adaptasikan dengan dokumentasi target dan scope; pola bukan vulnerability target."
      },
      {
        "id": "enterprise-software-asset-5",
        "title": "Integration",
        "content": "Nilai bisnis terkait integritas, ownership dan authority pada Enterprise Software flow; bukan penilaian severity target.",
        "sourceType": "domain",
        "source": "Pack riset generik lokal; bukan fakta perusahaan",
        "confidence": 0.8,
        "verified": false,
        "notes": "Adaptasikan dengan dokumentasi target dan scope; pola bukan vulnerability target."
      }
    ],
    "commonTrustBoundaries": [
      {
        "id": "enterprise-software-boundary-1",
        "title": "Authorization → Execution",
        "content": "Authority harus tetap sesuai ketika aksi terlindungi benar-benar dijalankan.",
        "sourceType": "domain",
        "source": "Pack riset generik lokal; bukan fakta perusahaan",
        "confidence": 0.8,
        "verified": false,
        "notes": "Adaptasikan dengan dokumentasi target dan scope; pola bukan vulnerability target.",
        "fromComponent": "User / Client",
        "toComponent": "Backend / Worker",
        "channel": "request / job",
        "authority": "Izin actor untuk object dan state yang berlaku",
        "flowId": "enterprise-software-flow-1"
      }
    ],
    "securityInvariants": [
      {
        "id": "enterprise-software-invariant-1",
        "title": "Approval harus terikat pada record/action/context yang disetujui.",
        "content": "Approval harus terikat pada record/action/context yang disetujui.",
        "sourceType": "domain",
        "source": "Pack riset generik lokal; bukan fakta perusahaan",
        "confidence": 0.8,
        "verified": false,
        "notes": "Adaptasikan dengan dokumentasi target dan scope; pola bukan vulnerability target.",
        "flowId": "enterprise-software-flow-1",
        "techniqueIds": [
          "tech_03"
        ]
      },
      {
        "id": "enterprise-software-invariant-2",
        "title": "Employee tidak boleh memakai operasi administrator di luar authority.",
        "content": "Employee tidak boleh memakai operasi administrator di luar authority.",
        "sourceType": "domain",
        "source": "Pack riset generik lokal; bukan fakta perusahaan",
        "confidence": 0.8,
        "verified": false,
        "notes": "Adaptasikan dengan dokumentasi target dan scope; pola bukan vulnerability target.",
        "flowId": "enterprise-software-flow-1",
        "techniqueIds": [
          "tech_16"
        ]
      },
      {
        "id": "enterprise-software-invariant-3",
        "title": "Export dan integrasi hanya membawa data yang diotorisasi.",
        "content": "Export dan integrasi hanya membawa data yang diotorisasi.",
        "sourceType": "domain",
        "source": "Pack riset generik lokal; bukan fakta perusahaan",
        "confidence": 0.8,
        "verified": false,
        "notes": "Adaptasikan dengan dokumentasi target dan scope; pola bukan vulnerability target.",
        "flowId": "enterprise-software-flow-1",
        "techniqueIds": [
          "tech_02"
        ]
      }
    ],
    "commonFailurePatterns": [
      {
        "id": "enterprise-software-pattern-1",
        "title": "Authorization mismatch",
        "content": "Bandingkan authority efektif, owner, state dan context sebelum menyimpulkan kontrol gagal.",
        "sourceType": "domain",
        "source": "Pack riset generik lokal; bukan fakta perusahaan",
        "confidence": 0.8,
        "verified": false,
        "notes": "Adaptasikan dengan dokumentasi target dan scope; pola bukan vulnerability target."
      },
      {
        "id": "enterprise-software-pattern-2",
        "title": "Stale authorization",
        "content": "Pertanyaan generik: apakah authority lama masih dipakai setelah perubahan state?",
        "sourceType": "domain",
        "source": "Pack riset generik lokal; bukan fakta perusahaan",
        "confidence": 0.8,
        "verified": false,
        "notes": "Adaptasikan dengan dokumentasi target dan scope; pola bukan vulnerability target."
      },
      {
        "id": "enterprise-software-pattern-3",
        "title": "State desynchronization",
        "content": "Perbedaan state antarkomponen perlu kontrol timing dan evidence; belum tentu vulnerability.",
        "sourceType": "domain",
        "source": "Pack riset generik lokal; bukan fakta perusahaan",
        "confidence": 0.8,
        "verified": false,
        "notes": "Adaptasikan dengan dokumentasi target dan scope; pola bukan vulnerability target."
      }
    ],
    "relevantTechniques": [
      {
        "id": "enterprise-software-mapping-1",
        "title": "Technique tech_03",
        "content": "Capability context: persetujuan harus terikat pada actor, action, resource dan context yang diberikan. Tinjau Enterprise Software flow bersama invariant terkait; gunakan hanya scope yang diotorisasi.",
        "sourceType": "domain",
        "source": "Pack riset generik lokal; bukan fakta perusahaan",
        "confidence": 0.8,
        "verified": false,
        "notes": "Adaptasikan dengan dokumentasi target dan scope; pola bukan vulnerability target.",
        "techniqueId": "tech_03",
        "flowId": "enterprise-software-flow-1",
        "invariantId": "enterprise-software-invariant-1",
        "researchPriority": 60
      },
      {
        "id": "enterprise-software-mapping-2",
        "title": "Technique tech_16",
        "content": "Vertical authority: operasi privilege tinggi harus menolak actor tanpa hak efektif yang sesuai. Tinjau Enterprise Software flow bersama invariant terkait; gunakan hanya scope yang diotorisasi.",
        "sourceType": "domain",
        "source": "Pack riset generik lokal; bukan fakta perusahaan",
        "confidence": 0.8,
        "verified": false,
        "notes": "Adaptasikan dengan dokumentasi target dan scope; pola bukan vulnerability target.",
        "techniqueId": "tech_16",
        "flowId": "enterprise-software-flow-1",
        "invariantId": "enterprise-software-invariant-2",
        "researchPriority": 70
      },
      {
        "id": "enterprise-software-mapping-3",
        "title": "Technique tech_02",
        "content": "Async revalidation: periksa apakah worker memakai authority/state yang masih berlaku ketika job dieksekusi. Tinjau Enterprise Software flow bersama invariant terkait; gunakan hanya scope yang diotorisasi.",
        "sourceType": "domain",
        "source": "Pack riset generik lokal; bukan fakta perusahaan",
        "confidence": 0.8,
        "verified": false,
        "notes": "Adaptasikan dengan dokumentasi target dan scope; pola bukan vulnerability target.",
        "techniqueId": "tech_02",
        "flowId": "enterprise-software-flow-1",
        "invariantId": "enterprise-software-invariant-3",
        "researchPriority": 80
      },
      {
        "id": "enterprise-software-mapping-4",
        "title": "Technique tech_15",
        "content": "File/share/export: salinan, link dan export harus mempertahankan ownership serta perubahan akses. Tinjau Enterprise Software flow bersama invariant terkait; gunakan hanya scope yang diotorisasi.",
        "sourceType": "domain",
        "source": "Pack riset generik lokal; bukan fakta perusahaan",
        "confidence": 0.8,
        "verified": false,
        "notes": "Adaptasikan dengan dokumentasi target dan scope; pola bukan vulnerability target.",
        "techniqueId": "tech_15",
        "flowId": "enterprise-software-flow-1",
        "invariantId": "enterprise-software-invariant-1",
        "researchPriority": 60
      },
      {
        "id": "enterprise-software-mapping-5",
        "title": "Technique tech_14",
        "content": "Tenant isolation: resource dan capability satu organisasi tidak memberi akses ke organisasi lain. Tinjau Enterprise Software flow bersama invariant terkait; gunakan hanya scope yang diotorisasi.",
        "sourceType": "domain",
        "source": "Pack riset generik lokal; bukan fakta perusahaan",
        "confidence": 0.8,
        "verified": false,
        "notes": "Adaptasikan dengan dokumentasi target dan scope; pola bukan vulnerability target.",
        "techniqueId": "tech_14",
        "flowId": "enterprise-software-flow-1",
        "invariantId": "enterprise-software-invariant-2",
        "researchPriority": 70
      }
    ],
    "researchQuestions": [
      {
        "id": "enterprise-software-question-1",
        "title": "Bagaimana memastikan: Approval harus terikat pada record/action/context yang disetujui.",
        "content": "Approval harus terikat pada record/action/context yang disetujui. Apa expected behavior jika owner, authority atau state berubah sebelum execution; apa evidence yang membedakan kontrol efektif dari pelanggaran?",
        "sourceType": "domain",
        "source": "Pack riset generik lokal; bukan fakta perusahaan",
        "confidence": 0.8,
        "verified": false,
        "notes": "Adaptasikan dengan dokumentasi target dan scope; pola bukan vulnerability target.",
        "flowId": "enterprise-software-flow-1",
        "invariantId": "enterprise-software-invariant-1",
        "techniqueId": "tech_03"
      },
      {
        "id": "enterprise-software-question-2",
        "title": "Bagaimana memastikan: Employee tidak boleh memakai operasi administrator di luar authority.",
        "content": "Employee tidak boleh memakai operasi administrator di luar authority. Apa expected behavior jika owner, authority atau state berubah sebelum execution; apa evidence yang membedakan kontrol efektif dari pelanggaran?",
        "sourceType": "domain",
        "source": "Pack riset generik lokal; bukan fakta perusahaan",
        "confidence": 0.8,
        "verified": false,
        "notes": "Adaptasikan dengan dokumentasi target dan scope; pola bukan vulnerability target.",
        "flowId": "enterprise-software-flow-1",
        "invariantId": "enterprise-software-invariant-2",
        "techniqueId": "tech_16"
      },
      {
        "id": "enterprise-software-question-3",
        "title": "Bagaimana memastikan: Export dan integrasi hanya membawa data yang diotorisasi.",
        "content": "Export dan integrasi hanya membawa data yang diotorisasi. Apa expected behavior jika owner, authority atau state berubah sebelum execution; apa evidence yang membedakan kontrol efektif dari pelanggaran?",
        "sourceType": "domain",
        "source": "Pack riset generik lokal; bukan fakta perusahaan",
        "confidence": 0.8,
        "verified": false,
        "notes": "Adaptasikan dengan dokumentasi target dan scope; pola bukan vulnerability target.",
        "flowId": "enterprise-software-flow-1",
        "invariantId": "enterprise-software-invariant-3",
        "techniqueId": "tech_02"
      }
    ],
    "references": []
  },
  {
    "id": "finance",
    "name": "Finance",
    "description": "Layanan untuk mencatat atau memindahkan nilai; flow generik perlu dicocokkan dengan produk aktual.",
    "notes": "Contoh pembelajaran; bukan klaim tentang perusahaan atau izin testing.",
    "provenance": {
      "sourceType": "domain",
      "source": "Pack riset generik lokal; bukan fakta perusahaan",
      "confidence": 0.8,
      "verified": false,
      "notes": "Adaptasikan dengan dokumentasi target dan scope; pola bukan vulnerability target."
    },
    "coreConcepts": [
      "Ownership rekening",
      "Integritas pembukuan",
      "Finalitas dan state transaksi"
    ],
    "terminology": [
      {
        "id": "finance-term-1",
        "title": "Account",
        "content": "Rekening atau identitas pembukuan untuk pemilik dana/aktivitas.",
        "sourceType": "domain",
        "source": "Pack riset generik lokal; bukan fakta perusahaan",
        "confidence": 0.8,
        "verified": false,
        "notes": "Adaptasikan dengan dokumentasi target dan scope; pola bukan vulnerability target.",
        "term": "Account",
        "definition": "Rekening atau identitas pembukuan untuk pemilik dana/aktivitas.",
        "whyImportant": "Ownership account menentukan authority transaksi.",
        "relatedTerms": [
          "Balance",
          "Ledger"
        ]
      },
      {
        "id": "finance-term-2",
        "title": "Ledger",
        "content": "Catatan entri pembukuan yang merekam perubahan posisi.",
        "sourceType": "domain",
        "source": "Pack riset generik lokal; bukan fakta perusahaan",
        "confidence": 0.8,
        "verified": false,
        "notes": "Adaptasikan dengan dokumentasi target dan scope; pola bukan vulnerability target.",
        "term": "Ledger",
        "definition": "Catatan entri pembukuan yang merekam perubahan posisi.",
        "whyImportant": "Kontrol integritas harus mengikuti state transaksi.",
        "relatedTerms": [
          "Ledger Entry",
          "Balance",
          "Reconciliation"
        ]
      },
      {
        "id": "finance-term-3",
        "title": "Balance",
        "content": "Posisi saldo berdasarkan catatan pada suatu saat.",
        "sourceType": "domain",
        "source": "Pack riset generik lokal; bukan fakta perusahaan",
        "confidence": 0.8,
        "verified": false,
        "notes": "Adaptasikan dengan dokumentasi target dan scope; pola bukan vulnerability target.",
        "term": "Balance",
        "definition": "Posisi saldo berdasarkan catatan pada suatu saat.",
        "whyImportant": "Bedakan saldo tercatat dan dana yang dapat digunakan.",
        "relatedTerms": [
          "Ledger",
          "Available Balance"
        ]
      },
      {
        "id": "finance-term-4",
        "title": "Available Balance",
        "content": "Bagian saldo yang tersedia untuk digunakan setelah pembatasan/hold.",
        "sourceType": "domain",
        "source": "Pack riset generik lokal; bukan fakta perusahaan",
        "confidence": 0.8,
        "verified": false,
        "notes": "Adaptasikan dengan dokumentasi target dan scope; pola bukan vulnerability target.",
        "term": "Available Balance",
        "definition": "Bagian saldo yang tersedia untuk digunakan setelah pembatasan/hold.",
        "whyImportant": "Jangan menyamakan dana tersedia dengan saldo keseluruhan.",
        "relatedTerms": [
          "Balance",
          "Authorization"
        ]
      },
      {
        "id": "finance-term-5",
        "title": "Settlement",
        "content": "Penyelesaian kewajiban melalui perpindahan dana atau aset.",
        "sourceType": "domain",
        "source": "Pack riset generik lokal; bukan fakta perusahaan",
        "confidence": 0.8,
        "verified": false,
        "notes": "Adaptasikan dengan dokumentasi target dan scope; pola bukan vulnerability target.",
        "term": "Settlement",
        "definition": "Penyelesaian kewajiban melalui perpindahan dana atau aset.",
        "whyImportant": "Keputusan authorization dan finalitas dapat terjadi pada tahap berbeda.",
        "relatedTerms": [
          "Clearing",
          "Transaction",
          "Reconciliation"
        ]
      },
      {
        "id": "finance-term-6",
        "title": "Clearing",
        "content": "Proses pertukaran dan pencocokan instruksi sebelum settlement.",
        "sourceType": "domain",
        "source": "Pack riset generik lokal; bukan fakta perusahaan",
        "confidence": 0.8,
        "verified": false,
        "notes": "Adaptasikan dengan dokumentasi target dan scope; pola bukan vulnerability target.",
        "term": "Clearing",
        "definition": "Proses pertukaran dan pencocokan instruksi sebelum settlement.",
        "whyImportant": "State sebelum settlement perlu dipahami saat review kontrol.",
        "relatedTerms": [
          "Settlement",
          "Reconciliation"
        ]
      },
      {
        "id": "finance-term-7",
        "title": "Transaction",
        "content": "Record suatu aktivitas ekonomi atau perpindahan nilai.",
        "sourceType": "domain",
        "source": "Pack riset generik lokal; bukan fakta perusahaan",
        "confidence": 0.8,
        "verified": false,
        "notes": "Adaptasikan dengan dokumentasi target dan scope; pola bukan vulnerability target.",
        "term": "Transaction",
        "definition": "Record suatu aktivitas ekonomi atau perpindahan nilai.",
        "whyImportant": "State dan pemilik transaksi menentukan aksi yang sah.",
        "relatedTerms": [
          "Transfer",
          "Ledger"
        ]
      },
      {
        "id": "finance-term-8",
        "title": "Transfer",
        "content": "Instruksi memindahkan nilai dari sumber ke tujuan.",
        "sourceType": "domain",
        "source": "Pack riset generik lokal; bukan fakta perusahaan",
        "confidence": 0.8,
        "verified": false,
        "notes": "Adaptasikan dengan dokumentasi target dan scope; pola bukan vulnerability target.",
        "term": "Transfer",
        "definition": "Instruksi memindahkan nilai dari sumber ke tujuan.",
        "whyImportant": "Sumber dana, beneficiary dan authority harus konsisten.",
        "relatedTerms": [
          "Account",
          "Beneficiary",
          "Transaction"
        ]
      },
      {
        "id": "finance-term-9",
        "title": "Beneficiary",
        "content": "Penerima yang dituju oleh transfer.",
        "sourceType": "domain",
        "source": "Pack riset generik lokal; bukan fakta perusahaan",
        "confidence": 0.8,
        "verified": false,
        "notes": "Adaptasikan dengan dokumentasi target dan scope; pola bukan vulnerability target.",
        "term": "Beneficiary",
        "definition": "Penerima yang dituju oleh transfer.",
        "whyImportant": "Perubahan penerima dapat mengubah context authorization.",
        "relatedTerms": [
          "Transfer",
          "Account"
        ]
      },
      {
        "id": "finance-term-10",
        "title": "Merchant",
        "content": "Pihak yang menerima pembayaran atas barang/jasa.",
        "sourceType": "domain",
        "source": "Pack riset generik lokal; bukan fakta perusahaan",
        "confidence": 0.8,
        "verified": false,
        "notes": "Adaptasikan dengan dokumentasi target dan scope; pola bukan vulnerability target.",
        "term": "Merchant",
        "definition": "Pihak yang menerima pembayaran atas barang/jasa.",
        "whyImportant": "Merchant mempunyai hak dan resource berbeda dari customer.",
        "relatedTerms": [
          "Payment",
          "Settlement"
        ]
      },
      {
        "id": "finance-term-11",
        "title": "Payment",
        "content": "Aktivitas pembayaran beserta proses dan record terkait.",
        "sourceType": "domain",
        "source": "Pack riset generik lokal; bukan fakta perusahaan",
        "confidence": 0.8,
        "verified": false,
        "notes": "Adaptasikan dengan dokumentasi target dan scope; pola bukan vulnerability target.",
        "term": "Payment",
        "definition": "Aktivitas pembayaran beserta proses dan record terkait.",
        "whyImportant": "Bedakan request, authorization dan penyelesaiannya.",
        "relatedTerms": [
          "Authorization",
          "Capture",
          "Refund"
        ]
      },
      {
        "id": "finance-term-12",
        "title": "Authorization",
        "content": "Persetujuan atau keputusan izin untuk aksi pembayaran tertentu.",
        "sourceType": "domain",
        "source": "Pack riset generik lokal; bukan fakta perusahaan",
        "confidence": 0.8,
        "verified": false,
        "notes": "Adaptasikan dengan dokumentasi target dan scope; pola bukan vulnerability target.",
        "term": "Authorization",
        "definition": "Persetujuan atau keputusan izin untuk aksi pembayaran tertentu.",
        "whyImportant": "Persetujuan perlu terikat pada actor, jumlah dan tujuan yang sesuai.",
        "relatedTerms": [
          "Capture",
          "Payment"
        ]
      },
      {
        "id": "finance-term-13",
        "title": "Capture",
        "content": "Tahap menindaklanjuti pembayaran yang telah diotorisasi sesuai proses produk.",
        "sourceType": "domain",
        "source": "Pack riset generik lokal; bukan fakta perusahaan",
        "confidence": 0.8,
        "verified": false,
        "notes": "Adaptasikan dengan dokumentasi target dan scope; pola bukan vulnerability target.",
        "term": "Capture",
        "definition": "Tahap menindaklanjuti pembayaran yang telah diotorisasi sesuai proses produk.",
        "whyImportant": "Jangan menganggap authorization sama dengan dana sudah terselesaikan.",
        "relatedTerms": [
          "Authorization",
          "Settlement"
        ]
      },
      {
        "id": "finance-term-14",
        "title": "Refund",
        "content": "Pengembalian nilai berdasarkan pembayaran/ketentuan yang relevan.",
        "sourceType": "domain",
        "source": "Pack riset generik lokal; bukan fakta perusahaan",
        "confidence": 0.8,
        "verified": false,
        "notes": "Adaptasikan dengan dokumentasi target dan scope; pola bukan vulnerability target.",
        "term": "Refund",
        "definition": "Pengembalian nilai berdasarkan pembayaran/ketentuan yang relevan.",
        "whyImportant": "Hak dan penggunaan ulang aksi harus ditinjau.",
        "relatedTerms": [
          "Payment",
          "Reversal"
        ]
      },
      {
        "id": "finance-term-15",
        "title": "Reversal",
        "content": "Pembalikan operasi atau entri sesuai mekanisme produk.",
        "sourceType": "domain",
        "source": "Pack riset generik lokal; bukan fakta perusahaan",
        "confidence": 0.8,
        "verified": false,
        "notes": "Adaptasikan dengan dokumentasi target dan scope; pola bukan vulnerability target.",
        "term": "Reversal",
        "definition": "Pembalikan operasi atau entri sesuai mekanisme produk.",
        "whyImportant": "Bedakan pembalikan dari refund dan retry.",
        "relatedTerms": [
          "Transaction",
          "Refund"
        ]
      },
      {
        "id": "finance-term-16",
        "title": "Reconciliation",
        "content": "Pencocokan record antar pihak atau sistem untuk mencari perbedaan.",
        "sourceType": "domain",
        "source": "Pack riset generik lokal; bukan fakta perusahaan",
        "confidence": 0.8,
        "verified": false,
        "notes": "Adaptasikan dengan dokumentasi target dan scope; pola bukan vulnerability target.",
        "term": "Reconciliation",
        "definition": "Pencocokan record antar pihak atau sistem untuk mencari perbedaan.",
        "whyImportant": "Perbedaan state ledger dan settlement perlu penjelasan, bukan langsung vulnerability.",
        "relatedTerms": [
          "Ledger",
          "Settlement",
          "Clearing"
        ]
      },
      {
        "id": "finance-term-17",
        "title": "Chargeback",
        "content": "Proses sengketa atau pengembalian melalui mekanisme pembayaran yang berlaku.",
        "sourceType": "domain",
        "source": "Pack riset generik lokal; bukan fakta perusahaan",
        "confidence": 0.8,
        "verified": false,
        "notes": "Adaptasikan dengan dokumentasi target dan scope; pola bukan vulnerability target.",
        "term": "Chargeback",
        "definition": "Proses sengketa atau pengembalian melalui mekanisme pembayaran yang berlaku.",
        "whyImportant": "Authority dan state dispute berbeda dari refund biasa.",
        "relatedTerms": [
          "Payment",
          "Refund"
        ]
      },
      {
        "id": "finance-term-18",
        "title": "Withdrawal",
        "content": "Penarikan nilai dari account menurut aturan produk.",
        "sourceType": "domain",
        "source": "Pack riset generik lokal; bukan fakta perusahaan",
        "confidence": 0.8,
        "verified": false,
        "notes": "Adaptasikan dengan dokumentasi target dan scope; pola bukan vulnerability target.",
        "term": "Withdrawal",
        "definition": "Penarikan nilai dari account menurut aturan produk.",
        "whyImportant": "Periksa ownership dan prasyarat aksi pada data dummy.",
        "relatedTerms": [
          "Account",
          "Limit"
        ]
      },
      {
        "id": "finance-term-19",
        "title": "Deposit",
        "content": "Penambahan dana/record masuk menurut proses produk.",
        "sourceType": "domain",
        "source": "Pack riset generik lokal; bukan fakta perusahaan",
        "confidence": 0.8,
        "verified": false,
        "notes": "Adaptasikan dengan dokumentasi target dan scope; pola bukan vulnerability target.",
        "term": "Deposit",
        "definition": "Penambahan dana/record masuk menurut proses produk.",
        "whyImportant": "Jangan menyimpulkan saldo final hanya dari request sukses.",
        "relatedTerms": [
          "Account",
          "Settlement"
        ]
      },
      {
        "id": "finance-term-20",
        "title": "Limit",
        "content": "Batas aktivitas atau jumlah yang ditentukan produk.",
        "sourceType": "domain",
        "source": "Pack riset generik lokal; bukan fakta perusahaan",
        "confidence": 0.8,
        "verified": false,
        "notes": "Adaptasikan dengan dokumentasi target dan scope; pola bukan vulnerability target.",
        "term": "Limit",
        "definition": "Batas aktivitas atau jumlah yang ditentukan produk.",
        "whyImportant": "Batas dapat bergantung actor, state atau periode.",
        "relatedTerms": [
          "Transfer",
          "Withdrawal"
        ]
      },
      {
        "id": "finance-term-21",
        "title": "KYC",
        "content": "Proses mengenali customer sesuai kebijakan penyedia.",
        "sourceType": "domain",
        "source": "Pack riset generik lokal; bukan fakta perusahaan",
        "confidence": 0.8,
        "verified": false,
        "notes": "Adaptasikan dengan dokumentasi target dan scope; pola bukan vulnerability target.",
        "term": "KYC",
        "definition": "Proses mengenali customer sesuai kebijakan penyedia.",
        "whyImportant": "Status verifikasi adalah data dan authority sensitif.",
        "relatedTerms": [
          "Customer",
          "Account"
        ]
      },
      {
        "id": "finance-term-22",
        "title": "AML",
        "content": "Kebijakan/proses untuk mengendalikan penyalahgunaan keuangan menurut penyedia.",
        "sourceType": "domain",
        "source": "Pack riset generik lokal; bukan fakta perusahaan",
        "confidence": 0.8,
        "verified": false,
        "notes": "Adaptasikan dengan dokumentasi target dan scope; pola bukan vulnerability target.",
        "term": "AML",
        "definition": "Kebijakan/proses untuk mengendalikan penyalahgunaan keuangan menurut penyedia.",
        "whyImportant": "Ini konteks domain, bukan panduan kepatuhan atau izin testing.",
        "relatedTerms": [
          "KYC",
          "Transaction"
        ]
      }
    ],
    "actors": [
      {
        "id": "finance-actor-1",
        "title": "Customer",
        "content": "Peran tipikal; hak efektif harus dikonfirmasi pada target.",
        "sourceType": "domain",
        "source": "Pack riset generik lokal; bukan fakta perusahaan",
        "confidence": 0.8,
        "verified": false,
        "notes": "Adaptasikan dengan dokumentasi target dan scope; pola bukan vulnerability target."
      },
      {
        "id": "finance-actor-2",
        "title": "Merchant",
        "content": "Peran tipikal; hak efektif harus dikonfirmasi pada target.",
        "sourceType": "domain",
        "source": "Pack riset generik lokal; bukan fakta perusahaan",
        "confidence": 0.8,
        "verified": false,
        "notes": "Adaptasikan dengan dokumentasi target dan scope; pola bukan vulnerability target."
      },
      {
        "id": "finance-actor-3",
        "title": "Beneficiary",
        "content": "Peran tipikal; hak efektif harus dikonfirmasi pada target.",
        "sourceType": "domain",
        "source": "Pack riset generik lokal; bukan fakta perusahaan",
        "confidence": 0.8,
        "verified": false,
        "notes": "Adaptasikan dengan dokumentasi target dan scope; pola bukan vulnerability target."
      },
      {
        "id": "finance-actor-4",
        "title": "Bank",
        "content": "Peran tipikal; hak efektif harus dikonfirmasi pada target.",
        "sourceType": "domain",
        "source": "Pack riset generik lokal; bukan fakta perusahaan",
        "confidence": 0.8,
        "verified": false,
        "notes": "Adaptasikan dengan dokumentasi target dan scope; pola bukan vulnerability target."
      },
      {
        "id": "finance-actor-5",
        "title": "Payment Processor",
        "content": "Peran tipikal; hak efektif harus dikonfirmasi pada target.",
        "sourceType": "domain",
        "source": "Pack riset generik lokal; bukan fakta perusahaan",
        "confidence": 0.8,
        "verified": false,
        "notes": "Adaptasikan dengan dokumentasi target dan scope; pola bukan vulnerability target."
      },
      {
        "id": "finance-actor-6",
        "title": "Administrator",
        "content": "Peran tipikal; hak efektif harus dikonfirmasi pada target.",
        "sourceType": "domain",
        "source": "Pack riset generik lokal; bukan fakta perusahaan",
        "confidence": 0.8,
        "verified": false,
        "notes": "Adaptasikan dengan dokumentasi target dan scope; pola bukan vulnerability target."
      },
      {
        "id": "finance-actor-7",
        "title": "Compliance Officer",
        "content": "Peran tipikal; hak efektif harus dikonfirmasi pada target.",
        "sourceType": "domain",
        "source": "Pack riset generik lokal; bukan fakta perusahaan",
        "confidence": 0.8,
        "verified": false,
        "notes": "Adaptasikan dengan dokumentasi target dan scope; pola bukan vulnerability target."
      },
      {
        "id": "finance-actor-8",
        "title": "Service Account",
        "content": "Peran tipikal; hak efektif harus dikonfirmasi pada target.",
        "sourceType": "domain",
        "source": "Pack riset generik lokal; bukan fakta perusahaan",
        "confidence": 0.8,
        "verified": false,
        "notes": "Adaptasikan dengan dokumentasi target dan scope; pola bukan vulnerability target."
      }
    ],
    "businessObjects": [
      {
        "id": "finance-object-1",
        "title": "Account",
        "content": "Resource bisnis tipikal; ownership, state dan sensitivitas perlu dipetakan.",
        "sourceType": "domain",
        "source": "Pack riset generik lokal; bukan fakta perusahaan",
        "confidence": 0.8,
        "verified": false,
        "notes": "Adaptasikan dengan dokumentasi target dan scope; pola bukan vulnerability target."
      },
      {
        "id": "finance-object-2",
        "title": "Wallet",
        "content": "Resource bisnis tipikal; ownership, state dan sensitivitas perlu dipetakan.",
        "sourceType": "domain",
        "source": "Pack riset generik lokal; bukan fakta perusahaan",
        "confidence": 0.8,
        "verified": false,
        "notes": "Adaptasikan dengan dokumentasi target dan scope; pola bukan vulnerability target."
      },
      {
        "id": "finance-object-3",
        "title": "Transaction",
        "content": "Resource bisnis tipikal; ownership, state dan sensitivitas perlu dipetakan.",
        "sourceType": "domain",
        "source": "Pack riset generik lokal; bukan fakta perusahaan",
        "confidence": 0.8,
        "verified": false,
        "notes": "Adaptasikan dengan dokumentasi target dan scope; pola bukan vulnerability target."
      },
      {
        "id": "finance-object-4",
        "title": "Ledger Entry",
        "content": "Resource bisnis tipikal; ownership, state dan sensitivitas perlu dipetakan.",
        "sourceType": "domain",
        "source": "Pack riset generik lokal; bukan fakta perusahaan",
        "confidence": 0.8,
        "verified": false,
        "notes": "Adaptasikan dengan dokumentasi target dan scope; pola bukan vulnerability target."
      },
      {
        "id": "finance-object-5",
        "title": "Beneficiary",
        "content": "Resource bisnis tipikal; ownership, state dan sensitivitas perlu dipetakan.",
        "sourceType": "domain",
        "source": "Pack riset generik lokal; bukan fakta perusahaan",
        "confidence": 0.8,
        "verified": false,
        "notes": "Adaptasikan dengan dokumentasi target dan scope; pola bukan vulnerability target."
      },
      {
        "id": "finance-object-6",
        "title": "Payment",
        "content": "Resource bisnis tipikal; ownership, state dan sensitivitas perlu dipetakan.",
        "sourceType": "domain",
        "source": "Pack riset generik lokal; bukan fakta perusahaan",
        "confidence": 0.8,
        "verified": false,
        "notes": "Adaptasikan dengan dokumentasi target dan scope; pola bukan vulnerability target."
      },
      {
        "id": "finance-object-7",
        "title": "Refund",
        "content": "Resource bisnis tipikal; ownership, state dan sensitivitas perlu dipetakan.",
        "sourceType": "domain",
        "source": "Pack riset generik lokal; bukan fakta perusahaan",
        "confidence": 0.8,
        "verified": false,
        "notes": "Adaptasikan dengan dokumentasi target dan scope; pola bukan vulnerability target."
      },
      {
        "id": "finance-object-8",
        "title": "Settlement",
        "content": "Resource bisnis tipikal; ownership, state dan sensitivitas perlu dipetakan.",
        "sourceType": "domain",
        "source": "Pack riset generik lokal; bukan fakta perusahaan",
        "confidence": 0.8,
        "verified": false,
        "notes": "Adaptasikan dengan dokumentasi target dan scope; pola bukan vulnerability target."
      },
      {
        "id": "finance-object-9",
        "title": "Invoice",
        "content": "Resource bisnis tipikal; ownership, state dan sensitivitas perlu dipetakan.",
        "sourceType": "domain",
        "source": "Pack riset generik lokal; bukan fakta perusahaan",
        "confidence": 0.8,
        "verified": false,
        "notes": "Adaptasikan dengan dokumentasi target dan scope; pola bukan vulnerability target."
      },
      {
        "id": "finance-object-10",
        "title": "API Credential",
        "content": "Resource bisnis tipikal; ownership, state dan sensitivitas perlu dipetakan.",
        "sourceType": "domain",
        "source": "Pack riset generik lokal; bukan fakta perusahaan",
        "confidence": 0.8,
        "verified": false,
        "notes": "Adaptasikan dengan dokumentasi target dan scope; pola bukan vulnerability target."
      }
    ],
    "businessFlows": [
      {
        "id": "finance-flow-1",
        "title": "Finance — flow generik",
        "content": "Layanan untuk mencatat atau memindahkan nilai; flow generik perlu dicocokkan dengan produk aktual.",
        "sourceType": "domain",
        "source": "Pack riset generik lokal; bukan fakta perusahaan",
        "confidence": 0.8,
        "verified": false,
        "notes": "Adaptasikan dengan dokumentasi target dan scope; pola bukan vulnerability target.",
        "steps": [
          "User",
          "Create Transfer",
          "Validate Account",
          "Authorization",
          "Balance Check",
          "Transaction Created",
          "Ledger Update",
          "Settlement",
          "Reconciliation"
        ],
        "actorIds": [
          "finance-actor-1",
          "finance-actor-2",
          "finance-actor-3",
          "finance-actor-4",
          "finance-actor-5",
          "finance-actor-6",
          "finance-actor-7",
          "finance-actor-8"
        ],
        "objectIds": [
          "finance-object-1",
          "finance-object-2",
          "finance-object-3",
          "finance-object-4",
          "finance-object-5",
          "finance-object-6",
          "finance-object-7",
          "finance-object-8",
          "finance-object-9",
          "finance-object-10"
        ],
        "boundaryIds": [
          "finance-boundary-1"
        ],
        "invariantIds": [
          "finance-invariant-1",
          "finance-invariant-3",
          "finance-invariant-4"
        ],
        "transitions": [
          {
            "id": "finance-transition-1",
            "fromState": "User",
            "toState": "Create Transfer",
            "action": "User → Create Transfer",
            "critical": false,
            "invariantIds": [
              "finance-invariant-1",
              "finance-invariant-3",
              "finance-invariant-4"
            ]
          },
          {
            "id": "finance-transition-2",
            "fromState": "Create Transfer",
            "toState": "Validate Account",
            "action": "Create Transfer → Validate Account",
            "critical": false,
            "invariantIds": [
              "finance-invariant-1",
              "finance-invariant-3",
              "finance-invariant-4"
            ]
          },
          {
            "id": "finance-transition-3",
            "fromState": "Validate Account",
            "toState": "Authorization",
            "action": "Validate Account → Authorization",
            "critical": true,
            "invariantIds": [
              "finance-invariant-1",
              "finance-invariant-3",
              "finance-invariant-4"
            ]
          },
          {
            "id": "finance-transition-4",
            "fromState": "Authorization",
            "toState": "Balance Check",
            "action": "Authorization → Balance Check",
            "critical": true,
            "invariantIds": [
              "finance-invariant-1",
              "finance-invariant-3",
              "finance-invariant-4"
            ]
          },
          {
            "id": "finance-transition-5",
            "fromState": "Balance Check",
            "toState": "Transaction Created",
            "action": "Balance Check → Transaction Created",
            "critical": false,
            "invariantIds": [
              "finance-invariant-1",
              "finance-invariant-3",
              "finance-invariant-4"
            ]
          },
          {
            "id": "finance-transition-6",
            "fromState": "Transaction Created",
            "toState": "Ledger Update",
            "action": "Transaction Created → Ledger Update",
            "critical": false,
            "invariantIds": [
              "finance-invariant-1",
              "finance-invariant-3",
              "finance-invariant-4"
            ]
          },
          {
            "id": "finance-transition-7",
            "fromState": "Ledger Update",
            "toState": "Settlement",
            "action": "Ledger Update → Settlement",
            "critical": true,
            "invariantIds": [
              "finance-invariant-1",
              "finance-invariant-3",
              "finance-invariant-4"
            ]
          },
          {
            "id": "finance-transition-8",
            "fromState": "Settlement",
            "toState": "Reconciliation",
            "action": "Settlement → Reconciliation",
            "critical": true,
            "invariantIds": [
              "finance-invariant-1",
              "finance-invariant-3",
              "finance-invariant-4"
            ]
          }
        ]
      },
      {
        "id": "finance-flow-2",
        "title": "Finance — refund generik",
        "content": "Flow pengembalian nilai; prasyarat aktual harus dikonfirmasi.",
        "sourceType": "domain",
        "source": "Pack riset generik lokal; bukan fakta perusahaan",
        "confidence": 0.8,
        "verified": false,
        "notes": "Adaptasikan dengan dokumentasi target dan scope; pola bukan vulnerability target.",
        "steps": [
          "Merchant",
          "Select Payment",
          "Authorize Refund",
          "Validate Refund State",
          "Execute Refund",
          "Ledger Update",
          "Refund Completed",
          "Reconciliation"
        ],
        "actorIds": [
          "finance-actor-1",
          "finance-actor-2",
          "finance-actor-3",
          "finance-actor-4",
          "finance-actor-5",
          "finance-actor-6",
          "finance-actor-7",
          "finance-actor-8"
        ],
        "objectIds": [
          "finance-object-1",
          "finance-object-2",
          "finance-object-3",
          "finance-object-4",
          "finance-object-5",
          "finance-object-6",
          "finance-object-7",
          "finance-object-8",
          "finance-object-9",
          "finance-object-10"
        ],
        "boundaryIds": [
          "finance-boundary-1"
        ],
        "invariantIds": [
          "finance-invariant-2",
          "finance-invariant-3",
          "finance-invariant-4"
        ],
        "transitions": [
          {
            "id": "finance-refund-transition-1",
            "fromState": "Merchant",
            "toState": "Select Payment",
            "action": "Merchant → Select Payment",
            "critical": false,
            "invariantIds": [
              "finance-invariant-2",
              "finance-invariant-3",
              "finance-invariant-4"
            ]
          },
          {
            "id": "finance-refund-transition-2",
            "fromState": "Select Payment",
            "toState": "Authorize Refund",
            "action": "Select Payment → Authorize Refund",
            "critical": true,
            "invariantIds": [
              "finance-invariant-2",
              "finance-invariant-3",
              "finance-invariant-4"
            ]
          },
          {
            "id": "finance-refund-transition-3",
            "fromState": "Authorize Refund",
            "toState": "Validate Refund State",
            "action": "Authorize Refund → Validate Refund State",
            "critical": true,
            "invariantIds": [
              "finance-invariant-2",
              "finance-invariant-3",
              "finance-invariant-4"
            ]
          },
          {
            "id": "finance-refund-transition-4",
            "fromState": "Validate Refund State",
            "toState": "Execute Refund",
            "action": "Validate Refund State → Execute Refund",
            "critical": true,
            "invariantIds": [
              "finance-invariant-2",
              "finance-invariant-3",
              "finance-invariant-4"
            ]
          },
          {
            "id": "finance-refund-transition-5",
            "fromState": "Execute Refund",
            "toState": "Ledger Update",
            "action": "Execute Refund → Ledger Update",
            "critical": true,
            "invariantIds": [
              "finance-invariant-2",
              "finance-invariant-3",
              "finance-invariant-4"
            ]
          },
          {
            "id": "finance-refund-transition-6",
            "fromState": "Ledger Update",
            "toState": "Refund Completed",
            "action": "Ledger Update → Refund Completed",
            "critical": true,
            "invariantIds": [
              "finance-invariant-2",
              "finance-invariant-3",
              "finance-invariant-4"
            ]
          },
          {
            "id": "finance-refund-transition-7",
            "fromState": "Refund Completed",
            "toState": "Reconciliation",
            "action": "Refund Completed → Reconciliation",
            "critical": false,
            "invariantIds": [
              "finance-invariant-2",
              "finance-invariant-3",
              "finance-invariant-4"
            ]
          }
        ]
      }
    ],
    "sensitiveData": [
      {
        "id": "finance-sensitive-1",
        "title": "Account identity and beneficiary details",
        "content": "Kategori data generik Finance; konfirmasi sensitivitas pada target dan gunakan data dummy/redaksi.",
        "sourceType": "domain",
        "source": "Pack riset generik lokal; bukan fakta perusahaan",
        "confidence": 0.8,
        "verified": false,
        "notes": "Adaptasikan dengan dokumentasi target dan scope; pola bukan vulnerability target."
      },
      {
        "id": "finance-sensitive-2",
        "title": "Payment instructions and transaction history",
        "content": "Kategori data generik Finance; konfirmasi sensitivitas pada target dan gunakan data dummy/redaksi.",
        "sourceType": "domain",
        "source": "Pack riset generik lokal; bukan fakta perusahaan",
        "confidence": 0.8,
        "verified": false,
        "notes": "Adaptasikan dengan dokumentasi target dan scope; pola bukan vulnerability target."
      },
      {
        "id": "finance-sensitive-3",
        "title": "Ledger and settlement records",
        "content": "Kategori data generik Finance; konfirmasi sensitivitas pada target dan gunakan data dummy/redaksi.",
        "sourceType": "domain",
        "source": "Pack riset generik lokal; bukan fakta perusahaan",
        "confidence": 0.8,
        "verified": false,
        "notes": "Adaptasikan dengan dokumentasi target dan scope; pola bukan vulnerability target."
      },
      {
        "id": "finance-sensitive-4",
        "title": "Payment/API credentials",
        "content": "Kategori data generik Finance; konfirmasi sensitivitas pada target dan gunakan data dummy/redaksi.",
        "sourceType": "domain",
        "source": "Pack riset generik lokal; bukan fakta perusahaan",
        "confidence": 0.8,
        "verified": false,
        "notes": "Adaptasikan dengan dokumentasi target dan scope; pola bukan vulnerability target."
      }
    ],
    "criticalAssets": [
      {
        "id": "finance-asset-1",
        "title": "Account",
        "content": "Nilai bisnis terkait integritas, ownership dan authority pada Finance flow; bukan penilaian severity target.",
        "sourceType": "domain",
        "source": "Pack riset generik lokal; bukan fakta perusahaan",
        "confidence": 0.8,
        "verified": false,
        "notes": "Adaptasikan dengan dokumentasi target dan scope; pola bukan vulnerability target."
      },
      {
        "id": "finance-asset-2",
        "title": "Transaction",
        "content": "Nilai bisnis terkait integritas, ownership dan authority pada Finance flow; bukan penilaian severity target.",
        "sourceType": "domain",
        "source": "Pack riset generik lokal; bukan fakta perusahaan",
        "confidence": 0.8,
        "verified": false,
        "notes": "Adaptasikan dengan dokumentasi target dan scope; pola bukan vulnerability target."
      },
      {
        "id": "finance-asset-3",
        "title": "Ledger Entry",
        "content": "Nilai bisnis terkait integritas, ownership dan authority pada Finance flow; bukan penilaian severity target.",
        "sourceType": "domain",
        "source": "Pack riset generik lokal; bukan fakta perusahaan",
        "confidence": 0.8,
        "verified": false,
        "notes": "Adaptasikan dengan dokumentasi target dan scope; pola bukan vulnerability target."
      },
      {
        "id": "finance-asset-4",
        "title": "Payment",
        "content": "Nilai bisnis terkait integritas, ownership dan authority pada Finance flow; bukan penilaian severity target.",
        "sourceType": "domain",
        "source": "Pack riset generik lokal; bukan fakta perusahaan",
        "confidence": 0.8,
        "verified": false,
        "notes": "Adaptasikan dengan dokumentasi target dan scope; pola bukan vulnerability target."
      },
      {
        "id": "finance-asset-5",
        "title": "Refund",
        "content": "Nilai bisnis terkait integritas, ownership dan authority pada Finance flow; bukan penilaian severity target.",
        "sourceType": "domain",
        "source": "Pack riset generik lokal; bukan fakta perusahaan",
        "confidence": 0.8,
        "verified": false,
        "notes": "Adaptasikan dengan dokumentasi target dan scope; pola bukan vulnerability target."
      },
      {
        "id": "finance-asset-6",
        "title": "Settlement",
        "content": "Nilai bisnis terkait integritas, ownership dan authority pada Finance flow; bukan penilaian severity target.",
        "sourceType": "domain",
        "source": "Pack riset generik lokal; bukan fakta perusahaan",
        "confidence": 0.8,
        "verified": false,
        "notes": "Adaptasikan dengan dokumentasi target dan scope; pola bukan vulnerability target."
      },
      {
        "id": "finance-asset-7",
        "title": "API Credential",
        "content": "Nilai bisnis terkait integritas, ownership dan authority pada Finance flow; bukan penilaian severity target.",
        "sourceType": "domain",
        "source": "Pack riset generik lokal; bukan fakta perusahaan",
        "confidence": 0.8,
        "verified": false,
        "notes": "Adaptasikan dengan dokumentasi target dan scope; pola bukan vulnerability target."
      }
    ],
    "commonTrustBoundaries": [
      {
        "id": "finance-boundary-1",
        "title": "Authorization → Execution",
        "content": "Authority harus tetap sesuai ketika aksi terlindungi benar-benar dijalankan.",
        "sourceType": "domain",
        "source": "Pack riset generik lokal; bukan fakta perusahaan",
        "confidence": 0.8,
        "verified": false,
        "notes": "Adaptasikan dengan dokumentasi target dan scope; pola bukan vulnerability target.",
        "fromComponent": "User / Client",
        "toComponent": "Backend / Worker",
        "channel": "request / job",
        "authority": "Izin actor untuk object dan state yang berlaku",
        "flowId": "finance-flow-1"
      }
    ],
    "securityInvariants": [
      {
        "id": "finance-invariant-1",
        "title": "Transaksi harus terikat pada account yang diotorisasi.",
        "content": "Transaksi harus terikat pada account yang diotorisasi.",
        "sourceType": "domain",
        "source": "Pack riset generik lokal; bukan fakta perusahaan",
        "confidence": 0.8,
        "verified": false,
        "notes": "Adaptasikan dengan dokumentasi target dan scope; pola bukan vulnerability target.",
        "flowId": "finance-flow-1",
        "techniqueIds": [
          "tech_17"
        ]
      },
      {
        "id": "finance-invariant-2",
        "title": "Refund yang selesai tidak boleh dieksekusi dua kali.",
        "content": "Refund yang selesai tidak boleh dieksekusi dua kali.",
        "sourceType": "domain",
        "source": "Pack riset generik lokal; bukan fakta perusahaan",
        "confidence": 0.8,
        "verified": false,
        "notes": "Adaptasikan dengan dokumentasi target dan scope; pola bukan vulnerability target.",
        "flowId": "finance-flow-2",
        "techniqueIds": [
          "tech_08",
          "tech_18"
        ]
      },
      {
        "id": "finance-invariant-3",
        "title": "Authority yang dicabut tidak boleh mengizinkan eksekusi terlindungi.",
        "content": "Authority yang dicabut tidak boleh mengizinkan eksekusi terlindungi.",
        "sourceType": "domain",
        "source": "Pack riset generik lokal; bukan fakta perusahaan",
        "confidence": 0.8,
        "verified": false,
        "notes": "Adaptasikan dengan dokumentasi target dan scope; pola bukan vulnerability target.",
        "flowId": "finance-flow-1",
        "techniqueIds": [
          "tech_18"
        ]
      },
      {
        "id": "finance-invariant-4",
        "title": "Ledger harus konsisten dengan transisi transaksi yang diizinkan.",
        "content": "Ledger harus konsisten dengan transisi transaksi yang diizinkan.",
        "sourceType": "domain",
        "source": "Pack riset generik lokal; bukan fakta perusahaan",
        "confidence": 0.8,
        "verified": false,
        "notes": "Adaptasikan dengan dokumentasi target dan scope; pola bukan vulnerability target.",
        "flowId": "finance-flow-1",
        "techniqueIds": [
          "tech_02"
        ]
      }
    ],
    "commonFailurePatterns": [
      {
        "id": "finance-pattern-1",
        "title": "Authorization mismatch",
        "content": "Bandingkan authority efektif, owner, state dan context sebelum menyimpulkan kontrol gagal.",
        "sourceType": "domain",
        "source": "Pack riset generik lokal; bukan fakta perusahaan",
        "confidence": 0.8,
        "verified": false,
        "notes": "Adaptasikan dengan dokumentasi target dan scope; pola bukan vulnerability target."
      },
      {
        "id": "finance-pattern-2",
        "title": "Stale authorization",
        "content": "Pertanyaan generik: apakah authority lama masih dipakai setelah perubahan state?",
        "sourceType": "domain",
        "source": "Pack riset generik lokal; bukan fakta perusahaan",
        "confidence": 0.8,
        "verified": false,
        "notes": "Adaptasikan dengan dokumentasi target dan scope; pola bukan vulnerability target."
      },
      {
        "id": "finance-pattern-3",
        "title": "State desynchronization",
        "content": "Perbedaan state antarkomponen perlu kontrol timing dan evidence; belum tentu vulnerability.",
        "sourceType": "domain",
        "source": "Pack riset generik lokal; bukan fakta perusahaan",
        "confidence": 0.8,
        "verified": false,
        "notes": "Adaptasikan dengan dokumentasi target dan scope; pola bukan vulnerability target."
      }
    ],
    "relevantTechniques": [
      {
        "id": "finance-mapping-1",
        "title": "Technique tech_17",
        "content": "Object ownership: actor harus berhak atas object, account atau record yang dirujuk pada flow. Tinjau Finance flow bersama invariant terkait; gunakan hanya scope yang diotorisasi.",
        "sourceType": "domain",
        "source": "Pack riset generik lokal; bukan fakta perusahaan",
        "confidence": 0.8,
        "verified": false,
        "notes": "Adaptasikan dengan dokumentasi target dan scope; pola bukan vulnerability target.",
        "techniqueId": "tech_17",
        "flowId": "finance-flow-1",
        "invariantId": "finance-invariant-1",
        "researchPriority": 60
      },
      {
        "id": "finance-mapping-2",
        "title": "Technique tech_08",
        "content": "Race/TOCTOU: tinjau apakah validasi dan efek bisnis tetap konsisten saat transisi berdekatan. Tinjau Finance flow bersama invariant terkait; gunakan hanya scope yang diotorisasi.",
        "sourceType": "domain",
        "source": "Pack riset generik lokal; bukan fakta perusahaan",
        "confidence": 0.8,
        "verified": false,
        "notes": "Adaptasikan dengan dokumentasi target dan scope; pola bukan vulnerability target.",
        "techniqueId": "tech_08",
        "flowId": "finance-flow-2",
        "invariantId": "finance-invariant-2",
        "researchPriority": 70
      },
      {
        "id": "finance-mapping-3",
        "title": "Technique tech_18",
        "content": "Business logic: retry, urutan aksi dan state terminal tidak boleh menambah efek bisnis yang melanggar invariant. Tinjau Finance flow bersama invariant terkait; gunakan hanya scope yang diotorisasi.",
        "sourceType": "domain",
        "source": "Pack riset generik lokal; bukan fakta perusahaan",
        "confidence": 0.8,
        "verified": false,
        "notes": "Adaptasikan dengan dokumentasi target dan scope; pola bukan vulnerability target.",
        "techniqueId": "tech_18",
        "flowId": "finance-flow-1",
        "invariantId": "finance-invariant-3",
        "researchPriority": 80
      },
      {
        "id": "finance-mapping-4",
        "title": "Technique tech_02",
        "content": "Async revalidation: periksa apakah worker memakai authority/state yang masih berlaku ketika job dieksekusi. Tinjau Finance flow bersama invariant terkait; gunakan hanya scope yang diotorisasi.",
        "sourceType": "domain",
        "source": "Pack riset generik lokal; bukan fakta perusahaan",
        "confidence": 0.8,
        "verified": false,
        "notes": "Adaptasikan dengan dokumentasi target dan scope; pola bukan vulnerability target.",
        "techniqueId": "tech_02",
        "flowId": "finance-flow-1",
        "invariantId": "finance-invariant-4",
        "researchPriority": 60
      },
      {
        "id": "finance-mapping-5",
        "title": "Technique tech_03",
        "content": "Capability context: persetujuan harus terikat pada actor, action, resource dan context yang diberikan. Tinjau Finance flow bersama invariant terkait; gunakan hanya scope yang diotorisasi.",
        "sourceType": "domain",
        "source": "Pack riset generik lokal; bukan fakta perusahaan",
        "confidence": 0.8,
        "verified": false,
        "notes": "Adaptasikan dengan dokumentasi target dan scope; pola bukan vulnerability target.",
        "techniqueId": "tech_03",
        "flowId": "finance-flow-1",
        "invariantId": "finance-invariant-1",
        "researchPriority": 70
      }
    ],
    "researchQuestions": [
      {
        "id": "finance-question-1",
        "title": "Bagaimana memastikan: Transaksi harus terikat pada account yang diotorisasi.",
        "content": "Transaksi harus terikat pada account yang diotorisasi. Apa expected behavior jika owner, authority atau state berubah sebelum execution; apa evidence yang membedakan kontrol efektif dari pelanggaran?",
        "sourceType": "domain",
        "source": "Pack riset generik lokal; bukan fakta perusahaan",
        "confidence": 0.8,
        "verified": false,
        "notes": "Adaptasikan dengan dokumentasi target dan scope; pola bukan vulnerability target.",
        "flowId": "finance-flow-1",
        "invariantId": "finance-invariant-1",
        "techniqueId": "tech_17"
      },
      {
        "id": "finance-question-2",
        "title": "Bagaimana memastikan: Refund yang selesai tidak boleh dieksekusi dua kali.",
        "content": "Refund yang selesai tidak boleh dieksekusi dua kali. Apa expected behavior jika owner, authority atau state berubah sebelum execution; apa evidence yang membedakan kontrol efektif dari pelanggaran?",
        "sourceType": "domain",
        "source": "Pack riset generik lokal; bukan fakta perusahaan",
        "confidence": 0.8,
        "verified": false,
        "notes": "Adaptasikan dengan dokumentasi target dan scope; pola bukan vulnerability target.",
        "flowId": "finance-flow-2",
        "invariantId": "finance-invariant-2",
        "techniqueId": "tech_08"
      },
      {
        "id": "finance-question-3",
        "title": "Bagaimana memastikan: Authority yang dicabut tidak boleh mengizinkan eksekusi terlindungi.",
        "content": "Authority yang dicabut tidak boleh mengizinkan eksekusi terlindungi. Apa expected behavior jika owner, authority atau state berubah sebelum execution; apa evidence yang membedakan kontrol efektif dari pelanggaran?",
        "sourceType": "domain",
        "source": "Pack riset generik lokal; bukan fakta perusahaan",
        "confidence": 0.8,
        "verified": false,
        "notes": "Adaptasikan dengan dokumentasi target dan scope; pola bukan vulnerability target.",
        "flowId": "finance-flow-1",
        "invariantId": "finance-invariant-3",
        "techniqueId": "tech_18"
      },
      {
        "id": "finance-question-4",
        "title": "Bagaimana memastikan: Ledger harus konsisten dengan transisi transaksi yang diizinkan.",
        "content": "Ledger harus konsisten dengan transisi transaksi yang diizinkan. Apa expected behavior jika owner, authority atau state berubah sebelum execution; apa evidence yang membedakan kontrol efektif dari pelanggaran?",
        "sourceType": "domain",
        "source": "Pack riset generik lokal; bukan fakta perusahaan",
        "confidence": 0.8,
        "verified": false,
        "notes": "Adaptasikan dengan dokumentasi target dan scope; pola bukan vulnerability target.",
        "flowId": "finance-flow-1",
        "invariantId": "finance-invariant-4",
        "techniqueId": "tech_02"
      }
    ],
    "references": [
      {
        "title": "BIS CPMI — glossary clearing/settlement/reconciliation",
        "url": "https://www.bis.org/cpmi/publ/d00b.htm",
        "notes": "Referensi istilah proses pembayaran; invariant dan contoh penelitian adalah kurasi lokal."
      }
    ]
  },
  {
    "id": "fintech",
    "name": "Fintech",
    "description": "Produk teknologi untuk layanan nilai/pembayaran; pola ini tidak mengasumsikan lisensi atau mekanisme perusahaan.",
    "notes": "Contoh pembelajaran; bukan klaim tentang perusahaan atau izin testing.",
    "provenance": {
      "sourceType": "domain",
      "source": "Pack riset generik lokal; bukan fakta perusahaan",
      "confidence": 0.8,
      "verified": false,
      "notes": "Adaptasikan dengan dokumentasi target dan scope; pola bukan vulnerability target."
    },
    "coreConcepts": [
      "Wallet dan account",
      "Retry versus duplikasi",
      "Proses async pembayaran"
    ],
    "terminology": [
      {
        "id": "fintech-term-1",
        "title": "Idempotency",
        "content": "Properti bahwa pengulangan operasi yang sama tidak menambah efek yang tidak diinginkan.",
        "sourceType": "domain",
        "source": "Pack riset generik lokal; bukan fakta perusahaan",
        "confidence": 0.8,
        "verified": false,
        "notes": "Adaptasikan dengan dokumentasi target dan scope; pola bukan vulnerability target.",
        "term": "Idempotency",
        "definition": "Properti bahwa pengulangan operasi yang sama tidak menambah efek yang tidak diinginkan.",
        "whyImportant": "Penting ketika retry terjadi.",
        "relatedTerms": [
          "Retry",
          "Payment"
        ]
      },
      {
        "id": "fintech-term-2",
        "title": "Wallet",
        "content": "Resource penyimpanan/representasi nilai sesuai model produk.",
        "sourceType": "domain",
        "source": "Pack riset generik lokal; bukan fakta perusahaan",
        "confidence": 0.8,
        "verified": false,
        "notes": "Adaptasikan dengan dokumentasi target dan scope; pola bukan vulnerability target.",
        "term": "Wallet",
        "definition": "Resource penyimpanan/representasi nilai sesuai model produk.",
        "whyImportant": "Ownership wallet menentukan authority.",
        "relatedTerms": [
          "Account",
          "Transfer"
        ]
      },
      {
        "id": "fintech-term-3",
        "title": "Settlement",
        "content": "Penyelesaian kewajiban melalui perpindahan dana atau aset.",
        "sourceType": "domain",
        "source": "Pack riset generik lokal; bukan fakta perusahaan",
        "confidence": 0.8,
        "verified": false,
        "notes": "Adaptasikan dengan dokumentasi target dan scope; pola bukan vulnerability target.",
        "term": "Settlement",
        "definition": "Penyelesaian kewajiban melalui perpindahan dana atau aset.",
        "whyImportant": "Keputusan authorization dan finalitas dapat terjadi pada tahap berbeda.",
        "relatedTerms": [
          "Clearing",
          "Transaction",
          "Reconciliation"
        ]
      },
      {
        "id": "fintech-term-4",
        "title": "Clearing",
        "content": "Proses pertukaran dan pencocokan instruksi sebelum settlement.",
        "sourceType": "domain",
        "source": "Pack riset generik lokal; bukan fakta perusahaan",
        "confidence": 0.8,
        "verified": false,
        "notes": "Adaptasikan dengan dokumentasi target dan scope; pola bukan vulnerability target.",
        "term": "Clearing",
        "definition": "Proses pertukaran dan pencocokan instruksi sebelum settlement.",
        "whyImportant": "State sebelum settlement perlu dipahami saat review kontrol.",
        "relatedTerms": [
          "Settlement",
          "Reconciliation"
        ]
      },
      {
        "id": "fintech-term-5",
        "title": "Transaction",
        "content": "Record suatu aktivitas ekonomi atau perpindahan nilai.",
        "sourceType": "domain",
        "source": "Pack riset generik lokal; bukan fakta perusahaan",
        "confidence": 0.8,
        "verified": false,
        "notes": "Adaptasikan dengan dokumentasi target dan scope; pola bukan vulnerability target.",
        "term": "Transaction",
        "definition": "Record suatu aktivitas ekonomi atau perpindahan nilai.",
        "whyImportant": "State dan pemilik transaksi menentukan aksi yang sah.",
        "relatedTerms": [
          "Transfer",
          "Ledger"
        ]
      },
      {
        "id": "fintech-term-6",
        "title": "Transfer",
        "content": "Instruksi memindahkan nilai dari sumber ke tujuan.",
        "sourceType": "domain",
        "source": "Pack riset generik lokal; bukan fakta perusahaan",
        "confidence": 0.8,
        "verified": false,
        "notes": "Adaptasikan dengan dokumentasi target dan scope; pola bukan vulnerability target.",
        "term": "Transfer",
        "definition": "Instruksi memindahkan nilai dari sumber ke tujuan.",
        "whyImportant": "Sumber dana, beneficiary dan authority harus konsisten.",
        "relatedTerms": [
          "Account",
          "Beneficiary",
          "Transaction"
        ]
      },
      {
        "id": "fintech-term-7",
        "title": "Reconciliation",
        "content": "Pencocokan record antar pihak atau sistem untuk mencari perbedaan.",
        "sourceType": "domain",
        "source": "Pack riset generik lokal; bukan fakta perusahaan",
        "confidence": 0.8,
        "verified": false,
        "notes": "Adaptasikan dengan dokumentasi target dan scope; pola bukan vulnerability target.",
        "term": "Reconciliation",
        "definition": "Pencocokan record antar pihak atau sistem untuk mencari perbedaan.",
        "whyImportant": "Perbedaan state ledger dan settlement perlu penjelasan, bukan langsung vulnerability.",
        "relatedTerms": [
          "Ledger",
          "Settlement",
          "Clearing"
        ]
      }
    ],
    "actors": [
      {
        "id": "fintech-actor-1",
        "title": "Customer",
        "content": "Peran tipikal; hak efektif harus dikonfirmasi pada target.",
        "sourceType": "domain",
        "source": "Pack riset generik lokal; bukan fakta perusahaan",
        "confidence": 0.8,
        "verified": false,
        "notes": "Adaptasikan dengan dokumentasi target dan scope; pola bukan vulnerability target."
      },
      {
        "id": "fintech-actor-2",
        "title": "Merchant",
        "content": "Peran tipikal; hak efektif harus dikonfirmasi pada target.",
        "sourceType": "domain",
        "source": "Pack riset generik lokal; bukan fakta perusahaan",
        "confidence": 0.8,
        "verified": false,
        "notes": "Adaptasikan dengan dokumentasi target dan scope; pola bukan vulnerability target."
      },
      {
        "id": "fintech-actor-3",
        "title": "Beneficiary",
        "content": "Peran tipikal; hak efektif harus dikonfirmasi pada target.",
        "sourceType": "domain",
        "source": "Pack riset generik lokal; bukan fakta perusahaan",
        "confidence": 0.8,
        "verified": false,
        "notes": "Adaptasikan dengan dokumentasi target dan scope; pola bukan vulnerability target."
      },
      {
        "id": "fintech-actor-4",
        "title": "Payment Processor",
        "content": "Peran tipikal; hak efektif harus dikonfirmasi pada target.",
        "sourceType": "domain",
        "source": "Pack riset generik lokal; bukan fakta perusahaan",
        "confidence": 0.8,
        "verified": false,
        "notes": "Adaptasikan dengan dokumentasi target dan scope; pola bukan vulnerability target."
      },
      {
        "id": "fintech-actor-5",
        "title": "Administrator",
        "content": "Peran tipikal; hak efektif harus dikonfirmasi pada target.",
        "sourceType": "domain",
        "source": "Pack riset generik lokal; bukan fakta perusahaan",
        "confidence": 0.8,
        "verified": false,
        "notes": "Adaptasikan dengan dokumentasi target dan scope; pola bukan vulnerability target."
      },
      {
        "id": "fintech-actor-6",
        "title": "Service Account",
        "content": "Peran tipikal; hak efektif harus dikonfirmasi pada target.",
        "sourceType": "domain",
        "source": "Pack riset generik lokal; bukan fakta perusahaan",
        "confidence": 0.8,
        "verified": false,
        "notes": "Adaptasikan dengan dokumentasi target dan scope; pola bukan vulnerability target."
      }
    ],
    "businessObjects": [
      {
        "id": "fintech-object-1",
        "title": "Wallet",
        "content": "Resource bisnis tipikal; ownership, state dan sensitivitas perlu dipetakan.",
        "sourceType": "domain",
        "source": "Pack riset generik lokal; bukan fakta perusahaan",
        "confidence": 0.8,
        "verified": false,
        "notes": "Adaptasikan dengan dokumentasi target dan scope; pola bukan vulnerability target."
      },
      {
        "id": "fintech-object-2",
        "title": "Payment",
        "content": "Resource bisnis tipikal; ownership, state dan sensitivitas perlu dipetakan.",
        "sourceType": "domain",
        "source": "Pack riset generik lokal; bukan fakta perusahaan",
        "confidence": 0.8,
        "verified": false,
        "notes": "Adaptasikan dengan dokumentasi target dan scope; pola bukan vulnerability target."
      },
      {
        "id": "fintech-object-3",
        "title": "Refund",
        "content": "Resource bisnis tipikal; ownership, state dan sensitivitas perlu dipetakan.",
        "sourceType": "domain",
        "source": "Pack riset generik lokal; bukan fakta perusahaan",
        "confidence": 0.8,
        "verified": false,
        "notes": "Adaptasikan dengan dokumentasi target dan scope; pola bukan vulnerability target."
      },
      {
        "id": "fintech-object-4",
        "title": "Settlement",
        "content": "Resource bisnis tipikal; ownership, state dan sensitivitas perlu dipetakan.",
        "sourceType": "domain",
        "source": "Pack riset generik lokal; bukan fakta perusahaan",
        "confidence": 0.8,
        "verified": false,
        "notes": "Adaptasikan dengan dokumentasi target dan scope; pola bukan vulnerability target."
      },
      {
        "id": "fintech-object-5",
        "title": "API Credential",
        "content": "Resource bisnis tipikal; ownership, state dan sensitivitas perlu dipetakan.",
        "sourceType": "domain",
        "source": "Pack riset generik lokal; bukan fakta perusahaan",
        "confidence": 0.8,
        "verified": false,
        "notes": "Adaptasikan dengan dokumentasi target dan scope; pola bukan vulnerability target."
      },
      {
        "id": "fintech-object-6",
        "title": "Webhook Event",
        "content": "Resource bisnis tipikal; ownership, state dan sensitivitas perlu dipetakan.",
        "sourceType": "domain",
        "source": "Pack riset generik lokal; bukan fakta perusahaan",
        "confidence": 0.8,
        "verified": false,
        "notes": "Adaptasikan dengan dokumentasi target dan scope; pola bukan vulnerability target."
      },
      {
        "id": "fintech-object-7",
        "title": "Transaction",
        "content": "Resource bisnis tipikal; ownership, state dan sensitivitas perlu dipetakan.",
        "sourceType": "domain",
        "source": "Pack riset generik lokal; bukan fakta perusahaan",
        "confidence": 0.8,
        "verified": false,
        "notes": "Adaptasikan dengan dokumentasi target dan scope; pola bukan vulnerability target."
      }
    ],
    "businessFlows": [
      {
        "id": "fintech-flow-1",
        "title": "Fintech — flow generik",
        "content": "Produk teknologi untuk layanan nilai/pembayaran; pola ini tidak mengasumsikan lisensi atau mekanisme perusahaan.",
        "sourceType": "domain",
        "source": "Pack riset generik lokal; bukan fakta perusahaan",
        "confidence": 0.8,
        "verified": false,
        "notes": "Adaptasikan dengan dokumentasi target dan scope; pola bukan vulnerability target.",
        "steps": [
          "Customer",
          "Create Payment",
          "Authorize",
          "Submit",
          "Process",
          "Webhook",
          "Reconciliation"
        ],
        "actorIds": [
          "fintech-actor-1",
          "fintech-actor-2",
          "fintech-actor-3",
          "fintech-actor-4",
          "fintech-actor-5",
          "fintech-actor-6"
        ],
        "objectIds": [
          "fintech-object-1",
          "fintech-object-2",
          "fintech-object-3",
          "fintech-object-4",
          "fintech-object-5",
          "fintech-object-6",
          "fintech-object-7"
        ],
        "boundaryIds": [
          "fintech-boundary-1"
        ],
        "invariantIds": [
          "fintech-invariant-1",
          "fintech-invariant-2",
          "fintech-invariant-3"
        ],
        "transitions": [
          {
            "id": "fintech-transition-1",
            "fromState": "Customer",
            "toState": "Create Payment",
            "action": "Customer → Create Payment",
            "critical": false,
            "invariantIds": [
              "fintech-invariant-1",
              "fintech-invariant-2",
              "fintech-invariant-3"
            ]
          },
          {
            "id": "fintech-transition-2",
            "fromState": "Create Payment",
            "toState": "Authorize",
            "action": "Create Payment → Authorize",
            "critical": true,
            "invariantIds": [
              "fintech-invariant-1",
              "fintech-invariant-2",
              "fintech-invariant-3"
            ]
          },
          {
            "id": "fintech-transition-3",
            "fromState": "Authorize",
            "toState": "Submit",
            "action": "Authorize → Submit",
            "critical": true,
            "invariantIds": [
              "fintech-invariant-1",
              "fintech-invariant-2",
              "fintech-invariant-3"
            ]
          },
          {
            "id": "fintech-transition-4",
            "fromState": "Submit",
            "toState": "Process",
            "action": "Submit → Process",
            "critical": false,
            "invariantIds": [
              "fintech-invariant-1",
              "fintech-invariant-2",
              "fintech-invariant-3"
            ]
          },
          {
            "id": "fintech-transition-5",
            "fromState": "Process",
            "toState": "Webhook",
            "action": "Process → Webhook",
            "critical": false,
            "invariantIds": [
              "fintech-invariant-1",
              "fintech-invariant-2",
              "fintech-invariant-3"
            ]
          },
          {
            "id": "fintech-transition-6",
            "fromState": "Webhook",
            "toState": "Reconciliation",
            "action": "Webhook → Reconciliation",
            "critical": false,
            "invariantIds": [
              "fintech-invariant-1",
              "fintech-invariant-2",
              "fintech-invariant-3"
            ]
          }
        ]
      }
    ],
    "sensitiveData": [
      {
        "id": "fintech-sensitive-1",
        "title": "Wallet and merchant identity",
        "content": "Kategori data generik Fintech; konfirmasi sensitivitas pada target dan gunakan data dummy/redaksi.",
        "sourceType": "domain",
        "source": "Pack riset generik lokal; bukan fakta perusahaan",
        "confidence": 0.8,
        "verified": false,
        "notes": "Adaptasikan dengan dokumentasi target dan scope; pola bukan vulnerability target."
      },
      {
        "id": "fintech-sensitive-2",
        "title": "Payment/refund events",
        "content": "Kategori data generik Fintech; konfirmasi sensitivitas pada target dan gunakan data dummy/redaksi.",
        "sourceType": "domain",
        "source": "Pack riset generik lokal; bukan fakta perusahaan",
        "confidence": 0.8,
        "verified": false,
        "notes": "Adaptasikan dengan dokumentasi target dan scope; pola bukan vulnerability target."
      },
      {
        "id": "fintech-sensitive-3",
        "title": "API credentials and webhook secrets",
        "content": "Kategori data generik Fintech; konfirmasi sensitivitas pada target dan gunakan data dummy/redaksi.",
        "sourceType": "domain",
        "source": "Pack riset generik lokal; bukan fakta perusahaan",
        "confidence": 0.8,
        "verified": false,
        "notes": "Adaptasikan dengan dokumentasi target dan scope; pola bukan vulnerability target."
      }
    ],
    "criticalAssets": [
      {
        "id": "fintech-asset-1",
        "title": "Wallet",
        "content": "Nilai bisnis terkait integritas, ownership dan authority pada Fintech flow; bukan penilaian severity target.",
        "sourceType": "domain",
        "source": "Pack riset generik lokal; bukan fakta perusahaan",
        "confidence": 0.8,
        "verified": false,
        "notes": "Adaptasikan dengan dokumentasi target dan scope; pola bukan vulnerability target."
      },
      {
        "id": "fintech-asset-2",
        "title": "Payment",
        "content": "Nilai bisnis terkait integritas, ownership dan authority pada Fintech flow; bukan penilaian severity target.",
        "sourceType": "domain",
        "source": "Pack riset generik lokal; bukan fakta perusahaan",
        "confidence": 0.8,
        "verified": false,
        "notes": "Adaptasikan dengan dokumentasi target dan scope; pola bukan vulnerability target."
      },
      {
        "id": "fintech-asset-3",
        "title": "Refund",
        "content": "Nilai bisnis terkait integritas, ownership dan authority pada Fintech flow; bukan penilaian severity target.",
        "sourceType": "domain",
        "source": "Pack riset generik lokal; bukan fakta perusahaan",
        "confidence": 0.8,
        "verified": false,
        "notes": "Adaptasikan dengan dokumentasi target dan scope; pola bukan vulnerability target."
      },
      {
        "id": "fintech-asset-4",
        "title": "Settlement",
        "content": "Nilai bisnis terkait integritas, ownership dan authority pada Fintech flow; bukan penilaian severity target.",
        "sourceType": "domain",
        "source": "Pack riset generik lokal; bukan fakta perusahaan",
        "confidence": 0.8,
        "verified": false,
        "notes": "Adaptasikan dengan dokumentasi target dan scope; pola bukan vulnerability target."
      },
      {
        "id": "fintech-asset-5",
        "title": "API Credential",
        "content": "Nilai bisnis terkait integritas, ownership dan authority pada Fintech flow; bukan penilaian severity target.",
        "sourceType": "domain",
        "source": "Pack riset generik lokal; bukan fakta perusahaan",
        "confidence": 0.8,
        "verified": false,
        "notes": "Adaptasikan dengan dokumentasi target dan scope; pola bukan vulnerability target."
      },
      {
        "id": "fintech-asset-6",
        "title": "Webhook Event",
        "content": "Nilai bisnis terkait integritas, ownership dan authority pada Fintech flow; bukan penilaian severity target.",
        "sourceType": "domain",
        "source": "Pack riset generik lokal; bukan fakta perusahaan",
        "confidence": 0.8,
        "verified": false,
        "notes": "Adaptasikan dengan dokumentasi target dan scope; pola bukan vulnerability target."
      }
    ],
    "commonTrustBoundaries": [
      {
        "id": "fintech-boundary-1",
        "title": "Authorization → Execution",
        "content": "Authority harus tetap sesuai ketika aksi terlindungi benar-benar dijalankan.",
        "sourceType": "domain",
        "source": "Pack riset generik lokal; bukan fakta perusahaan",
        "confidence": 0.8,
        "verified": false,
        "notes": "Adaptasikan dengan dokumentasi target dan scope; pola bukan vulnerability target.",
        "fromComponent": "User / Client",
        "toComponent": "Backend / Worker",
        "channel": "request / job",
        "authority": "Izin actor untuk object dan state yang berlaku",
        "flowId": "fintech-flow-1"
      }
    ],
    "securityInvariants": [
      {
        "id": "fintech-invariant-1",
        "title": "Retry tidak boleh menghasilkan efek ekonomi ganda yang tidak diizinkan.",
        "content": "Retry tidak boleh menghasilkan efek ekonomi ganda yang tidak diizinkan.",
        "sourceType": "domain",
        "source": "Pack riset generik lokal; bukan fakta perusahaan",
        "confidence": 0.8,
        "verified": false,
        "notes": "Adaptasikan dengan dokumentasi target dan scope; pola bukan vulnerability target.",
        "flowId": "fintech-flow-1",
        "techniqueIds": [
          "tech_18"
        ]
      },
      {
        "id": "fintech-invariant-2",
        "title": "Webhook harus terikat pada owner/merchant yang sah.",
        "content": "Webhook harus terikat pada owner/merchant yang sah.",
        "sourceType": "domain",
        "source": "Pack riset generik lokal; bukan fakta perusahaan",
        "confidence": 0.8,
        "verified": false,
        "notes": "Adaptasikan dengan dokumentasi target dan scope; pola bukan vulnerability target.",
        "flowId": "fintech-flow-1",
        "techniqueIds": [
          "tech_08"
        ]
      },
      {
        "id": "fintech-invariant-3",
        "title": "Worker memeriksa authority/state ketika menjalankan aksi.",
        "content": "Worker memeriksa authority/state ketika menjalankan aksi.",
        "sourceType": "domain",
        "source": "Pack riset generik lokal; bukan fakta perusahaan",
        "confidence": 0.8,
        "verified": false,
        "notes": "Adaptasikan dengan dokumentasi target dan scope; pola bukan vulnerability target.",
        "flowId": "fintech-flow-1",
        "techniqueIds": [
          "tech_09"
        ]
      }
    ],
    "commonFailurePatterns": [
      {
        "id": "fintech-pattern-1",
        "title": "Authorization mismatch",
        "content": "Bandingkan authority efektif, owner, state dan context sebelum menyimpulkan kontrol gagal.",
        "sourceType": "domain",
        "source": "Pack riset generik lokal; bukan fakta perusahaan",
        "confidence": 0.8,
        "verified": false,
        "notes": "Adaptasikan dengan dokumentasi target dan scope; pola bukan vulnerability target."
      },
      {
        "id": "fintech-pattern-2",
        "title": "Stale authorization",
        "content": "Pertanyaan generik: apakah authority lama masih dipakai setelah perubahan state?",
        "sourceType": "domain",
        "source": "Pack riset generik lokal; bukan fakta perusahaan",
        "confidence": 0.8,
        "verified": false,
        "notes": "Adaptasikan dengan dokumentasi target dan scope; pola bukan vulnerability target."
      },
      {
        "id": "fintech-pattern-3",
        "title": "State desynchronization",
        "content": "Perbedaan state antarkomponen perlu kontrol timing dan evidence; belum tentu vulnerability.",
        "sourceType": "domain",
        "source": "Pack riset generik lokal; bukan fakta perusahaan",
        "confidence": 0.8,
        "verified": false,
        "notes": "Adaptasikan dengan dokumentasi target dan scope; pola bukan vulnerability target."
      }
    ],
    "relevantTechniques": [
      {
        "id": "fintech-mapping-1",
        "title": "Technique tech_18",
        "content": "Business logic: retry, urutan aksi dan state terminal tidak boleh menambah efek bisnis yang melanggar invariant. Tinjau Fintech flow bersama invariant terkait; gunakan hanya scope yang diotorisasi.",
        "sourceType": "domain",
        "source": "Pack riset generik lokal; bukan fakta perusahaan",
        "confidence": 0.8,
        "verified": false,
        "notes": "Adaptasikan dengan dokumentasi target dan scope; pola bukan vulnerability target.",
        "techniqueId": "tech_18",
        "flowId": "fintech-flow-1",
        "invariantId": "fintech-invariant-1",
        "researchPriority": 60
      },
      {
        "id": "fintech-mapping-2",
        "title": "Technique tech_08",
        "content": "Race/TOCTOU: tinjau apakah validasi dan efek bisnis tetap konsisten saat transisi berdekatan. Tinjau Fintech flow bersama invariant terkait; gunakan hanya scope yang diotorisasi.",
        "sourceType": "domain",
        "source": "Pack riset generik lokal; bukan fakta perusahaan",
        "confidence": 0.8,
        "verified": false,
        "notes": "Adaptasikan dengan dokumentasi target dan scope; pola bukan vulnerability target.",
        "techniqueId": "tech_08",
        "flowId": "fintech-flow-1",
        "invariantId": "fintech-invariant-2",
        "researchPriority": 70
      },
      {
        "id": "fintech-mapping-3",
        "title": "Technique tech_09",
        "content": "Webhook ownership: event dan destination harus tetap terikat pada owner serta context bisnis yang sah. Tinjau Fintech flow bersama invariant terkait; gunakan hanya scope yang diotorisasi.",
        "sourceType": "domain",
        "source": "Pack riset generik lokal; bukan fakta perusahaan",
        "confidence": 0.8,
        "verified": false,
        "notes": "Adaptasikan dengan dokumentasi target dan scope; pola bukan vulnerability target.",
        "techniqueId": "tech_09",
        "flowId": "fintech-flow-1",
        "invariantId": "fintech-invariant-3",
        "researchPriority": 80
      },
      {
        "id": "fintech-mapping-4",
        "title": "Technique tech_02",
        "content": "Async revalidation: periksa apakah worker memakai authority/state yang masih berlaku ketika job dieksekusi. Tinjau Fintech flow bersama invariant terkait; gunakan hanya scope yang diotorisasi.",
        "sourceType": "domain",
        "source": "Pack riset generik lokal; bukan fakta perusahaan",
        "confidence": 0.8,
        "verified": false,
        "notes": "Adaptasikan dengan dokumentasi target dan scope; pola bukan vulnerability target.",
        "techniqueId": "tech_02",
        "flowId": "fintech-flow-1",
        "invariantId": "fintech-invariant-1",
        "researchPriority": 60
      }
    ],
    "researchQuestions": [
      {
        "id": "fintech-question-1",
        "title": "Bagaimana memastikan: Retry tidak boleh menghasilkan efek ekonomi ganda yang tidak diizinkan.",
        "content": "Retry tidak boleh menghasilkan efek ekonomi ganda yang tidak diizinkan. Apa expected behavior jika owner, authority atau state berubah sebelum execution; apa evidence yang membedakan kontrol efektif dari pelanggaran?",
        "sourceType": "domain",
        "source": "Pack riset generik lokal; bukan fakta perusahaan",
        "confidence": 0.8,
        "verified": false,
        "notes": "Adaptasikan dengan dokumentasi target dan scope; pola bukan vulnerability target.",
        "flowId": "fintech-flow-1",
        "invariantId": "fintech-invariant-1",
        "techniqueId": "tech_18"
      },
      {
        "id": "fintech-question-2",
        "title": "Bagaimana memastikan: Webhook harus terikat pada owner/merchant yang sah.",
        "content": "Webhook harus terikat pada owner/merchant yang sah. Apa expected behavior jika owner, authority atau state berubah sebelum execution; apa evidence yang membedakan kontrol efektif dari pelanggaran?",
        "sourceType": "domain",
        "source": "Pack riset generik lokal; bukan fakta perusahaan",
        "confidence": 0.8,
        "verified": false,
        "notes": "Adaptasikan dengan dokumentasi target dan scope; pola bukan vulnerability target.",
        "flowId": "fintech-flow-1",
        "invariantId": "fintech-invariant-2",
        "techniqueId": "tech_08"
      },
      {
        "id": "fintech-question-3",
        "title": "Bagaimana memastikan: Worker memeriksa authority/state ketika menjalankan aksi.",
        "content": "Worker memeriksa authority/state ketika menjalankan aksi. Apa expected behavior jika owner, authority atau state berubah sebelum execution; apa evidence yang membedakan kontrol efektif dari pelanggaran?",
        "sourceType": "domain",
        "source": "Pack riset generik lokal; bukan fakta perusahaan",
        "confidence": 0.8,
        "verified": false,
        "notes": "Adaptasikan dengan dokumentasi target dan scope; pola bukan vulnerability target.",
        "flowId": "fintech-flow-1",
        "invariantId": "fintech-invariant-3",
        "techniqueId": "tech_09"
      }
    ],
    "references": [
      {
        "title": "BIS CPMI — glossary clearing/settlement/reconciliation",
        "url": "https://www.bis.org/cpmi/publ/d00b.htm",
        "notes": "Referensi istilah proses pembayaran; invariant dan contoh penelitian adalah kurasi lokal."
      }
    ]
  },
  {
    "id": "healthcare",
    "name": "Healthcare",
    "description": "Platform informasi dan pelayanan kesehatan; gunakan data sintetis dan batas izin yang ditentukan pemilik.",
    "notes": "Contoh pembelajaran; bukan klaim tentang perusahaan atau izin testing.",
    "provenance": {
      "sourceType": "domain",
      "source": "Pack riset generik lokal; bukan fakta perusahaan",
      "confidence": 0.8,
      "verified": false,
      "notes": "Adaptasikan dengan dokumentasi target dan scope; pola bukan vulnerability target."
    },
    "coreConcepts": [
      "Consent dan purpose",
      "Keterkaitan patient/resource",
      "Role klinis dan administratif"
    ],
    "terminology": [
      {
        "id": "healthcare-term-1",
        "title": "Consent",
        "content": "Catatan pilihan izin untuk aksi, penerima dan context tertentu.",
        "sourceType": "domain",
        "source": "Pack riset generik lokal; bukan fakta perusahaan",
        "confidence": 0.8,
        "verified": false,
        "notes": "Adaptasikan dengan dokumentasi target dan scope; pola bukan vulnerability target.",
        "term": "Consent",
        "definition": "Catatan pilihan izin untuk aksi, penerima dan context tertentu.",
        "whyImportant": "Consent bukan izin universal untuk seluruh data.",
        "relatedTerms": [
          "Patient",
          "Sharing"
        ]
      },
      {
        "id": "healthcare-term-2",
        "title": "Encounter",
        "content": "Context pertemuan/layanan kesehatan pada model informasi.",
        "sourceType": "domain",
        "source": "Pack riset generik lokal; bukan fakta perusahaan",
        "confidence": 0.8,
        "verified": false,
        "notes": "Adaptasikan dengan dokumentasi target dan scope; pola bukan vulnerability target.",
        "term": "Encounter",
        "definition": "Context pertemuan/layanan kesehatan pada model informasi.",
        "whyImportant": "Menentukan hubungan resource dan role.",
        "relatedTerms": [
          "Patient",
          "Observation"
        ]
      },
      {
        "id": "healthcare-term-3",
        "title": "Observation",
        "content": "Record pengamatan/hasil dalam model informasi.",
        "sourceType": "domain",
        "source": "Pack riset generik lokal; bukan fakta perusahaan",
        "confidence": 0.8,
        "verified": false,
        "notes": "Adaptasikan dengan dokumentasi target dan scope; pola bukan vulnerability target.",
        "term": "Observation",
        "definition": "Record pengamatan/hasil dalam model informasi.",
        "whyImportant": "Dapat mengandung data sensitif.",
        "relatedTerms": [
          "Patient",
          "Encounter"
        ]
      },
      {
        "id": "healthcare-term-4",
        "title": "FHIR Resource",
        "content": "Unit struktur data pada model FHIR.",
        "sourceType": "domain",
        "source": "Pack riset generik lokal; bukan fakta perusahaan",
        "confidence": 0.8,
        "verified": false,
        "notes": "Adaptasikan dengan dokumentasi target dan scope; pola bukan vulnerability target.",
        "term": "FHIR Resource",
        "definition": "Unit struktur data pada model FHIR.",
        "whyImportant": "Reference dan akses tetap harus diotorisasi.",
        "relatedTerms": [
          "Patient",
          "Consent"
        ]
      }
    ],
    "actors": [
      {
        "id": "healthcare-actor-1",
        "title": "Patient",
        "content": "Peran tipikal; hak efektif harus dikonfirmasi pada target.",
        "sourceType": "domain",
        "source": "Pack riset generik lokal; bukan fakta perusahaan",
        "confidence": 0.8,
        "verified": false,
        "notes": "Adaptasikan dengan dokumentasi target dan scope; pola bukan vulnerability target."
      },
      {
        "id": "healthcare-actor-2",
        "title": "Clinician",
        "content": "Peran tipikal; hak efektif harus dikonfirmasi pada target.",
        "sourceType": "domain",
        "source": "Pack riset generik lokal; bukan fakta perusahaan",
        "confidence": 0.8,
        "verified": false,
        "notes": "Adaptasikan dengan dokumentasi target dan scope; pola bukan vulnerability target."
      },
      {
        "id": "healthcare-actor-3",
        "title": "Caregiver",
        "content": "Peran tipikal; hak efektif harus dikonfirmasi pada target.",
        "sourceType": "domain",
        "source": "Pack riset generik lokal; bukan fakta perusahaan",
        "confidence": 0.8,
        "verified": false,
        "notes": "Adaptasikan dengan dokumentasi target dan scope; pola bukan vulnerability target."
      },
      {
        "id": "healthcare-actor-4",
        "title": "Receptionist",
        "content": "Peran tipikal; hak efektif harus dikonfirmasi pada target.",
        "sourceType": "domain",
        "source": "Pack riset generik lokal; bukan fakta perusahaan",
        "confidence": 0.8,
        "verified": false,
        "notes": "Adaptasikan dengan dokumentasi target dan scope; pola bukan vulnerability target."
      },
      {
        "id": "healthcare-actor-5",
        "title": "Lab Operator",
        "content": "Peran tipikal; hak efektif harus dikonfirmasi pada target.",
        "sourceType": "domain",
        "source": "Pack riset generik lokal; bukan fakta perusahaan",
        "confidence": 0.8,
        "verified": false,
        "notes": "Adaptasikan dengan dokumentasi target dan scope; pola bukan vulnerability target."
      },
      {
        "id": "healthcare-actor-6",
        "title": "Administrator",
        "content": "Peran tipikal; hak efektif harus dikonfirmasi pada target.",
        "sourceType": "domain",
        "source": "Pack riset generik lokal; bukan fakta perusahaan",
        "confidence": 0.8,
        "verified": false,
        "notes": "Adaptasikan dengan dokumentasi target dan scope; pola bukan vulnerability target."
      },
      {
        "id": "healthcare-actor-7",
        "title": "Service Account",
        "content": "Peran tipikal; hak efektif harus dikonfirmasi pada target.",
        "sourceType": "domain",
        "source": "Pack riset generik lokal; bukan fakta perusahaan",
        "confidence": 0.8,
        "verified": false,
        "notes": "Adaptasikan dengan dokumentasi target dan scope; pola bukan vulnerability target."
      }
    ],
    "businessObjects": [
      {
        "id": "healthcare-object-1",
        "title": "Patient Record",
        "content": "Resource bisnis tipikal; ownership, state dan sensitivitas perlu dipetakan.",
        "sourceType": "domain",
        "source": "Pack riset generik lokal; bukan fakta perusahaan",
        "confidence": 0.8,
        "verified": false,
        "notes": "Adaptasikan dengan dokumentasi target dan scope; pola bukan vulnerability target."
      },
      {
        "id": "healthcare-object-2",
        "title": "Encounter",
        "content": "Resource bisnis tipikal; ownership, state dan sensitivitas perlu dipetakan.",
        "sourceType": "domain",
        "source": "Pack riset generik lokal; bukan fakta perusahaan",
        "confidence": 0.8,
        "verified": false,
        "notes": "Adaptasikan dengan dokumentasi target dan scope; pola bukan vulnerability target."
      },
      {
        "id": "healthcare-object-3",
        "title": "Observation",
        "content": "Resource bisnis tipikal; ownership, state dan sensitivitas perlu dipetakan.",
        "sourceType": "domain",
        "source": "Pack riset generik lokal; bukan fakta perusahaan",
        "confidence": 0.8,
        "verified": false,
        "notes": "Adaptasikan dengan dokumentasi target dan scope; pola bukan vulnerability target."
      },
      {
        "id": "healthcare-object-4",
        "title": "Appointment",
        "content": "Resource bisnis tipikal; ownership, state dan sensitivitas perlu dipetakan.",
        "sourceType": "domain",
        "source": "Pack riset generik lokal; bukan fakta perusahaan",
        "confidence": 0.8,
        "verified": false,
        "notes": "Adaptasikan dengan dokumentasi target dan scope; pola bukan vulnerability target."
      },
      {
        "id": "healthcare-object-5",
        "title": "Consent",
        "content": "Resource bisnis tipikal; ownership, state dan sensitivitas perlu dipetakan.",
        "sourceType": "domain",
        "source": "Pack riset generik lokal; bukan fakta perusahaan",
        "confidence": 0.8,
        "verified": false,
        "notes": "Adaptasikan dengan dokumentasi target dan scope; pola bukan vulnerability target."
      },
      {
        "id": "healthcare-object-6",
        "title": "Prescription",
        "content": "Resource bisnis tipikal; ownership, state dan sensitivitas perlu dipetakan.",
        "sourceType": "domain",
        "source": "Pack riset generik lokal; bukan fakta perusahaan",
        "confidence": 0.8,
        "verified": false,
        "notes": "Adaptasikan dengan dokumentasi target dan scope; pola bukan vulnerability target."
      },
      {
        "id": "healthcare-object-7",
        "title": "Document",
        "content": "Resource bisnis tipikal; ownership, state dan sensitivitas perlu dipetakan.",
        "sourceType": "domain",
        "source": "Pack riset generik lokal; bukan fakta perusahaan",
        "confidence": 0.8,
        "verified": false,
        "notes": "Adaptasikan dengan dokumentasi target dan scope; pola bukan vulnerability target."
      }
    ],
    "businessFlows": [
      {
        "id": "healthcare-flow-1",
        "title": "Healthcare — flow generik",
        "content": "Platform informasi dan pelayanan kesehatan; gunakan data sintetis dan batas izin yang ditentukan pemilik.",
        "sourceType": "domain",
        "source": "Pack riset generik lokal; bukan fakta perusahaan",
        "confidence": 0.8,
        "verified": false,
        "notes": "Adaptasikan dengan dokumentasi target dan scope; pola bukan vulnerability target.",
        "steps": [
          "Patient",
          "Appointment",
          "Encounter",
          "Observation",
          "Review",
          "Authorized Sharing",
          "Consent Update"
        ],
        "actorIds": [
          "healthcare-actor-1",
          "healthcare-actor-2",
          "healthcare-actor-3",
          "healthcare-actor-4",
          "healthcare-actor-5",
          "healthcare-actor-6",
          "healthcare-actor-7"
        ],
        "objectIds": [
          "healthcare-object-1",
          "healthcare-object-2",
          "healthcare-object-3",
          "healthcare-object-4",
          "healthcare-object-5",
          "healthcare-object-6",
          "healthcare-object-7"
        ],
        "boundaryIds": [
          "healthcare-boundary-1"
        ],
        "invariantIds": [
          "healthcare-invariant-1",
          "healthcare-invariant-2",
          "healthcare-invariant-3"
        ],
        "transitions": [
          {
            "id": "healthcare-transition-1",
            "fromState": "Patient",
            "toState": "Appointment",
            "action": "Patient → Appointment",
            "critical": false,
            "invariantIds": [
              "healthcare-invariant-1",
              "healthcare-invariant-2",
              "healthcare-invariant-3"
            ]
          },
          {
            "id": "healthcare-transition-2",
            "fromState": "Appointment",
            "toState": "Encounter",
            "action": "Appointment → Encounter",
            "critical": false,
            "invariantIds": [
              "healthcare-invariant-1",
              "healthcare-invariant-2",
              "healthcare-invariant-3"
            ]
          },
          {
            "id": "healthcare-transition-3",
            "fromState": "Encounter",
            "toState": "Observation",
            "action": "Encounter → Observation",
            "critical": false,
            "invariantIds": [
              "healthcare-invariant-1",
              "healthcare-invariant-2",
              "healthcare-invariant-3"
            ]
          },
          {
            "id": "healthcare-transition-4",
            "fromState": "Observation",
            "toState": "Review",
            "action": "Observation → Review",
            "critical": false,
            "invariantIds": [
              "healthcare-invariant-1",
              "healthcare-invariant-2",
              "healthcare-invariant-3"
            ]
          },
          {
            "id": "healthcare-transition-5",
            "fromState": "Review",
            "toState": "Authorized Sharing",
            "action": "Review → Authorized Sharing",
            "critical": true,
            "invariantIds": [
              "healthcare-invariant-1",
              "healthcare-invariant-2",
              "healthcare-invariant-3"
            ]
          },
          {
            "id": "healthcare-transition-6",
            "fromState": "Authorized Sharing",
            "toState": "Consent Update",
            "action": "Authorized Sharing → Consent Update",
            "critical": true,
            "invariantIds": [
              "healthcare-invariant-1",
              "healthcare-invariant-2",
              "healthcare-invariant-3"
            ]
          }
        ]
      }
    ],
    "sensitiveData": [
      {
        "id": "healthcare-sensitive-1",
        "title": "Patient identity and clinical observations",
        "content": "Kategori data generik Healthcare; konfirmasi sensitivitas pada target dan gunakan data dummy/redaksi.",
        "sourceType": "domain",
        "source": "Pack riset generik lokal; bukan fakta perusahaan",
        "confidence": 0.8,
        "verified": false,
        "notes": "Adaptasikan dengan dokumentasi target dan scope; pola bukan vulnerability target."
      },
      {
        "id": "healthcare-sensitive-2",
        "title": "Prescriptions and encounter documents",
        "content": "Kategori data generik Healthcare; konfirmasi sensitivitas pada target dan gunakan data dummy/redaksi.",
        "sourceType": "domain",
        "source": "Pack riset generik lokal; bukan fakta perusahaan",
        "confidence": 0.8,
        "verified": false,
        "notes": "Adaptasikan dengan dokumentasi target dan scope; pola bukan vulnerability target."
      },
      {
        "id": "healthcare-sensitive-3",
        "title": "Consent and recipient records",
        "content": "Kategori data generik Healthcare; konfirmasi sensitivitas pada target dan gunakan data dummy/redaksi.",
        "sourceType": "domain",
        "source": "Pack riset generik lokal; bukan fakta perusahaan",
        "confidence": 0.8,
        "verified": false,
        "notes": "Adaptasikan dengan dokumentasi target dan scope; pola bukan vulnerability target."
      }
    ],
    "criticalAssets": [
      {
        "id": "healthcare-asset-1",
        "title": "Patient Record",
        "content": "Nilai bisnis terkait integritas, ownership dan authority pada Healthcare flow; bukan penilaian severity target.",
        "sourceType": "domain",
        "source": "Pack riset generik lokal; bukan fakta perusahaan",
        "confidence": 0.8,
        "verified": false,
        "notes": "Adaptasikan dengan dokumentasi target dan scope; pola bukan vulnerability target."
      },
      {
        "id": "healthcare-asset-2",
        "title": "Observation",
        "content": "Nilai bisnis terkait integritas, ownership dan authority pada Healthcare flow; bukan penilaian severity target.",
        "sourceType": "domain",
        "source": "Pack riset generik lokal; bukan fakta perusahaan",
        "confidence": 0.8,
        "verified": false,
        "notes": "Adaptasikan dengan dokumentasi target dan scope; pola bukan vulnerability target."
      },
      {
        "id": "healthcare-asset-3",
        "title": "Consent",
        "content": "Nilai bisnis terkait integritas, ownership dan authority pada Healthcare flow; bukan penilaian severity target.",
        "sourceType": "domain",
        "source": "Pack riset generik lokal; bukan fakta perusahaan",
        "confidence": 0.8,
        "verified": false,
        "notes": "Adaptasikan dengan dokumentasi target dan scope; pola bukan vulnerability target."
      },
      {
        "id": "healthcare-asset-4",
        "title": "Prescription",
        "content": "Nilai bisnis terkait integritas, ownership dan authority pada Healthcare flow; bukan penilaian severity target.",
        "sourceType": "domain",
        "source": "Pack riset generik lokal; bukan fakta perusahaan",
        "confidence": 0.8,
        "verified": false,
        "notes": "Adaptasikan dengan dokumentasi target dan scope; pola bukan vulnerability target."
      }
    ],
    "commonTrustBoundaries": [
      {
        "id": "healthcare-boundary-1",
        "title": "Authorization → Execution",
        "content": "Authority harus tetap sesuai ketika aksi terlindungi benar-benar dijalankan.",
        "sourceType": "domain",
        "source": "Pack riset generik lokal; bukan fakta perusahaan",
        "confidence": 0.8,
        "verified": false,
        "notes": "Adaptasikan dengan dokumentasi target dan scope; pola bukan vulnerability target.",
        "fromComponent": "User / Client",
        "toComponent": "Backend / Worker",
        "channel": "request / job",
        "authority": "Izin actor untuk object dan state yang berlaku",
        "flowId": "healthcare-flow-1"
      }
    ],
    "securityInvariants": [
      {
        "id": "healthcare-invariant-1",
        "title": "Record pasien hanya tersedia bagi actor dan purpose yang diotorisasi.",
        "content": "Record pasien hanya tersedia bagi actor dan purpose yang diotorisasi.",
        "sourceType": "domain",
        "source": "Pack riset generik lokal; bukan fakta perusahaan",
        "confidence": 0.8,
        "verified": false,
        "notes": "Adaptasikan dengan dokumentasi target dan scope; pola bukan vulnerability target.",
        "flowId": "healthcare-flow-1",
        "techniqueIds": [
          "tech_17"
        ]
      },
      {
        "id": "healthcare-invariant-2",
        "title": "Consent/context yang berubah harus diperhitungkan dalam akses berikutnya.",
        "content": "Consent/context yang berubah harus diperhitungkan dalam akses berikutnya.",
        "sourceType": "domain",
        "source": "Pack riset generik lokal; bukan fakta perusahaan",
        "confidence": 0.8,
        "verified": false,
        "notes": "Adaptasikan dengan dokumentasi target dan scope; pola bukan vulnerability target.",
        "flowId": "healthcare-flow-1",
        "techniqueIds": [
          "tech_16"
        ]
      },
      {
        "id": "healthcare-invariant-3",
        "title": "Resource tidak boleh tertaut pada identitas pasien yang salah.",
        "content": "Resource tidak boleh tertaut pada identitas pasien yang salah.",
        "sourceType": "domain",
        "source": "Pack riset generik lokal; bukan fakta perusahaan",
        "confidence": 0.8,
        "verified": false,
        "notes": "Adaptasikan dengan dokumentasi target dan scope; pola bukan vulnerability target.",
        "flowId": "healthcare-flow-1",
        "techniqueIds": [
          "tech_07"
        ]
      }
    ],
    "commonFailurePatterns": [
      {
        "id": "healthcare-pattern-1",
        "title": "Authorization mismatch",
        "content": "Bandingkan authority efektif, owner, state dan context sebelum menyimpulkan kontrol gagal.",
        "sourceType": "domain",
        "source": "Pack riset generik lokal; bukan fakta perusahaan",
        "confidence": 0.8,
        "verified": false,
        "notes": "Adaptasikan dengan dokumentasi target dan scope; pola bukan vulnerability target."
      },
      {
        "id": "healthcare-pattern-2",
        "title": "Stale authorization",
        "content": "Pertanyaan generik: apakah authority lama masih dipakai setelah perubahan state?",
        "sourceType": "domain",
        "source": "Pack riset generik lokal; bukan fakta perusahaan",
        "confidence": 0.8,
        "verified": false,
        "notes": "Adaptasikan dengan dokumentasi target dan scope; pola bukan vulnerability target."
      },
      {
        "id": "healthcare-pattern-3",
        "title": "State desynchronization",
        "content": "Perbedaan state antarkomponen perlu kontrol timing dan evidence; belum tentu vulnerability.",
        "sourceType": "domain",
        "source": "Pack riset generik lokal; bukan fakta perusahaan",
        "confidence": 0.8,
        "verified": false,
        "notes": "Adaptasikan dengan dokumentasi target dan scope; pola bukan vulnerability target."
      }
    ],
    "relevantTechniques": [
      {
        "id": "healthcare-mapping-1",
        "title": "Technique tech_17",
        "content": "Object ownership: actor harus berhak atas object, account atau record yang dirujuk pada flow. Tinjau Healthcare flow bersama invariant terkait; gunakan hanya scope yang diotorisasi.",
        "sourceType": "domain",
        "source": "Pack riset generik lokal; bukan fakta perusahaan",
        "confidence": 0.8,
        "verified": false,
        "notes": "Adaptasikan dengan dokumentasi target dan scope; pola bukan vulnerability target.",
        "techniqueId": "tech_17",
        "flowId": "healthcare-flow-1",
        "invariantId": "healthcare-invariant-1",
        "researchPriority": 60
      },
      {
        "id": "healthcare-mapping-2",
        "title": "Technique tech_16",
        "content": "Vertical authority: operasi privilege tinggi harus menolak actor tanpa hak efektif yang sesuai. Tinjau Healthcare flow bersama invariant terkait; gunakan hanya scope yang diotorisasi.",
        "sourceType": "domain",
        "source": "Pack riset generik lokal; bukan fakta perusahaan",
        "confidence": 0.8,
        "verified": false,
        "notes": "Adaptasikan dengan dokumentasi target dan scope; pola bukan vulnerability target.",
        "techniqueId": "tech_16",
        "flowId": "healthcare-flow-1",
        "invariantId": "healthcare-invariant-2",
        "researchPriority": 70
      },
      {
        "id": "healthcare-mapping-3",
        "title": "Technique tech_07",
        "content": "Revocation/lifecycle: periksa capability dan resource turunan setelah izin, membership atau credential dicabut. Tinjau Healthcare flow bersama invariant terkait; gunakan hanya scope yang diotorisasi.",
        "sourceType": "domain",
        "source": "Pack riset generik lokal; bukan fakta perusahaan",
        "confidence": 0.8,
        "verified": false,
        "notes": "Adaptasikan dengan dokumentasi target dan scope; pola bukan vulnerability target.",
        "techniqueId": "tech_07",
        "flowId": "healthcare-flow-1",
        "invariantId": "healthcare-invariant-3",
        "researchPriority": 80
      },
      {
        "id": "healthcare-mapping-4",
        "title": "Technique tech_13",
        "content": "Account linking: identitas dan consent harus terikat pada akun serta recipient yang benar. Tinjau Healthcare flow bersama invariant terkait; gunakan hanya scope yang diotorisasi.",
        "sourceType": "domain",
        "source": "Pack riset generik lokal; bukan fakta perusahaan",
        "confidence": 0.8,
        "verified": false,
        "notes": "Adaptasikan dengan dokumentasi target dan scope; pola bukan vulnerability target.",
        "techniqueId": "tech_13",
        "flowId": "healthcare-flow-1",
        "invariantId": "healthcare-invariant-1",
        "researchPriority": 60
      },
      {
        "id": "healthcare-mapping-5",
        "title": "Technique tech_15",
        "content": "File/share/export: salinan, link dan export harus mempertahankan ownership serta perubahan akses. Tinjau Healthcare flow bersama invariant terkait; gunakan hanya scope yang diotorisasi.",
        "sourceType": "domain",
        "source": "Pack riset generik lokal; bukan fakta perusahaan",
        "confidence": 0.8,
        "verified": false,
        "notes": "Adaptasikan dengan dokumentasi target dan scope; pola bukan vulnerability target.",
        "techniqueId": "tech_15",
        "flowId": "healthcare-flow-1",
        "invariantId": "healthcare-invariant-2",
        "researchPriority": 70
      }
    ],
    "researchQuestions": [
      {
        "id": "healthcare-question-1",
        "title": "Bagaimana memastikan: Record pasien hanya tersedia bagi actor dan purpose yang diotorisasi.",
        "content": "Record pasien hanya tersedia bagi actor dan purpose yang diotorisasi. Apa expected behavior jika owner, authority atau state berubah sebelum execution; apa evidence yang membedakan kontrol efektif dari pelanggaran?",
        "sourceType": "domain",
        "source": "Pack riset generik lokal; bukan fakta perusahaan",
        "confidence": 0.8,
        "verified": false,
        "notes": "Adaptasikan dengan dokumentasi target dan scope; pola bukan vulnerability target.",
        "flowId": "healthcare-flow-1",
        "invariantId": "healthcare-invariant-1",
        "techniqueId": "tech_17"
      },
      {
        "id": "healthcare-question-2",
        "title": "Bagaimana memastikan: Consent/context yang berubah harus diperhitungkan dalam akses berikutnya.",
        "content": "Consent/context yang berubah harus diperhitungkan dalam akses berikutnya. Apa expected behavior jika owner, authority atau state berubah sebelum execution; apa evidence yang membedakan kontrol efektif dari pelanggaran?",
        "sourceType": "domain",
        "source": "Pack riset generik lokal; bukan fakta perusahaan",
        "confidence": 0.8,
        "verified": false,
        "notes": "Adaptasikan dengan dokumentasi target dan scope; pola bukan vulnerability target.",
        "flowId": "healthcare-flow-1",
        "invariantId": "healthcare-invariant-2",
        "techniqueId": "tech_16"
      },
      {
        "id": "healthcare-question-3",
        "title": "Bagaimana memastikan: Resource tidak boleh tertaut pada identitas pasien yang salah.",
        "content": "Resource tidak boleh tertaut pada identitas pasien yang salah. Apa expected behavior jika owner, authority atau state berubah sebelum execution; apa evidence yang membedakan kontrol efektif dari pelanggaran?",
        "sourceType": "domain",
        "source": "Pack riset generik lokal; bukan fakta perusahaan",
        "confidence": 0.8,
        "verified": false,
        "notes": "Adaptasikan dengan dokumentasi target dan scope; pola bukan vulnerability target.",
        "flowId": "healthcare-flow-1",
        "invariantId": "healthcare-invariant-3",
        "techniqueId": "tech_07"
      }
    ],
    "references": [
      {
        "title": "HL7 FHIR R4 — Consent",
        "url": "https://hl7.org/fhir/R4/consent.html",
        "notes": "Referensi representasi consent; bukan panduan hukum/klinis atau klaim sistem target."
      }
    ]
  },
  {
    "id": "saas",
    "name": "SaaS",
    "description": "Aplikasi sebagai layanan dengan organisasi, workspace dan resource; bentuk tenancy harus dikonfirmasi pada target.",
    "notes": "Contoh pembelajaran; bukan klaim tentang perusahaan atau izin testing.",
    "provenance": {
      "sourceType": "domain",
      "source": "Pack riset generik lokal; bukan fakta perusahaan",
      "confidence": 0.8,
      "verified": false,
      "notes": "Adaptasikan dengan dokumentasi target dan scope; pola bukan vulnerability target."
    },
    "coreConcepts": [
      "Tenancy",
      "Lifecycle membership",
      "Role dan capability"
    ],
    "terminology": [
      {
        "id": "saas-term-1",
        "title": "Tenant",
        "content": "Unit pemisahan customer/organisasi dalam layanan.",
        "sourceType": "domain",
        "source": "Pack riset generik lokal; bukan fakta perusahaan",
        "confidence": 0.8,
        "verified": false,
        "notes": "Adaptasikan dengan dokumentasi target dan scope; pola bukan vulnerability target.",
        "term": "Tenant",
        "definition": "Unit pemisahan customer/organisasi dalam layanan.",
        "whyImportant": "Context tenant harus ikut keputusan akses.",
        "relatedTerms": [
          "Workspace",
          "Organization"
        ]
      },
      {
        "id": "saas-term-2",
        "title": "Workspace",
        "content": "Area resource dan membership yang dikelola bersama.",
        "sourceType": "domain",
        "source": "Pack riset generik lokal; bukan fakta perusahaan",
        "confidence": 0.8,
        "verified": false,
        "notes": "Adaptasikan dengan dokumentasi target dan scope; pola bukan vulnerability target.",
        "term": "Workspace",
        "definition": "Area resource dan membership yang dikelola bersama.",
        "whyImportant": "Ownership dan role menentukan akses.",
        "relatedTerms": [
          "Tenant",
          "Role"
        ]
      },
      {
        "id": "saas-term-3",
        "title": "Role",
        "content": "Kelompok hak yang diberikan pada actor.",
        "sourceType": "domain",
        "source": "Pack riset generik lokal; bukan fakta perusahaan",
        "confidence": 0.8,
        "verified": false,
        "notes": "Adaptasikan dengan dokumentasi target dan scope; pola bukan vulnerability target.",
        "term": "Role",
        "definition": "Kelompok hak yang diberikan pada actor.",
        "whyImportant": "Nama role belum membuktikan permission efektif.",
        "relatedTerms": [
          "Authority",
          "Member"
        ]
      },
      {
        "id": "saas-term-4",
        "title": "Revocation",
        "content": "Pencabutan hak atau capability.",
        "sourceType": "domain",
        "source": "Pack riset generik lokal; bukan fakta perusahaan",
        "confidence": 0.8,
        "verified": false,
        "notes": "Adaptasikan dengan dokumentasi target dan scope; pola bukan vulnerability target.",
        "term": "Revocation",
        "definition": "Pencabutan hak atau capability.",
        "whyImportant": "Perubahan harus diperiksa pada surface yang relevan.",
        "relatedTerms": [
          "Role",
          "Session"
        ]
      },
      {
        "id": "saas-term-5",
        "title": "Export",
        "content": "Hasil pengambilan data untuk suatu context.",
        "sourceType": "domain",
        "source": "Pack riset generik lokal; bukan fakta perusahaan",
        "confidence": 0.8,
        "verified": false,
        "notes": "Adaptasikan dengan dokumentasi target dan scope; pola bukan vulnerability target.",
        "term": "Export",
        "definition": "Hasil pengambilan data untuk suatu context.",
        "whyImportant": "File/worker bisa memiliki lifecycle sendiri.",
        "relatedTerms": [
          "Resource",
          "Revocation"
        ]
      }
    ],
    "actors": [
      {
        "id": "saas-actor-1",
        "title": "Guest",
        "content": "Peran tipikal; hak efektif harus dikonfirmasi pada target.",
        "sourceType": "domain",
        "source": "Pack riset generik lokal; bukan fakta perusahaan",
        "confidence": 0.8,
        "verified": false,
        "notes": "Adaptasikan dengan dokumentasi target dan scope; pola bukan vulnerability target."
      },
      {
        "id": "saas-actor-2",
        "title": "User",
        "content": "Peran tipikal; hak efektif harus dikonfirmasi pada target.",
        "sourceType": "domain",
        "source": "Pack riset generik lokal; bukan fakta perusahaan",
        "confidence": 0.8,
        "verified": false,
        "notes": "Adaptasikan dengan dokumentasi target dan scope; pola bukan vulnerability target."
      },
      {
        "id": "saas-actor-3",
        "title": "Member",
        "content": "Peran tipikal; hak efektif harus dikonfirmasi pada target.",
        "sourceType": "domain",
        "source": "Pack riset generik lokal; bukan fakta perusahaan",
        "confidence": 0.8,
        "verified": false,
        "notes": "Adaptasikan dengan dokumentasi target dan scope; pola bukan vulnerability target."
      },
      {
        "id": "saas-actor-4",
        "title": "Manager",
        "content": "Peran tipikal; hak efektif harus dikonfirmasi pada target.",
        "sourceType": "domain",
        "source": "Pack riset generik lokal; bukan fakta perusahaan",
        "confidence": 0.8,
        "verified": false,
        "notes": "Adaptasikan dengan dokumentasi target dan scope; pola bukan vulnerability target."
      },
      {
        "id": "saas-actor-5",
        "title": "Admin",
        "content": "Peran tipikal; hak efektif harus dikonfirmasi pada target.",
        "sourceType": "domain",
        "source": "Pack riset generik lokal; bukan fakta perusahaan",
        "confidence": 0.8,
        "verified": false,
        "notes": "Adaptasikan dengan dokumentasi target dan scope; pola bukan vulnerability target."
      },
      {
        "id": "saas-actor-6",
        "title": "Owner",
        "content": "Peran tipikal; hak efektif harus dikonfirmasi pada target.",
        "sourceType": "domain",
        "source": "Pack riset generik lokal; bukan fakta perusahaan",
        "confidence": 0.8,
        "verified": false,
        "notes": "Adaptasikan dengan dokumentasi target dan scope; pola bukan vulnerability target."
      },
      {
        "id": "saas-actor-7",
        "title": "Organization",
        "content": "Peran tipikal; hak efektif harus dikonfirmasi pada target.",
        "sourceType": "domain",
        "source": "Pack riset generik lokal; bukan fakta perusahaan",
        "confidence": 0.8,
        "verified": false,
        "notes": "Adaptasikan dengan dokumentasi target dan scope; pola bukan vulnerability target."
      },
      {
        "id": "saas-actor-8",
        "title": "Service Account",
        "content": "Peran tipikal; hak efektif harus dikonfirmasi pada target.",
        "sourceType": "domain",
        "source": "Pack riset generik lokal; bukan fakta perusahaan",
        "confidence": 0.8,
        "verified": false,
        "notes": "Adaptasikan dengan dokumentasi target dan scope; pola bukan vulnerability target."
      }
    ],
    "businessObjects": [
      {
        "id": "saas-object-1",
        "title": "Workspace",
        "content": "Resource bisnis tipikal; ownership, state dan sensitivitas perlu dipetakan.",
        "sourceType": "domain",
        "source": "Pack riset generik lokal; bukan fakta perusahaan",
        "confidence": 0.8,
        "verified": false,
        "notes": "Adaptasikan dengan dokumentasi target dan scope; pola bukan vulnerability target."
      },
      {
        "id": "saas-object-2",
        "title": "Organization",
        "content": "Resource bisnis tipikal; ownership, state dan sensitivitas perlu dipetakan.",
        "sourceType": "domain",
        "source": "Pack riset generik lokal; bukan fakta perusahaan",
        "confidence": 0.8,
        "verified": false,
        "notes": "Adaptasikan dengan dokumentasi target dan scope; pola bukan vulnerability target."
      },
      {
        "id": "saas-object-3",
        "title": "Project",
        "content": "Resource bisnis tipikal; ownership, state dan sensitivitas perlu dipetakan.",
        "sourceType": "domain",
        "source": "Pack riset generik lokal; bukan fakta perusahaan",
        "confidence": 0.8,
        "verified": false,
        "notes": "Adaptasikan dengan dokumentasi target dan scope; pola bukan vulnerability target."
      },
      {
        "id": "saas-object-4",
        "title": "Resource",
        "content": "Resource bisnis tipikal; ownership, state dan sensitivitas perlu dipetakan.",
        "sourceType": "domain",
        "source": "Pack riset generik lokal; bukan fakta perusahaan",
        "confidence": 0.8,
        "verified": false,
        "notes": "Adaptasikan dengan dokumentasi target dan scope; pola bukan vulnerability target."
      },
      {
        "id": "saas-object-5",
        "title": "Invitation",
        "content": "Resource bisnis tipikal; ownership, state dan sensitivitas perlu dipetakan.",
        "sourceType": "domain",
        "source": "Pack riset generik lokal; bukan fakta perusahaan",
        "confidence": 0.8,
        "verified": false,
        "notes": "Adaptasikan dengan dokumentasi target dan scope; pola bukan vulnerability target."
      },
      {
        "id": "saas-object-6",
        "title": "Role",
        "content": "Resource bisnis tipikal; ownership, state dan sensitivitas perlu dipetakan.",
        "sourceType": "domain",
        "source": "Pack riset generik lokal; bukan fakta perusahaan",
        "confidence": 0.8,
        "verified": false,
        "notes": "Adaptasikan dengan dokumentasi target dan scope; pola bukan vulnerability target."
      },
      {
        "id": "saas-object-7",
        "title": "Export",
        "content": "Resource bisnis tipikal; ownership, state dan sensitivitas perlu dipetakan.",
        "sourceType": "domain",
        "source": "Pack riset generik lokal; bukan fakta perusahaan",
        "confidence": 0.8,
        "verified": false,
        "notes": "Adaptasikan dengan dokumentasi target dan scope; pola bukan vulnerability target."
      },
      {
        "id": "saas-object-8",
        "title": "Session",
        "content": "Resource bisnis tipikal; ownership, state dan sensitivitas perlu dipetakan.",
        "sourceType": "domain",
        "source": "Pack riset generik lokal; bukan fakta perusahaan",
        "confidence": 0.8,
        "verified": false,
        "notes": "Adaptasikan dengan dokumentasi target dan scope; pola bukan vulnerability target."
      }
    ],
    "businessFlows": [
      {
        "id": "saas-flow-1",
        "title": "SaaS — flow generik",
        "content": "Aplikasi sebagai layanan dengan organisasi, workspace dan resource; bentuk tenancy harus dikonfirmasi pada target.",
        "sourceType": "domain",
        "source": "Pack riset generik lokal; bukan fakta perusahaan",
        "confidence": 0.8,
        "verified": false,
        "notes": "Adaptasikan dengan dokumentasi target dan scope; pola bukan vulnerability target.",
        "steps": [
          "User",
          "Organization",
          "Workspace",
          "Resource",
          "Invite Member",
          "Assign Role",
          "Share Resource",
          "Revoke Access"
        ],
        "actorIds": [
          "saas-actor-1",
          "saas-actor-2",
          "saas-actor-3",
          "saas-actor-4",
          "saas-actor-5",
          "saas-actor-6",
          "saas-actor-7",
          "saas-actor-8"
        ],
        "objectIds": [
          "saas-object-1",
          "saas-object-2",
          "saas-object-3",
          "saas-object-4",
          "saas-object-5",
          "saas-object-6",
          "saas-object-7",
          "saas-object-8"
        ],
        "boundaryIds": [
          "saas-boundary-1"
        ],
        "invariantIds": [
          "saas-invariant-1",
          "saas-invariant-2",
          "saas-invariant-3",
          "saas-invariant-4"
        ],
        "transitions": [
          {
            "id": "saas-transition-1",
            "fromState": "User",
            "toState": "Organization",
            "action": "User → Organization",
            "critical": false,
            "invariantIds": [
              "saas-invariant-1",
              "saas-invariant-2",
              "saas-invariant-3",
              "saas-invariant-4"
            ]
          },
          {
            "id": "saas-transition-2",
            "fromState": "Organization",
            "toState": "Workspace",
            "action": "Organization → Workspace",
            "critical": false,
            "invariantIds": [
              "saas-invariant-1",
              "saas-invariant-2",
              "saas-invariant-3",
              "saas-invariant-4"
            ]
          },
          {
            "id": "saas-transition-3",
            "fromState": "Workspace",
            "toState": "Resource",
            "action": "Workspace → Resource",
            "critical": false,
            "invariantIds": [
              "saas-invariant-1",
              "saas-invariant-2",
              "saas-invariant-3",
              "saas-invariant-4"
            ]
          },
          {
            "id": "saas-transition-4",
            "fromState": "Resource",
            "toState": "Invite Member",
            "action": "Resource → Invite Member",
            "critical": false,
            "invariantIds": [
              "saas-invariant-1",
              "saas-invariant-2",
              "saas-invariant-3",
              "saas-invariant-4"
            ]
          },
          {
            "id": "saas-transition-5",
            "fromState": "Invite Member",
            "toState": "Assign Role",
            "action": "Invite Member → Assign Role",
            "critical": false,
            "invariantIds": [
              "saas-invariant-1",
              "saas-invariant-2",
              "saas-invariant-3",
              "saas-invariant-4"
            ]
          },
          {
            "id": "saas-transition-6",
            "fromState": "Assign Role",
            "toState": "Share Resource",
            "action": "Assign Role → Share Resource",
            "critical": true,
            "invariantIds": [
              "saas-invariant-1",
              "saas-invariant-2",
              "saas-invariant-3",
              "saas-invariant-4"
            ]
          },
          {
            "id": "saas-transition-7",
            "fromState": "Share Resource",
            "toState": "Revoke Access",
            "action": "Share Resource → Revoke Access",
            "critical": true,
            "invariantIds": [
              "saas-invariant-1",
              "saas-invariant-2",
              "saas-invariant-3",
              "saas-invariant-4"
            ]
          }
        ]
      }
    ],
    "sensitiveData": [
      {
        "id": "saas-sensitive-1",
        "title": "Private workspace resources",
        "content": "Kategori data generik SaaS; konfirmasi sensitivitas pada target dan gunakan data dummy/redaksi.",
        "sourceType": "domain",
        "source": "Pack riset generik lokal; bukan fakta perusahaan",
        "confidence": 0.8,
        "verified": false,
        "notes": "Adaptasikan dengan dokumentasi target dan scope; pola bukan vulnerability target."
      },
      {
        "id": "saas-sensitive-2",
        "title": "Membership and role assignments",
        "content": "Kategori data generik SaaS; konfirmasi sensitivitas pada target dan gunakan data dummy/redaksi.",
        "sourceType": "domain",
        "source": "Pack riset generik lokal; bukan fakta perusahaan",
        "confidence": 0.8,
        "verified": false,
        "notes": "Adaptasikan dengan dokumentasi target dan scope; pola bukan vulnerability target."
      },
      {
        "id": "saas-sensitive-3",
        "title": "Exports and session credentials",
        "content": "Kategori data generik SaaS; konfirmasi sensitivitas pada target dan gunakan data dummy/redaksi.",
        "sourceType": "domain",
        "source": "Pack riset generik lokal; bukan fakta perusahaan",
        "confidence": 0.8,
        "verified": false,
        "notes": "Adaptasikan dengan dokumentasi target dan scope; pola bukan vulnerability target."
      }
    ],
    "criticalAssets": [
      {
        "id": "saas-asset-1",
        "title": "Workspace",
        "content": "Nilai bisnis terkait integritas, ownership dan authority pada SaaS flow; bukan penilaian severity target.",
        "sourceType": "domain",
        "source": "Pack riset generik lokal; bukan fakta perusahaan",
        "confidence": 0.8,
        "verified": false,
        "notes": "Adaptasikan dengan dokumentasi target dan scope; pola bukan vulnerability target."
      },
      {
        "id": "saas-asset-2",
        "title": "Resource",
        "content": "Nilai bisnis terkait integritas, ownership dan authority pada SaaS flow; bukan penilaian severity target.",
        "sourceType": "domain",
        "source": "Pack riset generik lokal; bukan fakta perusahaan",
        "confidence": 0.8,
        "verified": false,
        "notes": "Adaptasikan dengan dokumentasi target dan scope; pola bukan vulnerability target."
      },
      {
        "id": "saas-asset-3",
        "title": "Role",
        "content": "Nilai bisnis terkait integritas, ownership dan authority pada SaaS flow; bukan penilaian severity target.",
        "sourceType": "domain",
        "source": "Pack riset generik lokal; bukan fakta perusahaan",
        "confidence": 0.8,
        "verified": false,
        "notes": "Adaptasikan dengan dokumentasi target dan scope; pola bukan vulnerability target."
      },
      {
        "id": "saas-asset-4",
        "title": "Export",
        "content": "Nilai bisnis terkait integritas, ownership dan authority pada SaaS flow; bukan penilaian severity target.",
        "sourceType": "domain",
        "source": "Pack riset generik lokal; bukan fakta perusahaan",
        "confidence": 0.8,
        "verified": false,
        "notes": "Adaptasikan dengan dokumentasi target dan scope; pola bukan vulnerability target."
      },
      {
        "id": "saas-asset-5",
        "title": "Session",
        "content": "Nilai bisnis terkait integritas, ownership dan authority pada SaaS flow; bukan penilaian severity target.",
        "sourceType": "domain",
        "source": "Pack riset generik lokal; bukan fakta perusahaan",
        "confidence": 0.8,
        "verified": false,
        "notes": "Adaptasikan dengan dokumentasi target dan scope; pola bukan vulnerability target."
      }
    ],
    "commonTrustBoundaries": [
      {
        "id": "saas-boundary-1",
        "title": "Authorization → Execution",
        "content": "Authority harus tetap sesuai ketika aksi terlindungi benar-benar dijalankan.",
        "sourceType": "domain",
        "source": "Pack riset generik lokal; bukan fakta perusahaan",
        "confidence": 0.8,
        "verified": false,
        "notes": "Adaptasikan dengan dokumentasi target dan scope; pola bukan vulnerability target.",
        "fromComponent": "User / Client",
        "toComponent": "Backend / Worker",
        "channel": "request / job",
        "authority": "Izin actor untuk object dan state yang berlaku",
        "flowId": "saas-flow-1"
      }
    ],
    "securityInvariants": [
      {
        "id": "saas-invariant-1",
        "title": "Workspace A tidak boleh mengakses resource Workspace B tanpa izin.",
        "content": "Workspace A tidak boleh mengakses resource Workspace B tanpa izin.",
        "sourceType": "domain",
        "source": "Pack riset generik lokal; bukan fakta perusahaan",
        "confidence": 0.8,
        "verified": false,
        "notes": "Adaptasikan dengan dokumentasi target dan scope; pola bukan vulnerability target.",
        "flowId": "saas-flow-1",
        "techniqueIds": [
          "tech_14"
        ]
      },
      {
        "id": "saas-invariant-2",
        "title": "Member yang dihapus harus kehilangan capability terlindungi sesuai kebijakan.",
        "content": "Member yang dihapus harus kehilangan capability terlindungi sesuai kebijakan.",
        "sourceType": "domain",
        "source": "Pack riset generik lokal; bukan fakta perusahaan",
        "confidence": 0.8,
        "verified": false,
        "notes": "Adaptasikan dengan dokumentasi target dan scope; pola bukan vulnerability target.",
        "flowId": "saas-flow-1",
        "techniqueIds": [
          "tech_17"
        ]
      },
      {
        "id": "saas-invariant-3",
        "title": "Viewer tidak boleh menjalankan operasi Owner.",
        "content": "Viewer tidak boleh menjalankan operasi Owner.",
        "sourceType": "domain",
        "source": "Pack riset generik lokal; bukan fakta perusahaan",
        "confidence": 0.8,
        "verified": false,
        "notes": "Adaptasikan dengan dokumentasi target dan scope; pola bukan vulnerability target.",
        "flowId": "saas-flow-1",
        "techniqueIds": [
          "tech_16"
        ]
      },
      {
        "id": "saas-invariant-4",
        "title": "Resource privat harus mengikuti perubahan state sharing.",
        "content": "Resource privat harus mengikuti perubahan state sharing.",
        "sourceType": "domain",
        "source": "Pack riset generik lokal; bukan fakta perusahaan",
        "confidence": 0.8,
        "verified": false,
        "notes": "Adaptasikan dengan dokumentasi target dan scope; pola bukan vulnerability target.",
        "flowId": "saas-flow-1",
        "techniqueIds": [
          "tech_07"
        ]
      }
    ],
    "commonFailurePatterns": [
      {
        "id": "saas-pattern-1",
        "title": "Authorization mismatch",
        "content": "Bandingkan authority efektif, owner, state dan context sebelum menyimpulkan kontrol gagal.",
        "sourceType": "domain",
        "source": "Pack riset generik lokal; bukan fakta perusahaan",
        "confidence": 0.8,
        "verified": false,
        "notes": "Adaptasikan dengan dokumentasi target dan scope; pola bukan vulnerability target."
      },
      {
        "id": "saas-pattern-2",
        "title": "Stale authorization",
        "content": "Pertanyaan generik: apakah authority lama masih dipakai setelah perubahan state?",
        "sourceType": "domain",
        "source": "Pack riset generik lokal; bukan fakta perusahaan",
        "confidence": 0.8,
        "verified": false,
        "notes": "Adaptasikan dengan dokumentasi target dan scope; pola bukan vulnerability target."
      },
      {
        "id": "saas-pattern-3",
        "title": "State desynchronization",
        "content": "Perbedaan state antarkomponen perlu kontrol timing dan evidence; belum tentu vulnerability.",
        "sourceType": "domain",
        "source": "Pack riset generik lokal; bukan fakta perusahaan",
        "confidence": 0.8,
        "verified": false,
        "notes": "Adaptasikan dengan dokumentasi target dan scope; pola bukan vulnerability target."
      }
    ],
    "relevantTechniques": [
      {
        "id": "saas-mapping-1",
        "title": "Technique tech_14",
        "content": "Tenant isolation: resource dan capability satu organisasi tidak memberi akses ke organisasi lain. Tinjau SaaS flow bersama invariant terkait; gunakan hanya scope yang diotorisasi.",
        "sourceType": "domain",
        "source": "Pack riset generik lokal; bukan fakta perusahaan",
        "confidence": 0.8,
        "verified": false,
        "notes": "Adaptasikan dengan dokumentasi target dan scope; pola bukan vulnerability target.",
        "techniqueId": "tech_14",
        "flowId": "saas-flow-1",
        "invariantId": "saas-invariant-1",
        "researchPriority": 60
      },
      {
        "id": "saas-mapping-2",
        "title": "Technique tech_17",
        "content": "Object ownership: actor harus berhak atas object, account atau record yang dirujuk pada flow. Tinjau SaaS flow bersama invariant terkait; gunakan hanya scope yang diotorisasi.",
        "sourceType": "domain",
        "source": "Pack riset generik lokal; bukan fakta perusahaan",
        "confidence": 0.8,
        "verified": false,
        "notes": "Adaptasikan dengan dokumentasi target dan scope; pola bukan vulnerability target.",
        "techniqueId": "tech_17",
        "flowId": "saas-flow-1",
        "invariantId": "saas-invariant-2",
        "researchPriority": 70
      },
      {
        "id": "saas-mapping-3",
        "title": "Technique tech_16",
        "content": "Vertical authority: operasi privilege tinggi harus menolak actor tanpa hak efektif yang sesuai. Tinjau SaaS flow bersama invariant terkait; gunakan hanya scope yang diotorisasi.",
        "sourceType": "domain",
        "source": "Pack riset generik lokal; bukan fakta perusahaan",
        "confidence": 0.8,
        "verified": false,
        "notes": "Adaptasikan dengan dokumentasi target dan scope; pola bukan vulnerability target.",
        "techniqueId": "tech_16",
        "flowId": "saas-flow-1",
        "invariantId": "saas-invariant-3",
        "researchPriority": 80
      },
      {
        "id": "saas-mapping-4",
        "title": "Technique tech_07",
        "content": "Revocation/lifecycle: periksa capability dan resource turunan setelah izin, membership atau credential dicabut. Tinjau SaaS flow bersama invariant terkait; gunakan hanya scope yang diotorisasi.",
        "sourceType": "domain",
        "source": "Pack riset generik lokal; bukan fakta perusahaan",
        "confidence": 0.8,
        "verified": false,
        "notes": "Adaptasikan dengan dokumentasi target dan scope; pola bukan vulnerability target.",
        "techniqueId": "tech_07",
        "flowId": "saas-flow-1",
        "invariantId": "saas-invariant-4",
        "researchPriority": 60
      },
      {
        "id": "saas-mapping-5",
        "title": "Technique tech_15",
        "content": "File/share/export: salinan, link dan export harus mempertahankan ownership serta perubahan akses. Tinjau SaaS flow bersama invariant terkait; gunakan hanya scope yang diotorisasi.",
        "sourceType": "domain",
        "source": "Pack riset generik lokal; bukan fakta perusahaan",
        "confidence": 0.8,
        "verified": false,
        "notes": "Adaptasikan dengan dokumentasi target dan scope; pola bukan vulnerability target.",
        "techniqueId": "tech_15",
        "flowId": "saas-flow-1",
        "invariantId": "saas-invariant-1",
        "researchPriority": 70
      }
    ],
    "researchQuestions": [
      {
        "id": "saas-question-1",
        "title": "Bagaimana memastikan: Workspace A tidak boleh mengakses resource Workspace B tanpa izin.",
        "content": "Workspace A tidak boleh mengakses resource Workspace B tanpa izin. Apa expected behavior jika owner, authority atau state berubah sebelum execution; apa evidence yang membedakan kontrol efektif dari pelanggaran?",
        "sourceType": "domain",
        "source": "Pack riset generik lokal; bukan fakta perusahaan",
        "confidence": 0.8,
        "verified": false,
        "notes": "Adaptasikan dengan dokumentasi target dan scope; pola bukan vulnerability target.",
        "flowId": "saas-flow-1",
        "invariantId": "saas-invariant-1",
        "techniqueId": "tech_14"
      },
      {
        "id": "saas-question-2",
        "title": "Bagaimana memastikan: Member yang dihapus harus kehilangan capability terlindungi sesuai kebijakan.",
        "content": "Member yang dihapus harus kehilangan capability terlindungi sesuai kebijakan. Apa expected behavior jika owner, authority atau state berubah sebelum execution; apa evidence yang membedakan kontrol efektif dari pelanggaran?",
        "sourceType": "domain",
        "source": "Pack riset generik lokal; bukan fakta perusahaan",
        "confidence": 0.8,
        "verified": false,
        "notes": "Adaptasikan dengan dokumentasi target dan scope; pola bukan vulnerability target.",
        "flowId": "saas-flow-1",
        "invariantId": "saas-invariant-2",
        "techniqueId": "tech_17"
      },
      {
        "id": "saas-question-3",
        "title": "Bagaimana memastikan: Viewer tidak boleh menjalankan operasi Owner.",
        "content": "Viewer tidak boleh menjalankan operasi Owner. Apa expected behavior jika owner, authority atau state berubah sebelum execution; apa evidence yang membedakan kontrol efektif dari pelanggaran?",
        "sourceType": "domain",
        "source": "Pack riset generik lokal; bukan fakta perusahaan",
        "confidence": 0.8,
        "verified": false,
        "notes": "Adaptasikan dengan dokumentasi target dan scope; pola bukan vulnerability target.",
        "flowId": "saas-flow-1",
        "invariantId": "saas-invariant-3",
        "techniqueId": "tech_16"
      },
      {
        "id": "saas-question-4",
        "title": "Bagaimana memastikan: Resource privat harus mengikuti perubahan state sharing.",
        "content": "Resource privat harus mengikuti perubahan state sharing. Apa expected behavior jika owner, authority atau state berubah sebelum execution; apa evidence yang membedakan kontrol efektif dari pelanggaran?",
        "sourceType": "domain",
        "source": "Pack riset generik lokal; bukan fakta perusahaan",
        "confidence": 0.8,
        "verified": false,
        "notes": "Adaptasikan dengan dokumentasi target dan scope; pola bukan vulnerability target.",
        "flowId": "saas-flow-1",
        "invariantId": "saas-invariant-4",
        "techniqueId": "tech_07"
      }
    ],
    "references": [
      {
        "title": "NIST SP 800-145 — cloud service models",
        "url": "https://www.nist.gov/publications/nist-definition-cloud-computing",
        "notes": "Referensi model layanan; mapping kontrol adalah pola riset generik."
      }
    ]
  },
  {
    "id": "social-media",
    "name": "Social Platform",
    "description": "Interaksi pengguna, posting, sharing, moderasi, dan pesan.",
    "notes": "Contoh pembelajaran; bukan klaim tentang perusahaan atau izin testing.",
    "provenance": {
      "sourceType": "domain",
      "source": "Pack riset generik lokal; bukan fakta perusahaan",
      "confidence": 0.8,
      "verified": false,
      "notes": "Adaptasikan dengan dokumentasi target dan scope; pola bukan vulnerability target."
    },
    "coreConcepts": [
      "Visibility resource",
      "Membership dan moderasi",
      "Identitas dan relasi pengguna"
    ],
    "terminology": [
      {
        "id": "social-media-term-1",
        "title": "Visibility",
        "content": "Aturan siapa dapat melihat suatu resource.",
        "sourceType": "domain",
        "source": "Pack riset generik lokal; bukan fakta perusahaan",
        "confidence": 0.8,
        "verified": false,
        "notes": "Adaptasikan dengan dokumentasi target dan scope; pola bukan vulnerability target.",
        "term": "Visibility",
        "definition": "Aturan siapa dapat melihat suatu resource.",
        "whyImportant": "Perubahan sharing bukan sekadar state UI.",
        "relatedTerms": [
          "Post",
          "Group"
        ]
      },
      {
        "id": "social-media-term-2",
        "title": "Moderation",
        "content": "Aksi mengatur konten/pengguna dalam context komunitas.",
        "sourceType": "domain",
        "source": "Pack riset generik lokal; bukan fakta perusahaan",
        "confidence": 0.8,
        "verified": false,
        "notes": "Adaptasikan dengan dokumentasi target dan scope; pola bukan vulnerability target.",
        "term": "Moderation",
        "definition": "Aksi mengatur konten/pengguna dalam context komunitas.",
        "whyImportant": "Authority moderator perlu terikat context.",
        "relatedTerms": [
          "Role",
          "Group"
        ]
      },
      {
        "id": "social-media-term-3",
        "title": "Direct Message",
        "content": "Pesan dengan penerima dan akses terbatas menurut produk.",
        "sourceType": "domain",
        "source": "Pack riset generik lokal; bukan fakta perusahaan",
        "confidence": 0.8,
        "verified": false,
        "notes": "Adaptasikan dengan dokumentasi target dan scope; pola bukan vulnerability target.",
        "term": "Direct Message",
        "definition": "Pesan dengan penerima dan akses terbatas menurut produk.",
        "whyImportant": "Ownership/penerima harus jelas.",
        "relatedTerms": [
          "User",
          "Message"
        ]
      }
    ],
    "actors": [
      {
        "id": "social-media-actor-1",
        "title": "User",
        "content": "Peran tipikal; hak efektif harus dikonfirmasi pada target.",
        "sourceType": "domain",
        "source": "Pack riset generik lokal; bukan fakta perusahaan",
        "confidence": 0.8,
        "verified": false,
        "notes": "Adaptasikan dengan dokumentasi target dan scope; pola bukan vulnerability target."
      },
      {
        "id": "social-media-actor-2",
        "title": "Follower",
        "content": "Peran tipikal; hak efektif harus dikonfirmasi pada target.",
        "sourceType": "domain",
        "source": "Pack riset generik lokal; bukan fakta perusahaan",
        "confidence": 0.8,
        "verified": false,
        "notes": "Adaptasikan dengan dokumentasi target dan scope; pola bukan vulnerability target."
      },
      {
        "id": "social-media-actor-3",
        "title": "Group Member",
        "content": "Peran tipikal; hak efektif harus dikonfirmasi pada target.",
        "sourceType": "domain",
        "source": "Pack riset generik lokal; bukan fakta perusahaan",
        "confidence": 0.8,
        "verified": false,
        "notes": "Adaptasikan dengan dokumentasi target dan scope; pola bukan vulnerability target."
      },
      {
        "id": "social-media-actor-4",
        "title": "Moderator",
        "content": "Peran tipikal; hak efektif harus dikonfirmasi pada target.",
        "sourceType": "domain",
        "source": "Pack riset generik lokal; bukan fakta perusahaan",
        "confidence": 0.8,
        "verified": false,
        "notes": "Adaptasikan dengan dokumentasi target dan scope; pola bukan vulnerability target."
      },
      {
        "id": "social-media-actor-5",
        "title": "Creator",
        "content": "Peran tipikal; hak efektif harus dikonfirmasi pada target.",
        "sourceType": "domain",
        "source": "Pack riset generik lokal; bukan fakta perusahaan",
        "confidence": 0.8,
        "verified": false,
        "notes": "Adaptasikan dengan dokumentasi target dan scope; pola bukan vulnerability target."
      },
      {
        "id": "social-media-actor-6",
        "title": "Administrator",
        "content": "Peran tipikal; hak efektif harus dikonfirmasi pada target.",
        "sourceType": "domain",
        "source": "Pack riset generik lokal; bukan fakta perusahaan",
        "confidence": 0.8,
        "verified": false,
        "notes": "Adaptasikan dengan dokumentasi target dan scope; pola bukan vulnerability target."
      },
      {
        "id": "social-media-actor-7",
        "title": "API Client",
        "content": "Peran tipikal; hak efektif harus dikonfirmasi pada target.",
        "sourceType": "domain",
        "source": "Pack riset generik lokal; bukan fakta perusahaan",
        "confidence": 0.8,
        "verified": false,
        "notes": "Adaptasikan dengan dokumentasi target dan scope; pola bukan vulnerability target."
      }
    ],
    "businessObjects": [
      {
        "id": "social-media-object-1",
        "title": "Profile",
        "content": "Resource bisnis tipikal; ownership, state dan sensitivitas perlu dipetakan.",
        "sourceType": "domain",
        "source": "Pack riset generik lokal; bukan fakta perusahaan",
        "confidence": 0.8,
        "verified": false,
        "notes": "Adaptasikan dengan dokumentasi target dan scope; pola bukan vulnerability target."
      },
      {
        "id": "social-media-object-2",
        "title": "Post",
        "content": "Resource bisnis tipikal; ownership, state dan sensitivitas perlu dipetakan.",
        "sourceType": "domain",
        "source": "Pack riset generik lokal; bukan fakta perusahaan",
        "confidence": 0.8,
        "verified": false,
        "notes": "Adaptasikan dengan dokumentasi target dan scope; pola bukan vulnerability target."
      },
      {
        "id": "social-media-object-3",
        "title": "Message",
        "content": "Resource bisnis tipikal; ownership, state dan sensitivitas perlu dipetakan.",
        "sourceType": "domain",
        "source": "Pack riset generik lokal; bukan fakta perusahaan",
        "confidence": 0.8,
        "verified": false,
        "notes": "Adaptasikan dengan dokumentasi target dan scope; pola bukan vulnerability target."
      },
      {
        "id": "social-media-object-4",
        "title": "Group",
        "content": "Resource bisnis tipikal; ownership, state dan sensitivitas perlu dipetakan.",
        "sourceType": "domain",
        "source": "Pack riset generik lokal; bukan fakta perusahaan",
        "confidence": 0.8,
        "verified": false,
        "notes": "Adaptasikan dengan dokumentasi target dan scope; pola bukan vulnerability target."
      },
      {
        "id": "social-media-object-5",
        "title": "Media",
        "content": "Resource bisnis tipikal; ownership, state dan sensitivitas perlu dipetakan.",
        "sourceType": "domain",
        "source": "Pack riset generik lokal; bukan fakta perusahaan",
        "confidence": 0.8,
        "verified": false,
        "notes": "Adaptasikan dengan dokumentasi target dan scope; pola bukan vulnerability target."
      },
      {
        "id": "social-media-object-6",
        "title": "Invitation",
        "content": "Resource bisnis tipikal; ownership, state dan sensitivitas perlu dipetakan.",
        "sourceType": "domain",
        "source": "Pack riset generik lokal; bukan fakta perusahaan",
        "confidence": 0.8,
        "verified": false,
        "notes": "Adaptasikan dengan dokumentasi target dan scope; pola bukan vulnerability target."
      },
      {
        "id": "social-media-object-7",
        "title": "Moderation Action",
        "content": "Resource bisnis tipikal; ownership, state dan sensitivitas perlu dipetakan.",
        "sourceType": "domain",
        "source": "Pack riset generik lokal; bukan fakta perusahaan",
        "confidence": 0.8,
        "verified": false,
        "notes": "Adaptasikan dengan dokumentasi target dan scope; pola bukan vulnerability target."
      },
      {
        "id": "social-media-object-8",
        "title": "Session",
        "content": "Resource bisnis tipikal; ownership, state dan sensitivitas perlu dipetakan.",
        "sourceType": "domain",
        "source": "Pack riset generik lokal; bukan fakta perusahaan",
        "confidence": 0.8,
        "verified": false,
        "notes": "Adaptasikan dengan dokumentasi target dan scope; pola bukan vulnerability target."
      }
    ],
    "businessFlows": [
      {
        "id": "social-media-flow-1",
        "title": "Social Platform — flow generik",
        "content": "Interaksi pengguna, posting, sharing, moderasi, dan pesan.",
        "sourceType": "domain",
        "source": "Pack riset generik lokal; bukan fakta perusahaan",
        "confidence": 0.8,
        "verified": false,
        "notes": "Adaptasikan dengan dokumentasi target dan scope; pola bukan vulnerability target.",
        "steps": [
          "User",
          "Create Content",
          "Set Visibility",
          "Share",
          "Join Group",
          "Moderate",
          "Remove Access"
        ],
        "actorIds": [
          "social-media-actor-1",
          "social-media-actor-2",
          "social-media-actor-3",
          "social-media-actor-4",
          "social-media-actor-5",
          "social-media-actor-6",
          "social-media-actor-7"
        ],
        "objectIds": [
          "social-media-object-1",
          "social-media-object-2",
          "social-media-object-3",
          "social-media-object-4",
          "social-media-object-5",
          "social-media-object-6",
          "social-media-object-7",
          "social-media-object-8"
        ],
        "boundaryIds": [
          "social-media-boundary-1"
        ],
        "invariantIds": [
          "social-media-invariant-1",
          "social-media-invariant-2",
          "social-media-invariant-3"
        ],
        "transitions": [
          {
            "id": "social-media-transition-1",
            "fromState": "User",
            "toState": "Create Content",
            "action": "User → Create Content",
            "critical": false,
            "invariantIds": [
              "social-media-invariant-1",
              "social-media-invariant-2",
              "social-media-invariant-3"
            ]
          },
          {
            "id": "social-media-transition-2",
            "fromState": "Create Content",
            "toState": "Set Visibility",
            "action": "Create Content → Set Visibility",
            "critical": false,
            "invariantIds": [
              "social-media-invariant-1",
              "social-media-invariant-2",
              "social-media-invariant-3"
            ]
          },
          {
            "id": "social-media-transition-3",
            "fromState": "Set Visibility",
            "toState": "Share",
            "action": "Set Visibility → Share",
            "critical": true,
            "invariantIds": [
              "social-media-invariant-1",
              "social-media-invariant-2",
              "social-media-invariant-3"
            ]
          },
          {
            "id": "social-media-transition-4",
            "fromState": "Share",
            "toState": "Join Group",
            "action": "Share → Join Group",
            "critical": true,
            "invariantIds": [
              "social-media-invariant-1",
              "social-media-invariant-2",
              "social-media-invariant-3"
            ]
          },
          {
            "id": "social-media-transition-5",
            "fromState": "Join Group",
            "toState": "Moderate",
            "action": "Join Group → Moderate",
            "critical": false,
            "invariantIds": [
              "social-media-invariant-1",
              "social-media-invariant-2",
              "social-media-invariant-3"
            ]
          },
          {
            "id": "social-media-transition-6",
            "fromState": "Moderate",
            "toState": "Remove Access",
            "action": "Moderate → Remove Access",
            "critical": false,
            "invariantIds": [
              "social-media-invariant-1",
              "social-media-invariant-2",
              "social-media-invariant-3"
            ]
          }
        ]
      }
    ],
    "sensitiveData": [
      {
        "id": "social-media-sensitive-1",
        "title": "Private messages and restricted media",
        "content": "Kategori data generik Social Platform; konfirmasi sensitivitas pada target dan gunakan data dummy/redaksi.",
        "sourceType": "domain",
        "source": "Pack riset generik lokal; bukan fakta perusahaan",
        "confidence": 0.8,
        "verified": false,
        "notes": "Adaptasikan dengan dokumentasi target dan scope; pola bukan vulnerability target."
      },
      {
        "id": "social-media-sensitive-2",
        "title": "Identity and account-linking records",
        "content": "Kategori data generik Social Platform; konfirmasi sensitivitas pada target dan gunakan data dummy/redaksi.",
        "sourceType": "domain",
        "source": "Pack riset generik lokal; bukan fakta perusahaan",
        "confidence": 0.8,
        "verified": false,
        "notes": "Adaptasikan dengan dokumentasi target dan scope; pola bukan vulnerability target."
      },
      {
        "id": "social-media-sensitive-3",
        "title": "Group membership and moderation records",
        "content": "Kategori data generik Social Platform; konfirmasi sensitivitas pada target dan gunakan data dummy/redaksi.",
        "sourceType": "domain",
        "source": "Pack riset generik lokal; bukan fakta perusahaan",
        "confidence": 0.8,
        "verified": false,
        "notes": "Adaptasikan dengan dokumentasi target dan scope; pola bukan vulnerability target."
      }
    ],
    "criticalAssets": [
      {
        "id": "social-media-asset-1",
        "title": "Message",
        "content": "Nilai bisnis terkait integritas, ownership dan authority pada Social Platform flow; bukan penilaian severity target.",
        "sourceType": "domain",
        "source": "Pack riset generik lokal; bukan fakta perusahaan",
        "confidence": 0.8,
        "verified": false,
        "notes": "Adaptasikan dengan dokumentasi target dan scope; pola bukan vulnerability target."
      },
      {
        "id": "social-media-asset-2",
        "title": "Media",
        "content": "Nilai bisnis terkait integritas, ownership dan authority pada Social Platform flow; bukan penilaian severity target.",
        "sourceType": "domain",
        "source": "Pack riset generik lokal; bukan fakta perusahaan",
        "confidence": 0.8,
        "verified": false,
        "notes": "Adaptasikan dengan dokumentasi target dan scope; pola bukan vulnerability target."
      },
      {
        "id": "social-media-asset-3",
        "title": "Group",
        "content": "Nilai bisnis terkait integritas, ownership dan authority pada Social Platform flow; bukan penilaian severity target.",
        "sourceType": "domain",
        "source": "Pack riset generik lokal; bukan fakta perusahaan",
        "confidence": 0.8,
        "verified": false,
        "notes": "Adaptasikan dengan dokumentasi target dan scope; pola bukan vulnerability target."
      },
      {
        "id": "social-media-asset-4",
        "title": "Moderation Action",
        "content": "Nilai bisnis terkait integritas, ownership dan authority pada Social Platform flow; bukan penilaian severity target.",
        "sourceType": "domain",
        "source": "Pack riset generik lokal; bukan fakta perusahaan",
        "confidence": 0.8,
        "verified": false,
        "notes": "Adaptasikan dengan dokumentasi target dan scope; pola bukan vulnerability target."
      },
      {
        "id": "social-media-asset-5",
        "title": "Session",
        "content": "Nilai bisnis terkait integritas, ownership dan authority pada Social Platform flow; bukan penilaian severity target.",
        "sourceType": "domain",
        "source": "Pack riset generik lokal; bukan fakta perusahaan",
        "confidence": 0.8,
        "verified": false,
        "notes": "Adaptasikan dengan dokumentasi target dan scope; pola bukan vulnerability target."
      }
    ],
    "commonTrustBoundaries": [
      {
        "id": "social-media-boundary-1",
        "title": "Authorization → Execution",
        "content": "Authority harus tetap sesuai ketika aksi terlindungi benar-benar dijalankan.",
        "sourceType": "domain",
        "source": "Pack riset generik lokal; bukan fakta perusahaan",
        "confidence": 0.8,
        "verified": false,
        "notes": "Adaptasikan dengan dokumentasi target dan scope; pola bukan vulnerability target.",
        "fromComponent": "User / Client",
        "toComponent": "Backend / Worker",
        "channel": "request / job",
        "authority": "Izin actor untuk object dan state yang berlaku",
        "flowId": "social-media-flow-1"
      }
    ],
    "securityInvariants": [
      {
        "id": "social-media-invariant-1",
        "title": "Konten privat harus mengikuti visibility dan membership terkini.",
        "content": "Konten privat harus mengikuti visibility dan membership terkini.",
        "sourceType": "domain",
        "source": "Pack riset generik lokal; bukan fakta perusahaan",
        "confidence": 0.8,
        "verified": false,
        "notes": "Adaptasikan dengan dokumentasi target dan scope; pola bukan vulnerability target.",
        "flowId": "social-media-flow-1",
        "techniqueIds": [
          "tech_17"
        ]
      },
      {
        "id": "social-media-invariant-2",
        "title": "Moderator hanya boleh melakukan aksi dalam context authority yang diberikan.",
        "content": "Moderator hanya boleh melakukan aksi dalam context authority yang diberikan.",
        "sourceType": "domain",
        "source": "Pack riset generik lokal; bukan fakta perusahaan",
        "confidence": 0.8,
        "verified": false,
        "notes": "Adaptasikan dengan dokumentasi target dan scope; pola bukan vulnerability target.",
        "flowId": "social-media-flow-1",
        "techniqueIds": [
          "tech_16"
        ]
      },
      {
        "id": "social-media-invariant-3",
        "title": "Identity/account linking harus tetap terikat pada akun yang benar.",
        "content": "Identity/account linking harus tetap terikat pada akun yang benar.",
        "sourceType": "domain",
        "source": "Pack riset generik lokal; bukan fakta perusahaan",
        "confidence": 0.8,
        "verified": false,
        "notes": "Adaptasikan dengan dokumentasi target dan scope; pola bukan vulnerability target.",
        "flowId": "social-media-flow-1",
        "techniqueIds": [
          "tech_07"
        ]
      }
    ],
    "commonFailurePatterns": [
      {
        "id": "social-media-pattern-1",
        "title": "Authorization mismatch",
        "content": "Bandingkan authority efektif, owner, state dan context sebelum menyimpulkan kontrol gagal.",
        "sourceType": "domain",
        "source": "Pack riset generik lokal; bukan fakta perusahaan",
        "confidence": 0.8,
        "verified": false,
        "notes": "Adaptasikan dengan dokumentasi target dan scope; pola bukan vulnerability target."
      },
      {
        "id": "social-media-pattern-2",
        "title": "Stale authorization",
        "content": "Pertanyaan generik: apakah authority lama masih dipakai setelah perubahan state?",
        "sourceType": "domain",
        "source": "Pack riset generik lokal; bukan fakta perusahaan",
        "confidence": 0.8,
        "verified": false,
        "notes": "Adaptasikan dengan dokumentasi target dan scope; pola bukan vulnerability target."
      },
      {
        "id": "social-media-pattern-3",
        "title": "State desynchronization",
        "content": "Perbedaan state antarkomponen perlu kontrol timing dan evidence; belum tentu vulnerability.",
        "sourceType": "domain",
        "source": "Pack riset generik lokal; bukan fakta perusahaan",
        "confidence": 0.8,
        "verified": false,
        "notes": "Adaptasikan dengan dokumentasi target dan scope; pola bukan vulnerability target."
      }
    ],
    "relevantTechniques": [
      {
        "id": "social-media-mapping-1",
        "title": "Technique tech_17",
        "content": "Object ownership: actor harus berhak atas object, account atau record yang dirujuk pada flow. Tinjau Social Platform flow bersama invariant terkait; gunakan hanya scope yang diotorisasi.",
        "sourceType": "domain",
        "source": "Pack riset generik lokal; bukan fakta perusahaan",
        "confidence": 0.8,
        "verified": false,
        "notes": "Adaptasikan dengan dokumentasi target dan scope; pola bukan vulnerability target.",
        "techniqueId": "tech_17",
        "flowId": "social-media-flow-1",
        "invariantId": "social-media-invariant-1",
        "researchPriority": 60
      },
      {
        "id": "social-media-mapping-2",
        "title": "Technique tech_16",
        "content": "Vertical authority: operasi privilege tinggi harus menolak actor tanpa hak efektif yang sesuai. Tinjau Social Platform flow bersama invariant terkait; gunakan hanya scope yang diotorisasi.",
        "sourceType": "domain",
        "source": "Pack riset generik lokal; bukan fakta perusahaan",
        "confidence": 0.8,
        "verified": false,
        "notes": "Adaptasikan dengan dokumentasi target dan scope; pola bukan vulnerability target.",
        "techniqueId": "tech_16",
        "flowId": "social-media-flow-1",
        "invariantId": "social-media-invariant-2",
        "researchPriority": 70
      },
      {
        "id": "social-media-mapping-3",
        "title": "Technique tech_07",
        "content": "Revocation/lifecycle: periksa capability dan resource turunan setelah izin, membership atau credential dicabut. Tinjau Social Platform flow bersama invariant terkait; gunakan hanya scope yang diotorisasi.",
        "sourceType": "domain",
        "source": "Pack riset generik lokal; bukan fakta perusahaan",
        "confidence": 0.8,
        "verified": false,
        "notes": "Adaptasikan dengan dokumentasi target dan scope; pola bukan vulnerability target.",
        "techniqueId": "tech_07",
        "flowId": "social-media-flow-1",
        "invariantId": "social-media-invariant-3",
        "researchPriority": 80
      },
      {
        "id": "social-media-mapping-4",
        "title": "Technique tech_10",
        "content": "Realtime authorization: subscription/socket perlu mengikuti perubahan visibility, membership dan authority. Tinjau Social Platform flow bersama invariant terkait; gunakan hanya scope yang diotorisasi.",
        "sourceType": "domain",
        "source": "Pack riset generik lokal; bukan fakta perusahaan",
        "confidence": 0.8,
        "verified": false,
        "notes": "Adaptasikan dengan dokumentasi target dan scope; pola bukan vulnerability target.",
        "techniqueId": "tech_10",
        "flowId": "social-media-flow-1",
        "invariantId": "social-media-invariant-1",
        "researchPriority": 60
      },
      {
        "id": "social-media-mapping-5",
        "title": "Technique tech_13",
        "content": "Account linking: identitas dan consent harus terikat pada akun serta recipient yang benar. Tinjau Social Platform flow bersama invariant terkait; gunakan hanya scope yang diotorisasi.",
        "sourceType": "domain",
        "source": "Pack riset generik lokal; bukan fakta perusahaan",
        "confidence": 0.8,
        "verified": false,
        "notes": "Adaptasikan dengan dokumentasi target dan scope; pola bukan vulnerability target.",
        "techniqueId": "tech_13",
        "flowId": "social-media-flow-1",
        "invariantId": "social-media-invariant-2",
        "researchPriority": 70
      }
    ],
    "researchQuestions": [
      {
        "id": "social-media-question-1",
        "title": "Bagaimana memastikan: Konten privat harus mengikuti visibility dan membership terkini.",
        "content": "Konten privat harus mengikuti visibility dan membership terkini. Apa expected behavior jika owner, authority atau state berubah sebelum execution; apa evidence yang membedakan kontrol efektif dari pelanggaran?",
        "sourceType": "domain",
        "source": "Pack riset generik lokal; bukan fakta perusahaan",
        "confidence": 0.8,
        "verified": false,
        "notes": "Adaptasikan dengan dokumentasi target dan scope; pola bukan vulnerability target.",
        "flowId": "social-media-flow-1",
        "invariantId": "social-media-invariant-1",
        "techniqueId": "tech_17"
      },
      {
        "id": "social-media-question-2",
        "title": "Bagaimana memastikan: Moderator hanya boleh melakukan aksi dalam context authority yang diberikan.",
        "content": "Moderator hanya boleh melakukan aksi dalam context authority yang diberikan. Apa expected behavior jika owner, authority atau state berubah sebelum execution; apa evidence yang membedakan kontrol efektif dari pelanggaran?",
        "sourceType": "domain",
        "source": "Pack riset generik lokal; bukan fakta perusahaan",
        "confidence": 0.8,
        "verified": false,
        "notes": "Adaptasikan dengan dokumentasi target dan scope; pola bukan vulnerability target.",
        "flowId": "social-media-flow-1",
        "invariantId": "social-media-invariant-2",
        "techniqueId": "tech_16"
      },
      {
        "id": "social-media-question-3",
        "title": "Bagaimana memastikan: Identity/account linking harus tetap terikat pada akun yang benar.",
        "content": "Identity/account linking harus tetap terikat pada akun yang benar. Apa expected behavior jika owner, authority atau state berubah sebelum execution; apa evidence yang membedakan kontrol efektif dari pelanggaran?",
        "sourceType": "domain",
        "source": "Pack riset generik lokal; bukan fakta perusahaan",
        "confidence": 0.8,
        "verified": false,
        "notes": "Adaptasikan dengan dokumentasi target dan scope; pola bukan vulnerability target.",
        "flowId": "social-media-flow-1",
        "invariantId": "social-media-invariant-3",
        "techniqueId": "tech_07"
      }
    ],
    "references": []
  },
  {
    "id": "telecommunication",
    "name": "Telecommunication",
    "description": "Pengelolaan subscriber, layanan konektivitas dan provisioning.",
    "notes": "Contoh pembelajaran; bukan klaim tentang perusahaan atau izin testing.",
    "provenance": {
      "sourceType": "domain",
      "source": "Pack riset generik lokal; bukan fakta perusahaan",
      "confidence": 0.8,
      "verified": false,
      "notes": "Adaptasikan dengan dokumentasi target dan scope; pola bukan vulnerability target."
    },
    "coreConcepts": [
      "Subscriber identity",
      "Provisioning state",
      "Delegasi operator"
    ],
    "terminology": [
      {
        "id": "telecommunication-term-1",
        "title": "Provisioning",
        "content": "Proses mengonfigurasi atau menyediakan layanan/resource.",
        "sourceType": "domain",
        "source": "Pack riset generik lokal; bukan fakta perusahaan",
        "confidence": 0.8,
        "verified": false,
        "notes": "Adaptasikan dengan dokumentasi target dan scope; pola bukan vulnerability target.",
        "term": "Provisioning",
        "definition": "Proses mengonfigurasi atau menyediakan layanan/resource.",
        "whyImportant": "Job dapat berjalan setelah keputusan izin awal.",
        "relatedTerms": [
          "Subscription",
          "Activation"
        ]
      },
      {
        "id": "telecommunication-term-2",
        "title": "Subscriber",
        "content": "Identitas pelanggan yang memperoleh layanan.",
        "sourceType": "domain",
        "source": "Pack riset generik lokal; bukan fakta perusahaan",
        "confidence": 0.8,
        "verified": false,
        "notes": "Adaptasikan dengan dokumentasi target dan scope; pola bukan vulnerability target.",
        "term": "Subscriber",
        "definition": "Identitas pelanggan yang memperoleh layanan.",
        "whyImportant": "Bedakan subscriber, pengguna dan owner account.",
        "relatedTerms": [
          "Account",
          "Subscription"
        ]
      },
      {
        "id": "telecommunication-term-3",
        "title": "Usage Record",
        "content": "Catatan penggunaan layanan.",
        "sourceType": "domain",
        "source": "Pack riset generik lokal; bukan fakta perusahaan",
        "confidence": 0.8,
        "verified": false,
        "notes": "Adaptasikan dengan dokumentasi target dan scope; pola bukan vulnerability target.",
        "term": "Usage Record",
        "definition": "Catatan penggunaan layanan.",
        "whyImportant": "Dapat mengandung metadata sensitif.",
        "relatedTerms": [
          "Billing",
          "Subscriber"
        ]
      }
    ],
    "actors": [
      {
        "id": "telecommunication-actor-1",
        "title": "Subscriber",
        "content": "Peran tipikal; hak efektif harus dikonfirmasi pada target.",
        "sourceType": "domain",
        "source": "Pack riset generik lokal; bukan fakta perusahaan",
        "confidence": 0.8,
        "verified": false,
        "notes": "Adaptasikan dengan dokumentasi target dan scope; pola bukan vulnerability target."
      },
      {
        "id": "telecommunication-actor-2",
        "title": "Account Owner",
        "content": "Peran tipikal; hak efektif harus dikonfirmasi pada target.",
        "sourceType": "domain",
        "source": "Pack riset generik lokal; bukan fakta perusahaan",
        "confidence": 0.8,
        "verified": false,
        "notes": "Adaptasikan dengan dokumentasi target dan scope; pola bukan vulnerability target."
      },
      {
        "id": "telecommunication-actor-3",
        "title": "Operator",
        "content": "Peran tipikal; hak efektif harus dikonfirmasi pada target.",
        "sourceType": "domain",
        "source": "Pack riset generik lokal; bukan fakta perusahaan",
        "confidence": 0.8,
        "verified": false,
        "notes": "Adaptasikan dengan dokumentasi target dan scope; pola bukan vulnerability target."
      },
      {
        "id": "telecommunication-actor-4",
        "title": "Support Agent",
        "content": "Peran tipikal; hak efektif harus dikonfirmasi pada target.",
        "sourceType": "domain",
        "source": "Pack riset generik lokal; bukan fakta perusahaan",
        "confidence": 0.8,
        "verified": false,
        "notes": "Adaptasikan dengan dokumentasi target dan scope; pola bukan vulnerability target."
      },
      {
        "id": "telecommunication-actor-5",
        "title": "Partner",
        "content": "Peran tipikal; hak efektif harus dikonfirmasi pada target.",
        "sourceType": "domain",
        "source": "Pack riset generik lokal; bukan fakta perusahaan",
        "confidence": 0.8,
        "verified": false,
        "notes": "Adaptasikan dengan dokumentasi target dan scope; pola bukan vulnerability target."
      },
      {
        "id": "telecommunication-actor-6",
        "title": "Service Account",
        "content": "Peran tipikal; hak efektif harus dikonfirmasi pada target.",
        "sourceType": "domain",
        "source": "Pack riset generik lokal; bukan fakta perusahaan",
        "confidence": 0.8,
        "verified": false,
        "notes": "Adaptasikan dengan dokumentasi target dan scope; pola bukan vulnerability target."
      }
    ],
    "businessObjects": [
      {
        "id": "telecommunication-object-1",
        "title": "Subscriber Account",
        "content": "Resource bisnis tipikal; ownership, state dan sensitivitas perlu dipetakan.",
        "sourceType": "domain",
        "source": "Pack riset generik lokal; bukan fakta perusahaan",
        "confidence": 0.8,
        "verified": false,
        "notes": "Adaptasikan dengan dokumentasi target dan scope; pola bukan vulnerability target."
      },
      {
        "id": "telecommunication-object-2",
        "title": "Subscription",
        "content": "Resource bisnis tipikal; ownership, state dan sensitivitas perlu dipetakan.",
        "sourceType": "domain",
        "source": "Pack riset generik lokal; bukan fakta perusahaan",
        "confidence": 0.8,
        "verified": false,
        "notes": "Adaptasikan dengan dokumentasi target dan scope; pola bukan vulnerability target."
      },
      {
        "id": "telecommunication-object-3",
        "title": "Service Profile",
        "content": "Resource bisnis tipikal; ownership, state dan sensitivitas perlu dipetakan.",
        "sourceType": "domain",
        "source": "Pack riset generik lokal; bukan fakta perusahaan",
        "confidence": 0.8,
        "verified": false,
        "notes": "Adaptasikan dengan dokumentasi target dan scope; pola bukan vulnerability target."
      },
      {
        "id": "telecommunication-object-4",
        "title": "Provisioning Job",
        "content": "Resource bisnis tipikal; ownership, state dan sensitivitas perlu dipetakan.",
        "sourceType": "domain",
        "source": "Pack riset generik lokal; bukan fakta perusahaan",
        "confidence": 0.8,
        "verified": false,
        "notes": "Adaptasikan dengan dokumentasi target dan scope; pola bukan vulnerability target."
      },
      {
        "id": "telecommunication-object-5",
        "title": "Usage Record",
        "content": "Resource bisnis tipikal; ownership, state dan sensitivitas perlu dipetakan.",
        "sourceType": "domain",
        "source": "Pack riset generik lokal; bukan fakta perusahaan",
        "confidence": 0.8,
        "verified": false,
        "notes": "Adaptasikan dengan dokumentasi target dan scope; pola bukan vulnerability target."
      },
      {
        "id": "telecommunication-object-6",
        "title": "Invoice",
        "content": "Resource bisnis tipikal; ownership, state dan sensitivitas perlu dipetakan.",
        "sourceType": "domain",
        "source": "Pack riset generik lokal; bukan fakta perusahaan",
        "confidence": 0.8,
        "verified": false,
        "notes": "Adaptasikan dengan dokumentasi target dan scope; pola bukan vulnerability target."
      },
      {
        "id": "telecommunication-object-7",
        "title": "Credential",
        "content": "Resource bisnis tipikal; ownership, state dan sensitivitas perlu dipetakan.",
        "sourceType": "domain",
        "source": "Pack riset generik lokal; bukan fakta perusahaan",
        "confidence": 0.8,
        "verified": false,
        "notes": "Adaptasikan dengan dokumentasi target dan scope; pola bukan vulnerability target."
      }
    ],
    "businessFlows": [
      {
        "id": "telecommunication-flow-1",
        "title": "Telecommunication — flow generik",
        "content": "Pengelolaan subscriber, layanan konektivitas dan provisioning.",
        "sourceType": "domain",
        "source": "Pack riset generik lokal; bukan fakta perusahaan",
        "confidence": 0.8,
        "verified": false,
        "notes": "Adaptasikan dengan dokumentasi target dan scope; pola bukan vulnerability target.",
        "steps": [
          "Subscriber",
          "Subscription",
          "Validate Identity",
          "Authorize Change",
          "Provision",
          "Activate",
          "Usage",
          "Billing"
        ],
        "actorIds": [
          "telecommunication-actor-1",
          "telecommunication-actor-2",
          "telecommunication-actor-3",
          "telecommunication-actor-4",
          "telecommunication-actor-5",
          "telecommunication-actor-6"
        ],
        "objectIds": [
          "telecommunication-object-1",
          "telecommunication-object-2",
          "telecommunication-object-3",
          "telecommunication-object-4",
          "telecommunication-object-5",
          "telecommunication-object-6",
          "telecommunication-object-7"
        ],
        "boundaryIds": [
          "telecommunication-boundary-1"
        ],
        "invariantIds": [
          "telecommunication-invariant-1",
          "telecommunication-invariant-2",
          "telecommunication-invariant-3"
        ],
        "transitions": [
          {
            "id": "telecommunication-transition-1",
            "fromState": "Subscriber",
            "toState": "Subscription",
            "action": "Subscriber → Subscription",
            "critical": false,
            "invariantIds": [
              "telecommunication-invariant-1",
              "telecommunication-invariant-2",
              "telecommunication-invariant-3"
            ]
          },
          {
            "id": "telecommunication-transition-2",
            "fromState": "Subscription",
            "toState": "Validate Identity",
            "action": "Subscription → Validate Identity",
            "critical": false,
            "invariantIds": [
              "telecommunication-invariant-1",
              "telecommunication-invariant-2",
              "telecommunication-invariant-3"
            ]
          },
          {
            "id": "telecommunication-transition-3",
            "fromState": "Validate Identity",
            "toState": "Authorize Change",
            "action": "Validate Identity → Authorize Change",
            "critical": true,
            "invariantIds": [
              "telecommunication-invariant-1",
              "telecommunication-invariant-2",
              "telecommunication-invariant-3"
            ]
          },
          {
            "id": "telecommunication-transition-4",
            "fromState": "Authorize Change",
            "toState": "Provision",
            "action": "Authorize Change → Provision",
            "critical": true,
            "invariantIds": [
              "telecommunication-invariant-1",
              "telecommunication-invariant-2",
              "telecommunication-invariant-3"
            ]
          },
          {
            "id": "telecommunication-transition-5",
            "fromState": "Provision",
            "toState": "Activate",
            "action": "Provision → Activate",
            "critical": false,
            "invariantIds": [
              "telecommunication-invariant-1",
              "telecommunication-invariant-2",
              "telecommunication-invariant-3"
            ]
          },
          {
            "id": "telecommunication-transition-6",
            "fromState": "Activate",
            "toState": "Usage",
            "action": "Activate → Usage",
            "critical": false,
            "invariantIds": [
              "telecommunication-invariant-1",
              "telecommunication-invariant-2",
              "telecommunication-invariant-3"
            ]
          },
          {
            "id": "telecommunication-transition-7",
            "fromState": "Usage",
            "toState": "Billing",
            "action": "Usage → Billing",
            "critical": false,
            "invariantIds": [
              "telecommunication-invariant-1",
              "telecommunication-invariant-2",
              "telecommunication-invariant-3"
            ]
          }
        ]
      }
    ],
    "sensitiveData": [
      {
        "id": "telecommunication-sensitive-1",
        "title": "Subscriber identity and service details",
        "content": "Kategori data generik Telecommunication; konfirmasi sensitivitas pada target dan gunakan data dummy/redaksi.",
        "sourceType": "domain",
        "source": "Pack riset generik lokal; bukan fakta perusahaan",
        "confidence": 0.8,
        "verified": false,
        "notes": "Adaptasikan dengan dokumentasi target dan scope; pola bukan vulnerability target."
      },
      {
        "id": "telecommunication-sensitive-2",
        "title": "Usage and billing records",
        "content": "Kategori data generik Telecommunication; konfirmasi sensitivitas pada target dan gunakan data dummy/redaksi.",
        "sourceType": "domain",
        "source": "Pack riset generik lokal; bukan fakta perusahaan",
        "confidence": 0.8,
        "verified": false,
        "notes": "Adaptasikan dengan dokumentasi target dan scope; pola bukan vulnerability target."
      },
      {
        "id": "telecommunication-sensitive-3",
        "title": "Provisioning credentials",
        "content": "Kategori data generik Telecommunication; konfirmasi sensitivitas pada target dan gunakan data dummy/redaksi.",
        "sourceType": "domain",
        "source": "Pack riset generik lokal; bukan fakta perusahaan",
        "confidence": 0.8,
        "verified": false,
        "notes": "Adaptasikan dengan dokumentasi target dan scope; pola bukan vulnerability target."
      }
    ],
    "criticalAssets": [
      {
        "id": "telecommunication-asset-1",
        "title": "Subscriber Account",
        "content": "Nilai bisnis terkait integritas, ownership dan authority pada Telecommunication flow; bukan penilaian severity target.",
        "sourceType": "domain",
        "source": "Pack riset generik lokal; bukan fakta perusahaan",
        "confidence": 0.8,
        "verified": false,
        "notes": "Adaptasikan dengan dokumentasi target dan scope; pola bukan vulnerability target."
      },
      {
        "id": "telecommunication-asset-2",
        "title": "Service Profile",
        "content": "Nilai bisnis terkait integritas, ownership dan authority pada Telecommunication flow; bukan penilaian severity target.",
        "sourceType": "domain",
        "source": "Pack riset generik lokal; bukan fakta perusahaan",
        "confidence": 0.8,
        "verified": false,
        "notes": "Adaptasikan dengan dokumentasi target dan scope; pola bukan vulnerability target."
      },
      {
        "id": "telecommunication-asset-3",
        "title": "Provisioning Job",
        "content": "Nilai bisnis terkait integritas, ownership dan authority pada Telecommunication flow; bukan penilaian severity target.",
        "sourceType": "domain",
        "source": "Pack riset generik lokal; bukan fakta perusahaan",
        "confidence": 0.8,
        "verified": false,
        "notes": "Adaptasikan dengan dokumentasi target dan scope; pola bukan vulnerability target."
      },
      {
        "id": "telecommunication-asset-4",
        "title": "Usage Record",
        "content": "Nilai bisnis terkait integritas, ownership dan authority pada Telecommunication flow; bukan penilaian severity target.",
        "sourceType": "domain",
        "source": "Pack riset generik lokal; bukan fakta perusahaan",
        "confidence": 0.8,
        "verified": false,
        "notes": "Adaptasikan dengan dokumentasi target dan scope; pola bukan vulnerability target."
      }
    ],
    "commonTrustBoundaries": [
      {
        "id": "telecommunication-boundary-1",
        "title": "Authorization → Execution",
        "content": "Authority harus tetap sesuai ketika aksi terlindungi benar-benar dijalankan.",
        "sourceType": "domain",
        "source": "Pack riset generik lokal; bukan fakta perusahaan",
        "confidence": 0.8,
        "verified": false,
        "notes": "Adaptasikan dengan dokumentasi target dan scope; pola bukan vulnerability target.",
        "fromComponent": "User / Client",
        "toComponent": "Backend / Worker",
        "channel": "request / job",
        "authority": "Izin actor untuk object dan state yang berlaku",
        "flowId": "telecommunication-flow-1"
      }
    ],
    "securityInvariants": [
      {
        "id": "telecommunication-invariant-1",
        "title": "Perubahan layanan harus terikat pada subscriber dan authority sah.",
        "content": "Perubahan layanan harus terikat pada subscriber dan authority sah.",
        "sourceType": "domain",
        "source": "Pack riset generik lokal; bukan fakta perusahaan",
        "confidence": 0.8,
        "verified": false,
        "notes": "Adaptasikan dengan dokumentasi target dan scope; pola bukan vulnerability target.",
        "flowId": "telecommunication-flow-1",
        "techniqueIds": [
          "tech_17"
        ]
      },
      {
        "id": "telecommunication-invariant-2",
        "title": "Job provisioning memvalidasi ulang state/izin ketika berjalan.",
        "content": "Job provisioning memvalidasi ulang state/izin ketika berjalan.",
        "sourceType": "domain",
        "source": "Pack riset generik lokal; bukan fakta perusahaan",
        "confidence": 0.8,
        "verified": false,
        "notes": "Adaptasikan dengan dokumentasi target dan scope; pola bukan vulnerability target.",
        "flowId": "telecommunication-flow-1",
        "techniqueIds": [
          "tech_16"
        ]
      },
      {
        "id": "telecommunication-invariant-3",
        "title": "Usage record harus tetap terisolasi berdasarkan pemilik.",
        "content": "Usage record harus tetap terisolasi berdasarkan pemilik.",
        "sourceType": "domain",
        "source": "Pack riset generik lokal; bukan fakta perusahaan",
        "confidence": 0.8,
        "verified": false,
        "notes": "Adaptasikan dengan dokumentasi target dan scope; pola bukan vulnerability target.",
        "flowId": "telecommunication-flow-1",
        "techniqueIds": [
          "tech_02"
        ]
      }
    ],
    "commonFailurePatterns": [
      {
        "id": "telecommunication-pattern-1",
        "title": "Authorization mismatch",
        "content": "Bandingkan authority efektif, owner, state dan context sebelum menyimpulkan kontrol gagal.",
        "sourceType": "domain",
        "source": "Pack riset generik lokal; bukan fakta perusahaan",
        "confidence": 0.8,
        "verified": false,
        "notes": "Adaptasikan dengan dokumentasi target dan scope; pola bukan vulnerability target."
      },
      {
        "id": "telecommunication-pattern-2",
        "title": "Stale authorization",
        "content": "Pertanyaan generik: apakah authority lama masih dipakai setelah perubahan state?",
        "sourceType": "domain",
        "source": "Pack riset generik lokal; bukan fakta perusahaan",
        "confidence": 0.8,
        "verified": false,
        "notes": "Adaptasikan dengan dokumentasi target dan scope; pola bukan vulnerability target."
      },
      {
        "id": "telecommunication-pattern-3",
        "title": "State desynchronization",
        "content": "Perbedaan state antarkomponen perlu kontrol timing dan evidence; belum tentu vulnerability.",
        "sourceType": "domain",
        "source": "Pack riset generik lokal; bukan fakta perusahaan",
        "confidence": 0.8,
        "verified": false,
        "notes": "Adaptasikan dengan dokumentasi target dan scope; pola bukan vulnerability target."
      }
    ],
    "relevantTechniques": [
      {
        "id": "telecommunication-mapping-1",
        "title": "Technique tech_17",
        "content": "Object ownership: actor harus berhak atas object, account atau record yang dirujuk pada flow. Tinjau Telecommunication flow bersama invariant terkait; gunakan hanya scope yang diotorisasi.",
        "sourceType": "domain",
        "source": "Pack riset generik lokal; bukan fakta perusahaan",
        "confidence": 0.8,
        "verified": false,
        "notes": "Adaptasikan dengan dokumentasi target dan scope; pola bukan vulnerability target.",
        "techniqueId": "tech_17",
        "flowId": "telecommunication-flow-1",
        "invariantId": "telecommunication-invariant-1",
        "researchPriority": 60
      },
      {
        "id": "telecommunication-mapping-2",
        "title": "Technique tech_16",
        "content": "Vertical authority: operasi privilege tinggi harus menolak actor tanpa hak efektif yang sesuai. Tinjau Telecommunication flow bersama invariant terkait; gunakan hanya scope yang diotorisasi.",
        "sourceType": "domain",
        "source": "Pack riset generik lokal; bukan fakta perusahaan",
        "confidence": 0.8,
        "verified": false,
        "notes": "Adaptasikan dengan dokumentasi target dan scope; pola bukan vulnerability target.",
        "techniqueId": "tech_16",
        "flowId": "telecommunication-flow-1",
        "invariantId": "telecommunication-invariant-2",
        "researchPriority": 70
      },
      {
        "id": "telecommunication-mapping-3",
        "title": "Technique tech_02",
        "content": "Async revalidation: periksa apakah worker memakai authority/state yang masih berlaku ketika job dieksekusi. Tinjau Telecommunication flow bersama invariant terkait; gunakan hanya scope yang diotorisasi.",
        "sourceType": "domain",
        "source": "Pack riset generik lokal; bukan fakta perusahaan",
        "confidence": 0.8,
        "verified": false,
        "notes": "Adaptasikan dengan dokumentasi target dan scope; pola bukan vulnerability target.",
        "techniqueId": "tech_02",
        "flowId": "telecommunication-flow-1",
        "invariantId": "telecommunication-invariant-3",
        "researchPriority": 80
      },
      {
        "id": "telecommunication-mapping-4",
        "title": "Technique tech_18",
        "content": "Business logic: retry, urutan aksi dan state terminal tidak boleh menambah efek bisnis yang melanggar invariant. Tinjau Telecommunication flow bersama invariant terkait; gunakan hanya scope yang diotorisasi.",
        "sourceType": "domain",
        "source": "Pack riset generik lokal; bukan fakta perusahaan",
        "confidence": 0.8,
        "verified": false,
        "notes": "Adaptasikan dengan dokumentasi target dan scope; pola bukan vulnerability target.",
        "techniqueId": "tech_18",
        "flowId": "telecommunication-flow-1",
        "invariantId": "telecommunication-invariant-1",
        "researchPriority": 60
      }
    ],
    "researchQuestions": [
      {
        "id": "telecommunication-question-1",
        "title": "Bagaimana memastikan: Perubahan layanan harus terikat pada subscriber dan authority sah.",
        "content": "Perubahan layanan harus terikat pada subscriber dan authority sah. Apa expected behavior jika owner, authority atau state berubah sebelum execution; apa evidence yang membedakan kontrol efektif dari pelanggaran?",
        "sourceType": "domain",
        "source": "Pack riset generik lokal; bukan fakta perusahaan",
        "confidence": 0.8,
        "verified": false,
        "notes": "Adaptasikan dengan dokumentasi target dan scope; pola bukan vulnerability target.",
        "flowId": "telecommunication-flow-1",
        "invariantId": "telecommunication-invariant-1",
        "techniqueId": "tech_17"
      },
      {
        "id": "telecommunication-question-2",
        "title": "Bagaimana memastikan: Job provisioning memvalidasi ulang state/izin ketika berjalan.",
        "content": "Job provisioning memvalidasi ulang state/izin ketika berjalan. Apa expected behavior jika owner, authority atau state berubah sebelum execution; apa evidence yang membedakan kontrol efektif dari pelanggaran?",
        "sourceType": "domain",
        "source": "Pack riset generik lokal; bukan fakta perusahaan",
        "confidence": 0.8,
        "verified": false,
        "notes": "Adaptasikan dengan dokumentasi target dan scope; pola bukan vulnerability target.",
        "flowId": "telecommunication-flow-1",
        "invariantId": "telecommunication-invariant-2",
        "techniqueId": "tech_16"
      },
      {
        "id": "telecommunication-question-3",
        "title": "Bagaimana memastikan: Usage record harus tetap terisolasi berdasarkan pemilik.",
        "content": "Usage record harus tetap terisolasi berdasarkan pemilik. Apa expected behavior jika owner, authority atau state berubah sebelum execution; apa evidence yang membedakan kontrol efektif dari pelanggaran?",
        "sourceType": "domain",
        "source": "Pack riset generik lokal; bukan fakta perusahaan",
        "confidence": 0.8,
        "verified": false,
        "notes": "Adaptasikan dengan dokumentasi target dan scope; pola bukan vulnerability target.",
        "flowId": "telecommunication-flow-1",
        "invariantId": "telecommunication-invariant-3",
        "techniqueId": "tech_02"
      }
    ],
    "references": []
  }
];
