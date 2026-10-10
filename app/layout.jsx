import { Inter } from 'next/font/google';
import "./globals.css";
// Root Layout base
import { SiteSettingsProvider } from "@/context/SiteSettingsContext";
import { getImageSettings } from "@/lib/getImageSettings";

import { getSeo } from "@/lib/cms";
import { SITE, absoluteUrl } from "@/lib/site";
import { clampDescription, HOME_TITLE } from "@/lib/metadata";
import { preconnect } from "react-dom";
import JsonLd from "@/components/JsonLd";
import { siteGraph } from "@/lib/schema";
import { getAeoGeoResolved } from "@/lib/aeoGeo";

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

  const description = clampDescription(
    seoData?.defaultDescription,
    "Cinema Focus delivers reference-class Home Cinema & Hi-Fi audio systems in Chennai, India. Explore our curated collection of speakers, subwoofers, amplifiers, and turntables."
  );
  const ogImage = seoData?.ogImage || SITE.defaultOgImage;
  const googleVerification = seoData?.googleVerification || "YOLdFRVvcOEOjjo66oERr9NlrwHPjUofprZheVZkajU";

  return {
    metadataBase: new URL(SITE.url),
    title: {
      default: HOME_TITLE,
      template: `%s | ${SITE.name}`,
    },
    description,
    openGraph: {
      title: HOME_TITLE,
      description,
      siteName: SITE.name,
      locale: SITE.locale,
      type: "website",
      images: [{ url: absoluteUrl(ogImage), width: 1200, height: 630, alt: HOME_TITLE }],
    },
    twitter: {
      card: "summary_large_image",
      title: HOME_TITLE,
      description,
      site: SITE.twitter,
      creator: SITE.twitter,
      images: [absoluteUrl(ogImage)],
    },
    appleWebApp: {
      capable: true,
      statusBarStyle: "black-translucent",
      title: SITE.name,
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
  };
}

export default async function RootLayout({ children }) {
  // Only origins that actually serve page assets (images are on CloudFront)
  const cdnOrigin = process.env.NEXT_PUBLIC_CDN_DOMAIN
    ? `https://${process.env.NEXT_PUBLIC_CDN_DOMAIN}`
    : "https://d2x0o69dm3vdcd.cloudfront.net";
  preconnect(cdnOrigin);
  const aeoGeo = await getAeoGeoResolved();

  let imageSettings = { imageOptimizationMode: 'upload' };
  try {
    imageSettings = await getImageSettings();
  } catch (error) {
    console.error("Failed to load initial image settings in layout:", error);
  }

  return (
    <html lang="en" className="h-full">
      <head>
        <JsonLd data={siteGraph(aeoGeo.business, aeoGeo.aiSummary)} />
      </head>
      <body className={`${inter.variable} flex flex-col min-h-screen bg-background text-foreground antialiased selection:bg-black/10`}>
        <SiteSettingsProvider initialImageOptimizationMode={imageSettings?.imageOptimizationMode || 'upload'}>
          {children}
        </SiteSettingsProvider>
      </body>
    </html>
  );
}
