'use client';

import { useQuery } from '@apollo/client';
import GET_PRODUCTS from '@/queries/get-products-list';
import Link from 'next/link';
import Image from 'next/image';

interface Product {
  id: number;
  name: string;
  slug: string;
  onSale: boolean;
  image: {
    altText: string;
    uri: string; // Use `sourceUrl` as per WooCommerce schema
  } | null;
  price: string | null;
  uri: string;
}

interface ProductsData {
  products: {
    nodes: Product[];
  };
}

export default function ProductList() {
  
  // Fetch products from WooCommerce GraphQL API
  const { data, loading, error } = useQuery<ProductsData>(GET_PRODUCTS);

  // Loading state
  if (loading) return <p>Loading products...</p>;

  // Error state
  if (error) return <p>Error: {error.message}</p>;

  // Display products
  return (
    <div>
      <h1 className='product-page-title'>Products</h1>
      <div className='product-list-grid'>
            {data?.products?.nodes?.map((product, index) => (
            <Link className="product-grid" key={product.id || index} style={{ marginBottom: '10px' }} href={`${process.env.NEXT_PUBLIC_API_URL}${product.uri}`}>
            {product.image?.uri && (
                <Image
                src={`${process.env.NEXT_PUBLIC_WORDPRESS_API_URL}${product.image.uri}`}
                alt={product.image.altText || product.name}
                width={500}
                height={500}
                style={{ width: '100px', height: '100px', objectFit: 'cover' }}
                />
            )}
            <h2>{product.name}</h2>
            <p>{product.price ? `${product.price}` : 'Price not available'}</p>
            </Link>
        ))}
      </div>
    </div>
  );
}
