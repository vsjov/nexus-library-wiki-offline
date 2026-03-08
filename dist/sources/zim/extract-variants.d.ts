import type { SourceEntry } from '../types.js';
/**
 * Extracts the set of unique size variants available for a given language.
 *
 * @param entries - ZIM source entries to scan.
 * @param lang - Language code to filter by, e.g. "en".
 * @returns Sorted array of variant names, e.g. ["maxi", "mini", "nopic"].
 */
export declare const extractVariants: (entries: SourceEntry[], lang: string) => string[];
//# sourceMappingURL=extract-variants.d.ts.map