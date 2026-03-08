// Imports
// -----------------------------------------------------------------------------
// Local
import { ZIM_BASE_URL, USER_AGENT } from '../../config/constants.js'
import { fetchHtml } from '../fetch-html.js'
import createCachedFetcher from '../create-cached-fetcher.js'
import { parseZimListing } from './parse-zim-listing.js'
import { extractLanguages } from './extract-languages.js'
import { extractVariants } from './extract-variants.js'

// Types
import type { SourceEntry, SourceProvider, ListOptions, ResolveOptions } from '../types.js'


// Source
// -----------------------------------------------------------------------------
/**
 * Fetches and caches the full ZIM directory listing from download.kiwix.org.
 * Subsequent calls return the cached result without making a new HTTP request.
 */
const fetchEntries = createCachedFetcher(async (): Promise<SourceEntry[]> => {
  const html = await fetchHtml(ZIM_BASE_URL, USER_AGENT)

  return parseZimListing(html)
})

/**
 * Returns all ZIM entries, optionally filtered by language and/or variant.
 *
 * @param options - Filter options: `lang` (language code) and/or `variant` (size variant).
 * @returns Filtered array of ZIM source entries.
 */
const list = async (options: ListOptions = {}): Promise<SourceEntry[]> => {
  const entries = await fetchEntries()
  let filtered = entries

  if (options.lang) {
    filtered = filtered.filter(e =>
      e.name.startsWith(`wikipedia_${options.lang}_`)
    )
  }

  if (options.variant) {
    filtered = filtered.filter(e => {
      const match = e.name.match(/^wikipedia_[a-z]+_all_([^_]+)_/)

      return match ? match[1] === options.variant : false
    })
  }

  return filtered
}

/**
 * Resolves the most recent ZIM entry matching the given language and variant.
 * Entries are sorted by date descending; the newest one is returned.
 *
 * @param options - Filter options: `lang` (language code) and/or `variant` (size variant).
 * @returns The most recent matching ZIM source entry.
 * @throws If no matching entry is found.
 */
const resolve = async (options: ResolveOptions = {}): Promise<SourceEntry> => {
  const entries = await list(options)

  if (entries.length === 0) {
    const lang = options.lang ?? 'en'
    const variant = options.variant ?? 'any'

    throw new Error(`No ZIM file found for language "${lang}" with variant "${variant}"`)
  }

  // Sort by date descending and pick the most recent
  const sorted = entries
    .filter(e => e.date !== null)
    .sort((a, b) => (b.date ?? '').localeCompare(a.date ?? ''))

  return sorted[0] ?? entries[0]
}

/**
 * Returns the sorted list of language codes available in the ZIM directory.
 *
 * @returns Array of language codes, e.g. `["de", "en", "fr"]`.
 */
const getLanguages = async (): Promise<string[]> => {
  const entries = await fetchEntries()

  return extractLanguages(entries)
}

/**
 * Returns the sorted list of size variants available for a given language.
 *
 * @param lang - Language code to filter by, e.g. `"en"`.
 * @returns Array of variant names, e.g. `["maxi", "mini", "nopic"]`.
 */
const getVariants = async (lang: string): Promise<string[]> => {
  const entries = await fetchEntries()

  return extractVariants(entries, lang)
}

const zimSource: SourceProvider & {
  getLanguages: () => Promise<string[]>,
  getVariants: (lang: string) => Promise<string[]>,
} = {
  list,
  resolve,
  getLanguages,
  getVariants,
}

export default zimSource
