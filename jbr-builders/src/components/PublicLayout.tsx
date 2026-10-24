import React, { useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { Navbar } from './Navbar';
import { Footer } from './Footer';
import { LightboxModal } from './LightboxModal';
import { FloatingWhatsApp } from './FloatingWhatsApp';
import { useCMS } from '../context/CMSContext';

export interface PublicOutletContext {
  handleOpenQuote: (serviceName?: string) => void;
  handleOpenLightbox: (index: number) => void;
}

export const PublicLayout: React.FC = () => {
  const navigate = useNavigate();
  const { gallery } = useCMS();
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  const handleOpenLightbox = (index: number) => {
    setLightboxIndex(index);
    setLightboxOpen(true);
  };

  const handleOpenQuote = (serviceName?: string) => {
    if (serviceName) {
      navigate(`/contact?service=${encodeURIComponent(serviceName)}`);
    } else {
      navigate('/contact');
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-[#1E293B] flex flex-col font-sans selection:bg-[#2468A6] selection:text-white">
      {/* Floating Luxury Glassmorphic Navigation Bar */}
      <Navbar onOpenQuote={() => handleOpenQuote()} />

      {/* Multi-Page Route Content Outlet */}
      <main className="flex-1">
        <Outlet context={{ handleOpenQuote, handleOpenLightbox }} />
      </main>

      {/* Luxury Glass Footer */}
      <Footer onOpenQuote={() => handleOpenQuote()} />

      {/* Global Interactive Lightbox Modal backed by dynamic CMS gallery */}
      <LightboxModal
        isOpen={lightboxOpen}
        onClose={() => setLightboxOpen(false)}
        currentIndex={lightboxIndex}
        projects={gallery as any}
        onNavigate={(newIndex) => setLightboxIndex(newIndex)}
      />

      {/* Floating WhatsApp Action Trigger */}
      <FloatingWhatsApp />
    </div>
  );
};
