// Rate limiter and anti-spam verification for public enquiry submissions

interface SubmissionRecord {
  timestamp: number;
  ipMockId: string;
}

const STORAGE_KEY = 'vmove_submission_history';
const MAX_SUBMISSIONS_PER_WINDOW = 3;
const WINDOW_MS = 10 * 60 * 1000; // 10 minutes

export const rateLimiter = {
  /**
   * Check if current user session is rate-limited
   */
  canSubmit(): { allowed: boolean; remainingSeconds?: number; reason?: string } {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
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
      const raw = localStorage.getItem(STORAGE_KEY);
      const history: SubmissionRecord[] = raw ? JSON.parse(raw) : [];
      const now = Date.now();

      const validRecords = history.filter(record => now - record.timestamp < WINDOW_MS);
      validRecords.push({
        timestamp: now,
        ipMockId: 'client-session-' + Math.random().toString(36).substring(2, 8),
      });

      localStorage.setItem(STORAGE_KEY, JSON.stringify(validRecords));
    } catch (e) {
      console.warn('Could not record submission timestamp in local storage', e);
    }
  },

  /**
   * Validate Indian mobile phone number: 10 digits starting with 6, 7, 8, or 9
   */
  validateIndianMobile(phone: string): boolean {
    const cleaned = phone.replace(/[\s\-\+\(\)]/g, '');
    const mobilePattern = /^(?:(?:\+|0{0,2})91(\s*[\-]\s*)?|[0]?)?[6789]\d{9}$/;
    return mobilePattern.test(cleaned);
  },

  /**
   * Check honeypot field
   */
  isHoneypotClean(honeypotValue: string): boolean {
    return !honeypotValue || honeypotValue.trim().length === 0;
  }
};
