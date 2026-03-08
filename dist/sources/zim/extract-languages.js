// Functions
// -----------------------------------------------------------------------------
/**
 * Extracts the set of unique language codes present in a list of ZIM entries.
 *
 * @param entries - ZIM source entries to scan.
 * @returns Sorted array of language codes, e.g. ["de", "en", "fr"].
 */
export const extractLanguages = (entries) => {
    const langs = new Set();
    for (const entry of entries) {
        const match = entry.name.match(/^wikipedia_([a-z]+)_/);
        if (match)
            langs.add(match[1]);
    }
    return Array.from(langs).sort();
};
//# sourceMappingURL=extract-languages.js.map