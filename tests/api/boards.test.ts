import { describe, it, expect } from 'vitest';
import { boardSchema, pinSchema } from '@/lib/validations';
import { PLAN_LIMITS } from '@/lib/utils';

describe('Boards API Logic', () => {
  it('validates board creation', () => {
    expect(boardSchema.safeParse({ title: 'Design Inspo', description: 'Cool designs', visibility: 'PUBLIC' }).success).toBe(true);
  });

  it('validates private board', () => {
    expect(boardSchema.safeParse({ title: 'Secret Board', visibility: 'PRIVATE' }).success).toBe(true);
  });

  it('validates pin creation', () => {
    expect(pinSchema.safeParse({ boardId: 'board1', title: 'Cool image', imageUrl: 'https://example.com/img.jpg' }).success).toBe(true);
  });

  it('enforces board limit for free plan', () => {
    expect(PLAN_LIMITS.FREE.boards).toBe(2);
  });

  it('rejects board without title', () => {
    expect(boardSchema.safeParse({ description: 'no title' }).success).toBe(false);
  });

  it('rejects pin without boardId', () => {
    expect(pinSchema.safeParse({ title: 'orphan pin' }).success).toBe(false);
  });
});
