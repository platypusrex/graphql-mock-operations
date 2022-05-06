import { mockBuilder } from '../builder';
import { OperationState } from '@graphql-mock-operations/core-temp';
import { UsersMockOperation } from '../../../typings/generated';
import { GraphQLError } from 'graphql';

export type UsersOperationState = OperationState<
  UsersMockOperation,
  'SUCCESS' | 'ERROR' | 'GQL_ERROR' | 'LOADING'
>;

mockBuilder.queryOperation<UsersMockOperation, UsersOperationState>('users', [
  {
    state: 'SUCCESS',
    result: ({ user }) => user.models,
  },
  {
    state: 'GQL_ERROR',
    result: { graphQLErrors: [new GraphQLError('Server responded with 403')] },
  },
  { state: 'ERROR', result: { networkError: new Error('Server responded with 500') } },
  { state: 'LOADING', result: { loading: true } },
]);
