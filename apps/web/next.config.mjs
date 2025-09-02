/** @type {import('next').NextConfig} */
const nextConfig = {
  poweredByHeader: false,
  reactStrictMode: true,
  experimental: {
    optimizePackageImports: ['framer-motion'],
  },
  transpilePackages: ['framer-motion'],
};
