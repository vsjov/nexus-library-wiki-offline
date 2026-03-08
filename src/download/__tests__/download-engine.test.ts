// Imports
// -----------------------------------------------------------------------------
// NodeJS
import fs from 'node:fs'
import path from 'node:path'
import os from 'node:os'

// External
import { describe, it, expect, vi, afterEach } from 'vitest'

// Internal
import { downloadFile } from '../download-engine.js'


// Tests
// -----------------------------------------------------------------------------
describe('Expect downloadFile', () => {
  afterEach(() => {
    vi.restoreAllMocks()
  })

  describe('to reject unsafe filenames', () => {
    it('when filename contains a path separator (/)', async () => {
      await expect(
        downloadFile({ name: '../etc/passwd', url: 'https://example.com/f', size: null, date: null }, os.tmpdir())
      ).rejects.toThrow('Unsafe filename rejected')
    })

    it('when filename contains a Windows path separator (\\)', async () => {
      await expect(
        downloadFile({ name: 'subdir\\malicious', url: 'https://example.com/f', size: null, date: null }, os.tmpdir())
      ).rejects.toThrow('Unsafe filename rejected')
    })

    it('when filename contains a double-dot segment', async () => {
      await expect(
        downloadFile({ name: '..\\..\\etc\\cron.d', url: 'https://example.com/f', size: null, date: null }, os.tmpdir())
      ).rejects.toThrow('Unsafe filename rejected')
    })

    it('when filename is an empty string', async () => {
      await expect(
        downloadFile({ name: '', url: 'https://example.com/f', size: null, date: null }, os.tmpdir())
      ).rejects.toThrow('Unsafe filename rejected')
    })
  })

  describe('to reject non-writable output directories', () => {
    it('when output directory is not writable', async () => {
      const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'wio-test-'))
      fs.chmodSync(tmpDir, 0o444)

      try {
        await expect(
          downloadFile({ name: 'valid.zim', url: 'https://example.com/f', size: null, date: null }, tmpDir)
        ).rejects.toThrow('not writable')
      }
      finally {
        fs.chmodSync(tmpDir, 0o755)
        fs.rmdirSync(tmpDir)
      }
    })
  })
})
