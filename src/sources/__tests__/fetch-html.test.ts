// Imports
// -----------------------------------------------------------------------------
// NodeJS
import http from 'node:http'
import type { AddressInfo } from 'node:net'

// External
import { describe, it, expect, afterEach } from 'vitest'

// Internal
import { fetchHtml } from '../fetch-html.js'
import { MAX_RESPONSE_SIZE } from '../../config/constants.js'


// Helpers
// -----------------------------------------------------------------------------
const startServer = (
  handler: http.RequestListener
): Promise<{ url: string, close: () => Promise<void> }> => {
  return new Promise((resolve, reject) => {
    const server = http.createServer(handler)

    server.on('error', reject)

    server.listen(0, '127.0.0.1', () => {
      const { port } = server.address() as AddressInfo
      const url = `http://127.0.0.1:${port}`
      const close = () => new Promise<void>((res, rej) => server.close(err => (err ? rej(err) : res())))
      resolve({ url, close })
    })
  })
}


// Tests
// -----------------------------------------------------------------------------
describe('Expect fetchHtml', () => {
  let close: (() => Promise<void>) | undefined

  afterEach(async () => {
    await close?.()
    close = undefined
  })

  describe('to fetch HTML successfully', () => {
    it('when server returns 200 with a body', async () => {
      const expected = '<html><body>hello</body></html>'

      const server = await startServer((_req, res) => {
        res.writeHead(200)
        res.end(expected)
      })

      close = server.close

      const body = await fetchHtml(server.url, 'test-agent')

      expect(body).toBe(expected)
    })
  })

  describe('to reject HTTP error status codes', () => {
    it('when server returns 404', async () => {
      const server = await startServer((_req, res) => {
        res.writeHead(404)
        res.end()
      })

      close = server.close

      await expect(fetchHtml(server.url, 'test-agent')).rejects.toThrow('HTTP 404')
    })
  })

  describe('to reject responses that exceed MAX_RESPONSE_SIZE', () => {
    it('when server streams more bytes than the limit', async () => {
      const oversized = Buffer.alloc(MAX_RESPONSE_SIZE + 1, 'a')

      const server = await startServer((_req, res) => {
        res.writeHead(200)
        res.end(oversized)
      })

      close = server.close

      await expect(fetchHtml(server.url, 'test-agent')).rejects.toThrow('Response too large')
    })
  })

  describe('to reject redirects to private addresses', () => {
    it('when server redirects to a loopback address', async () => {
      const server = await startServer((_req, res) => {
        res.writeHead(301, { location: 'https://127.0.0.2/secret' })
        res.end()
      })

      close = server.close

      await expect(fetchHtml(server.url, 'test-agent')).rejects.toThrow(
        'private or local addresses'
      )
    })

    it('when server redirects to an HTTP URL (protocol downgrade)', async () => {
      const server = await startServer((_req, res) => {
        res.writeHead(301, { location: 'http://evil.example.com/payload' })
        res.end()
      })

      close = server.close

      await expect(fetchHtml(server.url, 'test-agent')).rejects.toThrow(
        'Only HTTPS URLs are allowed'
      )
    })
  })
})
