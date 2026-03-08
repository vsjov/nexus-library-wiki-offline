// Imports
// -----------------------------------------------------------------------------
// Local
import { KIWIX_TOOLS_BASE_URL } from '../../config/constants.js'
import parseSizeText from '../parse-size-text.js'

// Types
import type { SourceEntry } from '../types.js'


// Helpers
// -----------------------------------------------------------------------------
const extractVersionFromFilename = (filename: string): string | null => {
  const match = filename.match(/kiwix-tools_[^-]+-[^-]+-(\d+\.\d+\.\d+(?:-\d+)?)/)

  return match ? match[1] : null
}


// Functions
// -----------------------------------------------------------------------------
/**
 * Parses an Apache autoindex HTML page from download.kiwix.org/release/kiwix-tools/
 * and returns all binary archive entries found. Source tarballs (.tar.xz) are excluded.
 *
 * @param html - Raw HTML of the directory listing page.
 * @returns Array of source entries for each Kiwix tools archive.
 */
export const parseKiwixListing = (html: string): SourceEntry[] => {
  const entries: SourceEntry[] = []
  // Match .tar.gz and .zip Kiwix tools archives (not source tarballs .tar.xz)
  const rowPattern = /<a href="(kiwix-tools_[^"]+\.(?:tar\.gz|zip))"[^>]*>[^<]*<\/a>\s*([^<\n]*)/gi
  let match: RegExpExecArray | null

  while ((match = rowPattern.exec(html)) !== null) {
    const name = match[1]
    const rest = match[2] ?? ''
    const sizeMatch = rest.match(/([\d.]+\s*[KMGT]?)\s*$/)
    const size = sizeMatch ? parseSizeText(sizeMatch[1]) : null

    entries.push({
      name,
      url: `${KIWIX_TOOLS_BASE_URL}${name}`,
      size,
      date: extractVersionFromFilename(name),
    })
  }

  return entries
}
