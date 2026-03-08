// Imports
// -----------------------------------------------------------------------------
// NodeJS
import { readFileSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

// External
import { describe, it, expect, vi, beforeEach } from 'vitest'

// Internal
import dumpsSource from '../dumps-source.js'


// Mocks
// -----------------------------------------------------------------------------
vi.mock('../../fetch-html.js', () => ({
  fetchHtml: vi.fn(),
}))

import { fetchHtml } from '../../fetch-html.js'

const __dirname = dirname(fileURLToPath(import.meta.url))
const dumpsHtml = readFileSync(join(__dirname, 'mocks/dumps-listing.html'), 'utf-8')


// Tests
// -----------------------------------------------------------------------------
beforeEach(() => {
  vi.mocked(fetchHtml).mockResolvedValue(dumpsHtml)
})


describe('Expect dumpsSource.list', () => {
  describe('to return all dump entries', () => {
    it('when called with only a language', async () => {
      const entries = await dumpsSource.list({ lang: 'en' })

      expect(entries.length).toBe(7)
    })

    it('when called with no options (defaults to lang "en")', async () => {
      const entries = await dumpsSource.list()

      expect(entries.length).toBe(7)
    })
  })

  describe('to filter by dump type', () => {
    it('when dumpType is pages-articles', async () => {
      const entries = await dumpsSource.list({ lang: 'en', dumpType: 'pages-articles' })

      expect(entries.length).toBe(1)
      expect(entries[0].name).toContain('pages-articles')
    })

    it('when dumpType is pagelinks', async () => {
      const entries = await dumpsSource.list({ lang: 'en', dumpType: 'pagelinks' })

      expect(entries.length).toBe(1)
      expect(entries[0].name).toContain('pagelinks')
    })

    it('when dumpType does not exist', async () => {
      const entries = await dumpsSource.list({ lang: 'en', dumpType: 'nonexistent-type' })

      expect(entries).toEqual([])
    })
  })

  describe('to construct the correct URL for the language', () => {
    it('when lang is "de"', async () => {
      await dumpsSource.list({ lang: 'de' })

      expect(vi.mocked(fetchHtml)).toHaveBeenCalledWith(
        'https://dumps.wikimedia.org/dewiki/latest/',
        expect.any(String)
      )
    })
  })
})


describe('Expect dumpsSource.resolve', () => {
  describe('to return the first matching entry', () => {
    it('when dumpType matches', async () => {
      const entry = await dumpsSource.resolve({ lang: 'en', dumpType: 'pages-articles' })

      expect(entry.name).toContain('pages-articles')
      expect(entry.url).toContain('dumps.wikimedia.org')
    })
  })

  describe('to throw', () => {
    it('when no entry matches the dump type', async () => {
      await expect(
        dumpsSource.resolve({ lang: 'en', dumpType: 'nonexistent-type' })
      ).rejects.toThrow('No dump file found')
    })

    it('when the listing is empty', async () => {
      vi.mocked(fetchHtml).mockResolvedValue('<html><body></body></html>')

      await expect(dumpsSource.resolve({ lang: 'en' })).rejects.toThrow('No dump file found')
    })
  })
})


describe('Expect dumpsSource.getAvailableTypes', () => {
  describe('to return known dump type identifiers', () => {
    it('when the listing has multiple dump types', async () => {
      const types = await dumpsSource.getAvailableTypes('en')

      expect(types).toContain('pages-articles')
      expect(types).toContain('pagelinks')
      expect(types).toContain('abstract')
    })
  })
})
