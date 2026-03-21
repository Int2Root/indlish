import { describe, it, expect } from 'vitest';
import { PLAN_LIMITS } from '@/lib/utils';

describe('Plan Limits', () => {
  it('FREE plan has correct limits', () => {
    expect(PLAN_LIMITS.FREE).toEqual({ articles: 5, notebooks: 3, boards: 2 });
  });

  it('PRO plan has unlimited everything', () => {
    expect(PLAN_LIMITS.PRO.articles).toBe(Infinity);
    expect(PLAN_LIMITS.PRO.notebooks).toBe(Infinity);
    expect(PLAN_LIMITS.PRO.boards).toBe(Infinity);
  });

  it('PRO_PLUS plan has unlimited everything', () => {
    expect(PLAN_LIMITS.PRO_PLUS.articles).toBe(Infinity);
    expect(PLAN_LIMITS.PRO_PLUS.notebooks).toBe(Infinity);
    expect(PLAN_LIMITS.PRO_PLUS.boards).toBe(Infinity);
  });

  it('free plan limits are reasonable', () => {
    expect(PLAN_LIMITS.FREE.articles).toBeGreaterThan(0);
    expect(PLAN_LIMITS.FREE.articles).toBeLessThanOrEqual(10);
  });

  it('can check if limit is reached', () => {
    const currentCount = 5;
    const limit = PLAN_LIMITS.FREE.articles;
    expect(currentCount >= limit).toBe(true);
  });
});
