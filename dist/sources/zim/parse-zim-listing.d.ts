import type { SourceEntry } from '../types.js';
/**
 * Parses an Apache autoindex HTML page from download.kiwix.org/zim/wikipedia/
 * and returns all ZIM file entries found.
 *
 * @param html - Raw HTML of the directory listing page.
 * @returns Array of source entries for each ZIM file.
 */
export declare const parseZimListing: (html: string) => SourceEntry[];
//# sourceMappingURL=parse-zim-listing.d.ts.map