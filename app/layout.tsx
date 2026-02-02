import type { Metadata } from "next";
import "./globals.css";
import { sanityFetch, SanityLive } from "@/sanity/lib/live";
import { draftMode } from "next/headers";
import { VisualEditing } from "next-sanity/visual-editing";
import { DisableDraftMode } from "@/components/DisableDraftMode";

import { Geist, Geist_Mono, Syne, DM_Sans, JetBrains_Mono } from "next/font/google";
import { defineQuery } from "next-sanity";
import { NAVIGATION } from "@/sanity/lib/client";
import Header from "@/components/navigations/Header";
import Footer from "@/components/navigations/Footer";
import Logo from "@/public/logo.png"

const syne = Syne({
  subsets: ["latin"],
  weight: ["400", "600", "700", "800"],
  variable: "--font-syne",
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  variable: "--font-dm-sans",
});

const jetBrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "600"],
  variable: "--font-jb-mono",
});

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "PeakPulse",
  icons: {
      icon: `${Logo}`,
      shortcut: `${Logo}`,
	},
  description: "PeakPulse Agency is a performance-driven digital solutions firm based in Puerto Princesa, Mimaropa, Philippines. We deliver expert web development, professional video production, strategic digital marketing, and comprehensive automation solutions to small and large businesses.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { isEnabled } = await draftMode();
    const navigationquery = defineQuery(NAVIGATION);
    // const settingsquery = defineQuery(SETTINGS);
    // const page_bg_query = defineQuery(GET_ALL_PAGE_BG_POSITION);
  
  
    const [navigation] = await Promise.all([
      sanityFetch({ query: navigationquery }).then((res) => res.data),
      // sanityFetch({ query: settingsquery }).then((res) => res.data),
      // sanityFetch({ query: page_bg_query }).then((res) => res.data),
    ]);
  return (
    <html lang="en">
      <body
        className={`
          ${geistSans.variable}
          ${geistMono.variable}
          ${syne.variable}
          ${dmSans.variable}
          ${jetBrainsMono.variable}
          antialiased
        `}
      >
        <Header navigation={navigation} />
        {children}
        {isEnabled && (
          <>
            <SanityLive />
            <DisableDraftMode />
          </>
        )}
        <Footer />
      </body>
    </html>
  );
}
