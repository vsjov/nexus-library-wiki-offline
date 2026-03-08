import type { SourceEntry } from '../types.js';
/**
 * Returns a new array of entries with sizes populated from a filename-to-size-bytes map.
 * Entries whose filename is not in `sizeMap` retain their original size.
 *
 * @param entries - Dump source entries to update.
 * @param sizeMap - Map of filename to raw byte-count string.
 * @returns New array of entries with sizes filled in where available.
 */
export declare const updateEntrySizes: (entries: SourceEntry[], sizeMap: Record<string, string>) => SourceEntry[];
//# sourceMappingURL=update-entry-sizes.d.ts.map