// Functions
// -----------------------------------------------------------------------------
/**
 * Detects the current platform and returns OS and CPU architecture
 * in the format used by Kiwix tools filenames.
 *
 * @returns Detected OS and architecture.
 */
const detectPlatform = () => {
    const nodeOs = process.platform;
    const nodeArch = process.arch;
    const os = mapOs(nodeOs);
    const arch = mapArch(nodeArch, os);
    return { os, arch };
};
/**
 * Maps a Node.js platform string to a Kiwix OS identifier.
 *
 * @param platform - Value of process.platform.
 * @returns Kiwix OS identifier.
 */
const mapOs = (platform) => {
    if (platform === 'darwin')
        return 'macos';
    if (platform === 'win32')
        return 'win';
    return 'linux';
};
/**
 * Maps a Node.js architecture string to a Kiwix architecture identifier.
 * The mapping is OS-aware: arm64 resolves to "arm64" on macOS and "aarch64" on Linux.
 *
 * @param arch - Value of process.arch.
 * @param os - Resolved Kiwix OS identifier.
 * @returns Kiwix architecture identifier.
 */
const mapArch = (arch, os) => {
    if (arch === 'x64')
        return 'x86_64';
    if (arch === 'ia32')
        return os === 'win' ? 'i686' : 'i586';
    if (arch === 'arm64')
        return os === 'macos' ? 'arm64' : 'aarch64';
    if (arch === 'arm')
        return 'armv6';
    console.warn(`Unknown CPU architecture "${arch}", defaulting to x86_64`);
    return 'x86_64';
};
export default detectPlatform;
//# sourceMappingURL=detect-platform.js.map