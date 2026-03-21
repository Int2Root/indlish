import { describe, it, expect } from 'vitest';
import { notebookSchema, noteSchema } from '@/lib/validations';
import { PLAN_LIMITS } from '@/lib/utils';

describe('Notebooks API Logic', () => {
  it('validates notebook creation', () => {
    expect(notebookSchema.safeParse({ title: 'My Notebook', emoji: '📝' }).success).toBe(true);
  });

  it('validates note creation', () => {
    expect(noteSchema.safeParse({ notebookId: 'abc123', title: 'Note Title', content: { blocks: [] } }).success).toBe(true);
  });

  it('enforces free plan notebook limit', () => {
    expect(PLAN_LIMITS.FREE.notebooks).toBe(3);
  });

  it('allows unlimited notebooks on pro', () => {
    expect(PLAN_LIMITS.PRO.notebooks).toBe(Infinity);
  });

  it('rejects notebook with empty title', () => {
    expect(notebookSchema.safeParse({ title: '' }).success).toBe(false);
  });

  it('rejects note without notebookId', () => {
    expect(noteSchema.safeParse({ title: 'orphan note' }).success).toBe(false);
  });
});
