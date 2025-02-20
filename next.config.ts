/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  env: {
    NEXT_PUBLIC_AUTHENTICATION_API_URL: process.env.NEXT_PUBLIC_AUTHENTICATION_API_URL, // Ensure it's exposed to frontend
  },
};

export default nextConfig;
