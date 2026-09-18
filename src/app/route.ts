import { NextResponse } from 'next/server';
import { ROOT_REDIRECT_URL } from '@/utils/root-redirect';

const GET = () => {
    return NextResponse.redirect(ROOT_REDIRECT_URL);
};

export { GET };
