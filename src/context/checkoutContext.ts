'use client'

import { createContext, type Dispatch, type SetStateAction } from "react";

export interface CheckoutFormData {
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

export type CheckoutContextType = {
  checkoutDetails: CheckoutFormData | null
  setCheckoutDetails: Dispatch<SetStateAction<CheckoutFormData | null>>
}

export const checkoutContext = createContext<CheckoutContextType>({
  checkoutDetails: null,
  setCheckoutDetails: () => {}
});