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
  }
};

module.exports = nextConfig;