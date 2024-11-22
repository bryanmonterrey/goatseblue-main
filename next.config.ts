/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    reactCompiler: true,
  },
  images: {
    dangerouslyAllowSVG: true,
    domains: ['djlnotfpcpsnqxsopxgm.supabase.co'],
    contentDispositionType: 'attachment',
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },
  webpack(config: any) {
    config.module.rules.push({
      test: /\.(mp4|webm|ogg|avi)$/, // Add more video formats if needed
      use: {
        loader: 'file-loader',
        options: {
          name: '[name].[hash].[ext]',
          outputPath: 'static/videos', // Directory for output
        },
      },
    });
    return config;
  },
};

module.exports = nextConfig;
