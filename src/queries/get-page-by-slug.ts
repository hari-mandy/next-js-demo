import { gql } from "@apollo/client";

const GET_PAGE_BY_SLUG = gql`
  query GetPageById($slug: ID!) {
    page(id: $slug, idType: URI) {
      id
      content
      slug
      title
    }
  }
`;

export default GET_PAGE_BY_SLUG;