/**
 * Sanitize user input to prevent XSS and injection attacks.
 * Strips HTML tags, script content, and dangerous patterns.
 */

const HTML_TAG_REGEX = /<[^>]*>/g;
const SCRIPT_REGEX = /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi;
const EVENT_HANDLER_REGEX = /on\w+\s*=\s*["'][^"']*["']/gi;
const JAVASCRIPT_URI_REGEX = /javascript\s*:/gi;
const DATA_URI_REGEX = /data\s*:\s*text\/html/gi;

/**
 * Remove HTML tags from a string.
 */
export function stripHtml(input: string): string {
  return input
    .replace(SCRIPT_REGEX, '')
    .replace(EVENT_HANDLER_REGEX, '')
    .replace(HTML_TAG_REGEX, '')
    .replace(JAVASCRIPT_URI_REGEX, '')
    .replace(DATA_URI_REGEX, '')
    .trim();
}

/**
 * Sanitize a string for safe database storage and display.
 * Removes HTML, trims whitespace, and limits length.
 */
export function sanitizeString(input: string, maxLength = 1000): string {
  if (typeof input !== 'string') return '';
  const cleaned = stripHtml(input);
  return cleaned.slice(0, maxLength).trim();
}

/**
 * Sanitize an email address.
 */
export function sanitizeEmail(email: string): string {
  return email.toLowerCase().trim().slice(0, 254);
}

/**
 * Escape special characters for safe display.
 */
export function escapeHtml(input: string): string {
  const map: Record<string, string> = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;',
  };
  return input.replace(/[&<>"']/g, (char) => map[char] ?? char);
}

/**
 * Sanitize a number input, ensuring it's within a valid range.
 */
export function sanitizeNumber(
  value: unknown,
  min = 0,
  max = 1_000_000
): number {
  const num = Number(value);
  if (Number.isNaN(num) || !Number.isFinite(num)) return 0;
  return Math.max(min, Math.min(max, num));
}

/**
 * Validate and sanitize a file MIME type against an allowlist.
 */
export function isAllowedMimeType(
  mimeType: string,
  allowedTypes: string[] = [
    'image/jpeg',
    'image/png',
    'image/webp',
    'application/pdf',
  ]
): boolean {
  return allowedTypes.includes(mimeType.toLowerCase());
}

/**
 * Sanitize an object by applying sanitizeString to all string values.
 */
export function sanitizeObject<T extends Record<string, unknown>>(
  obj: T,
  maxStringLength = 1000
): T {
  const result = { ...obj };
  for (const key of Object.keys(result)) {
    const value = result[key];
    if (typeof value === 'string') {
      (result as Record<string, unknown>)[key] = sanitizeString(
        value,
        maxStringLength
      );
    }
  }
  return result;
}
