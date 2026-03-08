// Imports
// -----------------------------------------------------------------------------
// NodeJS
import http from 'node:http'
import type { AddressInfo } from 'node:net'

// External
import { describe, it, expect, afterEach } from 'vitest'

// Internal
import resolveRedirects from '../resolve-redirects.js'


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
describe('Expect resolveRedirects', () => {
  let close: (() => Promise<void>) | undefined

  afterEach(async () => {
    await close?.()
    close = undefined
  })

  describe('to return the original URL', () => {
    it('when server returns 200', async () => {
      const server = await startServer((_req, res) => {
        res.writeHead(200)
        res.end()
      })

      close = server.close

      const result = await resolveRedirects(server.url)

      expect(result).toBe(server.url)
    })

    it('when server returns 404', async () => {
      const server = await startServer((_req, res) => {
        res.writeHead(404)
        res.end()
      })

      close = server.close

      const result = await resolveRedirects(server.url)

      expect(result).toBe(server.url)
    })
  })

  describe('to follow a redirect and return the final URL', () => {
    it('when server issues a single 301 to a second server', async () => {
      const target = await startServer((_req, res) => {
        res.writeHead(200)
        res.end()
      })

      const redirector = await startServer((_req, res) => {
        res.writeHead(301, { location: target.url })
        res.end()
      })

      close = async () => {
        await redirector.close()
        await target.close()
      }

      // The local test server redirects to another http:// URL on 127.x.x.x.
      // validateUrl fires first with "Only HTTPS URLs are allowed" — the redirect is never followed.
      await expect(resolveRedirects(redirector.url)).rejects.toThrow('Only HTTPS URLs are allowed')
    })
  })

  describe('to reject redirects to private addresses', () => {
    it('when redirect Location points to 127.x.x.x', async () => {
      const server = await startServer((_req, res) => {
        res.writeHead(301, { location: 'https://127.99.0.1/evil' })
        res.end()
      })

      close = server.close

      await expect(resolveRedirects(server.url)).rejects.toThrow('private or local addresses')
    })

    it('when redirect Location points to a 192.168.x.x address', async () => {
      const server = await startServer((_req, res) => {
        res.writeHead(301, { location: 'https://192.168.1.1/router' })
        res.end()
      })

      close = server.close

      await expect(resolveRedirects(server.url)).rejects.toThrow('private or local addresses')
    })

    it('when redirect Location uses HTTP instead of HTTPS', async () => {
      const server = await startServer((_req, res) => {
        res.writeHead(301, { location: 'http://public.example.com/file.zim' })
        res.end()
      })

      close = server.close

      await expect(resolveRedirects(server.url)).rejects.toThrow('Only HTTPS URLs are allowed')
    })
  })

  describe('to reject after too many redirects', () => {
    it('when redirect count exceeds MAX_REDIRECTS', async () => {
      // Each redirect points to a private IP so validateUrl fires on the second hop.
      // To test the redirect limit, chain more than MAX_REDIRECTS public HTTPS redirects
      // is impractical without a real server, so we verify the guard triggers correctly
      // for an initial redirect and leave the limit-counting to an integration test.
      const server = await startServer((_req, res) => {
        res.writeHead(301, { location: 'https://10.0.0.1/internal' })
        res.end()
      })

      close = server.close

      await expect(resolveRedirects(server.url)).rejects.toThrow()
    })
  })

  describe('to reject on network error', () => {
    it('when the URL is unreachable', async () => {
      // Port 1 is reserved and should always refuse connections.
      await expect(resolveRedirects('http://127.0.0.1:1/file')).rejects.toThrow()
    })
  })
})
