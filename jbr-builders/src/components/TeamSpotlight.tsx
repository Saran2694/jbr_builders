import React, { useState } from 'react';
import { EMPLOYEES } from '../data/team';
import { useCMS } from '../context/CMSContext';
import {
  Users,
  Award,
  ShieldCheck,
  CheckCircle2,
  CalendarCheck,
  Sparkles,
  MapPin,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  GraduationCap
} from 'lucide-react';
import { Link } from 'react-router-dom';

interface TeamSpotlightProps {
  className?: string;
  showAllInitially?: boolean;
  onOpenQuote?: () => void;
}

export const TeamSpotlight: React.FC<TeamSpotlightProps> = ({
  className = '',
  onOpenQuote
}) => {
  const { team } = useCMS();
  const sourceTeam = team && team.length > 0 ? (team as typeof EMPLOYEES) : EMPLOYEES;

  // Filter published members
  const publishedTeam = sourceTeam.filter((m) => (m as any).published !== false);

  // Active selected member index (default to 0: Manoj Neerajakshalu, Principal Architect)
  const [activeIdx, setActiveIdx] = useState(0);

  const activeMember = publishedTeam[activeIdx] || publishedTeam[0];

  const handlePrev = () => {
    if (publishedTeam.length === 0) return;
    setActiveIdx((prev) => (prev - 1 + publishedTeam.length) % publishedTeam.length);
  };

  const handleNext = () => {
    if (publishedTeam.length === 0) return;
    setActiveIdx((prev) => (prev + 1) % publishedTeam.length);
  };

  if (!publishedTeam || publishedTeam.length === 0 || !activeMember) {
    return null;
  }

  return (
    <section
      id="team"
      className={`py-16 lg:py-24 bg-white blueprint-grid text-[#1E293B] relative overflow-hidden select-none ${className}`}
      aria-label="Leadership & Engineering Team"
    >
      {/* Background Soft Blue & Ice Glows */}
      <div className="absolute top-1/4 -left-20 w-[450px] h-[450px] bg-[#2468A6]/8 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute top-1/2 -right-20 w-[480px] h-[480px] bg-[#38BDF8]/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-10 left-1/3 w-[400px] h-[400px] bg-[#123B68]/6 rounded-full blur-[140px] pointer-events-none" />

      <div className="container-custom relative z-10">
        {/* ================= MAIN HERO / STAGE CARD (WHITE LUXURY STAGE) ================= */}
        <div className="rounded-[36px] overflow-hidden bg-gradient-to-br from-white via-[#F8FAFC] to-[#EFF6FF] border border-[#2468A6]/20 shadow-[0_20px_60px_rgba(18,59,104,0.08)] p-6 sm:p-10 lg:p-12 relative backdrop-blur-xl">
          
          {/* ================= UPSIDE: BIG CLEAR PHOTO & PROFILE HIGHLIGHT ================= */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            
            {/* Left Column: Heading & Selected Worker's Full Information */}
            <div className="lg:col-span-7 space-y-6">
              
              {/* Header Badge */}
              <div>
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#EBF4FC] border border-[#2468A6]/20 text-[#123B68] text-xs font-extrabold uppercase tracking-widest mb-3.5 shadow-sm">
                  <Users className="w-3.5 h-3.5 text-[#2468A6]" />
                  <span>LEADERSHIP & ENGINEERING</span>
                </div>

                {/* Section Headline */}
                <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#123B68] tracking-tight leading-[1.15]">
                  Meet the People Behind the{' '}
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#123B68] via-[#2468A6] to-[#0284C7] italic font-serif">
                    Vision.
                  </span>
                </h2>

                <p className="mt-3 text-sm sm:text-base text-[#64748B] max-w-xl leading-relaxed font-normal">
                  Dedicated professionals bringing planning, engineering, and construction together.
                </p>
              </div>

              {/* Dynamic Worker Profile Showcase Box */}
              <div className="p-5 sm:p-6 rounded-3xl bg-white/95 backdrop-blur-2xl border border-slate-200/90 shadow-[0_10px_30px_rgba(18,59,104,0.05)] space-y-4">
                
                {/* Name, Role & Location */}
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <h3 className="text-2xl sm:text-3xl font-extrabold text-[#123B68] tracking-tight">
                      {activeMember.name}
                    </h3>
                    <div className="flex flex-wrap items-center gap-2.5 mt-1.5">
                      <span className="px-3 py-1 rounded-full bg-[#EBF4FC] border border-[#2468A6]/30 text-[#123B68] text-xs font-bold uppercase tracking-wider shadow-sm">
                        {activeMember.role}
                      </span>
                      <span className="inline-flex items-center gap-1 text-xs text-[#64748B] font-medium">
                        <MapPin className="w-3.5 h-3.5 text-[#2468A6]" />
                        {activeMember.location}
                      </span>
                    </div>
                  </div>

                  {/* Experience Badge */}
                  <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-2xl bg-[#FEF3C7] border border-amber-300 text-amber-800 text-xs font-bold shadow-sm">
                    <Award className="w-4 h-4 text-amber-600" />
                    <span>{activeMember.experience}</span>
                  </div>
                </div>

                {/* Personal Quote */}
                {activeMember.quote && (
                  <div className="p-3.5 rounded-2xl bg-[#F8FAFC] border-l-4 border-l-[#2468A6] border border-slate-200 text-xs sm:text-sm italic text-slate-700 leading-relaxed shadow-sm">
                    "{activeMember.quote}"
                  </div>
                )}

                {/* Qualification & Specialization */}
                <div className="space-y-1.5 text-xs text-slate-700">
                  <div className="flex items-start gap-2">
                    <GraduationCap className="w-4 h-4 text-[#2468A6] shrink-0 mt-0.5" />
                    <span>
                      <strong className="text-[#123B68]">Credentials:</strong> {activeMember.qualification}
                    </span>
                  </div>
                  <div className="flex items-start gap-2">
                    <Sparkles className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                    <span>
                      <strong className="text-[#123B68]">Specialization:</strong> {activeMember.specialization}
                    </span>
                  </div>
                </div>

                {/* Bio Snippet */}
                <p className="text-xs sm:text-sm text-[#64748B] leading-relaxed pt-1 border-t border-slate-200">
                  {activeMember.bio}
                </p>
              </div>



              {/* 3 Micro Trust Badges */}
              <div className="grid grid-cols-3 gap-3 pt-4 border-t border-slate-200">
                <div className="flex items-center gap-2 text-[#123B68]">
                  <ShieldCheck className="w-4 h-4 text-[#2468A6] shrink-0" />
                  <span className="text-[11px] sm:text-xs font-semibold leading-tight">
                    Registered Council
                  </span>
                </div>
                <div className="flex items-center gap-2 text-[#123B68]">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span className="text-[11px] sm:text-xs font-semibold leading-tight">
                    100% Structural Quality
                  </span>
                </div>
                <div className="flex items-center gap-2 text-[#123B68]">
                  <CalendarCheck className="w-4 h-4 text-amber-600 shrink-0" />
                  <span className="text-[11px] sm:text-xs font-semibold leading-tight">
                    On-Time Handover
                  </span>
                </div>
              </div>
            </div>

            {/* Right Column: MODERN ASYMMETRIC SCULPTED PORTRAIT WITH ECHOING FRAMES */}
            <div className="lg:col-span-5 flex justify-center items-center relative py-4">
              
              {/* Outer Echoing Sculpted Frames (Diagonal Asymmetric Curves) */}
              <div className="absolute w-[360px] sm:w-[415px] h-[450px] sm:h-[505px] border border-[#2468A6]/25 rounded-tl-[68px] rounded-br-[68px] rounded-tr-[28px] rounded-bl-[28px] pointer-events-none" />
              <div className="absolute w-[390px] sm:w-[445px] h-[480px] sm:h-[535px] border border-dashed border-[#38BDF8]/30 rounded-tl-[76px] rounded-br-[76px] rounded-tr-[34px] rounded-bl-[34px] pointer-events-none" />
              <div className="absolute w-[320px] sm:w-[380px] h-[320px] sm:h-[380px] bg-gradient-to-tr from-[#38BDF8]/20 via-[#2468A6]/10 to-transparent rounded-full blur-[80px] pointer-events-none" />

              {/* Big Featured Photo Card: Modern Asymmetric Organic Curve Shape */}
              <div className="relative w-full max-w-[340px] sm:max-w-[380px] aspect-[4/5] rounded-tl-[56px] rounded-br-[56px] rounded-tr-[20px] rounded-bl-[20px] overflow-hidden border-4 border-white shadow-[0_25px_60px_rgba(18,59,104,0.18),0_0_35px_rgba(56,189,248,0.15)] bg-slate-100 group">
                
                {/* Photo: High Brightness & Sharp Visibility */}
                <img
                  key={activeMember.id}
                  src={activeMember.image}
                  alt={activeMember.name}
                  onError={(e) => {
                              (e.target as any).src = '/images/team/founder.jpeg';
                  }}
                  className="w-full h-full object-cover object-top select-none brightness-105 contrast-105 transition-all duration-700 ease-out"
                />

                {/* Soft specular glass highlight matching asymmetric curves */}
                <div className="absolute inset-0 rounded-tl-[56px] rounded-br-[56px] rounded-tr-[20px] rounded-bl-[20px] pointer-events-none ring-1 ring-inset ring-white/70" />
                
                {/* Subtle gradient at bottom for floating chip */}
                <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-[#0B2544]/75 via-transparent to-transparent pointer-events-none" />

                {/* Floating Member Tag Chip */}
                <div className="absolute bottom-4 inset-x-4 flex items-center justify-between p-3 rounded-2xl bg-white/95 backdrop-blur-xl border border-white/80 text-[#123B68] shadow-xl">
                  <div>
                    <div className="text-sm font-extrabold truncate text-[#123B68]">{activeMember.name}</div>
                    <div className="text-[11px] text-[#2468A6] font-bold truncate">
                      {activeMember.role}
                    </div>
                  </div>
                  <div className="px-2.5 py-1 rounded-xl bg-[#123B68] text-white text-[10px] font-black uppercase tracking-wider shadow">
                    Active
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ================= DOWNSIDE: WORKERS CAROUSEL / ROW (TOUCH TO VIEW) ================= */}
          <div className="mt-12 sm:mt-16 pt-8 sm:pt-10 border-t border-slate-200">
            
            {/* Row Header */}
            <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
              <div>
                <h3 className="text-lg sm:text-xl font-extrabold text-[#123B68] tracking-tight flex items-center gap-2">
                  <span>Our Core Leadership & On-Site Team</span>
                  <span className="text-xs px-2.5 py-0.5 rounded-full bg-[#EBF4FC] text-[#123B68] border border-[#2468A6]/20 font-bold">
                    Touch profile to view upside
                  </span>
                </h3>
                <p className="text-xs text-[#64748B] mt-1 font-normal">
                  Click or touch any engineer below to display their photo and full credentials bigger in the upside spotlight.
                </p>
              </div>

              {/* Navigation Chevrons */}
              <div className="flex items-center gap-2">
                <button
                  onClick={handlePrev}
                  aria-label="Previous team member"
                  title="Previous Member"
                  className="w-9 h-9 rounded-full bg-white hover:bg-slate-100 border border-slate-200 flex items-center justify-center text-[#123B68] transition-all cursor-pointer hover:scale-105 active:scale-95 shadow-sm"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <span className="text-xs text-[#123B68] font-mono font-bold px-2">
                  {activeIdx + 1} / {publishedTeam.length}
                </span>
                <button
                  onClick={handleNext}
                  aria-label="Next team member"
                  title="Next Member"
                  className="w-9 h-9 rounded-full bg-white hover:bg-slate-100 border border-slate-200 flex items-center justify-center text-[#123B68] transition-all cursor-pointer hover:scale-105 active:scale-95 shadow-sm"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Horizontal Circular Category / Member Avatars Track */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6 max-w-4xl mx-auto pb-2 pt-2">
              {publishedTeam.map((member, idx) => {
                const isActive = idx === activeIdx;

                return (
                  <div
                    key={member.id}
                    onClick={() => setActiveIdx(idx)}
                    role="button"
                    tabIndex={0}
                    aria-label={`Select ${member.name}`}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') setActiveIdx(idx);
                    }}
                    className="flex flex-col items-center text-center cursor-pointer group transition-all duration-300"
                  >
                    {/* Circular Photo Avatar with Luxury Gradient Ring */}
                    <div className="relative mb-3">
                      <div
                        className={`w-24 h-24 sm:w-28 sm:h-28 rounded-full p-1 transition-all duration-300 ${
                          isActive
                            ? 'bg-gradient-to-tr from-[#123B68] via-[#2468A6] to-[#38BDF8] shadow-[0_12px_28px_rgba(36,104,166,0.35)] scale-105 -translate-y-1'
                            : 'bg-transparent border-2 border-slate-200 group-hover:border-[#2468A6]/70 group-hover:scale-105 shadow-sm'
                        }`}
                      >
                        <div className="w-full h-full rounded-full overflow-hidden bg-slate-100 border-2 border-white relative shadow-inner">
                          <img
                            src={member.image}
                            alt={member.name}
                            className="w-full h-full object-cover object-top select-none brightness-105 transition-transform duration-500 group-hover:scale-110"
                            loading="lazy"
                            onError={(e) => {
                                        (e.target as any).src = '/images/team/founder.jpeg';
                            }}
                          />
                        </div>
                      </div>

                      {/* Active Status Badge Pill */}
                      {isActive && (
                        <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 px-2.5 py-0.5 rounded-full bg-[#123B68] text-white text-[9px] font-black uppercase tracking-wider shadow-md whitespace-nowrap border border-white">
                          Active
                        </div>
                      )}
                    </div>

                    {/* Member Name & Role Below Circle */}
                    <div className="w-full px-1">
                      <div
                        className={`text-xs sm:text-sm font-extrabold truncate transition-colors ${
                          isActive ? 'text-[#123B68]' : 'text-slate-800 group-hover:text-[#2468A6]'
                        }`}
                        title={member.name}
                      >
                        {member.name}
                      </div>
                      <div className="text-[10px] sm:text-[11px] text-[#2468A6] font-semibold truncate mt-0.5">
                        {member.role.split('&')[0]}
                      </div>
                      <div className="text-[9px] font-semibold mt-1">
                        {isActive ? (
                          <span className="text-[#123B68] bg-[#EBF4FC] px-2 py-0.5 rounded-full border border-[#2468A6]/20 inline-block">
                            ● Active
                          </span>
                        ) : (
                          <span className="text-[#64748B] opacity-0 group-hover:opacity-100 transition-opacity">
                            Touch to view ↑
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Footer Navigation Link */}
          <div className="mt-8 text-center pt-6 border-t border-slate-200">
            <Link
              to="/about#team"
              className="inline-flex items-center gap-2 text-xs font-bold text-[#2468A6] hover:text-[#123B68] transition-colors"
            >
              <span>Explore complete staff organizational directory</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};
