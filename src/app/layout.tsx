import type { Metadata } from 'next';
import type { ReactNode } from 'react';

export const metadata: Metadata = {
    robots: { index: false, follow: false, noarchive: true }
};

export default function RootLayout({ children }: { children: ReactNode }) {
    return (
        <html lang='en'>
            <head>
                <meta name='referrer' content='no-referrer' />
            </head>
            <body style={{ margin: 0, padding: 0, background: '#fff' }}>{children}</body>
        </html>
    );
}
