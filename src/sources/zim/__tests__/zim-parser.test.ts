// Imports
// -----------------------------------------------------------------------------
// NodeJS
import { readFileSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

// External
import { describe, it, expect, beforeAll } from 'vitest'

// Internal
import { parseZimListing } from '../parse-zim-listing.js'
import { extractLanguages } from '../extract-languages.js'
import { extractVariants } from '../extract-variants.js'

// Types
import type { SourceEntry } from '../../types.js'


// Setup
// -----------------------------------------------------------------------------
const __dirname = dirname(fileURLToPath(import.meta.url))
let entries: SourceEntry[]

beforeAll(() => {
  const html = readFileSync(join(__dirname, 'mocks/zim-listing.html'), 'utf-8')
  entries = parseZimListing(html)
})


// Tests
// -----------------------------------------------------------------------------
describe('Expect parseZimListing', () => {
  describe('to parse entries', () => {
    it('when HTML contains ZIM file links', () => {
      expect(entries.length).toBe(6)
    })

    it('when entry has correct name', () => {
      expect(entries[0].name).toBe('wikipedia_en_all_maxi_2024-11.zim')
    })

    it('when entry has correct URL', () => {
      expect(entries[0].url).toBe('https://download.kiwix.org/zim/wikipedia/wikipedia_en_all_maxi_2024-11.zim')
    })

    it('when entry has date extracted from filename', () => {
      expect(entries[0].date).toBe('2024-11')
    })
  })
})

describe('Expect extractLanguages', () => {
  describe('to return unique sorted language codes', () => {
    it('when entries contain multiple languages', () => {
      const langs = extractLanguages(entries)
      expect(langs).toEqual(['de', 'en', 'fr'])
    })
  })
})

describe('Expect extractVariants', () => {
  describe('to return variants for a given language', () => {
    it('when English entries have multiple variants', () => {
      const variants = extractVariants(entries, 'en')
      expect(variants).toEqual(['maxi', 'mini', 'nopic'])
    })

    it('when language has fewer variants', () => {
      const variants = extractVariants(entries, 'fr')
      expect(variants).toEqual(['nopic'])
    })

    it('when language does not exist', () => {
      const variants = extractVariants(entries, 'xx')
      expect(variants).toEqual([])
    })
  })

  describe('to handle regex special characters in lang safely', () => {
    it('when lang contains a dot (.) it does not match arbitrary characters', () => {
      // 'e.' with an unescaped dot would match 'en', 'de', 'fr', etc.
      // With escaping it should match nothing since no filename uses literal "e."
      const variants = extractVariants(entries, 'e.')
      expect(variants).toEqual([])
    })

    it('when lang contains a pipe (|) it does not create regex alternation', () => {
      // 'en|de' unescaped would match both English and German entries
      const variants = extractVariants(entries, 'en|de')
      expect(variants).toEqual([])
    })

    it('when lang contains .* it does not match all entries', () => {
      const variants = extractVariants(entries, '.*')
      expect(variants).toEqual([])
    })
  })
})
