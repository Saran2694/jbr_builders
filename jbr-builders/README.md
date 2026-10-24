# JBR Builders — Official Web Application

> **"LISTEN BETTER • PLAN BETTER • BUILD BETTER"**  
> *Building Your Vision. Creating Your Future.*

[![React Version](https://img.shields.io/badge/React-19.2.8-blue.svg)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-6.0.2-3178C6.svg)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-8.3.0-646CFF.svg)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4.3.3-38B2AC.svg)](https://tailwindcss.com/)
[![React Router](https://img.shields.io/badge/React_Router-v7.18.4-CA4245.svg)](https://reactrouter.com/)
[![License](https://img.shields.io/badge/License-Private-lightgrey.svg)]()

---

## 📌 Table of Contents

1. [About The Project](#-about-the-project)
2. [Core Company Philosophy](#-core-company-philosophy)
3. [Key Features & User Experience](#-key-features--user-experience)
4. [Technology Stack](#-technology-stack)
5. [Project Architecture & Directory Structure](#-project-architecture--directory-structure)
6. [Detailed Page Breakdown](#-detailed-page-breakdown)
7. [Components & Interactive UI](#-components--interactive-ui)
8. [Data Architecture & Content Management](#-data-architecture--content-management)
9. [Design System & Styling](#-design-system--styling)
10. [Getting Started & Local Development](#-getting-started--local-development)
11. [Configuration & Customization Guide](#-configuration--customization-guide)
12. [Company & Contact Details](#-company--contact-details)

---

## 🏗️ About The Project

**JBR Builders** is a modern, high-performance web platform built for **JBR Builders**, a premier civil engineering, architectural design, and construction enterprise headquartered in **Tuticorin** with a branch office in **Tirunelveli, Tamil Nadu, India**.

The application serves as a comprehensive digital showcase and client engagement portal for:
- Individual homeowners seeking custom villa and residential construction.
- Commercial enterprises, retail showrooms, and office spaces.
- Turnkey structural solutions from foundation excavation to key handover.
- Architectural planning, 2D floor layouts, and 3D elevation renderings.
- Engineering and architecture students applying for hands-on site internship programs.

Designed with a sleek **luxury glassmorphic pure blue & white aesthetic**, smooth transitions, responsive multi-page routing, interactive quote estimation modals, and seamless WhatsApp communication triggers, the web app delivers an engaging, trustworthy, and modern digital presence.

---

## 💡 Core Company Philosophy

The platform centers around JBR Builders' foundational three-pillar operational motto:

| Pillar | Principle | Implementation in Platform |
| :--- | :--- | :--- |
| **LISTEN BETTER** | Understanding family lifestyles, spatial needs, budget allocations, and site boundaries without assumptions. | Interactive consultation forms, preselected service queries, and direct WhatsApp channels. |
| **PLAN BETTER** | Developing millimeter-accurate 2D plans, 3D elevation renders, structural load calculations, and itemized BOQs. | Detailed service workflows, structural compliance descriptions, and project breakdown views. |
| **BUILD BETTER** | Executing with licensed civil supervisors, premium grade materials, seismic-resistant RCC, and on-time handovers. | Transparent photo archives, ceremonial handover documentation, and team qualification profiles. |

---

## 🌟 Key Features & User Experience

- **⚡ Blazing Fast Single Page Architecture (SPA)**: Powered by Vite 8 and React 19 for instantaneous page loads, hot module reloading (HMR), and optimized bundle output.
- **🧭 Multi-Page Client Routing**: Powered by React Router DOM v7, providing discrete, deep-linkable URLs for Home, About Us, Services, Projects, Gallery, and Contact pages with automatic scroll-to-top on route changes.
- **💎 Luxury Glassmorphism Design System**: Built with Tailwind CSS v4 featuring translucent frosted glass panels (`glass-panel`), subtle border glows, custom blueprint grid backgrounds (`blueprint-grid`), and modern sans typography (`Plus Jakarta Sans`).
- **💬 Direct WhatsApp Engagement**:
  - Persistent bottom-corner floating action button (`FloatingWhatsApp`) with pulse animations and frosted-glass tooltip.
  - Contextual WhatsApp dispatchers on Contact and Internship sections that automatically construct pre-filled project inquiry text.
- **📋 Universal Project Quote / Consultation Modal**:
  - Global `QuoteModal` accessible from anywhere (Navbar, Hero, Services, Footer).
  - Preselects services when initiated from individual service action buttons.
  - Form validation with name, phone number, email, and scope inputs.
- **🖼️ High-Resolution Lightbox Modal**:
  - Accessible `LightboxModal` for architectural photography and on-site works.
  - Previous/Next navigation, image counter badges, category tags, and escape key handling.
- **🎓 Student Internship & Campus Recruitment Hub**:
  - Dedicated segment showcasing civil engineering and architectural internships.
  - Module syllabus (Site Execution, Concrete QA/QC, Bar Bending BBS, Estimation).
  - Pre-placement offers (PPO) tracking and one-click WhatsApp application formatting.
- **🏢 Dual Office Presence**:
  - Clear addresses, working hours, and communication channels for both Tuticorin Head Office and Tirunelveli Branch Office.

---

## 💻 Technology Stack

### Core Framework & Runtime
- **[React 19.2](https://react.dev/)**: Latest React release leveraging modern functional paradigms and hooks.
- **[TypeScript 6.0](https://www.typescriptlang.org/)**: Strong typing across all data models, component props, and event handlers.
- **[Vite 8.3](https://vitejs.dev/)**: Next-generation frontend tooling and ultra-fast dev server.

### Routing & Navigation
- **[React Router DOM 7.18](https://reactrouter.com/)**: Multi-page routing, declarative route declarations, and navigation state.

### Styling & Design
- **[Tailwind CSS 4.3](https://tailwindcss.com/)**: Cutting-edge CSS engine with `@theme` token definitions and custom glass utilities.
- **[@tailwindcss/vite](https://tailwindcss.com/docs/vite)**: Direct Vite plugin integration for instant Tailwind compilation.
- **[Lucide React 1.57](https://lucide.dev/)**: High-utility, lightweight SVG icons.
- **Google Fonts**:
  - `Plus Jakarta Sans`: Clean, modern corporate geometric sans-serif for body and headers.
  - `Space Grotesk`: Bold tech/architectural accent typeface.

### Code Quality & Tooling
- **[Oxlint 1.81](https://oxc.rs/)**: High-performance JavaScript/TypeScript linter configured via `.oxlintrc.json`.
- **PostCSS & Autoprefixer**: Cross-browser CSS compatibility.

---

## 📂 Project Architecture & Directory Structure

```text
jbr-builders/
├── public/
│   ├── favicon.svg             # Website tab icon
│   ├── icons.svg               # SVG asset definitions
│   ├── images/                 # Static project, team, and company imagery
│   │   ├── jbr-logo.jpg        # Official JBR Builders corporate emblem
│   │   ├── team/               # Leadership and intern portraits
│   │   └── ...                 # Architectural project elevations and site photos
│   └── videos/                 # Background loops and media
│
├── src/
│   ├── main.tsx                # React root application entry point
│   ├── App.tsx                 # Main application component & route configuration
│   ├── index.css               # Design system tokens, glassmorphism classes & grid
│   ├── App.css                 # Auxiliary styling and component styles
│   │
│   ├── types/
│   │   └── index.ts            # Core TypeScript interfaces (Services, Projects, Team)
│   │
│   ├── data/
│   │   ├── company.ts          # Central company metadata, phone, email, offices
│   │   ├── services.ts         # Construction services catalog & feature points
│   │   ├── projects.ts         # Portfolio projects list, categories & metadata
│   │   └── team.ts             # Leadership profiles, staff & internship curriculum
│   │
│   ├── components/
│   │   ├── Navbar.tsx           # Glassmorphic top navigation with mobile drawer
│   │   ├── Footer.tsx           # Comprehensive footer with office directory & links
│   │   ├── Hero.tsx             # Full-screen video hero with bento feature highlights
│   │   ├── About.tsx            # Philosophy & experience highlights preview
│   │   ├── Services.tsx         # 6-grid core services preview with quote trigger
│   │   ├── FeaturedProjects.tsx # Featured portfolio gallery preview
│   │   ├── WhyChooseUs.tsx      # Core company differentiators & quality standards
│   │   ├── TeamSpotlight.tsx    # Leadership & key architect spotlight cards
│   │   ├── Contact.tsx          # Inline contact form & office locations
│   │   ├── QuoteModal.tsx       # Interactive project estimation modal
│   │   ├── LightboxModal.tsx    # Full-screen image lightbox viewer
│   │   ├── FloatingWhatsApp.tsx # Fixed bottom-right WhatsApp quick-action button
│   │   ├── WhatsAppIcon.tsx     # Custom high-fidelity WhatsApp SVG icon
│   │   └── ScrollToTop.tsx      # Route-change scroll reset utility
│   │
│   └── pages/
│       ├── HomePage.tsx         # Complete landing page aggregating all key sections
│       ├── AboutPage.tsx        # In-depth company profile, team directory & internships
│       ├── ServicesPage.tsx     # Comprehensive services list with 4-step workflow
│       ├── ProjectsPage.tsx     # Filterable portfolio gallery with project details
│       ├── GalleryPage.tsx      # Filterable photo archives and site documentation
│       └── ContactPage.tsx      # Dedicated contact page with validation & WhatsApp
│
├── index.html                  # HTML entry point with meta tags & Google Fonts
├── vite.config.ts              # Vite configuration with React & Tailwind plugins
├── tsconfig.json               # Root TypeScript configuration
├── tsconfig.app.json           # Application TypeScript compiler settings
├── tsconfig.node.json          # Vite configuration TypeScript options
├── .oxlintrc.json              # Oxlint linting rules
├── package.json                # Project dependencies and operational scripts
└── README.md                   # Complete project documentation
```

---

## 📄 Detailed Page Breakdown

### 1. `HomePage.tsx` (`/`)
The main digital landing experience delivering an immediate high-impact impression:
- **Hero Section**: Edge-to-edge backdrop with tagline *"Building Your Vision. Creating Your Future."*, statistics chips (Completed Projects, Satisfied Families), and fast-action CTA buttons.
- **Team Spotlight**: Highlights the Principal Architect, Interior Design Head, and Structural Lead.
- **About Preview**: Summary of company credentials, registered civil engineers, and core philosophy.
- **Services Showcase**: 6 core service cards with feature bullets and instant estimate triggers.
- **Featured Projects**: Visual preview of recent elevations and key handovers with lightbox triggers.
- **Why Choose Us**: Transparent BOQ, seismic structural compliance, strict timeline enforcement.
- **Contact Section**: Inline contact form and dual-branch office cards.

### 2. `AboutPage.tsx` (`/about`)
A comprehensive deep-dive into the people, values, and credentials of JBR Builders:
- **Company Profile & Values**: Explains the *"Listen Better - Plan Better - Build Better"* execution lifecycle.
- **Interactive Team Directory**: Filterable by departments:
  - *Executive Leadership & Engineering*
  - *Civil Engineering & Site Operations*
  - *Architecture & Spatial Planning*
  - *Tendering & Contracts*
  - Provides qualifications (B.Arch, M.Tech Structural, B.E. Civil), years of experience, responsibilities, and direct contact options.
- **Internship Program Hub**:
  - Detailed overview of the academic-to-industry training initiative for engineering colleges across Tamil Nadu.
  - Active and alumni intern profiles with learning highlights.
  - 4 training modules: Site Surveying, Concrete QA/QC, Bar Bending (BBS), and Cost Estimation.
  - Pre-formatted WhatsApp button allowing students to apply with college, degree, and preferred duration.

### 3. `ServicesPage.tsx` (`/services`)
Covers the entire spectrum of civil construction offerings:
- **6 Core Services**:
  1. *Residential Construction*: Custom individual homes, duplexes, and luxury villas.
  2. *Commercial Construction*: Retail showrooms, multi-storey complexes, and commercial offices.
  3. *Building Planning & Design*: 2D floor plans, 3D elevations, structural blueprints, and Vasthu compliance.
  4. *Renovation & Remodeling*: Facade modernization, structural strengthening, and interior refits.
  5. *Project Management*: Quality audits, material testing, supervisor oversight, and progress reports.
  6. *Turnkey Construction Solutions*: End-to-end accountability from soil testing to key handover.
- **4-Step Execution Workflow**:
  - `01. Site Appraisal & Vasthu Consultation`
  - `02. 3D Elevation & Structural Detailing`
  - `03. Transparent BOQ & Material Scheduling`
  - `04. Ground Execution & Milestone Handover`

### 4. `ProjectsPage.tsx` (`/projects`)
The project portfolio showcasing delivered structures:
- Dynamic filter pills: *All Projects*, *Exterior & Architecture*, *Handover & Celebrations*, *Interior & Finishes*, and *Office & Facilities*.
- Rich project cards showing high-resolution photography, project category badges, detailed descriptions, and image enlargement on click.
- Direct links to request consultations for similar projects.

### 5. `GalleryPage.tsx` (`/gallery`)
Dedicated photo archive highlighting real construction milestones:
- Categorized masonry works, reinforced concrete pouring, elevation lighting, false ceilings, and ceremonial handovers.
- Integrated with the full-screen `LightboxModal` for detailed inspection.

### 6. `ContactPage.tsx` (`/contact`)
A full inquiry and office directory page:
- Form fields with client-side validation for name, phone (min 8 digits), email, and project message.
- Option to submit through the website or generate a structured WhatsApp message directly.
- Dual-office cards highlighting:
  - **Head Office**: 4/89/9, Palai Main Road, Pudukottai, Tuticorin - 628103.
  - **Branch Office**: 7/9, Pearl Avenue, K.T.C. Nagar, Tirunelveli - 627011.
  - Working Hours: Monday to Saturday, 9:00 AM – 7:00 PM.

---

## 🧩 Components & Interactive UI

| Component | File Path | Functionality & Key Capabilities |
| :--- | :--- | :--- |
| **`Navbar`** | `src/components/Navbar.tsx` | Glassmorphic sticky header with company logo, desktop links, active route highlight, quote trigger button, and responsive mobile slide-out drawer. |
| **`Footer`** | `src/components/Footer.tsx` | Deep navy glassmorphic footer with quick links, services directory, dual office addresses, consultation CTA, and copyright notice. |
| **`QuoteModal`** | `src/components/QuoteModal.tsx` | Global dialog modal allowing users to submit project inquiries or launch WhatsApp with pre-selected service details. |
| **`LightboxModal`** | `src/components/LightboxModal.tsx` | Full-screen image viewer with next/prev buttons, ESC key dismissal, caption overlays, and category tags. |
| **`FloatingWhatsApp`** | `src/components/FloatingWhatsApp.tsx` | Fixed floating button with radar ping animation, tooltip bubble, and direct launch to WhatsApp Web / App. |
| **`TeamSpotlight`** | `src/components/TeamSpotlight.tsx` | Visual card showcase profiling the Principal Architect, Design Head, and Structural Leads. |
| **`ScrollToTop`** | `src/components/ScrollToTop.tsx` | Listens to URL changes via React Router and resets window scroll coordinates to `(0, 0)`. |
| **`WhyChooseUs`** | `src/components/WhyChooseUs.tsx` | Grid displaying brand guarantees: Grade-A steel & cement, licensed engineers, clear BOQs, and timely execution. |

---

## 🗄️ Data Architecture & Content Management

All site data is modularly decoupled into typed data files in `src/data/`, making content updates quick, clean, and safe:

### 1. `company.ts`
Contains global corporate constants:
- Brand name, official slogan, and hero banner copy.
- Direct phone numbers (`+91 97917 10655`) and WhatsApp deep links.
- Official email address (`jbrbuilders15@gmail.com`).
- Array of office objects (`Head Office` in Tuticorin, `Branch Office` in Tirunelveli).
- Operating hours and logo paths.

### 2. `services.ts`
Exports `PROPOSED_SERVICES` implementing the `ServiceItem` interface:
```typescript
export interface ServiceItem {
  id: string;
  title: string;
  description: string;
  iconName: string; // Maps to Lucide React icons
  features: string[];
}
```

### 3. `projects.ts`
Exports `GALLERY_PROJECTS` and `GALLERY_CATEGORIES`:
```typescript
export interface ProjectItem {
  id: string;
  title: string;
  category: string;
  categoryTag: 'exterior' | 'interior' | 'office' | 'handover';
  imageSrc: string;
  aspectRatio: string;
  description: string;
}
```

### 4. `team.ts`
Exports comprehensive records for:
- `EMPLOYEES`: Array of `TeamMember` objects with qualifications, bio, responsibilities, projects, and social handles.
- `INTERNS`: Array of `InternMember` objects tracking institution, duration, mentor, learning points, and status.
- `INTERNSHIP_PROGRAM`: Syllabus, training modules, eligibility criteria, and benefits.

---

## 🎨 Design System & Styling

The project features a **Pure Blue & White Luxury Glassmorphism** design system defined in `src/index.css`:

### Color Palette Tokens
- **Primary Navy**: `#123B68` — Used for headings, primary buttons, and corporate identity.
- **Primary Hover**: `#0E2E52` — Darker navy for interactive states.
- **Secondary Blue**: `#2468A6` — Vibrant accent blue for badges, links, and highlights.
- **Accent Blue**: `#38BDF8` — Bright sky blue for glowing badges and indicator pings.
- **Background Light**: `#F8FAFC` — Crisp, modern off-white background.
- **Text Charcoal**: `#1E293B` — High-contrast readability for body text.
- **Muted Slate**: `#64748B` — Subtext, meta tags, and secondary descriptions.

### Custom Utility Classes
- `.glass-panel`: Translucent white background (`rgba(255,255,255,0.78)`), backdrop blur (`18px`), and subtle inset highlight.
- `.glass-panel-hover`: Smooth translateY animation with expanded drop shadow on hover.
- `.glass-panel-dark`: Deep navy frosted glass used in dark footer and accent sections.
- `.glass-pill`: Frosted pill badge container with rounded borders.
- `.blueprint-grid`: Radial dot pattern evoking architectural civil blueprint drafting grids.

---

## 🚀 Getting Started & Local Development

### Prerequisites
Make sure your development machine has:
- **Node.js**: `v18.0.0` or higher (Node.js 20+ LTS recommended)
- **npm**: `v9.0.0` or higher (or `pnpm` / `yarn`)

### Installation Steps

1. **Clone the repository**:
   ```bash
   git clone <repository-url>
   cd jbr-builders
   ```

2. **Install project dependencies**:
   ```bash
   npm install
   ```

3. **Start the local development server**:
   ```bash
   npm run dev
   ```
   The application will boot at `http://localhost:5173/` with Hot Module Replacement (HMR) enabled.

4. **Verify linting rules**:
   ```bash
   npm run lint
   ```

5. **Create a production build**:
   ```bash
   npm run build
   ```
   Compiles TypeScript (`tsc -b`) and generates an optimized production bundle inside the `dist/` directory.

6. **Preview the production build locally**:
   ```bash
   npm run preview
   ```

---

## ⚙️ Configuration & Customization Guide

### Updating Company Contact or Office Addresses
Modify `src/data/company.ts`:
- Change phone numbers, WhatsApp links, or email addresses.
- Add or edit office addresses in the `offices` array.

### Adding a New Service
1. Open `src/data/services.ts`.
2. Add a new object to the `PROPOSED_SERVICES` array with a unique `id`, `title`, `description`, `iconName` (from Lucide), and `features` list.
3. If using a new Lucide icon, add the corresponding case in `src/pages/ServicesPage.tsx` and `src/components/Services.tsx`.

### Adding a New Project to the Portfolio
1. Place the project image inside `public/images/`.
2. Open `src/data/projects.ts` and append a new record to `GALLERY_PROJECTS`:
   ```typescript
   {
     id: "unique-project-slug",
     title: "Project Title",
     category: "Residential Architecture",
     categoryTag: "exterior", // 'exterior' | 'interior' | 'office' | 'handover'
     imageSrc: "/images/your-image-filename.jpg",
     aspectRatio: "landscape", // or "portrait"
     description: "Detailed description of the construction work completed."
   }
   ```

### Adding Team Members or Intern Profiles
Open `src/data/team.ts`:
- To add a staff member, append an entry to `EMPLOYEES`.
- To record a student intern, append an entry to `INTERNS`.

---

## 📞 Company & Contact Details

**JBR Builders**  
*Listen Better • Plan Better • Build Better*

- 📱 **Phone**: [+91 97917 10655](tel:+919791710655)
- 💬 **WhatsApp**: [Chat with JBR Builders](https://wa.me/919791710655?text=Hello%20JBR%20Builders%2C%20I%20would%20like%20to%20inquire%20about%20your%20construction%20services.)
- ✉️ **Email**: [jbrbuilders15@gmail.com](mailto:jbrbuilders15@gmail.com)
- 🕒 **Working Hours**: Monday – Saturday: 9:00 AM – 7:00 PM

### Office Locations:
- **Head Office (Tuticorin)**:  
  `4/89/9, Palai Main Road, Pudukottai, Tuticorin, Tamil Nadu - 628103`
- **Branch Office (Tirunelveli)**:  
  `7/9, Pearl Avenue, K.T.C. Nagar, Tirunelveli, Tamil Nadu - 627011`

---

*© 2026 JBR Builders. All rights reserved. Designed and developed with modern civil engineering excellence.*
