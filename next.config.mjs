/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // English (default, no URL prefix), Azerbaijani (/az) and Russian (/ru)
  i18n: {
    locales: ["en", "az", "ru"],
    defaultLocale: "en",
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
        port: "",
      },
      {
        protocol: "https",
        hostname: "avatars.githubusercontent.com",
        port: "",
      },
    ],
  },
};

export default nextConfig;
