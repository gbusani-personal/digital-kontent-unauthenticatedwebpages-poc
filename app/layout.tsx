import type { Metadata } from "next";
import { Geist, Geist_Mono, Montserrat } from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";
import KontentSmartLinkInit from "../components/KontentSmartLinkInit";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// BUPA brand font
const montserrat = Montserrat({
  variable: "--font-bupa",
  subsets: ["latin"],
  display: "swap",
});

// HCF brand font (self-hosted Whitney)
const whitney = localFont({
  variable: "--font-hcf",
  display: "swap",
  src: [
    { path: "../public/fonts/whitney/whitney-300.otf", weight: "300", style: "normal" },
    { path: "../public/fonts/whitney/whitney-300-italic.otf", weight: "300", style: "italic" },
    { path: "../public/fonts/whitney/whitney-400.otf", weight: "400", style: "normal" },
    { path: "../public/fonts/whitney/whitney-400-italic.otf", weight: "400", style: "italic" },
    { path: "../public/fonts/whitney/whitney-500.otf", weight: "500", style: "normal" },
    { path: "../public/fonts/whitney/whitney-500-italic.otf", weight: "500", style: "italic" },
    { path: "../public/fonts/whitney/whitney-600.otf", weight: "600", style: "normal" },
    { path: "../public/fonts/whitney/whitney-600-italic.otf", weight: "600", style: "italic" },
    { path: "../public/fonts/whitney/whitney-700.otf", weight: "700", style: "normal" },
    { path: "../public/fonts/whitney/whitney-700-italic.otf", weight: "700", style: "italic" },
    { path: "../public/fonts/whitney/whitney-900.otf", weight: "900", style: "normal" },
    { path: "../public/fonts/whitney/whitney-900-italic.otf", weight: "900", style: "italic" },
  ],
});

export const metadata: Metadata = {
  title: "SecureLife Insurance - Protecting What Matters Most",
  description: "Comprehensive insurance solutions for individuals and families. Get peace of mind with our reliable coverage options.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${montserrat.variable} ${whitney.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <KontentSmartLinkInit />
        {children}
      </body>
    </html>
  );
}
