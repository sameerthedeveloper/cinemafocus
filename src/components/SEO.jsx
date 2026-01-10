import React from 'react';
import { Helmet } from 'react-helmet-async';

const SEO = ({ title, description }) => {
  const defaultTitle = 'Cinema Focus | Premium Audio & Home Cinema';
  const defaultDescription = 'Experience the ultimate in high-fidelity audio and home cinema systems. Curated collection of the world\'s finest speakers, amplifiers, and turntables.';

  return (
    <Helmet>
      <title>{title ? `${title} | Cinema Focus` : defaultTitle}</title>
      <meta name="description" content={description || defaultDescription} />
      <meta property="og:title" content={title ? `${title} | Cinema Focus` : defaultTitle} />
      <meta property="og:description" content={description || defaultDescription} />
      <meta name="twitter:title" content={title ? `${title} | Cinema Focus` : defaultTitle} />
      <meta name="twitter:description" content={description || defaultDescription} />
    </Helmet>
  );
};

export default SEO;
