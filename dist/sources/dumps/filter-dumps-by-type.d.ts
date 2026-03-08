import type { SourceEntry } from '../types.js';
/**
 * Filters dump entries to only those matching the given known dump type.
 *
 * @param entries - Dump source entries to filter.
 * @param dumpType - Dump type key from `KNOWN_DUMP_PATTERNS`, e.g. `"pages-articles"`.
 * @returns Filtered entries that match the pattern, or an empty array if the type is unknown.
 */
export declare const filterDumpsByType: (entries: SourceEntry[], dumpType: string) => SourceEntry[];
//# sourceMappingURL=filter-dumps-by-type.d.ts.map