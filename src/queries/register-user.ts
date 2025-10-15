import { gql } from "@apollo/client";

export const REGISTER_USER = gql`
    mutation RegisterWooCustomer($username: String!, $email: String!, $password: String!) {
    registerUser(
      input: {
        username: $username
        email: $email
        password: $password
      }
    ) {
      user {
        databaseId
        email
        username
        roles {
          nodes {
            name
          }
        }
      }
    }
  }
`;
