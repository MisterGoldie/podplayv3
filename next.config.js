const nextConfig = {
  allowedDevOrigins: ["*.trycloudflare.com"],
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
};

module.exports = nextConfig;
