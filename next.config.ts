// next.config.ts
import { withPayload } from "@payloadcms/next/withPayload";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: { ignoreDuringBuilds: true },
typescript: { ignoreBuildErrors: true },

  /* Режим standalone для Docker */
  output: 'standalone',
  
  /* Базовая конфигурация Next.js */
  reactStrictMode: true,
  
  /* Уберите или закомментируйте, если не используете React Compiler */
  // reactCompiler: true, // ← Эта опция экспериментальная, может вызывать ошибки
  
  /* Опции для SCSS модулей */
  sassOptions: {
    includePaths: ["./src"],
  },
  
  /* Оптимизация изображений */
   images: {
    // Разрешаем Next.js оптимизировать изображения с этих путей:
    remotePatterns: [

      {
        protocol: 'http',
        hostname: 'localhost',
        port: '3000',
        pathname: '/media/**',            // ← Классические статические файлы
      },
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '3000',
        pathname: '/players/**',          // ← Твои старые картинки из public/
      },
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '3000',
        pathname: '/logo/**',             // ← Логотипы
      },
      // Для продакшена (когда будешь деплоить):
      {
        protocol: 'https',
        hostname: '**',  // ⚠️ Разрешает все HTTPS домены (для разработки ок)
      },
    ],
  },
  
  /* Экспериментальные фичи (опционально) */
  experimental: {
    // turbo: {
    //   rules: {
    //     '*.svg': {
    //       loaders: ['@svgr/webpack'],
    //       as: '*.js',
    //     }
    //   }
    // }
  },
  
  /* Webpack конфигурация для исключения Payload из клиентского бандла */
  webpack: (config, { isServer, webpack }) => {
    if (!isServer) {
      // Исключаем серверные модули из клиентского бандла
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
        crypto: false,
        path: false,
        os: false,
      };
      
      // Исключаем Payload из клиентского бандла
      config.externals = config.externals || [];
      config.externals.push({
        'payload': 'commonjs payload',
        '@payloadcms/next': 'commonjs @payloadcms/next',
        '@payloadcms/db-mongodb': 'commonjs @payloadcms/db-mongodb',
      });
      
      // Игнорируем импорты Payload на клиенте
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

// ТОЛЬКО ОДИН вызов withPayload!
export default withPayload(nextConfig);

