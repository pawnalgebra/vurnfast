// MODULE: One-process test runner supports environments that block child spawning.
await import('./core.test.js');
await import('./server.test.js');
await import('./documentation.test.js');
await import('./intelligence.test.js');
await import('./agentic.test.js');
await import('./environment.test.js');
await import('./agent-messages.test.js');
await import('./reliability.test.js');
await import('./advanced-research/engine.test.js');

import './discovery-intelligence/engine.test.js';

await import('./refinement.test.js');
