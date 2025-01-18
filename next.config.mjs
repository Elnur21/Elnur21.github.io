/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    loader: "default",
    domains: ["res.cloudinary.com", "avatars.githubusercontent.com"],
  },
};

export default nextConfig;
