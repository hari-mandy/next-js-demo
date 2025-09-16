'use client'

import { useShoppingCart } from 'use-shopping-cart'
import { useState, ChangeEvent, FormEvent } from 'react'

interface CheckoutForm {
  name: string
  email: string
  address: string
  city: string
  zip: string
}

type CartItem = {
  id: string
  name: string
  quantity: number
  value: number
}

export default function CheckoutPage() {
  const { cartDetails, cartCount, totalPrice } = useShoppingCart()
  const [formData, setFormData] = useState<CheckoutForm>({
    name: '',
    email: '',
    address: '',
    city: '',
    zip: '',
  })

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()

    const items = Object.values(cartDetails ?? {}) as CartItem[]

    console.log('Order placed:', {
      items,
      customer: formData,
      total: totalPrice,
    })

    alert('✅ Order placed successfully!')
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Checkout</h1>

      {cartCount === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Cart Summary */}
          <div>
            <h2 className="text-xl font-semibold mb-4">Your Order</h2>
            <ul className="divide-y divide-gray-200 mb-6">
              {Object.values(cartDetails ?? {}).map((item) => {
                const entry = item as CartItem
                return (
                  <li key={entry.id} className="flex justify-between py-2">
                    <span>
                      {entry.name} × {entry.quantity}
                    </span>
                    <span>₹{(entry.value).toFixed(2)}</span>
                  </li>
                )
              })}
            </ul>
            <div className="flex justify-between font-semibold text-lg">
              <span>Total:</span>
              <span>₹{((totalPrice ?? 0)).toFixed(2)}</span>
            </div>
          </div>

          {/* Checkout Form */}
          <div>
            <h2 className="text-xl font-semibold mb-4">Shipping Info</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                type="text"
                name="name"
                placeholder="Full Name"
                value={formData.name}
                onChange={handleChange}
                className="w-full border p-2 rounded"
                required
              />
              <input
                type="email"
                name="email"
                placeholder="Email"
                value={formData.email}
                onChange={handleChange}
                className="w-full border p-2 rounded"
                required
              />
              <input
                type="text"
                name="address"
                placeholder="Street Address"
                value={formData.address}
                onChange={handleChange}
                className="w-full border p-2 rounded"
                required
              />
              <input
                type="text"
                name="city"
                placeholder="City"
                value={formData.city}
                onChange={handleChange}
                className="w-full border p-2 rounded"
                required
              />
              <input
                type="text"
                name="zip"
                placeholder="ZIP Code"
                value={formData.zip}
                onChange={handleChange}
                className="w-full border p-2 rounded"
                required
              />

              <button
                type="submit"
                className="w-full bg-green-600 text-white py-2 rounded"
              >
                Place Order
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
