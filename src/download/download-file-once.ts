// Imports
// -----------------------------------------------------------------------------
// NodeJS
import fs from 'node:fs'
import https from 'node:https'
import http from 'node:http'

// Local
import { USER_AGENT } from '../config/constants.js'


// Helpers
// -----------------------------------------------------------------------------
const getClient = (url: string) => url.startsWith('https') ? https : http


// Functions
// -----------------------------------------------------------------------------
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
const downloadFileOnce = (
  url: string,
  partPath: string,
  existingBytes: number,
  onProgress: (downloaded: number, speed: number) => void
): Promise<number> => {
  return new Promise((resolve, reject) => {
    const headers: Record<string, string> = { 'User-Agent': USER_AGENT }

    if (existingBytes > 0) {
      headers['Range'] = `bytes=${existingBytes}-`
    }

    const req = getClient(url).get(url, { headers }, res => {
      const { statusCode } = res

      if (statusCode && statusCode >= 300 && statusCode < 400) {
        res.resume()
        reject(new Error(`Unexpected redirect during download: ${url}`))

        return
      }

      if (statusCode !== 200 && statusCode !== 206) {
        res.resume()
        reject(new Error(`HTTP ${statusCode} during download: ${url}`))

        return
      }

      const fileStream = fs.createWriteStream(partPath, {
        flags: existingBytes > 0 ? 'a' : 'w',
        mode: 0o600,
      })

      let totalDownloaded = existingBytes
      let speedBytes = 0
      let lastSpeedReset = Date.now()

      res.on('data', (chunk: Buffer) => {
        totalDownloaded += chunk.length
        speedBytes += chunk.length

        const now = Date.now()
        const elapsed = (now - lastSpeedReset) / 1000

        if (elapsed >= 1) {
          const speed = Math.round(speedBytes / elapsed)
          onProgress(totalDownloaded, speed)
          speedBytes = 0
          lastSpeedReset = now
        }
      })

      res.on('end', () => {
        fileStream.end(() => resolve(totalDownloaded))
      })

      res.on('error', err => {
        fileStream.destroy()
        reject(err)
      })

      res.pipe(fileStream, { end: false })
    })

    req.on('error', reject)
  })
}

export default downloadFileOnce
