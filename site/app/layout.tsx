import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import "./globals.css";

const display = localFont({
  src: [
    { path: "./fonts/MilligramMacro-Medium.woff2", weight: "500" },
    { path: "./fonts/MilligramMacro-Extrabold.woff2", weight: "800" },
  ],
  variable: "--font-display",
  display: "swap",
});
const body = localFont({ src: "./fonts/Sh-Ad-Grotesk-Regular.woff2", variable: "--font-body", display: "swap" });
const brand = localFont({ src: "./fonts/Quicksand-Bold-nota.woff2", weight: "700", variable: "--font-brand", display: "swap" });

export const metadata: Metadata = {
  title: { default: "Espace Nota", template: "%s · Nota" },
  description: "Ton espace d'accompagnement Nota.",
  robots: { index: false, follow: false },
};

export const viewport: Viewport = {
  themeColor: "#f4f4f0",
  colorScheme: "light",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" className={`${display.variable} ${body.variable} ${brand.variable}`}>
      <body>{children}</body>
    </html>
  );
}
