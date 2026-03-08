// Imports
// -----------------------------------------------------------------------------
// NodeJS
import https from 'node:https'
import http from 'node:http'

// Local
import { MAX_REDIRECTS, FETCH_TIMEOUT_MS, MIN_TIMEOUT_MS, MAX_RESPONSE_SIZE } from '../config/constants.js'
import validateUrl from '../config/validate-url.js'


// Functions
// -----------------------------------------------------------------------------
/**
 * Fetches the HTML body of a URL, following up to MAX_REDIRECTS redirects.
 *
 * @param url - URL to fetch.
 * @param userAgent - User-Agent header value to send with the request.
 * @param redirectCount - Current redirect depth (used internally for recursion).
 * @returns Resolved HTML string.
 */
export const fetchHtml = (url: string, userAgent: string, redirectCount = 0): Promise<string> => {
  return new Promise((resolve, reject) => {
    if (redirectCount > MAX_REDIRECTS) {
      reject(new Error(`Too many redirects fetching: ${url}`))

      return
    }

    const client = url.startsWith('https') ? https : http

    const req = client.get(url, { headers: { 'User-Agent': userAgent } }, res => {
      const { statusCode, headers } = res

      if (statusCode && statusCode >= 300 && statusCode < 400 && headers.location) {
        res.resume()

        try {
          validateUrl(headers.location)
        }
        catch (err) {
          reject(err)

          return
        }

        resolve(fetchHtml(headers.location, userAgent, redirectCount + 1))

        return
      }

      if (statusCode !== 200) {
        res.resume()
        reject(new Error(`HTTP ${statusCode} fetching: ${url}`))

        return
      }

      const chunks: Buffer[] = []
      let totalBytes = 0

      res.on('data', (chunk: Buffer) => {
        totalBytes += chunk.length

        if (totalBytes > MAX_RESPONSE_SIZE) {
          req.destroy(new Error(`Response too large fetching: ${url}`))

          return
        }

        chunks.push(chunk)
      })

      res.on('end', () => resolve(Buffer.concat(chunks).toString('utf-8')))
      res.on('error', reject)
    })

    req.setTimeout(Math.max(MIN_TIMEOUT_MS, FETCH_TIMEOUT_MS), () => {
      req.destroy(new Error(`Request timed out: ${url}`))
    })

    req.on('error', reject)
  })
}
