import { mockBuilder } from '../builder';
import { GraphQLError } from 'graphql';

mockBuilder.queryOperation('user', (_, { id }) => [
  {
    state: 'SUCCESS',
    result: ({ user }) => user.findOne('id', id)
  },
  {
    state: 'EMPTY',
    result: null
  },
  {
    state: 'NETWORK_ERROR',
    result: { networkError: new Error('network error') }
  },
  {
    state: 'ERROR',
    result: { graphQLErrors: [new GraphQLError('operation failed')] }
  },
]);
