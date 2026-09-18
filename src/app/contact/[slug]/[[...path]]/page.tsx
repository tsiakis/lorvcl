import ShellFrame from '@/components/ShellFrame';

export const dynamicParams = true;

interface ShellPageProps {
    params: Promise<{ slug: string; path?: string[] }>;
}

const ShellPage = async ({ params }: ShellPageProps) => {
    const { slug, path } = await params;
    const subPath = path?.length ? `/${path.join('/')}/` : '';
    return <ShellFrame src={`/ui/contact/${slug}${subPath}`} />;
};

export default ShellPage;
