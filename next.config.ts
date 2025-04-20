/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '*',
      },
      {
        protocol: 'http',
        hostname: '*',
      },
    ],
    dangerouslyAllowSVG: true,
    unoptimized: true,
  },
  // Remove all experimental features
  poweredByHeader: false,
};

export default nextConfig;

