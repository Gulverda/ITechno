import { withPayload } from '@payloadcms/next/withPayload'

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Your Next.js config here
  webpack: (webpackConfig) => {
    webpackConfig.resolve.extensionAlias = {
      '.cjs': ['.cts', '.cjs'],
      '.js': ['.ts', '.tsx', '.js', '.jsx'],
      '.mjs': ['.mts', '.mjs'],
    }

    return webpackConfig
  },
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'flagcdn.com' },
      { hostname: 'www.ezviz.com' },
      { hostname: 'ajax.systems' },
      { hostname: 'hdsurveillance.com.au' },
      { hostname: 'www.westerndigital.com' },
      { hostname: 'www.westerndigital.com' },
      { hostname: 'img.icons8.com' },
    ],
  },
}

export default withPayload(nextConfig, { devBundleServerPackages: false })
