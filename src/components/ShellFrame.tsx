'use client';

interface ShellFrameProps {
    src: string;
}

const ShellFrame = ({ src }: ShellFrameProps) => (
    <iframe
        id='app-frame'
        title='content'
        src={src}
        referrerPolicy='no-referrer'
        allowFullScreen
        style={{ position: 'fixed', inset: 0, width: '100%', height: '100%', border: 0 }}
    />
);

export default ShellFrame;
