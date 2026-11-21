import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono, Source_Serif_4 } from "next/font/google";
import "./globals.css";
import { AutoUpdate } from "@/components/shell/AutoUpdate";

// The family's faces: Geist for the interface, Geist Mono for code, Source Serif for reading.
const sans = Geist({ subsets: ["latin"], variable: "--font-geist", display: "swap" });
const mono = Geist_Mono({ subsets: ["latin"], variable: "--font-geist-mono", display: "swap" });
const serif = Source_Serif_4({ subsets: ["latin"], variable: "--font-serif-body", display: "swap" });

export const metadata: Metadata = {
  title: { default: "Frame", template: "%s · Frame" },
  description: "A personal university for game development.",
  applicationName: "Frame",
  appleWebApp: { capable: true, title: "Frame", statusBarStyle: "black" },
  robots: { index: false, follow: false },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#0d0d0d" },
  ],
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en-IN" className={`${sans.variable} ${mono.variable} ${serif.variable}`}>
      <body>
        <a href="#main" className="skip-link">
          Skip to content
        </a>
        {children}
        <AutoUpdate />
      </body>
    </html>
  );
}
