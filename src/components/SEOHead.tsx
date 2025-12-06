import { useEffect } from 'react';

interface SEOHeadProps {
  title?: string;
  description?: string;
  keywords?: string;
  ogImage?: string;
  canonicalUrl?: string;
  noIndex?: boolean; // For login/register pages
  structuredData?: object; // Custom structured data
}

export function SEOHead({
  title = 'Pretest - IELTS Mock Test Platform | Practice & Improve Your IELTS Score',
  description = 'Pretest is the leading IELTS mock test platform in Uzbekistan. Take Pretest Pro tests, daily practice tests, and receive personalized video feedback from experienced IELTS examiners. Improve your Reading, Listening, Writing, and Speaking skills with our comprehensive test preparation platform.',
  keywords = 'IELTS test, IELTS mock test, IELTS practice, IELTS preparation, IELTS Uzbekistan, IELTS Tashkent, IELTS exam, English test, speaking practice, writing feedback, IELTS simulator, IELTS training',
  ogImage = 'https://pre-test.uz/og-image.jpg',
  canonicalUrl = 'https://pre-test.uz',
  noIndex = false,
  structuredData = null,
}: SEOHeadProps) {
  useEffect(() => {
    // Update document title  
    if (title) {
      document.title = title;
    }

    // Helper function to update or create meta tags
    const updateMetaTag = (property: string, content: string, isProperty = false) => {
      const attribute = isProperty ? 'property' : 'name';
      let element = document.querySelector(`meta[${attribute}="${property}"]`);
      
      if (!element) {
        element = document.createElement('meta');
        element.setAttribute(attribute, property);
        document.head.appendChild(element);
      }
      
      element.setAttribute('content', content);
    };

    // Standard meta tags
    updateMetaTag('description', description);
    updateMetaTag('keywords', keywords);
    updateMetaTag('author', 'Pretest Team');
    updateMetaTag('robots', noIndex ? 'noindex, nofollow' : 'index, follow');
    updateMetaTag('language', 'English, Uzbek, Russian');
    updateMetaTag('revisit-after', '7 days');
    updateMetaTag('theme-color', '#182966');

    // Open Graph meta tags
    updateMetaTag('og:title', title, true);
    updateMetaTag('og:description', description, true);
    updateMetaTag('og:type', 'website', true);
    updateMetaTag('og:url', canonicalUrl, true);
    updateMetaTag('og:image', ogImage, true);
    updateMetaTag('og:site_name', 'Pretest', true);
    updateMetaTag('og:locale', 'en_US', true);

    // Twitter Card meta tags
    updateMetaTag('twitter:card', 'summary_large_image');
    updateMetaTag('twitter:title', title);
    updateMetaTag('twitter:description', description);
    updateMetaTag('twitter:image', ogImage);

    // Mobile optimization
    let viewport = document.querySelector('meta[name="viewport"]');
    if (!viewport) {
      viewport = document.createElement('meta');
      viewport.setAttribute('name', 'viewport');
      document.head.appendChild(viewport);
    }
    viewport.setAttribute('content', 'width=device-width, initial-scale=1.0, maximum-scale=5.0');

    // Canonical URL
    let canonical = document.querySelector('link[rel="canonical"]') as HTMLLinkElement;
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.setAttribute('rel', 'canonical');
      document.head.appendChild(canonical);
    }
    canonical.href = canonicalUrl;

    // Add structured data (JSON-LD)
    let structuredDataElement = document.querySelector('script[type="application/ld+json"]');
    if (!structuredDataElement) {
      structuredDataElement = document.createElement('script');
      structuredDataElement.setAttribute('type', 'application/ld+json');
      document.head.appendChild(structuredDataElement);
    }
    
    const defaultJsonLd = {
      '@context': 'https://schema.org',
      '@type': 'EducationalOrganization',
      name: 'Pretest',
      description: description,
      url: canonicalUrl,
      logo: 'https://pre-test.uz/logo.png',
      address: {
        '@type': 'PostalAddress',
        streetAddress: 'Bunyodkor Avenue 52, Chilonzor',
        addressLocality: 'Tashkent',
        addressCountry: 'UZ',
      },
      contactPoint: {
        '@type': 'ContactPoint',
        contactType: 'Customer Service',
        availableLanguage: ['English', 'Uzbek', 'Russian'],
      },
      offers: [
        {
          '@type': 'Offer',
          name: 'Daily Practice Test',
          price: '29',
          priceCurrency: 'USD',
          description: 'Practice individual sections with comprehensive feedback',
        },
        {
          '@type': 'Offer',
          name: 'Pretest Pro',
          price: '89',
          priceCurrency: 'USD',
          description: 'Complete IELTS mock test with all four sections and expert feedback',
        },
      ],
    };
    
    structuredDataElement.textContent = JSON.stringify(structuredData || defaultJsonLd);

    // Add preconnect for API
    let preconnect = document.querySelector('link[rel="preconnect"][href="https://api.pre-test.uz"]') as HTMLLinkElement;
    if (!preconnect) {
      preconnect = document.createElement('link');
      preconnect.setAttribute('rel', 'preconnect');
      preconnect.href = 'https://api.pre-test.uz';
      document.head.appendChild(preconnect);
    }

    // Add DNS prefetch
    let dnsPrefetch = document.querySelector('link[rel="dns-prefetch"][href="https://api.pre-test.uz"]') as HTMLLinkElement;
    if (!dnsPrefetch) {
      dnsPrefetch = document.createElement('link');
      dnsPrefetch.setAttribute('rel', 'dns-prefetch');
      dnsPrefetch.href = 'https://api.pre-test.uz';
      document.head.appendChild(dnsPrefetch);
    }

  }, [title, description, keywords, ogImage, canonicalUrl, noIndex, structuredData]);

  return null; // This component doesn't render anything
}