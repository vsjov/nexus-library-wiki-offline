/**
 * Performs a single streaming HTTP GET download attempt, appending to or creating a `.part` file.
 * Supports HTTP 206 Partial Content for resuming interrupted downloads via the `Range` header.
 *
 * @param url - Resolved (non-redirect) URL to download from.
 * @param partPath - Path to the `.part` file to write/append to.
 * @param existingBytes - Bytes already present in the `.part` file; triggers a `Range` header if > 0.
 * @param onProgress - Callback invoked roughly every second with total downloaded bytes and current speed.
 * @returns Total bytes written to disk after this attempt (including pre-existing bytes).
 * @throws On unexpected HTTP status codes or redirect responses during download.
 */
declare const downloadFileOnce: (url: string, partPath: string, existingBytes: number, onProgress: (downloaded: number, speed: number) => void) => Promise<number>;
export default downloadFileOnce;
//# sourceMappingURL=download-file-once.d.ts.map