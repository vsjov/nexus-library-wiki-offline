// Imports
// -----------------------------------------------------------------------------
// Local
import expandTilde from './utils/expand-tilde.js';
import runList from './run-list.js';
import runDownload from './run-download.js';
// Manual mode
// -----------------------------------------------------------------------------
/**
 * Entry point for manual (non-interactive) mode.
 * Routes to `runList` when `--list` is set, otherwise to `runDownload`.
 *
 * @param args - Parsed CLI arguments.
 */
export const runManual = async (args) => {
    const outputDir = expandTilde(args.out);
    if (args.list) {
        await runList(args);
        return;
    }
    await runDownload(args, outputDir);
};
//# sourceMappingURL=manual.js.map