import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  Sparkles,
  Maximize2,
  MoreHorizontal,
  ChevronLeft,
  ChevronRight,
  MapPin,
  Compass,
  Heart,
  Share2,
  ArrowRight,
  Check,
  Building2
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { GALLERY_PROJECTS } from '../data/projects';
import { useCMS } from '../context/CMSContext';
import type { ProjectItem } from '../types';

interface FeaturedProjectsProps {
  onOpenLightbox?: (index: number) => void;
}

export const FeaturedProjects: React.FC<FeaturedProjectsProps> = ({ onOpenLightbox }) => {
  const { projects: cmsProjects } = useCMS();

  // Connect to the same Firestore collection, excluding unpublished, max 3 projects
  const sourceProjects = React.useMemo(() => {
    const list = cmsProjects && cmsProjects.length > 0 ? cmsProjects : GALLERY_PROJECTS;
    return list.filter((p: any) => p.published !== false).slice(0, 3);
  }, [cmsProjects]);

  const [activeIndex, setActiveIndex] = useState(0);
  const [favorites, setFavorites] = useState<Record<string, boolean>>({});
  const [copiedToast, setCopiedToast] = useState(false);
  const [showSpecsModal, setShowSpecsModal] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const touchStartX = useRef<number | null>(null);

  const total = sourceProjects.length;
  const activeProject = sourceProjects[activeIndex] || sourceProjects[0];

  // Navigation handlers
  const handlePrev = useCallback(() => {
    setActiveIndex((prev) => (prev - 1 + total) % total);
  }, [total]);

  const handleNext = useCallback(() => {
    setActiveIndex((prev) => (prev + 1) % total);
  }, [total]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Only listen when hovering or container is in viewport
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const inView = rect.top < window.innerHeight && rect.bottom > 0;
      if (!inView) return;

      if (e.key === 'ArrowLeft') {
        handlePrev();
      } else if (e.key === 'ArrowRight') {
        handleNext();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handlePrev, handleNext]);

  // Touch swipe support
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const diff = touchStartX.current - e.changedTouches[0].clientX;
    if (diff > 45) {
      handleNext();
    } else if (diff < -45) {
      handlePrev();
    }
    touchStartX.current = null;
  };

  // Toggle favorite
  const toggleFavorite = (projectId: string) => {
    setFavorites((prev) => ({
      ...prev,
      [projectId]: !prev[projectId]
    }));
  };

  // Share action
  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.origin + '/projects#' + activeProject.id);
      setCopiedToast(true);
      setTimeout(() => setCopiedToast(false), 2400);
    }
  };

  // Compute circular offset for 3D coverflow
  const getCardOffset = (index: number) => {
    let diff = index - activeIndex;
    // wrap around
    if (diff > total / 2) diff -= total;
    if (diff < -total / 2) diff += total;
    return diff;
  };

  return (
    <section
      id="projects"
      ref={containerRef}
      className="py-16 lg:py-24 relative overflow-hidden bg-white blueprint-grid text-[#1E293B] select-none"
      aria-label="Latest Projects"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {/* ================= SOFT BLUE ARCHITECTURAL GLOWS ================= */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[850px] h-[580px] bg-[#38BDF8]/12 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute top-1/4 left-0 sm:left-10 w-96 h-96 bg-[#2468A6]/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute top-1/3 right-0 sm:right-10 w-96 h-96 bg-[#38BDF8]/12 rounded-full blur-[120px] pointer-events-none" />

      <div className="container-custom relative z-10">
        {/* ================= SECTION HEADER ================= */}
        <div className="max-w-3xl mx-auto text-center mb-10 sm:mb-12">
          {/* Portfolio Selection Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#EBF4FC] border border-[#2468A6]/20 text-[#123B68] text-xs font-extrabold uppercase tracking-widest mb-3.5 shadow-sm">
            <Sparkles className="w-3.5 h-3.5 text-[#2468A6]" />
            <span>PORTFOLIO SELECTION</span>
          </div>

          {/* Heading */}
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#123B68] tracking-tight">
            Latest Projects
          </h2>

          {/* Subtitle */}
          <p className="mt-3.5 text-base sm:text-lg text-[#64748B] max-w-2xl mx-auto leading-relaxed font-normal">
            Explore the spaces we plan, the structures we build, and the details that bring every project to life.
          </p>

          <div className="w-20 h-1 bg-gradient-to-r from-[#123B68] to-[#2468A6] mx-auto mt-4 rounded-full shadow-sm" />
        </div>

        {/* ================= 3D COVERFLOW STAGE CONTAINER ================= */}
        <div className="relative w-full max-w-5xl mx-auto flex items-center justify-center my-4 sm:my-8 px-2 sm:px-0">
          {/* 3D Perspective Scene */}
          <div
            className="relative w-full h-[520px] sm:h-[580px] md:h-[620px] flex items-center justify-center overflow-visible"
            style={{
              perspective: '1200px',
              perspectiveOrigin: '50% 50%'
            }}
          >
            {sourceProjects.map((project, idx) => {
              const offset = getCardOffset(idx);
              const isCenter = offset === 0;
              const isLeft1 = offset === -1;
              const isRight1 = offset === 1;
              const isLeft2 = offset === -2;
              const isRight2 = offset === 2;
              const isVisible = Math.abs(offset) <= 2;

              if (!isVisible) return null;

              // Dynamic 3D Transform computation - High brightness & crisp visibility
              let transformStyle = '';
              let zIndex = 10;
              let opacity = 0.8;

              if (isCenter) {
                transformStyle = 'translate3d(0, 0, 75px) rotateY(0deg) scale(1)';
                zIndex = 30;
                opacity = 1;
              } else if (isLeft1) {
                transformStyle = 'translate3d(-270px, 0, -40px) rotateY(24deg) scale(0.90)';
                zIndex = 20;
                opacity = 0.98;
              } else if (isRight1) {
                transformStyle = 'translate3d(270px, 0, -40px) rotateY(-24deg) scale(0.90)';
                zIndex = 20;
                opacity = 0.98;
              } else if (isLeft2) {
                transformStyle = 'translate3d(-470px, 0, -110px) rotateY(38deg) scale(0.80)';
                zIndex = 10;
                opacity = 0.88;
              } else if (isRight2) {
                transformStyle = 'translate3d(470px, 0, -110px) rotateY(-38deg) scale(0.80)';
                zIndex = 10;
                opacity = 0.88;
              }

              return (
                <div
                  key={project.id}
                  onClick={() => {
                    if (!isCenter) {
                      setActiveIndex(idx);
                    }
                  }}
                  className={`absolute top-0 bottom-0 m-auto w-[290px] sm:w-[350px] md:w-[410px] h-[480px] sm:h-[540px] md:h-[570px] rounded-[32px] overflow-hidden transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                    isCenter
                      ? 'cursor-default'
                      : 'cursor-pointer hover:opacity-100 hover:scale-[1.02]'
                  }`}
                  style={{
                    transform: transformStyle,
                    zIndex,
                    opacity,
                    border: isCenter ? '2px solid rgba(255,255,255,0.75)' : '1.5px solid rgba(255,255,255,0.45)',
                    boxShadow: isCenter
                      ? '0 30px 75px rgba(0,0,0,0.65), 0 0 50px rgba(56,189,248,0.4), inset 0 1px 0 rgba(255,255,255,0.9)'
                      : '0 20px 45px rgba(0,0,0,0.55), 0 0 25px rgba(255,255,255,0.1), inset 0 1px 0 rgba(255,255,255,0.6)',
                    backdropFilter: 'blur(20px)',
                    WebkitBackdropFilter: 'blur(20px)',
                    transformStyle: 'preserve-3d'
                  }}
                >
                  {/* High Quality Background Architectural Photo - Bright & Sharp */}
                  <img
                    src={project.imageSrc}
                    alt={project.title}
                    className="w-full h-full object-cover object-center select-none brightness-110 contrast-105"
                    loading="lazy"
                  />

                  {/* Bright Specular Glass Rim Highlight */}
                  <div className="absolute inset-0 rounded-[32px] pointer-events-none ring-1 ring-inset ring-white/50" />

                  {/* Localized Bottom Gradient Only Behind Text (Upper 55% stays crystal bright) */}
                  <div className="absolute bottom-0 inset-x-0 h-[48%] bg-gradient-to-t from-slate-950/92 via-slate-950/50 to-transparent pointer-events-none" />

                  {/* ================= ACTIVE CENTER CARD CONTENT ================= */}
                  {isCenter ? (
                    <div className="absolute inset-0 p-5 sm:p-7 flex flex-col justify-between text-white z-20">
                      {/* Top Controls inside Card */}
                      <div className="flex items-center justify-between">
                        {/* Expand Button */}
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            if (onOpenLightbox) {
                              onOpenLightbox(idx);
                            }
                          }}
                          className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-white/20 backdrop-blur-xl border border-white/60 text-white text-xs font-bold hover:bg-white/35 transition-all cursor-pointer shadow-xl hover:scale-105"
                          title="Expand Full Lightbox"
                        >
                          <Maximize2 className="w-3.5 h-3.5 text-cyan-300" />
                          <span>Expand</span>
                        </button>

                        {/* More Details Button */}
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setShowSpecsModal(!showSpecsModal);
                          }}
                          className="p-2 rounded-full bg-white/20 backdrop-blur-xl border border-white/60 text-white hover:bg-white/35 transition-all cursor-pointer shadow-xl hover:scale-105"
                          title="Project Details"
                        >
                          <MoreHorizontal className="w-4 h-4" />
                        </button>
                      </div>

                      {/* Bottom Info Section */}
                      <div className="space-y-3 pt-4">
                        {/* Category & Slide Counter */}
                        <div className="flex items-center justify-between text-xs">
                          <span className="px-3.5 py-1 rounded-full bg-cyan-500/35 backdrop-blur-md border border-cyan-300 text-cyan-100 font-extrabold uppercase tracking-wider text-[11px] shadow-sm">
                            {project.category}
                          </span>
                          <span className="font-mono font-bold tracking-wider text-white bg-black/50 backdrop-blur-md px-3 py-0.5 rounded-full border border-white/40 shadow-sm">
                            {idx + 1} / {total}
                          </span>
                        </div>

                        {/* Project Title */}
                        <h3 className="font-extrabold text-xl sm:text-2xl tracking-tight text-white leading-tight drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]">
                          {project.title}
                        </h3>

                        {/* Description */}
                        <p className="text-xs sm:text-sm text-slate-100 leading-relaxed line-clamp-3 font-medium drop-shadow">
                          {project.description}
                        </p>

                        {/* Address & Coordinates Row */}
                        <div className="pt-2 border-t border-white/25 space-y-1.5 text-xs text-slate-200">
                          {(project as any).address && (
                            <div className="flex items-start gap-1.5">
                              <MapPin className="w-3.5 h-3.5 text-cyan-300 shrink-0 mt-0.5" />
                              <span className="truncate font-medium">{(project as any).address}</span>
                            </div>
                          )}

                          <div className="flex items-center justify-between text-[11px] text-cyan-200 font-mono">
                            <span className="flex items-center gap-1 font-semibold">
                              <Compass className="w-3 h-3 text-cyan-300" />
                              {(project as any).coordinates || '8.7642° N, 78.1348° E'}
                            </span>
                            {(project as any).specs && (
                              <span className="text-amber-300 font-sans font-semibold text-[11px]">
                                {(project as any).specs}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    /* ================= SIDE CARD PREVIEW CONTENT ================= */
                    <div className="absolute inset-x-0 bottom-0 p-5 bg-gradient-to-t from-black/85 via-black/40 to-transparent text-white">
                      <h4 className="text-base sm:text-lg font-bold tracking-tight text-white drop-shadow-md truncate">
                        {project.title}
                      </h4>
                      <p className="text-xs text-cyan-200 font-medium truncate mt-0.5">
                        {project.location || 'Tamil Nadu'}
                      </p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* ================= ARCHITECTURAL PEDESTAL & PLINTH BASE ================= */}
        <div className="relative w-full max-w-2xl mx-auto -mt-6 sm:-mt-8 flex justify-center">
          <div className="w-full h-7 sm:h-9 rounded-[28px] bg-gradient-to-b from-slate-200 via-slate-100 to-white border-t border-slate-300 shadow-[0_15px_35px_rgba(18,59,104,0.08)] backdrop-blur-xl" />
        </div>

        {/* ================= BOTTOM FLOATING SPATIAL MEDIA PILL ================= */}
        <div className="flex justify-center mt-6 sm:mt-7">
          <div className="inline-flex items-center gap-3 sm:gap-4 px-4 sm:px-5 py-2.5 rounded-full bg-white/95 backdrop-blur-2xl border border-slate-200/90 shadow-[0_15px_35px_rgba(18,59,104,0.12)] text-[#1E293B]">
            {/* Left Chevron Button */}
            <button
              onClick={handlePrev}
              title="Previous Project"
              aria-label="Previous Project"
              className="w-8 h-8 rounded-full bg-[#EBF4FC] hover:bg-[#E0EFFC] flex items-center justify-center text-[#123B68] transition-all cursor-pointer hover:scale-105 active:scale-95 border border-[#2468A6]/20"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            {/* Glowing Avatar Thumbnail of Active Project */}
            <div className="relative w-9 h-9 sm:w-10 sm:h-10 rounded-full overflow-hidden ring-2 ring-[#2468A6] shadow-[0_0_15px_rgba(36,104,166,0.25)] shrink-0">
              <img
                src={activeProject.imageSrc}
                alt={activeProject.title}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Active Project Title & Subtitle */}
            <div className="text-left max-w-[140px] sm:max-w-[200px]">
              <div className="text-xs sm:text-sm font-bold text-[#123B68] truncate">
                {activeProject.title}
              </div>
              <div className="text-[10px] sm:text-[11px] text-[#2468A6] truncate font-medium">
                {activeProject.location || 'Tuticorin, Tamil Nadu'} • Landmark Excellence
              </div>
            </div>

            {/* Heart Favorite Button */}
            <button
              onClick={() => toggleFavorite(activeProject.id)}
              title={favorites[activeProject.id] ? 'Favorited' : 'Favorite'}
              className="p-1.5 rounded-full hover:bg-slate-100 transition-all cursor-pointer"
            >
              <Heart
                className={`w-4 h-4 transition-transform active:scale-125 ${
                  favorites[activeProject.id] ? 'fill-red-500 text-red-500' : 'text-slate-400 hover:text-red-400'
                }`}
              />
            </button>

            {/* Right Chevron Button */}
            <button
              onClick={handleNext}
              title="Next Project"
              aria-label="Next Project"
              className="w-8 h-8 rounded-full bg-[#EBF4FC] hover:bg-[#E0EFFC] flex items-center justify-center text-[#123B68] transition-all cursor-pointer hover:scale-105 active:scale-95 border border-[#2468A6]/20"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* ================= PAGINATION DOTS INDICATOR ================= */}
        <div className="flex items-center justify-center gap-2 mt-5">
          {sourceProjects.map((_, dotIdx) => {
            const isActive = dotIdx === activeIndex;
            return (
              <button
                key={dotIdx}
                onClick={() => setActiveIndex(dotIdx)}
                title={`Jump to project ${dotIdx + 1}`}
                aria-label={`Go to project slide ${dotIdx + 1}`}
                className={`transition-all duration-300 rounded-full cursor-pointer ${
                  isActive
                    ? 'w-7 h-1.5 bg-[#2468A6] shadow-[0_0_12px_rgba(36,104,166,0.6)]'
                    : 'w-1.5 h-1.5 bg-slate-300 hover:bg-slate-400'
                }`}
              />
            );
          })}
        </div>

        {/* ================= VIEW ALL PROJECTS BUTTON ================= */}
        <div className="mt-12 text-center">
          <Link
            to="/projects"
            className="inline-flex items-center gap-2.5 px-8 py-3.5 rounded-full bg-gradient-to-r from-[#123B68] to-[#2468A6] hover:from-[#0E2E52] hover:to-[#1E588D] text-white text-sm font-bold shadow-[0_8px_25px_rgba(36,104,166,0.45)] hover:scale-102 transition-all duration-200 border border-white/20"
          >
            <span>Explore Full Project Portfolio</span>
            <ArrowRight className="w-4 h-4 text-cyan-200" />
          </Link>
        </div>
      </div>

      {/* ================= SPECS MODAL OVERLAY ================= */}
      {showSpecsModal && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-fadeIn"
          onClick={() => setShowSpecsModal(false)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="max-w-md w-full rounded-3xl bg-slate-900/90 border border-white/25 p-6 text-white shadow-2xl space-y-4"
          >
            <div className="flex items-center justify-between pb-3 border-b border-white/15">
              <div className="flex items-center gap-2">
                <Building2 className="w-5 h-5 text-cyan-400" />
                <h3 className="font-extrabold text-lg">Architectural Blueprint</h3>
              </div>
              <button
                onClick={() => setShowSpecsModal(false)}
                className="w-7 h-7 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-xs"
              >
                ✕
              </button>
            </div>

            <div className="space-y-2 text-sm text-slate-300">
              <p>
                <strong className="text-white">Project:</strong> {activeProject.title}
              </p>
              <p>
                <strong className="text-white">Category:</strong> {activeProject.category}
              </p>
              <p>
                <strong className="text-white">Location:</strong> {(activeProject as any).address || activeProject.location}
              </p>
              <p>
                <strong className="text-white">Coordinates:</strong>{' '}
                <span className="font-mono text-cyan-300">{(activeProject as any).coordinates || '8.7642° N, 78.1348° E'}</span>
              </p>
              <p>
                <strong className="text-white">Specification:</strong> {(activeProject as any).specs || 'Turnkey Execution'}
              </p>
              <p className="text-xs text-slate-400 pt-2 border-t border-white/10">
                {activeProject.description}
              </p>
            </div>

            <div className="flex items-center justify-end gap-3 pt-3">
              <button
                onClick={() => {
                  setShowSpecsModal(false);
                  if (onOpenLightbox) onOpenLightbox(activeIndex);
                }}
                className="px-4 py-2 rounded-full bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold transition-colors cursor-pointer"
              >
                Open Fullscreen Photo
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Copy link toast notification */}
      {copiedToast && (
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 px-5 py-2.5 rounded-full bg-emerald-600/90 text-white text-xs font-bold shadow-2xl backdrop-blur-md flex items-center gap-2 animate-bounce">
          <Check className="w-4 h-4" />
          <span>Project share link copied to clipboard!</span>
        </div>
      )}
    </section>
  );
};
