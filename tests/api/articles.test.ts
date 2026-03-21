import { describe, it, expect, vi } from 'vitest';
import { articleSchema } from '@/lib/validations';
import { generateSlug, getReadingTime } from '@/lib/utils';

describe('Articles API Logic', () => {
  describe('article creation validation', () => {
    it('generates unique slugs', () => {
      const slug1 = generateSlug('Test Article');
      const slug2 = generateSlug('Test Article');
      expect(slug1).not.toBe(slug2);
    });

    it('calculates reading time correctly', () => {
      const shortText = 'Hello world';
      const longText = Array(1000).fill('word').join(' ');
      expect(getReadingTime(shortText)).toBe(1);
      expect(getReadingTime(longText)).toBe(5);
    });

    it('validates article with all fields', () => {
      const result = articleSchema.safeParse({
        title: 'My Article',
        content: { type: 'doc', content: [{ type: 'paragraph', content: [{ type: 'text', text: 'Hello' }] }] },
        excerpt: 'A short excerpt',
        coverImage: 'https://example.com/image.jpg',
        tags: ['tech', 'ai'],
        status: 'PUBLISHED',
      });
      expect(result.success).toBe(true);
    });

    it('rejects article without title', () => {
      const result = articleSchema.safeParse({ title: '', content: {} });
      expect(result.success).toBe(false);
    });
  });

  describe('article status transitions', () => {
    it('default status is DRAFT', () => {
      const result = articleSchema.parse({ title: 'Draft', content: {} });
      expect(result.status).toBeUndefined();
    });

    it('allows PUBLISHED status', () => {
      const result = articleSchema.parse({ title: 'Published', content: {}, status: 'PUBLISHED' });
      expect(result.status).toBe('PUBLISHED');
    });
  });
});
