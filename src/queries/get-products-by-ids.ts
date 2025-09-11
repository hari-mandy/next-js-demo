import { gql } from "@apollo/client";

// Method 1: Using individual product queries (most compatible)
export const GET_PRODUCT_BY_ID = gql`
  query GetProductById($id: ID!) {
    product(id: $id, idType: DATABASE_ID) {
      id
      databaseId
      name
      slug
      image {
        sourceUrl
        altText
      }
      featuredImage {
        node {
          sourceUrl
          altText
        }
      }
      ... on SimpleProduct {
        id
        name
        price
        regularPrice
        salePrice
        stockStatus
        stockQuantity
      }
      ... on VariableProduct {
        id
        name
        price
        regularPrice
        salePrice
        stockStatus
        variations {
          nodes {
            id
            databaseId
            name
            price
            regularPrice
            salePrice
            stockStatus
            stockQuantity
            attributes {
              nodes {
                name
                value
              }
            }
          }
        }
      }
    }
  }
`;

// Method 2: Try with include field (WooGraphQL specific)
export const GET_PRODUCTS_BY_IDS_INCLUDE = gql`
  query GetProductsByIds($include: [Int]) {
    products(where: { include: $include }, first: 100) {
      nodes {
        id
        databaseId
        name
        slug
        image {
          sourceUrl
          altText
        }
        featuredImage {
          node {
            sourceUrl
            altText
          }
        }
        ... on SimpleProduct {
          price
          regularPrice
          salePrice
          stockStatus
          stockQuantity
        }
        ... on VariableProduct {
          price
          regularPrice
          salePrice
          stockStatus
          variations {
            nodes {
              id
              databaseId
              name
              price
              regularPrice
              salePrice
              stockStatus
              stockQuantity
              attributes {
                nodes {
                  name
                  value
                }
              }
            }
          }
        }
      }
    }
  }
`;

// Method 3: Fallback - get all products and filter client-side (not recommended for large catalogs)
export const GET_ALL_PRODUCTS = gql`
  query GetAllProducts($first: Int = 100) {
    products(first: $first) {
      nodes {
        id
        databaseId
        name
        slug
        image {
          sourceUrl
          altText
        }
        featuredImage {
          node {
            sourceUrl
            altText
          }
        }
        ... on SimpleProduct {
          price
          regularPrice
          salePrice
          stockStatus
          stockQuantity
        }
        ... on VariableProduct {
          price
          regularPrice
          salePrice
          stockStatus
          variations {
            nodes {
              id
              databaseId
              name
              price
              regularPrice
              salePrice
              stockStatus
              stockQuantity
              attributes {
                nodes {
                  name
                  value
                }
              }
            }
          }
        }
      }
    }
  }
`;