import React, { useState } from 'react';
import { Eye, Image as ImageIcon, ChevronRight } from 'lucide-react';
import { GALLERY_PROJECTS, GALLERY_CATEGORIES } from '../data/projects';
import { Link } from 'react-router-dom';
import { useCMS } from '../context/CMSContext';

interface GalleryPageProps {
  onOpenLightbox: (index: number) => void;
}

export const GalleryPage: React.FC<GalleryPageProps> = ({ onOpenLightbox }) => {
  const { gallery: cmsGallery } = useCMS();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  // Filter for published items only
  const publishedGallery = (cmsGallery && cmsGallery.length > 0 ? cmsGallery : GALLERY_PROJECTS)
    .filter((item: any) => item.published !== false);

  const filteredProjects =
    selectedCategory === 'all'
      ? publishedGallery
      : publishedGallery.filter((p: any) => p.categoryTag === selectedCategory);

  return (
    <div className="pt-24 sm:pt-28 pb-20 relative overflow-hidden blueprint-grid">
      {/* Ambient background glows */}
      <div className="absolute top-20 -right-40 w-96 h-96 bg-[#2468A6]/12 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute top-1/2 -left-40 w-[500px] h-[500px] bg-[#123B68]/12 rounded-full blur-[140px] pointer-events-none" />

      <div className="container-custom relative z-10">
        {/* Breadcrumb Navigation */}
        <div className="flex items-center gap-2 text-xs font-bold text-[#64748B] mb-6">
          <Link to="/" className="hover:text-[#123B68] transition-colors">Home</Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-[#123B68]">Visual Archives & Gallery</span>
        </div>

        {/* Page Header */}
        <div className="max-w-4xl mx-auto text-center mb-16 sm:mb-20">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass-pill border border-[#2468A6]/20 text-[#123B68] text-xs font-extrabold uppercase tracking-widest mb-4">
            <ImageIcon className="w-3.5 h-3.5 text-[#2468A6]" />
            <span>High-Resolution Photo Archives</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-[#123B68] tracking-tight leading-[1.15]">
            On-Site Photography & <br className="hidden sm:inline" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#2468A6] to-[#0E2E52]">
              Architectural Documentation
            </span>
          </h1>

          <p className="mt-5 text-base sm:text-lg text-[#64748B] max-w-2xl mx-auto leading-relaxed">
            Browse our original photo gallery highlighting completed residential facades, key handovers, structural works, and office facilities.
          </p>
        </div>

        {/* Filter Bar */}
        <div className="flex flex-wrap items-center justify-center gap-2 p-1.5 rounded-full glass-panel border border-white/90 shadow-sm max-w-xl mx-auto mb-16">
          {GALLERY_CATEGORIES.map((cat) => {
            const isActive = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-5 py-2 rounded-full text-xs font-bold transition-all duration-300 cursor-pointer ${
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

        {/* Gallery Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
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
                <div className="relative aspect-[4/5] rounded-2xl overflow-hidden bg-slate-900">
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

                  {/* Center hover indicator */}
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10">
                    <span className="w-12 h-12 rounded-full bg-white/90 text-[#123B68] flex items-center justify-center shadow-xl transform scale-90 group-hover:scale-100 transition-transform">
                      <Eye className="w-5 h-5 text-[#2468A6]" />
                    </span>
                  </div>

                  {/* Floating Frosted Glass Bottom Plaque */}
                  <div className="absolute bottom-3 inset-x-3 p-3.5 rounded-xl bg-white/15 backdrop-blur-md border border-white/20 text-white z-10">
                    <h3 className="text-sm font-bold text-white line-clamp-1">
                      {project.title}
                    </h3>
                    <p className="text-[11px] text-slate-200 mt-0.5 line-clamp-1">
                      {(project as any).description || (project as any).caption}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
