// Imports
// -----------------------------------------------------------------------------
// NodeJS
import os from 'node:os'

// External
import { describe, it, expect } from 'vitest'

// Internal
import expandTilde from '../expand-tilde.js'


// Tests
// -----------------------------------------------------------------------------
describe('Expect expandTilde', () => {
  describe('to expand tilde', () => {
    it('when path starts with ~/', () => {
      const result = expandTilde('~/documents/wiki')
      expect(result).toBe(`${os.homedir()}/documents/wiki`)
    })

    it('when path is exactly ~', () => {
      const result = expandTilde('~')
      expect(result).toBe(os.homedir())
    })
  })

  describe('to return path unchanged', () => {
    it('when path has no tilde', () => {
      const result = expandTilde('/absolute/path')
      expect(result).toBe('/absolute/path')
    })

    it('when path is relative without tilde', () => {
      const result = expandTilde('./relative/path')
      expect(result).toBe('relative/path') // path.normalize strips the leading ./
    })

    it('when tilde appears mid-path', () => {
      const result = expandTilde('/some/~path')
      expect(result).toBe('/some/~path')
    })
  })
})
