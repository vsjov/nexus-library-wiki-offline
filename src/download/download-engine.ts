// Imports
// -----------------------------------------------------------------------------
// NodeJS
import fs from 'node:fs'
import path from 'node:path'

// Local
import { MAX_RETRIES, RETRY_DELAY_MS } from '../config/constants.js'
import { createProgressReporter } from './progress-reporter.js'
import resolveRedirects from './resolve-redirects.js'
import getContentLength from './get-content-length.js'
import downloadFileOnce from './download-file-once.js'

// Types
import type { SourceEntry } from '../sources/types.js'


// Types
// -----------------------------------------------------------------------------
/**
 * Result returned by a successful `downloadFile` call.
 */
type DownloadResult = {
  /** Absolute path to the final downloaded file (without `.part` suffix). */
  filePath: string,
  /** Total bytes written to disk, including any bytes resumed from a previous attempt. */
  bytesDownloaded: number,
}


// Helpers
// -----------------------------------------------------------------------------
const sleep = (ms: number) => new Promise<void>(resolve => setTimeout(resolve, ms))


// Public API
// -----------------------------------------------------------------------------
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
export const downloadFile = async (entry: SourceEntry, outputDir: string): Promise<DownloadResult> => {
  fs.mkdirSync(outputDir, { recursive: true })

  try {
    fs.accessSync(outputDir, fs.constants.W_OK)
  }
  catch {
    throw new Error(`Output directory is not writable: ${outputDir}`)
  }

  if (!entry.name || /[/\\]/.test(entry.name) || entry.name.includes('..')) {
    throw new Error(`Unsafe filename rejected: ${entry.name}`)
  }

  const finalPath = path.join(outputDir, entry.name)
  const partPath = `${finalPath}.part`

  // Resolve final URL (follow redirects)
  const resolvedUrl = await resolveRedirects(entry.url)

  // Determine total size for progress
  const totalBytes = entry.size ?? await getContentLength(resolvedUrl)
  const reporter = createProgressReporter(entry.name, totalBytes)

  let lastError: Error | null = null

  for (let attempt = 0; attempt < MAX_RETRIES; attempt++) {
    if (attempt > 0) {
      await sleep(RETRY_DELAY_MS * Math.pow(2, attempt - 1))
    }

    // Read .part size on every attempt so retries resume from where the previous attempt left off
    let existingBytes = 0

    try {
      existingBytes = fs.statSync(partPath).size
    }
    catch {
      // File does not exist yet — start from zero
    }

    try {
      const bytesDownloaded = await downloadFileOnce(
        resolvedUrl,
        partPath,
        existingBytes,
        (downloaded, speed) => reporter.update(downloaded, speed)
      )

      reporter.stop()
      fs.renameSync(partPath, finalPath)

      return { filePath: finalPath, bytesDownloaded }
    }
    catch (err) {
      lastError = err instanceof Error ? err : new Error(String(err))
    }
  }

  reporter.fail()
  throw lastError ?? new Error(`Failed to download: ${entry.url}`)
}
