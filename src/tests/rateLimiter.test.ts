import { describe, it, expect } from 'vitest';
import { rateLimiter } from '../lib/rateLimiter';

describe('Rate Limiter & Anti-Spam Security', () => {
  it('validates standard 10-digit Indian mobile numbers starting with 6, 7, 8, or 9', () => {
    expect(rateLimiter.validateIndianMobile('9820112233')).toBe(true);
    expect(rateLimiter.validateIndianMobile('7906308640')).toBe(true);
    expect(rateLimiter.validateIndianMobile('+91 7906308640')).toBe(true);
    expect(rateLimiter.validateIndianMobile('8888888888')).toBe(true);
    expect(rateLimiter.validateIndianMobile('6123456789')).toBe(true);
  });

  it('validates Indian corporate landline numbers with standard STD codes', () => {
    expect(rateLimiter.validateIndianMobile('022-26123456')).toBe(true); // Mumbai 022 + 8 digits
    expect(rateLimiter.validateIndianMobile('011-23456789')).toBe(true); // Delhi 011 + 8 digits
    expect(rateLimiter.validateIndianMobile('080-41234567')).toBe(true); // Bengaluru 080 + 8 digits
    expect(rateLimiter.validateIndianMobile('0124-4567890')).toBe(true); // Gurugram 0124 + 7 digits
  });

  it('rejects invalid numbers, short strings, and non-digits', () => {
    expect(rateLimiter.validateIndianMobile('1234567890')).toBe(false);
    expect(rateLimiter.validateIndianMobile('0000000000')).toBe(false);
    expect(rateLimiter.validateIndianMobile('98765')).toBe(false);
    expect(rateLimiter.validateIndianMobile('abcdefghij')).toBe(false);
  });

  it('detects honeypot trap fields filled by spam bots', () => {
    expect(rateLimiter.isHoneypotClean('')).toBe(true);
    expect(rateLimiter.isHoneypotClean('   ')).toBe(true);
    expect(rateLimiter.isHoneypotClean('automated-bot-token')).toBe(false);
  });
});
