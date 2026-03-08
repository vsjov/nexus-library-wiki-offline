import type { ManualArgs } from './manual.js';
/**
 * Resolves and downloads the best matching file for the given content type.
 *
 * @param args - Parsed CLI arguments (uses `type`, `lang`, `variant`, `os`, `arch`).
 * @param outputDir - Absolute, tilde-expanded output directory path.
 * @throws If `--lang` is missing for ZIM or dump types.
 */
declare const runDownload: (args: ManualArgs, outputDir: string) => Promise<void>;
export default runDownload;
//# sourceMappingURL=run-download.d.ts.map