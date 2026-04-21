import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Native pg driver must not be bundled for serverless — avoids Vercel build/runtime issues
  serverExternalPackages: ["pg", "@prisma/adapter-pg", "@prisma/client"],
};

export default nextConfig;
