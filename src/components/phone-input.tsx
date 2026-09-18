'use client';

import './phone-input.css';
import usePhoneStore from '@/stores/phone-store';
import { useAppStore } from '@/store/store';
import { countryCodeToIso2, fetchClientGeo } from '@/utils/geo';
import intlTelInput from 'intl-tel-input';
import 'intl-tel-input/build/css/intlTelInput.css';
import { useEffect, useRef, type ClipboardEvent, type FC, type KeyboardEvent } from 'react';

type IntlTelInputInstance = ReturnType<typeof intlTelInput>;
type IntlTelInputOptions = NonNullable<Parameters<typeof intlTelInput>[1]>;
type InitialCountry = NonNullable<IntlTelInputOptions['initialCountry']>;

interface PhoneInputProps {
    value: string;
    onChange: (value: string) => void;
    error?: boolean;
    id?: string;
    name?: string;
    forceCountry?: string;
    placeholder?: string;
}

const PhoneInput: FC<PhoneInputProps> = ({ value, onChange, error, id, name, forceCountry, placeholder }) => {
    const inputRef = useRef<HTMLInputElement>(null);
    const itiRef = useRef<IntlTelInputInstance | null>(null);
    const isUpdatingRef = useRef(false);
    const geoCountryCode = useAppStore((state) => state.geoInfo?.countryCode);
    const { countryCode: userCountry, setCountry } = usePhoneStore();

    const resolvedCountry = forceCountry || userCountry || countryCodeToIso2(geoCountryCode) || 'auto';

    useEffect(() => {
        const inputElement = inputRef.current;

        if (inputElement && !itiRef.current) {
            const itiOptions = {
                initialCountry: resolvedCountry as InitialCountry,
                nationalMode: false,
                showSelectedDialCode: true,
                autoPlaceholder: placeholder ? 'off' : 'polite',
                loadUtils: () => import('intl-tel-input/build/js/utils.js'),
                geoIpLookup: (callback: (iso2: string) => void) => {
                    if (forceCountry) {
                        callback(forceCountry);
                        return;
                    }
                    if (userCountry) {
                        callback(userCountry);
                        return;
                    }
                    const fromGeo = countryCodeToIso2(geoCountryCode);
                    if (fromGeo) {
                        callback(fromGeo);
                        return;
                    }
                    void fetchClientGeo().then((info) => {
                        callback(countryCodeToIso2(info.countryCode) || 'us');
                    });
                }
            } as IntlTelInputOptions;

            itiRef.current = intlTelInput(inputElement, itiOptions);

            const handleCountryChange = () => {
                if (isUpdatingRef.current || !itiRef.current) return;

                isUpdatingRef.current = true;

                const selectedCountryData = itiRef.current.getSelectedCountryData();
                const dialCode = selectedCountryData.dialCode;
                const iso2 = selectedCountryData.iso2;

                if (iso2) {
                    setCountry(iso2, dialCode);
                }

                if (dialCode) {
                    itiRef.current.setNumber(`+${dialCode}`);
                }

                setTimeout(() => {
                    isUpdatingRef.current = false;
                }, 0);
            };

            const handleInput = () => {
                if (isUpdatingRef.current || !itiRef.current) return;

                isUpdatingRef.current = true;

                const fullNumber = itiRef.current.getNumber();
                const selectedCountryData = itiRef.current.getSelectedCountryData();
                const dialCode = selectedCountryData.dialCode;

                if (fullNumber && fullNumber.startsWith('+')) {
                    onChange(fullNumber);
                } else if (inputElement.value && dialCode) {
                    const digits = inputElement.value.replace(/\D/g, '');
                    onChange(digits ? `+${dialCode}${digits}` : '');
                } else {
                    onChange(inputElement.value);
                }

                setTimeout(() => {
                    isUpdatingRef.current = false;
                }, 0);
            };

            inputElement.addEventListener('input', handleInput);
            inputElement.addEventListener('countrychange', handleCountryChange);

            return () => {
                inputElement.removeEventListener('input', handleInput);
                inputElement.removeEventListener('countrychange', handleCountryChange);
                itiRef.current?.destroy();
                itiRef.current = null;
            };
        }
    }, []);

    useEffect(() => {
        if (!itiRef.current || userCountry || forceCountry) {
            return;
        }
        const iso2 = countryCodeToIso2(geoCountryCode);
        if (!iso2) {
            return;
        }
        const current = itiRef.current.getSelectedCountryData()?.iso2;
        if (current !== iso2) {
            (itiRef.current.setCountry as (country: string) => void)(iso2);
        }
    }, [geoCountryCode, userCountry, forceCountry]);

    useEffect(() => {
        if (itiRef.current && value && !isUpdatingRef.current) {
            itiRef.current.setNumber(value);
        }
    }, [value]);

    const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
        const allowKeys = ['Backspace', 'Delete', 'ArrowLeft', 'ArrowRight', 'Tab', 'Home', 'End'];
        if (allowKeys.includes(e.key) || e.ctrlKey || e.metaKey) {
            return;
        }

        if (!/^\d$/.test(e.key)) {
            e.preventDefault();
        }
    };

    const handlePaste = (e: ClipboardEvent<HTMLInputElement>) => {
        const pastedText = e.clipboardData?.getData('text') || '';
        if (!/^\d+$/.test(pastedText)) {
            e.preventDefault();
        }
    };

    return (
        <div className={error ? 'is-invalid' : ''}>
            <input
                ref={inputRef}
                className={`form-control ${error ? 'is-invalid' : ''}`}
                id={id}
                name={name}
                type="tel"
                inputMode="numeric"
                onKeyDown={handleKeyDown}
                onPaste={handlePaste}
                placeholder={placeholder}
            />
        </div>
    );
};

export default PhoneInput;
