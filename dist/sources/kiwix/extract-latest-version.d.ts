import type { SourceEntry } from '../types.js';
/**
 * Returns the highest semantic version present among the given entries.
 * Version parts are compared numerically, including optional build suffixes (e.g. "3.8.1-2").
 *
 * @param entries - Kiwix source entries to scan.
 * @returns Latest version string, or null if no version could be determined.
 */
export declare const extractLatestVersion: (entries: SourceEntry[]) => string | null;
//# sourceMappingURL=extract-latest-version.d.ts.map