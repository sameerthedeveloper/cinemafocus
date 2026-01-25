import React from 'react';
import { Helmet } from 'react-helmet-async';
import { useLocation } from 'react-router-dom';
import { useSiteSettings } from '../context/SiteSettingsContext';

const SEO = ({ 
  title, 
  description, 
  image, 
  type = 'website', 
  schema, 
  path,
  keywords
}) => {
  const { seoSettings } = useSiteSettings();
  const location = useLocation();
  
  // Construct the canonical URL
  const siteUrl = 'https://cinemafocus.in';
  const currentPath = path || location.pathname;
  // Ensure no double slashes if path starts with /
  const canonicalUrl = `${siteUrl}${currentPath.startsWith('/') ? currentPath : '/' + currentPath}`;

  // Fallbacks using global settings
  const metaTitle = title 
    ? `${title} ${seoSettings?.titleSuffix || ''}`
    : seoSettings?.siteTitle;
    
  const metaDescription = description || seoSettings?.defaultDescription;
  const metaKeywords = keywords || seoSettings?.defaultKeywords;
  
  // Open Graph Image
  const ogImage = image || seoSettings?.ogImage || '/images/default-og.jpg'; // Assuming access to default image
  const fullOgImage = ogImage.startsWith('http') ? ogImage : `${siteUrl}${ogImage}`;

  return (
    <Helmet>
      {/* Standard Metadata */}
      <title>{metaTitle}</title>
      <meta name="description" content={metaDescription} />
      {metaKeywords && <meta name="keywords" content={metaKeywords} />}
      <link rel="canonical" href={canonicalUrl} />

      {/* Open Graph / Facebook */}
      <meta property="og:type" content={type} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:title" content={title || seoSettings?.siteTitle} />
      <meta property="og:description" content={metaDescription} />
      <meta property="og:image" content={fullOgImage} />
      <meta property="og:site_name" content={seoSettings?.siteTitle || 'Cinema Focus'} />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:url" content={canonicalUrl} />
      <meta name="twitter:title" content={title || seoSettings?.siteTitle} />
      <meta name="twitter:description" content={metaDescription} />
      <meta name="twitter:image" content={fullOgImage} />

      {/* Custom Verification Tags */}
      {seoSettings?.googleVerification && (
        <meta name="google-site-verification" content={seoSettings.googleVerification} />
      )}
      {seoSettings?.bingVerification && (
        <meta name="msvalidate.01" content={seoSettings.bingVerification} />
      )}

      {/* Custom Head Scripts (Inject Raw HTML) */}
      {seoSettings?.headScripts && (
        <script type="text/javascript">
          {seoSettings.headScripts.replace(/<script>|<\/script>/g, '')}
        </script>
      )}

      {/* Structured Data (JSON-LD) */}
      {schema && (
        <script type="application/ld+json">
          {JSON.stringify(schema)}
        </script>
      )}
    </Helmet>
  );
};

export default SEO;
