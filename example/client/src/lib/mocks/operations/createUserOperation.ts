import { mockBuilder } from '../builder';
import { OperationState } from '@graphql-mock-operations/core';
import { CreateUserMockOperation } from '../../../typings/generated';

export type CreateUserOperationState = OperationState<CreateUserMockOperation, 'SUCCESS'>;

mockBuilder.mutationOperation<CreateUserMockOperation, CreateUserOperationState>(
  'createUser',
  (_, { input: { name } }) => [
    {
      state: 'SUCCESS',
      result: ({ user }) => user.create({ id: String(user.models.length + 1), name }),
    },
  ]
);
