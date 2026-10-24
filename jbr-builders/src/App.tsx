import { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate, Outlet, useNavigate, useOutletContext } from 'react-router-dom';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { ScrollToTop } from './components/ScrollToTop';
import { LightboxModal } from './components/LightboxModal';
import { FloatingWhatsApp } from './components/FloatingWhatsApp';
import { GALLERY_PROJECTS } from './data/projects';
import { CMSProvider } from './context/CMSContext';

// Public Dedicated Detailed Pages
import { HomePage } from './pages/HomePage';
import { AboutPage } from './pages/AboutPage';
import { ServicesPage } from './pages/ServicesPage';
import { ProjectsPage } from './pages/ProjectsPage';
import { GalleryPage } from './pages/GalleryPage';
import { ContactPage } from './pages/ContactPage';
import { CareerPage } from './pages/CareerPage';

// Admin CMS Providers & Layout
import { AdminAuthProvider } from './admin/context/AdminAuthContext';
import { AdminLayout } from './admin/components/AdminLayout';

// Admin CMS Pages
import { AdminLoginPage } from './admin/pages/AdminLoginPage';
import { AdminDashboard } from './admin/pages/AdminDashboard';
import { AdminTeamPage } from './admin/pages/AdminTeamPage';
import { AdminServicesPage } from './admin/pages/AdminServicesPage';
import { AdminProjectsPage } from './admin/pages/AdminProjectsPage';
import { AdminGalleryPage } from './admin/pages/AdminGalleryPage';
import { AdminHomePage } from './admin/pages/AdminHomePage';
import { AdminInternshipPage } from './admin/pages/AdminInternshipPage';
import { AdminCompanyPage } from './admin/pages/AdminCompanyPage';
import { AdminSecurityPage } from './admin/pages/AdminSecurityPage';

/**
 * Public website shell — wraps Navbar, Footer, Modals around a nested <Outlet />.
 * Only 2 forms exist in the entire website: ContactPage (/contact) and CareerPage (/careers).
 * All consultation / quote triggers navigate directly to /contact with the selected service.
 */
function PublicShell() {
  const navigate = useNavigate();
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

      {/* Public page routes rendered here */}
      <main className="flex-1">
        <Outlet context={{ handleOpenQuote, handleOpenLightbox }} />
      </main>

      {/* Luxury Glass Footer */}
      <Footer onOpenQuote={() => handleOpenQuote()} />

      {/* Global Interactive Lightbox Modal */}
      <LightboxModal
        isOpen={lightboxOpen}
        onClose={() => setLightboxOpen(false)}
        currentIndex={lightboxIndex}
        projects={GALLERY_PROJECTS}
        onNavigate={(newIndex) => setLightboxIndex(newIndex)}
      />

      {/* Floating WhatsApp Action Trigger */}
      <FloatingWhatsApp />
    </div>
  );
}

/**
 * Public page components — they receive callback props via the outlet context
 * from PublicShell. We use wrapper components here so each route is clean.
 */
type PublicShellContext = {
  handleOpenQuote: (serviceName?: string) => void;
  handleOpenLightbox: (index: number) => void;
};

function HomeRoute() {
  const { handleOpenQuote, handleOpenLightbox } = useOutletContext<PublicShellContext>();
  return <HomePage onOpenQuote={handleOpenQuote} onOpenProjectImage={handleOpenLightbox} />;
}
function AboutRoute() {
  const { handleOpenQuote, handleOpenLightbox } = useOutletContext<PublicShellContext>();
  return <AboutPage onOpenQuote={() => handleOpenQuote()} onOpenProjectImage={handleOpenLightbox} />;
}
function ServicesRoute() {
  const { handleOpenQuote } = useOutletContext<PublicShellContext>();
  return <ServicesPage onSelectService={(s) => handleOpenQuote(s)} />;
}
function ProjectsRoute() {
  const { handleOpenQuote, handleOpenLightbox } = useOutletContext<PublicShellContext>();
  return <ProjectsPage onOpenLightbox={handleOpenLightbox} onOpenQuote={() => handleOpenQuote()} />;
}
function GalleryRoute() {
  const { handleOpenLightbox } = useOutletContext<PublicShellContext>();
  return <GalleryPage onOpenLightbox={handleOpenLightbox} />;
}
function ContactRoute() {
  return <ContactPage />;
}
function CareerRoute() {
  return <CareerPage />;
}

export function App() {
  return (
    <CMSProvider>
      <BrowserRouter>
        <ScrollToTop />
        <AdminAuthProvider>
          <Routes>
            {/* ========== ADMIN CMS ROUTES ========== */}
            {/* Admin Login (standalone, no layout) */}
            <Route path="/admin/login" element={<AdminLoginPage />} />

            {/* /admin → redirect to /admin/dashboard */}
            <Route path="/admin" element={<Navigate to="/admin/dashboard" replace />} />

            {/* Protected Admin Layout with all nested admin pages */}
            <Route path="/admin" element={<AdminLayout />}>
              <Route path="dashboard" element={<AdminDashboard />} />
              <Route path="team" element={<AdminTeamPage />} />
              <Route path="services" element={<AdminServicesPage />} />
              <Route path="projects" element={<AdminProjectsPage />} />
              <Route path="gallery" element={<AdminGalleryPage />} />
              <Route path="homepage" element={<AdminHomePage />} />
              <Route path="internships" element={<AdminInternshipPage />} />
              <Route path="company" element={<AdminCompanyPage />} />
              <Route path="security" element={<AdminSecurityPage />} />
            </Route>

            {/* ========== PUBLIC WEBSITE ROUTES ========== */}
            {/* PublicShell renders Navbar + Footer + modals; child routes render in <Outlet> */}
            <Route element={<PublicShell />}>
              <Route path="/" element={<HomeRoute />} />
              <Route path="/about" element={<AboutRoute />} />
              <Route path="/services" element={<ServicesRoute />} />
              <Route path="/projects" element={<ProjectsRoute />} />
              <Route path="/gallery" element={<GalleryRoute />} />
              <Route path="/careers" element={<CareerRoute />} />
              <Route path="/career" element={<Navigate to="/careers" replace />} />
              <Route path="/contact" element={<ContactRoute />} />
            </Route>
          </Routes>
        </AdminAuthProvider>
      </BrowserRouter>
    </CMSProvider>
  );
}

export default App;
