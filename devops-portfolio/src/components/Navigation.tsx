import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import './Navigation.css';

const Navigation: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { label: 'Home', href: '#home' },
    { label: 'Projects', href: '#projects' },
    { label: 'Skills', href: '#skills' },
    { label: 'Contact', href: '#contact' }
  ];

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    setIsMobileMenuOpen(false);
    
    if (href === '#home') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      const element = document.querySelector(href);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
      className={`navigation ${isScrolled ? 'scrolled' : ''}`}
    >
      <div className="nav-container">
        <a href="#home" onClick={(e) => handleNavClick(e, '#home')} className="nav-logo">
          <span className="logo-bracket">{'<'}</span>
          <span className="logo-text">JC</span>
          <span className="logo-bracket">{'/>'}</span>
        </a>

        <div className={`nav-links ${isMobileMenuOpen ? 'mobile-open' : ''}`}>
          {navItems.map((item, index) => (
            <a
              key={index}
              href={item.href}
              onClick={(e) => handleNavClick(e, item.href)}
              className="nav-link"
            >
              {item.label}
            </a>
          ))}
          <a 
            href="/justin-carter-resume.pdf" 
            className="nav-link nav-cta"
            target="_blank"
            rel="noopener noreferrer"
          >
            Resume
          </a>
        </div>

        <button
          className={`mobile-menu-btn ${isMobileMenuOpen ? 'open' : ''}`}
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-label="Toggle menu"
        >
          <span></span>
          <span></span>
          <span></span>
        </button>
      </div>
    </motion.nav>
  );
};

export default Navigation;
