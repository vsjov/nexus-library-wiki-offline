// Imports
// -----------------------------------------------------------------------------
// NodeJS
import { createRequire } from 'node:module';
// External
import { input } from '@inquirer/prompts';
import pc from 'picocolors';
// Package metadata
const require = createRequire(import.meta.url);
const { name, version, description } = require('../../package.json');
// Local
import { DEFAULT_OUTPUT_DIR } from '../config/constants.js';
import expandTilde from './utils/expand-tilde.js';
import formatBytes from './utils/format-bytes.js';
import promptContentTypes from './prompts/prompt-content-types.js';
import promptZimSelection from './prompts/prompt-zim-selection.js';
import promptKiwixSelection from './prompts/prompt-kiwix-selection.js';
import promptDumpsSelection from './prompts/prompt-dumps-selection.js';
import { downloadFile } from '../download/download-engine.js';
// Main
// -----------------------------------------------------------------------------
/**
 * Entry point for interactive mode.
 * Presents a guided prompt flow for selecting content types, languages, variants,
 * and output directory, then downloads all selected files with progress bars.
 */
export const runInteractive = async () => {
    console.log(`\n${pc.bold(name)} v${version} - ${description}\n`);
    const selected = await promptContentTypes();
    if (!selected.zim && !selected.kiwix && !selected.dump) {
        console.log(pc.yellow('\nNothing selected. Exiting.\n'));
        return;
    }
    const entriesToDownload = [];
    if (selected.zim) {
        console.log();
        const entry = await promptZimSelection();
        if (entry)
            entriesToDownload.push(entry);
    }
    if (selected.kiwix) {
        console.log();
        const entry = await promptKiwixSelection();
        if (entry)
            entriesToDownload.push(entry);
    }
    if (selected.dump) {
        console.log();
        const entries = await promptDumpsSelection();
        entriesToDownload.push(...entries);
    }
    if (entriesToDownload.length === 0) {
        console.log(pc.yellow('\nNo files to download.\n'));
        return;
    }
    console.log();
    const outputInput = await input({
        message: 'Output directory:',
        default: DEFAULT_OUTPUT_DIR,
    });
    const outputDir = expandTilde(outputInput);
    console.log(`\n${pc.dim(`Downloading ${entriesToDownload.length} file(s) to ${outputDir}...\n`)}`);
    const results = [];
    for (const entry of entriesToDownload) {
        try {
            const result = await downloadFile(entry, outputDir);
            results.push({ name: entry.name, success: true });
            console.log(`\n${pc.green('+')} ${pc.bold(entry.name)} (${formatBytes(result.bytesDownloaded)})`);
        }
        catch (err) {
            const message = err instanceof Error ? err.message : String(err);
            results.push({ name: entry.name, success: false, error: message });
            console.log(`\n${pc.red('x')} ${pc.bold(entry.name)} - ${message}`);
        }
    }
    const succeeded = results.filter(r => r.success).length;
    const failed = results.filter(r => !r.success).length;
    console.log();
    console.log(pc.bold('Summary:'));
    console.log(`  ${pc.green(`${succeeded} downloaded`)}`);
    if (failed > 0) {
        console.log(`  ${pc.red(`${failed} failed`)}`);
    }
    console.log();
};
//# sourceMappingURL=interactive.js.map