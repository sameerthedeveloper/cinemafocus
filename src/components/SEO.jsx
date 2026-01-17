import React from 'react';
import { Helmet } from 'react-helmet-async';

import { useSiteSettings } from '../context/SiteSettingsContext';

const SEO = ({ title, description, image, keywords }) => {
  const { seoSettings } = useSiteSettings();

  const siteTitle = seoSettings?.siteTitle || 'Cinema Focus';
  const titleSuffix = seoSettings?.titleSuffix || ' | Premium Audio';
  const metaDescription = description || seoSettings?.defaultDescription || 'Experience the ultimate in high-fidelity audio.';
  const metaKeywords = keywords || seoSettings?.defaultKeywords || 'audio, hifi, speakers';
  const metaImage = image || seoSettings?.ogImage || '/images/og-default.jpg';

  const fullTitle = title ? `${title} ${titleSuffix}` : `${siteTitle}${titleSuffix}`;

  return (
    <Helmet>
      {/* Basic */}
      <title>{fullTitle}</title>
      <meta name="description" content={metaDescription} />
      <meta name="keywords" content={metaKeywords} />

      {/* Open Graph / Facebook */}
      <meta property="og:type" content="website" />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={metaDescription} />
      <meta property="og:image" content={metaImage} />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={metaDescription} />
      <meta name="twitter:image" content={metaImage} />
    </Helmet>
  );
};

export default SEO;
