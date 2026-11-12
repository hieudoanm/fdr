import type { NextConfig } from 'next';

const NODE_ENV = process.env.NODE_ENV ?? 'development';
const BASE_PATH = NODE_ENV === 'production' ? '/fdr' : '';

const nextConfig: NextConfig = {
  turbopack: {
    rules: {
      '*.css': {
        loaders: ['@tailwindcss/turbopack'],
      },
    },
  },

  output: 'export',
  trailingSlash: true,
  reactStrictMode: true,
  poweredByHeader: false,
  // GitHub Pages project site lives under /fdr/
  basePath: BASE_PATH,
  assetPrefix: BASE_PATH,
  env: {
    NEXT_PUBLIC_BASE_PATH: BASE_PATH,
  },
  images: { unoptimized: true },
  compiler: {
    removeConsole: NODE_ENV === 'production',
  },
};

export default nextConfig;
