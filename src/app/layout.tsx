import type { Metadata } from 'next';
import { ThemeProvider } from 'next-themes';
import './globals.css';
import { QueryProvider } from '@/components/providers/query-provider';
import { SessionProvider } from 'next-auth/react';

export const metadata: Metadata = {
  title: {
    default: 'CarbonMind AI — Your Personal Climate Digital Twin',
    template: '%s | CarbonMind AI',
  },
  description:
    'AI-powered carbon footprint awareness platform. Understand, predict, simulate, and reduce your carbon emissions with personalized insights and intelligent recommendations.',
  keywords: [
    'carbon footprint',
    'climate change',
    'sustainability',
    'AI',
    'carbon calculator',
    'digital twin',
    'emissions tracker',
  ],
  authors: [{ name: 'CarbonMind AI' }],
  openGraph: {
    title: 'CarbonMind AI — Your Personal Climate Digital Twin',
    description:
      'AI-powered carbon footprint platform with personalized insights, forecasting, and reduction strategies.',
    type: 'website',
    locale: 'en_US',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-dvh bg-background font-sans text-foreground antialiased">
        {/* Accessibility: Skip to main content */}
        <a
          href="#main-content"
          className="skip-to-content"
        >
          Skip to main content
        </a>

        <SessionProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="dark"
            disableTransitionOnChange
          >
            <QueryProvider>
              {children}
            </QueryProvider>
          </ThemeProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
