import { createOperation } from '@graphql-mock-operations/core';
import { OperationState } from '@graphql-mock-operations/core/dist/types';
import { CreateUserMockOperation } from '../../typings/generated';
import { UserModels } from '../../models/user';

export type CreateUserOperationState = OperationState<CreateUserMockOperation>;

export const createUserOperation = createOperation<
  CreateUserMockOperation,
  CreateUserOperationState
>('createUser', (_, { input: { name } }) => [
  {
    state: 'SUCCESS',
    value: UserModels.create({ id: String(UserModels.models.length + 1), name }),
  }
])
