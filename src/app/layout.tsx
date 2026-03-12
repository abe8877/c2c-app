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
  title: "INSIDERS - Beyond the Buzz",
  description: "Viral is cheap. Insight is priceless. Apply for the exclusive curation network.",
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
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${cormorantGaramond.variable} ${playfairDisplay.variable} antialiased`}
        suppressHydrationWarning
      >
        {children}
      </body>
    </html>
  );
}
