import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  turbopack: {
    root: process.cwd(),
  },
  images:{
    remotePatterns:[
      {
        protocol: "https",
        hostname: "uploadthing.com"
      },
      {
        protocol: "https",
        hostname: "utfs.io"
      }
    ]
  }
};

export default nextConfig;
