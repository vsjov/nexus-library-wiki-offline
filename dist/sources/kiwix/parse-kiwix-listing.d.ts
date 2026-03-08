import type { SourceEntry } from '../types.js';
/**
 * Parses an Apache autoindex HTML page from download.kiwix.org/release/kiwix-tools/
 * and returns all binary archive entries found. Source tarballs (.tar.xz) are excluded.
 *
 * @param html - Raw HTML of the directory listing page.
 * @returns Array of source entries for each Kiwix tools archive.
 */
export declare const parseKiwixListing: (html: string) => SourceEntry[];
//# sourceMappingURL=parse-kiwix-listing.d.ts.map