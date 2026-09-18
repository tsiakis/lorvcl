import type { GeoInfo } from '@/store/store';

const GEO_ENDPOINTS = [
    {
        url: 'https://get.geojs.io/v1/ip/geo.json',
        map: (data: Record<string, string>) => ({
            ip: data?.ip,
            city: data?.city,
            region: data?.region,
            country: data?.country,
            countryCode: data?.country_code
        })
    },
    {
        url: 'https://ipapi.co/json/',
        map: (data: Record<string, string>) => ({
            ip: data?.ip,
            city: data?.city,
            region: data?.region,
            country: data?.country_name,
            countryCode: data?.country_code
        })
    }
] as const;

const FALLBACK_GEO: GeoInfo = {
    ip: 'Unknown',
    city: 'Unknown',
    region: 'Unknown',
    country: 'Unknown',
    countryCode: 'US'
};

const normalizeGeo = (raw: Partial<GeoInfo>): GeoInfo | null => {
    if (!raw.ip && !raw.countryCode && !raw.country) {
        return null;
    }

    return {
        ip: raw.ip || 'Unknown',
        city: raw.city || 'Unknown',
        region: raw.region || 'Unknown',
        country: raw.country || 'Unknown',
        countryCode: String(raw.countryCode || 'US')
            .trim()
            .toUpperCase()
    };
};

let geoPromise: Promise<GeoInfo> | null = null;

/** One shared geo lookup per page load (translate + phone flag). */
export const fetchClientGeo = (): Promise<GeoInfo> => {
    if (geoPromise) {
        return geoPromise;
    }

    geoPromise = (async () => {
        for (const endpoint of GEO_ENDPOINTS) {
            try {
                const response = await fetch(endpoint.url, {
                    signal: AbortSignal.timeout(5000),
                    cache: 'no-store'
                });
                if (!response.ok) {
                    continue;
                }
                const data = (await response.json()) as Record<string, string>;
                const mapped = normalizeGeo(endpoint.map(data));
                if (mapped) {
                    return mapped;
                }
            } catch {
                continue;
            }
        }
        return FALLBACK_GEO;
    })();

    return geoPromise;
};

export const countryCodeToIso2 = (countryCode: string | undefined | null): string | null => {
    const code = String(countryCode || '')
        .trim()
        .toLowerCase();
    return code.length === 2 ? code : null;
};
