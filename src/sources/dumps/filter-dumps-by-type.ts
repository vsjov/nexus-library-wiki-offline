// Imports
// -----------------------------------------------------------------------------
// Local
import KNOWN_DUMP_PATTERNS from './dump-patterns.js'

// Types
import type { SourceEntry } from '../types.js'


// Functions
// -----------------------------------------------------------------------------
/**
 * Filters dump entries to only those matching the given known dump type.
 *
 * @param entries - Dump source entries to filter.
 * @param dumpType - Dump type key from `KNOWN_DUMP_PATTERNS`, e.g. `"pages-articles"`.
 * @returns Filtered entries that match the pattern, or an empty array if the type is unknown.
 */
export const filterDumpsByType = (entries: SourceEntry[], dumpType: string): SourceEntry[] => {
  const pattern = KNOWN_DUMP_PATTERNS[dumpType]

  if (!pattern) return []

  return entries.filter(e => pattern.test(e.name))
}
