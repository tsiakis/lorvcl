'use client';

import { useParams } from 'next/navigation';

export const useContactSlug = (): string => {
    const params = useParams();
    const slug = params?.slug;

    return typeof slug === 'string' ? slug : '';
};

export const useContactUiBase = (): string => {
    const slug = useContactSlug();

    return slug ? `/ui/contact/${slug}` : '';
};
