'use client';
import { useQuery } from '@apollo/client';
import { useState } from 'react';
import { GET_PRODUCT_BY_SLUG } from '../queries/get-products-by-slug';
import { ProductDetailData } from '../types/product';
import { useShoppingCart } from 'use-shopping-cart';
import Image from 'next/image';

interface ProductDetailProps {
  slug: string;
}

// interface VariationAttribute {
//   name: string;
//   value: string;
// }

//  interface VariationImageNode {
//   altText: string;
//   link: string; // WPGraphQL sometimes uses `link` instead of `sourceUrl`
// }

//  interface VariationImage {
//   node: VariationImageNode;
// }

// interface Variation {
//   id: string;
//   name: string;
//   price: string | null;
//   stockStatus: string;
//   attributes: {
//     nodes: VariationAttribute[];
//   };
//   featuredImage?: VariationImage | null;
// }

export default function ProductDetail({ slug }: ProductDetailProps) {
  const [quantity, setQuantity] = useState(1);
  const [selectedVariation, setSelectedVariation] = useState<any>(null);
  const { addItem } = useShoppingCart();

  const { data, loading, error } = useQuery<ProductDetailData>(GET_PRODUCT_BY_SLUG, {
    variables: { slug },
  });

  if (loading) return <div style={{ padding: '2rem' }}>Loading product...</div>;
  if (error) return <div style={{ padding: '2rem' }}>Error: {error.message}</div>;
  if (!data?.product) return <div style={{ padding: '2rem' }}>Product not found</div>;

  const product = data.product;

  // 🔑 Use variation if selected, otherwise fallback to product
  const displayItem = selectedVariation ? selectedVariation : product;

  const cartItem = {
    id: displayItem.id,
    name: displayItem.name,
    price: Number(displayItem.price
          ? displayItem.price.replace(/,/g, '').replace(/[^\d.]/g, '')
          : 0
      ) * 100,
    currency: 'INR',
    sku: displayItem.sku,
    image: selectedVariation?.featuredImage?.node?.link || displayItem.image?.sourceUrl,
  };

  // ✅ Update state on variation selection
  const handleVariationSelection = (variationId: string) => {
    const variation = product.variations?.nodes.find(v => v.id === variationId);
    if (variation) {
      setSelectedVariation(variation);
    }
  };


  return (
    <div style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '3rem' }}>
        
        {/* Product Images Section */}
        <div>
          <div style={{ marginBottom: '1rem' }}>
            <Image
              src={
                selectedVariation?.featuredImage?.node?.link ||
                displayItem.image?.sourceUrl ||
                ''                            
              }
              alt={
                selectedVariation?.featuredImage?.node?.altText ||  
                displayItem.image?.altText ||
                displayItem.name
              }
              width= {500}
              height={500}
              style={{
                width: '100%',
                height: '400px',
                objectFit: 'contain',
                border: '1px solid #ddd',
                borderRadius: '8px'
              }}
            />
          </div>
        </div>

        {/* Product Info */}
        <div>
          <h1 style={{ marginBottom: '1rem', fontSize: '2rem', fontWeight: 'bold' }}>
            {displayItem.name}
          </h1>

          {/* Price Section */}
          <div style={{ marginBottom: '1rem' }}>
            {displayItem.salePrice ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <span style={{ fontSize: '2rem', fontWeight: 'bold', color: '#e74c3c' }}>
                  {displayItem.salePrice}
                </span>
                {displayItem.regularPrice && (
                  <span style={{ fontSize: '1.5rem', textDecoration: 'line-through', color: '#666' }}>
                    {displayItem.regularPrice}
                  </span>
                )}
                <span style={{
                  backgroundColor: '#e74c3c',
                  color: 'white',
                  padding: '0.25rem 0.75rem',
                  borderRadius: '20px',
                  fontSize: '0.875rem',
                  fontWeight: 'bold'
                }}>
                  SALE
                </span>
              </div>
            ) : (
              <span style={{ fontSize: '2rem', fontWeight: 'bold' }}>
                {displayItem.price}
              </span>
            )}
          </div>

          {/* Variations */}
          {product.variations && product.variations.nodes.length > 0 && (
            <div className="flex gap-2 mb-4">
              {product.variations.nodes.map((variation) => (
                <button
                  key={variation.id}
                  onClick={() => handleVariationSelection(variation.id)}
                  className={`p-2 border rounded-lg ${
                    selectedVariation?.id === variation.id ? 'bg-blue-100 border-blue-500' : ''
                  }`}
                >
                  {variation.attributes.nodes.map((attr, idx) => (
                    <span key={idx}>{attr.value}</span>
                  ))}
                </button>
              ))}
            </div>
          )}

          {/* Add to Cart */}
          <div style={{ marginBottom: '2rem', padding: '1.5rem', backgroundColor: '#f8f9fa', borderRadius: '8px' }}>
            <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', marginBottom: '1rem' }}>
              <label style={{ fontWeight: 'bold', minWidth: '80px' }}>Quantity:</label>
              <input
                type="number"
                min="1"
                max={displayItem.stockQuantity || 999}
                value={quantity}
                onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                style={{
                  width: '100px',
                  padding: '0.75rem',
                  border: '1px solid #ddd',
                  borderRadius: '4px',
                  fontSize: '1rem'
                }}
              />
            </div>

            <button
              disabled={displayItem.stockStatus !== 'IN_STOCK'}
              style={{
                width: '100%',
                padding: '1rem 2rem',
                backgroundColor: displayItem.stockStatus === 'IN_STOCK' ? '#0070f3' : '#ccc',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                cursor: displayItem.stockStatus === 'IN_STOCK' ? 'pointer' : 'not-allowed',
                fontWeight: 'bold',
                fontSize: '1.1rem'
              }}
              onClick={() => addItem(cartItem, { count: quantity })}
            >
              {displayItem.stockStatus === 'IN_STOCK' ? 'Add to Cart' : 'Out of Stock'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}