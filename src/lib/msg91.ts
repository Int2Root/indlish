const FROM_EMAIL = 'notifications@indlish.com';
const FROM_NAME = 'indlish';
const DOMAIN = 'indlish.com';
const API_URL = 'https://control.msg91.com/api/v5/email/send';
const BASE_URL = process.env.NEXTAUTH_URL || 'https://indlish.com';
const BCC_EMAIL = 'hello@int2root.com';

async function sendTemplateEmail({
  to,
  templateId,
  variables,
}: {
  to: string;
  templateId: string;
  variables: Record<string, string>;
}): Promise<void> {
  const authKey = process.env.MSG91_AUTH_KEY;
  if (!authKey) {
    console.warn('MSG91_AUTH_KEY not set — skipping email');
    return;
  }

  try {
    const res = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        authkey: authKey,
      },
      body: JSON.stringify({
        to: [{ email: to }],
        from: { email: FROM_EMAIL, name: FROM_NAME },
        domain: DOMAIN,
        template_id: templateId,
        variables,
        bcc: [{ email: BCC_EMAIL }],
      }),
    });

    if (!res.ok) {
      const text = await res.text().catch(() => '');
      console.error(`MSG91 email failed (${res.status}):`, text);
    }
  } catch (error) {
    console.error('Failed to send email:', error);
  }
}

export async function sendWelcomeEmail(email: string, name?: string | null): Promise<void> {
  const templateId = process.env.MSG91_TEMPLATE_WELCOME;
  if (!templateId) {
    console.warn('MSG91_TEMPLATE_WELCOME not set — skipping welcome email');
    return;
  }

  await sendTemplateEmail({
    to: email,
    templateId,
    variables: {
      name: name || 'there',
      dashboard_url: `${BASE_URL}/dashboard`,
      support_email: 'support@indlish.com',
    },
  });
}

export async function sendPasswordResetEmail({
  email,
  resetUrl,
}: {
  email: string;
  resetUrl: string;
}): Promise<void> {
  const templateId = process.env.MSG91_TEMPLATE_PASSWORD_RESET;
  if (!templateId) {
    console.warn('MSG91_TEMPLATE_PASSWORD_RESET not set — skipping password reset email');
    return;
  }

  await sendTemplateEmail({
    to: email,
    templateId,
    variables: {
      reset_url: resetUrl,
    },
  });
}
