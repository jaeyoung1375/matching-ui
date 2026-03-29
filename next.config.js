const nextConfig = {
  /* config options here */

  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.jsdelivr.net",
      },
      {
        protocol: "https",
        hostname: "skillicons.dev",
      },
    ],
  },
};

module.exports = nextConfig;
