import { describe, it, expect } from 'vitest';
import { generateSlug } from '@/lib/utils';

describe('Slug Generation', () => {
  it('creates URL-safe slugs', () => {
    const slug = generateSlug('Hello World!');
    expect(slug).not.toContain(' ');
    expect(slug).not.toContain('!');
  });

  it('handles Hindi/Hinglish titles', () => {
    const slug = generateSlug('Mera Pehla Article');
    expect(slug).toMatch(/^mera-pehla-article-/);
  });

  it('handles empty-ish strings', () => {
    const slug = generateSlug('   ');
    expect(slug.length).toBeGreaterThan(0);
  });

  it('creates unique slugs each time', () => {
    const slugs = new Set(Array.from({ length: 10 }, () => generateSlug('Same Title')));
    expect(slugs.size).toBe(10);
  });
});
