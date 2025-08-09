// components/Navbar.tsx
'use client'; 

import Link from 'next/link';
import { useState, useEffect } from 'react';

export default function Navbar() {
  // State to manage if the mobile menu is open or closed
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Function to close the menu
  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  // Function to toggle the menu
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  // Effect for handling the scroll animation
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
      {/* When logo is clicked, it closes the menu */}
      <Link href="/" className="logo" onClick={closeMenu}>
        Sadhu <span>J</span>
      </Link>
      
      {/* The 'active' class is now controlled by our state */}
      <div className={`nav-links ${isMenuOpen ? 'active' : ''}`}>
        {/* Each link will close the menu when clicked */}
        <a href="/#about" onClick={closeMenu}>About</a>
        <a href="/#education" onClick={closeMenu}>Education</a>
        <a href="/#experience" onClick={closeMenu}>Experience</a>
        <a href="/#skills" onClick={closeMenu}>Skills</a>
        <a href="/#tools" onClick={closeMenu}>Tools</a>
        <a href="/#projects" onClick={closeMenu}>Projects</a>
        <a href="/#achievements-preview" onClick={closeMenu}>Achievements</a>
        <a href="/#certifications" onClick={closeMenu}>Certifications</a>
        <a href="/#contact" onClick={closeMenu}>Contact</a>
      </div>
      
      {/* The toggle button now uses the toggleMenu function */}
      <div className="menu-toggle" onClick={toggleMenu}>
        ☰
      </div>
    </nav>
  );
}