import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      // Land visitors on the V5 dispatch-board design (current flagship).
      { source: "/", destination: "/jolt-landing-v5.html", permanent: false },
    ];
  },
};

export default nextConfig;
