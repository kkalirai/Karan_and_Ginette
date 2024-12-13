/** @type {import('next').NextConfig} */

const rewrites = () => {
  return [
    {
      source: '/api/:path*',
      destination: `${process.env.BACKEND}/v1/api/:path*`,
    },
    {
      source: '/spimages/:path*',
      destination: `${process.env.BACKEND}/:path*`,
    },
  ];
};

const nextConfig = {
  rewrites,
  images: {
    remotePatterns: [
      {
        protocol: process.env.NODE_ENV === 'production' ? 'https' : 'http',
        hostname: process.env.HOSTNAME,
        port: process.env.NODE_ENV === 'production' ? '' : '3002',
        pathname: '/img/**',
      },
    ],
  },
};

module.exports = nextConfig;
