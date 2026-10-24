import React, { useState, useEffect } from 'react';
import { Phone, Mail, Menu, X } from 'lucide-react';
import { COMPANY_INFO } from '../data/company';
import { useCMS } from '../context/CMSContext';
import { Link, useLocation } from 'react-router-dom';

interface NavbarProps {
  onOpenQuote: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenQuote }) => {
  const { company } = useCMS();
  const currentCompany = company || COMPANY_INFO;
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 25);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'About Us', path: '/about' },
    { name: 'Services', path: '/services' },
    { name: 'Projects', path: '/projects' },
    { name: 'Gallery', path: '/gallery' },
    { name: 'Careers', path: '/careers' },
    { name: 'Contact', path: '/contact' },
  ];

  const handleLinkClick = () => {
    setMobileMenuOpen(false);
  };

  return (
    <header className="fixed top-3 sm:top-5 left-0 right-0 z-50 flex justify-center px-3 sm:px-6 pointer-events-none transition-all duration-300">
      <nav
        className={`pointer-events-auto w-full max-w-6xl transition-all duration-300 ${
          isScrolled
            ? 'bg-gradient-to-r from-[#1a4f8a]/20 via-[#2468A6]/15 to-[#38BDF8]/10 backdrop-blur-2xl shadow-[0_16px_45px_-10px_rgba(18,59,104,0.22),inset_0_1px_1px_rgba(255,255,255,0.6)] py-2 sm:py-2.5 px-4 sm:px-6 rounded-2xl sm:rounded-full border border-[#2468A6]/30'
            : 'bg-gradient-to-r from-[#2468A6]/12 via-[#123B68]/08 to-[#38BDF8]/08 backdrop-blur-xl shadow-[0_10px_35px_-5px_rgba(18,59,104,0.14),inset_0_1px_1px_rgba(255,255,255,0.55)] py-3 px-4 sm:px-7 rounded-2xl sm:rounded-full border border-[#2468A6]/22'
        }`}
      >
        <div className="flex items-center justify-between">
          {/* Logo on the Left */}
          <Link
            to="/"
            className="flex items-center gap-2.5 focus:outline-none group"
            aria-label="JBR Builders - Home"
          >
            <div className="p-1 rounded-xl bg-white/80 backdrop-blur-sm border border-slate-200/60 shadow-2xs group-hover:border-[#2468A6]/40 transition-colors">
              <img
                src={currentCompany.logoUrl}
                alt="JBR Builders Official Logo"
                className="h-8 sm:h-10 md:h-11 w-auto object-contain transition-transform duration-300 group-hover:scale-104"
              />
            </div>
            <div className="hidden sm:block">
              <span className="block text-sm font-extrabold tracking-tight text-[#123B68]">
                JBR BUILDERS
              </span>
              <span className="block text-[10px] font-semibold tracking-wider text-[#64748B] uppercase">
                Tuticorin • Tirunelveli
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <div className="hidden lg:flex items-center gap-1.5 p-1 rounded-full bg-[#2468A6]/10 backdrop-blur-md border border-[#2468A6]/20">
            {navLinks.map((link) => {
              const isActive = location.pathname === link.path;
              return (
                <Link
                  key={link.name}
                  to={link.path}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all duration-200 ${
                    isActive
                      ? 'bg-gradient-to-r from-[#123B68] to-[#2468A6] text-white shadow-xs'
                      : 'text-[#1E293B] hover:text-[#123B68] hover:bg-white'
                  }`}
                >
                  {link.name}
                </Link>
              );
            })}
          </div>

          {/* Action Button & Hamburger Toggle */}
          <div className="flex items-center gap-2.5">
            <button
              onClick={onOpenQuote}
              className="hidden sm:inline-flex items-center justify-center px-5 py-2 rounded-full text-xs font-bold bg-gradient-to-r from-[#123B68] to-[#2468A6] hover:from-[#0E2E52] hover:to-[#1E588D] text-white shadow-[0_6px_20px_rgba(36,104,166,0.35),inset_0_1px_1px_rgba(255,255,255,0.3)] hover:shadow-[0_8px_25px_rgba(36,104,166,0.5)] hover:scale-102 transition-all duration-200 focus:outline-none cursor-pointer"
            >
              <span>Get a Consultation</span>
            </button>

            {/* Mobile Hamburger Button */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label={mobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
              aria-expanded={mobileMenuOpen}
              className="lg:hidden p-2 rounded-xl text-[#123B68] bg-white/70 hover:bg-white border border-slate-200/60 shadow-2xs transition-colors focus:outline-none"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Menu with Frosted Glass Card */}
        {mobileMenuOpen && (
          <div className="lg:hidden mt-3 pt-3 border-t border-slate-200/60 space-y-2 animate-in fade-in slide-in-from-top-3 duration-200">
            <div className="flex flex-col space-y-1">
              {navLinks.map((link) => {
                const isActive = location.pathname === link.path;
                return (
                  <Link
                    key={link.name}
                    to={link.path}
                    onClick={handleLinkClick}
                    className={`px-3 py-2 rounded-xl text-sm font-semibold transition-colors ${
                      isActive
                        ? 'bg-gradient-to-r from-[#123B68] to-[#2468A6] text-white'
                        : 'text-[#1E293B] hover:bg-white hover:text-[#2468A6]'
                    }`}
                  >
                    {link.name}
                  </Link>
                );
              })}
            </div>

            <div className="pt-3 border-t border-slate-200/60 flex flex-col gap-2.5">
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenQuote();
                }}
                className="w-full py-2.5 rounded-xl text-center font-bold text-xs bg-gradient-to-r from-[#123B68] to-[#2468A6] text-white shadow-md hover:opacity-95 transition-all cursor-pointer"
              >
                Get a Consultation
              </button>

              <div className="pt-1 text-xs text-slate-600 flex items-center justify-between px-1">
                <a
                  href={`tel:${currentCompany.phoneRaw}`}
                  className="flex items-center gap-1.5 font-medium text-[#123B68]"
                >
                  <Phone className="w-3.5 h-3.5 text-[#2468A6]" />
                  <span>{currentCompany.phone}</span>
                </a>
                <a
                  href={`mailto:${currentCompany.email}`}
                  className="flex items-center gap-1.5 font-medium text-[#123B68]"
                >
                  <Mail className="w-3.5 h-3.5 text-[#2468A6]" />
                  <span>Email</span>
                </a>
              </div>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
};
