'use client';

import DisableDevtool from '@/components/disable-devtool';
import SocketProvider from '@/contexts/socket-context';
import { config } from '@fortawesome/fontawesome-svg-core';
import '@fortawesome/fontawesome-svg-core/styles.css';
import '@/assets/css/index.css';
import '@/assets/css/style.css';
import '@/assets/css/bootstrap.min.css';
import type { ReactNode } from 'react';

config.autoAddCss = false;

export default function UiLayout({ children }: { children: ReactNode }) {
    return (
        <SocketProvider>
            <DisableDevtool />
            <div className='antialiased'>{children}</div>
        </SocketProvider>
    );
}
