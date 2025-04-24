/**
 * @type {import('next-sitemap').IConfig}
 */
export default {
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL || "https://codexorbit.com",
  generateRobotsTxt: false, // We're using the built-in Next.js robots.ts
  sitemapSize: 7000,

  // Exclude paths from the auto-generated sitemap
  exclude: [
    "/admin/*",
    "/api/*",
    "/server-sitemap.xml",
    "/sitemap-index.xml",
    "/sitemap-posts.xml",
    "/sitemap-categories.xml",
    "/sitemap-pages.xml",
    "/sitemap-tags.xml",
    "/dashboard/*",
    "/login",
    "/register",
    "/reset-password",
    "/verify-email",
    "/404",
    "/500",
  ],

  // We're using our custom sitemap index
  generateIndexSitemap: false,

  // We're not using the default sitemap.xml since we have our own sitemap structure
  outDir: "./.next/static/sitemaps",

  // Add any custom transformations for URLs
  transform: async (config, path) => {
    // We're handling all sitemap generation through our custom routes
    // This is just a fallback for any pages not covered by our custom sitemaps
    return {
      loc: path,
      changefreq: "daily",
      priority: 0.5,
      lastmod: new Date().toISOString(),
    };
  },
};
