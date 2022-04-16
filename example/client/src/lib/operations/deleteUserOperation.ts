import { createOperation } from '@graphql-mock-operations/core';
import { OperationState } from '@graphql-mock-operations/core/dist/types';
import { DeleteUserMockOperation } from '../../typings/generated';
import { UserModels } from '../../models/user';

export type DeleteUserOperationState = OperationState<DeleteUserMockOperation>

export const deleteUserOperation = createOperation<
  DeleteUserMockOperation,
  DeleteUserOperationState
>('deleteUser', (_, { id }) => [
  { state: 'SUCCESS', value: UserModels.delete('id', id) }
])
