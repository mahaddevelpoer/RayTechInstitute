import { siteUrl } from "@/lib/site";
import type { Metadata } from "next";
import "./globals.css";
import "./catalog.css";
import { channelData } from "@/data/channel";
import { serializeJsonLd, buildSeoTitle } from "@/utils/seo";
import { ThemeProvider } from "@/hooks/useTheme";
import { FirebaseAnalytics } from "@/components/FirebaseAnalytics";
import { CompilerMount } from "@/components/compiler/CompilerMount";
import CookieConsentBanner from "@/components/CookieConsentBanner";
import NotificationPrompt from "@/components/NotificationPrompt";
import { BRAND_DESCRIPTION } from '@/data/brand';
import { DEFAULT_SOCIAL_IMAGE } from '@/data/social';

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl("/")),
  verification: process.env.GOOGLE_SITE_VERIFICATION ? { google: process.env.GOOGLE_SITE_VERIFICATION.trim() } : undefined,
  title: {
    default: buildSeoTitle("Class Study Resources and Programming Courses"),
    template: "%s",
  },
  description:
    BRAND_DESCRIPTION,
  keywords: [
    "RayTech Institute",
    "Class-wise Study Notes",
    "Subject MCQs and Chapter Tests",
    "Examination Past Papers",
    "Board Results and Gazettes",
    "Python Programming Lectures",
    "Programming Courses",
    "Examination Date Sheets",
    "Result Gazette PDF Download",
  ],
  authors: [{ name: channelData.name, url: channelData.youtubeUrl }],
  creator: channelData.name,
  publisher: channelData.name,
  alternates: {
    canonical: siteUrl("/"),
  },
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/favicon-32x32.png", type: "image/png", sizes: "32x32" },
      { url: "/favicon-16x16.png", type: "image/png", sizes: "16x16" },
    ],
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
    other: [
      {
        rel: "manifest",
        url: "/site.webmanifest",
      },
    ],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "en_PK",
    url: siteUrl("/"),
    title:
      buildSeoTitle("Class Study Resources and Programming Courses"),
    description:
      BRAND_DESCRIPTION,
    siteName: "RayTech Institute",
    images: [
      {
        ...DEFAULT_SOCIAL_IMAGE,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title:
      buildSeoTitle("Class Study Resources and Programming Courses"),
    description:
      BRAND_DESCRIPTION,
    images: [DEFAULT_SOCIAL_IMAGE.url],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "RayTech Institute",
    url: siteUrl("/"),
    description:
      BRAND_DESCRIPTION,
    inLanguage: "en-PK",
    publisher: {
      "@type": "EducationalOrganization",
      name: channelData.name,
      url: channelData.youtubeUrl,
      logo: siteUrl("/android-chrome-192x192.png"),
    },
  };

  const orgSchema = {
    "@context": "https://schema.org",
    "@type": "EducationalOrganization",
    name: channelData.name,
    alternateName: channelData.handle,
    description: channelData.statement,
    url: siteUrl("/"),
    logo: siteUrl("/android-chrome-192x192.png"),
    sameAs: [channelData.youtubeUrl],
    knowsAbout: channelData.contentAreas,
    areaServed: "Pakistan",
  };

  return (
    <html lang="en" className="scroll-smooth light" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href="/favicon-32x32.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href="/favicon-16x16.png"
        />
        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="/apple-touch-icon.png"
        />
        <link rel="manifest" href="/site.webmanifest" />

        {/* Prevent Flash of Unstyled Theme - Default Light */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                var saved = localStorage.getItem('raytech_theme');
                if (saved === 'dark' || (saved !== 'light' && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
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
          dangerouslySetInnerHTML={{ __html: serializeJsonLd(websiteSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: serializeJsonLd(orgSchema) }}
        />
      </head>
      <body
        className="bg-white text-slate-800 antialiased min-h-screen"
        suppressHydrationWarning
      >
        <ThemeProvider>
          <a className="skip-link" href="#main-content">
            Skip to content
          </a>
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
