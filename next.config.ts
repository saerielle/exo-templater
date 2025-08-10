import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        path: false
      }
    }
    return config
  },
  output: 'export',
  basePath: '/exo-templater',
  images: {
    unoptimized: true
  }
}

export default nextConfig
