// Dump patterns
// -----------------------------------------------------------------------------
/**
 * Maps known Wikimedia dump type identifiers to their filename patterns.
 * Each key is a human-readable dump type name; the value is a regex that
 * matches the corresponding filename suffix in a Wikimedia dump directory listing.
 */
const KNOWN_DUMP_PATTERNS = {
    'pages-articles': /pages-articles\d*\.xml\.bz2$/,
    'pages-meta-current': /pages-meta-current\.xml\.bz2$/,
    abstract: /abstract\.xml\.gz$/,
    'all-titles': /all-titles-in-ns0\.gz$/,
    pagelinks: /pagelinks\.sql\.gz$/,
    categorylinks: /categorylinks\.sql\.gz$/,
    'stub-meta-history': /stub-meta-history\.xml\.gz$/,
};
export default KNOWN_DUMP_PATTERNS;
//# sourceMappingURL=dump-patterns.js.map