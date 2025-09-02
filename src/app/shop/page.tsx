'use client';

import { useQuery } from '@apollo/client';
import GET_PRODUCTS from '@/queries/get-products-list';

interface Product {
  id: number;
  name: string;
  slug: string;
  onSale: boolean;
  image: {
    altText: string;
    sourceUrl: string; // Use `sourceUrl` as per WooCommerce schema
  } | null;
  price: string | null;
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
      <h1>Products</h1>
      <div className='product-list-grid'>
            {data?.products?.nodes?.map((product, index) => (
            <div key={product.id || index} style={{ marginBottom: '10px' }}>
            <h2>{product.name}</h2>
            {product.image?.sourceUrl && (
                <img
                src={product.image.sourceUrl}
                alt={product.image.altText || product.name}
                style={{ width: '100px', height: '100px', objectFit: 'cover' }}
                />
            )}
            <p>{product.price ? `$${product.price}` : 'Price not available'}</p>
            </div>
        ))}
      </div>
    </div>
  );
}
