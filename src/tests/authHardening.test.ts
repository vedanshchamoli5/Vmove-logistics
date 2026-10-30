import { describe, it, expect, beforeEach } from 'vitest';
import { authService } from '../lib/auth';
import { sanitizeText, sanitizeHtml, sanitizePhone } from '../lib/sanitize';

describe('Authentication Hardening & Input Sanitization Suite', () => {
  beforeEach(() => {
    // Clear storage keys between tests
    try {
      localStorage.clear();
    } catch {}
  });

  it('allows normal login on initial attempt and tracks failure count', async () => {
    const testEmail = 'probe@vmovelogistics.com';
    const statusBefore = authService.checkLockoutStatus(testEmail);
    expect(statusBefore.isLocked).toBe(false);
    expect(statusBefore.attemptCount).toBe(0);

    const result = await authService.validatePrimaryCredentials(testEmail, 'wrong-password');
    expect(result.success).toBe(false);

    const statusAfter = authService.checkLockoutStatus(testEmail);
    expect(statusAfter.attemptCount).toBe(1);
    expect(statusAfter.isLocked).toBe(false);
  });

  it('triggers progressive lockout after 5 consecutive failed attempts', async () => {
    const testEmail = 'attacker@vmovelogistics.com';

    for (let i = 0; i < 4; i++) {
      await authService.validatePrimaryCredentials(testEmail, `fail-${i}`);
    }

    const fifthAttempt = await authService.validatePrimaryCredentials(testEmail, 'fail-5');
    expect(fifthAttempt.success).toBe(false);

    const status = authService.checkLockoutStatus(testEmail);
    expect(status.isLocked).toBe(true);
    expect(status.waitSeconds).toBeGreaterThan(800); // 15 mins = 900s
  }, 15000);

  it('clears failed attempts upon successful authentication', async () => {
    const testEmail = 'admin@vmovelogistics.com';
    await authService.validatePrimaryCredentials(testEmail, 'bad-password');
    expect(authService.checkLockoutStatus(testEmail).attemptCount).toBe(1);

    authService.clearFailedAttempts(testEmail);
    expect(authService.checkLockoutStatus(testEmail).attemptCount).toBe(0);
  });

  it('sanitizes malicious script injections and HTML tags from plain text inputs', () => {
    const maliciousPayload = '<script>alert("xss")</script>John Doe';
    const clean = sanitizeText(maliciousPayload);
    expect(clean).toBe('John Doe');
    expect(clean).not.toContain('<script>');
  });

  it('strips javascript: URIs and dangerous attributes in rich content', () => {
    const dirtyHtml = '<a href="javascript:alert(1)">Click</a><b>Safe</b><img src=x onerror=alert(2) />';
    const sanitized = sanitizeHtml(dirtyHtml);
    expect(sanitized).not.toContain('javascript:');
    expect(sanitized).not.toContain('onerror');
    expect(sanitized).toContain('<b>Safe</b>');
  });

  it('sanitizes and strips invalid characters from phone numbers', () => {
    expect(sanitizePhone('+91 7906-308-640 (Ext 1)')).toBe('+9179063086401');
    expect(sanitizePhone('9876543210')).toBe('9876543210');
  });
});
