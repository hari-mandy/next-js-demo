'use client'

import { useShoppingCart } from 'use-shopping-cart'
import Image from 'next/image';
import Link from 'next/link';

export default function CartPage() {
  const {
    cartDetails,
    removeItem,
    incrementItem,
    decrementItem,
    totalPrice,
    cartCount,
    clearCart,
  } = useShoppingCart()

  const items = Object.values(cartDetails ?? {})

  return (
    <div style={{ padding: '2rem' }}>
      <h1>🛒 Your Cart</h1>

      {cartCount === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <>
          <ul style={{ listStyle: 'none', padding: 0 }}>
            {items.map((item) => (
              <li
                key={item.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '1rem',
                  marginBottom: '1rem',
                }}
              >
                <Image
                  src={item.image as string}
                  alt={item.name}
                  width={60}
                  height={60}
                  style={{ borderRadius: '6px' }}
                />
                <div style={{ flex: 1 }}>
                  <strong>{item.name}</strong>
                  <p>
                    ₹{item.price} × {item.quantity}
                  </p>
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button onClick={() => decrementItem(item.id)}>-</button>
                    <button onClick={() => incrementItem(item.id)}>+</button>
                    <button onClick={() => removeItem(item.id)}>Remove</button>
                  </div>
                </div>
              </li>
            ))}
          </ul>

          <h2>Total: ₹{totalPrice}</h2>
          <button onClick={() => clearCart()} className='bg-transparent hover:bg-red-500 text-red-700 font-semibold hover:text-white py-2 px-4 border border-red-500 hover:border-transparent rounded mr-4 transition duration-500 ease-in-out'>Clear Cart</button>
          <Link className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition duration-500 ease-in-out' href='/checkout'>Proceed to checkout</Link>
        </>
      )}
    </div>
  )
}
