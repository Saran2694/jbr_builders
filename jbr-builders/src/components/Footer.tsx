import React from 'react';
import { ArrowUp, Phone, Mail, Clock, MapPin } from 'lucide-react';
import { COMPANY_INFO } from '../data/company';
import { PROPOSED_SERVICES } from '../data/services';
import { useCMS } from '../context/CMSContext';
import { Link } from 'react-router-dom';
import { WhatsAppIcon } from './WhatsAppIcon';
import footerLogo from '../../img/galley/footerlogo.png';

interface FooterProps {
  onOpenQuote?: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenQuote: _onOpenQuote }) => {
  const { company } = useCMS();
  const currentCompany = company || COMPANY_INFO;

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'About Us', path: '/about' },
    { name: 'Services', path: '/services' },
    { name: 'Projects', path: '/projects' },
    { name: 'Gallery', path: '/gallery' },
    { name: 'Careers', path: '/careers' },
    { name: 'Contact', path: '/contact' },
  ];

  return (
    <footer
      className="relative bg-[#07172A] text-white pt-20 pb-10 overflow-hidden border-t border-white/10"
      aria-label="Site Footer"
    >
      {/* Ambient background glows */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-[#2468A6]/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-0 right-10 w-96 h-96 bg-[#123B68]/15 rounded-full blur-[120px] pointer-events-none" />

      <div className="container-custom relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-12 pb-14 border-b border-white/10">
          {/* Col 1: Brand & Identity (4 cols) */}
          <div className="lg:col-span-4 space-y-5">
            <Link
              to="/"
              className="inline-block focus:outline-none group -ml-2"
              aria-label="JBR Builders - Home"
            >
              <img
                src={footerLogo}
                alt="JBR Builders Official Logo"
                className="h-20 sm:h-24 md:h-28 w-auto object-contain transform transition-transform duration-300 group-hover:scale-104"
              />
            </Link>

            <div className="inline-flex items-center px-3.5 py-1 rounded-full bg-white/5 border border-white/10 text-cyan-300 text-xs font-extrabold uppercase tracking-widest">
              <span>LISTEN BETTER • PLAN BETTER • BUILD BETTER</span>
            </div>

            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-sm font-normal">
              JBR Builders delivers turnkey residential architecture, commercial civil construction, and structural engineering throughout Tuticorin, Tirunelveli, and southern Tamil Nadu.
            </p>

            <div className="pt-2">
              <a
                href={`https://wa.me/${currentCompany.whatsappNumber}?text=${encodeURIComponent(
                  'Hello JBR Builders, I would like to inquire about a construction consultation.'
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-gradient-to-r from-[#123B68] to-[#2468A6] hover:from-[#0E2E52] hover:to-[#1E588D] text-white text-xs font-bold shadow-md hover:scale-102 transition-all duration-200"
              >
                <WhatsAppIcon className="w-4 h-4 text-white" />
                <span>Chat on WhatsApp</span>
              </a>
            </div>
          </div>

          {/* Col 2: Quick Navigation Links (2 cols) */}
          <div className="lg:col-span-2 space-y-4">
            <h4 className="text-sm font-extrabold text-white uppercase tracking-wider border-b border-white/10 pb-2.5">
              Navigation
            </h4>
            <ul className="space-y-2 text-xs sm:text-sm">
              {navLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.path}
                    className="text-slate-300 hover:text-white hover:translate-x-1 transition-all inline-flex items-center gap-2"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-[#2468A6]" />
                    <span>{link.name}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 3: Core Construction Services (3 cols) */}
          <div className="lg:col-span-3 space-y-4">
            <h4 className="text-sm font-extrabold text-white uppercase tracking-wider border-b border-white/10 pb-2.5">
              Core Services
            </h4>
            <ul className="space-y-2 text-xs sm:text-sm">
              {PROPOSED_SERVICES.map((service) => (
                <li key={service.id}>
                  <Link
                    to="/services"
                    className="text-slate-300 hover:text-cyan-200 transition-colors inline-block"
                  >
                    {service.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 4: Offices & Contact Details (3 cols) */}
          <div className="lg:col-span-3 space-y-4">
            <h4 className="text-sm font-extrabold text-white uppercase tracking-wider border-b border-white/10 pb-2.5">
              Offices & Contact
            </h4>

            <div className="space-y-3.5 text-xs text-slate-300">
              {/* Phone & Direct Desk */}
              <div className="flex items-start gap-2.5">
                <Phone className="w-4 h-4 text-cyan-300 shrink-0 mt-0.5" />
                <div>
                  <a
                    href={`tel:${currentCompany.phoneRaw}`}
                    className="text-sm font-extrabold text-white hover:text-cyan-300 transition-colors block"
                  >
                    {currentCompany.phone}
                  </a>
                  <p className="text-[11px] text-slate-400">Direct Consultation Line</p>
                </div>
              </div>

              {/* Official Email */}
              <div className="flex items-start gap-2.5">
                <Mail className="w-4 h-4 text-cyan-300 shrink-0 mt-0.5" />
                <div>
                  <a
                    href={`mailto:${currentCompany.email}`}
                    className="text-xs font-semibold text-white hover:text-cyan-300 transition-colors block"
                  >
                    {currentCompany.email}
                  </a>
                  <p className="text-[11px] text-slate-400">Official Correspondence</p>
                </div>
              </div>

              {/* Working Hours */}
              <div className="flex items-start gap-2.5">
                <Clock className="w-4 h-4 text-cyan-300 shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs font-semibold text-white">Monday – Saturday: 9:00 AM – 7:00 PM</p>
                  <p className="text-[11px] text-slate-400">Sunday: By Prior Appointment</p>
                </div>
              </div>

              {/* Physical Addresses */}
              <div className="pt-2 border-t border-white/10 space-y-2 text-[11px] text-slate-300">
                <div className="flex items-start gap-2">
                  <MapPin className="w-3.5 h-3.5 text-cyan-300 shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-white">Head Office:</strong> 4/89/9, Palai Main Road, Pudukottai, Tuticorin, Tamil Nadu – 628103
                  </div>
                </div>

                <div className="flex items-start gap-2">
                  <MapPin className="w-3.5 h-3.5 text-cyan-300 shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-white">Branch Office:</strong> 7/9, Pearl Avenue, K.T.C. Nagar, Tirunelveli, Tamil Nadu – 627011
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar: Copyright 2026 */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-x-2 gap-y-1 text-center sm:text-left">
            <p>© 2026 JBR Builders. All rights reserved. Registered Civil Construction Firm.</p>
            <span className="hidden sm:inline text-slate-600">•</span>
            <p className="text-slate-400">
              Crafted by <span className="font-semibold text-slate-200">znsrix</span>
            </p>
          </div>

          <button
            type="button"
            onClick={scrollToTop}
            aria-label="Scroll back to top"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-white transition-all text-xs font-semibold cursor-pointer"
          >
            <span>Back to top</span>
            <ArrowUp className="w-3.5 h-3.5 text-cyan-300" />
          </button>
        </div>
      </div>
    </footer>
  );
};
