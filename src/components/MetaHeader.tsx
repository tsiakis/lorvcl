'use client';

import LogoMeta from '@/assets/images/logo-meta.svg';
import Image from 'next/image';
import Link from 'next/link';
import type { FC } from 'react';

interface MetaHeaderProps {
    homeHref?: string;
    texts?: { altMeta?: string };
}

const MetaHeader: FC<MetaHeaderProps> = ({ homeHref, texts }) => {
    const logo = (
        <Image src={LogoMeta} width={64} height={22} alt={texts?.altMeta || 'Meta'} className="h-[22px] w-auto" />
    );

    return (
        <header
            className="flex h-[52px] w-full shrink-0 items-center justify-center border-b border-[#E0E0E0] bg-white"
            role="banner"
        >
            <div className="flex w-full max-w-[1280px] items-center justify-between px-4">
                {homeHref ? <Link href={homeHref}>{logo}</Link> : logo}
            </div>
        </header>
    );
};

export default MetaHeader;
