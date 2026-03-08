// Imports
// -----------------------------------------------------------------------------
// External
import { select } from '@inquirer/prompts'
import pc from 'picocolors'

// Local
import formatBytes from '../utils/format-bytes.js'
import detectPlatform from '../utils/detect-platform.js'
import kiwixSource from '../../sources/kiwix/kiwix-source.js'

// Types
import type { SourceEntry } from '../../sources/types.js'


// Functions
// -----------------------------------------------------------------------------
/**
 * Guides the user through selecting a target OS and CPU architecture for Kiwix tools,
 * defaulting to the current platform when available.
 *
 * @returns Resolved Kiwix tools source entry, or `null` if the prompt flow is abandoned.
 */
const promptKiwixSelection = async (): Promise<SourceEntry | null> => {
  const platform = detectPlatform()

  const os = await select({
    message: 'Select target OS:',
    default: platform.os,
    choices: [
      { name: 'Linux', value: 'linux' },
      { name: 'macOS', value: 'macos' },
      { name: 'Windows', value: 'win' },
    ],
  }) as string

  const archChoices: Record<string, Array<{ name: string, value: string }>> = {
    linux: [
      { name: '64-bit Intel/AMD (x86_64)', value: 'x86_64' },
      { name: '64-bit ARM (aarch64)', value: 'aarch64' },
      { name: '32-bit ARM v8 (armv8)', value: 'armv8' },
      { name: '32-bit ARM hard-float (armhf)', value: 'armhf' },
      { name: '32-bit ARM v6 (armv6)', value: 'armv6' },
      { name: '32-bit Intel (i586)', value: 'i586' },
    ],
    macos: [
      { name: 'Apple Silicon (arm64)', value: 'arm64' },
      { name: '64-bit Intel (x86_64)', value: 'x86_64' },
    ],
    win: [
      { name: '64-bit Intel/AMD (x86_64)', value: 'x86_64' },
      { name: '32-bit Intel (i686)', value: 'i686' },
    ],
  }

  const defaultArch: Record<string, string> = {
    linux: platform.os === 'linux' ? platform.arch : 'x86_64',
    macos: platform.os === 'macos' ? platform.arch : 'arm64',
    win: platform.os === 'win' ? platform.arch : 'x86_64',
  }

  const arch = await select({
    message: 'Select CPU architecture:',
    default: defaultArch[os],
    choices: archChoices[os] ?? archChoices['linux'],
  }) as string

  console.log(pc.dim('\nFetching Kiwix tools release info...'))

  const entry = await kiwixSource.resolve({ os, arch })
  const sizeStr = entry.size ? ` (${formatBytes(entry.size)})` : ''
  console.log(pc.dim(`  -> ${entry.name}${sizeStr}`))

  return entry
}

export default promptKiwixSelection
