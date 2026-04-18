// next.config.ts
import { withPayload } from "@payloadcms/next/withPayload";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: { ignoreDuringBuilds: true },
  typescript: { ignoreBuildErrors: true },
  output: 'standalone',
  reactStrictMode: true,
  
  // 🔹 ДОБАВЬ ЭТОТ БЛОК:
  server: {
    bodyParser: {
      sizeLimit: '100mb',  // ← Лимит размера запроса
    },
  },
  
  sassOptions: {
    includePaths: ["./src"],
  },
  
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '3000',
        pathname: '/media/**',
      },
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '3000',
        pathname: '/players/**',
      },
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '3000',
        pathname: '/logo/**',
      },
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
  
  webpack: (config, { isServer, webpack }) => {
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
        crypto: false,
        path: false,
        os: false,
      };
      
      config.externals = config.externals || [];
      config.externals.push({
        'payload': 'commonjs payload',
        '@payloadcms/next': 'commonjs @payloadcms/next',
        '@payloadcms/db-mongodb': 'commonjs @payloadcms/db-mongodb',
      });
      
      config.plugins = config.plugins || [];
      config.plugins.push(
        new webpack.IgnorePlugin({
          resourceRegExp: /^payload$/,
          contextRegExp: /src\/lib\/get-payload/,
        })
      );
    }
    return config;
  },
};

export default withPayload(nextConfig);