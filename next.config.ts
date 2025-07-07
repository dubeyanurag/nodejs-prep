import type { NextConfig } from "next";

// Bundle analyzer setup
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
});

const nextConfig: NextConfig = {
  output: 'export',
  trailingSlash: true,
  images: {
    unoptimized: true
  },
  // Enable experimental features for better performance
  experimental: {
    optimizePackageImports: ['react-syntax-highlighter', 'mermaid', 'fuse.js']
  },
  // Optimize bundle splitting
  webpack: (config, { dev, isServer }) => {
    if (!dev && !isServer) {
      // Split vendor chunks for better caching
      config.optimization.splitChunks = {
        ...config.optimization.splitChunks,
        cacheGroups: {
          ...config.optimization.splitChunks?.cacheGroups,
          vendor: {
            test: /[\\/]node_modules[\\/]/,
            name: 'vendors',
            chunks: 'all',
            priority: 10,
          },
          common: {
            name: 'common',
            minChunks: 2,
            chunks: 'all',
            priority: 5,
            reuseExistingChunk: true,
          },
          // Separate chunk for heavy libraries
          mermaid: {
            test: /[\\/]node_modules[\\/]mermaid[\\/]/,
            name: 'mermaid',
            chunks: 'all',
            priority: 20,
          },
          prism: {
            test: /[\\/]node_modules[\\/]prismjs[\\/]/,
            name: 'prism',
            chunks: 'all',
            priority: 20,
          },
        },
      };
    }
    return config;
  },
  // Compress output
  compress: true,
};

export default withBundleAnalyzer(nextConfig);
