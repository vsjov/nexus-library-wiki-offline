// Imports
// -----------------------------------------------------------------------------
// Local
import { DUMPS_BASE_URL } from '../../config/constants.js';
// Functions
// -----------------------------------------------------------------------------
/**
 * Parses a Wikimedia dump index page and returns all recognized archive file entries.
 * Absolute URLs and paths containing slashes are skipped.
 *
 * @param html - Raw HTML of the dump directory index page.
 * @param lang - Language code used to construct download URLs, e.g. `"en"`.
 * @returns Array of source entries for each dump archive found.
 */
export const parseDumpListing = (html, lang) => {
    const entries = [];
    // Wikimedia dump pages list files with links in the format: href="filename"
    const rowPattern = /<a href="([^"]+(?:\.xml\.bz2|\.xml\.gz|\.sql\.gz|\.gz))"[^>]*>/gi;
    let match;
    while ((match = rowPattern.exec(html)) !== null) {
        const filename = match[1];
        // Skip absolute URLs or paths to other pages
        if (filename.startsWith('http') || filename.includes('/'))
            continue;
        entries.push({
            name: filename,
            url: `${DUMPS_BASE_URL}${lang}wiki/latest/${filename}`,
            size: null,
            date: null,
        });
    }
    return entries;
};
//# sourceMappingURL=parse-dump-listing.js.map