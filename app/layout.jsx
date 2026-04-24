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
  description: "Cinema Focus delivers reference-class Home Cinema & Hi-Fi audio systems in Oman. Explore our curated collection of speakers, subwoofers, amplifiers, and turntables.",
  keywords: "home cinema, hi-fi audio, speakers, subwoofers, amplifiers, turntables, premium audio, Oman, Cinema Focus",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Cinema Focus - Premium Audio & Home Cinema Systems",
    description: "Cinema Focus delivers reference-class Home Cinema & Hi-Fi audio systems in Oman.",
    url: "https://www.cinemafocus.in",
    siteName: "Cinema Focus",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: "/images/default-og.jpg",
        width: 1200,
        height: 630,
        alt: "Cinema Focus - Premium Audio & Home Cinema Systems",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Cinema Focus - Premium Audio & Home Cinema Systems",
    description: "Cinema Focus delivers reference-class Home Cinema & Hi-Fi audio systems in Oman.",
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
  other: {
    "dns-prefetch": "https://xdvzchxtbwfdmlxhnzpo.supabase.co",
    "preconnect": "https://xdvzchxtbwfdmlxhnzpo.supabase.co",
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
