import { describe, it, expect } from 'vitest';
import {
  formatEmissions,
  formatEmissionsCompact,
  formatChange,
  formatConfidence,
  formatPoints,
  getCategoryLabel,
  getSubcategoryLabel,
  getCategoryColor,
  getCategoryIcon
} from '@/utils/format';
import {
  stripHtml,
  sanitizeString,
  sanitizeEmail,
  escapeHtml,
  sanitizeNumber,
  isAllowedMimeType,
  sanitizeObject
} from '@/utils/sanitize';

describe('Format Utils Tests', () => {
  it('should format emissions correctly based on range', () => {
    expect(formatEmissions(1200)).toBe('1.2t CO₂e');
    expect(formatEmissions(50)).toBe('50 kg CO₂e');
    expect(formatEmissions(5.5)).toBe('5.5 kg CO₂e');
    expect(formatEmissions(0.5)).toBe('500 g CO₂e');
  });

  it('should format emissions compact correctly', () => {
    expect(formatEmissionsCompact(1200)).toBe('1.2t');
    expect(formatEmissionsCompact(50)).toBe('50 kg');
    expect(formatEmissionsCompact(5.5)).toBe('5.5 kg');
  });

  it('should format changes and confidence scores', () => {
    expect(formatChange(5.23)).toBe('+5.2%');
    expect(formatChange(-2.1)).toBe('-2.1%');
    expect(formatConfidence(0.854)).toBe('85%');
  });

  it('should return labels, colors, and icons for categories', () => {
    expect(getCategoryLabel('transport')).toBe('Transportation');
    expect(getCategoryLabel('unknown')).toBe('unknown');
    expect(getSubcategoryLabel('car_gasoline')).toBe('Car (Gasoline)');
    expect(getCategoryColor('transport')).toBe('#3b82f6');
    expect(getCategoryIcon('transport')).toBe('Car');
  });
});

describe('Sanitize Utils Tests', () => {
  it('should strip HTML tags and dangerous patterns', () => {
    const dirty = '<div>Hello <script>alert(1)</script> <a href="javascript:void(0)" onclick="alert(2)">world</a></div>';
    expect(stripHtml(dirty)).toBe('Hello  world');
  });

  it('should sanitize strings and limit length', () => {
    expect(sanitizeString('   some string   ', 5)).toBe('some');
    expect(sanitizeString(123 as any)).toBe('');
  });

  it('should sanitize emails', () => {
    expect(sanitizeEmail('  Test@Example.Com  ')).toBe('test@example.com');
  });

  it('should escape HTML characters', () => {
    expect(escapeHtml('<div>"test" & \'hello\'</div>')).toBe('&lt;div&gt;&quot;test&quot; &amp; &#039;hello&#039;&lt;/div&gt;');
  });

  it('should sanitize numbers safely', () => {
    expect(sanitizeNumber('123.45')).toBe(123.45);
    expect(sanitizeNumber('abc')).toBe(0);
    expect(sanitizeNumber(-10, 0, 100)).toBe(0);
    expect(sanitizeNumber(200, 0, 100)).toBe(100);
  });

  it('should validate allowed mime types', () => {
    expect(isAllowedMimeType('image/png')).toBe(true);
    expect(isAllowedMimeType('image/gif')).toBe(false);
  });

  it('should sanitize objects recursively', () => {
    const dirtyObj = {
      name: '  <b>John</b>  ',
      age: 30,
      email: 'john@example.com'
    };
    const clean = sanitizeObject(dirtyObj);
    expect(clean.name).toBe('John');
    expect(clean.age).toBe(30);
  });
});
