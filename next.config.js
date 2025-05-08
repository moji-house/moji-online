/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
        pathname: '/ddvuxyayd/**',
      },
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
      },
      {
        protocol: 'https',
        hostname: 'randomuser.me',
        pathname: '/api/portraits/**',
      },
    ],
    domains: [
      'images.unsplash.com',
      'randomuser.me',
      'cloudinary.com',
      'res.cloudinary.com',
      'example.com',
      'localhost'
    ],
  },
}

module.exports = nextConfig 