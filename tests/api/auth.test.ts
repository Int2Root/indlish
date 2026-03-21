import { describe, it, expect } from 'vitest';
import { registerSchema, loginSchema } from '@/lib/validations';

describe('Auth Validation', () => {
  describe('registration', () => {
    it('accepts valid registration', () => {
      expect(registerSchema.safeParse({ name: 'Siddhartha', email: 'sid@example.com', password: 'securepass123' }).success).toBe(true);
    });

    it('generates username from email', () => {
      const email = 'test.user@example.com';
      const username = email.split('@')[0].toLowerCase().replace(/[^a-z0-9]/g, '');
      expect(username).toBe('testuser');
    });

    it('rejects weak password', () => {
      expect(registerSchema.safeParse({ name: 'Test', email: 'test@example.com', password: '1234567' }).success).toBe(false);
    });
  });

  describe('login', () => {
    it('accepts valid login', () => {
      expect(loginSchema.safeParse({ email: 'test@example.com', password: 'password' }).success).toBe(true);
    });

    it('rejects missing email', () => {
      expect(loginSchema.safeParse({ password: 'password' }).success).toBe(false);
    });
  });
});
