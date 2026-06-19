/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['images.unsplash.com', 'avatars.githubusercontent.com'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
  experimental: {
    serverActions: {
      allowedOrigins: ['localhost:3000'],
    },
  },
  async redirects() {
    return [
      {
        source: '/education/email',
        destination: '/email',
        permanent: true,
      },
      {
        source: '/education/traffic',
        destination: '/trafego',
        permanent: true,
      },
      {
        source: '/education/pricing',
        destination: '/precos',
        permanent: true,
      },
      {
        source: '/education',
        destination: '/metodologia',
        permanent: true,
      },
      {
        source: '/education/pt',
        destination: '/metodologia/pt',
        permanent: true,
      },
      {
        source: '/education/en',
        destination: '/metodologia/en',
        permanent: true,
      },
      {
        source: '/education/es',
        destination: '/metodologia/es',
        permanent: true,
      },
    ]
  },
}

module.exports = nextConfig
