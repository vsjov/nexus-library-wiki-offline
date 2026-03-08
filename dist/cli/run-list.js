// Imports
// -----------------------------------------------------------------------------
// External
import pc from 'picocolors';
// Local
import { LANGUAGES } from '../config/languages.js';
import formatBytes from './utils/format-bytes.js';
import printTable from './utils/print-table.js';
import zimSource from '../sources/zim/zim-source.js';
import kiwixSource from '../sources/kiwix/kiwix-source.js';
import dumpsSource from '../sources/dumps/dumps-source.js';
// Functions
// -----------------------------------------------------------------------------
/**
 * Fetches and prints a formatted table of available files for the given content type.
 *
 * @param args - Parsed CLI arguments (uses `type`, `lang`, `variant`).
 */
const runList = async (args) => {
    console.log();
    if (args.type === 'zim') {
        const entries = await zimSource.list({ lang: args.lang, variant: args.variant });
        const rows = entries.map(e => [
            e.name,
            e.date ?? '-',
            e.size ? formatBytes(e.size) : '-',
        ]);
        printTable(['File', 'Date', 'Size'], rows);
        console.log(`\n${pc.dim(`${entries.length} files found`)}`);
    }
    else if (args.type === 'kiwix') {
        const entries = await kiwixSource.list();
        const rows = entries.map(e => [
            e.name,
            e.date ?? '-',
            e.size ? formatBytes(e.size) : '-',
        ]);
        printTable(['File', 'Version', 'Size'], rows);
    }
    else if (args.type === 'dump') {
        const lang = args.lang ?? 'en';
        const langName = LANGUAGES[lang] ?? lang;
        const entries = await dumpsSource.list({ lang, dumpType: args.variant });
        console.log(pc.dim(`Dumps for ${langName} (${lang}wiki/latest/):\n`));
        const rows = entries.map(e => [
            e.name,
            e.size ? formatBytes(e.size) : '-',
        ]);
        printTable(['File', 'Size'], rows);
        console.log(`\n${pc.dim(`${entries.length} files found`)}`);
    }
};
export default runList;
//# sourceMappingURL=run-list.js.map