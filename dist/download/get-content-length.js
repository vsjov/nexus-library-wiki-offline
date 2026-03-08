// Imports
// -----------------------------------------------------------------------------
// NodeJS
import https from 'node:https';
import http from 'node:http';
// Local
import { FETCH_TIMEOUT_MS, USER_AGENT } from '../config/constants.js';
// Helpers
// -----------------------------------------------------------------------------
const getClient = (url) => url.startsWith('https') ? https : http;
// Functions
// -----------------------------------------------------------------------------
/**
 * Sends a HEAD request to retrieve the `Content-Length` header of a URL.
 *
 * @param url - URL to inspect.
 * @returns File size in bytes, or `null` if the header is absent or unparseable.
 */
const getContentLength = (url) => {
    return new Promise(resolve => {
        const req = getClient(url).request(url, { method: 'HEAD', headers: { 'User-Agent': USER_AGENT } }, res => {
            const len = res.headers['content-length'];
            res.resume();
            const parsed = len ? parseInt(len, 10) : null;
            resolve(parsed !== null && !isNaN(parsed) ? parsed : null);
        });
        req.setTimeout(FETCH_TIMEOUT_MS, () => {
            req.destroy(new Error(`Request timed out: ${url}`));
        });
        req.on('error', () => resolve(null));
        req.end();
    });
};
export default getContentLength;
//# sourceMappingURL=get-content-length.js.map