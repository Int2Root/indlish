import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description: 'Privacy Policy for indlish — how we collect, use, and protect your data.',
};

export default function PrivacyPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
      <h1 className="text-3xl font-bold mb-2">Privacy Policy</h1>
      <p className="text-text-muted text-sm mb-8">Last updated: January 2025</p>

      <div className="space-y-8 text-text-secondary">
        <section>
          <h2 className="text-xl font-semibold text-text-primary mb-3">1. Information We Collect</h2>
          <p className="mb-3">We collect the following types of information:</p>
          <ul className="list-disc pl-6 space-y-1">
            <li>
              <strong className="text-text-primary">Account information:</strong> Name, email address,
              and password (hashed) when you register
            </li>
            <li>
              <strong className="text-text-primary">Profile information:</strong> Username, bio, and
              profile image you provide
            </li>
            <li>
              <strong className="text-text-primary">Content:</strong> Articles, notebooks, notes, and
              boards you create
            </li>
            <li>
              <strong className="text-text-primary">Usage data:</strong> Pages visited, article views,
              and interaction patterns
            </li>
            <li>
              <strong className="text-text-primary">Google OAuth:</strong> If you sign in with Google,
              we receive your name, email, and profile picture
            </li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-text-primary mb-3">2. How We Use Your Information</h2>
          <ul className="list-disc pl-6 space-y-1">
            <li>To provide and improve the indlish platform</li>
            <li>To personalise your feed and content recommendations</li>
            <li>To process UPI tip transactions via Razorpay</li>
            <li>To send important account-related notifications</li>
            <li>To detect and prevent fraud or abuse</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-text-primary mb-3">3. Data Storage</h2>
          <p>
            Your data is stored on secure servers hosted on Neon (PostgreSQL) and Vercel. We apply
            industry-standard security measures including encryption in transit (HTTPS) and at rest.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-text-primary mb-3">4. Data Sharing</h2>
          <p className="mb-3">We do not sell your personal data. We share data only with:</p>
          <ul className="list-disc pl-6 space-y-1">
            <li>
              <strong className="text-text-primary">Razorpay</strong> — for payment processing
            </li>
            <li>
              <strong className="text-text-primary">Google</strong> — if you use Google sign-in
            </li>
            <li>
              <strong className="text-text-primary">Vercel / Neon</strong> — our infrastructure
              providers
            </li>
            <li>Law enforcement when required by applicable Indian law</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-text-primary mb-3">5. Public Content</h2>
          <p>
            Articles you publish as &quot;Public&quot; are visible to all visitors, including search engines.
            Your username, display name, and public profile are also visible. Drafts and private
            notebooks/boards are only accessible to you.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-text-primary mb-3">6. Cookies and Sessions</h2>
          <p>
            We use session cookies to keep you logged in. We do not use tracking cookies for
            advertising. You can clear cookies at any time through your browser settings.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-text-primary mb-3">7. Your Rights</h2>
          <p className="mb-3">You have the right to:</p>
          <ul className="list-disc pl-6 space-y-1">
            <li>Access the personal data we hold about you</li>
            <li>Request correction of inaccurate data</li>
            <li>Request deletion of your account and data</li>
            <li>Export your content</li>
          </ul>
          <p className="mt-3">
            To exercise these rights, email us at{' '}
            <a href="mailto:support@indlish.com" className="text-brand-400 hover:text-brand-300">
              support@indlish.com
            </a>
            .
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-text-primary mb-3">8. Children&apos;s Privacy</h2>
          <p>
            indlish is not intended for users under 13 years of age. We do not knowingly collect
            data from children under 13.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-text-primary mb-3">9. Changes to This Policy</h2>
          <p>
            We may update this Privacy Policy from time to time. We will notify registered users via
            email for significant changes. Continued use of the platform after changes constitutes
            acceptance of the updated policy.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-text-primary mb-3">10. Contact</h2>
          <p>
            For privacy-related questions, contact Int2Root at{' '}
            <a href="mailto:hello@int2root.com" className="text-brand-400 hover:text-brand-300">
              hello@int2root.com
            </a>
            .
          </p>
        </section>
      </div>
    </div>
  );
}
