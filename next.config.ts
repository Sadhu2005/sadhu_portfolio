/** @type {import('next').NextConfig} */
const nextConfig = {
  // This creates a static export of your site in an "out" folder.
  output: 'export',

  // This disables the default server-based image optimization.
  images: {
    unoptimized: true,
  },
};

export default nextConfig;