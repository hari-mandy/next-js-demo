import { gql } from "@apollo/client"

export const ADD_TO_CART = gql`
  mutation AddToCart($productId: Int!, $quantity: Int!) {
    addToCart(input: { productId: $productId, quantity: $quantity }) {
      cart {
        contents {
          nodes {
            key
            quantity
            product {
              node {
                id
                name
              }
            }
          }
        }
      }
    }
  }
`