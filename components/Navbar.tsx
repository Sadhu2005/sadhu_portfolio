// components/Navbar.tsx
'use client'; 

import Link from 'next/link';
import { useState, useEffect } from 'react';

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  useEffect(() => {
    const handleScroll = () => {
      const navbar = document.querySelector('.navbar');
      if (window.scrollY > 50) {
        navbar?.classList.add('scrolled');
      } else {
        navbar?.classList.remove('scrolled');
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <nav className="navbar">
      <Link href="/" className="logo" onClick={closeMenu}>
        Sadhu <span>J</span>
      </Link>
      
      <div className={`nav-links ${isMenuOpen ? 'active' : ''}`}>
        {/* All links are now <Link> components to pass the build checks */}
        <Link href="/#about" onClick={closeMenu}>About</Link>
        <Link href="/#education" onClick={closeMenu}>Education</Link>
        <Link href="/#experience" onClick={closeMenu}>Experience</Link>
        <Link href="/#skills" onClick={closeMenu}>Skills</Link>
        <Link href="/#tools" onClick={closeMenu}>Tools</Link>
        <Link href="/#projects" onClick={closeMenu}>Projects</Link>
        <Link href="/#achievements-preview" onClick={closeMenu}>Achievements</Link>
        <Link href="/#certifications" onClick={closeMenu}>Certifications</Link>
        <Link href="/#contact" onClick={closeMenu}>Contact</Link>
      </div>
      
      <div className="menu-toggle" onClick={toggleMenu}>
        ☰
      </div>
    </nav>
  );
}