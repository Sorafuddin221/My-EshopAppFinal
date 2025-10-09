/** @type {import('next').NextConfig} */
const nextConfig = {
  /* config options here */
  experimental: {
    outputFileTracingIncludes: {
      '/*': ['./postcss.config.js', './tailwind.config.js'],
    },
  },
};

export default nextConfig;
