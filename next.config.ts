import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: ['sequelize', 'mysql2'],
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'd38e565eilzns0.cloudfront.net',
      },
    ],
  },
};

export default nextConfig;
