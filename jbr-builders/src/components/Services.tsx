import React from 'react';
import {
  Home,
  Building2,
  Compass,
  Wrench,
  ClipboardCheck,
  KeyRound,
  ArrowRight,
  CheckCircle,
  Sparkles,
} from 'lucide-react';
import { PROPOSED_SERVICES } from '../data/services';
import { useCMS } from '../context/CMSContext';

interface ServicesProps {
  onSelectService: (serviceName: string) => void;
}

export const Services: React.FC<ServicesProps> = ({ onSelectService }) => {
  const { services } = useCMS();
  const currentServices = (services && services.length > 0)
    ? services.filter(s => s.published !== false)
    : PROPOSED_SERVICES;
  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'Home':
        return <Home className="w-6 h-6" />;
      case 'Building2':
        return <Building2 className="w-6 h-6" />;
      case 'Compass':
        return <Compass className="w-6 h-6" />;
      case 'Wrench':
        return <Wrench className="w-6 h-6" />;
      case 'ClipboardCheck':
        return <ClipboardCheck className="w-6 h-6" />;
      case 'KeyRound':
        return <KeyRound className="w-6 h-6" />;
      default:
        return <Building2 className="w-6 h-6" />;
    }
  };

  return (
    <section id="services" className="py-20 lg:py-28 relative overflow-hidden bg-white blueprint-grid">
      {/* Ambient glass lighting glows */}
      <div className="absolute top-1/4 -right-40 w-96 h-96 bg-[#2468A6]/18 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-1/4 -left-40 w-96 h-96 bg-[#123B68]/16 rounded-full blur-[140px] pointer-events-none" />

      <div className="container-custom relative z-10">
        {/* Section Header */}
        <div className="max-w-3xl mx-auto text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass-pill border border-[#2468A6]/20 text-[#123B68] text-xs font-extrabold uppercase tracking-widest mb-3">
            <Sparkles className="w-3.5 h-3.5 text-[#2468A6]" />
            <span>Core Competencies</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#123B68] tracking-tight">
            Our Construction & Engineering Services
          </h2>
          <p className="mt-4 text-base sm:text-lg text-[#64748B] max-w-2xl mx-auto leading-relaxed">
            Tailored engineering solutions from initial architectural blueprinting to turnkey structural execution.
          </p>
          <div className="w-20 h-1 bg-gradient-to-r from-[#123B68] to-[#2468A6] mx-auto mt-5 rounded-full" />
        </div>

        {/* Services Grid with Frosted Glass Panels */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {currentServices.map((service, index) => (
            <div
              key={service.id}
              className="glass-panel glass-panel-hover rounded-3xl p-7 flex flex-col justify-between group relative overflow-hidden"
            >
              {/* Subtle decorative inner corner ambient glow */}
              <div className="absolute -top-16 -right-16 w-32 h-32 bg-gradient-to-br from-[#2468A6]/15 to-transparent rounded-full blur-xl pointer-events-none group-hover:from-[#2468A6]/30 transition-all duration-300" />

              <div>
                {/* Icon & Category Tag */}
                <div className="flex items-center justify-between mb-6">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#123B68] to-[#2468A6] text-white flex items-center justify-center shadow-[0_6px_20px_rgba(36,104,166,0.3)] group-hover:scale-108 transition-all duration-300">
                    {getIcon(service.iconName)}
                  </div>
                  <span className="text-[11px] font-extrabold tracking-widest uppercase text-[#2468A6] px-3 py-1 rounded-full bg-[#2468A6]/10 border border-[#2468A6]/20 backdrop-blur-sm">
                    Service 0{index + 1}
                  </span>
                </div>

                {/* Title */}
                <h3 className="text-xl font-extrabold text-[#123B68] group-hover:text-[#2468A6] transition-colors mb-3">
                  {service.title}
                </h3>

                {/* Description */}
                <p className="text-xs sm:text-sm text-[#64748B] leading-relaxed mb-6 font-normal">
                  {service.description}
                </p>

                {/* Feature Pills */}
                <div className="space-y-2.5 pt-4 border-t border-slate-200/60 mb-7">
                  {service.features.map((feature, idx) => (
                    <div key={idx} className="flex items-start gap-2.5 text-xs text-[#1E293B] font-medium">
                      <CheckCircle className="w-4 h-4 text-[#2468A6] mt-0.5 shrink-0" />
                      <span>{feature}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Button */}
              <button
                type="button"
                onClick={() => onSelectService(service.title)}
                className="w-full py-3 px-4 rounded-2xl bg-white/80 hover:bg-gradient-to-r hover:from-[#123B68] hover:to-[#2468A6] text-[#123B68] hover:text-white font-bold text-xs sm:text-sm border border-slate-200/80 shadow-2xs hover:shadow-md transition-all duration-300 flex items-center justify-center gap-2 group/btn"
              >
                <span>Request Service Appraisal</span>
                <ArrowRight className="w-4 h-4 text-[#2468A6] group-hover/btn:text-white group-hover/btn:translate-x-1 transition-all duration-200" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
