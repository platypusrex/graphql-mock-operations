import { GraphQLError } from 'graphql';
import { createOperation } from '@graphql-mock-operations/core';
import { OperationState } from '@graphql-mock-operations/core/dist/types';
import { UserMockOperation } from '../../typings/generated';
import { UserModels } from '../../models/user';

export type UserOperationState = OperationState<
  UserMockOperation,
  'EMPTY' | 'NETWORK_ERROR' | 'ERROR'
>;

export const userOperation = createOperation<
  UserMockOperation,
  UserOperationState
>('user', (_, { id }) => [
  { state: 'SUCCESS', value: UserModels.getOne('id', id) },
  { state: 'EMPTY', value: null },
  { state: 'NETWORK_ERROR', value: new Error('network error') },
  { state: 'ERROR', value: new GraphQLError('operation failed') }
]);
