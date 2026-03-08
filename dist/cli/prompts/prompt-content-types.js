// Imports
// -----------------------------------------------------------------------------
// External
import { checkbox } from '@inquirer/prompts';
// Functions
// -----------------------------------------------------------------------------
/**
 * Presents a checkbox prompt for selecting content types (ZIM, Kiwix, Dumps).
 *
 * @returns Object with boolean flags for each selected content type.
 */
const promptContentTypes = async () => {
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
    });
    return {
        zim: selected.includes('zim'),
        kiwix: selected.includes('kiwix'),
        dump: selected.includes('dump'),
    };
};
export default promptContentTypes;
//# sourceMappingURL=prompt-content-types.js.map