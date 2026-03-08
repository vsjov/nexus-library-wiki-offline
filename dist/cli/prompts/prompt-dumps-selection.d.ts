import type { SourceEntry } from '../../sources/types.js';
/**
 * Guides the user through selecting a language and one or more dump types,
 * then resolves and returns source entries for each selected type.
 *
 * @returns Array of resolved dump source entries for the selected types.
 */
declare const promptDumpsSelection: () => Promise<SourceEntry[]>;
export default promptDumpsSelection;
//# sourceMappingURL=prompt-dumps-selection.d.ts.map