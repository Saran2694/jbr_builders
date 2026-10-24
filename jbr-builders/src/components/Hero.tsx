import React, { useRef, useState, useEffect } from 'react';
import { Volume2, VolumeX } from 'lucide-react';

interface HeroProps {
  onOpenQuote?: () => void;
  onOpenProjectImage?: (imageIndex: number) => void;
}

export const Hero: React.FC<HeroProps> = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isMuted, setIsMuted] = useState(true);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.play().catch(() => {
        // Autoplay handled by browser
      });
    }
  }, []);

  const toggleSound = () => {
    if (videoRef.current) {
      const nextMuted = !videoRef.current.muted;
      videoRef.current.muted = nextMuted;
      setIsMuted(nextMuted);
    }
  };

  return (
    <section
      id="home"
      className="relative w-full h-screen min-h-[500px] overflow-hidden bg-black flex items-center justify-center"
      aria-label="Architectural Video Showcase"
    >
      {/* Pure Edge-to-Edge Architectural Video Alone */}
      <video
        ref={videoRef}
        src="/videos/hero-video.mp4"
        poster="/images/project-residential-elevation.jpg"
        autoPlay
        loop
        muted={isMuted}
        playsInline
        className="w-full h-full object-cover object-center"
      />

      {/* Unobtrusive Minimal Glass Sound Toggle */}
      <button
        type="button"
        onClick={toggleSound}
        aria-label={isMuted ? 'Enable video audio' : 'Mute video audio'}
        className="absolute bottom-6 right-6 z-20 p-3 rounded-full bg-black/40 hover:bg-black/70 text-white/90 hover:text-white backdrop-blur-md border border-white/20 shadow-xl transition-all focus:outline-none hover:scale-105 cursor-pointer"
        title={isMuted ? 'Click to enable audio' : 'Mute audio'}
      >
        {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
      </button>
    </section>
  );
};
