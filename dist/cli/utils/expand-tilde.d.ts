/**
 * Expands a leading tilde in a file path to the current user's home directory
 * and normalizes path separators for the current platform.
 *
 * @param filePath - Path that may start with "~/" or "~\".
 * @returns Absolute, normalized path.
 */
declare const expandTilde: (filePath: string) => string;
export default expandTilde;
//# sourceMappingURL=expand-tilde.d.ts.map