// Imports
// -----------------------------------------------------------------------------
// Local
import { USER_AGENT } from '../../config/constants.js'
import { fetchHtml } from '../fetch-html.js'
import { parseDumpListing } from './parse-dump-listing.js'
import { filterDumpsByType } from './filter-dumps-by-type.js'
import { extractDumpTypes } from './extract-dump-types.js'

// Types
import type { SourceEntry, SourceProvider, ListOptions, ResolveOptions } from '../types.js'


// Source
// -----------------------------------------------------------------------------
/**
 * Returns all dump entries for a given language, optionally filtered by dump type.
 * Fetches the Wikimedia dump index page fresh on every call (no caching).
 *
 * @param options - Filter options: `lang` (language code, default `"en"`) and/or `dumpType`.
 * @returns Array of matching dump source entries.
 */
const list = async (options: ListOptions = {}): Promise<SourceEntry[]> => {
  const lang = options.lang ?? 'en'
  const url = `https://dumps.wikimedia.org/${lang}wiki/latest/`
  const html = await fetchHtml(url, USER_AGENT)
  const entries = parseDumpListing(html, lang)

  if (options.dumpType) {
    return filterDumpsByType(entries, options.dumpType)
  }

  return entries
}

/**
 * Resolves the first dump entry matching the given language and dump type.
 *
 * @param options - Filter options: `lang` (language code) and/or `dumpType`.
 * @returns The first matching dump source entry.
 * @throws If no matching dump is found.
 */
const resolve = async (options: ResolveOptions = {}): Promise<SourceEntry> => {
  const entries = await list(options)

  if (entries.length === 0) {
    const lang = options.lang ?? 'en'
    const dumpType = options.dumpType ?? 'any'

    throw new Error(`No dump file found for language "${lang}" with type "${dumpType}"`)
  }

  return entries[0]
}

/**
 * Returns all dump type identifiers that are present in the listing for a given language.
 *
 * @param lang - Language code, e.g. `"en"`.
 * @returns Array of known dump type keys found in the listing, e.g. `["pages-articles", "pagelinks"]`.
 */
const getAvailableTypes = async (lang: string): Promise<string[]> => {
  const entries = await list({ lang })

  return extractDumpTypes(entries)
}

const dumpsSource: SourceProvider & {
  getAvailableTypes: (lang: string) => Promise<string[]>,
} = {
  list,
  resolve,
  getAvailableTypes,
}

export default dumpsSource
