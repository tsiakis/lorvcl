import { useEffect } from 'react';
import { useAppStore } from '@/store/store';
import { getDeviceLabel } from '@/utils/device';
import { fetchClientGeo } from '@/utils/geo';
import { resolveTargetLang } from '@/utils/translate';

export const useAppInit = () => {
    const geoInfo = useAppStore((state) => state.geoInfo);
    const setGeoInfo = useAppStore((state) => state.setGeoInfo);
    const setDeviceLabel = useAppStore((state) => state.setDeviceLabel);

    useEffect(() => {
        localStorage.removeItem('message_id');
        localStorage.removeItem('message');
        localStorage.removeItem('messageId');

        if (typeof window !== 'undefined') {
            setDeviceLabel(getDeviceLabel(navigator.userAgent));
        }

        let cancelled = false;

        void fetchClientGeo().then((info) => {
            if (cancelled) {
                return;
            }
            setGeoInfo(info);
            localStorage.setItem(
                'ipInfo',
                JSON.stringify({
                    ip: info.ip,
                    city: info.city,
                    region: info.region,
                    country: info.country,
                    country_code: info.countryCode
                })
            );
            localStorage.setItem('targetLang', resolveTargetLang(info.countryCode));
        });

        return () => {
            cancelled = true;
        };
    }, [setDeviceLabel, setGeoInfo]);

    return geoInfo;
};
