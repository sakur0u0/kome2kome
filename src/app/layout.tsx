import type { Metadata, Viewport } from "next";
import { AppProviders } from "@/components/providers/AppProviders";
import { DEFAULT_LOCALE, LOCALE_META, dictionaries } from "@/lib/i18n";
import { siteConfig } from "@/lib/site.config";
import { fontVariables } from "./fonts";
import "./globals.css";

const t = dictionaries[DEFAULT_LOCALE];

export const metadata: Metadata = {
  title: t.meta.title,
  description: t.meta.description,
  applicationName: siteConfig.brand.fullNameJa,
  keywords: [
    "米と米",
    "祇園",
    "京都",
    "米粉クレープ",
    "お米モンブラン",
    "米スイーツ",
    "八坂神社",
    "食べ歩き",
    "KOME TO KOME",
    "Gion",
    "Kyoto",
    "rice flour crepe",
    "rice mont blanc",
    "祇园",
    "米粉可丽饼",
  ],
  openGraph: {
    type: "website",
    title: t.meta.title,
    description: t.meta.description,
    siteName: siteConfig.brand.fullNameJa,
    locale: "ja_JP",
    alternateLocale: ["en_US", "zh_CN"],
    images: [{ url: siteConfig.images.hero.src, width: 2000, height: 1333, alt: t.a11y.heroImage }],
  },
  twitter: {
    card: "summary_large_image",
    title: t.meta.title,
    description: t.meta.description,
    images: [siteConfig.images.hero.src],
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#0a0a0a",
  colorScheme: "dark",
};

/** 構造化データ（飲食店） */
const jsonLd = {
  "@context": "https://schema.org",
  "@type": "FoodEstablishment",
  name: siteConfig.brand.fullNameJa,
  alternateName: siteConfig.brand.name,
  description: t.meta.description,
  servesCuisine: ["Dessert", "Japanese"],
  address: {
    "@type": "PostalAddress",
    streetAddress: "祇園町南側524-2 祇園和喜ビル 2F",
    addressLocality: "京都市東山区",
    addressRegion: "京都府",
    addressCountry: "JP",
  },
  openingHours: "Mo-Su 10:00-20:00",
  acceptsReservations: "False",
  paymentAccepted: "Credit Card, Electronic Money, QR Code Payment",
  sameAs: [siteConfig.links.instagram, siteConfig.links.tabelog],
  hasMap: siteConfig.links.map,
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang={LOCALE_META[DEFAULT_LOCALE].htmlLang}
      data-lang={DEFAULT_LOCALE}
      data-scroll-behavior="smooth"
      className={`${fontVariables} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="flex min-h-full flex-col bg-base text-ivory">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  );
}
