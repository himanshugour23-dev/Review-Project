import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactCompiler: true,

  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "media.rawg.io",
        pathname: "/media/**",
        
      },
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
        pathname: "**", // allow all paths
      },
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
        pathname: "/**",
      }
    ],
    dangerouslyAllowSVG: true,
  },
};

export default nextConfig;
