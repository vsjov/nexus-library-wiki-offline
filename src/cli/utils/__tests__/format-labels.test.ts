// Imports
// -----------------------------------------------------------------------------
// External
import { describe, it, expect } from 'vitest'

// Internal
import formatDumpTypeLabel from '../format-dump-type-label.js'
import formatVariantLabel from '../format-variant-label.js'


// Tests
// -----------------------------------------------------------------------------
describe('Expect formatDumpTypeLabel', () => {
  describe('to return a descriptive label', () => {
    it('when type is pages-articles', () => {
      expect(formatDumpTypeLabel('pages-articles')).toBe('pages-articles - All article text (recommended)')
    })

    it('when type is pages-meta-current', () => {
      expect(formatDumpTypeLabel('pages-meta-current')).toBe('pages-meta-current - Articles with metadata')
    })

    it('when type is abstract', () => {
      expect(formatDumpTypeLabel('abstract')).toBe('abstract - Article abstracts only')
    })

    it('when type is all-titles', () => {
      expect(formatDumpTypeLabel('all-titles')).toBe('all-titles - All article titles')
    })

    it('when type is pagelinks', () => {
      expect(formatDumpTypeLabel('pagelinks')).toBe('pagelinks - Page link graph (SQL)')
    })

    it('when type is categorylinks', () => {
      expect(formatDumpTypeLabel('categorylinks')).toBe('categorylinks - Category relationships (SQL)')
    })

    it('when type is stub-meta-history', () => {
      expect(formatDumpTypeLabel('stub-meta-history')).toBe('stub-meta-history - Revision stubs')
    })
  })

  describe('to fall back to the raw type string', () => {
    it('when type is unknown', () => {
      expect(formatDumpTypeLabel('unknown-dump-type')).toBe('unknown-dump-type')
    })

    it('when type is an empty string', () => {
      expect(formatDumpTypeLabel('')).toBe('')
    })
  })
})


describe('Expect formatVariantLabel', () => {
  describe('to return a descriptive label', () => {
    it('when variant is maxi', () => {
      expect(formatVariantLabel('maxi')).toBe('maxi - Full Wikipedia with images (~80+ GB)')
    })

    it('when variant is nopic', () => {
      expect(formatVariantLabel('nopic')).toBe('nopic - Wikipedia without images (~20 GB)')
    })

    it('when variant is mini', () => {
      expect(formatVariantLabel('mini')).toBe('mini - Small subset (~2 GB)')
    })
  })

  describe('to fall back to the raw variant string', () => {
    it('when variant is unknown', () => {
      expect(formatVariantLabel('custom')).toBe('custom')
    })

    it('when variant is an empty string', () => {
      expect(formatVariantLabel('')).toBe('')
    })
  })
})
