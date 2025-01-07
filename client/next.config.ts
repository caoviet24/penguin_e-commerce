import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
    reactStrictMode: true,
    images: {
        domains: ['img.lazcdn.com', 'down-vn.img.susercontent.com'],
    },
};

export default nextConfig;
