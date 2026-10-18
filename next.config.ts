import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      // TEMP-DISABLED for local React-app testing (Hermes, 2026-10-18). Restore after test.
      // Land visitors on the V5 dispatch-board design (current flagship).
      // { source: "/", destination: "/jolt-landing-v5.html", permanent: false },
    ];
  },
};

export default nextConfig;
