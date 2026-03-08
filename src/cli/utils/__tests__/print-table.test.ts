// Imports
// -----------------------------------------------------------------------------
// External
import { describe, it, expect, vi, afterEach } from 'vitest'

// Internal
import printTable from '../print-table.js'


// Helpers
// -----------------------------------------------------------------------------
const ANSI_PATTERN = new RegExp(String.fromCharCode(27) + '\\[[^m]*m', 'g')
const stripAnsi = (str: string) => str.replace(ANSI_PATTERN, '')


// Tests
// -----------------------------------------------------------------------------
describe('Expect printTable', () => {
  afterEach(() => {
    vi.restoreAllMocks()
  })

  describe('to print headers and rows', () => {
    it('when given a single-column table', () => {
      const spy = vi.spyOn(console, 'log').mockImplementation(() => undefined)
      printTable(['Name'], [['alpha'], ['beta']])

      const calls = spy.mock.calls.map(c => stripAnsi(String(c[0])))

      expect(calls[0]).toContain('Name')
      expect(calls[2]).toContain('alpha')
      expect(calls[3]).toContain('beta')
    })

    it('when given a multi-column table', () => {
      const spy = vi.spyOn(console, 'log').mockImplementation(() => undefined)
      printTable(['Name', 'Size'], [['file.zim', '87G'], ['other.zim', '21G']])

      const calls = spy.mock.calls.map(c => stripAnsi(String(c[0])))

      expect(calls[0]).toContain('Name')
      expect(calls[0]).toContain('Size')
      expect(calls[2]).toContain('file.zim')
      expect(calls[2]).toContain('87G')
    })
  })

  describe('to align columns by the widest value', () => {
    it('when a row cell is wider than the header', () => {
      const spy = vi.spyOn(console, 'log').mockImplementation(() => undefined)
      printTable(['A'], [['short'], ['a-much-longer-value']])

      const headerLine = stripAnsi(String(spy.mock.calls[0][0]))

      // Header "A" must be padded to match the longest cell width
      expect(headerLine.length).toBeGreaterThanOrEqual('a-much-longer-value'.length)
    })
  })

  describe('to print a separator line after the header', () => {
    it('when the table has at least one row', () => {
      const spy = vi.spyOn(console, 'log').mockImplementation(() => undefined)
      printTable(['Col'], [['val']])

      const separatorLine = String(spy.mock.calls[1][0])

      expect(separatorLine).toMatch(/^-+$/)
    })
  })

  describe('to handle empty rows', () => {
    it('when rows array is empty', () => {
      const spy = vi.spyOn(console, 'log').mockImplementation(() => undefined)
      printTable(['Name', 'Size'], [])

      // Only header + separator should be logged
      expect(spy.mock.calls.length).toBe(2)
    })
  })
})
