// Imports
// -----------------------------------------------------------------------------
// External
import { checkbox } from '@inquirer/prompts'


// Types
// -----------------------------------------------------------------------------
/**
 * Flags indicating which content types the user selected in the initial checkbox prompt.
 */
export type SelectedContent = {
  /** Whether the user selected the ZIM archive download option. */
  zim: boolean,
  /** Whether the user selected the Kiwix tools download option. */
  kiwix: boolean,
  /** Whether the user selected the database dump download option. */
  dump: boolean,
}


// Functions
// -----------------------------------------------------------------------------
/**
 * Presents a checkbox prompt for selecting content types (ZIM, Kiwix, Dumps).
 *
 * @returns Object with boolean flags for each selected content type.
 */
const promptContentTypes = async (): Promise<SelectedContent> => {
  const selected = await checkbox({
    message: 'What do you want to download?',
    choices: [
      {
        name: 'Wikipedia ZIM archive (for Kiwix reader)',
        value: 'zim',
      },
      {
        name: 'Kiwix reader/server (to browse ZIM files)',
        value: 'kiwix',
      },
      {
        name: 'Wikipedia database dump (raw XML/SQL data)',
        value: 'dump',
      },
    ],
  }) as string[]

  return {
    zim: selected.includes('zim'),
    kiwix: selected.includes('kiwix'),
    dump: selected.includes('dump'),
  }
}

export default promptContentTypes
