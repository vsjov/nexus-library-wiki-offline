/**
 * Fetches the HTML body of a URL, following up to MAX_REDIRECTS redirects.
 *
 * @param url - URL to fetch.
 * @param userAgent - User-Agent header value to send with the request.
 * @param redirectCount - Current redirect depth (used internally for recursion).
 * @returns Resolved HTML string.
 */
export declare const fetchHtml: (url: string, userAgent: string, redirectCount?: number) => Promise<string>;
//# sourceMappingURL=fetch-html.d.ts.map