import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  turbopack: {
    root: process.cwd(),
  },
  images:{
    domains:[
      "uploadthing.com"
    ]
  }
};

export default nextConfig;
