/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  compress: true,
  images: {
    formats: ["image/avif", "image/webp"],
    deviceSizes: [420, 640, 828, 1080, 1440, 1920],
    minimumCacheTTL: 60 * 60 * 24 * 30,
  },
};
export default nextConfig;
