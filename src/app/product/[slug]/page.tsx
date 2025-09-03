// src/app/products/[slug]/page.tsx
import ProductDetail from '../../../components/ProductDetail';

interface ProductPageProps {
  params: {
    slug: string;
  };
}

export default function ProductPage({ params }: ProductPageProps) {
  return <ProductDetail slug={params.slug} />;
}

// Optional: Generate metadata for SEO
export async function generateMetadata({ params }: ProductPageProps) {
  // You can fetch product data here for meta tags
  return {
    title: `Product: ${params.slug}`,
    description: `View details for ${params.slug}`,
  };
}