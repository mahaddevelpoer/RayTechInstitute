import { siteUrl } from "@/lib/site";
import type { Metadata } from "next";
import "./globals.css";
import "./learning.css";
import "./codi.css";
import "./home.css";
import { channelData } from "@/data/channel";
import { serializeJsonLd, buildSeoTitle } from "@/utils/seo";
import { ThemeProvider } from "@/hooks/useTheme";
import { FirebaseAnalytics } from "@/components/FirebaseAnalytics";
import { CompilerMount } from "@/components/compiler/CompilerMount";
import CookieConsentBanner from "@/components/CookieConsentBanner";
import NotificationPrompt from "@/components/NotificationPrompt";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl("/")),
  title: {
    default: buildSeoTitle("11th and 12th Computer Science Resources"),
    template: "%s",
  },
  description:
    "Study 11th and 12th class computer science with notes, chapter-wise MCQs, Punjab Board past papers, and official result gazettes.",
  keywords: [
    "RayTech Institute",
    "11th Class Computer Science Notes",
    "12th Class Computer Science Notes",
    "BISE Lahore Computer Science Past Papers",
    "BISE Gujranwala Gazettes",
    "FBISE Computer Science 1st Year",
    "FBISE Computer Science 2nd Year",
    "Punjab Board MCQs Online Test",
    "Python Programming Lectures",
    "C++ Programming for Intermediate",
    "Inter Date Sheet 2026",
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
      "11th & 12th Class Computer Science Notes, MCQs & Gazettes | RayTech Institute",
    description:
      "Download 11th & 12th class computer science notes, past papers, MCQs test bank, and official Punjab board result gazettes.",
    siteName: "RayTech Institute",
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
    card: "summary_large_image",
    title:
      "11th & 12th Class Computer Science Notes, MCQs & Gazettes | RayTech Institute",
    description:
      "Complete intermediate computer science notes, past papers, and result gazettes for Punjab boards.",
    images: [channelData.profileImage],
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
      "Free study resources for 11th and 12th class computer science students in Pakistan.",
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
