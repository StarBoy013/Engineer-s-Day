import React, { useEffect, useState } from "react";
import rimtLogo from "../assets/RIMT-LOGO.jpg";

interface NavbarProps {
  onRegisterClick: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onRegisterClick }) => {
  const [activeSection, setActiveSection] = useState("hero");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const sections = ["hero", "about", "events", "agenda", "register"];
    
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 160; // Offset for header height and tolerance

      for (const sectionId of sections) {
        const el = document.getElementById(sectionId);
        if (el) {
          const top = el.getBoundingClientRect().top + window.pageYOffset;
          const height = el.offsetHeight;
          if (scrollPosition >= top && scrollPosition < top + height) {
            setActiveSection(sectionId);
            break;
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll(); // Initial check

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { label: "Hero", href: "#hero", id: "hero" },
    { label: "About", href: "#about", id: "about" },
    { label: "Events", href: "#events", id: "events" },
    { label: "Agenda", href: "#agenda", id: "agenda" },
  ];

  const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    setMobileMenuOpen(false);
    const targetId = href.replace("#", "");
    const targetEl = document.getElementById(targetId);
    if (targetEl) {
      const yOffset = -80;
      const y = targetEl.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({
        top: y,
        behavior: "smooth",
      });
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-surface/80 backdrop-blur-sm border-b border-outline/20">
      <nav className="flex justify-between items-center w-full px-margin-edge py-4 max-w-max-width mx-auto">
        {/* Brand: Mobile = logo only; Tablet/Desktop = logo + text */}
        <div className="flex items-center gap-3">
          {/* RIMT Logo - shown on all screen sizes */}
          <img
            src={rimtLogo}
            alt="RIMT University"
            className="h-9 md:h-11 w-auto object-contain flex-shrink-0"
          />
          {/* "ENGINEERS DAY" text - hidden on mobile, visible on tablet/desktop */}
          <span className="hidden md:block font-headline-md text-xl md:text-2xl font-bold tracking-tighter text-primary select-none">
            ENGINEERS DAY
          </span>
        </div>

        {/* Desktop Navigation Links */}
        <div className="hidden md:flex gap-8 items-center">
          {navLinks.map((link) => (
            <a
              key={link.id}
              href={link.href}
              onClick={(e) => handleLinkClick(e, link.href)}
              className={`nav-link-underline relative font-label-caps text-label-caps tracking-widest transition-colors duration-300 ${
                activeSection === link.id
                  ? "text-secondary font-bold"
                  : "text-on-surface-variant hover:text-primary"
              }`}
            >
              {link.label}
            </a>
          ))}
          <a
            href="#register"
            onClick={(e) => {
              handleLinkClick(e, "#register");
              onRegisterClick();
            }}
            className="bg-primary text-on-primary px-6 py-2 font-label-caps text-label-caps tracking-widest hover:bg-secondary hover:text-on-secondary transition-all duration-300 active:scale-95 border border-primary hover:border-secondary"
          >
            REGISTER NOW
          </a>
        </div>

        {/* Mobile Navigation Toggle */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden flex items-center text-primary focus:outline-none"
          aria-label="Toggle navigation menu"
        >
          <span className="material-symbols-outlined text-2xl">
            {mobileMenuOpen ? "close" : "menu"}
          </span>
        </button>
      </nav>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-surface border-b border-outline/20 px-6 py-4 space-y-4 animate-fade-in">
          {navLinks.map((link) => (
            <a
              key={link.id}
              href={link.href}
              onClick={(e) => handleLinkClick(e, link.href)}
              className={`block font-label-caps text-label-caps tracking-widest py-2 transition-colors ${
                activeSection === link.id ? "text-secondary font-bold" : "text-on-surface-variant"
              }`}
            >
              {link.label}
            </a>
          ))}
          <a
            href="#register"
            onClick={(e) => {
              handleLinkClick(e, "#register");
              onRegisterClick();
            }}
            className="block text-center bg-primary text-on-primary px-6 py-3 font-label-caps text-label-caps tracking-widest hover:bg-secondary transition-all active:scale-95"
          >
            REGISTER NOW
          </a>
        </div>
      )}
    </header>
  );
};
