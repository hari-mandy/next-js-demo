// components/PaymentMethods.tsx
import React, { useState, forwardRef, useImperativeHandle } from 'react'
import { useQuery } from '@apollo/client'
import { GET_PAYMENT_METHODS } from '@/queries/get-payment-methods'

type PaymentGateway = {
  title: string
  id: string
  description?: string
}

export interface PaymentMethodRef {
  getSelectedMethod: () => { id: string; title: string } | null
}

const PaymentMethods = forwardRef<PaymentMethodRef>((props, ref) => {
  const { data, loading, error } = useQuery(GET_PAYMENT_METHODS)
  const [selected, setSelected] = useState<string | null>(null)

  // Expose methods to parent component
  useImperativeHandle(ref, () => ({
    getSelectedMethod: () => {
      if (!selected) return null
      const method = gateways.find(gw => gw.id === selected)
      return method ? { id: method.id, title: method.title } : null
    }
  }))

  if (loading) return <p className="p-5">Loading payment methods...</p>
  if (error) return <p className="p-5 text-red-500">Error loading payment methods: {error.message}</p>

  const gateways: PaymentGateway[] = data?.paymentGateways?.nodes || []

  if (gateways.length === 0) {
    return <p className="p-5">No payment methods available.</p>
  }

  return (
    <div className='p-5 pt-0'>
      <ul className="space-y-3">
        {gateways.map((gw) => (
          <li 
            key={gw.id} 
            className={`p-3 rounded border transition-colors cursor-pointer ${
              selected === gw.id ? 'bg-blue-100 border-blue-500' : 'bg-white border-gray-300 hover:bg-gray-50'
            }`}
          >
            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="radio"
                name="paymentMethod"
                value={gw.id}
                checked={selected === gw.id}
                onChange={() => setSelected(gw.id)}
                className="mt-1"
              />
              <div className="flex-1">
                <div className="font-medium text-gray-900">{gw.title}</div>
                {gw.description && (
                  <div 
                    className="text-sm text-gray-600 mt-1"
                    dangerouslySetInnerHTML={{ __html: gw.description }}
                  />
                )}
                
                {/* Special icons/info for different payment methods */}
                {gw.id === 'cod' && (
                  <div className="flex items-center mt-2 text-green-600 text-sm">
                    <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4zm6 4a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                    </svg>
                    Pay when you receive your order
                  </div>
                )}
                
                {gw.id === 'razorpay' && (
                  <div className="flex items-center mt-2 text-blue-600 text-sm">
                    <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M4 4a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2H4zm0 2h12v8H4V6z" />
                    </svg>
                    Secure online payment
                  </div>
                )}
                
                {gw.id === 'paypal' && (
                  <div className="flex items-center mt-2 text-blue-500 text-sm">
                    <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M4 4a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2H4zm0 2h12v8H4V6z" />
                    </svg>
                    Pay with PayPal
                  </div>
                )}
              </div>
            </label>
          </li>
        ))}
      </ul>
      
      {selected && (
        <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
          <div className="flex items-center text-green-800">
            <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <span className="font-medium">
              Selected: {gateways.find(gw => gw.id === selected)?.title}
            </span>
          </div>
        </div>
      )}

      {/* Security note */}
      <div className="mt-4 p-3 bg-gray-50 border border-gray-200 rounded-lg">
        <div className="flex items-center text-gray-600 text-sm">
          <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
          </svg>
          <span>Your payment information is secure and encrypted</span>
        </div>
      </div>
    </div>
  )
})

PaymentMethods.displayName = 'PaymentMethods'

export default PaymentMethods