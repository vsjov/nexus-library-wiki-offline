/** Operating system identifier used in Kiwix tools filenames. */
export type KiwixOs = 'linux' | 'macos' | 'win';
/** CPU architecture identifier used in Kiwix tools filenames. */
export type KiwixArch = 'x86_64' | 'arm64' | 'aarch64' | 'armv6' | 'armv8' | 'armhf' | 'i586' | 'i686';
/** Detected OS and CPU architecture in Kiwix-compatible format. */
export type PlatformInfo = {
    /** Kiwix OS identifier for the current platform. */
    os: KiwixOs;
    /** Kiwix architecture identifier for the current platform. */
    arch: KiwixArch;
};
/**
 * Detects the current platform and returns OS and CPU architecture
 * in the format used by Kiwix tools filenames.
 *
 * @returns Detected OS and architecture.
 */
declare const detectPlatform: () => PlatformInfo;
export default detectPlatform;
//# sourceMappingURL=detect-platform.d.ts.map