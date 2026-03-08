import type { SourceEntry } from '../types.js';
/**
 * Parses a Wikimedia dump index page and returns all recognized archive file entries.
 * Absolute URLs and paths containing slashes are skipped.
 *
 * @param html - Raw HTML of the dump directory index page.
 * @param lang - Language code used to construct download URLs, e.g. `"en"`.
 * @returns Array of source entries for each dump archive found.
 */
export declare const parseDumpListing: (html: string, lang: string) => SourceEntry[];
//# sourceMappingURL=parse-dump-listing.d.ts.map