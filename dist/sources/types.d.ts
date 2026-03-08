/** A single downloadable file discovered from a source listing. */
export type SourceEntry = {
    /** Filename on the server. */
    name: string;
    /** Full download URL. */
    url: string;
    /** File size in bytes, or null if unknown. */
    size: number | null;
    /** ISO date string (YYYY-MM) or version label, or null if unavailable. */
    date: string | null;
};
/** Options for filtering a source listing. */
export type ListOptions = {
    /** Wikipedia language code, e.g. "en" or "de". */
    lang?: string;
    /** ZIM size variant, e.g. "mini", "nopic", "maxi". */
    variant?: string;
    /** Wikimedia dump type, e.g. "pages-articles". */
    dumpType?: string;
};
/** Options for resolving a single entry from a source. */
export type ResolveOptions = ListOptions & {
    /** Whether to resolve only the latest available version. */
    latest?: boolean;
    /** Target operating system for Kiwix tools, e.g. "linux", "macos", "win". */
    os?: string;
    /** Target CPU architecture for Kiwix tools, e.g. "x86_64", "arm64". */
    arch?: string;
};
/** A data source capable of listing and resolving downloadable entries. */
export type SourceProvider = {
    /** Returns a filtered list of available entries. */
    list: (options?: ListOptions) => Promise<SourceEntry[]>;
    /** Resolves a single entry matching the given options. */
    resolve: (options?: ResolveOptions) => Promise<SourceEntry>;
};
/** The three supported content types. */
export type ContentType = 'zim' | 'kiwix' | 'dump';
/** Available ZIM size variants. */
export type ZimVariant = 'mini' | 'nopic' | 'maxi';
/** Available Wikimedia database dump types. */
export type DumpType = 'pages-articles' | 'pages-meta-current' | 'abstract' | 'all-titles' | 'pagelinks' | 'categorylinks' | 'stub-meta-history';
//# sourceMappingURL=types.d.ts.map