/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: '**.airtableusercontent.com' },
      { protocol: 'https', hostname: '**.supabase.co' },
    ],
  },
  async rewrites() {
    return [
      {
        source: '/api/webhook/messagesapi/webhook/messages',
        destination: '/api/webhook/messages',
      },
      {
        source: '//api/webhook/messagesapi/webhook/messages',
        destination: '/api/webhook/messages',
      },
    ]
  },
}

module.exports = nextConfig
