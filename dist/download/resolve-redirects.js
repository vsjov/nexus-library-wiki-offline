// Imports
// -----------------------------------------------------------------------------
// NodeJS
import https from 'node:https';
import http from 'node:http';
// Local
import { MAX_REDIRECTS, FETCH_TIMEOUT_MS, MIN_TIMEOUT_MS, USER_AGENT } from '../config/constants.js';
import validateUrl from '../config/validate-url.js';
// Helpers
// -----------------------------------------------------------------------------
const getClient = (url) => url.startsWith('https') ? https : http;
// Functions
// -----------------------------------------------------------------------------
/**
 * Follows HTTP redirects via HEAD requests and returns the final resolved URL.
 *
 * @param url - Initial URL to resolve.
 * @param redirectCount - Current redirect depth (used internally for recursion).
 * @returns Final URL after all redirects have been followed.
 * @throws If more than `MAX_REDIRECTS` redirects are encountered.
 */
const resolveRedirects = (url, redirectCount = 0) => {
    return new Promise((resolve, reject) => {
        if (redirectCount > MAX_REDIRECTS) {
            reject(new Error(`Too many redirects for: ${url}`));
            return;
        }
        const req = getClient(url).request(url, { method: 'HEAD', headers: { 'User-Agent': USER_AGENT } }, res => {
            const { statusCode, headers } = res;
            res.resume();
            if (statusCode && statusCode >= 300 && statusCode < 400 && headers.location) {
                try {
                    validateUrl(headers.location);
                }
                catch (err) {
                    reject(err);
                    return;
                }
                resolve(resolveRedirects(headers.location, redirectCount + 1));
                return;
            }
            resolve(url);
        });
        req.setTimeout(Math.max(MIN_TIMEOUT_MS, FETCH_TIMEOUT_MS), () => {
            req.destroy(new Error(`Request timed out: ${url}`));
        });
        req.on('error', reject);
        req.end();
    });
};
export default resolveRedirects;
//# sourceMappingURL=resolve-redirects.js.map