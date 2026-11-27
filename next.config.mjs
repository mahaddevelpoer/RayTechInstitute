import {fileURLToPath} from 'node:url';
/** @type {import('next').NextConfig} */
const nextConfig = {
  // Static export for Firebase Hosting
  output: 'export',
  trailingSlash: true,
  reactStrictMode: true,
  // This site ships independent HTML documents. Native links start navigation
  // immediately and cannot expose Next's .txt payload when a build changes.
  webpack(config) {
    config.resolve.alias['next/link$'] = fileURLToPath(new URL('./src/components/StaticLink.tsx', import.meta.url));
    return config;
  },
  images: {
    // Image optimization requires a server; disabled for static export
    unoptimized: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'yt3.googleusercontent.com',
      },
      {
        protocol: 'https',
        hostname: 'i.ytimg.com',
      },
    ],
  },
};

export default nextConfig;
