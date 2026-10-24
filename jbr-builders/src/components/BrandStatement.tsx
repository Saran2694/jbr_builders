import React, { useState, useEffect } from 'react';
import { Quote, ChevronLeft, ChevronRight } from 'lucide-react';
import homeBg from '../../img/galley/homebg.png';

const ARCHITECTURAL_QUOTES = [
  {
    quote:
      'Every great structure begins with a vision. We bring that vision to life through thoughtful planning, precise engineering, and quality construction.',
    context: 'The JBR Engineering Philosophy',
  },
  {
    quote:
      'Architecture should speak of its time and place, but yearn for timeless structural endurance and living comfort.',
    context: 'Design & Spatial Vision',
  },
  {
    quote:
      'Quality is never an accident; it is always the result of high intention, sincere effort, and disciplined on-site craftsmanship.',
    context: 'Material & Concrete Standards',
  },
  {
    quote:
      'We shape our buildings with millimeter precision and structural rigor; thereafter, our buildings shape the lives of the families within.',
    context: 'Residential Architecture',
  },
  {
    quote:
      'True luxury in civil construction lies in what is unseen: robust foundations, tested steel grades, and uncompromised curing regimes.',
    context: 'Structural Integrity Benchmark',
  },
  {
    quote:
      'Listen deeply to the client, plan scientifically with modern engineering, and build with pride that outlasts generations.',
    context: 'Turnkey Excellence',
  },
];

export const BrandStatement: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  // Auto-change quote every 10 seconds (10000 ms)
  useEffect(() => {
    if (isPaused) return;

    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % ARCHITECTURAL_QUOTES.length);
    }, 10000);

    return () => clearInterval(timer);
  }, [isPaused]);

  const handlePrev = () => {
    setCurrentIndex((prev) =>
      prev === 0 ? ARCHITECTURAL_QUOTES.length - 1 : prev - 1
    );
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % ARCHITECTURAL_QUOTES.length);
  };

  const activeQuote = ARCHITECTURAL_QUOTES[currentIndex];

  return (
    <section
      className="py-24 sm:py-36 relative overflow-hidden bg-fixed bg-cover bg-center select-none"
      style={{
        backgroundImage: `url(${homeBg})`,
        backgroundAttachment: 'fixed',
      }}
      aria-label="Architectural Brand Statement & Quotes"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div className="container-custom relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          {/* Subtle Top Architectural Rule */}
          <div className="w-16 h-1 bg-gradient-to-r from-[#123B68] to-[#2468A6] mx-auto mb-10 rounded-full opacity-80" />

          {/* White Frost Glassmorphic Box */}
          <div className="rounded-3xl p-8 sm:p-14 border border-white/60 shadow-[0_20px_60px_rgba(0,0,0,0.15),inset_0_1px_3px_rgba(255,255,255,0.9)] backdrop-blur-xl bg-white/70 sm:bg-white/75 relative overflow-hidden transition-all duration-500">
            {/* Subtle Inner Refraction Sheen */}
            <div className="absolute -top-24 -right-24 w-72 h-72 bg-gradient-to-br from-white/80 via-white/40 to-transparent rounded-full blur-2xl pointer-events-none" />

            {/* Corner Blueprint Badges */}
            <div className="absolute top-4 left-5 text-[10px] font-mono tracking-widest text-[#0E2E52] bg-white/80 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-white/90 uppercase pointer-events-none select-none flex items-center gap-1.5 font-bold shadow-xs">
              <Quote className="w-3.5 h-3.5 text-[#123B68]" />
              <span>JBR // ARCHITECTURAL ESSAYS ({currentIndex + 1}/6)</span>
            </div>

            <div className="absolute top-4 right-5 text-[10px] font-mono tracking-widest text-[#0E2E52] bg-white/80 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-white/90 uppercase pointer-events-none select-none font-bold shadow-xs">
              Auto-Rotates 10s
            </div>

            {/* Prominent Architectural Quote with Keyed Fade Transition */}
            <div
              key={currentIndex}
              className="mt-8 mb-2 min-h-[140px] sm:min-h-[120px] flex flex-col justify-center animate-in fade-in slide-in-from-bottom-2 duration-700"
            >
              <blockquote className="text-xl sm:text-2xl md:text-3xl lg:text-3xl font-extrabold text-[#0E2E52] tracking-tight leading-[1.38] sm:leading-[1.42]">
                “{activeQuote.quote}”
              </blockquote>
              <p className="mt-3 text-xs font-bold uppercase tracking-wider text-[#123B68]">
                — {activeQuote.context}
              </p>
            </div>

            {/* Pagination Dots & Navigation Controls */}
            <div className="mt-8 flex items-center justify-center gap-3">
              <button
                type="button"
                onClick={handlePrev}
                aria-label="Previous quote"
                className="p-2 rounded-full bg-white/85 hover:bg-white text-[#0E2E52] transition-colors cursor-pointer border border-white shadow-xs"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>

              <div className="flex items-center gap-2">
                {ARCHITECTURAL_QUOTES.map((_, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setCurrentIndex(idx)}
                    aria-label={`Go to quote ${idx + 1}`}
                    className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${
                      idx === currentIndex
                        ? 'w-7 bg-[#123B68] shadow-xs'
                        : 'w-2 bg-slate-400/50 hover:bg-slate-600'
                    }`}
                  />
                ))}
              </div>

              <button
                type="button"
                onClick={handleNext}
                aria-label="Next quote"
                className="p-2 rounded-full bg-white/85 hover:bg-white text-[#0E2E52] transition-colors cursor-pointer border border-white shadow-xs"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            {/* Supporting Brand Motto */}
            <div className="mt-7 pt-6 border-t border-slate-300/60 inline-block">
              <p className="text-xs sm:text-sm font-bold tracking-[0.22em] text-[#0E2E52] uppercase">
                LISTEN BETTER • PLAN BETTER • BUILD BETTER
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
