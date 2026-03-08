// Imports
// -----------------------------------------------------------------------------
// External
import pc from 'picocolors'


// Functions
// -----------------------------------------------------------------------------
/**
 * Prints a formatted table to stdout with bold column headers and aligned columns.
 *
 * @param headers - Column header labels.
 * @param rows - Table rows, each containing one string per column.
 */
const printTable = (headers: string[], rows: string[][]): void => {
  const colWidths = headers.map((h, i) =>
    Math.max(h.length, ...rows.map(r => (r[i] ?? '').length))
  )

  const separator = colWidths.map(w => '-'.repeat(w)).join('-+-')
  const headerRow = headers.map((h, i) => h.padEnd(colWidths[i] ?? 0)).join(' | ')

  console.log(pc.bold(headerRow))
  console.log(separator)

  for (const row of rows) {
    console.log(row.map((cell, i) => cell.padEnd(colWidths[i] ?? 0)).join(' | '))
  }
}

export default printTable
