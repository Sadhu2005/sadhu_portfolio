// components/Navbar.tsx
'use client'; 

import Link from 'next/link';
import { useEffect } from 'react';

export default function Navbar() {
  // ... (the useEffect hook with all the logic remains the same) ...
  useEffect(() => {
    // Mobile menu toggle logic
    const menuToggle = document.querySelector('.menu-toggle');
    const navLinks = document.querySelector('.nav-links');
    const handleMenuClick = () => {
      navLinks?.classList.toggle('active');
    };
    if (menuToggle) {
      menuToggle.addEventListener('click', handleMenuClick);
    }

    // Scroll animation logic
    const handleScroll = () => {
      const navbar = document.querySelector('.navbar');
      if (window.scrollY > 50) {
        navbar?.classList.add('scrolled');
      } else {
        navbar?.classList.remove('scrolled');
      }
    };
    window.addEventListener('scroll', handleScroll);

    // Cleanup function to remove event listeners
    return () => {
      if (menuToggle) {
        menuToggle.removeEventListener('click', handleMenuClick);
      }
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);


  return (
    <nav className="navbar">
      <Link href="/" className="logo">Sadhu <span>J</span></Link>
      <div className="nav-links">
        <a href="/#about">About</a>
        <a href="/#education">Education</a>
        <a href="/#experience">Experience</a>
        <a href="/#skills">Skills</a>
        <a href="/#tools">Tools</a>
        <a href="/#projects">Projects</a>
        <Link href="/achievements">Achievements</Link>
        <Link href="/certifications">Certifications</Link> {/* <-- UPDATED LINK */}
        <a href="/#contact">Contact</a>
      </div>
      <div className="menu-toggle">☰</div>
    </nav>
  );
}