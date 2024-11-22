/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        domains: ['th.bing.com', 'encrypted-tbn0.gstatic.com', 'www.bing.com', 'gstatic.com'],
      },
      typescript: {
        // !! WARN !!
        // Dangerously allow production builds to successfully complete even if
        // your project has type errors.
        // !! WARN !!
        ignoreBuildErrors: true,
      },
};

export default nextConfig;

  
