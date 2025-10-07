import { ApolloClient, InMemoryCache } from "@apollo/client";

const client = new ApolloClient({
  uri: "/api/graphql", // This hits your Next.js route handler
  cache: new InMemoryCache(),
});

export default client;