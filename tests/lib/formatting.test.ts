import { describe, it, expect } from 'vitest';
import { formatDate, formatNumber, formatCurrency, truncate } from '@/lib/utils';

describe('Formatting Utilities', () => {
  describe('formatDate', () => {
    it('formats ISO date string', () => {
      const result = formatDate('2024-06-15T10:00:00Z');
      expect(result).toContain('2024');
    });

    it('formats Date object', () => {
      const result = formatDate(new Date(2024, 0, 1));
      expect(result).toContain('Jan');
    });
  });

  describe('formatNumber', () => {
    it('handles zero', () => {
      expect(formatNumber(0)).toBe('0');
    });
    it('handles exact thousands', () => {
      expect(formatNumber(1000)).toBe('1.0K');
    });
    it('handles exact millions', () => {
      expect(formatNumber(1000000)).toBe('1.0M');
    });
  });

  describe('formatCurrency', () => {
    it('formats zero', () => {
      expect(formatCurrency(0)).toContain('0');
    });
    it('formats large amounts', () => {
      const result = formatCurrency(100000);
      expect(result).toContain('1,00,000');
    });
  });

  describe('truncate', () => {
    it('handles empty string', () => {
      expect(truncate('', 10)).toBe('');
    });
    it('handles exact length', () => {
      expect(truncate('12345', 5)).toBe('12345');
    });
  });
});
