import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  serverExternalPackages: ['@react-pdf/renderer'],
  // Use Turbopack for faster dev builds (optional, use --turbo flag)
  // turbopack: {},
  webpack: (config, { isServer }) => {
    // Enable WebAssembly support for ffmpeg.wasm
    config.experiments = {
      ...config.experiments,
      asyncWebAssembly: true,
    };
    
    // Handle .wasm files
    config.module.rules.push({
      test: /\.wasm$/,
      type: 'asset/resource',
    });

    return config;
  },
  // Increase body size limit for video uploads (500MB)
  experimental: {
    serverActions: {
      bodySizeLimit: '500mb',
    },
  },
};

export default nextConfig;
