// Functions
// -----------------------------------------------------------------------------
/**
 * Parses a human-readable size string from an Apache autoindex listing into bytes.
 *
 * @param sizeText - Size string such as "1.2G" or "512K".
 * @returns Size in bytes, or null if the string cannot be parsed.
 */
const parseSizeText = (sizeText) => {
    const cleaned = sizeText.trim();
    const match = cleaned.match(/^([\d.]+)\s*(K|M|G|T)?$/i);
    if (!match)
        return null;
    const value = parseFloat(match[1]);
    const unit = (match[2] ?? '').toUpperCase();
    const multipliers = {
        '': 1,
        K: 1024,
        M: 1024 * 1024,
        G: 1024 * 1024 * 1024,
        T: 1024 * 1024 * 1024 * 1024,
    };
    return Math.round(value * (multipliers[unit] ?? 1));
};
export default parseSizeText;
//# sourceMappingURL=parse-size-text.js.map