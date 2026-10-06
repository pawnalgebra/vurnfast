// MODULE: Curated offline Tool KB and helper catalog. Generated from data/.
export const TOOL_KB=[
  {
    "id": "burp-repeater",
    "name": "Burp Repeater",
    "categories": [
      "api",
      "authorization",
      "business-logic"
    ],
    "techniques": [
      "api",
      "authorization",
      "business-logic"
    ],
    "automationLevel": "manual",
    "description": "Controlled manual request comparison",
    "usageMode": "manual",
    "requiresAutomation": false,
    "requiresThirdParty": false,
    "requiresDos": false,
    "destructive": false,
    "scopeWarning": "Hanya akun/data/asset yang diotorisasi; review program rules dan rate limits. Tidak dijalankan oleh workspace.",
    "documentation": "https://portswigger.net/burp/documentation/desktop/tools/repeater"
  },
  {
    "id": "caido",
    "name": "Caido",
    "categories": [
      "api",
      "authorization"
    ],
    "techniques": [
      "api",
      "authorization"
    ],
    "automationLevel": "manual",
    "description": "Manual proxy/replay workflow; automatic actions require separate program permission",
    "usageMode": "manual",
    "requiresAutomation": false,
    "requiresThirdParty": false,
    "requiresDos": false,
    "destructive": false,
    "scopeWarning": "Hanya akun/data/asset yang diotorisasi; review program rules dan rate limits. Tidak dijalankan oleh workspace.",
    "documentation": "https://docs.caido.io/"
  },
  {
    "id": "mitmproxy",
    "name": "mitmproxy",
    "categories": [
      "api",
      "browser"
    ],
    "techniques": [
      "api",
      "browser"
    ],
    "automationLevel": "manual",
    "description": "Inspect explicitly authorized traffic; scripts are outside this manual recommendation",
    "usageMode": "manual",
    "requiresAutomation": false,
    "requiresThirdParty": false,
    "requiresDos": false,
    "destructive": false,
    "scopeWarning": "Hanya akun/data/asset yang diotorisasi; review program rules dan rate limits. Tidak dijalankan oleh workspace.",
    "documentation": "https://docs.mitmproxy.org/"
  },
  {
    "id": "postman",
    "name": "Postman",
    "categories": [
      "api",
      "auth"
    ],
    "techniques": [
      "api",
      "auth"
    ],
    "automationLevel": "manual",
    "description": "Manually send and inspect one authorized API request",
    "usageMode": "manual",
    "requiresAutomation": false,
    "requiresThirdParty": false,
    "requiresDos": false,
    "destructive": false,
    "scopeWarning": "Hanya akun/data/asset yang diotorisasi; review program rules dan rate limits. Tidak dijalankan oleh workspace.",
    "documentation": "https://learning.postman.com/"
  },
  {
    "id": "curl",
    "name": "curl",
    "categories": [
      "api",
      "state"
    ],
    "techniques": [
      "api",
      "state"
    ],
    "automationLevel": "manual",
    "description": "Manual request recording for an authorized endpoint",
    "usageMode": "manual",
    "requiresAutomation": false,
    "requiresThirdParty": false,
    "requiresDos": false,
    "destructive": false,
    "scopeWarning": "Hanya akun/data/asset yang diotorisasi; review program rules dan rate limits. Tidak dijalankan oleh workspace.",
    "documentation": "https://curl.se/docs/"
  },
  {
    "id": "jq",
    "name": "jq",
    "categories": [
      "api",
      "parser"
    ],
    "techniques": [
      "api",
      "parser"
    ],
    "automationLevel": "manual",
    "description": "Local JSON comparison and filtering",
    "usageMode": "manual",
    "requiresAutomation": false,
    "requiresThirdParty": false,
    "requiresDos": false,
    "destructive": false,
    "scopeWarning": "Hanya akun/data/asset yang diotorisasi; review program rules dan rate limits. Tidak dijalankan oleh workspace.",
    "documentation": "https://jqlang.org/manual/"
  },
  {
    "id": "browser-devtools",
    "name": "Browser DevTools",
    "categories": [
      "browser",
      "state",
      "auth"
    ],
    "techniques": [
      "browser",
      "state",
      "auth"
    ],
    "automationLevel": "manual",
    "description": "Inspect local state, network records, and application contexts",
    "usageMode": "manual",
    "requiresAutomation": false,
    "requiresThirdParty": false,
    "requiresDos": false,
    "destructive": false,
    "scopeWarning": "Hanya akun/data/asset yang diotorisasi; review program rules dan rate limits. Tidak dijalankan oleh workspace.",
    "documentation": "https://developer.chrome.com/docs/devtools/"
  },
  {
    "id": "wireshark",
    "name": "Wireshark",
    "categories": [
      "realtime",
      "infra"
    ],
    "techniques": [
      "realtime",
      "infra"
    ],
    "automationLevel": "manual",
    "description": "Inspect a locally captured, authorized traffic file",
    "usageMode": "manual",
    "requiresAutomation": false,
    "requiresThirdParty": false,
    "requiresDos": false,
    "destructive": false,
    "scopeWarning": "Hanya akun/data/asset yang diotorisasi; review program rules dan rate limits. Tidak dijalankan oleh workspace.",
    "documentation": "https://www.wireshark.org/docs/"
  },
  {
    "id": "git",
    "name": "Git",
    "categories": [
      "state",
      "infra"
    ],
    "techniques": [
      "state",
      "infra"
    ],
    "automationLevel": "manual",
    "description": "Track researcher-owned notes or fixture changes locally",
    "usageMode": "manual",
    "requiresAutomation": false,
    "requiresThirdParty": false,
    "requiresDos": false,
    "destructive": false,
    "scopeWarning": "Hanya akun/data/asset yang diotorisasi; review program rules dan rate limits. Tidak dijalankan oleh workspace.",
    "documentation": "https://git-scm.com/docs"
  },
  {
    "id": "docker",
    "name": "Docker",
    "categories": [
      "infra",
      "sandbox"
    ],
    "techniques": [
      "infra",
      "sandbox"
    ],
    "automationLevel": "manual",
    "description": "Reproduce behavior in an isolated researcher-owned test environment",
    "usageMode": "manual",
    "requiresAutomation": false,
    "requiresThirdParty": false,
    "requiresDos": false,
    "destructive": false,
    "scopeWarning": "Hanya akun/data/asset yang diotorisasi; review program rules dan rate limits. Tidak dijalankan oleh workspace.",
    "documentation": "https://docs.docker.com/"
  },
  {
    "id": "websocat",
    "name": "websocat",
    "categories": [
      "realtime",
      "api"
    ],
    "techniques": [
      "realtime",
      "api"
    ],
    "automationLevel": "manual",
    "description": "Manually inspect an authorized WebSocket connection",
    "usageMode": "manual",
    "requiresAutomation": false,
    "requiresThirdParty": false,
    "requiresDos": false,
    "destructive": false,
    "scopeWarning": "Hanya akun/data/asset yang diotorisasi; review program rules dan rate limits. Tidak dijalankan oleh workspace.",
    "documentation": "https://github.com/vi/websocat"
  }
];
export const HELPER_KB=[
  {
    "id": "authorization-matrix",
    "name": "Authorization Matrix Builder",
    "purpose": "WHO × OBJECT × ACTION expected permissions"
  },
  {
    "id": "state-transition",
    "name": "State Transition Builder",
    "purpose": "Catat state asal/tujuan dan authority yang dibutuhkan"
  },
  {
    "id": "trust-boundary",
    "name": "Trust Boundary Mapper",
    "purpose": "Catat from/to/channel/authority/trust"
  },
  {
    "id": "evidence-comparator",
    "name": "Evidence Comparator",
    "purpose": "Bandingkan dua teks evidence lokal"
  },
  {
    "id": "secret-redactor",
    "name": "Secret Redactor",
    "purpose": "Preview redaksi secret dari teks"
  },
  {
    "id": "hypothesis-generator",
    "name": "Hypothesis Generator",
    "purpose": "Draft invariant dan hypothesis dari technique"
  },
  {
    "id": "scope-checker",
    "name": "Scope Checker",
    "purpose": "Review scope/checklist/rules yang diberikan"
  },
  {
    "id": "finding-checklist",
    "name": "Finding Checklist",
    "purpose": "Periksa kelengkapan facts dan evidence"
  },
  {
    "id": "duplicate-comparator",
    "name": "Duplicate Comparator",
    "purpose": "Bandingkan root cause/boundary/primitive/component/impact"
  },
  {
    "id": "report-builder",
    "name": "Report Builder",
    "purpose": "Laporan Indonesia deterministik"
  },
  {
    "id": "gap-analyzer",
    "name": "Research Gap Analyzer",
    "purpose": "Untested actors/objects/states/boundaries/techniques"
  }
];
