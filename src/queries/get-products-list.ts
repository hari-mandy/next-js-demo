import { gql } from "@apollo/client";

const GET_PRODUCTS = gql`
  query GetProducts {
    products {
      nodes {
        name
        slug
        id
        onSale
        image {
          altText
          uri
        }
        ... on SimpleProduct {
          id
          price
          uri
        }
        ... on VariableProduct {
            id
            name
            uri
            price
        }
        ... on GroupProduct {
          id
          name
          uri
          price
        }
      }
    }
  }
`;

export default GET_PRODUCTS;