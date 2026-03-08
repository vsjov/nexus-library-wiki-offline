// Imports
// -----------------------------------------------------------------------------
// NodeJS
import { readFileSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

// External
import { describe, it, expect, vi, beforeEach } from 'vitest'

// Internal
import kiwixSource from '../kiwix-source.js'


// Mocks
// -----------------------------------------------------------------------------
vi.mock('../../fetch-html.js', () => ({
  fetchHtml: vi.fn(),
}))

import { fetchHtml } from '../../fetch-html.js'

const __dirname = dirname(fileURLToPath(import.meta.url))
const kiwixHtml = readFileSync(join(__dirname, 'mocks/kiwix-listing.html'), 'utf-8')


// Tests
// -----------------------------------------------------------------------------
beforeEach(() => {
  vi.mocked(fetchHtml).mockResolvedValue(kiwixHtml)
})


describe('Expect kiwixSource.list', () => {
  describe('to return all binary entries', () => {
    it('when called', async () => {
      const entries = await kiwixSource.list()

      // 7 binaries (src tarball .tar.xz excluded)
      expect(entries.length).toBe(7)
    })

    it('when no .tar.xz source tarballs are included', async () => {
      const entries = await kiwixSource.list()

      expect(entries.every(e => !e.name.endsWith('.tar.xz'))).toBe(true)
    })
  })
})


describe('Expect kiwixSource.resolve', () => {
  describe('to return the latest binary for the given OS and arch', () => {
    it('when os is linux and arch is x86_64', async () => {
      const entry = await kiwixSource.resolve({ os: 'linux', arch: 'x86_64' })

      // The mock has 3.8.0 and 3.9.0 for linux-x86_64 — should pick 3.9.0
      expect(entry.name).toBe('kiwix-tools_linux-x86_64-3.9.0.tar.gz')
    })

    it('when os is linux and arch is aarch64', async () => {
      const entry = await kiwixSource.resolve({ os: 'linux', arch: 'aarch64' })

      expect(entry.name).toBe('kiwix-tools_linux-aarch64-3.9.0.tar.gz')
    })

    it('when os is macos and arch is x86_64', async () => {
      const entry = await kiwixSource.resolve({ os: 'macos', arch: 'x86_64' })

      expect(entry.name).toBe('kiwix-tools_macos-x86_64-3.8.0.tar.gz')
    })

    it('when os is win and arch is x86_64', async () => {
      const entry = await kiwixSource.resolve({ os: 'win', arch: 'x86_64' })

      expect(entry.name).toBe('kiwix-tools_win-x86_64-3.8.0.zip')
    })
  })

  describe('to throw', () => {
    it('when no binary exists for the requested OS and arch', async () => {
      await expect(kiwixSource.resolve({ os: 'linux', arch: 'armv8' })).rejects.toThrow(
        'No Kiwix tools binary found for linux-armv8'
      )
    })
  })
})
