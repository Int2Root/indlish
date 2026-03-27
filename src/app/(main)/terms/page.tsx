import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Terms of Service',
  description: 'Terms of Service for indlish — the India-native creator platform by Int2Root.',
};

export default function TermsPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
      <h1 className="text-3xl font-bold mb-2">Terms of Service</h1>
      <p className="text-text-muted text-sm mb-8">Last updated: January 2025</p>

      <div className="prose-like space-y-8 text-text-secondary">
        <section>
          <h2 className="text-xl font-semibold text-text-primary mb-3">1. Acceptance of Terms</h2>
          <p>
            By accessing or using indlish (&quot;the Platform&quot;), operated by Int2Root, you agree to be bound
            by these Terms of Service. If you do not agree to these terms, please do not use the Platform.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-text-primary mb-3">2. Use of the Platform</h2>
          <p className="mb-3">You agree to use indlish only for lawful purposes. You must not:</p>
          <ul className="list-disc pl-6 space-y-1">
            <li>Post content that is illegal, harmful, threatening, abusive, or defamatory</li>
            <li>Infringe on any intellectual property rights</li>
            <li>Upload malicious code, spam, or deceptive content</li>
            <li>Impersonate another person or organisation</li>
            <li>Scrape or harvest data without permission</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-text-primary mb-3">3. User Content</h2>
          <p>
            You retain ownership of all content you publish on indlish. By posting content, you grant
            Int2Root a non-exclusive, worldwide, royalty-free licence to display and distribute your
            content on the Platform. You are solely responsible for the content you publish.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-text-primary mb-3">4. Account Responsibility</h2>
          <p>
            You are responsible for maintaining the confidentiality of your account credentials and for
            all activities that occur under your account. Notify us immediately at{' '}
            <a href="mailto:support@indlish.com" className="text-brand-400 hover:text-brand-300">
              support@indlish.com
            </a>{' '}
            if you suspect unauthorised access.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-text-primary mb-3">5. Payments and Tips</h2>
          <p>
            indlish facilitates UPI-based tipping between readers and creators. All transactions are
            processed via Razorpay. Int2Root does not store payment card information. Tips are
            non-refundable unless required by applicable law.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-text-primary mb-3">6. Plan Limits</h2>
          <p>
            Free accounts are subject to usage limits as described on the{' '}
            <Link href="/pricing" className="text-brand-400 hover:text-brand-300">
              pricing page
            </Link>
            . Int2Root reserves the right to modify plan limits with reasonable notice.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-text-primary mb-3">7. Termination</h2>
          <p>
            Int2Root reserves the right to suspend or terminate accounts that violate these terms,
            engage in harmful behaviour, or post illegal content, without prior notice.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-text-primary mb-3">8. Disclaimer of Warranties</h2>
          <p>
            indlish is provided &quot;as is&quot; without warranties of any kind. Int2Root does not guarantee
            uptime, accuracy, or fitness for a particular purpose.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-text-primary mb-3">9. Governing Law</h2>
          <p>
            These Terms are governed by the laws of India. Any disputes shall be subject to the
            exclusive jurisdiction of courts in India.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-text-primary mb-3">10. Contact</h2>
          <p>
            For questions about these Terms, contact us at{' '}
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
