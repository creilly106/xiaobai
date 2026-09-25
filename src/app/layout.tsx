import type { Metadata, Viewport } from 'next';
import Script from 'next/script';
import { Geist, Geist_Mono } from 'next/font/google';
import { Toaster } from '@/components/ui/sonner';
import { SiteHeader } from '@/components/site-header';
import { ThemeProvider } from '@/components/theme-provider';
import { TimeZoneCookie } from '@/components/time-zone-cookie';
import { ServiceWorker } from '@/components/service-worker';
import { ACCENT_INIT_SCRIPT } from '@/lib/accent';
import './globals.css';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: {
    default: '小白 · Xiaobai',
    template: '%s · 小白 Xiaobai',
  },
  description:
    'Xiaobai (小白 — "beginner") is a spaced-repetition, scenario, and grammar workbench for learning Chinese from scratch.',
  // Opened from the iPhone home screen: full-screen, no Safari bars.
  appleWebApp: { capable: true, title: 'Xiaobai', statusBarStyle: 'default' },
};

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#0a0a0a' },
  ],
};

export default function RootLayout({ children }: LayoutProps<'/'>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-background text-foreground">
        <Script id="accent-init" strategy="beforeInteractive">
          {ACCENT_INIT_SCRIPT}
        </Script>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <SiteHeader />
          <main id="main" className="flex-1 w-full">
            {children}
          </main>
          <Toaster />
          <TimeZoneCookie />
          <ServiceWorker />
        </ThemeProvider>
      </body>
    </html>
  );
}
