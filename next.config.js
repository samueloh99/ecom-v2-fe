const path = require('path')

module.exports = {
  experimental: {
    outputStandalone: true
  }
}

module.exports = {
  sassOptions: {
    includePaths: [path.join(__dirname, 'styles')]
  },
  reactStrictMode: true,

  images: {
    domains: [
      'chaes-upload-photos-dev.s3.sa-east-1.amazonaws.com',
      'chaes-upload-photos.s3.sa-east-1.amazonaws.com'
    ],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'chaes-upload-photos-dev.s3.sa-east-1.amazonaws.com',
        pathname: '/**'
      },
      {
        protocol: 'https',
        hostname: 'chaes-upload-photos.s3.sa-east-1.amazonaws.com',
        pathname: '/**'
      }
    ]
  },
  async redirects() {
    return [
      {
        source: '/admin',
        destination: '/admin/pedidos',
        permanent: true
      }
    ]
  }
}
