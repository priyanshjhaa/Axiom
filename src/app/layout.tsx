import type { Metadata, Viewport } from "next";
import { Outfit, Playfair_Display, Dancing_Script, Great_Vibes, Herr_Von_Muellerhoff } from "next/font/google";
import "./globals.css";
import SessionProvider from "@/components/SessionProvider";
import QueryProvider from "@/providers/QueryProvider";

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
});

// Signature fonts
const dancingScript = Dancing_Script({
  variable: "--font-dancing-script",
  subsets: ["latin"],
  weight: ["400", "700"],
});

const greatVibes = Great_Vibes({
  variable: "--font-great-vibes",
  subsets: ["latin"],
  weight: ["400"],
});

const herrVonMuellerhoff = Herr_Von_Muellerhoff({
  variable: "--font-herr-von-muellerhoff",
  subsets: ["latin"],
  weight: ["400"],
});

export const metadata: Metadata = {
  title: "AXIOM - Transform Job Descriptions Into Professional Documents",
  description: "Describe your project in simple terms and generate professional proposals and invoices with payment links in seconds.",
  icons: {
    icon: [
      { url: "/favicon.svg", type: "image/svg+xml" },
    ],
    shortcut: "/favicon.svg",
    apple: "/favicon.svg",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${outfit.variable} ${playfair.variable} ${dancingScript.variable} ${greatVibes.variable} ${herrVonMuellerhoff.variable} antialiased`}
      >
        <SessionProvider>
          <QueryProvider>
            {children}
          </QueryProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
