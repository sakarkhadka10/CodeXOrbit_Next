import React from 'react';
import Script from 'next/script';

interface BlogPostJsonLdProps {
  title: string;
  description: string;
  publishedTime: string;
  modifiedTime?: string;
  authorName: string;
  images: string[];
  url: string;
  categoryName?: string;
  tags?: string[];
}

export default function BlogPostJsonLd({
  title,
  description,
  publishedTime,
  modifiedTime,
  authorName,
  images,
  url,
  categoryName,
  tags = [],
}: BlogPostJsonLdProps) {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://codexorbit.com';
  const fullUrl = `${baseUrl}${url}`;
  
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: title,
    description: description,
    image: images.map(image => image.startsWith('http') ? image : `${baseUrl}${image}`),
    datePublished: publishedTime,
    dateModified: modifiedTime || publishedTime,
    author: {
      '@type': 'Person',
      name: authorName,
    },
    publisher: {
      '@type': 'Organization',
      name: 'CodeXOrbit',
      logo: {
        '@type': 'ImageObject',
        url: `${baseUrl}/logo.png`,
      },
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': fullUrl,
    },
    ...(categoryName && {
      articleSection: categoryName,
    }),
    ...(tags.length > 0 && {
      keywords: tags.join(', '),
    }),
  };

  return (
    <Script
      id="blog-post-jsonld"
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}
