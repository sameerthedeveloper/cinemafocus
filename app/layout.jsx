import { Inter } from 'next/font/google';
import "./globals.css";
// Root Layout base
import { SiteSettingsProvider } from "@/context/SiteSettingsContext";
import { getImageSettings } from "@/lib/getImageSettings";

import { getSeo } from "@/lib/cms";

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

export const viewport = {
  themeColor: "#0a0a0a",
};

export async function generateMetadata() {
  let seoData = null;
  try {
    seoData = await getSeo();
  } catch (e) {
    console.error("Failed to load site SEO settings:", e);
  }

  const siteTitle = seoData?.siteTitle || "Cinema Focus";
  const titleSuffix = seoData?.titleSuffix || "- Cinema Focus";
  const description = seoData?.defaultDescription || "Cinema Focus delivers reference-class Home Cinema & Hi-Fi audio systems in Chennai, India. Explore our curated collection of speakers, subwoofers, amplifiers, and turntables.";
  const keywords = seoData?.defaultKeywords || "home cinema, hi-fi audio, speakers, subwoofers, amplifiers, turntables, premium audio, Chennai, India, Cinema Focus";
  const ogImage = seoData?.ogImage || "/images/og-image.jpg";
  const googleVerification = seoData?.googleVerification || "YOLdFRVvcOEOjjo66oERr9NlrwHPjUofprZheVZkajU";

  return {
    metadataBase: new URL("https://cinemafocus.in"),
    title: {
      default: `${siteTitle} - Premium Audio & Home Cinema Systems`,
      template: `%s ${titleSuffix}`
    },
    description,
    keywords,
    alternates: {
      canonical: "/",
    },
    openGraph: {
      title: `${siteTitle} | Ultimate Audio & Visual Experiences`,
      description,
      url: "https://cinemafocus.in",
      siteName: siteTitle,
      locale: "en_US",
      type: "website",
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: `${siteTitle} - Premium Home Cinema & Audio`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `${siteTitle} | Ultimate Audio & Visual Experiences`,
      description,
      site: "@cinemafocus",
      images: [ogImage],
    },
    appleWebApp: {
      capable: true,
      statusBarStyle: "black-translucent",
      title: siteTitle,
    },
    icons: {
      icon: [
        { url: "/logo.svg", type: "image/svg+xml" },
        { url: "/favicon.ico", type: "image/x-icon" }
      ],
      apple: [
        { url: "/logo.svg", type: "image/svg+xml" }
      ]
    },
    verification: {
      google: googleVerification,
    },
    other: {
      "dns-prefetch": "https://xdvzchxtbwfdmlxhnzpo.supabase.co",
      "preconnect": [
        "https://xdvzchxtbwfdmlxhnzpo.supabase.co",
        "https://images.unsplash.com"
      ]
    }
  };
}

export default async function RootLayout({ children }) {
  let imageSettings = { imageOptimizationMode: 'upload' };
  try {
    imageSettings = await getImageSettings();
  } catch (error) {
    console.error("Failed to load initial image settings in layout:", error);
  }

  return (
    <html lang="en" className="h-full">
      <body className={`${inter.variable} flex flex-col min-h-screen bg-background text-foreground antialiased selection:bg-black/10`}>
        <SiteSettingsProvider initialImageOptimizationMode={imageSettings?.imageOptimizationMode || 'upload'}>
          {children}
        </SiteSettingsProvider>
      </body>
    </html>
  );
}
