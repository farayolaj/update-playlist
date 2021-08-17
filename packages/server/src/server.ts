import { ApolloServer, PubSub, gql } from 'apollo-server-express';
import { join } from 'path';
import { readFileSync } from 'fs';

import resolvers from './resolvers';

const typeDefs = gql(readFileSync(join(__dirname, 'schema.graphql')).toString());

const pubsub = new PubSub();
const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: { pubsub }
});

export default server;
