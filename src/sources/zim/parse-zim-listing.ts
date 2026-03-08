// Imports
// -----------------------------------------------------------------------------
// Local
import { ZIM_BASE_URL } from '../../config/constants.js'
import parseSizeText from '../parse-size-text.js'

// Types
import type { SourceEntry } from '../types.js'


// Helpers
// -----------------------------------------------------------------------------
const extractDateFromFilename = (filename: string): string | null => {
  const match = filename.match(/(\d{4}-\d{2})\.zim$/)

  return match ? match[1] : null
}


// Functions
// -----------------------------------------------------------------------------
/**
 * Parses an Apache autoindex HTML page from download.kiwix.org/zim/wikipedia/
 * and returns all ZIM file entries found.
 *
 * @param html - Raw HTML of the directory listing page.
 * @returns Array of source entries for each ZIM file.
 */
export const parseZimListing = (html: string): SourceEntry[] => {
  const entries: SourceEntry[] = []
  // Match anchor tags with ZIM filenames
  const rowPattern = /<a href="(wikipedia_[^"]+\.zim)"[^>]*>[^<]*<\/a>\s*([^<\n]*)/gi
  let match: RegExpExecArray | null

  while ((match = rowPattern.exec(html)) !== null) {
    const name = match[1]
    const rest = match[2] ?? ''
    // Try to extract size from text after the link (Apache autoindex format)
    const sizeMatch = rest.match(/([\d.]+\s*[KMGT]?)\s*$/)
    const size = sizeMatch ? parseSizeText(sizeMatch[1]) : null

    entries.push({
      name,
      url: `${ZIM_BASE_URL}${name}`,
      size,
      date: extractDateFromFilename(name),
    })
  }

  return entries
}
