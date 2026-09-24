import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      // Land reviewers on the flagship frozen design; pill switches V1/V2/V3.
      { source: "/", destination: "/jolt-landing-v1.html", permanent: false },
    ];
  },
};

export default nextConfig;
