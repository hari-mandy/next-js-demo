// components/DeliveryInfo.tsx
import React, { useState, ChangeEvent, forwardRef, useImperativeHandle } from 'react'

interface CheckoutForm {
  name: string
  email: string
  mobilenumber: string
  address: string
  city: string
  zip: string
  shippingName?: string
  shippingMobile?: string
  shippingAddress?: string
  shippingCity?: string
  shippingZip?: string
}

export interface DeliveryInfoRef {
  getFormData: () => CheckoutForm
  isValid: () => boolean
}

const DeliveryInfo = forwardRef<DeliveryInfoRef>((props, ref) => {
  const [shippingEnabled, setShippingEnabled] = useState(false)
  const [formData, setFormData] = useState<CheckoutForm>({
    name: '',
    email: '',
    mobilenumber: '',
    address: '',
    city: '',
    zip: '',
  })

  // Expose methods to parent component
  useImperativeHandle(ref, () => ({
    getFormData: () => formData,
    isValid: () => {
      const required = ['name', 'email', 'mobilenumber', 'address', 'city', 'zip']
      const hasAllRequired = required.every(field => formData[field as keyof CheckoutForm]?.toString().trim())
      
      if (shippingEnabled) {
        const shippingRequired = ['shippingName', 'shippingMobile', 'shippingAddress', 'shippingCity', 'shippingZip']
        const hasAllShippingRequired = shippingRequired.every(field => formData[field as keyof CheckoutForm]?.toString().trim())
        return hasAllRequired && hasAllShippingRequired
      }
      
      return hasAllRequired
    }
  }))

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  return (
    <div className='p-5 pt-0'>
      <div className="space-y-4">
        <input
          type="text"
          name="name"
          placeholder="Full Name *"
          value={formData.name}
          onChange={handleChange}
          className="w-full border p-2 rounded focus:border-blue-500 focus:outline-none"
          required
        />
        <input
          type="email"
          name="email"
          placeholder="Email *"
          value={formData.email}
          onChange={handleChange}
          className="w-full border p-2 rounded focus:border-blue-500 focus:outline-none"
          required
        />
        <input
          type="text"
          name="mobilenumber"
          placeholder="Mobile Number *"
          value={formData.mobilenumber}
          onChange={handleChange}
          className="w-full border p-2 rounded focus:border-blue-500 focus:outline-none"
          required
        />
        <input
          type="text"
          name="address"
          placeholder="Street Address *"
          value={formData.address}
          onChange={handleChange}
          className="w-full border p-2 rounded focus:border-blue-500 focus:outline-none"
          required
        />
        <div className="grid grid-cols-2 gap-4">
          <input
            type="text"
            name="city"
            placeholder="City *"
            value={formData.city}
            onChange={handleChange}
            className="w-full border p-2 rounded focus:border-blue-500 focus:outline-none"
            required
          />
          <input
            type="text"
            name="zip"
            placeholder="ZIP Code *"
            value={formData.zip}
            onChange={handleChange}
            className="w-full border p-2 rounded focus:border-blue-500 focus:outline-none"
            required
          />
        </div>
        
        <div className="flex items-center mt-4">
          <input
            id="shipping-enabled"
            type="checkbox"
            className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
            checked={shippingEnabled}
            onChange={(e) => setShippingEnabled(e.target.checked)}
            name='shipping-enabled'
          />
          <label htmlFor="shipping-enabled" className="ml-2 font-medium text-gray-900">
            Ship to a different address?
          </label>
        </div>

        {shippingEnabled && (
          <div className="space-y-4 mt-4 p-4 rounded-lg border">
            <h3 className="text-lg font-semibold text-blue-800">Shipping Address</h3>
            <input
              type="text"
              name="shippingName"
              placeholder="Recipient Name *"
              value={formData.shippingName || ''}
              onChange={handleChange}
              className="w-full border p-2 rounded focus:border-blue-500 focus:outline-none"
              required={shippingEnabled}
            />
            <input
              type="text"
              name="shippingMobile"
              placeholder="Mobile Number *"
              value={formData.shippingMobile || ''}
              onChange={handleChange}
              className="w-full border p-2 rounded focus:border-blue-500 focus:outline-none"
              required={shippingEnabled}
            />
            <input
              type="text"
              name="shippingAddress"
              placeholder="Street Address *"
              value={formData.shippingAddress || ''}
              onChange={handleChange}
              className="w-full border p-2 rounded focus:border-blue-500 focus:outline-none"
              required={shippingEnabled}
            />
            <div className="grid grid-cols-2 gap-4">
              <input
                type="text"
                name="shippingCity"
                placeholder="City *"
                value={formData.shippingCity || ''}
                onChange={handleChange}
                className="w-full border p-2 rounded focus:border-blue-500 focus:outline-none"
                required={shippingEnabled}
              />
              <input
                type="text"
                name="shippingZip"
                placeholder="ZIP Code *"
                value={formData.shippingZip || ''}
                onChange={handleChange}
                className="w-full border p-2 rounded focus:border-blue-500 focus:outline-none"
                required={shippingEnabled}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  )
})

DeliveryInfo.displayName = 'DeliveryInfo'

export default DeliveryInfo