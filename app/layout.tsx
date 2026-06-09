import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import Navbar from '@/components/Navbar';
import AuraBackground from '@/components/AuraBackground';
import MouseTrail from '@/components/MouseTrail';
import { site, contact } from '@/lib/data';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: site.title,
  description: site.description,
  icons: {
    icon: [
      { url: '/favicon.png' },
      { url: '/favicon.ico' },
    ],
    apple: [{ url: '/apple-touch-icon.png' }],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" style={{ scrollPaddingTop: '80px' }}>
      <body className={inter.className}>
        <AuraBackground />
        <MouseTrail />
        <Navbar />
        {children}
        <footer className="site-footer">
          <p>
            GitHub:{' '}
            <a href={contact.github} target="_blank" rel="noopener noreferrer">
              {contact.githubLabel}
            </a>
          </p>
          <p>{site.copyright}</p>
        </footer>
      </body>
    </html>
  );
}
