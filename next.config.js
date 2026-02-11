/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    unoptimized: true,
  },
  trailingSlash: true,
  basePath: process.env.NODE_ENV === 'production' ? '/VishalJhaPortfolio' : '',
  assetPrefix: process.env.NODE_ENV === 'production' ? '/VishalJhaPortfolio/' : '',
}

module.exports = nextConfig
