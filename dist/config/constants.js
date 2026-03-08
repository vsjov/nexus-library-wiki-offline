// Download source base URLs
export const ZIM_BASE_URL = 'https://download.kiwix.org/zim/wikipedia/';
export const KIWIX_TOOLS_BASE_URL = 'https://download.kiwix.org/release/kiwix-tools/';
export const DUMPS_BASE_URL = 'https://dumps.wikimedia.org/';
// Default output directory
export const DEFAULT_OUTPUT_DIR = '~/Downloads/wiki-offline';
// HTTP settings
export const USER_AGENT = 'wiki-offline/1.0.0 (https://github.com/user/wiki-offline)';
export const MAX_REDIRECTS = 5;
export const MAX_RETRIES = 3;
export const RETRY_DELAY_MS = 1000;
export const FETCH_TIMEOUT_MS = 30000;
// Progress bar settings
export const PROGRESS_ETA_BUFFER = 50;
// Security settings
export const MAX_RESPONSE_SIZE = 10 * 1024 * 1024; // 10 MB — cap HTML listing responses
export const MIN_TIMEOUT_MS = 1000; // Minimum allowed request timeout
//# sourceMappingURL=constants.js.map