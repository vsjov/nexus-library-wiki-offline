// Types
// -----------------------------------------------------------------------------
import type { SourceEntry } from '../types.js'


// Functions
// -----------------------------------------------------------------------------
/**
 * Extracts the set of unique size variants available for a given language.
 *
 * @param entries - ZIM source entries to scan.
 * @param lang - Language code to filter by, e.g. "en".
 * @returns Sorted array of variant names, e.g. ["maxi", "mini", "nopic"].
 */
export const extractVariants = (entries: SourceEntry[], lang: string): string[] => {
  const variants = new Set<string>()
  const escapedLang = lang.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  const pattern = new RegExp(`^wikipedia_${escapedLang}_all_([^_]+)_`)

  for (const entry of entries) {
    // Pattern: wikipedia_{lang}_all_{variant}_{date}.zim
    const match = entry.name.match(pattern)

    if (match) variants.add(match[1])
  }

  return Array.from(variants).sort()
}
