import { useEffect } from 'react';

interface SEOHeadProps {
  title: string;
  description: string;
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
  canonicalUrl?: string;
  keywords?: string;
  structuredData?: Record<string, any>;
  article?: {
    publishedTime?: string;
    modifiedTime?: string;
    author?: string;
    tags?: string[];
  };
}

export function SEOHead({
  title,
  description,
  ogTitle,
  ogDescription,
  ogImage = '/og-image.png',
  canonicalUrl,
  keywords,
  structuredData,
  article,
}: SEOHeadProps) {
  useEffect(() => {
    document.title = `${title} | Prolific Personalities`;

    const setMetaTag = (name: string, content: string, useProperty = false) => {
      const attribute = useProperty ? 'property' : 'name';
      let tag = document.querySelector(`meta[${attribute}="${name}"]`);
      
      if (!tag) {
        tag = document.createElement('meta');
        tag.setAttribute(attribute, name);
        document.head.appendChild(tag);
      }
      
      tag.setAttribute('content', content);
    };

    const removeMetaTag = (name: string, useProperty = false) => {
      const attribute = useProperty ? 'property' : 'name';
      const tag = document.querySelector(`meta[${attribute}="${name}"]`);
      if (tag) tag.remove();
    };

    setMetaTag('description', description.slice(0, 155));
    if (keywords) {
      setMetaTag('keywords', keywords);
    }

    setMetaTag('og:title', ogTitle || title, true);
    setMetaTag('og:description', (ogDescription || description).slice(0, 155), true);
    setMetaTag('og:image', ogImage, true);
    setMetaTag('og:site_name', 'Prolific Personalities', true);
    
    if (article) {
      setMetaTag('og:type', 'article', true);
      if (article.publishedTime) {
        setMetaTag('article:published_time', article.publishedTime, true);
      }
      if (article.modifiedTime) {
        setMetaTag('article:modified_time', article.modifiedTime, true);
      }
      if (article.author) {
        setMetaTag('article:author', article.author, true);
      }
      if (article.tags && article.tags.length > 0) {
        setMetaTag('article:tag', article.tags[0], true);
      }
    } else {
      setMetaTag('og:type', 'website', true);
      removeMetaTag('article:published_time', true);
      removeMetaTag('article:modified_time', true);
      removeMetaTag('article:author', true);
      removeMetaTag('article:tag', true);
    }
    
    if (canonicalUrl) {
      setMetaTag('og:url', canonicalUrl, true);
    }

    setMetaTag('twitter:card', 'summary_large_image');
    setMetaTag('twitter:title', ogTitle || title);
    setMetaTag('twitter:description', (ogDescription || description).slice(0, 155));
    setMetaTag('twitter:image', ogImage);

    const finalCanonicalUrl = canonicalUrl || (typeof window !== 'undefined' ? window.location.href : '');
    if (finalCanonicalUrl) {
      let linkTag = document.querySelector('link[rel="canonical"]');
      if (!linkTag) {
        linkTag = document.createElement('link');
        linkTag.setAttribute('rel', 'canonical');
        document.head.appendChild(linkTag);
      }
      linkTag.setAttribute('href', finalCanonicalUrl);
    }

    if (structuredData) {
      const existingScripts = document.querySelectorAll('script[type="application/ld+json"]');
      existingScripts.forEach(s => s.remove());
      
      const scriptTag = document.createElement('script');
      scriptTag.setAttribute('type', 'application/ld+json');
      scriptTag.textContent = JSON.stringify(structuredData);
      document.head.appendChild(scriptTag);
    }
  }, [title, description, ogTitle, ogDescription, ogImage, canonicalUrl, keywords, structuredData, article]);

  return null;
}
