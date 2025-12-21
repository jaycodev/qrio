export const config = {
  api: {
    baseUrl: process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8080',
  },
  dev: {
    accessToken: process.env.NEXT_PUBLIC_DEV_ACCESS_TOKEN || '',
  },
}
