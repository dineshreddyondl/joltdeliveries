import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://joltdeliveries.com"),
  title: "JOLT — India's Rail-First Express Network for 200kg+ B2B",
  description:
    "Direct, rail-led, next-day delivery for heavy shipments — with courier-grade tracking and guaranteed SLAs.",
  openGraph: {
    type: "website",
    siteName: "JOLT",
    title: "JOLT — India's Rail-First Express Network for 200kg+ B2B",
    description:
      "Direct, rail-led, next-day delivery for heavy shipments — with courier-grade tracking and guaranteed SLAs.",
    url: "/",
  },
  twitter: {
    card: "summary_large_image",
    title: "JOLT — India's Rail-First Express Network for 200kg+ B2B",
    description:
      "Direct, rail-led, next-day delivery for heavy shipments — with courier-grade tracking and guaranteed SLAs.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body
        className={`${inter.variable} ${jetbrainsMono.variable} bg-[#FBFCF8] font-sans text-[#0C0E09] antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
