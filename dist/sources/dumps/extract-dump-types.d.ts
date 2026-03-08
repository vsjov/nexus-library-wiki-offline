import type { SourceEntry } from '../types.js';
/**
 * Returns all known dump type identifiers present in the given entries.
 *
 * @param entries - Dump source entries to scan.
 * @returns Array of dump type keys that matched at least one entry, in insertion order.
 */
export declare const extractDumpTypes: (entries: SourceEntry[]) => string[];
//# sourceMappingURL=extract-dump-types.d.ts.map