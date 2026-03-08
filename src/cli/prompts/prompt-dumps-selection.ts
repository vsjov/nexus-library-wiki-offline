// Imports
// -----------------------------------------------------------------------------
// External
import { checkbox, select } from '@inquirer/prompts'
import pc from 'picocolors'

// Local
import { LANGUAGES } from '../../config/languages.js'
import formatDumpTypeLabel from '../utils/format-dump-type-label.js'
import dumpsSource from '../../sources/dumps/dumps-source.js'

// Types
import type { SourceEntry } from '../../sources/types.js'


// Functions
// -----------------------------------------------------------------------------
/**
 * Guides the user through selecting a language and one or more dump types,
 * then resolves and returns source entries for each selected type.
 *
 * @returns Array of resolved dump source entries for the selected types.
 */
const promptDumpsSelection = async (): Promise<SourceEntry[]> => {
  const langChoices = Object.entries(LANGUAGES).map(([code, name]) => ({
    name: `${name} (${code})`,
    value: code,
  }))

  const lang = await select({
    message: 'Select Wikipedia language for database dump:',
    choices: langChoices,
  }) as string

  console.log(pc.dim(`\nFetching available dumps for ${lang}wiki...`))

  const availableTypes = await dumpsSource.getAvailableTypes(lang)

  if (availableTypes.length === 0) {
    console.log(pc.yellow(`No dumps found for language: ${lang}`))

    return []
  }

  const typeChoices = availableTypes.map(type => ({
    name: formatDumpTypeLabel(type),
    value: type,
  }))

  const selectedTypes = await checkbox({
    message: 'Select dump types to download:',
    choices: typeChoices,
  }) as string[]

  const entries: SourceEntry[] = []

  for (const dumpType of selectedTypes) {
    const entry = await dumpsSource.resolve({ lang, dumpType })
    entries.push(entry)
  }

  return entries
}

export default promptDumpsSelection
