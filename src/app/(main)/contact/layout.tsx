import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Contact Us',
  description: "Get in touch with the indlish team. Questions, feedback, or partnership inquiries — we'd love to hear from you.",
  alternates: { canonical: 'https://indlish.com/contact' },
  openGraph: {
    title: 'Contact Us — indlish',
    description: "Get in touch with the indlish team. Questions, feedback, or partnership inquiries — we'd love to hear from you.",
    url: 'https://indlish.com/contact',
    siteName: 'indlish',
  },
};

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
