/** @type {import('next').NextConfig} */
const isProd = process.env.NODE_ENV === 'production';

const repoBase = '/sadhu_portfolio';
const basePathEnv = process.env.BASE_PATH;

const nextConfig = {
  output: 'export',
  images: {
    unoptimized: true,
  },
  basePath: typeof basePathEnv === 'string' ? basePathEnv : (isProd ? repoBase : ''),
  assetPrefix: typeof basePathEnv === 'string' ? (basePathEnv ? `${basePathEnv}/` : undefined) : (isProd ? `${repoBase}/` : undefined),
  env: {
    NEXT_PUBLIC_BASE_PATH: typeof basePathEnv === 'string' ? basePathEnv : (isProd ? repoBase : ''),
  },
  experimental: {
    // Ensure app router respects basePath on export
    // and avoid issues with static assets
  },
};

export default nextConfig;