import CmsPageDetail from '../../../components/CmsPageDetail';

interface CmsPageProps {
  params: Promise<{ slug: string }>;
}

export default async function CmsPage({ params }: CmsPageProps) {
  const { slug } = await params;
  return <CmsPageDetail slug={slug} />;
}
