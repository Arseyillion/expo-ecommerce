/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'images.pexels.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'cdn.pixabay.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'i.ibb.co',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'i.imgur.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'loremflickr.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'picsum.photos',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'placehold.co',
        port: '',
        pathname: '/**',
      },
    ],
    domains: [
      'res.cloudinary.com',
      'images.unsplash.com',
      'images.pexels.com',
      'cdn.pixabay.com',
      'i.ibb.co',
      'i.imgur.com',
      'loremflickr.com',
      'picsum.photos',
      'placehold.co',
    ],
  },
  // Add webpack aliases for path resolution
  webpack: (config) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      '@/hooks': './hooks',
    };
    return config;
  },
  // Empty turbopack config to prevent errors
  turbopack: {},
  // Prevent Next.js from interfering with API requests
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'http://localhost:3001/api/:path*',
      },
      // Add specific rewrite for orders to prevent stripping
      {
        source: '/orders',
        destination: 'http://localhost:3001/api/orders',
      },
    ];
  },
};

module.exports = nextConfig