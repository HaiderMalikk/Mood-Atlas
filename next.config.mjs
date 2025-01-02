/** @type {import('next').NextConfig} */
const nextConfig = {
    // to allow google places api's images to be displayed
    images: {
      remotePatterns: [
        {
          protocol: 'https',
          hostname: 'maps.googleapis.com',
          port: '',
          pathname: '/maps/api/place/photo**',
        },
      ],
    },
  };
  
export default nextConfig;
  