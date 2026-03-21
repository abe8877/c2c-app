import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono, Cormorant_Garamond, Playfair_Display } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const cormorantGaramond = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

const playfairDisplay = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
});

export const metadata: Metadata = {
  title: "INSIDERS. - Inbound Marketing with AI & Elite Creators",
  description: "インバウンド集客に特化した、S/Aランククリエイター限定の招待制マッチングプラットフォーム。AIによるVIBE解析で、ブランドに最適なクリエイターを自動選定します。",
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'INSIDERS',
  },
};

export const viewport: Viewport = {
  themeColor: '#0f172a', // Dark Slate
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false, // ズーム禁止（ネイティブアプリ感）
  viewportFit: 'cover', // ノッチ領域まで背景を広げる
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": "INSIDERS.",
    "url": "https://insiders-hub.jp",
    "description": "インバウンド集客に特化した、S/Aランククリエイター限定の招待制マッチングプラットフォーム。AIによるVIBE解析で、ブランドに最適なクリエイターを自動選定します。",
    "applicationCategory": "BusinessApplication",
    "operatingSystem": "All",
    "author": {
      "@type": "Organization",
      "name": "株式会社nots"
    },
    "offers": {
      "@type": "Offer",
      "price": "40000",
      "priceCurrency": "JPY",
      "description": "サブスクリプションモデル（月額 ¥40,000）"
    }
  };

  return (
    <html lang="ja" suppressHydrationWarning>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${cormorantGaramond.variable} ${playfairDisplay.variable} antialiased`}
        suppressHydrationWarning
      >
        {children}
      </body>
    </html>
  );
}
