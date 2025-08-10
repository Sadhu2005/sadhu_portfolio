/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  images: {
    unoptimized: true,
  },
  // Add this line for GitHub Pages
  basePath: '/sadhu_portfolio', 
};

export default nextConfig;