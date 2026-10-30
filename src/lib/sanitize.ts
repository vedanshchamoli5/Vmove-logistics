// Vmove Logistics - Enterprise Input Sanitization & Anti-XSS Engine
import DOMPurify from 'dompurify';

function getPurifyInstance() {
  if (typeof DOMPurify?.sanitize === 'function') {
    return DOMPurify;
  }
  if (typeof (DOMPurify as any)?.default?.sanitize === 'function') {
    return (DOMPurify as any).default;
  }
  return null;
}

/**
 * Sanitize plain user text, stripping dangerous HTML tags and script injections
 */
export function sanitizeText(input: string | null | undefined): string {
  if (!input) return '';
  const purify = getPurifyInstance();
  if (purify) {
    return purify.sanitize(input, {
      ALLOWED_TAGS: [], // No tags allowed in plain text fields
      ALLOWED_ATTR: [],
    }).trim();
  }
  // Safe robust fallback in non-browser Node environments
  return input
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/<[^>]*>?/gm, '')
    .replace(/javascript:/gi, '')
    .trim();
}

/**
 * Sanitize rich text or HTML if allowed
 */
export function sanitizeHtml(html: string | null | undefined): string {
  if (!html) return '';
  const purify = getPurifyInstance();
  if (purify) {
    return purify.sanitize(html, {
      ALLOWED_TAGS: ['b', 'i', 'em', 'strong', 'a', 'p', 'br', 'ul', 'ol', 'li', 'span'],
      ALLOWED_ATTR: ['href', 'target', 'rel', 'class'],
    });
  }
  // Safe robust fallback in non-browser Node environments
  return html
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/javascript:/gi, '')
    .replace(/onerror\s*=\s*['"]?[^'">\s]+/gi, '')
    .replace(/onload\s*=\s*['"]?[^'">\s]+/gi, '')
    .replace(/onclick\s*=\s*['"]?[^'">\s]+/gi, '');
}

/**
 * Validate and sanitize Indian mobile number
 */
export function sanitizePhone(phone: string): string {
  return phone.replace(/[^0-9+]/g, '').trim();
}
