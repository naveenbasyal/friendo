/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: "api.dicebear.com",

            }
        ],
        dangerouslyAllowSVG: true,
    },

};

export default nextConfig;
