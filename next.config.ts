import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  basePath: "/my-portfolio",
  trailingSlash: true,
};

export default nextConfig;
