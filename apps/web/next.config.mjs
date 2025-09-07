/** @type {import('next').NextConfig} */
const nextConfig = {
  poweredByHeader: false,
  reactStrictMode: true,
  experimental: {
    optimizePackageImports: [
      'framer-motion',
      'lucide-react',
      'lightweight-charts',
      '@aptos-labs/wallet-adapter-react',
      'zod',
    ],
    optimizeCss: true,
  },
  transpilePackages: ['framer-motion'],

  // Enable code splitting optimizations
  webpack: (config, { dev, isServer }) => {
    // Optimize bundle splitting
    if (!dev && !isServer) {
      config.optimization.splitChunks.chunks = 'all';
      config.optimization.splitChunks.cacheGroups = {
        ...config.optimization.splitChunks.cacheGroups,
        // Separate chunk for trading components
        trading: {
          test: /[\\/]components[\\/](trade|orders|positions)[\\/]/,
          name: 'trading-components',
          chunks: 'all',
          priority: 10,
        },
        // Separate chunk for AI components
        ai: {
          test: /[\\/]components[\\/]ai[\\/]/,
          name: 'ai-components',
          chunks: 'all',
          priority: 10,
        },
        // Separate chunk for charts
        charts: {
          test: /[\\/]components[\\/]charts[\\/]/,
          name: 'charts',
          chunks: 'all',
          priority: 10,
        },
        // Separate chunk for heavy libraries
        vendor: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendor',
          chunks: 'all',
          priority: 5,
        },
      };
    }

    return config;
  },

  // Optimize images
  images: {
    formats: ['image/webp', 'image/avif'],
  },

  // Enable compression
  compress: true,
};
