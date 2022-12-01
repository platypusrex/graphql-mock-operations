import { NextApolloClient } from 'nextjs-apollo-client';
import { hydrationMap } from './hydrationMap';

export const { getServerSideApolloProps, useApolloClient } =
  new NextApolloClient<typeof hydrationMap>({
    client: { uri: 'http://localhost:4001' },
    hydrationMap
  });
