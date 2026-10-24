import React, { useState } from 'react';
import { Eye, ArrowRight, Sparkles, ChevronRight, MapPin } from 'lucide-react';
import { GALLERY_PROJECTS, GALLERY_CATEGORIES } from '../data/projects';
import { Link } from 'react-router-dom';
import { useCMS } from '../context/CMSContext';

interface ProjectsPageProps {
  onOpenLightbox: (index: number) => void;
  onOpenQuote: () => void;
}

export const ProjectsPage: React.FC<ProjectsPageProps> = ({ onOpenLightbox, onOpenQuote }) => {
  const { projects: cmsProjects } = useCMS();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  // Filter published projects only
  const publishedProjects = (cmsProjects && cmsProjects.length > 0 ? cmsProjects : GALLERY_PROJECTS)
    .filter((p: any) => p.published !== false);

  const filteredProjects =
    selectedCategory === 'all'
      ? publishedProjects
      : publishedProjects.filter((p: any) => p.categoryTag === selectedCategory);

  return (
    <div className="pt-24 sm:pt-28 pb-20 relative overflow-hidden blueprint-grid">
      {/* Ambient background glows */}
      <div className="absolute top-20 -left-40 w-96 h-96 bg-[#2468A6]/12 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute top-1/2 -right-40 w-[500px] h-[500px] bg-[#123B68]/12 rounded-full blur-[140px] pointer-events-none" />

      <div className="container-custom relative z-10">
        {/* Breadcrumb Navigation */}
        <div className="flex items-center gap-2 text-xs font-bold text-[#64748B] mb-6">
          <Link to="/" className="hover:text-[#123B68] transition-colors">Home</Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-[#123B68]">Projects & Engineering Portfolio</span>
        </div>

        {/* Page Header */}
        <div className="max-w-4xl mx-auto text-center mb-16 sm:mb-20">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass-pill border border-[#2468A6]/20 text-[#123B68] text-xs font-extrabold uppercase tracking-widest mb-4">
            <Sparkles className="w-3.5 h-3.5 text-[#2468A6]" />
            <span>Delivered Works</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-[#123B68] tracking-tight leading-[1.15]">
            Architectural Masterpieces <br className="hidden sm:inline" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#2468A6] to-[#0E2E52]">
              & Structural Milestones
            </span>
          </h1>

          <p className="mt-5 text-base sm:text-lg text-[#64748B] max-w-2xl mx-auto leading-relaxed">
            Explore real on-site construction works, modern residential elevations, and successful key handovers completed by JBR Builders in Tuticorin & Tirunelveli.
          </p>
        </div>

        {/* Filter Pills */}
        <div className="flex flex-wrap items-center justify-center gap-2 p-1.5 rounded-full glass-panel border border-white/90 shadow-sm max-w-2xl mx-auto mb-16">
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

        {/* Projects Grid: 3 in a row */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-7 lg:gap-8 mb-20 items-stretch">
          {filteredProjects.map((project) => {
            const originalIndex = GALLERY_PROJECTS.findIndex((p) => p.id === project.id);
            return (
              <div
                key={project.id}
                onClick={() => onOpenLightbox(originalIndex)}
                className="glass-panel glass-panel-hover rounded-3xl p-4 sm:p-5 cursor-pointer group flex flex-col justify-between border border-[#2468A6]/20 shadow-md transition-all duration-300"
                role="button"
                tabIndex={0}
                aria-label={`View larger image for ${project.title}`}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') onOpenLightbox(originalIndex);
                }}
              >
                {/* Image Frame */}
                <div className="relative aspect-[16/11] rounded-2xl overflow-hidden bg-slate-900">
                  <img
                    src={project.imageSrc}
                    alt={project.title}
                    className="w-full h-full object-cover object-center transform transition-transform duration-700 group-hover:scale-108"
                  />

                  {/* Dark gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0B2544]/80 via-transparent to-transparent opacity-60 group-hover:opacity-90 transition-opacity duration-300" />

                  {/* Top Badge */}
                  <div className="absolute top-3 left-3 z-10">
                    <span className="px-3 py-1 rounded-full text-[11px] font-bold bg-[#123B68]/90 text-white backdrop-blur-md border border-white/20 shadow-sm">
                      {project.category}
                    </span>
                  </div>

                  {/* Centered Glass Button on Hover */}
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10">
                    <span className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-white/95 text-[#123B68] text-xs font-extrabold shadow-xl backdrop-blur-md transform scale-95 group-hover:scale-100 transition-transform duration-300">
                      <Eye className="w-3.5 h-3.5 text-[#2468A6]" />
                      <span>View Full Resolution</span>
                    </span>
                  </div>
                </div>

                {/* Project Details */}
                <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-1.5 text-xs font-bold text-[#2468A6] mb-1.5">
                      <MapPin className="w-3.5 h-3.5" />
                      <span>Tuticorin / Tirunelveli</span>
                    </div>

                    <h3 className="text-lg sm:text-xl font-extrabold text-[#123B68] group-hover:text-[#2468A6] transition-colors mb-2 leading-snug line-clamp-1">
                      {project.title}
                    </h3>

                    <p className="text-xs sm:text-sm text-[#64748B] leading-relaxed line-clamp-3">
                      {project.description}
                    </p>
                  </div>

                  <div className="pt-3.5 mt-4 border-t border-slate-200/60 flex items-center justify-between text-xs font-bold text-[#2468A6]">
                    <span>Expand photo</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Consultation Callout */}
        <div className="glass-panel rounded-3xl p-8 sm:p-12 text-center">
          <h3 className="text-2xl sm:text-3xl font-extrabold text-[#123B68]">
            Have a Specific Architectural Vision in Mind?
          </h3>
          <p className="text-sm text-[#64748B] max-w-xl mx-auto mt-2 mb-6">
            Share your plot coordinates or floor plan requirements with our design and civil team for an initial 3D concept review.
          </p>
          <button
            type="button"
            onClick={onOpenQuote}
            className="px-8 py-3.5 rounded-2xl bg-gradient-to-r from-[#123B68] to-[#2468A6] hover:from-[#0E2E52] hover:to-[#1E588D] text-white font-bold text-sm shadow-[0_8px_25px_rgba(36,104,166,0.35)] hover:scale-102 transition-all duration-200"
          >
            Schedule a Design Consultation
          </button>
        </div>
      </div>
    </div>
  );
};
