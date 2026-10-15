import type { Metadata } from 'next';
import './globals.css';
import { channelData } from '@/data/channel';
import { ThemeProvider } from '@/hooks/useTheme';
import { FirebaseAnalytics } from '@/components/FirebaseAnalytics';
import { CompilerMount } from '@/components/compiler/CompilerMount';
import CookieConsentBanner from '@/components/CookieConsentBanner';
import NotificationPrompt from '@/components/NotificationPrompt';

export const metadata: Metadata = {
  metadataBase: new URL('https://raytechinstitute.firebaseapp.com'),
  title: {
    default: '11th & 12th Class Computer Science Notes, MCQs & Gazettes | RayTech Institute',
    template: '%s | RayTech Institute',
  },
  description: 'Download 11th and 12th class computer science notes in PDF, attempt chapter-wise MCQs tests, access Punjab Board past papers and official result gazettes for BISE Lahore, Gujranwala, and FBISE.',
  keywords: [
    'RayTech Institute',
    '11th Class Computer Science Notes',
    '12th Class Computer Science Notes',
    'BISE Lahore Computer Science Past Papers',
    'BISE Gujranwala Gazettes',
    'FBISE Computer Science 1st Year',
    'FBISE Computer Science 2nd Year',
    'Punjab Board MCQs Online Test',
    'Python Programming Lectures',
    'C++ Programming for Intermediate',
    'Inter Date Sheet 2026',
    'Result Gazette PDF Download'
  ],
  authors: [{ name: channelData.name, url: channelData.youtubeUrl }],
  creator: channelData.name,
  publisher: channelData.name,
  alternates: {
    canonical: 'https://raytechinstitute.firebaseapp.com/',
  },
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/favicon-32x32.png', type: 'image/png', sizes: '32x32' },
      { url: '/favicon-16x16.png', type: 'image/png', sizes: '16x16' },
    ],
    apple: [
      { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
    ],
    other: [
      {
        rel: 'manifest',
        url: '/site.webmanifest',
      },
    ],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    type: 'website',
    locale: 'en_PK',
    url: 'https://raytechinstitute.firebaseapp.com/',
    title: '11th & 12th Class Computer Science Notes, MCQs & Gazettes | RayTech Institute',
    description: 'Download 11th & 12th class computer science notes, past papers, MCQs test bank, and official Punjab board result gazettes.',
    siteName: 'RayTech Institute',
    images: [
      {
        url: channelData.profileImage,
        width: 900,
        height: 900,
        alt: `${channelData.name} - Computer Science Education Portal`,
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: '11th & 12th Class Computer Science Notes, MCQs & Gazettes | RayTech Institute',
    description: 'Complete intermediate computer science notes, past papers, and result gazettes for Punjab boards.',
    images: [channelData.profileImage],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const websiteSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'RayTech Institute',
    url: 'https://raytechinstitute.firebaseapp.com/',
    description: 'Free study resources for 11th and 12th class computer science students in Pakistan.',
    publisher: {
      '@type': 'EducationalOrganization',
      name: channelData.name,
      url: channelData.youtubeUrl,
      logo: 'https://raytechinstitute.firebaseapp.com/android-chrome-192x192.png',
    },
  };

  const orgSchema = {
    '@context': 'https://schema.org',
    '@type': 'EducationalOrganization',
    name: channelData.name,
    alternateName: channelData.handle,
    description: channelData.statement,
    url: 'https://raytechinstitute.firebaseapp.com/',
    logo: 'https://raytechinstitute.firebaseapp.com/android-chrome-192x192.png',
    sameAs: [channelData.youtubeUrl],
    knowsAbout: channelData.contentAreas,
  };

  return (
    <html lang="en" className="scroll-smooth light" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/site.webmanifest" />

        {/* Prevent Flash of Unstyled Theme - Default Light */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                var saved = localStorage.getItem('raytech_theme');
                if (saved === 'dark') {
                  document.documentElement.classList.add('dark');
                  document.documentElement.classList.remove('light');
                } else {
                  document.documentElement.classList.add('light');
                  document.documentElement.classList.remove('dark');
                }
              } catch (e) {}
            `,
          }}
        />

        {/* Structured Data: WebSite & EducationalOrganization */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(orgSchema) }}
        />
      </head>
      <body className="bg-white text-slate-800 antialiased min-h-screen" suppressHydrationWarning>
        <ThemeProvider>
          {children}
          {/* Global Compiler Mount (Unmounted on /blogs/*, /updates/*, /admin/*) */}
          <CompilerMount />
          {/* Functional Real Cookie Consent Banner */}
          <CookieConsentBanner />
          {/* Real Web Notification Prompt */}
          <NotificationPrompt />
        </ThemeProvider>
        <FirebaseAnalytics />
      </body>
    </html>
  );
}
