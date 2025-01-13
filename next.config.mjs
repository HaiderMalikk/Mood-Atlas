/** @type {import('next').NextConfig} */
const nextConfig = {
    // to allow google places api's images to be displayed
    images: {
      remotePatterns: [
        {
          protocol: 'https',
          hostname: 'places.googleapis.com',
          port: '',
          pathname: '/**',
        },
      ],
    },
  };
  
export default nextConfig;
  