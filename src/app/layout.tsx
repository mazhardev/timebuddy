import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import "./globals.css";

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
  display: 'swap',
});

export const metadata: Metadata = {
  title: "TimeBuddy - World Clock & Meeting Planner",
  description: "A premium, free world clock, time zone converter, and meeting planner. Visualize time differences and plan global meetings effortlessly.",
  keywords: ["world clock", "time zone converter", "meeting planner", "time buddy", "global time"],
  authors: [{ name: "TimeBuddy Team" }],
  openGraph: {
    title: "TimeBuddy - Master Global Time",
    description: "Visualize time differences and plan global meetings effortlessly.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: 'TimeBuddy',
    applicationCategory: 'UtilityApplication',
    operatingSystem: 'Any',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
    },
    description: 'A premium, free world clock, time zone converter, and meeting planner.',
  };

  return (
    <html lang="en">
      <body className={`${outfit.variable} font-sans antialiased bg-slate-950 text-slate-50 selection:bg-indigo-500/30 selection:text-indigo-200`}>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        {children}
      </body>
    </html>
  );
}
