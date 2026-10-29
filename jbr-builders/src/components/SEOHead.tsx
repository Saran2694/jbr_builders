import { useEffect } from 'react';

interface SEOHeadProps {
  title: string;
  description: string;
  canonical?: string;
  keywords?: string;
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
  ogType?: string;
  noindex?: boolean;
}

/**
 * SEOHead — Sets per-page <title>, meta description, canonical, Open Graph,
 * and Twitter Card tags via useEffect (CSR-compatible).
 */
export function SEOHead({
  title,
  description,
  canonical,
  keywords,
  ogTitle,
  ogDescription,
  ogImage = 'https://jbrbuilders.in/images/jbr-logo.jpg',
  ogType = 'website',
  noindex = false,
}: SEOHeadProps) {
  useEffect(() => {
    // Title
    document.title = title;

    // Helper to set/create meta tags
    const setMeta = (attr: string, key: string, content: string) => {
      let el = document.querySelector(`meta[${attr}="${key}"]`) as HTMLMetaElement | null;
      if (!el) {
        el = document.createElement('meta');
        el.setAttribute(attr, key);
        document.head.appendChild(el);
      }
      el.setAttribute('content', content);
    };

    // Meta description
    setMeta('name', 'description', description);

    // Keywords
    if (keywords) {
      setMeta('name', 'keywords', keywords);
    }

    // Robots
    if (noindex) {
      setMeta('name', 'robots', 'noindex, nofollow');
    } else {
      setMeta('name', 'robots', 'index, follow');
    }

    // Canonical
    let canonicalEl = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
    const canonicalUrl = canonical || `https://jbrbuilders.in${window.location.pathname}`;
    if (!canonicalEl) {
      canonicalEl = document.createElement('link');
      canonicalEl.setAttribute('rel', 'canonical');
      document.head.appendChild(canonicalEl);
    }
    canonicalEl.setAttribute('href', canonicalUrl);

    // Open Graph
    setMeta('property', 'og:title', ogTitle || title);
    setMeta('property', 'og:description', ogDescription || description);
    setMeta('property', 'og:image', ogImage);
    setMeta('property', 'og:type', ogType);
    setMeta('property', 'og:url', canonicalUrl);
    setMeta('property', 'og:site_name', 'JBR Builders');
    setMeta('property', 'og:locale', 'en_IN');

    // Twitter Card
    setMeta('name', 'twitter:card', 'summary_large_image');
    setMeta('name', 'twitter:title', ogTitle || title);
    setMeta('name', 'twitter:description', ogDescription || description);
    setMeta('name', 'twitter:image', ogImage);

    // Geo meta tags for local SEO
    setMeta('name', 'geo.region', 'IN-TN');
    setMeta('name', 'geo.placename', 'Tirunelveli, Tuticorin, Tamil Nadu');
  }, [title, description, canonical, keywords, ogTitle, ogDescription, ogImage, ogType, noindex]);

  return null;
}

