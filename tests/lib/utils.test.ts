import { describe, it, expect } from 'vitest';
import { cn, generateSlug, formatDate, formatNumber, formatCurrency, truncate, getReadingTime, PLAN_LIMITS } from '@/lib/utils';

describe('cn', () => {
  it('merges class names', () => {
    expect(cn('foo', 'bar')).toBe('foo bar');
  });
  it('handles conditional classes', () => {
    expect(cn('base', false && 'hidden', 'visible')).toBe('base visible');
  });
  it('merges tailwind conflicts', () => {
    expect(cn('px-2', 'px-4')).toBe('px-4');
  });
});

describe('generateSlug', () => {
  it('creates a slugified string with nanoid suffix', () => {
    const slug = generateSlug('Hello World');
    expect(slug).toMatch(/^hello-world-[a-zA-Z0-9_-]{6}$/);
  });
  it('handles special characters', () => {
    const slug = generateSlug('My Article! @2024');
    expect(slug).toMatch(/^my-article-2024-[a-zA-Z0-9_-]{6}$/);
  });
});

describe('formatDate', () => {
  it('formats date in en-IN locale', () => {
    const result = formatDate('2024-01-15');
    expect(result).toContain('Jan');
    expect(result).toContain('2024');
  });
});

describe('formatNumber', () => {
  it('returns number as-is below 1000', () => {
    expect(formatNumber(500)).toBe('500');
  });
  it('formats thousands with K', () => {
    expect(formatNumber(1500)).toBe('1.5K');
  });
  it('formats millions with M', () => {
    expect(formatNumber(2500000)).toBe('2.5M');
  });
});

describe('formatCurrency', () => {
  it('formats as INR', () => {
    const result = formatCurrency(1000);
    expect(result).toContain('1,000');
  });
});

describe('truncate', () => {
  it('returns full string if shorter than limit', () => {
    expect(truncate('hello', 10)).toBe('hello');
  });
  it('truncates and adds ellipsis', () => {
    expect(truncate('hello world foo', 10)).toBe('hello worl...');
  });
});

describe('getReadingTime', () => {
  it('calculates reading time', () => {
    const text = Array(400).fill('word').join(' ');
    expect(getReadingTime(text)).toBe(2);
  });
  it('returns 1 for short text', () => {
    expect(getReadingTime('hello')).toBe(1);
  });
});

describe('PLAN_LIMITS', () => {
  it('has correct free limits', () => {
    expect(PLAN_LIMITS.FREE.articles).toBe(5);
    expect(PLAN_LIMITS.FREE.notebooks).toBe(3);
    expect(PLAN_LIMITS.FREE.boards).toBe(2);
  });
  it('has unlimited pro limits', () => {
    expect(PLAN_LIMITS.PRO.articles).toBe(Infinity);
  });
});
