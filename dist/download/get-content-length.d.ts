/**
 * Sends a HEAD request to retrieve the `Content-Length` header of a URL.
 *
 * @param url - URL to inspect.
 * @returns File size in bytes, or `null` if the header is absent or unparseable.
 */
declare const getContentLength: (url: string) => Promise<number | null>;
export default getContentLength;
//# sourceMappingURL=get-content-length.d.ts.map