/**
 * Follows HTTP redirects via HEAD requests and returns the final resolved URL.
 *
 * @param url - Initial URL to resolve.
 * @param redirectCount - Current redirect depth (used internally for recursion).
 * @returns Final URL after all redirects have been followed.
 * @throws If more than `MAX_REDIRECTS` redirects are encountered.
 */
declare const resolveRedirects: (url: string, redirectCount?: number) => Promise<string>;
export default resolveRedirects;
//# sourceMappingURL=resolve-redirects.d.ts.map