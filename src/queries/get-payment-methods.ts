// src/queries/get-payment-methods.ts
import { gql } from '@apollo/client'

export const GET_PAYMENT_METHODS = gql`
  query GetPaymentMethods {
    paymentGateways {
      nodes {
        id
        title
        description
\        icon
      }
    }
  }
`