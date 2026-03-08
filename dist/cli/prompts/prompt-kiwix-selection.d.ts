import type { SourceEntry } from '../../sources/types.js';
/**
 * Guides the user through selecting a target OS and CPU architecture for Kiwix tools,
 * defaulting to the current platform when available.
 *
 * @returns Resolved Kiwix tools source entry, or `null` if the prompt flow is abandoned.
 */
declare const promptKiwixSelection: () => Promise<SourceEntry | null>;
export default promptKiwixSelection;
//# sourceMappingURL=prompt-kiwix-selection.d.ts.map