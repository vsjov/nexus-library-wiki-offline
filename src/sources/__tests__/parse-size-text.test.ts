// Imports
// -----------------------------------------------------------------------------
// External
import { describe, it, expect } from 'vitest'

// Internal
import parseSizeText from '../parse-size-text.js'


// Tests
// -----------------------------------------------------------------------------
describe('Expect parseSizeText', () => {
  describe('to return bytes for plain numbers', () => {
    it('when input has no unit', () => {
      expect(parseSizeText('512')).toBe(512)
    })

    it('when input has extra whitespace', () => {
      expect(parseSizeText('  1024  ')).toBe(1024)
    })
  })

  describe('to convert K suffix to kilobytes', () => {
    it('when input is whole kilobytes', () => {
      expect(parseSizeText('1K')).toBe(1024)
    })

    it('when input is lowercase k', () => {
      expect(parseSizeText('2k')).toBe(2048)
    })
  })

  describe('to convert M suffix to megabytes', () => {
    it('when input is whole megabytes', () => {
      expect(parseSizeText('1M')).toBe(1024 * 1024)
    })

    it('when input has a decimal value', () => {
      expect(parseSizeText('1.5M')).toBe(Math.round(1.5 * 1024 * 1024))
    })
  })

  describe('to convert G suffix to gigabytes', () => {
    it('when input is whole gigabytes', () => {
      expect(parseSizeText('1G')).toBe(1024 * 1024 * 1024)
    })

    it('when input is a real-world ZIM size', () => {
      expect(parseSizeText('87G')).toBe(Math.round(87 * 1024 * 1024 * 1024))
    })
  })

  describe('to convert T suffix to terabytes', () => {
    it('when input is whole terabytes', () => {
      expect(parseSizeText('1T')).toBe(1024 * 1024 * 1024 * 1024)
    })
  })

  describe('to return null for unparseable input', () => {
    it('when input is an empty string', () => {
      expect(parseSizeText('')).toBeNull()
    })

    it('when input contains an unknown unit', () => {
      expect(parseSizeText('5X')).toBeNull()
    })

    it('when input is non-numeric text', () => {
      expect(parseSizeText('large')).toBeNull()
    })

    it('when input has a unit but no number', () => {
      expect(parseSizeText('G')).toBeNull()
    })
  })
})
