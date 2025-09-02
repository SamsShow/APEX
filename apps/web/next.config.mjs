/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  poweredByHeader: false,
  reactStrictMode: true,
  experimental: {
    optimizePackageImports: ['framer-motion'],
  },
  transpilePackages: ['framer-motion'],
  // Disable image optimization for static export
  images: {
    unoptimized: true
  }
};
