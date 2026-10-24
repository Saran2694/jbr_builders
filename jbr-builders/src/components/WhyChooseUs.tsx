import React from 'react';
import {
  Users,
  FileSpreadsheet,
  HardHat,
  ShieldCheck,
  Award,
} from 'lucide-react';
import homeVid from '../../img/galley/homevid1.mp4';

export const WhyChooseUs: React.FC = () => {
  const differentiators = [
    {
      icon: Users,
      title: 'Client-Focused Planning',
      description:
        'We tailor spatial layouts, room proportions, and lighting to your family’s daily rituals rather than forcing standardized developer templates.',
    },
    {
      icon: FileSpreadsheet,
      title: 'Detailed Project Estimation & BOQ Transparency',
      description:
        'Clear bill-of-quantities (BOQ) with documented steel grades, cement brands, and stage-wise payment schedules eliminate surprise cost escalations.',
    },
    {
      icon: HardHat,
      title: 'Engineering-Led Construction',
      description:
        'Supervised directly by licensed civil engineers with rigorous plumb-line structural alignments, Total Station surveying, and seismic compliance.',
    },
    {
      icon: ShieldCheck,
      title: 'Quality-Conscious Execution',
      description:
        'Laboratory cube-strength testing for concrete, continuous curing regimes, and multi-tier quality checks ensure structural longevity.',
    },
  ];

  return (
    <section
      id="why-us"
      className="py-20 lg:py-28 relative overflow-hidden bg-white blueprint-grid"
      aria-label="Why Build with JBR Builders"
    >
      {/* Ambient background glows */}
      <div className="absolute top-1/4 -right-40 w-96 h-96 bg-[#2468A6]/16 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-10 -left-40 w-96 h-96 bg-[#123B68]/14 rounded-full blur-[140px] pointer-events-none" />

      <div className="container-custom relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* Left Column: Heading & 4 Differentiators following page standard typography */}
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#EBF4FC] border border-[#2468A6]/20 text-[#123B68] text-xs font-extrabold uppercase tracking-widest">
              <Award className="w-3.5 h-3.5 text-[#2468A6]" />
              <span>THE JBR ADVANTAGE</span>
            </div>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#123B68] tracking-tight leading-[1.18]">
              Why Build with{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#2468A6] to-[#0E2E52]">
                JBR Builders?
              </span>
            </h2>

            <p className="text-sm sm:text-base text-[#64748B] leading-relaxed">
              We approach every residential and commercial structure as a permanent legacy. Our civil engineering teams prioritize open client communication, verified structural integrity, and transparent cost planning from ground-breaking to key handover.
            </p>

            {/* 4 Differentiators */}
            <div className="pt-2 divide-y divide-slate-200/70 border-y border-slate-200/70">
              {differentiators.map((diff, index) => {
                const IconComponent = diff.icon;
                return (
                  <div key={index} className="py-3.5 flex items-start gap-4">
                    <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#123B68] to-[#2468A6] text-white flex items-center justify-center shrink-0 shadow-sm mt-0.5">
                      <IconComponent className="w-4 h-4 text-cyan-200" />
                    </div>
                    <div className="space-y-1">
                      <h3 className="text-sm sm:text-base font-extrabold text-[#123B68]">
                        {diff.title}
                      </h3>
                      <p className="text-xs sm:text-sm text-[#64748B] leading-relaxed">
                        {diff.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right Column: Prominent tall video */}
          <div className="lg:col-span-5 flex items-center justify-center">
            <div className="w-full max-w-[440px] lg:max-w-[480px] flex items-center justify-center">
              <video
                src={homeVid}
                autoPlay
                loop
                muted
                playsInline
                className="w-full max-h-[580px] lg:max-h-[620px] object-cover rounded-3xl shadow-2xl"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
