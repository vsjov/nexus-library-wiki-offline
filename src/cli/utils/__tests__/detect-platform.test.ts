// Imports
// -----------------------------------------------------------------------------
// External
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'

// Internal
import detectPlatform from '../detect-platform.js'


// Tests
// -----------------------------------------------------------------------------
describe('Expect detectPlatform', () => {
  const originalPlatform = process.platform
  const originalArch = process.arch

  afterEach(() => {
    Object.defineProperty(process, 'platform', { value: originalPlatform, configurable: true })
    Object.defineProperty(process, 'arch', { value: originalArch, configurable: true })
  })

  describe('to detect OS correctly', () => {
    it('when running on Linux', () => {
      Object.defineProperty(process, 'platform', { value: 'linux', configurable: true })
      Object.defineProperty(process, 'arch', { value: 'x64', configurable: true })
      expect(detectPlatform().os).toBe('linux')
    })

    it('when running on macOS', () => {
      Object.defineProperty(process, 'platform', { value: 'darwin', configurable: true })
      Object.defineProperty(process, 'arch', { value: 'x64', configurable: true })
      expect(detectPlatform().os).toBe('macos')
    })

    it('when running on Windows', () => {
      Object.defineProperty(process, 'platform', { value: 'win32', configurable: true })
      Object.defineProperty(process, 'arch', { value: 'x64', configurable: true })
      expect(detectPlatform().os).toBe('win')
    })
  })

  describe('to detect arch correctly', () => {
    beforeEach(() => {
      Object.defineProperty(process, 'platform', { value: 'linux', configurable: true })
    })

    it('when running on x64', () => {
      Object.defineProperty(process, 'arch', { value: 'x64', configurable: true })
      expect(detectPlatform().arch).toBe('x86_64')
    })

    it('when running on arm64', () => {
      Object.defineProperty(process, 'arch', { value: 'arm64', configurable: true })
      expect(detectPlatform().arch).toBe('aarch64')
    })

    it('when running on ia32', () => {
      Object.defineProperty(process, 'arch', { value: 'ia32', configurable: true })
      expect(detectPlatform().arch).toBe('i586') // ia32 → i586 on Linux; i686 is Windows-only
    })

    it('when running on arm', () => {
      Object.defineProperty(process, 'arch', { value: 'arm', configurable: true })
      expect(detectPlatform().arch).toBe('armv6')
    })
  })

  describe('to return valid PlatformInfo shape', () => {
    it('when called on current platform', () => {
      vi.restoreAllMocks()
      const result = detectPlatform()
      expect(result).toHaveProperty('os')
      expect(result).toHaveProperty('arch')
      expect(['linux', 'macos', 'win']).toContain(result.os)
      expect(['x86_64', 'arm64', 'aarch64', 'armv6', 'i586', 'i686']).toContain(result.arch)
    })
  })
})
