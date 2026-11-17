import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://chathuranga-vinuri-wedding.vercel.app'),
  title: 'Chathuranga & Vinuri — Our Wedding',
  description: 'Join Chathuranga and Vinuri as they celebrate their wedding at Grand Monarch, Thalawathugoda.',
  openGraph: {
    title: 'Chathuranga & Vinuri — Our Wedding',
    description: '11 December 2026 · Grand Monarch, Thalawathugoda',
    type: 'website',
    images: [{ url: '/og.png', width: 1731, height: 909, alt: 'Chathuranga and Vinuri wedding invitation' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Chathuranga & Vinuri — Our Wedding',
    description: '11 December 2026 · Grand Monarch, Thalawathugoda',
    images: ['/og.png'],
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
