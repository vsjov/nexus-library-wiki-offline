// Imports
// -----------------------------------------------------------------------------
// NodeJS
import http from 'node:http'
import fs from 'node:fs'
import path from 'node:path'
import os from 'node:os'
import type { AddressInfo } from 'node:net'

// External
import { describe, it, expect, afterEach } from 'vitest'

// Internal
import downloadFileOnce from '../download-file-once.js'


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

const tmpFile = () => path.join(os.tmpdir(), `wio-test-${Date.now()}-${Math.random().toString(36).slice(2)}.part`)


// Tests
// -----------------------------------------------------------------------------
describe('Expect downloadFileOnce', () => {
  let close: (() => Promise<void>) | undefined
  const filesToClean: string[] = []

  afterEach(async () => {
    await close?.()
    close = undefined

    for (const f of filesToClean) {
      try { fs.unlinkSync(f) } catch { /* already gone */ }
    }

    filesToClean.length = 0
  })

  describe('to write the response body to the part file', () => {
    it('when server returns 200 with a body', async () => {
      const content = 'hello from server'

      const server = await startServer((_req, res) => {
        res.writeHead(200)
        res.end(content)
      })

      close = server.close

      const partPath = tmpFile()
      filesToClean.push(partPath)

      const total = await downloadFileOnce(server.url, partPath, 0, () => undefined)

      expect(total).toBe(content.length)
      expect(fs.readFileSync(partPath, 'utf-8')).toBe(content)
    })

    it('when server returns 206 Partial Content', async () => {
      const existing = 'prefix'
      const extra = '-suffix'
      const partPath = tmpFile()
      filesToClean.push(partPath)

      fs.writeFileSync(partPath, existing, { mode: 0o600 })

      const server = await startServer((_req, res) => {
        res.writeHead(206)
        res.end(extra)
      })

      close = server.close

      const total = await downloadFileOnce(server.url, partPath, existing.length, () => undefined)

      expect(total).toBe(existing.length + extra.length)
      expect(fs.readFileSync(partPath, 'utf-8')).toBe(existing + extra)
    })
  })

  describe('to send a Range header when resuming', () => {
    it('when existingBytes is greater than zero', async () => {
      let capturedRange: string | undefined

      const server = await startServer((req, res) => {
        capturedRange = req.headers['range'] as string | undefined
        res.writeHead(206)
        res.end('resumed-bytes')
      })

      close = server.close

      const partPath = tmpFile()
      filesToClean.push(partPath)
      fs.writeFileSync(partPath, '', { mode: 0o600 })

      await downloadFileOnce(server.url, partPath, 512, () => undefined)

      expect(capturedRange).toBe('bytes=512-')
    })

    it('when existingBytes is zero', async () => {
      let capturedRange: string | undefined

      const server = await startServer((req, res) => {
        capturedRange = req.headers['range'] as string | undefined
        res.writeHead(200)
        res.end('data')
      })

      close = server.close

      const partPath = tmpFile()
      filesToClean.push(partPath)

      await downloadFileOnce(server.url, partPath, 0, () => undefined)

      expect(capturedRange).toBeUndefined()
    })
  })

  describe('to reject on unexpected HTTP status codes', () => {
    it('when server returns 404', async () => {
      const server = await startServer((_req, res) => {
        res.writeHead(404)
        res.end()
      })

      close = server.close

      const partPath = tmpFile()
      filesToClean.push(partPath)

      await expect(downloadFileOnce(server.url, partPath, 0, () => undefined)).rejects.toThrow('HTTP 404')
    })

    it('when server returns a redirect', async () => {
      const server = await startServer((_req, res) => {
        res.writeHead(301, { location: 'http://127.0.0.1/other' })
        res.end()
      })

      close = server.close

      const partPath = tmpFile()
      filesToClean.push(partPath)

      await expect(downloadFileOnce(server.url, partPath, 0, () => undefined)).rejects.toThrow(
        'Unexpected redirect during download'
      )
    })
  })

  describe('to create the file with restricted permissions', () => {
    it('when writing a new file', async () => {
      const server = await startServer((_req, res) => {
        res.writeHead(200)
        res.end('data')
      })

      close = server.close

      const partPath = tmpFile()
      filesToClean.push(partPath)

      await downloadFileOnce(server.url, partPath, 0, () => undefined)

      const mode = fs.statSync(partPath).mode & 0o777

      expect(mode).toBe(0o600)
    })
  })
})
