'use client';

import { useQuery, useMutation } from '@apollo/client';
import { useEffect, useState } from 'react';
import { GET_PRODUCT_BY_SLUG } from '../queries/get-products-by-slug';
import { ProductDetailData } from '../types/product';
import { useShoppingCart } from 'use-shopping-cart';
import { ADD_TO_CART } from '../queries/add-to-cart';
import Image from 'next/image';

interface ProductDetailProps {
  slug: string;
}

export default function ProductDetail({ slug }: ProductDetailProps) {
  const [quantity, setQuantity] = useState(1);
  const [selectedVariation, setSelectedVariation] = useState<any>(null);
  const [displayItem, setDisplayItem] = useState<any>(null);
  const [addToCartBtn, setAddToCartBtn] = useState(false);
  const [addToCartMutation] = useMutation(ADD_TO_CART);

  const { addItem } = useShoppingCart();

  // ✅ Always run hooks unconditionally
  const { data, loading, error } = useQuery<ProductDetailData>(
    GET_PRODUCT_BY_SLUG,
    { variables: { slug } }
  );

  const product = data?.product;
  const isGrouped = Boolean((product as any)?.products?.nodes?.length);

  // ✅ Set default variation safely (depends on `product`)
  useEffect(() => {
    if (isGrouped) {
      setSelectedVariation(null);
      return;
    }
    if (product?.variations?.nodes?.length) {
      setSelectedVariation(product.variations.nodes[0]);
    }
  }, [product, isGrouped]);

  // ✅ Update display item when product or variation changes
  useEffect(() => {
    if (product) {
      setDisplayItem(selectedVariation || product);
    }
  }, [selectedVariation, product]);

  // ✅ Loading / error / not found states
  if (loading) {
    return <div style={{ padding: '2rem' }}>Loading product...</div>;
  }
  if (error) {
    return <div style={{ padding: '2rem' }}>Error: {error.message}</div>;
  }
  if (!product) {
    return <div style={{ padding: '2rem' }}>Product not found</div>;
  }

  // ✅ Cart item payload
  const cartItem = {
    id: displayItem?.id,
    name: displayItem?.name,
    price: Number(
      displayItem?.price
        ? displayItem.price.replace(/,/g, '').replace(/[^\d.]/g, '')
        : 0
    ),
    currency: 'INR',
    sku: displayItem?.sku,
    image:
      selectedVariation?.featuredImage?.node?.link ||
      displayItem?.image?.sourceUrl ||
      '/placeholder.png',
  };

  const handleVariationSelection = (variationId: string) => {
    const variation = product.variations?.nodes.find(v => v.id === variationId);
    if (variation) {
      setSelectedVariation(variation);
      setAddToCartBtn(false); // reset button state on change
    }
  };

  const handleAddToCart = async () => {
    const productDatabaseId = selectedVariation?.databaseId ?? product?.databaseId;
    if (!productDatabaseId) return;

    await addToCartMutation({
      variables: { productId: productDatabaseId, quantity }
    });

    addItem(cartItem, { count: quantity });
    setAddToCartBtn(true);
  };

  return (
    <div style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '3rem',
        }}
      >
        {/* Product Images */}
        <div>
          <Image
            src={
              selectedVariation?.featuredImage?.node?.link ||
              displayItem?.image?.sourceUrl ||
              '/placeholder.png'
            }
            alt={
              selectedVariation?.featuredImage?.node?.altText ||
              displayItem?.image?.altText ||
              displayItem?.name ||
              'Product image'
            }
            width={500}
            height={500}
            style={{
              width: '100%',
              height: '400px',
              objectFit: 'contain',
              border: '1px solid #ddd',
              borderRadius: '8px',
            }}
          />
        </div>

        {/* Product Info */}
        <div>
          <h1
            style={{
              marginBottom: '1rem',
              fontSize: '2rem',
              fontWeight: 'bold',
            }}
          >
            {displayItem?.name}
          </h1>

          {/* Price */}
          <div style={{ marginBottom: '1rem' }}>
            {displayItem?.salePrice ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <span
                  style={{
                    fontSize: '2rem',
                    fontWeight: 'bold',
                    color: '#e74c3c',
                  }}
                >
                  {displayItem.salePrice}
                </span>
                {displayItem.regularPrice && (
                  <span
                    style={{
                      fontSize: '1.5rem',
                      textDecoration: 'line-through',
                      color: '#666',
                    }}
                  >
                    {displayItem.regularPrice}
                  </span>
                )}
                <span
                  style={{
                    backgroundColor: '#e74c3c',
                    color: 'white',
                    padding: '0.25rem 0.75rem',
                    borderRadius: '20px',
                    fontSize: '0.875rem',
                    fontWeight: 'bold',
                  }}
                >
                  SALE
                </span>
              </div>
            ) : (
              <span style={{ fontSize: '2rem', fontWeight: 'bold' }}>
                {displayItem?.price}
              </span>
            )}
          </div>

          {/* Variations (only for variable products) */}
          {!isGrouped && product.variations && product.variations.nodes.length > 0 && (
            <div className="flex gap-2 mb-4">
              {product.variations.nodes.map(variation => (
                <button
                  key={variation.id}
                  onClick={() => handleVariationSelection(variation.id)}
                  className={`p-2 border rounded-lg ${
                    selectedVariation?.id === variation.id
                      ? 'bg-blue-100 border-blue-500'
                      : ''
                  }`}
                >
                  {variation.attributes.nodes.map((attr, idx) => (
                    <span key={idx}>{attr.value}</span>
                  ))}
                </button>
              ))}
            </div>
          )}

          {/* Grouped Products List */}
          {isGrouped && (
            <div style={{ marginBottom: '1.5rem' }}>
              <h3 style={{ fontWeight: 'bold', marginBottom: '0.5rem' }}>
                Included products
              </h3>
              <ul style={{ listStyle: 'disc', paddingLeft: '1.25rem' }}>
                {(product as any).products.nodes.map((child: any) => (
                  <li key={child.id} style={{ marginBottom: '0.25rem' }}>
                    <a
                      href={`/product/${child.slug}`}
                      style={{ color: '#0070f3', textDecoration: 'underline' }}
                    >
                      {child.name}
                    </a>
                  </li>
                ))}
              </ul>
              <p style={{ marginTop: '0.75rem', color: '#666' }}>
                Select a product from the group to view details and add to cart.
              </p>
            </div>
          )}

          {/* Add to Cart */}
          {!isGrouped && (
          <div
            style={{
              marginBottom: '2rem',
              padding: '1.5rem',
              backgroundColor: '#f8f9fa',
              borderRadius: '8px',
            }}
          >
            <div
              style={{
                display: 'flex',
                gap: '1rem',
                alignItems: 'center',
                marginBottom: '1rem',
              }}
            >
              <label style={{ fontWeight: 'bold', minWidth: '80px' }}>
                Quantity:
              </label>
              <input
                type="number"
                min="1"
                max={displayItem?.stockQuantity || 999}
                value={quantity}
                onChange={e =>
                  setQuantity(Math.max(1, parseInt(e.target.value) || 1))
                }
                style={{
                  width: '100px',
                  padding: '0.75rem',
                  border: '1px solid #ddd',
                  borderRadius: '4px',
                  fontSize: '1rem',
                }}
              />
            </div>

            <button
              disabled={displayItem?.stockStatus !== 'IN_STOCK' || addToCartBtn}
              style={{
                width: '100%',
                padding: '1rem 2rem',
                backgroundColor:
                  displayItem?.stockStatus === 'IN_STOCK' && !addToCartBtn
                    ? '#0070f3'
                    : '#ccc',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                cursor:
                  displayItem?.stockStatus === 'IN_STOCK' && !addToCartBtn
                    ? 'pointer'
                    : 'not-allowed',
                fontWeight: 'bold',
                fontSize: '1.1rem',
              }}
              onClick={handleAddToCart}
            >
              {displayItem?.stockStatus === 'IN_STOCK'
                ? addToCartBtn
                  ? 'Added'
                  : 'Add to Cart'
                : 'Out of Stock'}
            </button>
          </div>
          )}
        </div>
      </div>
    </div>
  );
}
