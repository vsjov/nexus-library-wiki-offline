// Imports
// -----------------------------------------------------------------------------
// External
import { describe, it, expect } from 'vitest'

// Internal
import validateUrl from '../validate-url.js'


// Tests
// -----------------------------------------------------------------------------
describe('Expect validateUrl', () => {
  describe('to accept valid URLs', () => {
    it('when URL uses HTTPS with a public hostname', () => {
      expect(() => validateUrl('https://download.kiwix.org/zim/wikipedia/')).not.toThrow()
    })

    it('when URL uses HTTPS with a public IP address', () => {
      expect(() => validateUrl('https://8.8.8.8/file.zim')).not.toThrow()
    })
  })

  describe('to reject non-HTTPS protocols', () => {
    it('when URL uses HTTP', () => {
      expect(() => validateUrl('http://download.kiwix.org/zim/wikipedia/')).toThrow(
        'Only HTTPS URLs are allowed'
      )
    })

    it('when URL uses FTP', () => {
      expect(() => validateUrl('ftp://files.example.com/dump.gz')).toThrow(
        'Only HTTPS URLs are allowed'
      )
    })

    it('when URL uses a javascript: scheme', () => {
      expect(() => validateUrl('javascript:alert(1)')).toThrow(
        'Only HTTPS URLs are allowed'
      )
    })
  })

  describe('to reject malformed URLs', () => {
    it('when URL is an empty string', () => {
      expect(() => validateUrl('')).toThrow('Invalid URL')
    })

    it('when URL has no scheme', () => {
      expect(() => validateUrl('download.kiwix.org/file.zim')).toThrow('Invalid URL')
    })
  })

  describe('to reject private and loopback addresses', () => {
    it('when URL targets localhost', () => {
      expect(() => validateUrl('https://localhost/admin')).toThrow(
        'private or local addresses'
      )
    })

    it('when URL targets 127.0.0.1', () => {
      expect(() => validateUrl('https://127.0.0.1/secret')).toThrow(
        'private or local addresses'
      )
    })

    it('when URL targets a 10.x.x.x address', () => {
      expect(() => validateUrl('https://10.0.0.1/internal')).toThrow(
        'private or local addresses'
      )
    })

    it('when URL targets a 192.168.x.x address', () => {
      expect(() => validateUrl('https://192.168.1.1/router')).toThrow(
        'private or local addresses'
      )
    })

    it('when URL targets a 172.16.x.x address', () => {
      expect(() => validateUrl('https://172.16.0.1/internal')).toThrow(
        'private or local addresses'
      )
    })

    it('when URL targets a 172.31.x.x address', () => {
      expect(() => validateUrl('https://172.31.255.255/internal')).toThrow(
        'private or local addresses'
      )
    })

    it('when URL targets a link-local address (169.254.x.x)', () => {
      expect(() => validateUrl('https://169.254.169.254/latest/meta-data')).toThrow(
        'private or local addresses'
      )
    })

    it('when URL targets IPv6 loopback ::1', () => {
      expect(() => validateUrl('https://[::1]/admin')).toThrow(
        'private or local addresses'
      )
    })
  })
})
