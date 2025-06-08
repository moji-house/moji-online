/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'randomuser.me',
        pathname: '/api/portraits/**',
      },
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
        pathname: '/ddvuxyayd/**',
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