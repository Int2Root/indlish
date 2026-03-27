import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Terms of Service — indlish',
  description: 'Terms of Service for indlish, the India-native creator platform by Int2Root.',
};

export default function TermsPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
      <h1 className="text-3xl font-bold mb-2">Terms of Service</h1>
      <p className="text-text-muted text-sm mb-10">Last updated: March 2026</p>

      <div className="prose prose-invert max-w-none space-y-8 text-text-secondary">
        <section>
          <h2 className="text-xl font-semibold text-text-primary mb-3">1. Acceptance of Terms</h2>
          <p>
            By accessing or using indlish (&quot;the Platform&quot;), operated by Int2Root, you agree to be
            bound by these Terms of Service. If you do not agree, please do not use the Platform.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-text-primary mb-3">2. Your Account</h2>
          <p>
            You must provide accurate information when creating an account. You are responsible for
            maintaining the confidentiality of your password. You must be at least 13 years old to
            use indlish.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-text-primary mb-3">3. Content You Post</h2>
          <p>
            You retain ownership of the content you publish on indlish. By posting content, you
            grant Int2Root a non-exclusive, royalty-free licence to display and distribute it on the
            Platform. You are solely responsible for ensuring your content does not violate any laws
            or third-party rights.
          </p>
          <p className="mt-3">You agree not to post content that is:</p>
          <ul className="list-disc pl-6 mt-2 space-y-1">
            <li>Unlawful, harmful, or discriminatory</li>
            <li>Spam or deliberately misleading</li>
            <li>In violation of intellectual property rights</li>
            <li>Sexually explicit or targeted at minors</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-text-primary mb-3">4. UPI Tipping</h2>
          <p>
            The tipping feature allows readers to voluntarily send money to creators. Int2Root does
            not take a platform fee at this time. All transactions are processed via Razorpay.
            Int2Root is not liable for failed transactions or disputes between readers and creators.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-text-primary mb-3">5. Prohibited Use</h2>
          <p>
            You may not use indlish to scrape data, run automated bots, attempt to gain
            unauthorised access to systems, or engage in any activity that disrupts the Platform
            for other users.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-text-primary mb-3">6. Termination</h2>
          <p>
            Int2Root reserves the right to suspend or terminate accounts that violate these terms,
            with or without notice. You may delete your account at any time from Settings.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-text-primary mb-3">7. Disclaimers</h2>
          <p>
            indlish is provided &quot;as is&quot; without warranties of any kind. Int2Root is not
            responsible for the accuracy of user-generated content. We do not guarantee uptime or
            uninterrupted access.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-text-primary mb-3">8. Governing Law</h2>
          <p>
            These terms are governed by the laws of India. Any disputes shall be subject to the
            exclusive jurisdiction of courts in Bengaluru, Karnataka.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-text-primary mb-3">9. Contact</h2>
          <p>
            For questions about these terms, email us at{' '}
            <a href="mailto:hello@int2root.com" className="text-brand-400 hover:underline">
              hello@int2root.com
            </a>
            .
          </p>
        </section>
      </div>
    </div>
  );
}
