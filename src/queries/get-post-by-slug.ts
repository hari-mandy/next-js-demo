// src/lib/product-queries.ts
import { gql } from '@apollo/client';

// Get single post by slug
export const GET_POST_BY_SLUG = gql`
  query GetPostBySlug($slug: ID!) {
    post(id: $slug, idType: SLUG) {
        id
        date
        content
    }
    }
`;