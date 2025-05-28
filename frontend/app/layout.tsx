import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Job Board',
  description: 'Discover your next career move with our AI-powered job search platform',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" />
      </head>
      <body className="min-h-screen flex flex-col">
        {/* Header */}
        <header className="bg-white shadow-sm sticky top-0 z-10">
          <div className="container mx-auto px-4 py-4 sm:px-6 lg:px-8 flex items-center justify-between">
            <h1 className="text-2xl font-bold text-blue-600">Job Board</h1>
            <nav className="flex space-x-4">
              <a href="/" className="text-gray-600 hover:text-blue-600 font-medium transition">Home</a>
              <a href="/about" className="text-gray-600 hover:text-blue-600 font-medium transition">About</a>
            </nav>
          </div>
        </header>

        {/* Main Content */}
        <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-grow">
          {children}
        </main>

        {/* Footer */}
        <footer className="bg-gray-900 text-white py-6">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <p className="text-sm">© {new Date().getFullYear()} Job Board. All rights reserved.</p>
          </div>
        </footer>
      </body>
    </html>
  );
}