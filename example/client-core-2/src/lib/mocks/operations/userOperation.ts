import { mockBuilder } from '../builder';
import { OperationState } from '@graphql-mock-operations/core-temp/dist/types';
import { UserMockOperation } from '../../../typings/generated';
import { GraphQLError } from 'graphql';

export type UserOperationState = OperationState<
  UserMockOperation,
  'SUCCESS' | 'EMPTY' | 'NETWORK_ERROR' | 'ERROR'
>;

mockBuilder.queryOperation<
  UserMockOperation,
  UserOperationState
>('user', (_, { id }) => [
  { state: 'SUCCESS', result: ({ user }) => user.findOne('id', id) },
  { state: 'EMPTY', result: null },
  { state: 'NETWORK_ERROR', result: { networkError: new Error('network error') } },
  { state: 'ERROR', result: { graphQLErrors: [new GraphQLError('operation failed')] } }
])
