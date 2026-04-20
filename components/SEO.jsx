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
  keywords,
  noindex = false
}) => {
  const { seoSettings } = useSiteSettings();
  const location = useLocation();
  
  // Construct the canonical URL
  const siteUrl = 'https://cinemafocus.in';
  const currentPath = path || location.pathname;
  const canonicalUrl = `${siteUrl}${currentPath.startsWith('/') ? currentPath : '/' + currentPath}`;

  // Fallbacks using global settings
  const metaTitle = title 
    ? `${title} ${seoSettings?.titleSuffix || '| Cinema Focus'}`
    : seoSettings?.siteTitle || 'Cinema Focus — Premium Audio & Home Cinema';
    
  const metaDescription = description || seoSettings?.defaultDescription || 'Cinema Focus delivers reference-class Home Cinema & Hi-Fi audio systems.';
  const metaKeywords = keywords || seoSettings?.defaultKeywords || 'home cinema, hi-fi audio, speakers, subwoofers, amplifiers, turntables, premium audio';
  
  // Open Graph Image
  const ogImage = image || seoSettings?.ogImage || '/images/default-og.jpg';
  const fullOgImage = ogImage.startsWith('http') ? ogImage : `${siteUrl}${ogImage}`;

  return (
    <Helmet>
      {/* Standard Metadata */}
      <title>{metaTitle}</title>
      <meta name="description" content={metaDescription} />
      {metaKeywords && <meta name="keywords" content={metaKeywords} />}
      <link rel="canonical" href={canonicalUrl} />
      
      {/* Robots */}
      <meta name="robots" content={noindex ? 'noindex, nofollow' : 'index, follow'} />

      {/* Open Graph / Facebook */}
      <meta property="og:type" content={type} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:title" content={title || seoSettings?.siteTitle || 'Cinema Focus'} />
      <meta property="og:description" content={metaDescription} />
      <meta property="og:image" content={fullOgImage} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:site_name" content={seoSettings?.siteTitle || 'Cinema Focus'} />
      <meta property="og:locale" content="en_US" />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:url" content={canonicalUrl} />
      <meta name="twitter:title" content={title || seoSettings?.siteTitle || 'Cinema Focus'} />
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

      {/* Structured Data (JSON-LD) — supports single object or array */}
      {schema && (
        Array.isArray(schema) 
          ? schema.map((s, i) => (
              <script key={i} type="application/ld+json">
                {JSON.stringify(s)}
              </script>
            ))
          : (
              <script type="application/ld+json">
                {JSON.stringify(schema)}
              </script>
            )
      )}
    </Helmet>
  );
};

export default SEO;
