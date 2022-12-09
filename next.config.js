/** @type {import('next').NextConfig} */

const nextConfig = {
  reactStrictMode: true,
  i18n: {
    locales: ['en-US'],
    defaultLocale: 'en-US'
  },
  images: {
    domains: ['api.denaurlen.dev', 'api.denaurlen.com']
  }
}

module.exports = nextConfig
