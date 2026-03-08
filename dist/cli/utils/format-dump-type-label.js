// Functions
// -----------------------------------------------------------------------------
/**
 * Returns a human-readable label for a Wikimedia dump type.
 * Falls back to the raw type string for unknown values.
 *
 * @param type - Dump type identifier, e.g. `"pages-articles"`, `"pagelinks"`.
 * @returns Descriptive label including a short explanation.
 */
const formatDumpTypeLabel = (type) => {
    const labels = {
        'pages-articles': 'pages-articles - All article text (recommended)',
        'pages-meta-current': 'pages-meta-current - Articles with metadata',
        abstract: 'abstract - Article abstracts only',
        'all-titles': 'all-titles - All article titles',
        pagelinks: 'pagelinks - Page link graph (SQL)',
        categorylinks: 'categorylinks - Category relationships (SQL)',
        'stub-meta-history': 'stub-meta-history - Revision stubs',
    };
    return labels[type] ?? type;
};
export default formatDumpTypeLabel;
//# sourceMappingURL=format-dump-type-label.js.map