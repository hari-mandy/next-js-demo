import { gql } from "@apollo/client";

export const EMPTY_CART = gql`
mutation {
  emptyCart(input: {}) {
    cart {
      contents {
        itemCount
      }
    }
  }
}
`;