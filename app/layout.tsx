import type { Metadata } from "next";
import { Inter, Outfit } from "next/font/google";
import Script from "next/script";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "AZZRO | Premium Fashion Store",
  description: "India's Trendiest Fashion Marketplace",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${inter.variable} ${outfit.variable} antialiased bg-white text-gray-900`}
      >
        {children}

        {/* ✅ Load Voice Assistant Script */}
        <Script src="/voice.js" strategy="afterInteractive" />
      </body>
    </html>
  );
}
