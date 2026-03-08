// Imports
// -----------------------------------------------------------------------------
// External
import { select } from '@inquirer/prompts'
import pc from 'picocolors'

// Local
import { LANGUAGES } from '../../config/languages.js'
import formatBytes from '../utils/format-bytes.js'
import formatVariantLabel from '../utils/format-variant-label.js'
import zimSource from '../../sources/zim/zim-source.js'

// Types
import type { SourceEntry } from '../../sources/types.js'


// Functions
// -----------------------------------------------------------------------------
/**
 * Guides the user through selecting a ZIM language and size variant,
 * then resolves and returns the most recent matching ZIM entry.
 *
 * @returns Resolved ZIM source entry, or `null` if no variants are available for the chosen language.
 */
const promptZimSelection = async (): Promise<SourceEntry | null> => {
  console.log(pc.dim('\nFetching available ZIM files...'))

  const languages = await zimSource.getLanguages()

  const langChoices = languages.map(code => ({
    name: LANGUAGES[code] ? `${LANGUAGES[code]} (${code})` : code,
    value: code,
  }))

  const lang = await select({
    message: 'Select Wikipedia language:',
    choices: langChoices,
  }) as string

  const variants = await zimSource.getVariants(lang)

  if (variants.length === 0) {
    console.log(pc.yellow(`No ZIM variants found for language: ${lang}`))

    return null
  }

  const variantChoices = variants.map(v => ({
    name: formatVariantLabel(v),
    value: v,
  }))

  const variant = await select({
    message: 'Select ZIM size variant:',
    choices: variantChoices,
  }) as string

  const entry = await zimSource.resolve({ lang, variant })
  const sizeStr = entry.size ? ` (${formatBytes(entry.size)})` : ''
  console.log(pc.dim(`  -> ${entry.name}${sizeStr}`))

  return entry
}

export default promptZimSelection
