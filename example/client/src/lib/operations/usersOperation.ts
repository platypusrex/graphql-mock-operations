import { createOperation } from '@graphql-mock-operations/core';
import { OperationState } from '@graphql-mock-operations/core/dist/types';
import { UsersMockOperation } from '../../typings/generated';
import { UserModels } from '../../models/user';

export type UsersOperationState = OperationState<UsersMockOperation, 'ERROR'>;

export const usersOperation = createOperation<
  UsersMockOperation,
  UsersOperationState
>('users', [
  { state: 'SUCCESS', value: UserModels.models },
  { state: 'ERROR', value: new Error('Server responded with 500.') }
])
