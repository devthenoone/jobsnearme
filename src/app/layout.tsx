import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "JobsNearMe — find local jobs fast",
    template: "%s — JobsNearMe",
  },
  description:
    "Guides to finding jobs near you — local, part-time, warehouse, and remote roles, with tips on how to apply and get hired fast.",
  openGraph: {
    type: "website",
    siteName: "JobsNearMe",
    url: siteUrl,
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen" suppressHydrationWarning>
        <Navbar />
        <main>{children}</main>
        <footer className="mx-auto max-w-5xl px-4 py-10 text-center text-xs text-gray-400">
          © {new Date().getFullYear()} JobsNearMe · Helping you find work near you.
        </footer>
      </body>
    </html>
  );
}
