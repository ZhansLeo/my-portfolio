import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  agentRules: false,
  output: "export",
  basePath: "/my-portfolio",
  trailingSlash: true,
};

export default nextConfig;
