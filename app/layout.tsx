import type { Metadata } from "next";
import { Fraunces, Inter } from "next/font/google";
import "./globals.css";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import SiteProvider from "@/components/SiteProvider";
import { getSite } from "@/lib/api";

const inter = Inter({ subsets: ["latin"], variable: "--font-ui" });
const fraunces = Fraunces({ subsets: ["latin"], variable: "--font-display" });

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  try {
    const site = await getSite();
    return {
      title: site.title,
      description: site.description,
      icons: { icon: [{ url: "/favicon.png" }] },
    };
  } catch {
    return {
      title: "Sadhu J - AI & ML Engineer",
      description: "ML fullstack portfolio of Sadhu J.",
      icons: { icon: [{ url: "/favicon.png" }] },
    };
  }
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${inter.variable} ${fraunces.variable}`}>
      <body className={inter.className}>
        <SiteProvider>
          <a className="skip" href="#content">
            Skip to content
          </a>
          <Navbar />
          <div id="content">{children}</div>
          <Footer />
        </SiteProvider>
      </body>
    </html>
  );
}
