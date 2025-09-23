// src/queries/order-mutations.ts
import { gql } from '@apollo/client';

// Create order mutation
export const CREATE_ORDER_MUTATION = gql`
  mutation CreateOrder($input: CreateOrderInput!) {
    createOrder(input: $input) {
      clientMutationId
      order {
        id
        databaseId
        orderNumber
        status
        total
        date
        billing {
          firstName
          lastName
          email
          phone
          address1
          city
          postcode
          country
        }
        shipping {
          firstName
          lastName
          phone
          address1
          city
          postcode
          country
        }
        lineItems {
          nodes {
            productId
            quantity
            total
            product {
              node {
                id
                name
              }
            }
          }
        }
        shippingLines {
          nodes {
            methodTitle
            total
          }
        }
        paymentMethod
        paymentMethodTitle
      }
    }
  }
`;

// Add items to cart mutation (if needed)
export const ADD_TO_CART_MUTATION = gql`
  mutation AddToCart($input: AddToCartInput!) {
    addToCart(input: $input) {
      clientMutationId
      cartItem {
        key
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
`;

// Checkout mutation (alternative approach)
export const CHECKOUT_MUTATION = gql`
  mutation Checkout($input: CheckoutInput!) {
    checkout(input: $input) {
      clientMutationId
      order {
        id
        databaseId
        orderNumber
        status
        total
        paymentMethod
        paymentMethodTitle
      }
      result
      redirect
    }
  }
`;