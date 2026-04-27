import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Providers } from "@/components/providers";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "VoteReady — AI Election Co-Pilot",
  description:
    "Your personal AI election guide that remembers you, tracks your journey, and gets smarter the longer you use it. Built for India's 2026 state elections.",
  manifest: "/manifest.webmanifest",
  applicationName: "VoteReady",
  icons: {
    icon: "/pwa/icon-192.svg",
    apple: "/pwa/icon-192.svg",
  },
  openGraph: {
    title: "VoteReady — AI Election Co-Pilot",
    description: "Your personal AI election guide for India's 2026 state elections.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} antialiased`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
