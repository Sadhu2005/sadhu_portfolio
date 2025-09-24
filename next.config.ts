/** @type {import('next').NextConfig} */
const isProd = process.env.NODE_ENV === 'production';

const repoBase = '/sadhu_portfolio';
const basePathEnv = process.env.BASE_PATH;

const nextConfig = {
  output: 'export',
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
  basePath: typeof basePathEnv === 'string' ? basePathEnv : '',
  assetPrefix: typeof basePathEnv === 'string' ? (basePathEnv ? `${basePathEnv}/` : undefined) : undefined,
  env: {
    NEXT_PUBLIC_BASE_PATH: typeof basePathEnv === 'string' ? basePathEnv : '',
  },
  experimental: {
    // Ensure app router respects basePath on export
    // and avoid issues with static assets
  },
};

export default nextConfig;