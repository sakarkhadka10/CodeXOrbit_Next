import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://codexorbit.com';

  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/admin/',
          '/admin/*',
          '/api/',
          '/api/*',
          '/dashboard/',
          '/dashboard/*',
          '/*.json',
          '/*.xml',
          '/private/',
          '/private/*',
          '/login',
          '/register',
          '/reset-password',
          '/verify-email',
          '/404',
          '/500',
        ],
      },
      {
        userAgent: 'Googlebot',
        allow: '/',
        disallow: [
          '/admin/',
          '/admin/*',
          '/api/',
          '/api/*',
          '/dashboard/',
          '/dashboard/*',
        ],
      },
    ],
    sitemap: `${siteUrl}/sitemap-index.xml`,
    host: siteUrl,
  };
}
