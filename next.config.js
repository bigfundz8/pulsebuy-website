/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone', // Voor Railway deployment - zorgt voor betere routing
  images: {
    domains: ['images.unsplash.com', 'via.placeholder.com'],
  },
}

module.exports = nextConfig
