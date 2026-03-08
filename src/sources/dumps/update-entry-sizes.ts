// Types
// -----------------------------------------------------------------------------
import type { SourceEntry } from '../types.js'


// Helpers
// -----------------------------------------------------------------------------
const parseSizeBytes = (sizeText: string): number | null => {
  const match = sizeText.trim().match(/^(\d+)$/)

  return match ? parseInt(match[1], 10) : null
}


// Functions
// -----------------------------------------------------------------------------
/**
 * Returns a new array of entries with sizes populated from a filename-to-size-bytes map.
 * Entries whose filename is not in `sizeMap` retain their original size.
 *
 * @param entries - Dump source entries to update.
 * @param sizeMap - Map of filename to raw byte-count string.
 * @returns New array of entries with sizes filled in where available.
 */
export const updateEntrySizes = (entries: SourceEntry[], sizeMap: Record<string, string>): SourceEntry[] => {
  return entries.map(entry => ({
    ...entry,
    size: parseSizeBytes(sizeMap[entry.name] ?? '') ?? entry.size,
  }))
}
