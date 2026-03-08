// Imports
// -----------------------------------------------------------------------------
// Local
import KNOWN_DUMP_PATTERNS from './dump-patterns.js'

// Types
import type { SourceEntry } from '../types.js'


// Functions
// -----------------------------------------------------------------------------
/**
 * Returns all known dump type identifiers present in the given entries.
 *
 * @param entries - Dump source entries to scan.
 * @returns Array of dump type keys that matched at least one entry, in insertion order.
 */
export const extractDumpTypes = (entries: SourceEntry[]): string[] => {
  const found = new Set<string>()

  for (const [type, pattern] of Object.entries(KNOWN_DUMP_PATTERNS)) {
    if (entries.some(e => pattern.test(e.name))) {
      found.add(type)
    }
  }

  return Array.from(found)
}
