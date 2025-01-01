/** @type {import('next').NextConfig} */

const nextConfig = {
  output: 'export',  // This tells Next.js to export static files
  // Since we're not using images from external sources, we don't need an image loader
  images: {
    unoptimized: true
  }
}

module.exports = nextConfig
