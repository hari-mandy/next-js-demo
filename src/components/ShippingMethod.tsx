// components/CheckoutShippingMethods.tsx
"use client"

import React, { useState, useContext } from "react"
import { useQuery } from "@apollo/client"
import { GET_SHIPPING_METHODS } from "@/queries/get-shipping-methods"
import { checkoutContext, type CheckoutFormData, checkoutSteps } from '@/context/checkoutContext';

type ShippingRate = {
  id: string
  label: string
  cost: string | null
  methodId: string
}

type ShippingPackage = {
  packageDetails: string
  supportsShippingCalculator: boolean
  rates: ShippingRate[]
}

const CheckoutShippingMethods = () => {
  const ctx = useContext(checkoutContext)
  const checkoutStep = useContext(checkoutSteps)
  const { data, loading, error } = useQuery(GET_SHIPPING_METHODS)
  const [selected, setSelected] = useState<string | null>( ctx.checkoutDetails?.shippingMethodId || null)
  const [errorMessage, setErrorMessage] = useState<string>('');

  if (loading) return <p className="p-5">Loading shipping methods...</p>
  if (error) return <p className="p-5 text-red-500">Error: {error.message}</p>

  const handleSelect = (method: ShippingRate) => {
    setSelected(method.methodId)
    ctx.setCheckoutDetails((prev) => ({
      ...(prev ?? ({} as CheckoutFormData)),
      shippingMethodId: method.methodId,
      shippingMethodTitle: method.label,
      shippingCost: method.cost ?? '0'
    }) as CheckoutFormData)
  }

  const shippingPackages: ShippingPackage[] =
    data?.cart?.availableShippingMethods || []

  // flatten all rates from all packages (optional – depends if you want per-package selection)
  const shippingMethods = shippingPackages.flatMap((pkg) => pkg.rates)

  const handleValidation = () => {

    if (!ctx.checkoutDetails?.shippingMethodId || !ctx.checkoutDetails?.shippingMethodTitle || !ctx.checkoutDetails?.shippingCost) {
      setErrorMessage('Please select the Shipping Methos.')
      return;
    }
    checkoutStep.setCheckoutStepsValue(2);
  }

  if (shippingMethods.length === 0) {
    return <p className="p-5">No shipping methods available.</p>
  }

  return (
    <div className="p-5 pt-0">
      {errorMessage && <p className='text-red-500 p-3 mb-3 bg-red-100 text-center rounded-md'>{errorMessage}</p>}
      <ul className="space-y-3">
        {shippingMethods.map((method) => (
          <li
            key={method.id}
            className={`p-3 rounded border transition-colors cursor-pointer ${
              selected === method.methodId
                ? "bg-blue-100 border-blue-500"
                : "bg-white border-gray-300 hover:bg-gray-50"
            }`}
          >
            <label className="flex items-start gap-3 cursor-pointer w-full">
              <input
                type="radio"
                name="shippingMethod"
                value={method.methodId}
                checked={selected === method.methodId}
                onChange={() => handleSelect(method)}
                className="mt-1"
              />
              <div className="flex-1">
                <div className="font-medium text-gray-900">
                  {method.label}
                </div>
              </div>
              <div className="text-sm text-gray-600 font-medium">
                {method.cost === null || method.cost === "0"
                  ? "FREE"
                  : `₹${method.cost}`}
              </div>
            </label>
          </li>
        ))}
      </ul>
      <button
            className={`w-full font-bold py-3 px-4 mt-5 rounded transition duration-500 ease-in-out bg-blue-500 hover:bg-blue-700 text-white`}
            onClick={handleValidation}
          >
            Continue with Payments
      </button>
    </div>
  )
}

export default CheckoutShippingMethods
