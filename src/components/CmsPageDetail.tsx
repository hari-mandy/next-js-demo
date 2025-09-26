'use client';
import { useQuery } from '@apollo/client';
import GET_PAGE_BY_SLUG from '../queries/get-page-by-slug';
import { CmsPageData } from '../types/cmspage';
import parse from 'html-react-parser';

interface CmsPageProps {
  slug: string;
}

export default function CmsPage({ slug }: CmsPageProps) {
    const { data, loading, error } = useQuery<CmsPageData>(GET_PAGE_BY_SLUG, {
        variables: { slug },
    });

    if (loading) return <div style={{ padding: '2rem' }}>Loading page...</div>;
    if (error) return <div style={{ padding: '2rem' }}>Error: {error.message}</div>;
    if (!data?.page) return <div style={{ padding: '2rem' }}>Page not found</div>;

    const page = data.page;

    return (
    <div>
      <h1>{page.title}</h1>
      <div>
        {parse(page.content)}
      </div>
    </div>
  );
}