// Imports
// -----------------------------------------------------------------------------
// External
import cliProgress from 'cli-progress';
import pc from 'picocolors';
// Local
import formatBytes from '../cli/utils/format-bytes.js';
// Functions
// -----------------------------------------------------------------------------
/**
 * Creates a `cli-progress` bar for a single file download.
 * If `totalBytes` is unknown (`null` or `0`), an indeterminate bar is shown.
 *
 * @param filename - Display name shown in the progress bar.
 * @param totalBytes - Expected file size in bytes, or `null` if unknown.
 * @returns A `ProgressReporter` with `update`, `stop`, and `fail` methods.
 */
export const createProgressReporter = (filename, totalBytes) => {
    const isIndeterminate = totalBytes === null || totalBytes === 0;
    const bar = new cliProgress.SingleBar({
        format: isIndeterminate
            ? `${pc.cyan('{bar}')} | ${pc.bold('{filename}')} | {downloaded} | {speed}/s`
            : `${pc.cyan('{bar}')} | ${pc.bold('{filename}')} | {percentage}% | {downloaded}/{total} | {speed}/s | ETA: {eta_formatted}`,
        barCompleteChar: '=',
        barIncompleteChar: ' ',
        hideCursor: true,
        etaBuffer: 50,
    }, cliProgress.Presets.shades_classic);
    bar.start(totalBytes ?? 100, 0, {
        filename,
        downloaded: formatBytes(0),
        total: isIndeterminate ? '?' : formatBytes(totalBytes ?? 0),
        speed: '0 B',
    });
    const update = (downloaded, speed) => {
        bar.update(isIndeterminate ? 50 : downloaded, {
            filename,
            downloaded: formatBytes(downloaded),
            total: isIndeterminate ? '?' : formatBytes(totalBytes ?? 0),
            speed: formatBytes(speed),
        });
    };
    const stop = () => {
        bar.update(totalBytes ?? 100, {
            filename,
            downloaded: isIndeterminate ? 'done' : formatBytes(totalBytes ?? 0),
            total: isIndeterminate ? '?' : formatBytes(totalBytes ?? 0),
            speed: '0 B',
        });
        bar.stop();
    };
    const fail = () => {
        bar.stop();
    };
    return { update, stop, fail };
};
//# sourceMappingURL=progress-reporter.js.map