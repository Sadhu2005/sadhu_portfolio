/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  images: {
    unoptimized: true,
  },
  // ADD THIS LINE
  basePath: '/sadhu_portfolio', // Example: '/sadhu_portfolio'
};

export default nextConfig;