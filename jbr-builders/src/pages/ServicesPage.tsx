import React, { useState, useEffect } from 'react';
import {
  Home,
  Building2,
  Compass,
  Wrench,
  ClipboardCheck,
  KeyRound,
  ArrowRight,
  CheckCircle2,
  Sparkles,
  ChevronRight,
  ShieldCheck,
  Calendar,
  Layers,
  FileText,
  Phone,
  MessageCircle,
  HardHat,
  Award,
  Zap,
  Star,
  ChevronLeft,
} from 'lucide-react';
import { PROPOSED_SERVICES } from '../data/services';
import { COMPANY_INFO } from '../data/company';
import { useCMS } from '../context/CMSContext';
import { Link } from 'react-router-dom';
import { SEOHead } from '../components/SEOHead';
import { StructuredData } from '../components/StructuredData';
import { getBreadcrumbSchema } from '../seo/structured-data';

interface ServicesPageProps {
  onSelectService: (serviceName: string) => void;
}

const SERVICE_VISUAL_MAP: Record<string, { image: string; category: string; badge: string; highlight: string }> = {
  'residential-construction': {
    image: '/images/service/residentialconstruction.png',
    category: 'residential',
    badge: 'Custom Villas & Residences',
    highlight: '100% Civil Supervised',
  },
  'commercial-construction': {
    image: '/images/service/commercialconstruction.png',
    category: 'commercial',
    badge: 'Offices & Retail Hubs',
    highlight: 'IS Code Seismic RCC',
  },
  'building-planning-design': {
    image: '/images/service/buildingplanning-design.png',
    category: 'planning',
    badge: 'Architecture & 3D Elevations',
    highlight: 'Photorealistic Facades',
  },
  'renovation-remodeling': {
    image: '/images/service/renovationremodeling.png',
    category: 'turnkey',
    badge: 'Before & After Modernization',
    highlight: 'Structural Restoration',
  },
  'project-management': {
    image: '/images/service/projectmanagement.png',
    category: 'turnkey',
    badge: 'Quality & Site Coordination',
    highlight: 'Weekly Progress Audits',
  },
  'turnkey-solutions': {
    image: '/images/service/turnkeyprojecthandover-atsunset.png',
    category: 'turnkey',
    badge: 'Soil to Key Handover',
    highlight: 'Zero-Stress Execution',
  },
};

export const ServicesPage: React.FC<ServicesPageProps> = ({ onSelectService }) => {
  const { services } = useCMS();
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [activeRoadmapStep, setActiveRoadmapStep] = useState<number>(2);
  const [isAutoRotating, setIsAutoRotating] = useState<boolean>(true);

  // Smooth continuous circular orbit rotation
  useEffect(() => {
    if (!isAutoRotating) return;
    const interval = setInterval(() => {
      setActiveRoadmapStep((prev) => (prev + 1) % 5);
    }, 3800);
    return () => clearInterval(interval);
  }, [isAutoRotating]);

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

  const filteredServices = currentServices.filter((service) => {
    if (activeCategory === 'all') return true;
    const meta = SERVICE_VISUAL_MAP[service.id];
    return meta ? meta.category === activeCategory : true;
  });

  const categories = [
    { id: 'all', label: 'All Capabilities' },
    { id: 'residential', label: 'Residential & Villas' },
    { id: 'commercial', label: 'Commercial & Retail' },
    { id: 'planning', label: 'Architectural Planning & 3D' },
    { id: 'turnkey', label: 'Turnkey & Management' },
  ];

  const workflowRoadmap = [
    {
      step: '01',
      phase: 'Site & Soil Discovery',
      title: 'Geotechnical Soil Test & Vaastu Orientation',
      desc: 'Laboratory soil bearing capacity tests, boundary surveying, natural wind-flow analysis, and family lifestyle spatial mapping.',
      deliverable: 'Soil Bearing Report & Preliminary Layout',
    },
    {
      step: '02',
      phase: 'Precision Architecture',
      title: '3D Elevation & IS-Code Structural Engineering',
      desc: 'Photorealistic daylight and twilight facade renderings paired with licensed RCC frame structural blueprints conforming to IS 456 & IS 1893.',
      deliverable: 'Complete 3D Walkthrough & Municipal Blueprints',
    },
    {
      step: '03',
      phase: 'Transparent Contracting',
      title: 'Itemized BOQ & Locked Material Specifications',
      desc: 'Line-by-line Bills of Quantities declaring exact primary TMT steel grades (Fe-550D), 53-grade cement brands, and milestone dates with zero hidden escalations.',
      deliverable: 'Fixed Price Contract & Milestone Schedule',
    },
    {
      step: '04',
      phase: 'Disciplined Execution',
      title: 'Licensed Site Supervision & Concrete Cube Testing',
      desc: 'Daily civil engineer presence on site. Rigid checks on reinforcement rebar spacing, shuttering plumb lines, concrete slump, and 21-day continuous pond curing.',
      deliverable: 'Weekly Digital WhatsApp Progress Logs',
    },
    {
      step: '05',
      phase: 'Quality Handover',
      title: 'Snag Verification & Ceremonial Key Delivery',
      desc: 'Comprehensive electrical load testing, plumbing pressure checks, tile alignment audit, formal completion certificates, and celebratory key handover.',
      deliverable: 'Turnkey Key Delivery & Maintenance Guide',
    },
  ];

  const handleDirectWhatsApp = (serviceName?: string) => {
    const text = encodeURIComponent(
      `Hello JBR Builders,\nI would like to inquire about your ${serviceName || 'civil construction'} services in Tuticorin / Tirunelveli.\n\nProject Type:\nPlot Location:\nExpected Built-up Area:`
    );
    window.open(`https://wa.me/${COMPANY_INFO.whatsappNumber}?text=${text}`, '_blank');
  };

  return (
    <div className="pt-24 sm:pt-28 pb-20 relative overflow-hidden blueprint-grid">
      {/* Ambient background glows */}
      <div className="absolute top-20 -right-40 w-96 h-96 bg-[#2468A6]/14 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute top-1/2 -left-40 w-[500px] h-[500px] bg-[#123B68]/12 rounded-full blur-[140px] pointer-events-none" />

      <div className="container-custom relative z-10">
        {/* Breadcrumb Navigation */}
        <div className="flex items-center gap-2 text-xs font-bold text-[#64748B] mb-6">
          <Link to="/" className="hover:text-[#123B68] transition-colors">Home</Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-[#123B68]">Services & Engineering Scope</span>
        </div>

        {/* Page Hero Header */}
        <div className="max-w-4xl mx-auto text-center mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/80 border border-[#2468A6]/20 shadow-2xs text-[#123B68] text-xs font-extrabold uppercase tracking-widest backdrop-blur-sm mb-4">
            <Compass className="w-3.5 h-3.5 text-[#2468A6]" />
            <span>Licensed Civil Practice & Turnkey Contracting</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-[#123B68] tracking-tight leading-[1.15]">
            Engineering & Construction Solutions <br className="hidden sm:inline" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#2468A6] via-[#123B68] to-[#0E2E52]">
              Engineered For Generations
            </span>
          </h1>

          <p className="mt-5 text-base sm:text-lg text-[#64748B] max-w-2xl mx-auto leading-relaxed">
            From modern individual residential villas to commercial complexes, we offer licensed civil engineering supervision, photorealistic 3D elevations, and complete turnkey contracts across Tuticorin, Tirunelveli, and southern Tamil Nadu.
          </p>

          {/* Core Trust Badges Row */}
          <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 pt-6 mt-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/80 border border-slate-200/80 text-[11px] sm:text-xs font-bold text-[#123B68] shadow-2xs">
              <ShieldCheck className="w-3.5 h-3.5 text-[#2468A6]" />
              <span>100% Civil Engineering Supervision</span>
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/80 border border-slate-200/80 text-[11px] sm:text-xs font-bold text-[#123B68] shadow-2xs">
              <FileText className="w-3.5 h-3.5 text-[#2468A6]" />
              <span>Transparent Itemized BOQ</span>
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/80 border border-slate-200/80 text-[11px] sm:text-xs font-bold text-[#123B68] shadow-2xs">
              <Award className="w-3.5 h-3.5 text-[#2468A6]" />
              <span>IS 456 & IS 1893 Seismic Standards</span>
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/80 border border-slate-200/80 text-[11px] sm:text-xs font-bold text-[#123B68] shadow-2xs">
              <Calendar className="w-3.5 h-3.5 text-[#2468A6]" />
              <span>SLA-Backed Milestone Delivery</span>
            </span>
          </div>
        </div>

        {/* Flagship Turnkey Hero Bento Banner */}
        <div className="glass-panel rounded-3xl p-6 sm:p-10 mb-16 relative overflow-hidden group border border-[#2468A6]/25 shadow-lg">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Left Content */}
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#2468A6]/10 text-[#2468A6] text-xs font-black uppercase tracking-wider">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Our Flagship Offering</span>
              </div>

              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#123B68] tracking-tight leading-snug">
                Complete Turnkey Construction: <br className="hidden sm:inline" />
                <span className="text-[#2468A6]">Single-Point Accountability from Soil to Keys</span>
              </h2>

              <p className="text-sm sm:text-base text-[#64748B] leading-relaxed">
                Experience completely stress-free building. We oversee everything: soil testing, 3D architectural facade renders, municipal approval drawings, reinforced concrete execution, electrical, plumbing, premium woodwork, and celebratory key handover.
              </p>

              {/* Feature Pills */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <div className="flex items-center gap-2.5 text-xs text-[#1E293B] font-semibold bg-white/70 backdrop-blur-sm p-2.5 rounded-xl border border-white/80 shadow-2xs">
                  <CheckCircle2 className="w-4 h-4 text-[#2468A6] shrink-0" />
                  <span>Zero contractor blame games</span>
                </div>
                <div className="flex items-center gap-2.5 text-xs text-[#1E293B] font-semibold bg-white/70 backdrop-blur-sm p-2.5 rounded-xl border border-white/80 shadow-2xs">
                  <CheckCircle2 className="w-4 h-4 text-[#2468A6] shrink-0" />
                  <span>Locked BOQ with no price escalation</span>
                </div>
                <div className="flex items-center gap-2.5 text-xs text-[#1E293B] font-semibold bg-white/70 backdrop-blur-sm p-2.5 rounded-xl border border-white/80 shadow-2xs">
                  <CheckCircle2 className="w-4 h-4 text-[#2468A6] shrink-0" />
                  <span>Weekly digital photo progress logs</span>
                </div>
                <div className="flex items-center gap-2.5 text-xs text-[#1E293B] font-semibold bg-white/70 backdrop-blur-sm p-2.5 rounded-xl border border-white/80 shadow-2xs">
                  <CheckCircle2 className="w-4 h-4 text-[#2468A6] shrink-0" />
                  <span>SLA-backed ceremonial key handover</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-3.5 pt-3">
                <button
                  type="button"
                  onClick={() => onSelectService('Turnkey Construction Solutions')}
                  className="px-6 py-3.5 rounded-full bg-gradient-to-r from-[#123B68] to-[#2468A6] hover:from-[#0E2E52] hover:to-[#1E588D] text-white text-xs sm:text-sm font-bold shadow-md hover:shadow-lg transition-all flex items-center gap-2 cursor-pointer"
                >
                  <span>Plan Your Turnkey Project</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => handleDirectWhatsApp('Turnkey Construction')}
                  className="px-5 py-3.5 rounded-full bg-white/80 hover:bg-white text-[#123B68] text-xs sm:text-sm font-bold border border-slate-200/80 shadow-2xs hover:shadow-sm transition-all flex items-center gap-2 cursor-pointer"
                >
                  <MessageCircle className="w-4 h-4 text-emerald-600" />
                  <span>WhatsApp Consultant</span>
                </button>
              </div>
            </div>

            {/* Right Visual Feature: Turnkey Handover at Sunset */}
            <div className="lg:col-span-5 relative">
              <div className="relative aspect-[4/3] rounded-3xl overflow-hidden shadow-2xl border border-white/70 bg-slate-900 group/img">
                <img
                  src="/images/service/turnkeyprojecthandover-atsunset.png"
                  alt="Turnkey construction key handover at sunset by JBR Builders"
                  className="w-full h-full object-cover transform transition-transform duration-700 group-hover/img:scale-106"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0B2544]/85 via-[#0B2544]/20 to-transparent" />
                <div className="absolute top-3 left-3 px-3 py-1 rounded-full bg-slate-900/85 backdrop-blur-md border border-white/20 text-white text-[11px] font-bold flex items-center gap-1.5 shadow-md">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span>Delivered On Schedule</span>
                </div>
                <div className="absolute bottom-3 inset-x-3 p-3.5 rounded-2xl bg-white/15 backdrop-blur-md border border-white/25 text-white">
                  <span className="text-[10px] font-extrabold uppercase tracking-widest text-cyan-300">Verified Milestone</span>
                  <h4 className="text-sm font-bold text-white mt-0.5">Turnkey Handover Ceremony at Sunset</h4>
                  <p className="text-xs text-slate-200 mt-0.5">Tuticorin & Tirunelveli turnkey deliverables</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Category Navigation Pills */}
        <div className="mb-10">
          <div className="flex items-center justify-between flex-wrap gap-4 border-b border-slate-200/60 pb-5">
            <div>
              <h3 className="text-xl sm:text-2xl font-extrabold text-[#123B68]">
                Explore All Civil Services
              </h3>
              <p className="text-xs sm:text-sm text-[#64748B] mt-0.5">
                Select a capability to review technical specifications and engineering inclusions.
              </p>
            </div>

            {/* Category Filter Pills */}
            <div className="flex flex-wrap gap-2">
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setActiveCategory(cat.id)}
                  className={`px-4 py-2 rounded-full text-xs font-bold transition-all duration-200 cursor-pointer ${
                    activeCategory === cat.id
                      ? 'bg-gradient-to-r from-[#123B68] to-[#2468A6] text-white shadow-md'
                      : 'bg-white/80 hover:bg-white text-[#64748B] hover:text-[#123B68] border border-slate-200/80'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Detailed Services Grid with High-End Architectural Photography */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-24 items-stretch">
          {filteredServices.map((service, index) => {
            const meta = SERVICE_VISUAL_MAP[service.id] || {
              image: '/images/gallery/1.jpeg',
              category: 'residential',
              badge: 'Civil Engineering',
              highlight: 'Standard Specification',
            };

            return (
              <div
                key={service.id}
                className="glass-panel glass-panel-hover rounded-3xl overflow-hidden flex flex-col justify-between group border border-[#2468A6]/25 shadow-md transition-all duration-300"
              >
                <div>
                  {/* Service Card Top Image Banner */}
                  <div className="relative aspect-[16/10] overflow-hidden bg-slate-900">
                    <img
                      src={meta.image}
                      alt={service.title}
                      className="w-full h-full object-cover transform transition-transform duration-700 ease-out group-hover:scale-108"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0B2544]/90 via-[#0B2544]/30 to-transparent" />

                    {/* Top Floating Badge */}
                    <div className="absolute top-3 inset-x-3 flex items-center justify-between">
                      <span className="px-3 py-1 rounded-full bg-slate-900/80 backdrop-blur-md border border-white/20 text-white text-[10px] font-black uppercase tracking-wider">
                        {meta.badge}
                      </span>
                      <span className="px-2.5 py-0.5 rounded-full bg-cyan-400/20 backdrop-blur-md border border-cyan-400/30 text-cyan-200 text-[10px] font-bold">
                        {meta.highlight}
                      </span>
                    </div>

                    {/* Floating Service Icon on Bottom Corner of Image */}
                    <div className="absolute bottom-3 left-4 flex items-center gap-3">
                      <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#123B68] to-[#2468A6] text-white flex items-center justify-center shadow-lg border border-white/30 shrink-0">
                        {getIcon(service.iconName)}
                      </div>
                      <span className="text-white text-xs font-black uppercase tracking-widest opacity-90 drop-shadow-md">
                        Scope 0{index + 1}
                      </span>
                    </div>
                  </div>

                  {/* Card Content */}
                  <div className="p-6 sm:p-7 space-y-4">
                    <h3 className="text-xl sm:text-2xl font-extrabold text-[#123B68] group-hover:text-[#2468A6] transition-colors tracking-tight">
                      {service.title}
                    </h3>

                    <p className="text-xs sm:text-sm text-[#64748B] leading-relaxed">
                      {service.description}
                    </p>

                    {/* Scope Feature Items */}
                    <div className="pt-4 border-t border-slate-200/60 space-y-2.5">
                      <p className="text-[11px] font-black uppercase tracking-wider text-[#123B68]">
                        Technical Inclusions & Deliverables:
                      </p>
                      {service.features.map((feature, idx) => (
                        <div key={idx} className="flex items-start gap-2.5 text-xs text-[#1E293B]">
                          <CheckCircle2 className="w-4 h-4 text-[#2468A6] mt-0.5 shrink-0" />
                          <span className="leading-snug">{feature}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Card Action Buttons */}
                <div className="p-6 sm:p-7 pt-0 space-y-2.5">
                  <button
                    type="button"
                    onClick={() => onSelectService(service.title)}
                    className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-[#123B68] to-[#2468A6] hover:from-[#0E2E52] hover:to-[#1E588D] text-white font-bold text-xs sm:text-sm shadow-sm hover:shadow-md transition-all flex items-center justify-center gap-2 group/btn cursor-pointer"
                  >
                    <span>Request BOQ & Exact Quote</span>
                    <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                  </button>

                  <button
                    type="button"
                    onClick={() => handleDirectWhatsApp(service.title)}
                    className="w-full py-2.5 px-4 rounded-xl bg-white/70 hover:bg-white text-[#123B68] font-bold text-xs border border-slate-200/80 shadow-2xs transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <MessageCircle className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Inquire via WhatsApp</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Standardized 5-Stage Execution Methodology 3D Arc Showcase (Matching Reference Image 2) */}
        <div className="rounded-3xl sm:rounded-[36px] p-6 sm:p-10 lg:p-12 mb-20 relative overflow-hidden border border-sky-300/40 shadow-2xl bg-[#0284c7] select-none">
          {/* Photorealistic Sky Panorama Background */}
          <div
            className="absolute inset-0 bg-cover bg-center pointer-events-none opacity-95 transition-opacity"
            style={{ backgroundImage: `url('/images/sky-clouds-panorama.jpg')` }}
          />
          {/* Subtle atmospheric vignette & depth gradients */}
          <div className="absolute inset-0 bg-gradient-to-b from-sky-900/40 via-transparent to-sky-950/45 pointer-events-none" />

          {/* Section Header */}
          <div className="text-center max-w-3xl mx-auto mb-8 relative z-10">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/90 border border-white/60 shadow-md text-[#123B68] text-xs font-black uppercase tracking-widest backdrop-blur-md mb-3">
              <HardHat className="w-3.5 h-3.5 text-[#2468A6]" />
              <span>Standardized Quality Protocol</span>
            </div>
            <h2 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight drop-shadow-[0_2px_12px_rgba(0,0,0,0.4)]">
              How We Execute Every Construction Milestone
            </h2>
            <p className="text-xs sm:text-sm text-sky-100/95 mt-2 max-w-xl mx-auto drop-shadow-[0_1px_4px_rgba(0,0,0,0.3)] font-medium">
              Our 5-stage civil methodology guarantees structural safety, locked pricing, and on-schedule ceremonial key handover.
            </p>
          </div>

          {/* Step Selector Pills for Quick Jumping */}
          <div className="flex items-center justify-center gap-2 sm:gap-2.5 mb-6 relative z-20 flex-wrap">
            {workflowRoadmap.map((wf, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setActiveRoadmapStep(idx)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all duration-300 flex items-center gap-1.5 cursor-pointer backdrop-blur-md ${
                  activeRoadmapStep === idx
                    ? 'bg-white text-[#123B68] shadow-lg scale-105 font-extrabold'
                    : 'bg-white/25 hover:bg-white/40 text-white border border-white/30 shadow-2xs'
                }`}
              >
                <span className="text-[10px] opacity-80">{wf.step}</span>
                <span>{wf.phase}</span>
              </button>
            ))}
          </div>

          {/* 3D Circular Orbit Carousel Container (Continuous Revolving Process Matching Image 2) */}
          <div
            onMouseEnter={() => setIsAutoRotating(false)}
            onMouseLeave={() => setIsAutoRotating(true)}
            className="relative h-[430px] sm:h-[450px] w-full flex items-center justify-center perspective-[1100px] select-none py-2"
          >
            {/* The 3D Circular Orbit Cards */}
            <div className="relative w-full h-full flex items-center justify-center">
              {workflowRoadmap.map((wf, idx) => {
                const total = 5;
                let diff = (idx - activeRoadmapStep) % total;
                if (diff > total / 2) diff -= total;
                if (diff < -total / 2) diff += total;

                const isActive = diff === 0;

                // Calibrated circular orbit geometry to fit within viewport with zero clipping
                const angleDeg = diff * 28; // 28 degrees step angle
                const angleRad = (angleDeg * Math.PI) / 180;
                const radius = 290; // compact cylinder radius (720px total maximum span)

                const translateX = Math.sin(angleRad) * radius;
                const translateZ = (Math.cos(angleRad) - 1) * 160; // curves back into depth
                const translateY = Math.abs(diff) * 10;
                const rotateY = -angleDeg * 0.85;
                const scale = isActive ? 1.04 : 1 - Math.abs(diff) * 0.08;
                const zIndex = 30 - Math.abs(diff) * 5;
                const opacity = isActive ? 1 : Math.max(0.70, 1 - Math.abs(diff) * 0.15);

                return (
                  <div
                    key={idx}
                    onClick={() => setActiveRoadmapStep(idx)}
                    style={{
                      position: 'absolute',
                      left: '50%',
                      top: '50%',
                      transform: `translate(-50%, -50%) translateX(${translateX}px) translateZ(${translateZ}px) translateY(${translateY}px) rotateY(${rotateY}deg) scale(${scale})`,
                      zIndex,
                      opacity,
                      transition: 'all 0.65s cubic-bezier(0.16, 1, 0.3, 1)',
                    }}
                    className={`w-[215px] sm:w-[235px] md:w-[245px] h-[320px] sm:h-[340px] shrink-0 p-5 sm:p-6 rounded-3xl cursor-pointer flex flex-col justify-between select-none transition-shadow ${
                      isActive
                        ? 'bg-white shadow-[0_25px_50px_rgba(18,59,104,0.35),0_0_25px_rgba(56,189,248,0.4)] ring-4 ring-sky-300/80 border-2 border-sky-400'
                        : 'bg-white/95 hover:bg-white shadow-xl border border-white/90 hover:border-sky-300'
                    }`}
                  >
                    <div>
                      {/* Top Pill Row */}
                      <div className="flex items-center justify-between mb-3">
                        <span className={`w-8 h-8 rounded-xl font-black text-xs flex items-center justify-center ${
                          isActive ? 'bg-[#123B68] text-white shadow-md' : 'bg-[#2468A6]/10 text-[#2468A6]'
                        }`}>
                          {wf.step}
                        </span>
                        <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#2468A6] px-2.5 py-0.5 rounded-full bg-sky-50 border border-sky-100">
                          {wf.phase}
                        </span>
                      </div>

                      <h4 className="text-sm sm:text-base font-extrabold text-[#123B68] mb-2 leading-snug line-clamp-2">
                        {wf.title}
                      </h4>

                      <p className="text-[11px] sm:text-xs text-[#64748B] leading-relaxed font-normal line-clamp-3">
                        {wf.desc}
                      </p>
                    </div>

                    <div className="mt-4 pt-3 border-t border-slate-100">
                      <span className="block text-[10px] font-black uppercase text-[#2468A6] tracking-wider">
                        Key Deliverable:
                      </span>
                      <p className="text-xs font-bold text-[#1E293B] mt-0.5 leading-snug">
                        {wf.deliverable}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Orbit Navigation Controls (Placed Below Cards So Nothing Is Obscured) */}
          <div className="flex items-center justify-center gap-4 mt-1 relative z-30">
            <button
              type="button"
              onClick={() => setActiveRoadmapStep((prev) => (prev > 0 ? prev - 1 : 4))}
              className="w-10 h-10 rounded-full bg-white/90 hover:bg-white text-[#123B68] shadow-lg border border-white/60 flex items-center justify-center transition-all hover:scale-110 cursor-pointer backdrop-blur-md"
              aria-label="Orbit previous milestone"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-2">
              {workflowRoadmap.map((_, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setActiveRoadmapStep(idx)}
                  className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${
                    activeRoadmapStep === idx
                      ? 'w-7 bg-white shadow-md'
                      : 'w-2 bg-white/50 hover:bg-white/80'
                  }`}
                  aria-label={`Jump to stage ${idx + 1}`}
                />
              ))}
            </div>
            <button
              type="button"
              onClick={() => setActiveRoadmapStep((prev) => (prev + 1) % 5)}
              className="w-10 h-10 rounded-full bg-white/90 hover:bg-white text-[#123B68] shadow-lg border border-white/60 flex items-center justify-center transition-all hover:scale-110 cursor-pointer backdrop-blur-md"
              aria-label="Orbit next milestone"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>

          {/* Bottom Rating & Social Proof Matching Reference Image 2 */}
          <div className="text-center mt-5 pt-4 space-y-1.5 relative z-20">
            <p className="text-xs sm:text-sm font-extrabold text-white tracking-tight drop-shadow-[0_2px_8px_rgba(0,0,0,0.35)]">
              Rated 4.9/5 by 120+ Homeowner Families
            </p>
            <div className="flex items-center justify-center gap-1.5 text-amber-300 drop-shadow-[0_2px_6px_rgba(0,0,0,0.35)]">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-4 h-4 fill-amber-300 text-amber-300" />
              ))}
            </div>
            <p className="text-[11px] text-sky-100/90 font-medium drop-shadow-[0_1px_3px_rgba(0,0,0,0.25)]">
              Verified 5-Stage Engineering Protocol • 100% On-Time Turnkey Handover Guarantee
            </p>
          </div>
        </div>

        {/* Quality Standards & Testing Banner */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-20">
          <div className="glass-panel rounded-3xl p-7 flex items-start gap-4 border border-[#2468A6]/20 shadow-md">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#123B68] to-[#2468A6] text-white flex items-center justify-center shrink-0 shadow-sm">
              <ShieldCheck className="w-6 h-6 text-cyan-200" />
            </div>
            <div>
              <h4 className="text-base font-extrabold text-[#123B68]">Certified Material Grades</h4>
              <p className="text-xs text-[#64748B] mt-1.5 leading-relaxed">
                We strictly use 53-grade OPC/PPC cement and Fe-550D TMT reinforcement steel bars from primary manufacturers with authentic batch test certificates.
              </p>
            </div>
          </div>

          <div className="glass-panel rounded-3xl p-7 flex items-start gap-4 border border-[#2468A6]/20 shadow-md">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#2468A6] to-[#0E2E52] text-white flex items-center justify-center shrink-0 shadow-sm">
              <Layers className="w-6 h-6 text-cyan-200" />
            </div>
            <div>
              <h4 className="text-base font-extrabold text-[#123B68]">IS Code Seismic Compliance</h4>
              <p className="text-xs text-[#64748B] mt-1.5 leading-relaxed">
                All structural designs conform strictly to IS 456 (Plain and Reinforced Concrete) and IS 1893/13920 seismic and ductile detailing standards.
              </p>
            </div>
          </div>

          <div className="glass-panel rounded-3xl p-7 flex items-start gap-4 border border-[#2468A6]/20 shadow-md">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#123B68] to-[#2468A6] text-white flex items-center justify-center shrink-0 shadow-sm">
              <Calendar className="w-6 h-6 text-cyan-200" />
            </div>
            <div>
              <h4 className="text-base font-extrabold text-[#123B68]">Guaranteed Timeline SLA</h4>
              <p className="text-xs text-[#64748B] mt-1.5 leading-relaxed">
                Legally binding stage-wise milestones with guaranteed delivery dates and weekly digital WhatsApp photo progress tracking for owners.
              </p>
            </div>
          </div>
        </div>

        {/* Project Estimation Consultation Banner */}
        <div className="rounded-3xl p-8 sm:p-12 text-white relative overflow-hidden shadow-2xl bg-gradient-to-br from-[#0B2544] via-[#123B68] to-[#2468A6]">
          {/* Subtle background decorative blueprint circles */}
          <div className="absolute -right-20 -top-20 w-80 h-80 bg-cyan-400/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -left-20 -bottom-20 w-80 h-80 bg-blue-400/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 max-w-3xl space-y-5">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-cyan-300 text-xs font-black uppercase tracking-wider">
              <Zap className="w-3.5 h-3.5" />
              <span>Ready To Build in Tuticorin or Tirunelveli?</span>
            </div>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight leading-tight">
              Request Your Itemized BOQ & Free Preliminary Layout
            </h2>

            <p className="text-sm sm:text-base text-slate-200 leading-relaxed max-w-2xl">
              Tell us about your plot dimension or architectural dreams. Our licensed civil engineers will prepare a transparent, line-itemized Bill of Quantities with zero obligation.
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-3">
              <button
                type="button"
                onClick={() => onSelectService('General Consultation')}
                className="px-7 py-4 rounded-full bg-white text-[#123B68] hover:bg-cyan-50 font-bold text-sm shadow-lg hover:shadow-xl transition-all flex items-center gap-2 cursor-pointer"
              >
                <span>Request Free Detailed Quote</span>
                <ArrowRight className="w-4 h-4 text-[#2468A6]" />
              </button>

              <button
                type="button"
                onClick={() => handleDirectWhatsApp('General Construction Consultation')}
                className="px-6 py-4 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm shadow-md transition-all flex items-center gap-2 cursor-pointer"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Chat with Senior Engineer</span>
              </button>

              <a
                href={`tel:${COMPANY_INFO.phoneRaw}`}
                className="px-5 py-4 rounded-full bg-white/10 hover:bg-white/20 border border-white/30 text-white font-bold text-sm backdrop-blur-md transition-all flex items-center gap-2"
              >
                <Phone className="w-4 h-4 text-cyan-300" />
                <span>{COMPANY_INFO.phone}</span>
              </a>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
