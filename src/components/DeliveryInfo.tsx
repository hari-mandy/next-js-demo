import React, { useState, useContext, type ChangeEvent } from 'react';
import { checkoutContext, type CheckoutFormData, checkoutSteps } from '@/context/checkoutContext';
import { ADD_TO_CART } from '@/queries/add-to-cart';
import { UPDATE_SHIPPING_ADDRESS } from '@/queries/add-to-cart';
import { useMutation, useQuery } from '@apollo/client';
import { useShoppingCart } from 'use-shopping-cart';

const emptyForm: CheckoutFormData = {
  name: '',
  email: '',
  mobilenumber: '',
  address: '',
  city: '',
  zip: '',
}

const DeliveryInfo = () => {
  const ctx = useContext(checkoutContext);
  const checkoutStep = useContext(checkoutSteps);
  const [buttonLock, setButtonLock] = useState<boolean>(false);
  const { cartDetails } = useShoppingCart();
  const [addToCartMutation] = useMutation(ADD_TO_CART);
  const [updateShippingAddress] = useMutation(UPDATE_SHIPPING_ADDRESS);
  const [formData, setFormData] = useState<CheckoutFormData>(ctx?.checkoutDetails ?? emptyForm);
  const [shippingEnabled, setShippingEnabled] = useState<boolean>(Boolean(
    ctx?.checkoutDetails?.shippingAddress || ctx?.checkoutDetails?.shippingCity || ctx?.checkoutDetails?.shippingZip
  ));
  const [alertMessage, setAlertMessage] = useState<string>('');

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    const next: CheckoutFormData = { ...emptyForm, ...formData, [name]: value }
    setFormData(next)
    ctx?.setCheckoutDetails(next)
  }

  const handleValidation = async () => {
    setButtonLock(true);
    // 1. Validate fields
    if (!formData.name || !formData.email || !formData.address || !formData.city || !formData.zip || !formData.mobilenumber) {
      setAlertMessage("Please Fill the billing Details !");
      return;
    }

    if (
      shippingEnabled &&
      (!formData.shippingName ||
        !formData.mobilenumber ||
        !formData.address ||
        !formData.shippingCity ||
        !formData.shippingZip)
    ) {
      setAlertMessage("Please Fill the shipping Details");
      return;
    }

    try {
      // 2. Sync cart first
      if (cartDetails && Object.keys(cartDetails).length > 0) {
        for (const item of Object.values(cartDetails)) {
          const productId = item?.variationId || item?.productId;
          if (!productId) continue;

          await addToCartMutation({
            variables: { productId, quantity: item.quantity },
          });
        }
      }

      // 3. Then update shipping address
      await updateShippingAddress({
        variables: {
          input: {
            shipping: {
              firstName: formData.shippingName || formData.name,
              lastName: "",
              address1: formData.shippingAddress || formData.address,
              city: formData.shippingCity || formData.city,
              postcode: formData.shippingZip || formData.zip,
              country: "IN",
              phone: formData.shippingMobile || formData.mobilenumber,
              email: formData.email,
            },
          },
        },
      });

      // 4. Finally, move to next checkout step
      checkoutStep.setCheckoutStepsValue(1);
    } catch (err: any) {
      setAlertMessage(err.message || "Something went wrong while updating cart.");
    }
  };


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
            className={`w-full font-bold py-3 px-4 rounded transition duration-500 ease-in-out bg-blue-500 hover:bg-blue-700 text-white ${buttonLock ? 'cursor-not-allowed opacity-50 bg-blue-00' : ''}`}
            onClick={handleValidation}
          >
            {
              buttonLock ? 'Loading...' : 'Continue with Shipping Methods'
            }
          </button>
        </div>
      </div>
  )
}

export default DeliveryInfo
