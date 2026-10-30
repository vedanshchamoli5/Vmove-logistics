import { describe, it, expect } from 'vitest';
import {
  base32Encode,
  base32Decode,
  generateTOTPSecret,
  generateTOTPCode,
  verifyTOTPCode,
  getTOTPUri,
} from '../lib/totp';

describe('Enterprise TOTP RFC 6238 Engine', () => {
  it('correctly encodes and decodes Base32 without data loss', () => {
    const raw = new Uint8Array([72, 101, 108, 108, 111, 33]); // "Hello!"
    const encoded = base32Encode(raw);
    const decoded = base32Decode(encoded);
    expect(decoded).toEqual(raw);
  });

  it('generates a standard 32-character Base32 secret', () => {
    const secret = generateTOTPSecret();
    expect(secret.length).toBe(32);
    expect(/^[A-Z2-7]+$/.test(secret)).toBe(true);
  });

  it('generates a 6-digit numeric TOTP code', () => {
    const secret = 'JBSWY3DPEHPK3PXPJBSWY3DPEHPK3PXP';
    const code = generateTOTPCode(secret);
    expect(code).toMatch(/^\d{6}$/);
  });

  it('successfully verifies a valid TOTP code generated within current window', () => {
    const secret = generateTOTPSecret();
    const now = Date.now();
    const code = generateTOTPCode(secret, now);
    const verified = verifyTOTPCode(secret, code, now);
    expect(verified).toBe(true);
  });

  it('accepts codes with ±1 time-step clock drift (30 seconds before or after)', () => {
    const secret = generateTOTPSecret();
    const now = Date.now();
    const codePast = generateTOTPCode(secret, now - 30000);
    const codeFuture = generateTOTPCode(secret, now + 30000);

    expect(verifyTOTPCode(secret, codePast, now, 1)).toBe(true);
    expect(verifyTOTPCode(secret, codeFuture, now, 1)).toBe(true);
  });

  it('rejects an incorrect code or expired code beyond tolerance window', () => {
    const secret = generateTOTPSecret();
    const now = Date.now();
    expect(verifyTOTPCode(secret, '999999', now)).toBe(false);
    expect(verifyTOTPCode(secret, '000000', now)).toBe(false);

    // Code from 2 hours ago
    const ancientCode = generateTOTPCode(secret, now - 7200000);
    expect(verifyTOTPCode(secret, ancientCode, now, 1)).toBe(false);
  });

  it('generates a valid otpauth:// URI compliant with Google Authenticator', () => {
    const secret = 'JBSWY3DPEHPK3PXP';
    const uri = getTOTPUri(secret, 'admin@vmovelogistics.com', 'Vmove Logistics');
    expect(uri).toContain('otpauth://totp/Vmove%20Logistics:admin%40vmovelogistics.com');
    expect(uri).toContain('secret=JBSWY3DPEHPK3PXP');
    expect(uri).toContain('digits=6');
    expect(uri).toContain('period=30');
  });
});
