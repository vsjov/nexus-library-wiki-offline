/**
 * Validates that a URL is safe to request:
 * - Must use the HTTPS protocol.
 * - Must not target a private, loopback, or link-local address.
 *
 * @param url - URL string to validate.
 * @throws If the URL is malformed, uses a non-HTTPS protocol, or targets a private host.
 */
declare const validateUrl: (url: string) => void;
export default validateUrl;
//# sourceMappingURL=validate-url.d.ts.map