// Imports
// -----------------------------------------------------------------------------
// NodeJS
import http from 'node:http'
import type { AddressInfo } from 'node:net'

// External
import { describe, it, expect, afterEach } from 'vitest'

// Internal
import getContentLength from '../get-content-length.js'


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
describe('Expect getContentLength', () => {
  let close: (() => Promise<void>) | undefined

  afterEach(async () => {
    await close?.()
    close = undefined
  })

  describe('to return the file size in bytes', () => {
    it('when server provides a Content-Length header', async () => {
      const server = await startServer((_req, res) => {
        res.writeHead(200, { 'content-length': '1048576' })
        res.end()
      })

      close = server.close

      const result = await getContentLength(server.url)

      expect(result).toBe(1048576)
    })

    it('when Content-Length is zero', async () => {
      const server = await startServer((_req, res) => {
        res.writeHead(200, { 'content-length': '0' })
        res.end()
      })

      close = server.close

      expect(await getContentLength(server.url)).toBe(0)
    })
  })

  describe('to return null', () => {
    it('when server omits the Content-Length header', async () => {
      const server = await startServer((_req, res) => {
        res.writeHead(200)
        res.end()
      })

      close = server.close

      expect(await getContentLength(server.url)).toBeNull()
    })

    it('when server sends a non-numeric Content-Length', async () => {
      const server = await startServer((_req, res) => {
        res.writeHead(200, { 'content-length': 'unknown' })
        res.end()
      })

      close = server.close

      expect(await getContentLength(server.url)).toBeNull()
    })

    it('when the connection is refused', async () => {
      // Port 1 is reserved and should always refuse connections
      expect(await getContentLength('http://127.0.0.1:1/file')).toBeNull()
    })
  })
})
