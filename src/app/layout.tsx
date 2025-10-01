import { Inter } from "next/font/google";
import { Metadata } from "next";
import { Providers } from "@/components/Providers";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: {
    default: "The Cliff News - Latest Breaking News & Updates",
    template: "%s | The Cliff News",
  },
  description:
    "Stay updated with the latest breaking news, politics, entertainment, sports, and more from The Cliff News. Your trusted source for accurate and timely information.",
  keywords: [
    "news",
    "breaking news",
    "politics",
    "entertainment",
    "sports",
    "business",
    "technology",
  ],
  authors: [{ name: "The Cliff News Team" }],
  creator: "The Cliff News",
  publisher: "The Cliff News",
  metadataBase: new URL("https://cliffnews.in"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://cliffnews.in",
    title: "The Cliff News - Latest Breaking News & Updates",
    description:
      "Stay updated with the latest breaking news, politics, entertainment, sports, and more from The Cliff News.",
    siteName: "The Cliff News",
    images: [
      {
        url: "/dark-logo.png",
        width: 1200,
        height: 630,
        alt: "The Cliff News",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "The Cliff News - Latest Breaking News & Updates",
    description:
      "Stay updated with the latest breaking news, politics, entertainment, sports, and more.",
    images: ["/dark-logo.png"],
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
  verification: {
    google: "your-google-verification-code",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon.png" />
        <link rel="apple-touch-icon" href="/icon.png" />
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#f97316" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body className={inter.className} suppressHydrationWarning>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
