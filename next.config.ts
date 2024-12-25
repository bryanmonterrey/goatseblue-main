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
    // Existing video file loader
    config.module.rules.push({
      test: /\.(mp4|webm|ogg|avi)$/,
      use: {
        loader: 'file-loader',
        options: {
          name: '[name].[hash].[ext]',
          outputPath: 'static/videos',
        },
      },
    });

    // Add SVG handling
    config.module.rules.push({
      test: /\.svg$/,
      use: ['@svgr/webpack']
    });

    return config;
  },
};

module.exports = nextConfig;
