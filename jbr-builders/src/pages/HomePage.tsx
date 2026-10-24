import React from 'react';
import { Hero } from '../components/Hero';
import { About } from '../components/About';
import { BrandStatement } from '../components/BrandStatement';
import { WhyChooseUs } from '../components/WhyChooseUs';
import { FeaturedProjects } from '../components/FeaturedProjects';
import { TeamSpotlight } from '../components/TeamSpotlight';
import { HomeVisitingCard } from '../components/HomeVisitingCard';

interface HomePageProps {
  onOpenQuote: (serviceName?: string) => void;
  onOpenProjectImage: (index: number) => void;
}

export const HomePage: React.FC<HomePageProps> = ({ onOpenQuote, onOpenProjectImage }) => {
  return (
    <div className="relative">
      {/* SECTION 2 — Architectural Video Hero */}
      <Hero
        onOpenQuote={() => onOpenQuote()}
        onOpenProjectImage={onOpenProjectImage}
      />

      {/* SECTION 3 — About JBR Builders (Balanced Two-Column, Two Images on Right) */}
      <About onOpenProjectImage={onOpenProjectImage} />

      {/* SECTION 4 — Architectural Quote / Brand Statement (6 Quotes Auto-Rotating Every 10s) */}
      <BrandStatement />

      {/* SECTION 5 — Why JBR Builders (Two-Column, One Main Image on Right) */}
      <WhyChooseUs />

      {/* SECTION 6 — Latest Projects (CMS-Driven, Exactly 3 Projects, View All Projects Button) */}
      <FeaturedProjects onOpenLightbox={onOpenProjectImage} />

      {/* SECTION 7 — Our Team (Interactive Spotlight with Downside Worker Cards) */}
      <TeamSpotlight onOpenQuote={() => onOpenQuote()} />

      {/* PRE-FOOTER SECTION — Direct Client Desk & Interactive 3D Flip Visiting Card */}
      <HomeVisitingCard onOpenQuote={() => onOpenQuote()} />
    </div>
  );
};
