import { describe, it, expect } from 'vitest';
import { tipSchema } from '@/lib/validations';
import { formatCurrency } from '@/lib/utils';

describe('Tips API Logic', () => {
  it('validates tip with minimum amount', () => {
    expect(tipSchema.safeParse({ amount: 10, toUserId: 'user123' }).success).toBe(true);
  });

  it('validates tip with article reference', () => {
    expect(tipSchema.safeParse({ amount: 100, toUserId: 'user123', articleId: 'article123' }).success).toBe(true);
  });

  it('rejects tip below minimum', () => {
    const result = tipSchema.safeParse({ amount: 5, toUserId: 'user123' });
    expect(result.success).toBe(false);
    if (!result.success) expect(result.error.issues[0].message).toContain('10');
  });

  it('rejects tip above maximum', () => {
    expect(tipSchema.safeParse({ amount: 15000, toUserId: 'user123' }).success).toBe(false);
  });

  it('formats tip amount correctly', () => {
    expect(formatCurrency(100)).toContain('100');
    expect(formatCurrency(1000)).toContain('1,000');
  });
});
