// src/lib/product-queries.ts
import { gql } from '@apollo/client';

// Get single product by slug
export const GET_PRODUCT_BY_SLUG = gql`
  query GetProductBySlug($slug: ID!) {
    product(id: $slug, idType: SLUG) {
      databaseId
      id
      name
      slug
      description
      shortDescription
      onSale
      sku
      image {
        sourceUrl
        altText
      }
      galleryImages {
        nodes {
          sourceUrl
          altText
        }
      }
      productCategories {
        nodes {
          id
          name
          slug
        }
      }
      productTags {
        nodes {
          id
          name
          slug
        }
      }
      attributes {
        nodes {
          name
          options
          variation
        }
      }
      ... on SimpleProduct {
        databaseId
        id
        name
        price
        stockStatus
      }
      ... on VariableProduct {
        variations {
          nodes {
            databaseId
            id
            name
            price
            stockStatus
            attributes {
              nodes {
                name
                value
              }
            }
            featuredImage {
              node {
                altText
                link
              }
            }
          }
        }
      }
      ... on GroupProduct {
          databaseId
          id
          name
          price
          featuredImage {
            node {
              altText
              link
            }
          }
          products {
            nodes {
              databaseId
              id
              name
              slug
            }
          }
      }
      reviews {
        averageRating
      }
    }
  }
`;