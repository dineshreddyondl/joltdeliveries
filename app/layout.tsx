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
  title: "JOLT — India's Express Layer for Heavy Commerce",
  description:
    "Direct, rail-led, next-day delivery for heavy shipments — with courier-grade tracking and guaranteed SLAs.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body
        className={`${inter.variable} ${jetbrainsMono.variable} bg-black font-sans text-white antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
