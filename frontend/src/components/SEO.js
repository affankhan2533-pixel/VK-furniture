import { useEffect } from 'react';

const SEO = ({ title, description, ogImage = "/images/workshop.png", schema }) => {
  useEffect(() => {
    // 1. Set Title
    if (title) {
      document.title = title;
    }

    // Helper to find or build meta nodes
    const setMetaTag = (attribute, attrValue, contentValue) => {
      let metaNode = document.querySelector(`meta[${attribute}="${attrValue}"]`);
      if (metaNode) {
        metaNode.setAttribute('content', contentValue);
      } else {
        metaNode = document.createElement('meta');
        metaNode.setAttribute(attribute, attrValue);
        metaNode.setAttribute('content', contentValue);
        document.head.appendChild(metaNode);
      }
    };

    // 2. Base Descriptions
    if (description) {
      setMetaTag('name', 'description', description);
    }

    // 3. Open Graph Metadata
    if (title) setMetaTag('property', 'og:title', title);
    if (description) setMetaTag('property', 'og:description', description);
    setMetaTag('property', 'og:type', 'website');
    setMetaTag('property', 'og:url', window.location.href);
    if (ogImage) {
      const fullImageUrl = ogImage.startsWith('http') ? ogImage : window.location.origin + ogImage;
      setMetaTag('property', 'og:image', fullImageUrl);
    }

    // 4. Twitter Cards Metadata
    setMetaTag('name', 'twitter:card', 'summary_large_image');
    if (title) setMetaTag('name', 'twitter:title', title);
    if (description) setMetaTag('name', 'twitter:description', description);
    if (ogImage) {
      const fullImageUrl = ogImage.startsWith('http') ? ogImage : window.location.origin + ogImage;
      setMetaTag('name', 'twitter:image', fullImageUrl);
    }

    // 5. Canonical Link Injection
    let canonicalLink = document.querySelector('link[rel="canonical"]');
    if (canonicalLink) {
      canonicalLink.setAttribute('href', window.location.href);
    } else {
      canonicalLink = document.createElement('link');
      canonicalLink.setAttribute('rel', 'canonical');
      canonicalLink.setAttribute('href', window.location.href);
      document.head.appendChild(canonicalLink);
    }

    // 6. JSON-LD Schema.org script injection
    if (schema) {
      let schemaScript = document.querySelector('#jsonld-schema-script');
      if (schemaScript) {
        schemaScript.textContent = JSON.stringify(schema);
      } else {
        schemaScript = document.createElement('script');
        schemaScript.id = 'jsonld-schema-script';
        schemaScript.type = 'application/ld+json';
        schemaScript.textContent = JSON.stringify(schema);
        document.head.appendChild(schemaScript);
      }
    }
  }, [title, description, ogImage, schema]);

  return null;
};

export default SEO;
