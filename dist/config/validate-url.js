// Imports
// -----------------------------------------------------------------------------
// NodeJS
import { URL } from 'node:url';
// Patterns covering private / loopback / link-local address ranges (IPv4 + IPv6).
const PRIVATE_HOST_PATTERNS = [
    /^localhost$/i,
    /^127\./,
    /^10\./,
    /^172\.(1[6-9]|2\d|3[01])\./,
    /^192\.168\./,
    /^169\.254\./,
    /^::1$/,
    /^fc00:/i,
    /^fe80:/i,
];
// URL.hostname wraps IPv6 addresses in brackets: "[::1]" — strip them before matching.
const isPrivateHost = (hostname) => {
    const normalized = hostname.startsWith('[') ? hostname.slice(1, -1) : hostname;
    return PRIVATE_HOST_PATTERNS.some(pattern => pattern.test(normalized));
};
/**
 * Validates that a URL is safe to request:
 * - Must use the HTTPS protocol.
 * - Must not target a private, loopback, or link-local address.
 *
 * @param url - URL string to validate.
 * @throws If the URL is malformed, uses a non-HTTPS protocol, or targets a private host.
 */
const validateUrl = (url) => {
    let parsed;
    try {
        parsed = new URL(url);
    }
    catch {
        throw new Error(`Invalid URL: ${url}`);
    }
    if (parsed.protocol !== 'https:') {
        throw new Error(`Only HTTPS URLs are allowed: ${url}`);
    }
    if (isPrivateHost(parsed.hostname)) {
        throw new Error(`Requests to private or local addresses are not allowed: ${url}`);
    }
};
export default validateUrl;
//# sourceMappingURL=validate-url.js.map