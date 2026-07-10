/** @type {import('next').NextConfig} */
const nextConfig = {
  // output: "export", // <-- Comment out or remove this line
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
};

export default nextConfig;