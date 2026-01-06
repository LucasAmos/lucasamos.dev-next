import React from "react";
import Sidebar from "../components/sidebar";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { VisualEditing } from "next-sanity/visual-editing";
import { draftMode } from "next/headers";
import { DisableDraftMode } from "../components/DisableDraftMode";
import "../styles/global.css";
import Navbar from "../components/Navbar";
import { Inter } from "next/font/google";

const inter = Inter({
  subsets: ["latin"],
  // Define a CSS variable name for Tailwind
  variable: "--font-inter",
  // Use 'swap' for a quick fallback, though next/font minimizes shift
  display: "swap",
  weight: ["600"],
});

// The following import prevents a Font Awesome icon server-side rendering bug,
// where the icons flash from a very large icon down to a properly sized one:
import "@fortawesome/fontawesome-svg-core/styles.css";
// Prevent fontawesome from adding its CSS since we did it manually above:
import { config } from "@fortawesome/fontawesome-svg-core";
import { Metadata } from "next";
config.autoAddCss = false;

export const metadata: Metadata = {
  openGraph: {
    title: "Lucas Amos - AWS application architect",
    description: "Lucas Amos",
    authors: ["Lucas Amos"],
    images: ["https://www.lucasamos.dev/images/lucas.JPG"],
  },
};

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}): Promise<JSX.Element> {
  return (
    <html lang="en" className={inter.variable}>
      <body>
        <Navbar />
        <div className="m-auto max-w-[1380px]">
          <div className="mt-5 max-w-[1500px] gap-4 p-5 sm:mt-0 sm:grid-cols-1 lg:ml-20  lg:grid lg:grid-cols-5 lg:pt-10">
            <Sidebar />
            <div className="mt-14 lg:col-span-3 lg:mt-0">{children}</div>
            <SpeedInsights />
          </div>
        </div>
        {(await draftMode()).isEnabled && (
          <>
            <VisualEditing />
            <DisableDraftMode />
          </>
        )}
      </body>
    </html>
  );
}

Layout.displayName = "Layout";
