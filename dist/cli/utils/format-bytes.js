// Functions
// -----------------------------------------------------------------------------
/**
 * Formats a byte count as a human-readable string with the appropriate unit.
 *
 * @param bytes - Number of bytes to format.
 * @param decimals - Number of decimal places to show. Defaults to 1.
 * @returns Formatted string such as "1.2 GB" or "512 KB".
 */
const formatBytes = (bytes, decimals = 1) => {
    if (bytes === 0)
        return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(decimals))} ${sizes[i]}`;
};
export default formatBytes;
//# sourceMappingURL=format-bytes.js.map