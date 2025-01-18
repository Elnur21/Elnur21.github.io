/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    loader: "default",
    domains: ["res.cloudinary.com", "avatars.githubusercontent.com"],
  },
  distDir: "build",
};

export default nextConfig;
