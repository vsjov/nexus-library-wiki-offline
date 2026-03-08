// Imports
// -----------------------------------------------------------------------------
// External
import { describe, it, expect, vi } from 'vitest'

// Internal
import createCachedFetcher from '../create-cached-fetcher.js'


// Tests
// -----------------------------------------------------------------------------
describe('Expect createCachedFetcher', () => {
  describe('to call the fetcher', () => {
    it('when invoked for the first time', async () => {
      const fetcher = vi.fn().mockResolvedValue('result')
      const cached = createCachedFetcher(fetcher)

      const result = await cached()

      expect(result).toBe('result')
      expect(fetcher).toHaveBeenCalledTimes(1)
    })
  })

  describe('to return the cached value', () => {
    it('when invoked multiple times', async () => {
      const fetcher = vi.fn().mockResolvedValue('result')
      const cached = createCachedFetcher(fetcher)

      await cached()
      await cached()
      await cached()

      expect(fetcher).toHaveBeenCalledTimes(1)
    })

    it('when invoked concurrently', async () => {
      const fetcher = vi.fn().mockResolvedValue('concurrent-result')
      const cached = createCachedFetcher(fetcher)

      const [a, b, c] = await Promise.all([cached(), cached(), cached()])

      expect(a).toBe('concurrent-result')
      expect(b).toBe('concurrent-result')
      expect(c).toBe('concurrent-result')
    })
  })

  describe('to propagate the fetcher error', () => {
    it('when the fetcher rejects', async () => {
      const fetcher = vi.fn().mockRejectedValue(new Error('fetch failed'))
      const cached = createCachedFetcher(fetcher)

      await expect(cached()).rejects.toThrow('fetch failed')
    })
  })

  describe('to work with different value types', () => {
    it('when the fetcher returns an array', async () => {
      const fetcher = vi.fn().mockResolvedValue([1, 2, 3])
      const cached = createCachedFetcher(fetcher)

      expect(await cached()).toEqual([1, 2, 3])
      expect(await cached()).toEqual([1, 2, 3])
      expect(fetcher).toHaveBeenCalledTimes(1)
    })
  })
})
