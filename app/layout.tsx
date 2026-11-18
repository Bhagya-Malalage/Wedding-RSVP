import type { Metadata } from 'next';
import './globals.css';

const siteUrl = new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://wedding-rsvp-omega-taupe.vercel.app');
const sharingTitle = 'Chathuranga & Vinuri - Our Wedding';
const sharingDescription = '11 December 2026 · Grand Monarch Thalawathugoda';
const sharingImage = new URL('/og.png?v=20261211-cv-20261118', siteUrl).toString();
const sharingImageAlt = `${sharingTitle}. 11 December 2026. Grand Monarch Thalawathugoda.`;

export const metadata: Metadata = {
  metadataBase: siteUrl,
  title: sharingTitle,
  description: sharingDescription,
  openGraph: {
    title: sharingTitle,
    description: sharingDescription,
    url: new URL('/', siteUrl).toString(),
    siteName: sharingTitle,
    locale: 'en_US',
    type: 'website',
    images: [{ url: sharingImage, width: 1200, height: 630, type: 'image/png', alt: sharingImageAlt }],
  },
  twitter: {
    card: 'summary_large_image',
    title: sharingTitle,
    description: sharingDescription,
    images: [{ url: sharingImage, alt: sharingImageAlt }],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}
