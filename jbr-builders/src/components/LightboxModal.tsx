import React, { useEffect } from 'react';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import type { ProjectItem } from '../types';

interface LightboxModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentIndex: number;
  projects: ProjectItem[];
  onNavigate: (newIndex: number) => void;
}

export const LightboxModal: React.FC<LightboxModalProps> = ({
  isOpen,
  onClose,
  currentIndex,
  projects,
  onNavigate,
}) => {
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft') {
        onNavigate((currentIndex - 1 + projects.length) % projects.length);
      }
      if (e.key === 'ArrowRight') {
        onNavigate((currentIndex + 1) % projects.length);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden';

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, currentIndex, projects.length, onClose, onNavigate]);

  if (!isOpen || projects.length === 0) return null;

  const currentProject = projects[currentIndex];

  const handlePrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    onNavigate((currentIndex - 1 + projects.length) % projects.length);
  };

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    onNavigate((currentIndex + 1) % projects.length);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Image preview lightbox"
      className="fixed inset-0 z-50 flex items-center justify-center bg-[#07172A]/85 backdrop-blur-2xl p-4 sm:p-6 transition-all animate-in fade-in duration-200"
      onClick={onClose}
    >
      {/* Frosted Glass Close button */}
      <button
        onClick={onClose}
        aria-label="Close modal"
        className="absolute top-5 right-5 z-50 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white backdrop-blur-md border border-white/20 transition-all focus:outline-none shadow-lg hover:scale-105"
      >
        <X className="w-5 h-5" />
      </button>

      {/* Prev button */}
      {projects.length > 1 && (
        <button
          onClick={handlePrev}
          aria-label="Previous image"
          className="absolute left-3 sm:left-6 top-1/2 -translate-y-1/2 z-50 p-3.5 rounded-full bg-white/10 hover:bg-white/25 text-white backdrop-blur-md border border-white/20 transition-all focus:outline-none shadow-xl hover:scale-108"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
      )}

      {/* Next button */}
      {projects.length > 1 && (
        <button
          onClick={handleNext}
          aria-label="Next image"
          className="absolute right-3 sm:right-6 top-1/2 -translate-y-1/2 z-50 p-3.5 rounded-full bg-white/10 hover:bg-white/25 text-white backdrop-blur-md border border-white/20 transition-all focus:outline-none shadow-xl hover:scale-108"
        >
          <ChevronRight className="w-6 h-6" />
        </button>
      )}

      {/* Modal Content */}
      <div
        className="relative max-w-5xl w-full max-h-[92vh] flex flex-col items-center"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="relative w-full flex items-center justify-center max-h-[72vh] overflow-hidden rounded-3xl bg-black/60 border border-white/20 shadow-[0_25px_60px_rgba(0,0,0,0.6)]">
          <img
            src={currentProject.imageSrc}
            alt={currentProject.title}
            className="max-h-[72vh] max-w-full w-auto object-contain select-none"
          />
        </div>

        {/* Captions and counter as Frosted Glass Plaque */}
        <div className="w-full mt-4 glass-panel-dark rounded-2xl p-5 border border-white/20 text-white shadow-xl">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <span className="inline-block text-[10px] font-extrabold px-3 py-1 rounded-full bg-[#2468A6] text-white tracking-widest uppercase mb-1.5 shadow-xs">
                {currentProject.category}
              </span>
              <h3 className="text-base sm:text-xl font-extrabold text-white">
                {currentProject.title}
              </h3>
            </div>
            <span className="text-xs font-bold text-cyan-300 px-3 py-1 rounded-full bg-white/10 border border-white/15">
              {currentIndex + 1} of {projects.length}
            </span>
          </div>
          {currentProject.description && (
            <p className="text-xs sm:text-sm text-slate-200 mt-2 leading-relaxed">
              {currentProject.description}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};
