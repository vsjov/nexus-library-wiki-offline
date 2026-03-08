// Imports
// -----------------------------------------------------------------------------
// External
import { describe, it, expect } from 'vitest'

// Internal
import formatBytes from '../format-bytes.js'


// Tests
// -----------------------------------------------------------------------------
describe('Expect formatBytes', () => {
  describe('to return "0 B"', () => {
    it('when bytes is 0', () => {
      expect(formatBytes(0)).toBe('0 B')
    })
  })

  describe('to format bytes correctly', () => {
    it('when value is in bytes range', () => {
      expect(formatBytes(512)).toBe('512 B')
    })

    it('when value is in KB range', () => {
      expect(formatBytes(1024)).toBe('1 KB')
    })

    it('when value is in MB range', () => {
      expect(formatBytes(1048576)).toBe('1 MB')
    })

    it('when value is in GB range', () => {
      expect(formatBytes(1073741824)).toBe('1 GB')
    })

    it('when value has decimal places', () => {
      expect(formatBytes(1572864)).toBe('1.5 MB')
    })
  })
})
