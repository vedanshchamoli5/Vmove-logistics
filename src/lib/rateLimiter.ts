// Rate limiter, anti-spam, and phone format verification for public freight submissions

interface SubmissionRecord {
  timestamp: number;
  ipMockId: string;
}

const STORAGE_KEY = 'vmove_submission_history';
const MAX_SUBMISSIONS_PER_WINDOW = 3;
const WINDOW_MS = 10 * 60 * 1000; // 10 minutes

// Safe fallback for test/node environments
const memStorage: Record<string, string> = {};

function safeGet(key: string): string | null {
  try {
    if (typeof localStorage !== 'undefined') return localStorage.getItem(key);
  } catch {}
  return memStorage[key] || null;
}

function safeSet(key: string, val: string): void {
  try {
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem(key, val);
      return;
    }
  } catch {}
  memStorage[key] = val;
}

export const rateLimiter = {
  /**
   * Check if current user session is rate-limited
   */
  canSubmit(): { allowed: boolean; remainingSeconds?: number; reason?: string } {
    try {
      const raw = safeGet(STORAGE_KEY);
      const history: SubmissionRecord[] = raw ? JSON.parse(raw) : [];
      const now = Date.now();

      // Clean up records outside the sliding window
      const validRecords = history.filter(record => now - record.timestamp < WINDOW_MS);

      if (validRecords.length >= MAX_SUBMISSIONS_PER_WINDOW) {
        const oldest = validRecords[0];
        const remainingSeconds = Math.ceil((WINDOW_MS - (now - oldest.timestamp)) / 1000);
        return {
          allowed: false,
          remainingSeconds,
          reason: `Submission limit reached (${MAX_SUBMISSIONS_PER_WINDOW} enquiries per 10 mins). Please try again in ${remainingSeconds} seconds or call us directly at 7906308640.`,
        };
      }

      return { allowed: true };
    } catch {
      return { allowed: true };
    }
  },

  /**
   * Log a successful submission
   */
  recordSubmission() {
    try {
      const raw = safeGet(STORAGE_KEY);
      const history: SubmissionRecord[] = raw ? JSON.parse(raw) : [];
      const now = Date.now();

      const validRecords = history.filter(record => now - record.timestamp < WINDOW_MS);
      validRecords.push({
        timestamp: now,
        ipMockId: 'client-session-' + Math.random().toString(36).substring(2, 8),
      });

      safeSet(STORAGE_KEY, JSON.stringify(validRecords));
    } catch (e) {
      console.warn('Could not record submission timestamp in local storage', e);
    }
  },

  /**
   * Validate Indian contact phone number:
   * Accepts both 10-digit mobile numbers (starting with 6, 7, 8, 9)
   * AND corporate landline numbers with STD codes (e.g. 011-23456789, 022-26789123, 080-41234567)
   */
  validateIndianMobile(phone: string): boolean {
    const cleaned = phone.replace(/[\s\-\+\(\)]/g, '');
    // 1. Mobile pattern (10 digits starting with 6, 7, 8, 9 with optional +91 or 0 prefix)
    const mobilePattern = /^(?:(?:\+|0{0,2})91(\s*[\-]\s*)?|[0]?)?[6789]\d{9}$/;
    if (mobilePattern.test(cleaned)) return true;

    // 2. Corporate landline pattern with Indian STD codes (must start with leading 0 or +91 prefix)
    const landlinePattern = /^(?:(?:\+|00)?91[\-]?|0)[1-9]\d{1,3}\d{6,8}$/;
    if (landlinePattern.test(cleaned) && cleaned.length >= 10 && cleaned.length <= 13) {
      return true;
    }

    return false;
  },

  /**
   * Check honeypot field
   */
  isHoneypotClean(honeypotValue: string): boolean {
    return !honeypotValue || honeypotValue.trim().length === 0;
  }
};
