import { gql } from "@apollo/client";

export const CREATE_ORDER = gql`
  mutation CreateOrder(
    $billing: CustomerAddressInput!
    $shipping: CustomerAddressInput!
    $paymentMethod: String!
    $lineItems: [LineItemInput!]!
    $shippingLines: [ShippingLineInput!]!
    $status: OrderStatusEnum
  ) {
    createOrder(
      input: {
        billing: $billing
        shipping: $shipping
        paymentMethod: $paymentMethod
        lineItems: $lineItems
        shippingLines: $shippingLines
        status: $status
      }
    ) {
      order {
        id
        databaseId
        status
        lineItems {
          nodes {
            product {
              node {
                id
                name
              }
            }
            quantity
            total
          }
        }
      }
    }
  }
`;
