// app/layout.tsx
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import MouseTrail from "@/components/MouseTrail"; // <-- IMPORT IT

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Sadhu J - AI & ML Engineer",
  description: "Dynamic and Motivated B.E Student Majoring in Artificial Intelligence and Machine Learning.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" style={{scrollPaddingTop: '80px'}}>
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