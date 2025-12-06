/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverComponentsExternalPackages: ['stripe']
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '*.supabase.co',
        port: '',
        pathname: '/storage/v1/object/public/**'
      },
      {
        protocol: 'https', 
        hostname: '*.r2.cloudflarestorage.com',
        port: '',
        pathname: '/**'
      }
    ]
  },
  env: {
    CUSTOM_KEY: process.env.CUSTOM_KEY
  }
}

export default nextConfig