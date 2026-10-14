import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: '/blog/won-konbini-sweets',
        destination: '/blog/convenience-coupon-guide',
        permanent: true,
      },
    ]
  },
};

export default nextConfig;
