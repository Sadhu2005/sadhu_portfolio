// app/layout.tsx
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import MouseTrail from "@/components/MouseTrail"; // <-- IMPORT IT

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Sadhu J - AI & ML Engineer",
  description: "AI & ML Engineering student and Android developer intern building cloud-powered applications with computer vision, NLP, and CI/CD, open to global opportunities.",
  icons: {
    icon: [
      // User-provided photo (with space in filename)
      { url: "/Sadhu J.png" },
      // Place your photo at public/profile-favicon.png (preferred)
      { url: "/profile-favicon.png" },
      // Fallbacks
      { url: "/favicon.png" },
      { url: "/favicon.ico" },
    ],
    apple: [
      // Optional iOS home screen icon; place at public/apple-touch-icon.png
      { url: "/apple-touch-icon.png" },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" style={{scrollPaddingTop: '80px'}}>
      <head>
        <link rel="search" type="application/opensearchdescription+xml" title="SadhujDev Search" href="/opensearch.xml" />
      </head>
      <body className={inter.className}>
        <MouseTrail /> {/* <-- ADD IT HERE */}
        <Navbar />
        {children}
        <footer>
          <p>GitHub: <a href="https://github.com/Sadhu2005" target="_blank" rel="noopener noreferrer">Sadhu2005</a></p>
          <p>© 2025 Sadhu J. All rights reserved.</p>
        </footer>
      </body>
    </html>
  );
}