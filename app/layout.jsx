import { Inter } from 'next/font/google';
import "./globals.css";
// Root Layout base
import { SiteSettingsProvider } from "@/context/SiteSettingsContext";

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

export const viewport = {
  themeColor: "#0a0a0a",
};

export const metadata = {
  metadataBase: new URL("https://www.cinemafocus.in"),
  title: {
    default: "Cinema Focus - Premium Audio & Home Cinema Systems",
    template: "%s - Cinema Focus"
  },
  description: "Cinema Focus delivers reference-class Home Cinema & Hi-Fi audio systems in Chennai, India. Explore our curated collection of speakers, subwoofers, amplifiers, and turntables.",
  keywords: "home cinema, hi-fi audio, speakers, subwoofers, amplifiers, turntables, premium audio, Chennai, India, Cinema Focus",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Cinema Focus | Ultimate Audio & Visual Experiences",
    description: "Cinema Focus delivers reference-class Home Cinema & Hi-Fi audio systems in Chennai, India.",
    url: "https://cinemafocus.in",
    siteName: "Cinema Focus",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: "/images/og-image.jpg", // Replace with your actual OG image path
        width: 1200,
        height: 630,
        alt: "Cinema Focus - Premium Home Cinema & Audio",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Cinema Focus | Ultimate Audio & Visual Experiences",
    description: "Cinema Focus delivers reference-class Home Cinema & Hi-Fi audio systems in Chennai, India.",
    site: "@cinemafocus",
    images: ["/images/default-og.jpg"],
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Cinema Focus",
  },
  icons: {
    icon: "/favi.png",
    apple: "/favi.png",
  },
  verification: {
    google: "YOLdFRVvcOEOjjo66oERr9NlrwHPjUofprZheVZkajU",
  },
  other: {
    "dns-prefetch": "https://xdvzchxtbwfdmlxhnzpo.supabase.co",
    "preconnect": [
      "https://xdvzchxtbwfdmlxhnzpo.supabase.co",
      "https://images.unsplash.com"
    ]
  }
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="h-full">
      <body className={`${inter.variable} flex flex-col min-h-screen bg-background text-foreground antialiased selection:bg-black/10`}>
        <SiteSettingsProvider>
          {children}
        </SiteSettingsProvider>
      </body>
    </html>
  );
}
