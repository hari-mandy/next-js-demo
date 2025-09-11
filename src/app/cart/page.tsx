'use client'

import { useShoppingCart } from 'use-shopping-cart'

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
                <img
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
          <button onClick={() => clearCart()}>Clear Cart</button>
        </>
      )}
    </div>
  )
}
