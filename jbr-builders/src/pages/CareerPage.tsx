import React, { useState, useEffect } from 'react';
import {
  Briefcase,
  GraduationCap,
  CheckCircle2,
  Send,
  MapPin,
  Clock,
  Sparkles,
  ChevronRight,
  ChevronDown,
  ShieldCheck,
  Award,
  Compass,
  FileText,
  HelpCircle,
  HardHat,
} from 'lucide-react';
import { Link, useSearchParams } from 'react-router-dom';
import { COMPANY_INFO } from '../data/company';
import { useCMS } from '../context/CMSContext';
import { WhatsAppIcon } from '../components/WhatsAppIcon';

interface OpenPosition {
  id: string;
  title: string;
  department: string;
  location: string;
  type: string;
  experience: string;
  description: string;
  keyResponsibilities: string[];
  requirements: string[];
}

const OPEN_POSITIONS: OpenPosition[] = [
  {
    id: 'senior-site-engineer',
    title: 'Senior Site Engineer (Civil & Structural)',
    department: 'Site Execution & Construction',
    location: 'Tuticorin / Tirunelveli Sites',
    type: 'Full-Time',
    experience: '3 – 6 Years',
    description:
      'Lead on-ground RCC construction, coordinate steel reinforcement verification, enforce pour schedules, and oversee labor productivity for luxury residential and commercial structures.',
    keyResponsibilities: [
      'Day-to-day coordination of foundation, column, slab, and masonry work as per structural drawings',
      'Quality assurance of concrete pours, cube casting, curing regimes, and slump verification',
      'Material inventory tracking, bar-bending schedule reconciliation, and vendor coordination',
      'Enforcing rigorous zero-compromise site safety and worker PPE protocols',
    ],
    requirements: [
      'B.E. / B.Tech or Diploma in Civil Engineering with solid on-site track record',
      'Proficiency in structural blueprint reading, Total Station verification, and BBS',
      'Strong leadership skills with fluency in Tamil and English',
      'Valid driving license for local site travel across Tuticorin/Tirunelveli',
    ],
  },
  {
    id: 'junior-architectural-draughtsman',
    title: 'Junior Architectural Draughtsman & 3D Modeler',
    department: 'Design & Engineering Office',
    location: 'Tuticorin Head Office',
    type: 'Full-Time',
    experience: '1 – 3 Years',
    description:
      'Work alongside our Principal Architect in converting conceptual residential sketches into accurate 2D working permit drawings, high-resolution 3D elevations, and interior walk-throughs.',
    keyResponsibilities: [
      'Preparation of municipality sanction plans, working drawings, and electrical/plumbing layouts',
      'Creating photorealistic 3D exterior facades and elevation renders for prospective clients',
      'Assisting site engineers with design revisions and spatial clarifications',
    ],
    requirements: [
      'Diploma / Degree in Architecture, Civil Engineering, or Interior Design',
      'Demonstrated expertise in AutoCAD, Revit, SketchUp, Lumion / V-Ray',
      'Solid eye for lighting, materials, proportion, and modern South Indian aesthetics',
    ],
  },
  {
    id: 'site-supervisor-qa',
    title: 'Site Quality Supervisor & Quantity Assistant',
    department: 'Quality Assurance & Surveying',
    location: 'Tirunelveli Branch Projects',
    type: 'Full-Time',
    experience: '2 – 4 Years',
    description:
      'Manage daily material reception, conduct on-site dimension checks, verify shuttering plumb lines, and assist senior project managers in stage-wise milestone billing.',
    keyResponsibilities: [
      'Supervise masonry, plastering, waterproofing, and tile laying with millimeter accuracy',
      'Log daily progress reports (DPR), labor headcounts, and equipment utilization',
      'Coordinate with client representatives during weekly structural inspection visits',
    ],
    requirements: [
      'Diploma in Civil Engineering (DCE) or equivalent vocational construction qualification',
      'Hands-on experience in residential finishing, false ceilings, and plumbing lines',
      'Meticulous attention to detail and proactive communication style',
    ],
  },
];

const FAQS = [
  {
    q: 'How does the selection process work for experienced positions?',
    a: 'We review your profile within 48 hours. Shortlisted candidates are invited for an initial technical discussion with our Principal Engineer, followed by a brief on-site walkthrough appraisal to assess ground practical knowledge.',
  },
  {
    q: 'Are final-year civil engineering and architecture students eligible for internships?',
    a: 'Yes! We run regular 1-month, 3-month, and 6-month practical site internship cohorts. We welcome students from polytechnic diplomas, B.E., B.Tech, and B.Arch programs across Tamil Nadu.',
  },
  {
    q: 'Do you offer Pre-Placement Offers (PPO) to exceptional interns?',
    a: 'Absolutely. Many of our current Junior Project Engineers and Draughtsmen began their journey as JBR Builders interns and were extended full-time placement offers upon graduating.',
  },
  {
    q: 'Is safety gear provided on site?',
    a: 'Yes, all employees and interns receive official JBR Builders safety equipment including hard hats, high-visibility reflective vests, and safety goggles upon onboarding.',
  },
  {
    q: 'What is the typical work schedule and on-site reporting protocol?',
    a: 'Our construction projects operate Monday through Saturday from 8:30 AM to 5:30 PM. Site engineers participate in a 15-minute daily morning briefing to coordinate rebar inspections, concrete pours, and subcontractor milestone schedules.',
  },
  {
    q: 'What digital tools and software are commonly used across projects?',
    a: 'For architectural drafting and planning, proficiency in AutoCAD and 3ds Max/Revit is preferred. On-site project managers use digital WhatsApp progress logs, cloud media folders, and standard quantity surveying spreadsheets for daily structural tracking.',
  },
];

export const CareerPage: React.FC = () => {
  const { company, internshipProgram, interns } = useCMS();
  const currentCompany = company || COMPANY_INFO;

  const [searchParams] = useSearchParams();
  const initialTab = searchParams.get('tab') === 'internships' ? 'internships' : 'positions';
  const initialRole = searchParams.get('role');

  const [activeTab, setActiveTab] = useState<'positions' | 'internships'>(initialTab);
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  const toggleFaq = (index: number) => {
    setOpenFaqIndex((prev) => (prev === index ? null : index));
  };

  // Application form state
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    roleType: initialRole || 'Senior Site Engineer (Civil & Structural)',
    experience: '3-5 years',
    location: 'Tuticorin / Tirunelveli',
    message: '',
  });

  useEffect(() => {
    const roleParam = searchParams.get('role');
    const tabParam = searchParams.get('tab');
    if (tabParam === 'internships' || tabParam === 'positions') {
      setActiveTab(tabParam);
    }
    if (roleParam) {
      setFormData((prev) => ({ ...prev, roleType: roleParam }));
      const formEl = document.getElementById('application-form');
      if (formEl) {
        formEl.scrollIntoView({ behavior: 'smooth' });
      }
    }
  }, [searchParams]);

  const handleSelectRoleForForm = (roleTitle: string) => {
    setFormData((prev) => ({ ...prev, roleType: roleTitle }));
    const formEl = document.getElementById('application-form');
    if (formEl) {
      formEl.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!formData.name.trim()) errs.name = 'Full name is required.';
    if (!formData.phone.trim()) {
      errs.phone = 'Phone number is required.';
    } else if (!/^[0-9+\s-]{8,15}$/.test(formData.phone.trim())) {
      errs.phone = 'Please enter a valid phone number.';
    }
    if (formData.email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      errs.email = 'Please provide a valid email address.';
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleApplyWhatsApp = (roleTitle?: string) => {
    const role = roleTitle || formData.roleType;
    const text = encodeURIComponent(
      `Hello JBR Builders Talent Desk,\n\nI am contacting you regarding career opportunities at JBR Builders.\n\n*Applicant Name:* ${formData.name || 'Candidate'}\n*Position / Interest:* ${role}\n*Phone:* ${formData.phone || 'Provided upon chat'}\n*Email:* ${formData.email || 'Provided upon chat'}\n*Experience / Background:* ${formData.experience}\n*Preferred Location:* ${formData.location}\n*Summary / Portfolio:* ${formData.message || 'I would like to submit my resume for review.'}`
    );
    window.open(`https://wa.me/${currentCompany.whatsappNumber}?text=${text}`, '_blank');
  };

  const handleApplyEmail = (roleTitle?: string) => {
    const role = roleTitle || formData.roleType;
    const subject = encodeURIComponent(`Job Application: ${role} - ${formData.name || 'Candidate'}`);
    const body = encodeURIComponent(
      `To JBR Builders Recruitment Desk,\n\nName: ${formData.name}\nPhone: ${formData.phone}\nEmail: ${formData.email}\nTarget Position: ${role}\nExperience Level: ${formData.experience}\nPreferred Location: ${formData.location}\n\nBrief Cover Note / Qualifications:\n${formData.message}\n\n(Resume / portfolio attached via email)`
    );
    window.location.href = `mailto:${currentCompany.email}?subject=${subject}&body=${body}`;
  };

  const handleSubmitForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setSubmitted(true);
  };

  return (
    <div className="pt-24 sm:pt-28 pb-20 relative overflow-hidden blueprint-grid">
      {/* Ambient background glows */}
      <div className="absolute top-20 -left-40 w-96 h-96 bg-[#2468A6]/12 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute top-1/2 -right-40 w-[500px] h-[500px] bg-[#123B68]/12 rounded-full blur-[140px] pointer-events-none" />

      <div className="container-custom relative z-10">
        {/* Breadcrumb Navigation */}
        <div className="flex items-center gap-2 text-xs font-bold text-[#64748B] mb-6">
          <Link to="/" className="hover:text-[#123B68] transition-colors">
            Home
          </Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-[#123B68]">Careers & Internships</span>
        </div>

        {/* Page Hero Header */}
        <div className="max-w-4xl mx-auto text-center mb-16 sm:mb-20">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass-pill border border-[#2468A6]/20 text-[#123B68] text-xs font-extrabold uppercase tracking-widest mb-4">
            <Briefcase className="w-3.5 h-3.5 text-[#2468A6]" />
            <span>JBR Talent & Internship Desk</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-[#123B68] tracking-tight leading-[1.15]">
            Build Your Career With <br className="hidden sm:inline" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#2468A6] to-[#0E2E52]">
              Tamil Nadu’s Elite Builders
            </span>
          </h1>

          <p className="mt-5 text-base sm:text-lg text-[#64748B] max-w-2xl mx-auto leading-relaxed">
            Join a civil construction firm where engineering precision, on-site safety, and genuine craftsmanship take precedence. We are actively hiring experienced engineers, supervisors, and nurturing future talent through our structured internship cohorts.
          </p>

          {/* Quick Pillar Stat Chips */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white/80 border border-slate-200 text-xs font-bold text-[#123B68] shadow-2xs">
              <HardHat className="w-3.5 h-3.5 text-[#2468A6]" />
              Practical Site Authority
            </span>
            <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white/80 border border-slate-200 text-xs font-bold text-[#123B68] shadow-2xs">
              <Award className="w-3.5 h-3.5 text-[#2468A6]" />
              Structured PPO Pathways
            </span>
            <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white/80 border border-slate-200 text-xs font-bold text-[#123B68] shadow-2xs">
              <ShieldCheck className="w-3.5 h-3.5 text-[#2468A6]" />
              Safety-First Culture
            </span>
            <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white/80 border border-slate-200 text-xs font-bold text-[#123B68] shadow-2xs">
              <MapPin className="w-3.5 h-3.5 text-[#2468A6]" />
              Tuticorin & Tirunelveli
            </span>
          </div>
        </div>

        {/* Section Navigation Tabs */}
        <div className="flex items-center justify-center gap-3 mb-12">
          <button
            type="button"
            onClick={() => setActiveTab('positions')}
            className={`flex items-center gap-2 px-6 py-3 rounded-full text-sm font-extrabold transition-all duration-300 cursor-pointer shadow-xs ${
              activeTab === 'positions'
                ? 'bg-gradient-to-r from-[#123B68] to-[#2468A6] text-white shadow-[0_6px_20px_rgba(36,104,166,0.3)]'
                : 'bg-white/80 hover:bg-white text-[#64748B] hover:text-[#123B68] border border-slate-200/80'
            }`}
          >
            <Briefcase className="w-4 h-4" />
            <span>Full-Time Positions ({OPEN_POSITIONS.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('internships')}
            className={`flex items-center gap-2 px-6 py-3 rounded-full text-sm font-extrabold transition-all duration-300 cursor-pointer shadow-xs ${
              activeTab === 'internships'
                ? 'bg-gradient-to-r from-[#123B68] to-[#2468A6] text-white shadow-[0_6px_20px_rgba(36,104,166,0.3)]'
                : 'bg-white/80 hover:bg-white text-[#64748B] hover:text-[#123B68] border border-slate-200/80'
            }`}
          >
            <GraduationCap className="w-4 h-4" />
            <span>Civil & Arch Internships</span>
          </button>
        </div>

        {/* TAB 1: Experienced Positions */}
        {activeTab === 'positions' && (
          <div className="space-y-8 mb-20 animate-in fade-in duration-300">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
              {OPEN_POSITIONS.map((job) => (
                <div
                  key={job.id}
                  className="glass-panel glass-panel-hover rounded-3xl p-7 flex flex-col justify-between relative group border border-white/90"
                >
                  <div className="space-y-4">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-[10px] font-extrabold uppercase tracking-widest px-3 py-1 rounded-full bg-[#2468A6]/10 text-[#2468A6] border border-[#2468A6]/20">
                        {job.department}
                      </span>
                      <span className="text-xs font-bold text-slate-500 bg-slate-100 px-2.5 py-0.5 rounded-full">
                        {job.type}
                      </span>
                    </div>

                    <h3 className="text-xl font-extrabold text-[#123B68] group-hover:text-[#2468A6] transition-colors leading-snug">
                      {job.title}
                    </h3>

                    <div className="flex flex-wrap items-center gap-y-1 gap-x-4 text-xs text-[#64748B] font-medium">
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-[#2468A6]" />
                        {job.location}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-[#2468A6]" />
                        {job.experience}
                      </span>
                    </div>

                    <p className="text-xs text-[#64748B] leading-relaxed line-clamp-3">
                      {job.description}
                    </p>

                    <div className="pt-2 border-t border-slate-200/60">
                      <p className="text-[11px] font-extrabold uppercase tracking-wider text-[#123B68] mb-2">
                        Key Responsibilities:
                      </p>
                      <ul className="space-y-1.5 text-xs text-[#64748B]">
                        {job.keyResponsibilities.slice(0, 3).map((resp, i) => (
                          <li key={i} className="flex items-start gap-1.5">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                            <span>{resp}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <div className="pt-6 mt-6 border-t border-slate-200/60 flex flex-wrap items-center gap-2">
                    <button
                      type="button"
                      onClick={() => handleApplyWhatsApp(job.title)}
                      className="flex-1 py-2.5 px-3 rounded-xl bg-gradient-to-r from-[#123B68] to-[#2468A6] hover:from-[#0E2E52] hover:to-[#1E588D] text-white font-bold text-xs shadow-sm transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <WhatsAppIcon className="w-3.5 h-3.5 text-white" />
                      <span>Apply via WhatsApp</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => handleSelectRoleForForm(job.title)}
                      className="py-2.5 px-3 rounded-xl bg-white hover:bg-slate-50 text-[#123B68] font-bold text-xs border border-slate-200 shadow-2xs transition-all flex items-center justify-center gap-1 cursor-pointer"
                      title="Fill Application Form below"
                    >
                      <Send className="w-3.5 h-3.5 text-[#2468A6]" />
                      <span>Online Form</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => handleApplyEmail(job.title)}
                      className="py-2.5 px-3 rounded-xl bg-[#EBF4FC] hover:bg-[#D6E9FA] text-[#123B68] font-bold text-xs border border-[#2468A6]/20 transition-all flex items-center justify-center gap-1 cursor-pointer"
                      title="Apply via Email"
                    >
                      <FileText className="w-3.5 h-3.5 text-[#2468A6]" />
                      <span>Email</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Why Work With Us Banner */}
            <div className="glass-panel rounded-3xl p-8 sm:p-12 relative overflow-hidden bg-gradient-to-br from-white/95 to-[#EBF4FC]/70 border border-blue-100">
              <div className="max-w-3xl">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#123B68] text-white text-[11px] font-extrabold uppercase tracking-widest mb-3">
                  <Sparkles className="w-3.5 h-3.5 text-cyan-300" />
                  <span>The JBR Builder Standard</span>
                </div>
                <h3 className="text-2xl sm:text-3xl font-extrabold text-[#123B68] tracking-tight">
                  Why Civil Professionals Thrive at JBR Builders
                </h3>
                <p className="mt-3 text-sm text-[#64748B] leading-relaxed">
                  We don’t trap talented engineers behind cubicles. You will inspect live ready-mix concrete pours, operate digital Total Stations, negotiate directly with trusted regional suppliers, and see the immediate fruits of your structural calculations as residences rise across the coastline.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mt-6">
                  <div className="p-4 rounded-2xl bg-white/80 border border-slate-200/80">
                    <p className="text-sm font-extrabold text-[#123B68]">Transparent Ethics</p>
                    <p className="text-xs text-[#64748B] mt-1">High-grade materials, no corners cut, and total pride in finished handovers.</p>
                  </div>
                  <div className="p-4 rounded-2xl bg-white/80 border border-slate-200/80">
                    <p className="text-sm font-extrabold text-[#123B68]">Direct Mentorship</p>
                    <p className="text-xs text-[#64748B] mt-1">Direct daily counsel from our Founder-Principal Architect and structural leads.</p>
                  </div>
                  <div className="p-4 rounded-2xl bg-white/80 border border-slate-200/80">
                    <p className="text-sm font-extrabold text-[#123B68]">Competitive Rewards</p>
                    <p className="text-xs text-[#64748B] mt-1">Timely industry-leading remuneration with site performance bonuses.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: Internships Program */}
        {activeTab === 'internships' && (
          <div className="space-y-10 mb-20 animate-in fade-in duration-300">
            {/* Internship Overview Card */}
            <div className="glass-panel rounded-3xl p-8 sm:p-12 border border-white/90">
              <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 pb-8 border-b border-slate-200/60">
                <div className="space-y-3 max-w-2xl">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-extrabold uppercase tracking-wider">
                    <GraduationCap className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Now Enrolling: Summer & Semester Cohorts</span>
                  </div>
                  <h2 className="text-2xl sm:text-4xl font-extrabold text-[#123B68] tracking-tight">
                    {internshipProgram.title}
                  </h2>
                  <p className="text-sm text-[#64748B] leading-relaxed">
                    {internshipProgram.description}
                  </p>
                </div>

                <div className="shrink-0 space-y-2.5 w-full sm:w-auto">
                  <button
                    type="button"
                    onClick={() => handleApplyWhatsApp('Civil Engineering Site Internship')}
                    className="w-full sm:w-auto py-3.5 px-6 rounded-2xl bg-gradient-to-r from-[#123B68] to-[#2468A6] hover:from-[#0E2E52] hover:to-[#1E588D] text-white font-bold text-sm shadow-[0_6px_20px_rgba(36,104,166,0.35)] transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <WhatsAppIcon className="w-4 h-4 text-white" />
                    <span>Apply for Internship via WhatsApp</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleSelectRoleForForm('Civil Engineering Site Internship (1-6 Months)')}
                    className="w-full sm:w-auto py-2.5 px-6 rounded-2xl bg-white hover:bg-slate-50 text-[#123B68] font-bold text-xs border border-slate-200 shadow-2xs transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Send className="w-3.5 h-3.5 text-[#2468A6]" />
                    <span>Apply via Online Form Below</span>
                  </button>
                  <p className="text-center text-[11px] text-[#64748B]">
                    Duration: 1 Month • 3 Months • 6 Months
                  </p>
                </div>
              </div>

              {/* Training Modules Grid */}
              <div className="pt-8">
                <h3 className="text-lg font-extrabold text-[#123B68] mb-6 flex items-center gap-2">
                  <Compass className="w-5 h-5 text-[#2468A6]" />
                  <span>Practical Field Training Syllabus</span>
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  {internshipProgram.modules.map((mod, i) => (
                    <div
                      key={i}
                      className="p-5 rounded-2xl bg-white/70 border border-slate-200/70 hover:border-[#2468A6]/40 transition-colors space-y-2"
                    >
                      <div className="flex items-center gap-3">
                        <span className="w-7 h-7 rounded-lg bg-gradient-to-br from-[#123B68] to-[#2468A6] text-white font-extrabold text-xs flex items-center justify-center shrink-0">
                          {i + 1}
                        </span>
                        <h4 className="text-sm font-extrabold text-[#123B68]">
                          {mod.title}
                        </h4>
                      </div>
                      <p className="text-xs text-[#64748B] pl-10 leading-relaxed">
                        {mod.desc}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Eligibility & Benefits Split */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-8 mt-8 border-t border-slate-200/60">
                <div className="p-6 rounded-2xl bg-[#F8FAFC] border border-slate-200/80 space-y-3">
                  <h4 className="text-sm font-extrabold text-[#123B68] uppercase tracking-wider flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#2468A6]" />
                    <span>Eligibility Requirements</span>
                  </h4>
                  <ul className="space-y-2 text-xs text-[#64748B]">
                    {internshipProgram.eligibility.map((item, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#2468A6] shrink-0 mt-1.5" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="p-6 rounded-2xl bg-[#EBF4FC]/60 border border-blue-200/60 space-y-3">
                  <h4 className="text-sm font-extrabold text-[#123B68] uppercase tracking-wider flex items-center gap-2">
                    <Award className="w-4 h-4 text-[#2468A6]" />
                    <span>What You Receive</span>
                  </h4>
                  <ul className="space-y-2 text-xs text-[#64748B]">
                    {internshipProgram.benefits.map((item, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 shrink-0 mt-1.5" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            {/* Intern Spotlight Cards */}
            {interns && interns.length > 0 && (
              <div>
                <div className="text-center max-w-xl mx-auto mb-8">
                  <h3 className="text-2xl font-extrabold text-[#123B68]">
                    Intern Success Stories & Field Alumni
                  </h3>
                  <p className="text-xs text-[#64748B] mt-1">
                    Meet aspiring engineers who gained hands-on site mastery at JBR Builders.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {interns.map((intern) => (
                    <div
                      key={intern.id}
                      className="glass-panel rounded-2xl p-6 border border-slate-200/80 space-y-4"
                    >
                      <div className="flex items-center gap-3.5">
                        <img
                          src={intern.image}
                          alt={intern.name}
                          className="w-14 h-14 rounded-2xl object-cover border-2 border-[#2468A6]/30 shadow-sm"
                        />
                        <div>
                          <h4 className="text-sm font-extrabold text-[#123B68]">
                            {intern.name}
                          </h4>
                          <p className="text-[11px] font-semibold text-[#2468A6]">
                            {intern.institution || (intern as any).college}
                          </p>
                          <span className="inline-block mt-1 text-[10px] font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md">
                            {intern.duration}
                          </span>
                        </div>
                      </div>

                      <div className="text-xs text-[#64748B] space-y-1.5 pt-2 border-t border-slate-200/60">
                        <p>
                          <strong>Focus Area:</strong> {intern.focusArea}
                        </p>
                        <p className="text-[11px] italic">
                          "{intern.learningHighlights[0]}"
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Application Desk Form */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start mb-20">
          <div className="lg:col-span-5 space-y-6">
            <div className="glass-panel rounded-3xl p-7 sm:p-8 space-y-5">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#EBF4FC] border border-[#2468A6]/20 text-[#123B68] text-xs font-bold">
                <Send className="w-3.5 h-3.5 text-[#2468A6]" />
                <span>Direct Recruitment Desk</span>
              </div>

              <h3 className="text-2xl font-extrabold text-[#123B68] tracking-tight">
                Submit Your Profile or Resume
              </h3>

              <p className="text-xs sm:text-sm text-[#64748B] leading-relaxed">
                Whether applying for an engineering vacancy or an internship cohort, fill out your details. You can dispatch immediately to our recruitment WhatsApp line or official engineering email.
              </p>

              <div className="p-4 rounded-2xl bg-white/70 border border-slate-200/80 space-y-2">
                <p className="text-xs font-bold text-[#123B68] uppercase tracking-wider">
                  Direct Talent Helpline:
                </p>
                <a
                  href={`tel:${currentCompany.phoneRaw}`}
                  className="text-lg font-extrabold text-[#123B68] hover:text-[#2468A6] transition-colors block"
                >
                  {currentCompany.phone}
                </a>
                <p className="text-[11px] text-[#64748B]">
                  Official Email:{' '}
                  <a
                    href={`mailto:${currentCompany.email}`}
                    className="font-bold text-[#2468A6] hover:underline"
                  >
                    {currentCompany.email}
                  </a>
                </p>
              </div>

              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => handleApplyWhatsApp()}
                  className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-[#123B68] to-[#2468A6] hover:from-[#0E2E52] hover:to-[#1E588D] text-white font-bold text-xs sm:text-sm shadow-md transition-all flex items-center justify-center gap-2"
                >
                  <WhatsAppIcon className="w-4 h-4 text-white" />
                  <span>Quick Connect via WhatsApp</span>
                </button>
              </div>
            </div>
          </div>

          <div className="lg:col-span-7">
            <div className="glass-panel rounded-3xl p-8 sm:p-10 relative">
              <h3 className="text-xl sm:text-2xl font-extrabold text-[#123B68] mb-1 tracking-tight">
                Candidate Application Form
              </h3>
              <p className="text-xs text-[#64748B] mb-6">
                Tell us about your experience and the role or internship duration you are targeting.
              </p>

              {submitted ? (
                <div className="p-8 rounded-2xl bg-[#EBF4FC]/90 border border-blue-200 text-center space-y-4">
                  <div className="w-14 h-14 rounded-full bg-gradient-to-br from-[#123B68] to-[#2468A6] text-white flex items-center justify-center mx-auto shadow-md">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  <h4 className="text-xl font-extrabold text-[#123B68]">
                    Application Details Prepared!
                  </h4>
                  <p className="text-xs text-[#64748B] max-w-md mx-auto">
                    Thank you, <strong>{formData.name}</strong>. Choose an instant channel below to dispatch your profile directly to our hiring panel:
                  </p>
                  <div className="pt-2 flex flex-wrap justify-center gap-3">
                    <button
                      type="button"
                      onClick={() => handleApplyWhatsApp()}
                      className="px-6 py-3 rounded-2xl bg-gradient-to-r from-[#123B68] to-[#2468A6] hover:from-[#0E2E52] hover:to-[#1E588D] text-white font-bold text-xs shadow-md transition-all flex items-center gap-2"
                    >
                      <WhatsAppIcon className="w-4 h-4 text-white" />
                      <span>Dispatch via WhatsApp</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => handleApplyEmail()}
                      className="px-6 py-3 rounded-2xl bg-[#123B68] hover:bg-[#0E2E52] text-white font-bold text-xs shadow-md transition-all flex items-center gap-2"
                    >
                      <FileText className="w-4 h-4" />
                      <span>Send via Email Client</span>
                    </button>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmitForm} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-[#1E293B] uppercase tracking-wider mb-1.5">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="e.g. Vignesh Ram"
                        className="w-full glass-input rounded-2xl px-4 py-3 text-sm text-[#1E293B] focus:outline-none"
                      />
                      {errors.name && (
                        <p className="text-xs text-rose-500 mt-1">{errors.name}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-[#1E293B] uppercase tracking-wider mb-1.5">
                        Phone Number *
                      </label>
                      <input
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        placeholder="+91 98765 43210"
                        className="w-full glass-input rounded-2xl px-4 py-3 text-sm text-[#1E293B] focus:outline-none"
                      />
                      {errors.phone && (
                        <p className="text-xs text-rose-500 mt-1">{errors.phone}</p>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-[#1E293B] uppercase tracking-wider mb-1.5">
                        Email Address
                      </label>
                      <input
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="vignesh@example.com"
                        className="w-full glass-input rounded-2xl px-4 py-3 text-sm text-[#1E293B] focus:outline-none"
                      />
                      {errors.email && (
                        <p className="text-xs text-rose-500 mt-1">{errors.email}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-[#1E293B] uppercase tracking-wider mb-1.5">
                        Target Role / Program
                      </label>
                      <select
                        value={formData.roleType}
                        onChange={(e) => setFormData({ ...formData, roleType: e.target.value })}
                        className="w-full glass-input rounded-2xl px-4 py-3 text-sm text-[#1E293B] focus:outline-none cursor-pointer"
                      >
                        {[
                          formData.roleType,
                          'Senior Site Engineer (Civil & Structural)',
                          'Junior Architectural Draughtsman & 3D Modeler',
                          'Site Quality Supervisor & Quantity Assistant',
                          'Civil Engineering Site Internship (1-6 Months)',
                          'Architectural Drawing Internship',
                          'General Engineering Inquiry',
                        ]
                          .filter((val, idx, arr) => arr.indexOf(val) === idx)
                          .map((role) => (
                            <option key={role} value={role}>
                              {role}
                            </option>
                          ))}
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-[#1E293B] uppercase tracking-wider mb-1.5">
                        Experience / College Batch
                      </label>
                      <input
                        type="text"
                        value={formData.experience}
                        onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
                        placeholder="e.g. 3 Yrs Exp or Final Year B.E. (2026)"
                        className="w-full glass-input rounded-2xl px-4 py-3 text-sm text-[#1E293B] focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-[#1E293B] uppercase tracking-wider mb-1.5">
                        Preferred Location
                      </label>
                      <select
                        value={formData.location}
                        onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                        className="w-full glass-input rounded-2xl px-4 py-3 text-sm text-[#1E293B] focus:outline-none cursor-pointer"
                      >
                        <option value="Tuticorin">Tuticorin Office / Sites</option>
                        <option value="Tirunelveli">Tirunelveli Office / Sites</option>
                        <option value="Both / Flexible">Both / Flexible Across Southern TN</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#1E293B] uppercase tracking-wider mb-1.5">
                      Brief Message & Qualifications / Portfolio Link
                    </label>
                    <textarea
                      rows={4}
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      placeholder="Mention your key technical strengths (e.g., Total Station, BBS, AutoCAD, site supervision experience) or share a link to your Google Drive resume..."
                      className="w-full glass-input rounded-2xl px-4 py-3 text-sm text-[#1E293B] focus:outline-none resize-none"
                    />
                  </div>

                  <div className="pt-2 flex flex-col sm:flex-row items-center gap-3">
                    <button
                      type="submit"
                      className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-2xl bg-gradient-to-r from-[#123B68] to-[#2468A6] hover:from-[#0E2E52] hover:to-[#1E588D] text-white font-bold text-sm shadow-[0_6px_20px_rgba(36,104,166,0.35)] transition-all"
                    >
                      <Send className="w-4 h-4" />
                      <span>Submit Application Details</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleApplyWhatsApp()}
                      className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-2xl bg-[#EBF4FC] hover:bg-[#D6E9FA] text-[#123B68] font-bold text-sm border border-[#2468A6]/20 transition-all"
                    >
                      <WhatsAppIcon className="w-4 h-4 text-[#2468A6]" />
                      <span>Chat with HR via WhatsApp</span>
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>

        {/* FAQs Interactive Accordion */}
        <div className="max-w-3xl mx-auto pt-6 border-t border-slate-200/60">
          <div className="text-center mb-8">
            <h3 className="text-2xl font-extrabold text-[#123B68] flex items-center justify-center gap-2">
              <HelpCircle className="w-5 h-5 text-[#2468A6]" />
              <span>Frequently Asked Career Questions</span>
            </h3>
            <p className="text-xs sm:text-sm text-[#64748B] mt-1.5">
              Click any question below to expand or collapse details.
            </p>
          </div>

          <div className="space-y-3.5">
            {FAQS.map((faq, i) => {
              const isOpen = openFaqIndex === i;
              return (
                <div
                  key={i}
                  className={`glass-panel rounded-2xl border transition-all duration-300 overflow-hidden ${
                    isOpen
                      ? 'border-[#2468A6]/40 shadow-md bg-white/95'
                      : 'border-slate-200/70 hover:border-[#2468A6]/30 hover:bg-white/80'
                  }`}
                >
                  <button
                    type="button"
                    onClick={() => toggleFaq(i)}
                    aria-expanded={isOpen}
                    className="w-full p-5 sm:p-6 text-left flex items-center justify-between gap-4 cursor-pointer select-none"
                  >
                    <h4 className={`text-sm sm:text-base font-extrabold transition-colors leading-snug ${
                      isOpen ? 'text-[#2468A6]' : 'text-[#123B68]'
                    }`}>
                      {faq.q}
                    </h4>
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 transition-transform duration-300 ${
                      isOpen ? 'bg-[#2468A6]/10 text-[#2468A6] rotate-180' : 'bg-slate-100 text-[#64748B]'
                    }`}>
                      <ChevronDown className="w-4 h-4" />
                    </div>
                  </button>

                  <div
                    className={`grid transition-all duration-300 ease-in-out ${
                      isOpen ? 'grid-rows-[1fr] opacity-100 px-5 sm:px-6 pb-5 sm:pb-6' : 'grid-rows-[0fr] opacity-0 px-5 sm:px-6 pb-0'
                    }`}
                  >
                    <div className="overflow-hidden">
                      <div className="pt-3 border-t border-slate-100">
                        <p className="text-xs sm:text-sm text-[#64748B] leading-relaxed">
                          {faq.a}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
