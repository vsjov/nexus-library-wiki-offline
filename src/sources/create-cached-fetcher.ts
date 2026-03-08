// Functions
// -----------------------------------------------------------------------------
/**
 * Wraps an async fetcher so that its result is cached after the first call.
 * Subsequent calls return the cached value without invoking the fetcher again.
 *
 * @param fetcher - Async function to call on the first invocation.
 * @returns A wrapped function that returns the cached result on all calls.
 */
const createCachedFetcher = <T>(fetcher: () => Promise<T>): () => Promise<T> => {
  let cache: T | null = null

  return async () => {
    if (cache !== null) return cache
    cache = await fetcher()

    return cache
  }
}

export default createCachedFetcher
