import type { SourceEntry } from '../types.js';
/**
 * Extracts the set of unique language codes present in a list of ZIM entries.
 *
 * @param entries - ZIM source entries to scan.
 * @returns Sorted array of language codes, e.g. ["de", "en", "fr"].
 */
export declare const extractLanguages: (entries: SourceEntry[]) => string[];
//# sourceMappingURL=extract-languages.d.ts.map