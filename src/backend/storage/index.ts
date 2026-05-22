// ---------------------------------------------------------------------------
// Storage — Barrel Export
// ---------------------------------------------------------------------------

export type { CaseRepository } from './repository.js';
export { toCaseRecord, newAuditEvent } from './repository.js';

export { InMemoryCaseRepository } from './memory.js';
export { PostgresCaseRepository } from './postgres.js';
export { CosmosCaseRepository } from './cosmos.js';

export { createRepository, getRepository } from './factory.js';
export type { StorageBackend } from './factory.js';
