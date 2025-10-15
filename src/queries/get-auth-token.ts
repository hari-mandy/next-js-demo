import { gql } from '@apollo/client';

export const GET_AUTH_TOKEN = gql`
  mutation LoginUser($username: String!, $password: String!) {
    login(input: {
      clientMutationId: "login"
      username: $username
      password: $password
    }) {
      authToken
      refreshToken
    }
  }
`;
