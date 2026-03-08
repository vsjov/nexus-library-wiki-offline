/**
 * Interface for controlling a CLI download progress bar.
 * Created by `createProgressReporter` and passed to the download engine.
 */
export type ProgressReporter = {
    /** Updates the progress bar with the latest downloaded byte count and current speed. */
    update: (downloaded: number, speed: number) => void;
    /** Marks the download as complete and stops the progress bar. */
    stop: () => void;
    /** Stops the progress bar without marking it as complete (used on error). */
    fail: () => void;
};
/**
 * Creates a `cli-progress` bar for a single file download.
 * If `totalBytes` is unknown (`null` or `0`), an indeterminate bar is shown.
 *
 * @param filename - Display name shown in the progress bar.
 * @param totalBytes - Expected file size in bytes, or `null` if unknown.
 * @returns A `ProgressReporter` with `update`, `stop`, and `fail` methods.
 */
export declare const createProgressReporter: (filename: string, totalBytes: number | null) => ProgressReporter;
//# sourceMappingURL=progress-reporter.d.ts.map