// Imports
// -----------------------------------------------------------------------------
// NodeJS
import os from 'node:os'
import path from 'node:path'


// Functions
// -----------------------------------------------------------------------------
/**
 * Expands a leading tilde in a file path to the current user's home directory
 * and normalizes path separators for the current platform.
 *
 * @param filePath - Path that may start with "~/" or "~\".
 * @returns Absolute, normalized path.
 */
const expandTilde = (filePath: string): string => {
  const expanded = (filePath === '~' || filePath.startsWith('~/') || filePath.startsWith('~\\'))
    ? os.homedir() + filePath.slice(1)
    : filePath

  return path.normalize(expanded)
}

export default expandTilde
