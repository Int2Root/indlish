import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Privacy Policy — indlish',
  description: 'Privacy Policy for indlish, the India-native creator platform by Int2Root.',
};

export default function PrivacyPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
      <h1 className="text-3xl font-bold mb-2">Privacy Policy</h1>
      <p className="text-text-muted text-sm mb-10">Last updated: March 2026</p>

      <div className="prose prose-invert max-w-none space-y-8 text-text-secondary">
        <section>
          <h2 className="text-xl font-semibold text-text-primary mb-3">1. What We Collect</h2>
          <p>When you use indlish, we may collect:</p>
          <ul className="list-disc pl-6 mt-2 space-y-1">
            <li>Account information (name, email, profile picture) when you register</li>
            <li>Content you create (articles, notebooks, boards)</li>
            <li>Usage data (pages visited, features used, reading time)</li>
            <li>Device and browser information for security purposes</li>
          </ul>
          <p className="mt-3">
            If you sign in with Google, we receive your public profile information as permitted by
            Google&apos;s OAuth scope.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-text-primary mb-3">2. How We Use Your Data</h2>
          <p>We use your data to:</p>
          <ul className="list-disc pl-6 mt-2 space-y-1">
            <li>Provide and improve the Platform</li>
            <li>Send transactional emails (account verification, password reset)</li>
            <li>Show relevant content in your feed</li>
            <li>Detect abuse and maintain security</li>
          </ul>
          <p className="mt-3">We do not sell your personal data to third parties.</p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-text-primary mb-3">3. Cookies</h2>
          <p>
            We use cookies and similar technologies to keep you logged in and to understand how the
            Platform is used. You can disable cookies in your browser, but some features may not
            work correctly.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-text-primary mb-3">4. Data Sharing</h2>
          <p>
            We share data only with trusted service providers (database hosting, email, payment
            processing) under strict data processing agreements. We may disclose data if required
            by law.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-text-primary mb-3">5. Data Retention</h2>
          <p>
            We retain your data as long as your account is active. When you delete your account,
            your personal information is removed within 30 days. Published articles may remain in
            anonymised form unless you explicitly request deletion.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-text-primary mb-3">6. Your Rights</h2>
          <p>Under applicable law, you have the right to:</p>
          <ul className="list-disc pl-6 mt-2 space-y-1">
            <li>Access the personal data we hold about you</li>
            <li>Correct inaccurate data</li>
            <li>Request deletion of your data</li>
            <li>Export your content</li>
          </ul>
          <p className="mt-3">
            To exercise these rights, email{' '}
            <a href="mailto:support@indlish.com" className="text-brand-400 hover:underline">
              support@indlish.com
            </a>
            .
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-text-primary mb-3">7. Security</h2>
          <p>
            We use industry-standard encryption (HTTPS/TLS) and follow security best practices.
            Passwords are hashed using bcrypt. However, no system is 100% secure — please use a
            strong, unique password.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-text-primary mb-3">8. Children</h2>
          <p>
            indlish is not directed at children under 13. We do not knowingly collect personal
            information from children under 13.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-text-primary mb-3">9. Changes to This Policy</h2>
          <p>
            We may update this policy from time to time. We will notify registered users of
            material changes by email. Continued use of the Platform after changes constitutes
            acceptance.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-text-primary mb-3">10. Contact</h2>
          <p>
            Questions or concerns? Email us at{' '}
            <a href="mailto:support@indlish.com" className="text-brand-400 hover:underline">
              support@indlish.com
            </a>
            .
          </p>
        </section>
      </div>
    </div>
  );
}
