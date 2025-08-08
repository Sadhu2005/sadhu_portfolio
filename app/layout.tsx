import type { Metadata } from "next";
import Link from 'next/link'; // Import the Link component
import Image from 'next/image'; // Import the Image component
import { Inter } from "next/font/google";
import "./globals.css";

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
    <html lang="en">
      <body className={inter.className}>
        <nav className="navbar">
          {/* Use Link component for internal navigation */}
          <Link href="/" className="logo">Sadhu <span>J</span></Link>
          <div className="nav-links">
            <a href="#about">About</a>
            <a href="#education">Education</a>
            <a href="#experience">Experience</a>
            <a href="#skills">Skills</a>
            <a href="#tools">Tools</a>
            <a href="#projects">Projects</a>
            <a href="#certifications">Certifications</a>
            <a href="#contact">Contact</a>
          </div>
          <div className="menu-toggle">☰</div>
        </nav>

        {children}

        <footer>
          <p>GitHub: <a href="https://github.com/Sadhu2005" target="_blank" rel="noopener noreferrer">Sadhu2005</a></p>
          <p>© 2025 Sadhu J. All rights reserved.</p>
        </footer>

        {/* Certificate Lightbox Modal Structure */}
        <div id="certificate-modal" style={{ display: 'none' }}>
          <span id="certificate-modal-close">×</span>
          {/* Use Image component with placeholder dimensions */}
          <Image id="certificate-modal-img" src="" alt="Certificate" width={1200} height={800} style={{ objectFit: 'contain' }} />
          <div id="certificate-modal-desc"></div>
        </div>
      </body>
    </html>
  );
}