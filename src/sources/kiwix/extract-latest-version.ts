// Types
// -----------------------------------------------------------------------------
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
 * Returns the highest semantic version present among the given entries.
 * Version parts are compared numerically, including optional build suffixes (e.g. "3.8.1-2").
 *
 * @param entries - Kiwix source entries to scan.
 * @returns Latest version string, or null if no version could be determined.
 */
export const extractLatestVersion = (entries: SourceEntry[]): string | null => {
  const versions = entries
    .map(e => extractVersionFromFilename(e.name))
    .filter((v): v is string => v !== null)
    .sort((a, b) => {
      const aParts = a.split(/[-.]/).map(Number)
      const bParts = b.split(/[-.]/).map(Number)

      for (let i = 0; i < Math.max(aParts.length, bParts.length); i++) {
        const diff = (aParts[i] ?? 0) - (bParts[i] ?? 0)

        if (diff !== 0) return diff
      }

      return 0
    })

  return versions.at(-1) ?? null
}
