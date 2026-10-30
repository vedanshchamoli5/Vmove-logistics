import { describe, it, expect, beforeEach } from 'vitest';
import { rateLimiter } from '../lib/rateLimiter';

describe('Rate Limiter & Anti-Spam Security', () => {
  it('validates standard 10-digit Indian mobile numbers starting with 6, 7, 8, or 9', () => {
    expect(rateLimiter.validateIndianMobile('9820112233')).toBe(true);
    expect(rateLimiter.validateIndianMobile('7906308640')).toBe(true);
    expect(rateLimiter.validateIndianMobile('+91 7906308640')).toBe(true);
    expect(rateLimiter.validateIndianMobile('8888888888')).toBe(true);
    expect(rateLimiter.validateIndianMobile('6123456789')).toBe(true);
  });

  it('rejects invalid mobile numbers and landlines', () => {
    expect(rateLimiter.validateIndianMobile('1234567890')).toBe(false);
    expect(rateLimiter.validateIndianMobile('022-26123456')).toBe(false);
    expect(rateLimiter.validateIndianMobile('98765')).toBe(false);
    expect(rateLimiter.validateIndianMobile('abcdefghij')).toBe(false);
  });

  it('detects honeypot trap fields filled by spam bots', () => {
    expect(rateLimiter.isHoneypotClean('')).toBe(true);
    expect(rateLimiter.isHoneypotClean('   ')).toBe(true);
    expect(rateLimiter.isHoneypotClean('automated-bot-token')).toBe(false);
  });
});
