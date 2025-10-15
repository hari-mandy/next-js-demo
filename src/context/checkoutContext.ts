'use client'

import { createContext, type Dispatch, type SetStateAction } from "react";

export interface CheckoutFormData {
  name: string
  email: string
  mobilenumber: string
  address: string
  city: string
  country: string
  zip: string
  shippingName?: string
  shippingMobile?: string
  shippingAddress?: string
  shippingCity?: string
  shippingCountry?: string
  shippingZip?: string
  shippingMethodId?: string
  shippingMethodTitle?: string
  shippingCost?: string
  paymentMethodId?: string
  paymentMethodTitle?: string
}

export type CheckoutContextType = {
  checkoutDetails: CheckoutFormData | null
  setCheckoutDetails: Dispatch<SetStateAction<CheckoutFormData | null>>
}

export const checkoutContext = createContext<CheckoutContextType>({
  checkoutDetails: null,
  setCheckoutDetails: () => {}
});

export type CheckoutStepsContextType = {
  checkoutStepsValue: number;
  setCheckoutStepsValue: React.Dispatch<React.SetStateAction<number>>;
};

// 👇 Give it a proper default value
export const checkoutSteps = createContext<CheckoutStepsContextType>({
  checkoutStepsValue: 0,
  setCheckoutStepsValue: () => {}, // dummy default
});