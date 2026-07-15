import type { Metadata } from "next";
import { Plus_Jakarta_Sans, Sora } from "next/font/google";
import "./globals.css";
import { CookieConsent } from "@/components/cookie-consent";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { siteConfig } from "@/lib/site";

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-plus-jakarta",
});

const sora = Sora({
  subsets: ["latin"],
  variable: "--font-sora",
});

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: "Super Entrenador | Marketplace de entrenadores personales",
    template: "%s | Super Entrenador",
  },
  description: siteConfig.description,
  applicationName: siteConfig.name,
  icons: {
    icon: [
      { url: "/favicon-32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon-64.png", sizes: "64x64", type: "image/png" },
      { url: "/logo.png", sizes: "512x512", type: "image/png" },
    ],
    apple: "/logo.png",
  },
  openGraph: {
    type: "website",
    title: "Super Entrenador",
    description: siteConfig.description,
    url: siteConfig.url,
    siteName: siteConfig.name,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="es"
      className={`${plusJakartaSans.variable} ${sora.variable} h-full antialiased`}
    >
      <body className="min-h-full bg-[var(--bg)] text-[var(--text)]">
        <div className="app-shell flex min-h-screen flex-col">
          <SiteHeader />
          {children}
          <SiteFooter />
          <CookieConsent />
        </div>
      </body>
    </html>
  );
}
