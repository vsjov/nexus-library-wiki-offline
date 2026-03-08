// Imports
// -----------------------------------------------------------------------------
// NodeJS
import { readFileSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

// External
import { describe, it, expect, beforeAll } from 'vitest'

// Internal
import { parseKiwixListing } from '../parse-kiwix-listing.js'
import { extractLatestVersion } from '../extract-latest-version.js'

// Types
import type { SourceEntry } from '../../types.js'


// Setup
// -----------------------------------------------------------------------------
const __dirname = dirname(fileURLToPath(import.meta.url))
let entries: SourceEntry[]

beforeAll(() => {
  const html = readFileSync(join(__dirname, 'mocks/kiwix-listing.html'), 'utf-8')
  entries = parseKiwixListing(html)
})


// Tests
// -----------------------------------------------------------------------------
describe('Expect parseKiwixListing', () => {
  describe('to parse binary entries only', () => {
    it('when HTML contains .tar.gz and .zip archives', () => {
      expect(entries.length).toBe(7)
    })

    it('when entry has correct URL', () => {
      const linux = entries.find(e => e.name === 'kiwix-tools_linux-x86_64-3.8.0.tar.gz')
      expect(linux?.url).toBe('https://download.kiwix.org/release/kiwix-tools/kiwix-tools_linux-x86_64-3.8.0.tar.gz')
    })

    it('when .tar.xz source tarballs are excluded', () => {
      const srcEntry = entries.find(e => e.name.endsWith('.tar.xz'))
      expect(srcEntry).toBeUndefined()
    })
  })
})

describe('Expect extractLatestVersion', () => {
  describe('to return the highest version number', () => {
    it('when multiple versions exist', () => {
      const latest = extractLatestVersion(entries)
      expect(latest).toBe('3.9.0')
    })
  })
})
