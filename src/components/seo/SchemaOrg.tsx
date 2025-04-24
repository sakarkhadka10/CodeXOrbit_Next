'use client';

import { usePathname } from 'next/navigation';
import Script from 'next/script';

interface BlogPostSchemaProps {
  title: string;
  description: string;
  datePublished: string;
  dateModified?: string;
  authorName: string;
  images: string[];
  slug: string;
  categoryName?: string;
  tags?: string[];
}

export function BlogPostSchema({
  title,
  description,
  datePublished,
  dateModified,
  authorName,
  images,
  slug,
  categoryName,
  tags = [],
}: BlogPostSchemaProps) {
  const pathname = usePathname();
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://codexorbit.com';
  const url = `${baseUrl}${pathname}`;
  
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: title,
    description: description,
    image: images.map(image => image.startsWith('http') ? image : `${baseUrl}${image}`),
    datePublished,
    dateModified: dateModified || datePublished,
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
      '@id': url,
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
      id="blog-post-schema"
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

interface WebsiteSchemaProps {
  title?: string;
  description?: string;
  siteUrl?: string;
}

export function WebsiteSchema({ 
  title = 'CodeXOrbit - Programming Blog and Tutorials',
  description = 'Explore programming tutorials, coding tips, and tech insights on CodeXOrbit.',
  siteUrl,
}: WebsiteSchemaProps) {
  const baseUrl = siteUrl || process.env.NEXT_PUBLIC_SITE_URL || 'https://codexorbit.com';
  
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: title,
    description,
    url: baseUrl,
    potentialAction: {
      '@type': 'SearchAction',
      target: `${baseUrl}/search?q={search_term_string}`,
      'query-input': 'required name=search_term_string',
    },
  };

  return (
    <Script
      id="website-schema"
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

interface BreadcrumbSchemaProps {
  items: Array<{
    name: string;
    url: string;
  }>;
}

export function BreadcrumbSchema({ items }: BreadcrumbSchemaProps) {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://codexorbit.com';
  
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url.startsWith('http') ? item.url : `${baseUrl}${item.url}`,
    })),
  };

  return (
    <Script
      id="breadcrumb-schema"
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

interface FAQSchemaProps {
  questions: Array<{
    question: string;
    answer: string;
  }>;
}

export function FAQSchema({ questions }: FAQSchemaProps) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: questions.map(q => ({
      '@type': 'Question',
      name: q.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: q.answer,
      },
    })),
  };

  return (
    <Script
      id="faq-schema"
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

export default {
  BlogPostSchema,
  WebsiteSchema,
  BreadcrumbSchema,
  FAQSchema,
};
