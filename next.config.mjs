// Sent with every page and file; scripts aren't restricted here because the chatbot
// loads its model and WebAssembly runtime from external CDNs
const securityHeaders = [
  {
    key: "Content-Security-Policy",
    value: "frame-ancestors 'self'; object-src 'none'; base-uri 'self'; form-action 'self'",
  },
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains" },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), payment=(), usb=(), interest-cohort=()",
  },
];

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  // English (default, no URL prefix), Azerbaijani (/az) and Russian (/ru)
  i18n: {
    locales: ["en", "az", "ru"],
    defaultLocale: "en",
  },
  images: {
    // Only GitHub avatars may go through the image optimizer
    remotePatterns: [
      {
        protocol: "https",
        hostname: "avatars.githubusercontent.com",
        port: "",
        pathname: "/u/**",
      },
    ],
  },
  async headers() {
    return [{ source: "/:path*", headers: securityHeaders }];
  },
};

export default nextConfig;
