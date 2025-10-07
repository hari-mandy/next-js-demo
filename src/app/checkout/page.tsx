// src/app/checkout/page.tsx
'use client'
import { useMutation, useQuery } from '@apollo/client';
import { useShoppingCart } from 'use-shopping-cart'
import { useEffect, useState } from 'react'
import CheckoutShippingMethods from '@/components/ShippingMethod'
import DeliveryInfo from '../../components/DeliveryInfo'
import PaymentMethods from '@/components/PaymentMethods'
import { checkoutContext, type CheckoutFormData, checkoutSteps } from '@/context/checkoutContext'
import { ADD_TO_CART } from '@/queries/add-to-cart';

type CartItem = {
  id: string
  name: string
  quantity: number
  value: number
  databaseId?: number
  product_data?: {
    databaseId?: number
  }
}
// types imported from context

export default function CheckoutPage() {
  const { cartDetails, cartCount, totalPrice } = useShoppingCart();
  
  const [isOrderPlaced, setIsOrderPlaced] = useState(false)
  const [checkoutDetails, setCheckoutDetails] = useState<CheckoutFormData | null>(null)
  const [addToCartMutation] = useMutation(ADD_TO_CART);
  const [checkoutStepsValue, setCheckoutStepsValue] = useState<number>(0);

  useEffect(() => {
    handleAddToCart(Object.values(cartDetails ?? {}));
  }, [cartDetails]);

  const handleAddToCart = (items: any[]) => {
    items.forEach(async (item: any) => {
      const productId = item?.variationId || item?.productId;
      await addToCartMutation({ variables: { productId, quantity: item.quantity } });
    });
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
    <checkoutSteps.Provider value={{ checkoutStepsValue, setCheckoutStepsValue }}>
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
                    <p>Shipping: {checkoutDetails?.shippingCost ? `₹${checkoutDetails?.shippingCost}` : 'FREE'}</p>
                    <p className="font-bold border-t pt-2">Total: ₹{(((totalPrice ?? 0) + Number(checkoutDetails?.shippingCost ?? 0))).toFixed(2)}</p>
                  </div>
                </div>
              </div>

              {/* Checkout Form */}
              <div className='bg-gray-300 p-5 rounded-md'>
                <h4 className="text-xl font-semibold mb-4 text-center">Billing Information</h4>
                
                {/* Delivery Info */}
                <div className='bg-gray-100 mt-4 mb-4 rounded-lg'>
                  <h5 
                    className="text-center rounded p-5"
                    onClick={() =>setCheckoutStepsValue(0)}
                  >
                    📍 Delivery Information
                  </h5>
                  {checkoutStepsValue === 0 ? <DeliveryInfo /> : null}
                </div>

                {/* Shipping Methods */}
                <div className='bg-gray-100 mt-4 mb-4 rounded-lg'>
                  <h5 
                    className="text-center rounded p-5" 
                    onClick={() => {setCheckoutStepsValue(1); handleAddToCart(Object.values(cartDetails ?? {}))}}
                  >
                    🚚 Choose Shipping Method
                  </h5>
                  {checkoutStepsValue === 1 ? <CheckoutShippingMethods /> : null}
                </div>

                {/* Payment Methods */}
                <div className='bg-gray-100 mt-4 mb-4 rounded-lg'>
                  <h5 
                    className="text-center rounded p-5 "
                    onClick={() => setCheckoutStepsValue(2)}
                  >
                    💳 Choose Payment Method
                  </h5>
                  {checkoutStepsValue === 2 ? <PaymentMethods /> : null}
                </div>
              </div>
            </div>
          )}
        </div>
      </checkoutSteps.Provider>
    </checkoutContext.Provider>
    
  )
}