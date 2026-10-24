import React, { useState } from 'react';
import { Eye, Image as ImageIcon, Filter } from 'lucide-react';
import { GALLERY_PROJECTS, GALLERY_CATEGORIES } from '../data/projects';

interface GalleryProps {
  onOpenLightbox: (index: number) => void;
}

export const Gallery: React.FC<GalleryProps> = ({ onOpenLightbox }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const filteredProjects =
    selectedCategory === 'all'
      ? GALLERY_PROJECTS
      : GALLERY_PROJECTS.filter((p) => p.categoryTag === selectedCategory);

  return (
    <section id="gallery" className="py-20 lg:py-28 relative overflow-hidden bg-white blueprint-grid">
      {/* Ambient background glows */}
      <div className="absolute top-1/4 -right-32 w-96 h-96 bg-[#2468A6]/18 rounded-full blur-[130px] pointer-events-none" />
      <div className="absolute bottom-1/4 -left-32 w-96 h-96 bg-[#123B68]/16 rounded-full blur-[130px] pointer-events-none" />

      <div className="container-custom relative z-10">
        {/* Section Header */}
        <div className="max-w-3xl mx-auto text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass-pill border border-[#2468A6]/20 text-[#123B68] text-xs font-extrabold uppercase tracking-widest mb-3">
            <ImageIcon className="w-3.5 h-3.5 text-[#2468A6]" />
            <span>Visual Archives</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#123B68] tracking-tight">
            Original Project Gallery
          </h2>
          <p className="mt-4 text-base sm:text-lg text-[#64748B] max-w-2xl mx-auto leading-relaxed">
            Authentic on-site imagery from completed residential builds, handovers, structural works, and office facilities.
          </p>
          <div className="w-20 h-1 bg-gradient-to-r from-[#123B68] to-[#2468A6] mx-auto mt-5 rounded-full" />
        </div>

        {/* Frosted Glass Filter Bar */}
        <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 mb-12">
          <div className="hidden sm:flex items-center gap-1.5 text-xs font-extrabold text-[#64748B] mr-2 uppercase tracking-widest">
            <Filter className="w-3.5 h-3.5 text-[#2468A6]" />
            <span>Filter:</span>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-2 p-1.5 rounded-full glass-panel border border-white/90 shadow-sm">
            {GALLERY_CATEGORIES.map((cat) => {
              const isActive = selectedCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all duration-300 cursor-pointer ${
                    isActive
                      ? 'bg-gradient-to-r from-[#123B68] to-[#2468A6] text-white shadow-[0_4px_15px_rgba(36,104,166,0.35)] scale-102'
                      : 'text-[#64748B] hover:text-[#123B68] hover:bg-white/80'
                  }`}
                >
                  {cat.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredProjects.map((project) => {
            const originalIndex = GALLERY_PROJECTS.findIndex((p) => p.id === project.id);
            return (
              <div
                key={project.id}
                onClick={() => onOpenLightbox(originalIndex)}
                className="glass-panel glass-panel-hover rounded-3xl p-3 cursor-pointer group flex flex-col justify-between"
                role="button"
                tabIndex={0}
                aria-label={`View enlarged photo of ${project.title}`}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') onOpenLightbox(originalIndex);
                }}
              >
                {/* Image Container with Consistent Aspect */}
                <div className="relative aspect-[4/3] sm:aspect-[3/4] lg:aspect-[4/5] rounded-2xl overflow-hidden bg-slate-900">
                  <img
                    src={project.imageSrc}
                    alt={project.title}
                    loading="lazy"
                    className="w-full h-full object-cover object-center transform transition-transform duration-700 group-hover:scale-108"
                  />

                  {/* Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0B2544]/90 via-[#0B2544]/20 to-transparent opacity-60 group-hover:opacity-90 transition-opacity duration-300" />

                  {/* Category Pill Tag */}
                  <div className="absolute top-3 left-3 z-10">
                    <span className="px-3 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-widest bg-[#123B68]/85 text-white backdrop-blur-md border border-white/20">
                      {project.category}
                    </span>
                  </div>

                  {/* Hover Center Indicator */}
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10">
                    <span className="w-11 h-11 rounded-full bg-white/90 text-[#123B68] flex items-center justify-center shadow-xl transform scale-90 group-hover:scale-100 transition-transform">
                      <Eye className="w-5 h-5 text-[#2468A6]" />
                    </span>
                  </div>

                  {/* Floating Frosted Glass Bottom Plaque */}
                  <div className="absolute bottom-3 inset-x-3 p-3.5 rounded-xl bg-white/15 backdrop-blur-md border border-white/20 text-white z-10">
                    <h3 className="text-xs sm:text-sm font-bold text-white line-clamp-1">
                      {project.title}
                    </h3>
                    <p className="text-[11px] text-slate-200 mt-0.5 line-clamp-1">
                      {project.description}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
