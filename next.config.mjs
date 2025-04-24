import { PHASE_DEVELOPMENT_SERVER } from "next/constants.js";
import withBundleAnalyzer from "@next/bundle-analyzer";

const analyzer = withBundleAnalyzer({
  enabled: process.env.ANALYZE === "true",
});

/**
 * @type {import('next').NextConfig}
 */
const nextConfig = {
  // Enable React strict mode for better development experience
  reactStrictMode: true,

  // Enable image optimization
  images: {
    // Configure domains for remote images
    domains: [
      "images.unsplash.com",
      "source.unsplash.com",
      "res.cloudinary.com",
      "example.com",
      // Add other domains as needed
    ],
    // Configure image formats
    formats: ["image/avif", "image/webp"],
    // Enable remote patterns for more flexible image sources
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
      {
        protocol: "http",
        hostname: "**",
      },
    ],
    // Allow SVG images
    dangerouslyAllowSVG: true,
  },

  // Enable compression for better performance
  compress: true,

  // Configure headers for better security and performance
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          // Security headers
          {
            key: "X-DNS-Prefetch-Control",
            value: "on",
          },
          {
            key: "X-XSS-Protection",
            value: "1; mode=block",
          },
          {
            key: "X-Frame-Options",
            value: "SAMEORIGIN",
          },
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
          },
          // Content Security Policy
          {
            key: "Content-Security-Policy",
            value:
              "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.googletagmanager.com https://www.google-analytics.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; img-src 'self' data: https:; font-src 'self' https://fonts.gstatic.com; connect-src 'self' https://www.google-analytics.com; frame-src 'self'; base-uri 'self'; form-action 'self'",
          },
        ],
      },
      // Cache static assets
      {
        source: "/static/(.*)",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
      // Cache images
      {
        source: "/images/(.*)",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=86400, stale-while-revalidate=31536000",
          },
        ],
      },
      // Cache fonts
      {
        source: "/fonts/(.*)",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
    ];
  },

  // Configure redirects for SEO
  async redirects() {
    return [
      // Redirect trailing slashes
      {
        source: "/:path+/",
        destination: "/:path+",
        permanent: true,
      },
      // Note: www to non-www redirects should be handled at the DNS or server level
      // Next.js redirects can only handle paths within the same domain
    ];
  },

  // Configure rewrites for clean URLs
  async rewrites() {
    return [
      // Example: Rewrite API calls
      {
        source: "/api/:path*",
        destination: "/api/:path*",
      },
      // Rewrite for server-sitemap
      {
        source: "/server-sitemap.xml",
        destination: "/api/server-sitemap",
      },
    ];
  },

  // Enable webpack optimization
  webpack(config, { dev, isServer }) {
    // Optimize CSS
    if (!dev && !isServer) {
      // Enable tree shaking
      config.optimization.usedExports = true;
    }

    return config;
  },

  // Enable experimental features
  experimental: {
    // Modern experimental features for Next.js 13+
    serverActions: {
      allowedOrigins: ["localhost:3000", "codexorbit.com"],
    },
    optimizeCss: true,
  },

  // Configure environment variables
  env: {
    NEXT_PUBLIC_SITE_URL:
      process.env.NEXT_PUBLIC_SITE_URL || "https://codexorbit.com",
  },

  // Configure build output
  output: "standalone",

  // Configure powered by header
  poweredByHeader: false,
};

// Apply different configurations based on environment
export default function (phase) {
  if (phase === PHASE_DEVELOPMENT_SERVER) {
    // Development-specific config
    return analyzer({
      ...nextConfig,
      // Development-specific settings
    });
  }

  // Production config
  return analyzer({
    ...nextConfig,
    // Production-specific settings
  });
}
