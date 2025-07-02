import React from 'react';
import PropTypes from 'prop-types';
import { Helmet } from 'react-helmet-async';

const SEOHead = ({
  title,
  description = "Streamlined Solutions for Data Professionals. Map, transform, convert, and visualize data with our intuitive web-based tools.",
  keywords = "data mapping, data converter, data transformation, data generator, data validator",
  ogImage = "/assets/images/og-image.png",
  ogType = "website",
  twitterCard = "summary_large_image",
  canonical = "",
  jsonLd = null
}) => {

  const siteTitle = "Mapverter | Transform Your Data";
  const fullTitle = title ? `${title} | ${siteTitle}` : siteTitle;

  // Determine canonical URL
  const baseUrl = "https://mapverter.com";
  const fullCanonical = canonical ? `${baseUrl}${canonical}` : undefined;

  // Prepare JSON-LD structured data
  const defaultJsonLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "mapverter",
    "url": "https://mapverter.com",
    "description": description,
    "applicationCategory": "BusinessApplication",
    "operatingSystem": "Any",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD"
    }
  };

  // Merge default with custom JSON-LD if provided
  const structuredData = jsonLd || defaultJsonLd;

  return (
    <Helmet>
      {/* Basic Meta Tags */}
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />

      {/* Canonical Link */}
      {fullCanonical && <link rel="canonical" href={fullCanonical} />}

      {/* Open Graph / Facebook */}
      <meta property="og:type" content={ogType} />
      <meta property="og:url" content={fullCanonical || baseUrl} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={ogImage.startsWith('http') ? ogImage : `${baseUrl}${ogImage}`} />

      {/* Twitter */}
      <meta name="twitter:card" content={twitterCard} />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={ogImage.startsWith('http') ? ogImage : `${baseUrl}${ogImage}`} />

      {/* Structured Data */}
      <script type="application/ld+json">
        {JSON.stringify(structuredData)}
      </script>

      {/* Additional Tags */}
      <meta name="application-name" content="mapverter" />
      <meta name="apple-mobile-web-app-title" content="mapverter" />
      <meta name="theme-color" content="#2c5282" />
    </Helmet>
  );
};

SEOHead.propTypes = {
  title: PropTypes.string,
  description: PropTypes.string,
  keywords: PropTypes.string,
  ogImage: PropTypes.string,
  ogType: PropTypes.string,
  twitterCard: PropTypes.string,
  canonical: PropTypes.string,
  jsonLd: PropTypes.object
};

export default SEOHead;