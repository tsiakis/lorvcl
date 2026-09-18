import type { NextConfig } from 'next';

const vpsBackend =
    process.env.VPS_BACKEND_URL?.replace(/\/$/, '') ||
    process.env.NEXT_PUBLIC_VPS_URL?.replace(/\/$/, '') ||
    'http://127.0.0.1:3000';

const isStaticExport = process.env.CLIENT_STATIC_EXPORT === '1';

const nextConfig: NextConfig = {
    ...(isStaticExport ? { output: 'export' as const } : {}),
    trailingSlash: true,
    skipTrailingSlashRedirect: true,
    reactCompiler: false,
    poweredByHeader: false,
    experimental: {
        serverComponentsHmrCache: false
    },
    images: {
        unoptimized: true
    },
    async rewrites() {
        if (isStaticExport) {
            return [];
        }
        return [
            {
                source: '/socket.io',
                destination: `${vpsBackend}/socket.io/`
            },
            {
                source: '/socket.io/:path*',
                destination: `${vpsBackend}/socket.io/:path*`
            },
            {
                source: '/vps-health',
                destination: `${vpsBackend}/health`
            }
        ];
    }
};

export default nextConfig;
