import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';
import { resolvers, typeDefs } from './schema';

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
(async function () {
  const server = new ApolloServer({
    typeDefs,
    resolvers,
  });

  // @ts-ignore
  const { url } = await startStandaloneServer(server, {
    listen: { port: 4001 },
  });

  // eslint-disable-next-line no-console
  console.log(`🚀 Server ready at: ${url}`);
})();
