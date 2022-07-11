import { mockBuilder } from '../builder';
import { GraphQLError } from 'graphql';

mockBuilder.queryOperation('users', [
  {
    state: 'SUCCESS',
    result: ({ user }) => user.models,
  },
  {
    state: 'LOADING',
    result: { loading: true }
  },
  {
    state: 'ERROR',
    result: { networkError: new Error('Server responded with 500') }
  },
  {
    state: 'GQL_ERROR',
    result: { graphQLErrors: [new GraphQLError('Server responded with 403')] },
  },
]);
