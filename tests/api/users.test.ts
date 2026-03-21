import { describe, it, expect } from 'vitest';
import { profileSchema } from '@/lib/validations';

describe('Users API Logic', () => {
  it('validates profile update with all fields', () => {
    const result = profileSchema.safeParse({
      name: 'New Name',
      username: 'newuser',
      bio: 'Creator from India',
      socialLinks: { twitter: 'newuser', github: 'newuser', website: 'https://example.com' },
    });
    expect(result.success).toBe(true);
  });

  it('rejects invalid username', () => {
    expect(profileSchema.safeParse({ username: 'Has Spaces' }).success).toBe(false);
    expect(profileSchema.safeParse({ username: 'UPPERCASE' }).success).toBe(false);
  });

  it('accepts hyphen and underscore in username', () => {
    expect(profileSchema.safeParse({ username: 'my-user_name' }).success).toBe(true);
  });

  it('limits bio to 300 chars', () => {
    expect(profileSchema.safeParse({ bio: 'a'.repeat(301) }).success).toBe(false);
    expect(profileSchema.safeParse({ bio: 'a'.repeat(300) }).success).toBe(true);
  });
});
