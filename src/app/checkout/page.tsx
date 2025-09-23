// src/app/checkout/page.tsx
'use client'
import { useShoppingCart } from 'use-shopping-cart'
import { useState, useRef } from 'react'
import CheckoutShippingMethods from '@/components/ShippingMethod'
import DeliveryInfo from '../../components/DeliveryInfo'
import PaymentMethods from '@/components/PaymentMethods'
import { useOrderService } from '@/hooks/useOrderService'
import { checkoutContext, type CheckoutFormData } from '@/context/checkoutContext'

type CartItem = {
  id: string
  name: string
  quantity: number
  value: number
  product_data?: {
    databaseId?: number
  }
}

// types imported from context

export default function CheckoutPage() {
  const { cartDetails, cartCount, totalPrice, clearCart } = useShoppingCart()
  const { createOrder, loading: orderLoading, error: orderError } = useOrderService()
  
  const [enable, setEnable] = useState<number>(0)
  const [isOrderPlaced, setIsOrderPlaced] = useState(false)
  const [orderNumber, setOrderNumber] = useState<string>('')
  const [checkoutDetails, setCheckoutDetails] = useState<CheckoutFormData | null>(null)
  
  // Refs to get data from child components
  const deliveryInfoRef = useRef<{
    getFormData: () => CheckoutFormData
    isValid: () => boolean
  }>(null)
  
  const shippingMethodRef = useRef<{
    getSelectedMethod: () => { id: string; title: string } | null
  }>(null)
  
  const paymentMethodRef = useRef<{
    getSelectedMethod: () => { id: string; title: string } | null
  }>(null)
  
  const handlePlaceOrder = async () => {
    try {
      // Validate delivery info
      if (!deliveryInfoRef.current?.isValid()) {
        alert('Please fill in all required delivery information')
        setEnable(0)
        return
      }

      // Get selected shipping method
      const selectedShipping = shippingMethodRef.current?.getSelectedMethod()
      if (!selectedShipping) {
        alert('Please select a shipping method')
        setEnable(1)
        return
      }

      // Get selected payment method
      const selectedPayment = paymentMethodRef.current?.getSelectedMethod()
      if (!selectedPayment) {
        alert('Please select a payment method')
        setEnable(2)
        return
      }

      // Get form data
      const formData = deliveryInfoRef.current!.getFormData()
      const cartItems = Object.values(cartDetails ?? {}) as CartItem[]

      // Create order
      const order = await createOrder(
        cartItems,
        formData,
        selectedPayment.id,
        selectedPayment.title,
        selectedShipping.id,
        selectedShipping.title,
        '0' // Shipping cost - you can calculate this
      )

      if (order) {
        setOrderNumber(order.orderNumber)
        setIsOrderPlaced(true)
        
        // Clear cart
        clearCart()
        
        // Show success message
        alert(`✅ Order placed successfully! Order Number: ${order.orderNumber}`)
        
        // Optionally redirect to order confirmation page
        // window.location.href = `/order-confirmation/${order.databaseId}`
      }
    } catch (error) {
      console.error('Order placement failed:', error)
      alert('❌ Failed to place order. Please try again.')
    }
  }

  // Show order success page
  if (isOrderPlaced) {
    return (
      <div className="max-w-4xl mx-auto p-6 text-center">
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
          <h1 className="text-2xl font-bold mb-2">✅ Order Placed Successfully!</h1>
        </div>
      </div>
    )
  }

  return (
    <checkoutContext.Provider value={{ checkoutDetails, setCheckoutDetails }}>
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

              {/* Order summary with selected methods */}
              <div className="mt-6 p-4 bg-gray-50 rounded">
                <h3 className="font-semibold mb-2">Order Summary</h3>
                <div className="text-sm space-y-1">
                  <p>Items: {cartCount}</p>
                  <p>Subtotal: ₹{((totalPrice ?? 0)).toFixed(2)}</p>
                  <p>Shipping: FREE</p>
                  <p className="font-bold border-t pt-2">Total: ₹{((totalPrice ?? 0)).toFixed(2)}</p>
                </div>
              </div>
            </div>

            {/* Checkout Form */}
            <div className='bg-gray-300 p-5 rounded-md'>
              <h4 className="text-xl font-semibold mb-4 text-center">Billing Information</h4>
              
              {/* Delivery Info */}
              <div className='bg-gray-100 mt-4 mb-4 rounded-lg'>
                <h5 
                  className="text-center rounded p-5 cursor-pointer"
                  onClick={() => setEnable(0)}
                >
                  📍 Delivery Information
                </h5>
                {enable === 0 ? <DeliveryInfo ref={deliveryInfoRef} /> : null}
              </div>

              {/* Shipping Methods */}
              <div className='bg-gray-100 mt-4 mb-4 rounded-lg'>
                <h5 
                  className="text-center rounded p-5 cursor-pointer" 
                  onClick={() => setEnable(1)}
                >
                  🚚 Choose Shipping Method
                </h5>
                {enable === 1 ? <CheckoutShippingMethods ref={shippingMethodRef} /> : null}
              </div>

              {/* Payment Methods */}
              <div className='bg-gray-100 mt-4 mb-4 rounded-lg'>
                <h5 
                  className="text-center rounded p-5 cursor-pointer"
                  onClick={() => setEnable(2)}
                >
                  💳 Choose Payment Method
                </h5>
                {enable === 2 ? <PaymentMethods ref={paymentMethodRef} /> : null}
              </div>

              {/* Place Order Button */}
              <button
                onClick={handlePlaceOrder}
                disabled={orderLoading}
                className={`w-full font-bold py-3 px-4 rounded transition duration-500 ease-in-out ${
                  orderLoading 
                    ? 'bg-gray-400 text-gray-600 cursor-not-allowed' 
                    : 'bg-blue-500 hover:bg-blue-700 text-white'
                }`}
              >
                {orderLoading ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Placing Order...
                  </span>
                ) : (
                  '🛒 Place Order'
                )}
              </button>

              {/* Error Display */}
              {orderError && (
                <div className="mt-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
                  <p className="font-bold">Order Failed:</p>
                  <p className="text-sm">{orderError.message}</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </checkoutContext.Provider>
    
  )
}