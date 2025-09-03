'use client';
import { useQuery } from '@apollo/client';
import { useState } from 'react';
import { GET_PRODUCT_BY_SLUG } from '../queries/get-products-by-slug';
import { ProductDetailData } from '../types/product';
// import RelatedProducts from './RelatedProducts';

interface ProductDetailProps {
  slug: string;
}

export default function ProductDetail({ slug }: ProductDetailProps) {
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);

  const { data, loading, error } = useQuery<ProductDetailData>(GET_PRODUCT_BY_SLUG, {
    variables: { slug },
  });

  if (loading) return <div style={{ padding: '2rem' }}>Loading product...</div>;
  if (error) return <div style={{ padding: '2rem' }}>Error: {error.message}</div>;
  if (!data?.product) return <div style={{ padding: '2rem' }}>Product not found</div>;

  const product = data.product;
  const images = product.galleryImages?.nodes || [];
  const mainImage = product.image;
  const allImages = mainImage ? [mainImage, ...images] : images;

  return (
    <div style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '3rem' }}>
        
        {/* Product Images Section */}
        <div>
          {/* Main Image Display */}
          <div style={{ marginBottom: '1rem' }}>
            <img
              src={allImages[selectedImage]?.sourceUrl || '/placeholder-image.png'}
              alt={allImages[selectedImage]?.altText || product.name}
              style={{
                width: '100%',
                height: '400px',
                objectFit: 'contain',
                border: '1px solid #ddd',
                borderRadius: '8px'
              }}
            />
          </div>

          {/* Gallery Thumbnails */}
          {allImages.length > 1 && (
            <div style={{ display: 'flex', gap: '0.5rem', overflowX: 'auto' }}>
              {allImages.map((image, index) => (
                <img
                  key={index}
                  src={image.sourceUrl}
                  alt={image.altText}
                  onClick={() => setSelectedImage(index)}
                  style={{
                    width: '80px',
                    height: '80px',
                    objectFit: 'cover',
                    cursor: 'pointer',
                    border: selectedImage === index ? '3px solid #0070f3' : '1px solid #ddd',
                    borderRadius: '4px',
                    transition: 'border 0.2s'
                  }}
                />
              ))}
            </div>
          )}
        </div>

        {/* Product Information Section */}
        <div>
          {/* Product Title */}
          <h1 style={{ marginBottom: '1rem', fontSize: '2rem', fontWeight: 'bold' }}>
            {product.name}
          </h1>
          
          {/* Price Section */}
          <div style={{ marginBottom: '1rem' }}>
            {product.onSale && product.salePrice ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <span style={{ 
                  fontSize: '2rem', 
                  fontWeight: 'bold', 
                  color: '#e74c3c' 
                }}>
                  {product.salePrice}
                </span>
                <span style={{ 
                  fontSize: '1.5rem',
                  textDecoration: 'line-through', 
                  color: '#666' 
                }}>
                  {product.regularPrice}
                </span>
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
                {product.price}
              </span>
            )}
          </div>

          {/* Stock Status */}
          <div style={{ marginBottom: '1.5rem' }}>
            <span style={{
              padding: '0.5rem 1rem',
              borderRadius: '25px',
              fontSize: '0.875rem',
              fontWeight: 'bold',
              backgroundColor: product.stockStatus === 'IN_STOCK' ? '#d4edda' : '#f8d7da',
              color: product.stockStatus === 'IN_STOCK' ? '#155724' : '#721c24',
              border: `1px solid ${product.stockStatus === 'IN_STOCK' ? '#c3e6cb' : '#f5c6cb'}`
            }}>
              {product.stockStatus === 'IN_STOCK' ? '✓ In Stock' : '✗ Out of Stock'}
            </span>
            {product.stockQuantity && product.stockStatus === 'IN_STOCK' && (
              <span style={{ marginLeft: '1rem', color: '#666', fontSize: '0.9rem' }}>
                Only {product.stockQuantity} left in stock
              </span>
            )}
          </div>

          {/* Short Description */}
          {product.shortDescription && (
            <div 
              style={{ 
                marginBottom: '2rem', 
                lineHeight: '1.6',
                color: '#555',
                fontSize: '1.1rem'
              }}
              dangerouslySetInnerHTML={{ __html: product.shortDescription }}
            />
          )}

          {/* Product Details */}
          <div style={{ marginBottom: '2rem' }}>
            {product.sku && (
              <p style={{ marginBottom: '0.5rem', color: '#666' }}>
                <strong>SKU:</strong> {product.sku}
              </p>
            )}
            
            {product.weight && (
              <p style={{ marginBottom: '0.5rem', color: '#666' }}>
                <strong>Weight:</strong> {product.weight} kg
              </p>
            )}

            {product.dimensions && (product.dimensions.length || product.dimensions.width || product.dimensions.height) && (
              <p style={{ marginBottom: '0.5rem', color: '#666' }}>
                <strong>Dimensions:</strong> {product.dimensions.length} × {product.dimensions.width} × {product.dimensions.height} cm
              </p>
            )}
          </div>

          {/* Categories */}
          {product.productCategories?.nodes && product.productCategories.nodes.length > 0 && (
            <div style={{ marginBottom: '1.5rem' }}>
              <strong style={{ marginBottom: '0.5rem', display: 'block' }}>Categories:</strong>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                {product.productCategories.nodes.map((category, index) => (
                  <a 
                    key={category.id}
                    href={`/products/category/${category.slug}`} 
                    style={{ 
                      color: '#0070f3',
                      textDecoration: 'none',
                      padding: '0.25rem 0.75rem',
                      border: '1px solid #0070f3',
                      borderRadius: '20px',
                      fontSize: '0.875rem',
                      transition: 'all 0.2s'
                    }}
                    onMouseOver={(e) => {
                      e.currentTarget.style.backgroundColor = '#0070f3';
                      e.currentTarget.style.color = 'white';
                    }}
                    onMouseOut={(e) => {
                      e.currentTarget.style.backgroundColor = 'transparent';
                      e.currentTarget.style.color = '#0070f3';
                    }}
                  >
                    {category.name}
                  </a>
                ))}
              </div>
            </div>
          )}

          {/* Tags */}
          {product.productTags?.nodes && product.productTags.nodes.length > 0 && (
            <div style={{ marginBottom: '1.5rem' }}>
              <strong style={{ marginBottom: '0.5rem', display: 'block' }}>Tags:</strong>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                {product.productTags.nodes.map((tag) => (
                  <span 
                    key={tag.id}
                    style={{ 
                      color: '#666',
                      fontSize: '0.875rem',
                      padding: '0.25rem 0.5rem',
                      backgroundColor: '#f8f9fa',
                      borderRadius: '15px',
                      border: '1px solid #e9ecef'
                    }}
                  >
                    #{tag.name}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Add to Cart Section */}
          <div style={{ marginBottom: '2rem', padding: '1.5rem', backgroundColor: '#f8f9fa', borderRadius: '8px' }}>
            <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', marginBottom: '1rem' }}>
              <label style={{ fontWeight: 'bold', minWidth: '80px' }}>
                Quantity:
              </label>
              <input
                type="number"
                min="1"
                max={product.stockQuantity || 999}
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
              <span style={{ color: '#666', fontSize: '0.9rem' }}>
                {product.stockQuantity ? `Max: ${product.stockQuantity}` : 'No limit'}
              </span>
            </div>
            
            <button
              disabled={product.stockStatus !== 'IN_STOCK'}
              style={{
                width: '100%',
                padding: '1rem 2rem',
                backgroundColor: product.stockStatus === 'IN_STOCK' ? '#0070f3' : '#ccc',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                cursor: product.stockStatus === 'IN_STOCK' ? 'pointer' : 'not-allowed',
                fontWeight: 'bold',
                fontSize: '1.1rem',
                transition: 'background-color 0.2s'
              }}
              onClick={() => {
                // Add your cart logic here
                alert(`Added ${quantity} × ${product.name} to cart!`);
              }}
              onMouseOver={(e) => {
                if (product.stockStatus === 'IN_STOCK') {
                  e.currentTarget.style.backgroundColor = '#0056b3';
                }
              }}
              onMouseOut={(e) => {
                if (product.stockStatus === 'IN_STOCK') {
                  e.currentTarget.style.backgroundColor = '#0070f3';
                }
              }}
            >
              {product.stockStatus === 'IN_STOCK' ? 'Add to Cart' : 'Out of Stock'}
            </button>
          </div>

          {/* Product Attributes */}
          {product.attributes?.nodes && product.attributes.nodes.length > 0 && (
            <div style={{ marginBottom: '2rem' }}>
              <h3 style={{ marginBottom: '1rem' }}>Product Specifications</h3>
              <div style={{ backgroundColor: 'white', padding: '1rem', borderRadius: '8px', border: '1px solid #ddd' }}>
                {product.attributes.nodes.map((attribute, index) => (
                  <div 
                    key={index} 
                    style={{ 
                      display: 'flex',
                      justifyContent: 'space-between',
                      padding: '0.5rem 0',
                    }}
                  >
                    <strong>{attribute.name}:</strong>
                    <span>{attribute.options.join(', ')}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Full Description */}
      {product.description && (
        <div style={{ marginTop: '4rem' }}>
          <h2 style={{ marginBottom: '1.5rem', paddingBottom: '0.5rem', borderBottom: '2px solid #0070f3' }}>
            Product Description
          </h2>
          <div 
            style={{ 
              lineHeight: '1.8',
              fontSize: '1rem',
              color: '#555'
            }}
            dangerouslySetInnerHTML={{ __html: product.description }}
          />
        </div>
      )}

      {/* Reviews Section */}
      {product.reviews && (
        <div style={{ marginTop: '3rem' }}>
          <h3 style={{ marginBottom: '1rem' }}>Customer Reviews</h3>
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '1rem',
            padding: '1rem',
            backgroundColor: '#f8f9fa',
            borderRadius: '8px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>
                {product.reviews.averageRating.toFixed(1)}
              </span>
              <div style={{ display: 'flex' }}>
                {[1, 2, 3, 4, 5].map((star) => (
                  <span 
                    key={star}
                    style={{ 
                      fontSize: '1.2rem'
                    }}
                  >
                    ★
                  </span>
                ))}
              </div>
            </div>
            <span style={{ color: '#666' }}>
              ({product.reviews.reviewCount} review{product.reviews.reviewCount !== 1 ? 's' : ''})
            </span>
          </div>
        </div>
      )}
    </div>
  );
}