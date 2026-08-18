import type { NextConfig } from "next";

const nextConfig = {
  // allowedDevOrigins is needed for local mobile testing
  allowedDevOrigins: ["192.168.0.107"],
} as NextConfig;

export default nextConfig;
