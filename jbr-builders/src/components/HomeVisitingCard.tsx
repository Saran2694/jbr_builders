import React, { useState } from 'react';
import {
  Phone,
  Mail,
  Building,
  RotateCw,
  MapPin,
  ArrowRight,
  CreditCard,
} from 'lucide-react';
import { COMPANY_INFO } from '../data/company';
import { useCMS } from '../context/CMSContext';
import { WhatsAppIcon } from './WhatsAppIcon';
import visitingFront from '../../img/galley/visiting frent.png';
import visitingBack from '../../img/galley/visitingback.png';

interface HomeVisitingCardProps {
  onOpenQuote?: () => void;
}

export const HomeVisitingCard: React.FC<HomeVisitingCardProps> = ({ onOpenQuote }) => {
  const { company } = useCMS();
  const currentCompany = company || COMPANY_INFO;
  const [isCardFlipped, setIsCardFlipped] = useState(false);

  const handleWhatsAppDirect = () => {
    const text = encodeURIComponent(
      'Hello JBR Builders,\n\nI am contacting you from your website to discuss a civil construction project in Tamil Nadu.'
    );
    window.open(`https://wa.me/${currentCompany.whatsappNumber}?text=${text}`, '_blank');
  };

  return (
    <section
      id="visiting-card-desk"
      className="py-20 lg:py-28 relative overflow-hidden bg-white blueprint-grid"
      aria-label="Official Visiting Card & Client Desk"
    >
      {/* Ambient background glows */}
      <div className="absolute top-1/4 -left-40 w-96 h-96 bg-[#2468A6]/18 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-10 -right-40 w-[500px] h-[500px] bg-[#123B68]/14 rounded-full blur-[140px] pointer-events-none" />

      <div className="container-custom relative z-10">
        {/* Section Header */}
        <div className="max-w-3xl mx-auto text-center mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#EBF4FC] border border-[#2468A6]/20 text-[#123B68] text-xs font-extrabold uppercase tracking-widest mb-3">
            <CreditCard className="w-3.5 h-3.5 text-[#2468A6]" />
            <span>OFFICIAL BUSINESS CARD & CLIENT DESK</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#123B68] tracking-tight">
            Connect Directly with JBR Builders
          </h2>

          <p className="mt-4 text-base sm:text-lg text-[#64748B] max-w-2xl mx-auto leading-relaxed">
            Reach out directly for civil consultations, site appraisals, and structural engineering advice across Tuticorin, Tirunelveli, and southern Tamil Nadu.
          </p>

          <div className="w-20 h-1 bg-gradient-to-r from-[#123B68] to-[#2468A6] mx-auto mt-5 rounded-full" />
        </div>

        {/* Two-Column Grid: Left Content Channels, Right Interactive Visiting Card */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Left Column: Direct Desk Channels & Offices (7 Cols) */}
          <div className="lg:col-span-7 space-y-6">
            <div className="glass-panel rounded-3xl p-7 sm:p-9 space-y-6 border border-white/90 shadow-[0_10px_35px_rgba(18,59,104,0.06)]">
              <div className="flex items-center justify-between border-b border-slate-200/60 pb-3">
                <h3 className="text-xl font-extrabold text-[#123B68]">
                  Immediate Engineering Assistance
                </h3>
                <span className="text-xs font-bold text-[#123B68] bg-[#EBF4FC] px-3 py-1 rounded-full border border-[#2468A6]/30 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span>Desk Online</span>
                </span>
              </div>

              {/* Channels Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                {/* Phone Channel */}
                <div className="p-4 rounded-2xl bg-gradient-to-br from-[#2468A6]/10 to-[#38BDF8]/06 border border-[#2468A6]/22 flex items-start gap-3.5 backdrop-blur-sm">
                  <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-[#123B68] to-[#2468A6] text-white flex items-center justify-center shrink-0 shadow-sm mt-0.5">
                    <Phone className="w-5 h-5 text-cyan-200" />
                  </div>
                  <div>
                    <p className="text-[10px] font-extrabold text-[#64748B] uppercase tracking-wider">
                      Direct Call Desk
                    </p>
                    <a
                      href={`tel:${currentCompany.phoneRaw}`}
                      className="text-base font-extrabold text-[#123B68] hover:text-[#2468A6] transition-colors block mt-0.5"
                    >
                      {currentCompany.phone}
                    </a>
                    <p className="text-[11px] text-[#64748B] mt-0.5">Mon – Sat: 9:00 AM – 7:00 PM</p>
                  </div>
                </div>

                {/* Email Channel */}
                <div className="p-4 rounded-2xl bg-gradient-to-br from-[#2468A6]/10 to-[#38BDF8]/06 border border-[#2468A6]/22 flex items-start gap-3.5 backdrop-blur-sm">
                  <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-[#2468A6] to-[#0E2E52] text-white flex items-center justify-center shrink-0 shadow-sm mt-0.5">
                    <Mail className="w-5 h-5 text-cyan-200" />
                  </div>
                  <div>
                    <p className="text-[10px] font-extrabold text-[#64748B] uppercase tracking-wider">
                      Official Email
                    </p>
                    <a
                      href={`mailto:${currentCompany.email}`}
                      className="text-sm font-extrabold text-[#123B68] hover:text-[#2468A6] transition-colors block mt-0.5 truncate max-w-[190px]"
                    >
                      {currentCompany.email}
                    </a>
                    <p className="text-[11px] text-[#64748B] mt-0.5">24-hour response turnaround</p>
                  </div>
                </div>
              </div>

              {/* Offices Addresses */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-slate-200/60">
                <div className="space-y-1 text-xs text-[#64748B]">
                  <p className="font-extrabold text-[#123B68] flex items-center gap-1.5">
                    <Building className="w-3.5 h-3.5 text-[#2468A6]" />
                    <span>Tuticorin Head Office:</span>
                  </p>
                  <p className="text-[11px] leading-relaxed">
                    4/89/9, Palai Main Road, Pudukottai, Tuticorin – 628103
                  </p>
                </div>

                <div className="space-y-1 text-xs text-[#64748B]">
                  <p className="font-extrabold text-[#123B68] flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-[#2468A6]" />
                    <span>Tirunelveli Branch Office:</span>
                  </p>
                  <p className="text-[11px] leading-relaxed">
                    7/9, Pearl Avenue, K.T.C. Nagar, Tirunelveli – 627011
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-2 flex flex-col sm:flex-row items-center gap-3">
                <button
                  type="button"
                  onClick={handleWhatsAppDirect}
                  className="w-full sm:w-auto flex-1 py-3.5 px-6 rounded-2xl bg-gradient-to-r from-[#123B68] to-[#2468A6] hover:from-[#0E2E52] hover:to-[#1E588D] text-white font-bold text-xs sm:text-sm shadow-md hover:scale-102 transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <WhatsAppIcon className="w-4 h-4 text-white" />
                  <span>Start WhatsApp Conversation</span>
                </button>

                {onOpenQuote && (
                  <button
                    type="button"
                    onClick={onOpenQuote}
                    className="w-full sm:w-auto py-3.5 px-6 rounded-2xl bg-white hover:bg-slate-50 text-[#123B68] font-bold text-xs sm:text-sm border border-slate-200 shadow-sm transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <span>Request Consultation</span>
                    <ArrowRight className="w-4 h-4 text-[#2468A6]" />
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Right Column: 3D Flip Visiting Card (5 Cols) */}
          <div className="lg:col-span-5">
            <div className="glass-panel rounded-3xl p-6 sm:p-7 space-y-4 border border-white/90 shadow-[0_15px_40px_rgba(18,59,104,0.08)]">
              <div className="flex items-center justify-between border-b border-slate-200/60 pb-3">
                <div className="flex items-center gap-2">
                  <CreditCard className="w-5 h-5 text-[#2468A6]" />
                  <h3 className="text-base sm:text-lg font-extrabold text-[#123B68]">
                    Official Visiting Card
                  </h3>
                </div>
                <span className="text-[11px] font-bold text-[#2468A6] bg-[#EBF4FC] px-3 py-1 rounded-full border border-[#2468A6]/30 flex items-center gap-1.5">
                  <RotateCw className="w-3 h-3 animate-spin" style={{ animationDuration: '4s' }} />
                  <span>{isCardFlipped ? 'Showing Back' : 'Hover to Turn Back'}</span>
                </span>
              </div>

              {/* 3D Flip Card Container */}
              <div
                className="relative w-full max-w-[420px] mx-auto py-2"
                style={{ perspective: '1200px' }}
              >
                <div
                  onMouseEnter={() => setIsCardFlipped(true)}
                  onMouseLeave={() => setIsCardFlipped(false)}
                  onClick={() => setIsCardFlipped(!isCardFlipped)}
                  className="relative w-full aspect-[16/9] cursor-pointer select-none transition-transform duration-700 ease-out shadow-[0_15px_35px_rgba(18,59,104,0.18)] hover:shadow-[0_22px_45px_rgba(36,104,166,0.3)] rounded-2xl"
                  style={{
                    transformStyle: 'preserve-3d',
                    transform: isCardFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
                  }}
                  title="Hover cursor to flip visiting card"
                >
                  {/* Front Face: Royal Blue JBR Builders Emblem */}
                  <div
                    className="absolute inset-0 w-full h-full rounded-2xl overflow-hidden bg-white shadow-inner flex items-center justify-center"
                    style={{
                      backfaceVisibility: 'hidden',
                      WebkitBackfaceVisibility: 'hidden',
                      transform: 'rotateY(0deg)',
                    }}
                  >
                    <img
                      src={visitingFront}
                      alt="JBR Builders Visiting Card Front"
                      className="w-full h-full object-contain rounded-2xl pointer-events-none"
                    />
                  </div>

                  {/* Back Face: White Card with Contact & Office Locations */}
                  <div
                    className="absolute inset-0 w-full h-full rounded-2xl overflow-hidden bg-white shadow-inner flex items-center justify-center"
                    style={{
                      backfaceVisibility: 'hidden',
                      WebkitBackfaceVisibility: 'hidden',
                      transform: 'rotateY(180deg)',
                    }}
                  >
                    <img
                      src={visitingBack}
                      alt="JBR Builders Visiting Card Back"
                      className="w-full h-full object-contain rounded-2xl pointer-events-none"
                    />
                  </div>
                </div>
              </div>

              {/* Card Interactive Instructions */}
              <div className="flex items-center justify-between text-xs text-[#64748B] pt-1 px-1">
                <span className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping inline-block" />
                  <span className="font-semibold text-[#123B68]">Interactive 3D Card</span>
                </span>
                <span className="text-[11px] text-[#64748B]">Move cursor away to reset front</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
