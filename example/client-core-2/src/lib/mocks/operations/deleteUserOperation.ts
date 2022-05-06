import { mockBuilder } from '../builder';
import { DeleteUserMockOperation } from '../../../typings/generated';
import { OperationState } from '@graphql-mock-operations/core-temp';

export type DeleteUserOperationState = OperationState<DeleteUserMockOperation, 'SUCCESS'>

mockBuilder.mutationOperation<
  DeleteUserMockOperation,
  DeleteUserOperationState
>('deleteUser', (_, { id }) => [
  { state: 'SUCCESS', result: ({ user }) => user.delete('id', id) }
]);
