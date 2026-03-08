// Imports
// -----------------------------------------------------------------------------
// External
import cliProgress from 'cli-progress'
import pc from 'picocolors'

// Local
import formatBytes from '../cli/utils/format-bytes.js'

// Types
import type { SingleBar } from 'cli-progress'


// Types
// -----------------------------------------------------------------------------
/**
 * Interface for controlling a CLI download progress bar.
 * Created by `createProgressReporter` and passed to the download engine.
 */
export type ProgressReporter = {
  /** Updates the progress bar with the latest downloaded byte count and current speed. */
  update: (downloaded: number, speed: number) => void,
  /** Marks the download as complete and stops the progress bar. */
  stop: () => void,
  /** Stops the progress bar without marking it as complete (used on error). */
  fail: () => void,
}


// Functions
// -----------------------------------------------------------------------------
/**
 * Creates a `cli-progress` bar for a single file download.
 * If `totalBytes` is unknown (`null` or `0`), an indeterminate bar is shown.
 *
 * @param filename - Display name shown in the progress bar.
 * @param totalBytes - Expected file size in bytes, or `null` if unknown.
 * @returns A `ProgressReporter` with `update`, `stop`, and `fail` methods.
 */
export const createProgressReporter = (filename: string, totalBytes: number | null): ProgressReporter => {
  const isIndeterminate = totalBytes === null || totalBytes === 0

  const bar: SingleBar = new cliProgress.SingleBar(
    {
      format: isIndeterminate
        ? `${pc.cyan('{bar}')} | ${pc.bold('{filename}')} | {downloaded} | {speed}/s`
        : `${pc.cyan('{bar}')} | ${pc.bold('{filename}')} | {percentage}% | {downloaded}/{total} | {speed}/s | ETA: {eta_formatted}`,
      barCompleteChar: '=',
      barIncompleteChar: ' ',
      hideCursor: true,
      etaBuffer: 50,
    },
    cliProgress.Presets.shades_classic
  )

  bar.start(totalBytes ?? 100, 0, {
    filename,
    downloaded: formatBytes(0),
    total: isIndeterminate ? '?' : formatBytes(totalBytes ?? 0),
    speed: '0 B',
  })

  const update = (downloaded: number, speed: number) => {
    bar.update(isIndeterminate ? 50 : downloaded, {
      filename,
      downloaded: formatBytes(downloaded),
      total: isIndeterminate ? '?' : formatBytes(totalBytes ?? 0),
      speed: formatBytes(speed),
    })
  }

  const stop = () => {
    bar.update(totalBytes ?? 100, {
      filename,
      downloaded: isIndeterminate ? 'done' : formatBytes(totalBytes ?? 0),
      total: isIndeterminate ? '?' : formatBytes(totalBytes ?? 0),
      speed: '0 B',
    })

    bar.stop()
  }

  const fail = () => {
    bar.stop()
  }

  return { update, stop, fail }
}
