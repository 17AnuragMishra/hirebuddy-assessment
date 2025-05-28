import type { Metadata } from 'next';
import './globals.css';
import Link from 'next/link';
import { inter } from './fonts';

export const metadata: Metadata = {
  title: 'HireBuddy - Find Your Dream Job',
  description: 'AI-powered job search platform',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={inter.variable}>
      <body className={`${inter.className} antialiased`}>
        <header className="bg-white shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <Link href="/" className="text-2xl font-bold text-blue-600 hover:text-blue-700 transition">
              HireBuddy
            </Link>
          </div>
        </header>
        <main className="min-h-screen">
          {children}
        </main>
      </body>
    </html>
  );
}