// Imports
// -----------------------------------------------------------------------------
// External
import pc from 'picocolors';
// Local
import formatBytes from './utils/format-bytes.js';
import zimSource from '../sources/zim/zim-source.js';
import kiwixSource from '../sources/kiwix/kiwix-source.js';
import dumpsSource from '../sources/dumps/dumps-source.js';
import { downloadFile } from '../download/download-engine.js';
// Functions
// -----------------------------------------------------------------------------
/**
 * Resolves and downloads the best matching file for the given content type.
 *
 * @param args - Parsed CLI arguments (uses `type`, `lang`, `variant`, `os`, `arch`).
 * @param outputDir - Absolute, tilde-expanded output directory path.
 * @throws If `--lang` is missing for ZIM or dump types.
 */
const runDownload = async (args, outputDir) => {
    console.log();
    let entry;
    if (args.type === 'zim') {
        if (!args.lang) {
            throw new Error('--lang is required for --type zim');
        }
        entry = await zimSource.resolve({ lang: args.lang, variant: args.variant });
    }
    else if (args.type === 'kiwix') {
        entry = await kiwixSource.resolve({ os: args.os, arch: args.arch });
    }
    else {
        if (!args.lang) {
            throw new Error('--lang is required for --type dump');
        }
        entry = await dumpsSource.resolve({ lang: args.lang, dumpType: args.variant });
    }
    console.log(pc.dim(`Downloading: ${entry.name}`));
    console.log(pc.dim(`Destination: ${outputDir}`));
    console.log();
    const result = await downloadFile(entry, outputDir);
    console.log();
    console.log(`${pc.green('✓')} Downloaded ${pc.bold(entry.name)} ` +
        `(${formatBytes(result.bytesDownloaded)}) to ${pc.blue(result.filePath)}`);
};
export default runDownload;
//# sourceMappingURL=run-download.js.map