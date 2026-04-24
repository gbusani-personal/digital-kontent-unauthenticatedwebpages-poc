import type { Metadata } from "next";
import { Geist, Geist_Mono, Montserrat } from "next/font/google";
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

// HCF brand font (Whitney is not on Google Fonts — load via next/font/local instead).
// Place Whitney font files in public/fonts/whitney/ and uncomment the block below.
//
// import localFont from "next/font/local";
// const whitney = localFont({
//   variable: "--font-hcf",
//   display: "swap",
//   src: [
//     { path: "../public/fonts/whitney/Whitney-Book.woff2",   weight: "400", style: "normal" },
//     { path: "../public/fonts/whitney/Whitney-Medium.woff2", weight: "500", style: "normal" },
//     { path: "../public/fonts/whitney/Whitney-SemiBold.woff2", weight: "600", style: "normal" },
//     { path: "../public/fonts/whitney/Whitney-Bold.woff2",   weight: "700", style: "normal" },
//   ],
// });

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
      className={`${geistSans.variable} ${geistMono.variable} ${montserrat.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <KontentSmartLinkInit />
        {children}
      </body>
    </html>
  );
}
