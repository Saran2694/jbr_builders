import React, { useState, useEffect, useMemo } from 'react';
import {
  Phone,
  Mail,
  Send,
  CheckCircle2,
  Clock,
  ChevronRight,
  MapPin,
  ExternalLink,
  CreditCard,
  RotateCw,
  Loader2,
  AlertCircle,
} from 'lucide-react';
import { COMPANY_INFO } from '../data/company';
import { PROPOSED_SERVICES } from '../data/services';
import { Link, useSearchParams } from 'react-router-dom';
import { WhatsAppIcon } from '../components/WhatsAppIcon';
import visitingFront from '../../img/galley/visiting frent.png';
import visitingBack from '../../img/galley/visitingback.png';

interface ContactPageProps {
  initialService?: string;
}

export const ContactPage: React.FC<ContactPageProps> = ({ initialService = '' }) => {
  const [searchParams] = useSearchParams();
  const queryService = searchParams.get('service') || initialService || '';

  const [isCardFlipped, setIsCardFlipped] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    service: queryService || PROPOSED_SERVICES[0]?.title || 'Residential Construction',
    message: '',
  });

  // When navigated with ?service=... update the form selection
  useEffect(() => {
    const s = searchParams.get('service');
    if (s) {
      setFormData((prev) => ({ ...prev, service: s }));
      const formEl = document.getElementById('consultation-form');
      if (formEl) {
        formEl.scrollIntoView({ behavior: 'smooth' });
      }
    }
  }, [searchParams]);

  // Ensure any custom preselected service exists in the dropdown options
  const availableServices = useMemo(() => {
    const titles = PROPOSED_SERVICES.map((s) => s.title);
    if (formData.service && !titles.includes(formData.service)) {
      return [formData.service, ...titles];
    }
    return titles;
  }, [formData.service]);

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submittedSnapshot, setSubmittedSnapshot] = useState<{
    name: string;
    phone: string;
    email: string;
    service: string;
    message: string;
  } | null>(null);

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!formData.name.trim()) errs.name = 'Full name is required.';
    if (!formData.phone.trim()) {
      errs.phone = 'Phone number is required.';
    } else if (!/^[0-9+\s-]{8,15}$/.test(formData.phone.trim())) {
      errs.phone = 'Please enter a valid phone number (min 8 digits).';
    }
    if (formData.email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      errs.email = 'Please provide a valid email address.';
    }
    if (!formData.message.trim()) {
      errs.message = 'Please provide a short description of your project or inquiry.';
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError(null);
    if (!validate()) return;

    setIsSubmitting(true);

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          formType: 'contact',
          name: formData.name.trim(),
          phone: formData.phone.trim(),
          email: formData.email.trim(),
          service: formData.service,
          message: formData.message.trim(),
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Failed to send inquiry. Please try again.');
      }

      // Success: Save snapshot for display and WhatsApp action, then reset form inputs
      setSubmittedSnapshot({ ...formData });
      setSubmitted(true);
      setFormData({
        name: '',
        phone: '',
        email: '',
        service: PROPOSED_SERVICES[0]?.title || 'Residential Construction',
        message: '',
      });
      setErrors({});
    } catch (err: any) {
      console.error('Contact form submission error:', err);
      // Preserve entered values on failure and show error
      setSubmitError(err.message || 'Unable to deliver message right now. Please check your connection or contact us on WhatsApp.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleWhatsAppDirect = () => {
    const target = submittedSnapshot || formData;
    const text = encodeURIComponent(
      `Hello JBR Builders,\n\nI am contacting you from your website regarding *${target.service}*.\n\n*Client Name:* ${target.name || 'Not provided'}\n*Phone:* ${target.phone || 'Not provided'}\n*Email:* ${target.email || 'Not provided'}\n*Project Requirements:*\n${target.message || 'I would like to discuss a construction project.'}`
    );
    window.open(`https://wa.me/${COMPANY_INFO.whatsappNumber}?text=${text}`, '_blank');
  };

  const handleEmailDirect = () => {
    const target = submittedSnapshot || formData;
    const subject = encodeURIComponent(`Website Inquiry: ${target.service} - ${target.name}`);
    const body = encodeURIComponent(
      `To JBR Builders,\n\nName: ${target.name}\nPhone: ${target.phone}\nEmail: ${target.email}\nService: ${target.service}\n\nMessage / Requirements:\n${target.message}\n\nSent via JBR Builders Website`
    );
    window.location.href = `mailto:${COMPANY_INFO.email}?subject=${subject}&body=${body}`;
  };

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
          <span className="text-[#123B68]">Contact & Locations</span>
        </div>

        {/* Page Header */}
        <div className="max-w-4xl mx-auto text-center mb-16 sm:mb-20">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass-pill border border-[#2468A6]/20 text-[#123B68] text-xs font-extrabold uppercase tracking-widest mb-4">
            <Phone className="w-3.5 h-3.5 text-[#2468A6]" />
            <span>Direct Client Desk</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-[#123B68] tracking-tight leading-[1.15]">
            Let’s Build Something <br className="hidden sm:inline" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#2468A6] to-[#0E2E52]">
              Extraordinary Together
            </span>
          </h1>

          <p className="mt-5 text-base sm:text-lg text-[#64748B] max-w-2xl mx-auto leading-relaxed">
            Visit our offices in Tuticorin or Tirunelveli for in-person structural appraisals, or reach out instantly through direct WhatsApp and phone channels.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-stretch mb-20">
          {/* Left Column: Office Locations & Channels */}
          <div className="lg:col-span-5 flex flex-col space-y-6">
            {/* Quick Contact Card */}
            <div className="glass-panel rounded-3xl p-7 sm:p-8 space-y-6 shrink-0">
              <h3 className="text-xl font-extrabold text-[#123B68] border-b border-slate-200/60 pb-3 flex items-center justify-between">
                <span>Immediate Assistance</span>
                <span className="text-xs font-bold text-[#123B68] bg-[#EBF4FC] px-3 py-1 rounded-full border border-[#2468A6]/30">
                  Online Now
                </span>
              </h3>

              {/* Phone Channel */}
              <div className="flex items-start gap-4">
                <div className="w-13 h-13 rounded-2xl bg-gradient-to-br from-[#123B68] to-[#2468A6] text-white flex items-center justify-center shrink-0 shadow-md">
                  <Phone className="w-6 h-6 text-cyan-200" />
                </div>
                <div>
                  <p className="text-xs font-bold text-[#64748B] uppercase tracking-wider">
                    Call Engineering Desk
                  </p>
                  <a
                    href={`tel:${COMPANY_INFO.phoneRaw}`}
                    className="text-xl font-extrabold text-[#123B68] hover:text-[#2468A6] transition-colors block mt-0.5"
                  >
                    {COMPANY_INFO.phone}
                  </a>
                  <p className="text-xs text-[#64748B] mt-0.5">Monday – Saturday: 9:00 AM – 7:00 PM</p>
                </div>
              </div>

              {/* Email Channel */}
              <div className="flex items-start gap-4">
                <div className="w-13 h-13 rounded-2xl bg-gradient-to-br from-[#2468A6] to-[#0E2E52] text-white flex items-center justify-center shrink-0 shadow-md">
                  <Mail className="w-6 h-6 text-cyan-200" />
                </div>
                <div>
                  <p className="text-xs font-bold text-[#64748B] uppercase tracking-wider">
                    Official Email
                  </p>
                  <a
                    href={`mailto:${COMPANY_INFO.email}`}
                    className="text-base font-extrabold text-[#123B68] hover:text-[#2468A6] transition-colors block mt-0.5"
                  >
                    {COMPANY_INFO.email}
                  </a>
                  <p className="text-xs text-[#64748B] mt-0.5">24-hour response turnaround</p>
                </div>
              </div>

              {/* Instant WhatsApp Action */}
              <div className="pt-2">
                <button
                  type="button"
                  onClick={handleWhatsAppDirect}
                  className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-[#123B68] to-[#2468A6] hover:from-[#0E2E52] hover:to-[#1E588D] text-white font-bold text-sm shadow-[0_6px_20px_rgba(36,104,166,0.35)] hover:scale-102 transition-all duration-200 flex items-center justify-center gap-2"
                >
                  <WhatsAppIcon className="w-5 h-5 text-white" />
                  <span>Start WhatsApp Conversation</span>
                </button>
              </div>
            </div>

            {/* Registered Offices: Expanded Height To Match Adjacent Section */}
            {COMPANY_INFO.offices.map((office, idx) => (
              <div
                key={idx}
                className="glass-panel glass-panel-hover rounded-2xl p-4 sm:p-5 relative overflow-hidden group flex-1 flex flex-col justify-between space-y-3"
              >
                <div className="space-y-1 shrink-0">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm sm:text-base font-extrabold text-[#123B68]">
                      {office.city} Office
                    </h4>
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-[#2468A6]/10 text-[#2468A6]">
                      {office.type}
                    </span>
                  </div>

                  <p className="text-[11px] sm:text-xs text-[#64748B] leading-relaxed">
                    {office.address}
                  </p>

                  <div className="flex items-center gap-1.5 text-[11px] font-bold text-[#2468A6] pt-0.5">
                    <Clock className="w-3 h-3" />
                    <span>{COMPANY_INFO.workingHours}</span>
                  </div>
                </div>

                {/* Embedded Map: Flexible & Increased Height */}
                <div className="pt-2 border-t border-slate-200/60 space-y-2 flex-1 flex flex-col justify-between">
                  <div className="relative w-full flex-1 min-h-[180px] sm:min-h-[200px] rounded-xl overflow-hidden border border-slate-200 bg-slate-100 shadow-inner">
                    <iframe
                      title={`${office.city} Office Location Map`}
                      src={`https://maps.google.com/maps?q=${encodeURIComponent(
                        office.address
                      )}&t=&z=15&ie=UTF8&iwloc=&output=embed`}
                      className="absolute inset-0 w-full h-full border-0"
                      loading="lazy"
                      referrerPolicy="no-referrer-when-downgrade"
                    />
                  </div>

                  <a
                    href={(office as { mapsUrl?: string }).mapsUrl || `https://maps.google.com/?q=${encodeURIComponent(office.address)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full shrink-0 py-2 px-3 rounded-lg bg-white/80 hover:bg-white text-[#123B68] hover:text-[#2468A6] font-bold text-[11px] border border-slate-200/90 shadow-2xs hover:shadow-sm transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <MapPin className="w-3 h-3 text-[#2468A6]" />
                    <span>Get Directions on Google Maps</span>
                    <ExternalLink className="w-3 h-3 text-[#64748B]" />
                  </a>
                </div>
              </div>
            ))}
          </div>

          {/* Right Column: Inquiry Form */}
          <div className="lg:col-span-7 flex flex-col justify-between">
            <div id="consultation-form" className="glass-panel rounded-3xl p-8 sm:p-12 relative">
              <h3 className="text-2xl sm:text-3xl font-extrabold text-[#123B68] mb-2 tracking-tight">
                Send a Direct Message
              </h3>
              <p className="text-sm text-[#64748B] mb-8 font-normal">
                Share your proposed project location and brief requirements. Our team will prepare a structured appraisal and schedule an initial consultation.
              </p>

              {submitted ? (
                <div className="p-8 sm:p-10 rounded-2xl bg-[#EBF4FC]/90 border border-blue-200 text-center space-y-4 animate-in fade-in duration-300">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#123B68] to-[#2468A6] text-white flex items-center justify-center mx-auto shadow-md">
                    <CheckCircle2 className="w-9 h-9" />
                  </div>
                  <h4 className="text-2xl font-extrabold text-[#123B68]">
                    Inquiry Prepared Successfully!
                  </h4>
                  <p className="text-sm text-[#64748B] max-w-md mx-auto">
                    Thank you, <strong>{formData.name}</strong>. Choose an instant channel below to dispatch your inquiry directly to our engineering desk:
                  </p>
                  <div className="pt-3 flex flex-wrap justify-center gap-3">
                    <button
                      type="button"
                      onClick={handleWhatsAppDirect}
                      className="px-6 py-3.5 rounded-2xl bg-gradient-to-r from-[#123B68] to-[#2468A6] hover:from-[#0E2E52] hover:to-[#1E588D] text-white font-bold text-sm shadow-md transition-all flex items-center gap-2"
                    >
                      <WhatsAppIcon className="w-4 h-4 text-white" />
                      <span>Send via WhatsApp</span>
                    </button>
                    <button
                      type="button"
                      onClick={handleEmailDirect}
                      className="px-6 py-3.5 rounded-2xl bg-[#123B68] hover:bg-[#0E2E52] text-white font-bold text-sm shadow-md transition-all flex items-center gap-2"
                    >
                      <Mail className="w-4 h-4" />
                      <span>Send via Email Client</span>
                    </button>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-xs font-bold text-[#1E293B] uppercase tracking-wider mb-2">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="e.g. S. Murugan"
                        className="w-full glass-input rounded-2xl px-4 py-3.5 text-sm text-[#1E293B] focus:outline-none"
                      />
                      {errors.name && (
                        <p className="text-xs text-rose-500 mt-1 font-medium">{errors.name}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-[#1E293B] uppercase tracking-wider mb-2">
                        Phone Number *
                      </label>
                      <input
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        placeholder="+91 98765 43210"
                        className="w-full glass-input rounded-2xl px-4 py-3.5 text-sm text-[#1E293B] focus:outline-none"
                      />
                      {errors.phone && (
                        <p className="text-xs text-rose-500 mt-1 font-medium">{errors.phone}</p>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-xs font-bold text-[#1E293B] uppercase tracking-wider mb-2">
                        Email Address (Optional)
                      </label>
                      <input
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="name@example.com"
                        className="w-full glass-input rounded-2xl px-4 py-3.5 text-sm text-[#1E293B] focus:outline-none"
                      />
                      {errors.email && (
                        <p className="text-xs text-rose-500 mt-1 font-medium">{errors.email}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-[#1E293B] uppercase tracking-wider mb-2">
                        Service Category
                      </label>
                      <select
                        value={formData.service}
                        onChange={(e) => setFormData({ ...formData, service: e.target.value })}
                        className="w-full glass-input rounded-2xl px-4 py-3.5 text-sm text-[#1E293B] focus:outline-none cursor-pointer"
                      >
                        {availableServices.map((title) => (
                          <option key={title} value={title}>
                            {title}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#1E293B] uppercase tracking-wider mb-2">
                      Project Details / Spatial Requirements *
                    </label>
                    <textarea
                      rows={5}
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      placeholder="Share details like plot location (Tuticorin, Tirunelveli, or surrounding areas), built-up area in sq.ft, number of floors, planned start date, or specific architectural preferences..."
                      className="w-full glass-input rounded-2xl px-4 py-3.5 text-sm text-[#1E293B] focus:outline-none resize-none"
                    />
                    {errors.message && (
                      <p className="text-xs text-rose-500 mt-1 font-medium">{errors.message}</p>
                    )}
                  </div>

                  {submitError && (
                    <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-xs font-semibold text-rose-700 flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 text-rose-500 shrink-0" />
                      <span>{submitError}</span>
                    </div>
                  )}

                  <div className="pt-2 flex flex-col sm:flex-row items-center gap-3.5">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-2xl bg-gradient-to-r from-[#123B68] to-[#2468A6] hover:from-[#0E2E52] hover:to-[#1E588D] text-white font-bold text-sm shadow-[0_8px_25px_rgba(36,104,166,0.35)] hover:scale-102 transition-all duration-200 disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          <span>Sending Inquiry...</span>
                        </>
                      ) : (
                        <>
                          <Send className="w-4 h-4" />
                          <span>Send Project Inquiry</span>
                        </>
                      )}
                    </button>

                    <button
                      type="button"
                      onClick={handleWhatsAppDirect}
                      className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-4 rounded-2xl bg-[#EBF4FC] hover:bg-[#D6E9FA] text-[#123B68] font-bold text-sm border border-[#2468A6]/30 transition-all duration-200"
                    >
                      <WhatsAppIcon className="w-4 h-4 text-[#2468A6]" />
                      <span>Fast Connect via WhatsApp</span>
                    </button>
                  </div>
                </form>
              )}
            </div>

            {/* Interactive 3D Flip Visiting Card (Fills Empty Space Below Form) */}
            <div className="mt-8 glass-panel rounded-3xl p-6 sm:p-7 space-y-4 border border-white/90 shadow-[0_15px_40px_rgba(18,59,104,0.08)]">
              <div className="flex items-center justify-between border-b border-slate-200/60 pb-3">
                <div className="flex items-center gap-2">
                  <CreditCard className="w-5 h-5 text-[#2468A6]" />
                  <h3 className="text-base sm:text-lg font-extrabold text-[#123B68]">
                    Official Visiting Card
                  </h3>
                </div>
                <span className="text-[11px] font-bold text-[#2468A6] bg-[#EBF4FC] px-3 py-1 rounded-full border border-[#2468A6]/30 flex items-center gap-1.5">
                  <RotateCw className="w-3 h-3 animate-spin" style={{ animationDuration: '4s' }} />
                  <span>{isCardFlipped ? 'Showing Back' : 'Hover to Turn Back'}</span>
                </span>
              </div>

              {/* 3D Flip Card Container */}
              <div
                className="relative w-full max-w-[440px] mx-auto py-2"
                style={{ perspective: '1200px' }}
              >
                <div
                  onMouseEnter={() => setIsCardFlipped(true)}
                  onMouseLeave={() => setIsCardFlipped(false)}
                  onClick={() => setIsCardFlipped(!isCardFlipped)}
                  className="relative w-full aspect-[16/9] cursor-pointer select-none transition-transform duration-700 ease-out shadow-[0_15px_35px_rgba(18,59,104,0.18)] hover:shadow-[0_22px_45px_rgba(36,104,166,0.3)] rounded-2xl"
                  style={{
                    transformStyle: 'preserve-3d',
                    transform: isCardFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
                  }}
                  title="Hover cursor to flip visiting card"
                >
                  {/* Front Face: Royal Blue JBR Builders Emblem */}
                  <div
                    className="absolute inset-0 w-full h-full rounded-2xl overflow-hidden bg-white shadow-inner flex items-center justify-center"
                    style={{
                      backfaceVisibility: 'hidden',
                      WebkitBackfaceVisibility: 'hidden',
                      transform: 'rotateY(0deg)',
                    }}
                  >
                    <img
                      src={visitingFront}
                      alt="JBR Builders Visiting Card Front"
                      className="w-full h-full object-contain rounded-2xl pointer-events-none"
                    />
                  </div>

                  {/* Back Face: White Card with Contact & Office Locations */}
                  <div
                    className="absolute inset-0 w-full h-full rounded-2xl overflow-hidden bg-white shadow-inner flex items-center justify-center"
                    style={{
                      backfaceVisibility: 'hidden',
                      WebkitBackfaceVisibility: 'hidden',
                      transform: 'rotateY(180deg)',
                    }}
                  >
                    <img
                      src={visitingBack}
                      alt="JBR Builders Visiting Card Back"
                      className="w-full h-full object-contain rounded-2xl pointer-events-none"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
