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
  title: "Electra 2026 - AI Election Co-Pilot",
  description:
    "Offline-first election readiness app featuring a Socratic Myth Buster, EVM simulator, confidence journey, and Election Passport.",
  manifest: "/manifest.webmanifest",
  applicationName: "Electra 2026",
  icons: {
    icon: "/pwa/icon-192.svg",
    apple: "/pwa/icon-192.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body className={`${inter.variable} antialiased`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
