import { ApolloClient, InMemoryCache } from '@apollo/client';

const client = new ApolloClient({
  uri: 'https://www.nbaapi.com/graphql/', // Replace with your endpoint
  cache: new InMemoryCache(),
});

export default client;