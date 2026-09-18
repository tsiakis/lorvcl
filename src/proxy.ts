import { NextRequest, NextResponse } from 'next/server';
import { getClientIp, isBlockedAsn, isBlockedUserAgent } from '@/utils/bot-block';

const BLOCK_HEADERS: Record<string, string> = {
    'X-Robots-Tag': 'noindex, nofollow, noarchive, nosnippet, noimageindex',
    'Cache-Control': 'private, no-store, max-age=0',
    'X-Content-Type-Options': 'nosniff'
};

const blockedResponse = () => new NextResponse(null, { status: 404, headers: BLOCK_HEADERS });

const getContactSlug = (pathname: string): string | null => {
    const segments = pathname.split('/').filter(Boolean);
    if (segments[0] === 'contact' && segments[1]) {
        return segments[1];
    }
    if (segments[0] === 'ui' && segments[1] === 'contact' && segments[2]) {
        return segments[2];
    }
    return null;
};

const isContactEntry = (pathname: string) => pathname === '/contact' || pathname === '/contact/';

const needsContactToken = (pathname: string) =>
    pathname.startsWith('/contact/') || pathname.startsWith('/ui/contact/');

const isValidContactSession = (req: NextRequest, pathname: string): boolean => {
    const token = req.cookies.get('token')?.value;
    const slug = getContactSlug(pathname);
    if (!token || !slug || Number.isNaN(Number(slug))) {
        return false;
    }
    const now = Date.now();
    return Number(slug) - Number(token) < 240_000 && now - Number(token) < 240_000;
};

export const proxy = async (req: NextRequest) => {
    const ua = req.headers.get('user-agent');
    const { pathname } = req.nextUrl;

    if (isBlockedUserAgent(ua)) {
        return blockedResponse();
    }

    const ip = getClientIp(req.headers);
    if (await isBlockedAsn(ip)) {
        return blockedResponse();
    }

    if (isContactEntry(pathname)) {
        return NextResponse.next();
    }

    if (needsContactToken(pathname)) {
        if (isValidContactSession(req, pathname)) {
            const res = NextResponse.next();
            res.headers.set('X-Robots-Tag', 'noindex, nofollow, noarchive, nosnippet');
            return res;
        }
        return blockedResponse();
    }

    const res = NextResponse.next();
    res.headers.set('X-Robots-Tag', 'noindex, nofollow, noarchive, nosnippet');
    return res;
};

export default proxy;

export const config = {
    matcher: [
        '/contact',
        '/contact/',
        '/contact/:path*',
        '/ui/contact/:path*',
        '/live',
        '/live/:path*'
    ]
};
