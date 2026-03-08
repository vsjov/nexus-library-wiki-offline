// Imports
// -----------------------------------------------------------------------------
// NodeJS
import { dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

// Types
import type { URL } from 'node:url'


// Functions
// -----------------------------------------------------------------------------
/**
 * ES6 `__dirname` polyfill
 *
 * @param fileLocation - Use `import.meta.url`
 * @returns Directory path
 */
export const _dirname = (fileLocation: URL | string) => {
  return dirname(fileURLToPath(fileLocation))
}

export default _dirname
