// Functions
// -----------------------------------------------------------------------------
/**
 * Returns a human-readable label for a ZIM size variant.
 * Falls back to the raw variant string for unknown values.
 *
 * @param variant - ZIM variant identifier, e.g. `"maxi"`, `"nopic"`, `"mini"`.
 * @returns Descriptive label including size estimate.
 */
const formatVariantLabel = (variant) => {
    const labels = {
        maxi: 'maxi - Full Wikipedia with images (~80+ GB)',
        nopic: 'nopic - Wikipedia without images (~20 GB)',
        mini: 'mini - Small subset (~2 GB)',
    };
    return labels[variant] ?? variant;
};
export default formatVariantLabel;
//# sourceMappingURL=format-variant-label.js.map