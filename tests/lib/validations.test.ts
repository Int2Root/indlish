import { describe, it, expect } from 'vitest';
import { registerSchema, loginSchema, articleSchema, notebookSchema, noteSchema, boardSchema, pinSchema, profileSchema, tipSchema } from '@/lib/validations';

describe('registerSchema', () => {
  it('validates valid registration data', () => {
    const result = registerSchema.safeParse({ name: 'Test User', email: 'test@example.com', password: 'password123' });
    expect(result.success).toBe(true);
  });
  it('rejects short name', () => {
    const result = registerSchema.safeParse({ name: 'T', email: 'test@example.com', password: 'password123' });
    expect(result.success).toBe(false);
  });
  it('rejects invalid email', () => {
    const result = registerSchema.safeParse({ name: 'Test', email: 'invalid', password: 'password123' });
    expect(result.success).toBe(false);
  });
  it('rejects short password', () => {
    const result = registerSchema.safeParse({ name: 'Test', email: 'test@example.com', password: '123' });
    expect(result.success).toBe(false);
  });
});

describe('loginSchema', () => {
  it('validates valid login data', () => {
    const result = loginSchema.safeParse({ email: 'test@example.com', password: 'pass' });
    expect(result.success).toBe(true);
  });
  it('rejects empty password', () => {
    const result = loginSchema.safeParse({ email: 'test@example.com', password: '' });
    expect(result.success).toBe(false);
  });
});

describe('articleSchema', () => {
  it('validates valid article data', () => {
    const result = articleSchema.safeParse({ title: 'Test Article', content: { type: 'doc', content: [] } });
    expect(result.success).toBe(true);
  });
  it('rejects empty title', () => {
    const result = articleSchema.safeParse({ title: '', content: {} });
    expect(result.success).toBe(false);
  });
  it('accepts optional fields', () => {
    const result = articleSchema.safeParse({ title: 'Test', content: {}, excerpt: 'Short excerpt', tags: ['tech', 'ai'], status: 'DRAFT' });
    expect(result.success).toBe(true);
  });
  it('limits tags to 5', () => {
    const result = articleSchema.safeParse({ title: 'Test', content: {}, tags: ['a', 'b', 'c', 'd', 'e', 'f'] });
    expect(result.success).toBe(false);
  });
});

describe('notebookSchema', () => {
  it('validates notebook data', () => {
    expect(notebookSchema.safeParse({ title: 'My Notebook' }).success).toBe(true);
  });
  it('rejects empty title', () => {
    expect(notebookSchema.safeParse({ title: '' }).success).toBe(false);
  });
});

describe('noteSchema', () => {
  it('validates note data', () => {
    expect(noteSchema.safeParse({ notebookId: 'abc123' }).success).toBe(true);
  });
  it('requires notebookId', () => {
    expect(noteSchema.safeParse({}).success).toBe(false);
  });
});

describe('boardSchema', () => {
  it('validates board data', () => {
    expect(boardSchema.safeParse({ title: 'My Board' }).success).toBe(true);
  });
  it('accepts visibility option', () => {
    expect(boardSchema.safeParse({ title: 'Private Board', visibility: 'PRIVATE' }).success).toBe(true);
  });
  it('rejects invalid visibility', () => {
    expect(boardSchema.safeParse({ title: 'Board', visibility: 'INVALID' }).success).toBe(false);
  });
});

describe('pinSchema', () => {
  it('validates pin data', () => {
    expect(pinSchema.safeParse({ boardId: 'abc123' }).success).toBe(true);
  });
  it('accepts image and link urls', () => {
    expect(pinSchema.safeParse({ boardId: 'abc', imageUrl: 'https://example.com/img.png', linkUrl: 'https://example.com' }).success).toBe(true);
  });
});

describe('profileSchema', () => {
  it('validates profile update', () => {
    expect(profileSchema.safeParse({ name: 'Test', username: 'test-user' }).success).toBe(true);
  });
  it('rejects invalid username format', () => {
    expect(profileSchema.safeParse({ username: 'INVALID USER!' }).success).toBe(false);
  });
  it('validates social links', () => {
    expect(profileSchema.safeParse({ socialLinks: { twitter: 'testuser', github: 'testuser' } }).success).toBe(true);
  });
});

describe('tipSchema', () => {
  it('validates tip data', () => {
    expect(tipSchema.safeParse({ amount: 100, toUserId: 'abc123' }).success).toBe(true);
  });
  it('rejects tip below minimum', () => {
    expect(tipSchema.safeParse({ amount: 5, toUserId: 'abc123' }).success).toBe(false);
  });
  it('rejects tip above maximum', () => {
    expect(tipSchema.safeParse({ amount: 20000, toUserId: 'abc123' }).success).toBe(false);
  });
});
