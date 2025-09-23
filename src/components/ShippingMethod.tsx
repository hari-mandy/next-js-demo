// components/ShippingMethod.tsx
import React, { useState, forwardRef, useImperativeHandle } from 'react'
import { useQuery } from '@apollo/client'
import { GET_SHIPPING_METHODS } from '@/queries/get-shipping-methods' // You'll need to create this

type ShippingMethod = {
  id: string
  databaseId: number
  title: string
  description: string
}

export interface ShippingMethodRef {
  getSelectedMethod: () => { id: string; title: string } | null
}

const CheckoutShippingMethods = forwardRef<ShippingMethodRef>((props, ref) => {
  const { data, loading, error } = useQuery(GET_SHIPPING_METHODS)
  const [selected, setSelected] = useState<string | null>(null)

  // Expose methods to parent component
  useImperativeHandle(ref, () => ({
    getSelectedMethod: () => {
      if (!selected) return null
      const method = shippingMethods.find(m => m.id === selected)
      return method ? { id: method.id, title: method.title } : null
    }
  }))

  if (loading) return <p className="p-5">Loading shipping methods...</p>
  if (error) return <p className="p-5 text-red-500">Error loading shipping methods: {error.message}</p>

  const shippingMethods: ShippingMethod[] = data?.shippingMethods?.nodes || []

  if (shippingMethods.length === 0) {
    return <p className="p-5">No shipping methods available.</p>
  }

  return (
    <div className='p-5 pt-0'>
      <ul className="space-y-3">
        {shippingMethods.map((method) => (
          <li 
            key={method.id} 
            className={`p-3 rounded border transition-colors cursor-pointer ${
              selected === method.id ? 'bg-blue-100 border-blue-500' : 'bg-white border-gray-300 hover:bg-gray-50'
            }`}
          >
            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="radio"
                name="shippingMethod"
                value={method.id}
                checked={selected === method.id}
                onChange={() => setSelected(method.id)}
                className="mt-1"
              />
              <div className="flex-1">
                <div className="font-medium text-gray-900">{method.title}</div>
              </div>
              <div className="text-sm text-gray-600 font-medium">
                FREE
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
              Selected: {shippingMethods.find(m => m.id === selected)?.title}
            </span>
          </div>
        </div>
      )}
    </div>
  )
})

CheckoutShippingMethods.displayName = 'CheckoutShippingMethods'

export default CheckoutShippingMethods