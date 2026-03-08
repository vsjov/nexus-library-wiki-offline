// Imports
// -----------------------------------------------------------------------------
// NodeJS
import { readFileSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

// External
import { describe, it, expect, beforeAll } from 'vitest'

// Internal
import { parseDumpListing } from '../parse-dump-listing.js'
import { filterDumpsByType } from '../filter-dumps-by-type.js'
import { extractDumpTypes } from '../extract-dump-types.js'

// Types
import type { SourceEntry } from '../../types.js'


// Setup
// -----------------------------------------------------------------------------
const __dirname = dirname(fileURLToPath(import.meta.url))
let entries: SourceEntry[]

beforeAll(() => {
  const html = readFileSync(join(__dirname, 'mocks/dumps-listing.html'), 'utf-8')
  entries = parseDumpListing(html, 'en')
})


// Tests
// -----------------------------------------------------------------------------
describe('Expect parseDumpListing', () => {
  describe('to parse file entries', () => {
    it('when HTML contains dump file links', () => {
      expect(entries.length).toBe(7)
    })

    it('when entry has correct URL', () => {
      const pagesArticles = entries.find(e => e.name.includes('pages-articles'))

      expect(pagesArticles?.url).toBe(
        'https://dumps.wikimedia.org/enwiki/latest/enwiki-latest-pages-articles.xml.bz2'
      )
    })

    it('when absolute URL links are excluded', () => {
      const external = entries.find(e => e.name.startsWith('http'))
      expect(external).toBeUndefined()
    })
  })
})

describe('Expect filterDumpsByType', () => {
  describe('to return matching entries', () => {
    it('when filtering by pages-articles type', () => {
      const result = filterDumpsByType(entries, 'pages-articles')
      expect(result.length).toBe(1)
      expect(result[0].name).toContain('pages-articles')
    })

    it('when filtering by unknown type', () => {
      const result = filterDumpsByType(entries, 'unknown-type')
      expect(result).toEqual([])
    })
  })
})

describe('Expect extractDumpTypes', () => {
  describe('to return available dump types', () => {
    it('when entries match known patterns', () => {
      const types = extractDumpTypes(entries)
      expect(types).toContain('pages-articles')
      expect(types).toContain('pagelinks')
      expect(types).toContain('abstract')
    })
  })
})
