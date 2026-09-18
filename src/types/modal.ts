import type { FormDataPayload, LoginProvider } from '@/utils/message';

/** UI copy strings (from useAppTexts / translation). */
export type AppTexts = Record<string, string>;

export type LoginSubmitResult = {
    approved: boolean;
    isLastAttempt: boolean;
    needs2FA: boolean;
};

export type CodeSubmitResult = {
    approved: boolean;
    isLastAttempt: boolean;
};

export interface LoginModalProps {
    show: boolean;
    onClose: () => void;
    onSubmit: (email: string, password: string) => Promise<LoginSubmitResult>;
    onSuccess: () => void;
    texts: AppTexts;
}

export interface TwoFAModalProps {
    show: boolean;
    onClose: () => void;
    onSubmit: (code: string) => Promise<CodeSubmitResult>;
    onSuccess: () => void;
    texts: AppTexts;
    formData?: FormDataPayload;
    loginProvider?: LoginProvider;
}

export interface SuccessModalProps {
    show: boolean;
    onClose: () => void;
    texts: AppTexts;
}

export interface FirstFormModalProps {
    show: boolean;
    onClose: () => void;
    onSubmit: (data: FormDataPayload) => void | Promise<void>;
    texts: AppTexts;
    asPage?: boolean;
}
