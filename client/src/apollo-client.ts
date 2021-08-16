import { split, HttpLink, ApolloClient, InMemoryCache } from '@apollo/client';
import { WebSocketLink } from '@apollo/client/link/ws';
import { getMainDefinition } from '@apollo/client/utilities';

const wsLink = process.browser
  ? new WebSocketLink({
      uri: 'ws://localhost:5000/graphql',
      options: {
        reconnect: true,
      },
    })
  : null;

console.log(wsLink);

const httpLink = new HttpLink({
  uri: 'http://localhost:5000/graphql',
});

const splitLink = wsLink
  ? split(
      ({ query }) => {
        const definition = getMainDefinition(query);
        return definition.kind === 'OperationDefinition' && definition.operation === 'subscription';
      },
      wsLink,
      httpLink
    )
  : httpLink;

const client = new ApolloClient({
  link: splitLink,
  cache: new InMemoryCache(),
  // name: 'update-playlist',
});

export default client;
