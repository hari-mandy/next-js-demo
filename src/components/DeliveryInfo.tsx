import React, { useState, useContext, type ChangeEvent } from 'react';
import { checkoutContext, type CheckoutFormData, checkoutSteps } from '@/context/checkoutContext';

const emptyForm: CheckoutFormData = {
  name: '',
  email: '',
  mobilenumber: '',
  address: '',
  city: '',
  zip: '',
}

const DeliveryInfo = () => {
  const ctx = useContext(checkoutContext)
  const checkoutStep = useContext(checkoutSteps)
  const [formData, setFormData] = useState<CheckoutFormData>(ctx?.checkoutDetails ?? emptyForm)
  const [shippingEnabled, setShippingEnabled] = useState<boolean>(Boolean(
    ctx?.checkoutDetails?.shippingAddress || ctx?.checkoutDetails?.shippingCity || ctx?.checkoutDetails?.shippingZip
  ))
  const [alertMessage, setAlertMessage] = useState<string>('')

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    const next: CheckoutFormData = { ...emptyForm, ...formData, [name]: value }
    setFormData(next)
    ctx?.setCheckoutDetails(next)
  }

  const handleValidation = () => {

    // fields Validation.
    if ( !formData.name || !formData.email || !formData.address || !formData.city || !formData.zip || !formData.mobilenumber) {
        setAlertMessage('Please Fill the billing Details !');
        return;
    }

    if(shippingEnabled && (!formData.shippingName || !formData.mobilenumber || !formData.address || !formData.shippingCity || !formData.shippingZip)) {
        setAlertMessage('Please Fill the shipping Details');
        return;
    }

    checkoutStep.setCheckoutStepsValue(1);
  }

  return (
      <div className='p-5 pt-0'>
        {alertMessage && <p className='text-red-500 p-3 mb-3 bg-red-100 text-center rounded-md'>{alertMessage}</p>}
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
          <button
            className={`w-full font-bold py-3 px-4 rounded transition duration-500 ease-in-out bg-blue-500 hover:bg-blue-700 text-white`}
            onClick={handleValidation}
          >
            Continue with Shipping Method
          </button>
        </div>
      </div>
  )
}

export default DeliveryInfo
