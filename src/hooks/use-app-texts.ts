import { useAppInit } from '@/hooks/use-app-init';
import { useTexts, type Texts } from '@/hooks/use-texts';

export const useAppTexts = (): Texts => {
    const geoInfo = useAppInit();
    const countryCode = geoInfo?.countryCode || 'US';

    return useTexts(countryCode);
};
