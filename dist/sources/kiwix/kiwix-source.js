// Imports
// -----------------------------------------------------------------------------
// Local
import { KIWIX_TOOLS_BASE_URL, USER_AGENT } from '../../config/constants.js';
import { fetchHtml } from '../fetch-html.js';
import createCachedFetcher from '../create-cached-fetcher.js';
import { parseKiwixListing } from './parse-kiwix-listing.js';
import { extractLatestVersion } from './extract-latest-version.js';
import detectPlatform from '../../cli/utils/detect-platform.js';
// Source
// -----------------------------------------------------------------------------
/**
 * Fetches and caches the full Kiwix tools release directory listing.
 * Subsequent calls return the cached result without making a new HTTP request.
 */
const fetchEntries = createCachedFetcher(async () => {
    const html = await fetchHtml(KIWIX_TOOLS_BASE_URL, USER_AGENT);
    return parseKiwixListing(html);
});
/**
 * Returns all available Kiwix tools binary entries from the release directory.
 *
 * @returns Array of all Kiwix tools source entries.
 */
const list = async () => {
    return fetchEntries();
};
/**
 * Resolves the latest Kiwix tools binary for the specified (or auto-detected) OS and architecture.
 * Filters entries by OS+arch prefix first, then selects the highest version among those matches.
 *
 * @param options - Optional OS (`os`) and architecture (`arch`) overrides.
 * @returns The source entry for the latest matching Kiwix tools binary.
 * @throws If no matching binary is found for the resolved OS and architecture.
 */
const resolve = async (options = {}) => {
    const entries = await fetchEntries();
    const platform = detectPlatform();
    const resolvedOs = (options.os ?? platform.os);
    const resolvedArch = (options.arch ?? platform.arch);
    // Filter to entries matching the requested OS and arch, then pick the latest among those
    const prefix = `kiwix-tools_${resolvedOs}-${resolvedArch}-`;
    const matching = entries.filter(e => e.name.startsWith(prefix));
    if (matching.length === 0) {
        throw new Error(`No Kiwix tools binary found for ${resolvedOs}-${resolvedArch}`);
    }
    const latestVersion = extractLatestVersion(matching);
    const targetEntry = matching.find(e => {
        return e.name.startsWith(`${prefix}${latestVersion}`);
    });
    if (!targetEntry) {
        throw new Error(`No Kiwix tools binary found for ${resolvedOs}-${resolvedArch}`);
    }
    return targetEntry;
};
const kiwixSource = {
    list,
    resolve,
};
export default kiwixSource;
//# sourceMappingURL=kiwix-source.js.map