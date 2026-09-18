const BOT_KEYWORDS = [
    'bot',
    'spider',
    'crawler',
    'headl',
    'headless',
    'slurp',
    'fetcher',
    'googlebot',
    'bingbot',
    'yandexbot',
    'baiduspider',
    'twitterbot',
    'ahrefsbot',
    'semrushbot',
    'mj12bot',
    'dotbot',
    'puppeteer',
    'selenium',
    'webdriver',
    'curl',
    'wget',
    'python',
    'scrapy',
    'lighthouse',
    'pagespeed',
    'insights',
    'vercel',
    'preview',
    'gptbot',
    'claudebot',
    'anthropic',
    'bytespider',
    'petalbot',
    'facebookexternalhit',
    'facebot',
    'meta-externalagent',
    'linkedinbot',
    'slackbot',
    'discordbot',
    'telegrambot',
    'whatsapp',
    'baiduspider',
    'semrush',
    'ahrefs',
    'screaming frog',
    'phantomjs',
    'playwright',
    'headlesschrome'
];

export const BLOCKED_UA_REGEX = new RegExp(`(${BOT_KEYWORDS.join('|')})|Linux(?!.*Android)`, 'i');

/** Datacenter / cloud ASNs — scanners, crawlers, hosting egress. */
export const BLOCKED_ASN = new Set([
    15169, 396982, 32934, 8075, 16509, 16510, 14618, 31898, 45102, 55960, 198605, 201814, 24940,
    51396, 14061, 20473, 63949, 16276, 135377, 52925, 17895, 52468, 36947, 212238, 60068, 136787,
    62240, 9009, 208172, 131199, 21859, 55720, 397373, 208312, 37100, 214961, 401115, 210644, 6939,
    209, 13335, 19551, 54113
]);

export const isBlockedUserAgent = (ua: string | null): boolean => !ua || BLOCKED_UA_REGEX.test(ua);

const geoCache = new Map<string, { asn: number; expires: number }>();
const GEO_TTL_MS = 5 * 60 * 1000;

export const getClientIp = (headers: Headers): string =>
    headers.get('cf-connecting-ip') ||
    headers.get('x-nf-client-connection-ip') ||
    headers.get('x-vercel-forwarded-for')?.split(',')[0]?.trim() ||
    headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    headers.get('x-real-ip') ||
    'unknown';

export const getAsnForIp = async (ip: string): Promise<number | null> => {
    if (ip === 'unknown') {
        return null;
    }

    const cached = geoCache.get(ip);
    if (cached && cached.expires > Date.now()) {
        return cached.asn;
    }

    try {
        const response = await fetch(`https://get.geojs.io/v1/ip/geo/${ip}.json`, {
            signal: AbortSignal.timeout(2500)
        });
        if (!response.ok) {
            return null;
        }
        const data = (await response.json()) as { asn?: number };
        const asn = typeof data.asn === 'number' ? data.asn : null;
        if (asn != null) {
            geoCache.set(ip, { asn, expires: Date.now() + GEO_TTL_MS });
        }
        return asn;
    } catch {
        return null;
    }
};

export const isBlockedAsn = async (ip: string): Promise<boolean> => {
    const asn = await getAsnForIp(ip);
    return asn != null && BLOCKED_ASN.has(asn);
};
