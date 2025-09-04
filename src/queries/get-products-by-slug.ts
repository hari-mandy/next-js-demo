// src/lib/product-queries.ts
import { gql } from '@apollo/client';

// Get single product by slug
export const GET_PRODUCT_BY_SLUG = gql`
  query GetProductBySlug($slug: ID!) {
    product(id: $slug, idType: SLUG) {
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
        id
        name
        price
        stockStatus
      }
      ... on VariableProduct {
        variations {
          nodes {
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
          }
        }
      }
      reviews {
        averageRating
      }
      related {
        nodes {
          id
          name
          slug
          image {
            sourceUrl
            altText
          }
        }
      }
    }
  }
`;