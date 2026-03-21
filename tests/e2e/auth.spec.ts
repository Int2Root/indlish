import { test, expect } from '@playwright/test';

const BASE = 'https://indlish.com';
const TEST_EMAIL = `e2e+${Date.now()}@int2root.com`;
const TEST_PASSWORD = 'E2eTest@2026!';
const TEST_NAME = 'E2E Tester';

// ── Page render tests ──────────────────────────────────────────────────────

test.describe('Auth pages render', () => {
  test('login page loads and shows Google + email options', async ({ page }) => {
    await page.goto(`${BASE}/login`);
    await expect(page.getByText('indlish')).toBeVisible();
    await expect(page.getByText('Continue with Google')).toBeVisible();
    await expect(page.getByPlaceholder('you@example.com')).toBeVisible();
    await expect(page.getByPlaceholder('••••••••')).toBeVisible();
    await expect(page.getByRole('link', { name: 'Sign up free' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Forgot password?' })).toBeVisible();
  });

  test('register page loads and shows Google + email options', async ({ page }) => {
    await page.goto(`${BASE}/register`);
    await expect(page.getByText('indlish')).toBeVisible();
    await expect(page.getByText('Continue with Google')).toBeVisible();
    await expect(page.getByPlaceholder('Your name')).toBeVisible();
    await expect(page.getByPlaceholder('you@example.com')).toBeVisible();
    await expect(page.getByPlaceholder('Minimum 8 characters')).toBeVisible();
    await expect(page.getByRole('link', { name: 'Sign in' })).toBeVisible();
  });

  test('forgot-password page loads', async ({ page }) => {
    await page.goto(`${BASE}/forgot-password`);
    await expect(page.getByText('Reset your password')).toBeVisible();
    await expect(page.getByPlaceholder('you@example.com')).toBeVisible();
    await expect(page.getByRole('button', { name: 'Send Reset Link' })).toBeVisible();
  });

  test('reset-password page shows error without token', async ({ page }) => {
    await page.goto(`${BASE}/reset-password`);
    await expect(page.getByText('Set a new password')).toBeVisible();
    // Without a token the form should be disabled
    await expect(page.getByRole('button', { name: 'Reset Password' })).toBeDisabled();
  });
});

// ── Navigation between auth pages ─────────────────────────────────────────

test.describe('Auth page navigation', () => {
  test('login → register link works', async ({ page }) => {
    await page.goto(`${BASE}/login`);
    await page.getByRole('link', { name: 'Sign up free' }).click();
    await expect(page).toHaveURL(`${BASE}/register`);
  });

  test('register → login link works', async ({ page }) => {
    await page.goto(`${BASE}/register`);
    await page.getByRole('link', { name: 'Sign in' }).click();
    await expect(page).toHaveURL(`${BASE}/login`);
  });

  test('login → forgot-password link works', async ({ page }) => {
    await page.goto(`${BASE}/login`);
    await page.getByRole('link', { name: 'Forgot password?' }).click();
    await expect(page).toHaveURL(`${BASE}/forgot-password`);
  });

  test('forgot-password → login link works', async ({ page }) => {
    await page.goto(`${BASE}/forgot-password`);
    await page.getByRole('link', { name: 'Sign in' }).click();
    await expect(page).toHaveURL(`${BASE}/login`);
  });
});

// ── Google OAuth button ────────────────────────────────────────────────────

test.describe('Google OAuth', () => {
  test('Google sign-in button on login initiates OAuth redirect', async ({ page }) => {
    await page.goto(`${BASE}/login`);
    const [response] = await Promise.all([
      page.waitForResponse((r) => r.url().includes('accounts.google.com') || r.url().includes('/api/auth'), { timeout: 10000 }).catch(() => null),
      page.getByText('Continue with Google').click(),
    ]);
    // Should redirect toward Google OAuth — page URL will change away from /login
    await page.waitForURL((url) => !url.toString().endsWith('/login'), { timeout: 10000 });
    const currentUrl = page.url();
    expect(
      currentUrl.includes('accounts.google.com') || currentUrl.includes('/api/auth')
    ).toBeTruthy();
  });
});

// ── Manual signup ──────────────────────────────────────────────────────────

test.describe('Manual email signup', () => {
  test('registers a new user and redirects to dashboard', async ({ page }) => {
    await page.goto(`${BASE}/register`);

    await page.getByPlaceholder('Your name').fill(TEST_NAME);
    await page.getByPlaceholder('you@example.com').fill(TEST_EMAIL);
    await page.getByPlaceholder('Minimum 8 characters').fill(TEST_PASSWORD);
    await page.getByRole('button', { name: 'Create Account' }).click();

    // Should redirect to /dashboard after successful signup + auto-login
    await expect(page).toHaveURL(`${BASE}/dashboard`, { timeout: 15000 });
  });

  test('shows error when email already registered', async ({ page }) => {
    await page.goto(`${BASE}/register`);

    // Use same email as above — it was just registered
    await page.getByPlaceholder('Your name').fill(TEST_NAME);
    await page.getByPlaceholder('you@example.com').fill(TEST_EMAIL);
    await page.getByPlaceholder('Minimum 8 characters').fill(TEST_PASSWORD);
    await page.getByRole('button', { name: 'Create Account' }).click();

    await expect(page.getByText('Email already registered')).toBeVisible({ timeout: 8000 });
  });

  test('shows error for weak password (< 8 chars)', async ({ page }) => {
    await page.goto(`${BASE}/register`);
    await page.getByPlaceholder('Your name').fill('Test User');
    await page.getByPlaceholder('you@example.com').fill('weak@test.com');
    await page.getByPlaceholder('Minimum 8 characters').fill('1234567');
    await page.getByRole('button', { name: 'Create Account' }).click();

    // HTML5 minLength validation fires before submission
    const passwordInput = page.getByPlaceholder('Minimum 8 characters');
    const validationMessage = await passwordInput.evaluate((el: HTMLInputElement) => el.validationMessage);
    expect(validationMessage).toBeTruthy();
  });
});

// ── Manual login ───────────────────────────────────────────────────────────

test.describe('Manual email login', () => {
  test('logs in with valid credentials and redirects to dashboard', async ({ page }) => {
    await page.goto(`${BASE}/login`);

    await page.getByPlaceholder('you@example.com').fill(TEST_EMAIL);
    await page.getByPlaceholder('••••••••').fill(TEST_PASSWORD);
    await page.getByRole('button', { name: 'Sign In' }).click();

    await expect(page).toHaveURL(`${BASE}/dashboard`, { timeout: 15000 });
  });

  test('shows error for wrong password', async ({ page }) => {
    await page.goto(`${BASE}/login`);

    await page.getByPlaceholder('you@example.com').fill(TEST_EMAIL);
    await page.getByPlaceholder('••••••••').fill('wrongpassword123');
    await page.getByRole('button', { name: 'Sign In' }).click();

    await expect(page.getByText('Invalid email or password')).toBeVisible({ timeout: 8000 });
  });

  test('shows error for non-existent account', async ({ page }) => {
    await page.goto(`${BASE}/login`);

    await page.getByPlaceholder('you@example.com').fill('nobody@nowhere.example.com');
    await page.getByPlaceholder('••••••••').fill('password123');
    await page.getByRole('button', { name: 'Sign In' }).click();

    await expect(page.getByText('Invalid email or password')).toBeVisible({ timeout: 8000 });
  });
});

// ── Forgot password ────────────────────────────────────────────────────────

test.describe('Forgot password flow', () => {
  test('submitting an email shows success message (even for non-existent emails)', async ({ page }) => {
    await page.goto(`${BASE}/forgot-password`);

    await page.getByPlaceholder('you@example.com').fill('nobody@nowhere.example.com');
    await page.getByRole('button', { name: 'Send Reset Link' }).click();

    await expect(page.getByText('Check your email')).toBeVisible({ timeout: 8000 });
  });

  test('submitting the registered email shows success message', async ({ page }) => {
    await page.goto(`${BASE}/forgot-password`);

    await page.getByPlaceholder('you@example.com').fill(TEST_EMAIL);
    await page.getByRole('button', { name: 'Send Reset Link' }).click();

    await expect(page.getByText('Check your email')).toBeVisible({ timeout: 8000 });
  });
});

// ── Protected route redirect ───────────────────────────────────────────────

test.describe('Protected routes', () => {
  test('unauthenticated access to /dashboard redirects to login', async ({ page }) => {
    await page.goto(`${BASE}/dashboard`);
    // Should end up on login page
    await expect(page).toHaveURL(/\/login/, { timeout: 10000 });
  });

  test('unauthenticated access to /settings redirects to login', async ({ page }) => {
    await page.goto(`${BASE}/settings`);
    await expect(page).toHaveURL(/\/login/, { timeout: 10000 });
  });
});
