import type { SourceEntry } from '../../sources/types.js';
/**
 * Guides the user through selecting a ZIM language and size variant,
 * then resolves and returns the most recent matching ZIM entry.
 *
 * @returns Resolved ZIM source entry, or `null` if no variants are available for the chosen language.
 */
declare const promptZimSelection: () => Promise<SourceEntry | null>;
export default promptZimSelection;
//# sourceMappingURL=prompt-zim-selection.d.ts.map