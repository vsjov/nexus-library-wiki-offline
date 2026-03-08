import type { ContentType } from '../sources/types.js';
/**
 * Arguments passed to `runManual`, derived from parsed CLI flags.
 */
export type ManualArgs = {
    /** Content type to operate on: `"zim"`, `"kiwix"`, or `"dump"`. */
    type: ContentType;
    /** Wikipedia language code, e.g. `"en"`. Required for ZIM and dump types. */
    lang?: string;
    /** ZIM size variant (`"maxi"`, `"nopic"`, `"mini"`) or dump type identifier. */
    variant?: string;
    /** Target OS for Kiwix tools binary selection, e.g. `"linux"`. */
    os?: string;
    /** Target CPU architecture for Kiwix tools binary selection, e.g. `"x86_64"`. */
    arch?: string;
    /** Output directory path (may include leading `~`). */
    out: string;
    /** When `true`, prints available files instead of downloading. */
    list: boolean;
};
/**
 * Entry point for manual (non-interactive) mode.
 * Routes to `runList` when `--list` is set, otherwise to `runDownload`.
 *
 * @param args - Parsed CLI arguments.
 */
export declare const runManual: (args: ManualArgs) => Promise<void>;
//# sourceMappingURL=manual.d.ts.map