import type { SourceEntry } from '../sources/types.js';
/**
 * Result returned by a successful `downloadFile` call.
 */
type DownloadResult = {
    /** Absolute path to the final downloaded file (without `.part` suffix). */
    filePath: string;
    /** Total bytes written to disk, including any bytes resumed from a previous attempt. */
    bytesDownloaded: number;
};
/**
 * Downloads a source entry to the given directory with progress reporting, resume support, and retry.
 *
 * - Creates the output directory if it does not exist, and verifies write permission.
 * - Follows redirects via HEAD request to obtain the final URL before downloading.
 * - Uses a `.part` temporary file; renames to final filename on success.
 * - Resumes from the `.part` file on each retry attempt (reads size fresh per attempt).
 * - Retries up to `MAX_RETRIES` times with exponential backoff on failure.
 *
 * @param entry - Source entry describing the file to download (name, URL, size).
 * @param outputDir - Absolute path to the directory where the file will be saved.
 * @returns Result containing the final file path and total bytes downloaded.
 * @throws If the output directory is not writable, or if all retry attempts fail.
 */
export declare const downloadFile: (entry: SourceEntry, outputDir: string) => Promise<DownloadResult>;
export {};
//# sourceMappingURL=download-engine.d.ts.map