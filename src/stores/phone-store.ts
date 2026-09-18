import { create } from 'zustand';

interface PhoneState {
    countryCode: string | null;
    dialCode: string | null;
    setCountry: (countryCode: string, dialCode: string) => void;
    clearCountry: () => void;
}

/** User override when they pick another flag in the phone field. */
const usePhoneStore = create<PhoneState>((set) => ({
    countryCode: null,
    dialCode: null,
    setCountry: (countryCode, dialCode) => set({ countryCode, dialCode }),
    clearCountry: () => set({ countryCode: null, dialCode: null })
}));

export default usePhoneStore;
