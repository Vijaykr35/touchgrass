import type { Metadata } from "next";
import { Manrope, DM_Sans, IBM_Plex_Mono } from "next/font/google";
import "./globals.css";

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
  display: "swap",
});

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
  display: "swap",
});

const ibmPlexMono = IBM_Plex_Mono({
  variable: "--font-mono",
  weight: ["400", "500", "600"],
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "TouchGrass — Ambient Field Guide & Offline Outdoor Quests",
  description: "A privacy-first, offline-ready companion designed to guide you outdoors and leave your screen behind.",
  manifest: "/manifest.json",
  themeColor: "#244B36",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${manrope.variable} ${dmSans.variable} ${ibmPlexMono.variable}`}
    >
      <body
        suppressHydrationWarning
        className="min-h-screen flex flex-col bg-[#F5F2E8] text-[#292E28] font-sans antialiased selection:bg-[#D9E66F] selection:text-[#244B36]"
      >
        {children}
      </body>
    </html>
  );
}
