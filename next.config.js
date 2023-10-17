/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: "standalone",
  images: {
    domains: ['virtual.chevroncemcs.com'],
  },
}

module.exports = nextConfig
