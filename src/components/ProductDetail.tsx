'use client';
import { useQuery } from '@apollo/client';
import { useState } from 'react';
import { GET_PRODUCT_BY_SLUG } from '../queries/get-products-by-slug';
import { ProductDetailData } from '../types/product';
import { useShoppingCart } from 'use-shopping-cart'
// import RelatedProducts from './RelatedProducts';

interface ProductDetailProps {
  slug: string;
}

export default function ProductDetail({ slug }: ProductDetailProps) {
  const [selectedImage, setSelectedImage] = useState(0);
  const { addItem } = useShoppingCart()
  const [quantity, setQuantity] = useState(1);


  const { data, loading, error } = useQuery<ProductDetailData>(GET_PRODUCT_BY_SLUG, {
    variables: { slug },
  });

  function handleAddToCart() {
    // Read existing cart from localStorage
    const existingCart = JSON.parse(localStorage.getItem("cartProducts") || "[]");

    // Find if product already exists
    const existingProductIndex = existingCart.findIndex(
      (item: { id: string }) => item.id === product.id
    );

    if (existingProductIndex > -1) {
      // Update quantity if product already exists
      existingCart[existingProductIndex].quantity += quantity;
    } else {
      // Add new product
      existingCart.push({
        id: product.id,
        quantity: quantity,
      });
    }

    // Save back to localStorage
    localStorage.setItem("cartProducts", JSON.stringify(existingCart));
  }


  if (loading) return <div style={{ padding: '2rem' }}>Loading product...</div>;
  if (error) return <div style={{ padding: '2rem' }}>Error: {error.message}</div>;
  if (!data?.product) return <div style={{ padding: '2rem' }}>Product not found</div>;

  const product = data.product;
  const images = product.galleryImages?.nodes || [];
  const mainImage = product.image;
  const allImages = mainImage ? [mainImage, ...images] : images;

  const cartItem = {
    id: product.id,
    name: product.name,
    price: product.price.replace(/,/g, "").replace(/[^\d.]/g, ""),
    currency: 'RUP', // or pull from settings
    image: product.image?.sourceUrl || '/placeholder-image.png',
  }

  console.log()

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
            </div>
            
            <button
              disabled={product.stockStatus !== 'IN_STOCK'}
              className='product-add-to-cart-button'
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
              // onClick={() => {
              //   // Add your cart logic here
              //   handleAddToCart();
              //   alert(`Added ${quantity} × ${product.name} to cart!`);
              // }}
              onClick={() => addItem(cartItem, { count: quantity})}
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
        </div>
      </div>
    </div>
  );
}