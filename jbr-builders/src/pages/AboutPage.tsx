import React, { useState, useRef } from 'react';
import {
  Shield,
  ShieldCheck,
  Users,
  GraduationCap,
  Compass,
  CheckCircle2,
  Building,
  Building2,
  Briefcase,
  MapPin,
  MessageCircle,
  Sparkles,
  ChevronRight,
  Mail,
  Phone,
  FileText,
  Award,
  ArrowRight,
  Play,
  Pause,
  Volume2,
  VolumeX,
  Headphones,
  HardHat,
} from 'lucide-react';
import { EMPLOYEES } from '../data/team';
import { COMPANY_INFO } from '../data/company';
import { GALLERY_PROJECTS } from '../data/projects';
import { Link } from 'react-router-dom';
import { TeamSpotlight } from '../components/TeamSpotlight';
import { useCMS } from '../context/CMSContext';
import { SEOHead } from '../components/SEOHead';
import { StructuredData } from '../components/StructuredData';
import { getBreadcrumbSchema } from '../seo/structured-data';

const LinkedInIcon = ({ className = 'w-3.5 h-3.5' }: { className?: string }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24">
    <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 10.9h2.79v8.37H6.46v-8.37M7.86 6.31a1.63 1.63 0 1 0 1.63 1.63 1.63 1.63 0 0 0-1.63-1.63Z" />
  </svg>
);

interface AboutPageProps {
  onOpenProjectImage: (index: number) => void;
  onOpenQuote: () => void;
}

export const AboutPage: React.FC<AboutPageProps> = ({ onOpenProjectImage, onOpenQuote }) => {
  const { team: cmsEmployees, company: cmsCompany } = useCMS();
  const currentCompany = cmsCompany || COMPANY_INFO;

  const [selectedDept, setSelectedDept] = useState<string>('all');

  // Only display active / published employees on public About Us page
  const activeEmployees = (cmsEmployees && cmsEmployees.length > 0 ? cmsEmployees : EMPLOYEES)
    .filter((e: any) => e.published !== false);

  const departments = ['all', ...Array.from(new Set(activeEmployees.map((e: any) => e.department).filter(Boolean)))];

  const filteredEmployees = selectedDept === 'all'
    ? activeEmployees
    : activeEmployees.filter(e => e.department === selectedDept);

  const officeIndex = GALLERY_PROJECTS.findIndex(p => p.id === 'office-front');

  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);

  const togglePlay = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (videoRef.current) {
      if (videoRef.current.paused) {
        videoRef.current.play();
        setIsPlaying(true);
      } else {
        videoRef.current.pause();
        setIsPlaying(false);
      }
    }
  };

  const toggleMute = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  return (
    <div className="pt-24 sm:pt-28 pb-20 relative overflow-hidden blueprint-grid">
      {/* SEO Meta Tags */}
      <SEOHead
        title="About JBR Builders | Construction Company in Tamil Nadu"
        description="Learn about JBR Builders — a construction company with offices in Tuticorin and Tirunelveli, Tamil Nadu. Meet our licensed civil engineers, architects, and site supervisors who deliver quality residential and commercial projects."
        canonical="https://jbrbuilders.in/about"
        keywords="about JBR Builders, construction company Tamil Nadu, civil engineers Tirunelveli, architects Tuticorin, building contractors team"
      />
      <StructuredData data={getBreadcrumbSchema([
        { name: 'Home', url: 'https://jbrbuilders.in/' },
        { name: 'About Us', url: 'https://jbrbuilders.in/about' },
      ])} />
      {/* Ambient background glows */}
      <div className="absolute top-20 -left-40 w-96 h-96 bg-[#2468A6]/12 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute top-1/2 -right-40 w-[500px] h-[500px] bg-[#123B68]/12 rounded-full blur-[140px] pointer-events-none" />

      <div className="container-custom relative z-10">
        {/* Breadcrumb Navigation */}
        <div className="flex items-center gap-2 text-xs font-bold text-[#64748B] mb-6">
          <Link to="/" className="hover:text-[#123B68] transition-colors">Home</Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-[#123B68]">About Us & Team</span>
        </div>

        {/* Page Hero Header */}
        <div className="max-w-4xl mx-auto text-center mb-16 sm:mb-20">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass-pill border border-[#2468A6]/20 text-[#123B68] text-xs font-extrabold uppercase tracking-widest mb-4">
            <Shield className="w-3.5 h-3.5 text-[#2468A6]" />
            <span>Company Profile & People</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-[#123B68] tracking-tight leading-[1.15]">
            Engineering Excellence, <br className="hidden sm:inline" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#2468A6] to-[#0E2E52]">
              Powered by Proven People
            </span>
          </h1>

          <p className="mt-5 text-base sm:text-lg text-[#64748B] max-w-2xl mx-auto leading-relaxed">
            Discover the licensed civil engineers, project managers, and young engineering interns behind JBR Builders’ trusted residential and commercial projects in Tuticorin & Tirunelveli.
          </p>
        </div>

        {/* Company Background & Story Grid — Architectural Bento Redesign */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-stretch mb-24">
          {/* Left Column: Brand Story, Engineering Integrity & Metric Indicators */}
          <div className="lg:col-span-7 flex flex-col justify-between glass-panel rounded-3xl p-7 sm:p-10 relative overflow-hidden group">
            {/* Ambient subtle glow within card */}
            <div className="absolute -right-16 -top-16 w-56 h-56 bg-gradient-to-br from-[#2468A6]/12 to-transparent rounded-full blur-2xl pointer-events-none" />

            <div className="relative z-10 space-y-6">
              {/* Refined Eyebrow */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/80 border border-[#2468A6]/20 shadow-2xs text-[#123B68] text-xs font-extrabold uppercase tracking-widest backdrop-blur-sm">
                <ShieldCheck className="w-4 h-4 text-[#2468A6]" />
                <span>Our Foundation & Legacy</span>
              </div>

              {/* Headline */}
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#123B68] tracking-tight leading-[1.2]">
                Built on Rigorous Structural Discipline & Transparent Values
              </h2>

              {/* Narrative Paragraphs */}
              <div className="space-y-4 text-sm sm:text-base text-[#64748B] leading-relaxed">
                <p>
                  JBR Builders was founded with a singular purpose: to deliver dependable, stress-free construction services that balance contemporary architectural beauty with uncompromising structural longevity. Operating from registered offices in Tuticorin and Tirunelveli, we oversee every project with licensed engineers on site.
                </p>
                <p>
                  Unlike informal contractors, we believe in clear, detailed engineering documentation, soil test validations, transparent Bills of Quantities (BOQs), and realistic milestone tracking from ground-breaking through key delivery.
                </p>
              </div>

              {/* Engineering Standards Micro-Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                <div className="p-3.5 rounded-2xl bg-white/70 backdrop-blur-md border border-white/80 shadow-2xs flex items-start gap-3 transition-colors hover:bg-white/90">
                  <div className="w-8 h-8 rounded-xl bg-[#2468A6]/10 text-[#2468A6] flex items-center justify-center shrink-0 mt-0.5">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-[#123B68]">Civil Supervision</h4>
                    <p className="text-[11px] text-[#64748B] mt-0.5 leading-snug">Licensed engineers overseeing every slab & concrete pour</p>
                  </div>
                </div>

                <div className="p-3.5 rounded-2xl bg-white/70 backdrop-blur-md border border-white/80 shadow-2xs flex items-start gap-3 transition-colors hover:bg-white/90">
                  <div className="w-8 h-8 rounded-xl bg-[#2468A6]/10 text-[#2468A6] flex items-center justify-center shrink-0 mt-0.5">
                    <FileText className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-[#123B68]">Transparent BOQs</h4>
                    <p className="text-[11px] text-[#64748B] mt-0.5 leading-snug">Itemized material specs with zero hidden escalations</p>
                  </div>
                </div>

                <div className="p-3.5 rounded-2xl bg-white/70 backdrop-blur-md border border-white/80 shadow-2xs flex items-start gap-3 transition-colors hover:bg-white/90">
                  <div className="w-8 h-8 rounded-xl bg-[#2468A6]/10 text-[#2468A6] flex items-center justify-center shrink-0 mt-0.5">
                    <Building2 className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-[#123B68]">Soil Test Validation</h4>
                    <p className="text-[11px] text-[#64748B] mt-0.5 leading-snug">Calculated foundation depths conforming to IS codes</p>
                  </div>
                </div>

                <div className="p-3.5 rounded-2xl bg-white/70 backdrop-blur-md border border-white/80 shadow-2xs flex items-start gap-3 transition-colors hover:bg-white/90">
                  <div className="w-8 h-8 rounded-xl bg-[#2468A6]/10 text-[#2468A6] flex items-center justify-center shrink-0 mt-0.5">
                    <Sparkles className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-[#123B68]">Milestone Delivery</h4>
                    <p className="text-[11px] text-[#64748B] mt-0.5 leading-snug">Structured timeline tracking with verifiable stage signs</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Elevated Performance Metrics Bar */}
            <div className="grid grid-cols-3 gap-3 sm:gap-4 pt-6 mt-6 border-t border-slate-200/60 relative z-10">
              <div className="p-3.5 sm:p-4 rounded-2xl bg-white/80 backdrop-blur-md border border-white/90 shadow-2xs text-center sm:text-left transition-all duration-300 hover:-translate-y-1 hover:shadow-md">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-[#123B68] tracking-tight">100%</span>
                  <ShieldCheck className="w-4 h-4 sm:w-5 sm:h-5 text-[#2468A6] hidden sm:block opacity-80" />
                </div>
                <span className="block text-xs font-bold text-[#123B68]">Civil Supervision</span>
                <span className="text-[11px] text-[#64748B] font-medium hidden sm:block mt-0.5">Qualified engineers on site</span>
              </div>

              <div className="p-3.5 sm:p-4 rounded-2xl bg-white/80 backdrop-blur-md border border-white/90 shadow-2xs text-center sm:text-left transition-all duration-300 hover:-translate-y-1 hover:shadow-md">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-[#123B68] tracking-tight">2</span>
                  <MapPin className="w-4 h-4 sm:w-5 sm:h-5 text-[#2468A6] hidden sm:block opacity-80" />
                </div>
                <span className="block text-xs font-bold text-[#123B68]">Regional Hubs</span>
                <span className="text-[11px] text-[#64748B] font-medium hidden sm:block mt-0.5">Tuticorin & Tirunelveli</span>
              </div>

              <div className="p-3.5 sm:p-4 rounded-2xl bg-white/80 backdrop-blur-md border border-white/90 shadow-2xs text-center sm:text-left transition-all duration-300 hover:-translate-y-1 hover:shadow-md">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-[#2468A6] tracking-tight">Turnkey</span>
                  <Award className="w-4 h-4 sm:w-5 sm:h-5 text-[#2468A6] hidden sm:block opacity-80" />
                </div>
                <span className="block text-xs font-bold text-[#123B68]">End-to-End</span>
                <span className="text-[11px] text-[#64748B] font-medium hidden sm:block mt-0.5">From Concept to Keys</span>
              </div>
            </div>
          </div>

          {/* Right Column: Visual Proof & Facilities Showcase */}
          <div className="lg:col-span-5 flex flex-col justify-between gap-6">
            {/* Handover Hero Visual Card with Video */}
            <div
              onClick={() => togglePlay()}
              className="group relative rounded-3xl overflow-hidden glass-panel glass-panel-hover cursor-pointer border border-[#2468A6]/25 shadow-lg flex-1 flex flex-col justify-end min-h-[320px] sm:min-h-[360px]"
              role="button"
              tabIndex={0}
              aria-label="Play or pause key handover video"
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') togglePlay();
              }}
            >
              {/* Full-bleed background video */}
              <div className="absolute inset-0 bg-slate-950 overflow-hidden">
                <video
                  ref={videoRef}
                  src="/videos/vid2.mp4"
                  autoPlay
                  loop
                  muted={isMuted}
                  playsInline
                  onPlay={() => setIsPlaying(true)}
                  onPause={() => setIsPlaying(false)}
                  className="w-full h-full object-cover transform transition-transform duration-700 ease-out group-hover:scale-104"
                />
                {/* Dark gradient overlay for contrast */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#07182C] via-[#07182C]/30 to-transparent pointer-events-none" />
              </div>

              {/* Top Bar: Live Milestone & Video Controls */}
              <div className="absolute top-4 inset-x-4 flex items-center justify-between z-10">
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-900/80 backdrop-blur-md border border-white/20 text-white text-xs font-bold shadow-sm pointer-events-none">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span>Verified Completion</span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={toggleMute}
                    className="w-9 h-9 rounded-full bg-slate-900/80 hover:bg-slate-900 backdrop-blur-md border border-white/25 text-white flex items-center justify-center transition-all shadow-md hover:scale-105 cursor-pointer"
                    aria-label={isMuted ? "Unmute video" : "Mute video"}
                    title={isMuted ? "Unmute audio" : "Mute audio"}
                  >
                    {isMuted ? <VolumeX className="w-4 h-4 text-slate-300" /> : <Volume2 className="w-4 h-4 text-cyan-300" />}
                  </button>

                  <button
                    type="button"
                    onClick={togglePlay}
                    className="w-9 h-9 rounded-full bg-slate-900/80 hover:bg-slate-900 backdrop-blur-md border border-white/25 text-white flex items-center justify-center transition-all shadow-md hover:scale-105 cursor-pointer"
                    aria-label={isPlaying ? "Pause video" : "Play video"}
                    title={isPlaying ? "Pause video" : "Play video"}
                  >
                    {isPlaying ? <Pause className="w-4 h-4 text-slate-200" /> : <Play className="w-4 h-4 text-cyan-300 ml-0.5" />}
                  </button>
                </div>
              </div>

              {/* Bottom Card Content */}
              <div className="relative z-10 p-4 sm:p-5">
                <div className="p-4 sm:p-4.5 rounded-2xl bg-slate-950/70 backdrop-blur-xl border border-white/20 text-white shadow-xl transition-all duration-300 group-hover:bg-slate-950/85 group-hover:border-cyan-400/40">
                  <div className="flex items-center justify-between gap-3 mb-1">
                    <span className="text-[10px] font-extrabold uppercase tracking-widest text-cyan-300">
                      Handover Milestone • Video Feature
                    </span>
                    <span className="text-[11px] font-bold text-cyan-200 inline-flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                      {isPlaying ? 'Playing on Site' : 'Click to Play'} &rarr;
                    </span>
                  </div>
                  <h3 className="text-sm sm:text-base font-extrabold text-white leading-snug">
                    Ceremonial Key Handover with Homeowner Family
                  </h3>
                  <p className="text-xs text-slate-300 mt-1 line-clamp-2">
                    Delivering dependable, turnkey living spaces with complete civil integrity across southern Tamil Nadu.
                  </p>
                </div>
              </div>
            </div>

            {/* Facilities & Presence Card */}
            <div
              onClick={() => onOpenProjectImage(officeIndex >= 0 ? officeIndex : 5)}
              className="glass-panel glass-panel-hover rounded-3xl p-4 sm:p-5 cursor-pointer group border border-[#2468A6]/25 shadow-md"
              role="button"
              tabIndex={0}
              aria-label="View office facilities and entrance image in lightbox"
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') onOpenProjectImage(officeIndex >= 0 ? officeIndex : 5);
              }}
            >
              <div className="flex items-center justify-between gap-3.5">
                <div className="flex items-center gap-3.5 sm:gap-4 min-w-0">
                  {/* Office Image Thumbnail */}
                  <div className="relative w-16 h-16 sm:w-18 sm:h-18 rounded-2xl overflow-hidden border border-white/80 shadow-md shrink-0 bg-slate-900 group-hover:ring-2 group-hover:ring-[#2468A6]/50 transition-all">
                    <img
                      src="/images/office-entrance.jpg"
                      alt="JBR Builders headquarters office entrance"
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-[#123B68]/15 group-hover:bg-transparent transition-colors" />
                  </div>

                  <div className="min-w-0">
                    <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#2468A6]/10 text-[#2468A6] text-[10px] font-extrabold uppercase tracking-wider mb-1">
                      <Building2 className="w-3 h-3" />
                      <span>Registered Facilities</span>
                    </div>
                    <h4 className="text-xs sm:text-sm font-extrabold text-[#123B68] tracking-tight truncate">
                      Tuticorin Head Office & Tirunelveli Branch
                    </h4>
                    <p className="text-[11px] sm:text-xs text-[#64748B] mt-0.5 flex items-center gap-1 truncate">
                      <MapPin className="w-3 h-3 text-[#2468A6] shrink-0" />
                      <span>Palai Main Rd, Pudukottai • Pearl Ave, KTC Nagar</span>
                    </p>
                  </div>
                </div>

                <div className="shrink-0">
                  <span className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-white/80 text-[#123B68] group-hover:bg-[#123B68] group-hover:text-white flex items-center justify-center transition-all duration-300 shadow-2xs group-hover:shadow-md">
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Operating Pillars — Pro UI/UX Architectural Methodology */}
        <div className="mb-24 relative">
          {/* Section Header */}
          <div className="text-center max-w-3xl mx-auto mb-14">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/80 border border-[#2468A6]/20 shadow-2xs text-[#123B68] text-xs font-extrabold uppercase tracking-widest backdrop-blur-sm mb-4">
              <Sparkles className="w-3.5 h-3.5 text-[#2468A6]" />
              <span>Core Methodology</span>
            </div>
            <h3 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#123B68] tracking-tight leading-[1.15]">
              Listen Better <span className="text-[#2468A6] font-light">·</span> Plan Better <span className="text-[#2468A6] font-light">·</span> Build Better
            </h3>
            <p className="mt-4 text-sm sm:text-base text-[#64748B] max-w-xl mx-auto leading-relaxed">
              Our end-to-end civil engineering framework designed to eliminate guesswork, align budgets, and ensure lifetime structural integrity.
            </p>
          </div>

          {/* Cards Grid with Progressive Workflow Flow */}
          <div className="relative">
            {/* Desktop Connecting Line behind cards */}
            <div className="hidden lg:block absolute top-1/2 left-[12%] right-[12%] h-[2px] bg-gradient-to-r from-[#2468A6]/10 via-[#2468A6]/30 to-[#2468A6]/10 -translate-y-16 pointer-events-none z-0" />

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8 relative z-10">
              {/* Pillar 01: Listen Better */}
              <div className="glass-panel glass-panel-hover rounded-3xl p-7 sm:p-8 flex flex-col justify-between relative overflow-hidden group border border-[#2468A6]/25 shadow-md">
                <div className="relative z-10 space-y-5">
                  {/* Top Row: Icon + Phase Tag */}
                  <div className="flex items-center justify-between">
                    <div className="w-13 h-13 rounded-2xl bg-gradient-to-br from-[#123B68] to-[#2468A6] text-white flex items-center justify-center shadow-md shadow-[#123B68]/20 group-hover:scale-105 transition-transform duration-300">
                      <Headphones className="w-6 h-6 text-cyan-200" />
                    </div>
                    <span className="px-3 py-1 rounded-full bg-[#2468A6]/10 border border-[#2468A6]/20 text-[#2468A6] text-[10px] font-extrabold uppercase tracking-wider">
                      Phase 01 · Discovery
                    </span>
                  </div>

                  <div>
                    <span className="text-xs font-bold text-[#2468A6] uppercase tracking-wider">
                      Discovery & Lifestyle Audit
                    </span>
                    <h4 className="text-xl sm:text-2xl font-extrabold text-[#123B68] mt-1">
                      Listen Better
                    </h4>
                  </div>

                  <p className="text-xs sm:text-sm text-[#64748B] leading-relaxed">
                    Before drawing lines on paper, we listen attentively to your functional lifestyle, family requirements, future expansion needs, and practical financial targets.
                  </p>

                  {/* Micro-deliverables list */}
                  <div className="space-y-2 pt-2 border-t border-slate-200/60">
                    <div className="flex items-center gap-2 text-xs text-[#1E293B]">
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#2468A6] shrink-0" />
                      <span>Family spatial habits & room proportions</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-[#1E293B]">
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#2468A6] shrink-0" />
                      <span>Plot orientation, wind flow & Vaastu sync</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-[#1E293B]">
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#2468A6] shrink-0" />
                      <span>Realistic budget boundaries with zero pressure</span>
                    </div>
                  </div>
                </div>

                {/* Bottom Assurance Badge */}
                <div className="mt-6 pt-4 border-t border-slate-200/60 flex items-center justify-between relative z-10">
                  <span className="text-[11px] font-bold text-[#64748B]">Key Outcome:</span>
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/80 border border-slate-200/80 text-[#123B68] text-[11px] font-extrabold shadow-2xs">
                    <Sparkles className="w-3 h-3 text-[#2468A6]" />
                    <span>Total Client Clarity</span>
                  </span>
                </div>
              </div>

              {/* Pillar 02: Plan Better */}
              <div className="glass-panel glass-panel-hover rounded-3xl p-7 sm:p-8 flex flex-col justify-between relative overflow-hidden group border border-[#2468A6]/25 shadow-md">
                <div className="relative z-10 space-y-5">
                  {/* Top Row: Icon + Phase Tag */}
                  <div className="flex items-center justify-between">
                    <div className="w-13 h-13 rounded-2xl bg-gradient-to-br from-[#2468A6] to-[#0E2E52] text-white flex items-center justify-center shadow-md shadow-[#2468A6]/20 group-hover:scale-105 transition-transform duration-300">
                      <Compass className="w-6 h-6 text-cyan-200" />
                    </div>
                    <span className="px-3 py-1 rounded-full bg-[#2468A6]/10 border border-[#2468A6]/20 text-[#2468A6] text-[10px] font-extrabold uppercase tracking-wider">
                      Phase 02 · Engineering
                    </span>
                  </div>

                  <div>
                    <span className="text-xs font-bold text-[#2468A6] uppercase tracking-wider">
                      Architecture & Structural Math
                    </span>
                    <h4 className="text-xl sm:text-2xl font-extrabold text-[#123B68] mt-1">
                      Plan Better
                    </h4>
                  </div>

                  <p className="text-xs sm:text-sm text-[#64748B] leading-relaxed">
                    Photorealistic 3D exterior elevations, structural calculations in accordance with Indian Standards, comprehensive material schedules, and timeline milestones.
                  </p>

                  {/* Micro-deliverables list */}
                  <div className="space-y-2 pt-2 border-t border-slate-200/60">
                    <div className="flex items-center gap-2 text-xs text-[#1E293B]">
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#2468A6] shrink-0" />
                      <span>3D day/night photorealistic renders</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-[#1E293B]">
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#2468A6] shrink-0" />
                      <span>IS Code-compliant structural drawings</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-[#1E293B]">
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#2468A6] shrink-0" />
                      <span>Line-itemized Bill of Quantities (BOQ)</span>
                    </div>
                  </div>
                </div>

                {/* Bottom Assurance Badge */}
                <div className="mt-6 pt-4 border-t border-slate-200/60 flex items-center justify-between relative z-10">
                  <span className="text-[11px] font-bold text-[#64748B]">Key Outcome:</span>
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/80 border border-slate-200/80 text-[#123B68] text-[11px] font-extrabold shadow-2xs">
                    <FileText className="w-3 h-3 text-[#2468A6]" />
                    <span>Zero Budget Surprises</span>
                  </span>
                </div>
              </div>

              {/* Pillar 03: Build Better */}
              <div className="glass-panel glass-panel-hover rounded-3xl p-7 sm:p-8 flex flex-col justify-between relative overflow-hidden group border border-[#2468A6]/25 shadow-md">
                <div className="relative z-10 space-y-5">
                  {/* Top Row: Icon + Phase Tag */}
                  <div className="flex items-center justify-between">
                    <div className="w-13 h-13 rounded-2xl bg-gradient-to-br from-[#123B68] to-[#2468A6] text-white flex items-center justify-center shadow-md shadow-[#123B68]/20 group-hover:scale-105 transition-transform duration-300">
                      <HardHat className="w-6 h-6 text-cyan-200" />
                    </div>
                    <span className="px-3 py-1 rounded-full bg-[#2468A6]/10 border border-[#2468A6]/20 text-[#2468A6] text-[10px] font-extrabold uppercase tracking-wider">
                      Phase 03 · Execution
                    </span>
                  </div>

                  <div>
                    <span className="text-xs font-bold text-[#2468A6] uppercase tracking-wider">
                      Civil Oversight & Quality Curing
                    </span>
                    <h4 className="text-xl sm:text-2xl font-extrabold text-[#123B68] mt-1">
                      Build Better
                    </h4>
                  </div>

                  <p className="text-xs sm:text-sm text-[#64748B] leading-relaxed">
                    Hands-on on-site civil engineer supervision, tested TMT steel bars, certified cement grades, strict curing periods, and meticulous finishing checks.
                  </p>

                  {/* Micro-deliverables list */}
                  <div className="space-y-2 pt-2 border-t border-slate-200/60">
                    <div className="flex items-center gap-2 text-xs text-[#1E293B]">
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#2468A6] shrink-0" />
                      <span>Licensed site engineer supervising every pour</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-[#1E293B]">
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#2468A6] shrink-0" />
                      <span>Certified Fe-550D TMT & laboratory cube tests</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-[#1E293B]">
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#2468A6] shrink-0" />
                      <span>21-day curing schedule & turnkey handover</span>
                    </div>
                  </div>
                </div>

                {/* Bottom Assurance Badge */}
                <div className="mt-6 pt-4 border-t border-slate-200/60 flex items-center justify-between relative z-10">
                  <span className="text-[11px] font-bold text-[#64748B]">Key Outcome:</span>
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/80 border border-slate-200/80 text-[#123B68] text-[11px] font-extrabold shadow-2xs">
                    <ShieldCheck className="w-3 h-3 text-[#2468A6]" />
                    <span>Structural Longevity</span>
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* TEAM SECTION */}
        <div id="team" className="mb-24">
          {/* Section Header */}
          <div className="max-w-3xl mx-auto text-center mb-10">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass-pill border border-[#2468A6]/20 text-[#123B68] text-xs font-extrabold uppercase tracking-widest mb-3">
              <Users className="w-3.5 h-3.5 text-[#2468A6]" />
              <span>Our Organization</span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#123B68] tracking-tight">
              Meet Our Engineering & Leadership Team
            </h2>
            <p className="mt-3 text-sm sm:text-base text-[#64748B] max-w-2xl mx-auto">
              A transparent breakdown of our registered architects, licensed civil engineers, and experienced site supervisors.
            </p>
          </div>

          {/* Reference-Inspired Leadership Spotlight Component */}
          <TeamSpotlight showAllInitially={false} className="py-4 mb-16 rounded-3xl border border-slate-200/50 shadow-sm" />

          {/* EMPLOYEES DETAILS */}
          <div className="space-y-8 animate-in fade-in duration-300">
            {/* Department Filter Pills */}
            <div className="flex flex-wrap items-center justify-center gap-2">
              {departments.map((dept) => (
                <button
                  key={dept}
                  onClick={() => setSelectedDept(dept)}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all ${
                    selectedDept === dept
                      ? 'bg-[#123B68] text-white shadow-xs'
                      : 'bg-white/80 text-[#64748B] hover:bg-white border border-slate-200/60'
                  }`}
                >
                  {dept === 'all' ? 'All Roles' : dept}
                </button>
              ))}
            </div>

              {/* Employees Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
                {filteredEmployees.map((emp) => (
                  <div
                    key={emp.id}
                    className="glass-panel glass-panel-hover rounded-3xl p-7 flex flex-col justify-between group relative overflow-hidden"
                  >
                    <div>
                      {/* Top Header Card with Circular Portrait (Reference Image Style) */}
                      <div className="flex items-start justify-between gap-4 mb-5">
                        <div className="relative">
                          <div className="w-20 h-20 sm:w-22 sm:h-22 rounded-full overflow-hidden border-2 border-white shadow-md group-hover:scale-105 transition-transform duration-500 bg-slate-100">
                            <img
                              src={emp.image}
                              alt={emp.name}
                              className="w-full h-full object-cover object-top"
                              loading="lazy"
                            />
                          </div>
                        </div>
                      </div>

                      <h3 className="text-xl font-extrabold text-[#123B68] group-hover:text-[#2468A6] transition-colors">
                        {emp.name}
                      </h3>

                      <p className="text-xs font-bold text-[#2468A6] mt-0.5">
                        {emp.role}
                      </p>

                      <div className="mt-3 flex flex-wrap gap-2 text-[11px] font-medium text-[#64748B]">
                        <span className="inline-flex items-center gap-1 bg-slate-100/80 px-2.5 py-1 rounded-lg">
                          <Building className="w-3 h-3 text-[#2468A6]" />
                          {emp.qualification}
                        </span>
                        <span className="inline-flex items-center gap-1 bg-slate-100/80 px-2.5 py-1 rounded-lg">
                          <MapPin className="w-3 h-3 text-[#2468A6]" />
                          {emp.location}
                        </span>
                      </div>

                      {/* Personal Quote */}
                      {emp.quote && (
                        <p className="text-[11px] italic text-slate-600 mt-3.5 bg-slate-50/80 p-2.5 rounded-xl border-l-2 border-[#2468A6] leading-relaxed">
                          "{emp.quote}"
                        </p>
                      )}

                      <p className="text-xs text-[#64748B] mt-3.5 leading-relaxed font-normal">
                        {emp.bio}
                      </p>

                      {/* Key Responsibilities */}
                      <div className="mt-5 pt-4 border-t border-slate-200/60 space-y-2">
                        <p className="text-[11px] font-extrabold uppercase tracking-wider text-[#123B68]">
                          Key On-Site Responsibilities:
                        </p>
                        {(emp.responsibilities || []).map((resp, i) => (
                          <div key={i} className="flex items-start gap-2 text-xs text-[#1E293B]">
                            <CheckCircle2 className="w-3.5 h-3.5 text-[#2468A6] mt-0.5 shrink-0" />
                            <span>{resp}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      {/* Specialization Badge */}
                      <div className="mt-6 pt-4 border-t border-slate-200/60">
                        <p className="text-[10px] font-extrabold uppercase tracking-wider text-[#64748B]">
                          Specialization Area
                        </p>
                        <p className="text-xs font-bold text-[#123B68] mt-0.5">
                          {emp.specialization}
                        </p>
                      </div>

                      {/* Social/Direct Contact Links */}
                      <div className="flex items-center gap-2 mt-4 pt-3 border-t border-slate-200/50">
                        {emp.socials?.linkedin && (
                          <a
                            href={emp.socials.linkedin}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-1.5 rounded-lg bg-slate-100/80 text-slate-500 hover:text-[#123B68] hover:bg-white transition-colors"
                            title="LinkedIn"
                          >
                            <LinkedInIcon className="w-3.5 h-3.5" />
                          </a>
                        )}
                        {emp.socials?.email && (
                          <a
                            href={`mailto:${emp.socials.email}`}
                            className="p-1.5 rounded-lg bg-slate-100/80 text-slate-500 hover:text-[#2468A6] hover:bg-white transition-colors"
                            title="Email"
                          >
                            <Mail className="w-3.5 h-3.5" />
                          </a>
                        )}
                        {emp.socials?.phone && (
                          <a
                            href={`tel:${emp.socials.phone}`}
                            className="p-1.5 rounded-lg bg-slate-100/80 text-slate-500 hover:text-emerald-600 hover:bg-white transition-colors"
                            title="Direct Phone"
                          >
                            <Phone className="w-3.5 h-3.5" />
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
        </div>

        {/* Bottom CTA Banner */}
        <div className="glass-panel rounded-3xl p-8 sm:p-12 text-center relative overflow-hidden">
          <h3 className="text-2xl sm:text-3xl font-extrabold text-[#123B68]">
            Ready to Plan Your Next Construction Project?
          </h3>
          <p className="text-sm text-[#64748B] max-w-xl mx-auto mt-2 mb-6">
            Meet with our structural engineers and architectural designers in Tuticorin or Tirunelveli for a transparent plan and cost estimate.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <button
              type="button"
              onClick={onOpenQuote}
              className="px-8 py-3.5 rounded-2xl bg-gradient-to-r from-[#123B68] to-[#2468A6] hover:from-[#0E2E52] hover:to-[#1E588D] text-white font-bold text-sm shadow-[0_8px_25px_rgba(36,104,166,0.35)] hover:scale-102 transition-all duration-200"
            >
              Request Free Consultation
            </button>
            <Link
              to="/contact"
              className="px-8 py-3.5 rounded-2xl bg-white/80 hover:bg-white text-[#123B68] font-bold text-sm border border-slate-200/80 shadow-2xs transition-all"
            >
              View Office Locations
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
