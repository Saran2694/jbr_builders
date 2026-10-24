import React from 'react';
import { ArrowRight, Compass, Shield } from 'lucide-react';
import { Link } from 'react-router-dom';

interface AboutProps {
  onOpenProjectImage?: (imageIndex: number) => void;
}

export const About: React.FC<AboutProps> = ({ onOpenProjectImage }) => {
  return (
    <section
      id="about"
      className="py-20 lg:py-28 relative overflow-hidden bg-white blueprint-grid"
      aria-label="About JBR Builders"
    >
      {/* Subtle ambient glass lighting */}
      <div className="absolute top-1/3 -right-32 w-96 h-96 bg-[#2468A6]/14 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-10 -left-32 w-96 h-96 bg-[#123B68]/12 rounded-full blur-[140px] pointer-events-none" />

      <div className="container-custom relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* Left Column: Brand Story & Philosophy */}
          <div className="lg:col-span-6 space-y-6">
            {/* Small Eyebrow */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#EBF4FC] border border-[#2468A6]/20 text-[#123B68] text-xs font-extrabold uppercase tracking-widest">
              <Compass className="w-3.5 h-3.5 text-[#2468A6]" />
              <span>ABOUT JBR BUILDERS</span>
            </div>

            {/* Heading */}
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#123B68] tracking-tight leading-[1.18]">
              Built on Trust.{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#2468A6] to-[#0E2E52]">
                Designed for Life.
              </span>
            </h2>

            {/* Professional Introduction */}
            <div className="space-y-4 text-sm sm:text-base text-[#64748B] leading-relaxed">
              <p>
                JBR Builders is a premier civil engineering and construction firm delivering landmark residential villas, modern commercial facilities, and comprehensive turnkey solutions across Tuticorin, Tirunelveli, and southern Tamil Nadu.
              </p>
              <p>
                Our work is guided by a singular, disciplined philosophy: <strong>Listen Better, Plan Better, Build Better</strong>. We listen closely to your spatial lifestyle and budgetary goals, plan with architectural and structural rigor, and build with verified, high-grade materials and uncompromised on-site oversight.
              </p>
            </div>

            {/* Core Philosophy Accent Pill */}
            <div className="p-4 rounded-2xl bg-gradient-to-r from-[#2468A6]/12 to-[#38BDF8]/08 border border-[#2468A6]/25 flex items-center gap-3.5 backdrop-blur-sm">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#123B68] to-[#2468A6] text-white flex items-center justify-center shrink-0 shadow-sm">
                <Shield className="w-5 h-5 text-cyan-200" />
              </div>
              <div>
                <p className="text-xs font-extrabold uppercase tracking-wider text-[#123B68]">
                  Our Working Standard
                </p>
                <p className="text-xs text-[#64748B] mt-0.5">
                  Listen Better • Plan Better • Build Better
                </p>
              </div>
            </div>

            {/* CTA Link */}
            <div className="pt-2">
              <Link
                to="/about"
                className="inline-flex items-center gap-2.5 px-7 py-3.5 rounded-full bg-gradient-to-r from-[#123B68] to-[#2468A6] hover:from-[#0E2E52] hover:to-[#1E588D] text-white text-sm font-bold shadow-[0_6px_20px_rgba(36,104,166,0.35)] hover:scale-102 transition-all duration-200"
              >
                <span>Discover Our Story</span>
                <ArrowRight className="w-4 h-4 text-cyan-200" />
              </Link>
            </div>
          </div>

          {/* Right Column: Architectural Photography Composition (Exactly Two Images) */}
          <div className="lg:col-span-6 relative">
            <div className="relative max-w-lg mx-auto lg:max-w-none">
              {/* Primary Image: Finished Architectural Elevation */}
              <div
                onClick={() => onOpenProjectImage && onOpenProjectImage(0)}
                className="relative rounded-3xl overflow-hidden shadow-[0_20px_50px_rgba(18,59,104,0.18)] border border-slate-200/80 bg-slate-900 aspect-[4/3] group cursor-pointer"
                role="button"
                tabIndex={0}
                aria-label="View completed multi-storey residence elevation"
                onKeyDown={(e) => {
                  if ((e.key === 'Enter' || e.key === ' ') && onOpenProjectImage) {
                    onOpenProjectImage(0);
                  }
                }}
              >
                <img
                  src="/images/project-residential-elevation.jpg"
                  alt="Modern residential building facade and architectural illumination completed by JBR Builders"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0B2544]/70 via-transparent to-transparent opacity-80 group-hover:opacity-60 transition-opacity" />
                <div className="absolute bottom-4 left-4 right-4 p-3 rounded-xl bg-white/20 backdrop-blur-md border border-white/30 text-white">
                  <p className="text-[10px] font-extrabold uppercase tracking-widest text-cyan-200">
                    Completed Residence
                  </p>
                  <p className="text-xs font-bold truncate">
                    Modern Multi-Storey Architecture & Lighting
                  </p>
                </div>
              </div>

              {/* Secondary Overlapping Image: Office / Key Handover */}
              <div
                onClick={() => onOpenProjectImage && onOpenProjectImage(1)}
                className="absolute -bottom-8 -left-4 sm:-bottom-10 sm:-left-8 w-1/2 rounded-2xl overflow-hidden shadow-[0_20px_40px_rgba(18,59,104,0.25)] border-4 border-white bg-slate-900 aspect-[4/3] group cursor-pointer"
                role="button"
                tabIndex={0}
                aria-label="View JBR Builders completed handover"
                onKeyDown={(e) => {
                  if ((e.key === 'Enter' || e.key === ' ') && onOpenProjectImage) {
                    onOpenProjectImage(1);
                  }
                }}
              >
                <img
                  src="/images/project-key-handover.jpg"
                  alt="Completed house key handover ceremony by JBR Builders"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0B2544]/80 via-transparent to-transparent opacity-80" />
                <div className="absolute bottom-2.5 left-2.5 right-2.5 p-2 rounded-lg bg-black/40 backdrop-blur-sm text-white">
                  <p className="text-[9px] font-bold tracking-wider uppercase text-cyan-300">
                    Client Handover
                  </p>
                  <p className="text-[10px] font-bold truncate">
                    Ceremonial Delivery
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
