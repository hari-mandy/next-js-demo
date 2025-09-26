// queries/get-shipping-methods.ts
import { gql } from "@apollo/client";

export const GET_SHIPPING_METHODS = gql`
  query GetShippingMethods {
    cart {
      availableShippingMethods {
        packageDetails
        supportsShippingCalculator
        rates {
          id
          label
          cost
          methodId
        }
      }
    }
  }
`;
