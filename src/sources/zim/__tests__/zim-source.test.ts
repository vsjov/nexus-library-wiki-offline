// Imports
// -----------------------------------------------------------------------------
// NodeJS
import { readFileSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

// External
import { describe, it, expect, vi, beforeEach } from 'vitest'

// Internal
import zimSource from '../zim-source.js'


// Mocks
// -----------------------------------------------------------------------------
vi.mock('../../fetch-html.js', () => ({
  fetchHtml: vi.fn(),
}))

// Import after mock so we get the mocked version
import { fetchHtml } from '../../fetch-html.js'

const __dirname = dirname(fileURLToPath(import.meta.url))
const zimHtml = readFileSync(join(__dirname, 'mocks/zim-listing.html'), 'utf-8')


// Tests
// -----------------------------------------------------------------------------
// zimSource uses createCachedFetcher internally. We reset the module between
// describe blocks by resetting the mock return value — the cache is shared
// across tests in the same module instance, so we rely on the mock always
// returning the same HTML and the cache being a transparent pass-through here.
beforeEach(() => {
  vi.mocked(fetchHtml).mockResolvedValue(zimHtml)
})


describe('Expect zimSource.list', () => {
  describe('to return all entries', () => {
    it('when called with no options', async () => {
      const entries = await zimSource.list()

      expect(entries.length).toBe(6)
    })
  })

  describe('to filter by language', () => {
    it('when lang is "en"', async () => {
      const entries = await zimSource.list({ lang: 'en' })

      expect(entries.every(e => e.name.startsWith('wikipedia_en_'))).toBe(true)
      expect(entries.length).toBe(3)
    })

    it('when lang is "de"', async () => {
      const entries = await zimSource.list({ lang: 'de' })

      expect(entries.length).toBe(2)
    })

    it('when lang does not exist', async () => {
      const entries = await zimSource.list({ lang: 'xx' })

      expect(entries).toEqual([])
    })
  })

  describe('to filter by variant', () => {
    it('when variant is "maxi"', async () => {
      const entries = await zimSource.list({ variant: 'maxi' })

      expect(entries.every(e => e.name.includes('_maxi_'))).toBe(true)
      expect(entries.length).toBe(2)
    })
  })

  describe('to filter by language and variant together', () => {
    it('when lang is "en" and variant is "nopic"', async () => {
      const entries = await zimSource.list({ lang: 'en', variant: 'nopic' })

      expect(entries.length).toBe(1)
      expect(entries[0].name).toBe('wikipedia_en_all_nopic_2024-11.zim')
    })
  })
})


describe('Expect zimSource.resolve', () => {
  describe('to return the most recent matching entry', () => {
    it('when multiple dates exist for a language', async () => {
      const entry = await zimSource.resolve({ lang: 'en', variant: 'maxi' })

      expect(entry.name).toBe('wikipedia_en_all_maxi_2024-11.zim')
      expect(entry.date).toBe('2024-11')
    })
  })

  describe('to throw', () => {
    it('when no matching entry is found', async () => {
      await expect(zimSource.resolve({ lang: 'xx', variant: 'maxi' })).rejects.toThrow(
        'No ZIM file found'
      )
    })
  })
})


describe('Expect zimSource.getLanguages', () => {
  describe('to return sorted unique language codes', () => {
    it('when the listing contains multiple languages', async () => {
      const langs = await zimSource.getLanguages()

      expect(langs).toEqual(['de', 'en', 'fr'])
    })
  })
})


describe('Expect zimSource.getVariants', () => {
  describe('to return sorted variants for a language', () => {
    it('when lang is "en"', async () => {
      const variants = await zimSource.getVariants('en')

      expect(variants).toEqual(['maxi', 'mini', 'nopic'])
    })

    it('when lang does not exist', async () => {
      const variants = await zimSource.getVariants('xx')

      expect(variants).toEqual([])
    })
  })
})
