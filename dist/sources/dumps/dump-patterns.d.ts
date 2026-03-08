/**
 * Maps known Wikimedia dump type identifiers to their filename patterns.
 * Each key is a human-readable dump type name; the value is a regex that
 * matches the corresponding filename suffix in a Wikimedia dump directory listing.
 */
declare const KNOWN_DUMP_PATTERNS: Record<string, RegExp>;
export default KNOWN_DUMP_PATTERNS;
//# sourceMappingURL=dump-patterns.d.ts.map