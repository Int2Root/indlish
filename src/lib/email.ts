const FROM_EMAIL = 'notifications@indlish.com';
const FROM_NAME = 'indlish';
const DOMAIN = 'indlish.com';
const API_URL = 'https://control.msg91.com/api/v5/email/send';
const BASE_URL = process.env.NEXTAUTH_URL || 'https://indlish.com';
const BCC_EMAIL = 'hello@int2root.com';

async function sendEmailHTML({
  to,
  toName,
  subject,
  html,
}: {
  to: string;
  toName?: string;
  subject: string;
  html: string;
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
        from: { email: FROM_EMAIL, name: FROM_NAME },
        to: [{ email: to, name: toName || '' }],
        domain: DOMAIN,
        subject,
        html,
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

function emailLayout(content: string): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>indlish</title>
</head>
<body style="margin:0;padding:0;background-color:#f4f4f4;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f4f4f4;padding:32px 16px;">
    <tr>
      <td align="center">
        <table width="100%" style="max-width:560px;background-color:#1e1e1e;border-radius:12px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.2);">
          <tr>
            <td style="background-color:#242424;padding:20px 32px;border-bottom:2px solid #dd6b20;">
              <a href="${BASE_URL}" style="text-decoration:none;">
                <span style="font-size:22px;font-weight:800;color:#dd6b20;letter-spacing:-0.5px;">indlish</span>
              </a>
            </td>
          </tr>
          <tr>
            <td style="padding:32px 32px 24px;">
              ${content}
            </td>
          </tr>
          <tr>
            <td style="background-color:#161616;padding:20px 32px;border-top:1px solid #2e2e2e;">
              <p style="margin:0;font-size:12px;color:#555;line-height:1.7;">
                You're receiving this email because you have an account on
                <a href="${BASE_URL}" style="color:#dd6b20;text-decoration:none;">indlish.com</a>.
                Questions? Write to us at
                <a href="mailto:support@indlish.com" style="color:#dd6b20;text-decoration:none;">support@indlish.com</a>
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

function ctaButton(url: string, label: string): string {
  return `<a href="${url}" style="display:inline-block;margin-top:24px;padding:13px 28px;background-color:#dd6b20;color:#ffffff;font-size:14px;font-weight:700;text-decoration:none;border-radius:8px;letter-spacing:0.2px;">${label}</a>`;
}

export async function sendWelcomeEmail(email: string, name?: string | null): Promise<void> {
  const displayName = name || 'there';
  const html = emailLayout(`
    <h1 style="margin:0 0 6px;font-size:26px;font-weight:800;color:#f0f0f0;line-height:1.2;">
      Aapka swagat hai! <span style="color:#dd6b20;">&#10024;</span>
    </h1>
    <p style="margin:0 0 20px;font-size:15px;color:#888;">Welcome to indlish, ${displayName}</p>
    <p style="margin:0 0 16px;font-size:15px;color:#ccc;line-height:1.7;">
      Your account is ready. Start writing in Hinglish or English, build your audience, and earn tips from readers who love your work.
    </p>
    <table width="100%" cellpadding="0" cellspacing="0" style="margin:20px 0;">
      <tr>
        <td style="padding:10px 0;border-bottom:1px solid #2e2e2e;">
          <span style="color:#dd6b20;font-size:16px;margin-right:10px;">&#9997;</span>
          <span style="font-size:14px;color:#ccc;">Write articles in Hinglish or English</span>
        </td>
      </tr>
      <tr>
        <td style="padding:10px 0;border-bottom:1px solid #2e2e2e;">
          <span style="color:#dd6b20;font-size:16px;margin-right:10px;">&#128218;</span>
          <span style="font-size:14px;color:#ccc;">Curate boards with your favourite reads</span>
        </td>
      </tr>
      <tr>
        <td style="padding:10px 0;">
          <span style="color:#dd6b20;font-size:16px;margin-right:10px;">&#128176;</span>
          <span style="font-size:14px;color:#ccc;">Earn tips via UPI from your readers</span>
        </td>
      </tr>
    </table>
    ${ctaButton(`${BASE_URL}/dashboard`, 'Go to Your Dashboard')}
  `);

  await sendEmailHTML({
    to: email,
    toName: name || '',
    subject: 'Welcome to indlish — aapka swagat hai!',
    html,
  });
}

export async function sendFollowerNotification({
  authorEmail,
  authorName,
  followerName,
  followerUsername,
}: {
  authorEmail: string;
  authorName: string;
  followerName: string;
  followerUsername?: string | null;
}): Promise<void> {
  const profileUrl = followerUsername
    ? `${BASE_URL}/@${followerUsername}`
    : BASE_URL;

  const html = emailLayout(`
    <p style="margin:0 0 8px;font-size:11px;font-weight:700;color:#dd6b20;text-transform:uppercase;letter-spacing:1.5px;">New Follower</p>
    <h1 style="margin:0 0 20px;font-size:24px;font-weight:800;color:#f0f0f0;line-height:1.2;">
      <span style="color:#dd6b20;">${followerName}</span> is now following you
    </h1>
    <p style="margin:0 0 16px;font-size:15px;color:#ccc;line-height:1.7;">
      Hey ${authorName}! Your audience is growing — <strong style="color:#f0f0f0;">${followerName}</strong> just followed your profile on indlish.
    </p>
    <p style="margin:0;font-size:14px;color:#888;line-height:1.6;">
      Keep writing great content and your readers will keep growing. Likhe jao! &#9997;
    </p>
    ${ctaButton(profileUrl, `View ${followerName}'s Profile`)}
  `);

  await sendEmailHTML({
    to: authorEmail,
    toName: authorName,
    subject: `${followerName} started following you on indlish`,
    html,
  });
}

export async function sendCommentNotification({
  authorEmail,
  authorName,
  commenterName,
  articleTitle,
  articleSlug,
}: {
  authorEmail: string;
  authorName: string;
  commenterName: string;
  articleTitle: string;
  articleSlug: string;
}): Promise<void> {
  const articleUrl = `${BASE_URL}/articles/${articleSlug}`;

  const html = emailLayout(`
    <p style="margin:0 0 8px;font-size:11px;font-weight:700;color:#dd6b20;text-transform:uppercase;letter-spacing:1.5px;">New Comment</p>
    <h1 style="margin:0 0 20px;font-size:24px;font-weight:800;color:#f0f0f0;line-height:1.2;">
      Someone commented on your article
    </h1>
    <p style="margin:0 0 20px;font-size:15px;color:#ccc;line-height:1.7;">
      Hey ${authorName}, <strong style="color:#f0f0f0;">${commenterName}</strong> left a comment on your article:
    </p>
    <div style="padding:16px 20px;background-color:#2a2a2a;border-left:3px solid #dd6b20;border-radius:0 6px 6px 0;margin-bottom:8px;">
      <p style="margin:0;font-size:15px;color:#f0f0f0;font-weight:600;line-height:1.4;">${articleTitle}</p>
    </div>
    ${ctaButton(articleUrl, 'Read the Comment')}
  `);

  await sendEmailHTML({
    to: authorEmail,
    toName: authorName,
    subject: `${commenterName} commented on "${articleTitle}"`,
    html,
  });
}

export async function sendWeeklyDigest({
  email,
  name,
  articles,
}: {
  email: string;
  name: string;
  articles: Array<{ title: string; slug: string; authorName: string }>;
}): Promise<void> {
  const topArticles = articles.slice(0, 5);
  const articleRows = topArticles
    .map(
      (a) => `
      <tr>
        <td style="padding:14px 0;border-bottom:1px solid #2a2a2a;">
          <a href="${BASE_URL}/articles/${a.slug}" style="text-decoration:none;">
            <p style="margin:0 0 4px;font-size:15px;font-weight:600;color:#f0f0f0;line-height:1.3;">${a.title}</p>
            <p style="margin:0;font-size:13px;color:#888;">by ${a.authorName}</p>
          </a>
        </td>
      </tr>`
    )
    .join('');

  const html = emailLayout(`
    <p style="margin:0 0 8px;font-size:11px;font-weight:700;color:#dd6b20;text-transform:uppercase;letter-spacing:1.5px;">Weekly Digest</p>
    <h1 style="margin:0 0 6px;font-size:24px;font-weight:800;color:#f0f0f0;line-height:1.2;">This week on indlish</h1>
    <p style="margin:0 0 24px;font-size:15px;color:#888;">Namaste ${name}! Top reads curated for you.</p>
    <table width="100%" cellpadding="0" cellspacing="0">
      ${articleRows}
    </table>
    ${ctaButton(`${BASE_URL}/feed`, 'Explore More on indlish')}
  `);

  await sendEmailHTML({
    to: email,
    toName: name,
    subject: 'Your weekly digest from indlish',
    html,
  });
}

export async function sendSubscriptionConfirmation({
  email,
  authorName,
}: {
  email: string;
  authorName: string;
}): Promise<void> {
  const html = emailLayout(`
    <p style="margin:0 0 8px;font-size:11px;font-weight:700;color:#dd6b20;text-transform:uppercase;letter-spacing:1.5px;">Subscription Confirmed</p>
    <h1 style="margin:0 0 20px;font-size:24px;font-weight:800;color:#f0f0f0;line-height:1.2;">
      You're subscribed to <span style="color:#dd6b20;">${authorName}</span> &#127881;
    </h1>
    <p style="margin:0 0 16px;font-size:15px;color:#ccc;line-height:1.7;">
      You'll get email updates whenever <strong style="color:#f0f0f0;">${authorName}</strong> publishes something new on indlish.
    </p>
    <p style="margin:0;font-size:14px;color:#888;line-height:1.6;">
      While you wait for their next post, explore other great reads on indlish.
    </p>
    ${ctaButton(`${BASE_URL}/feed`, 'Explore indlish')}
  `);

  await sendEmailHTML({
    to: email,
    subject: `You're now subscribed to ${authorName} on indlish`,
    html,
  });
}
