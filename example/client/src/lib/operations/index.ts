import { MockGQLOperations } from '@graphql-mock-operations/core';
import { MockOperations } from '../../typings/generated';
import { usersOperation, UsersOperationState } from './usersOperation';
import { userOperation, UserOperationState } from './userOperation';
import { bookOperation, BookOperationState } from './bookOperation';
import { createUserOperation, CreateUserOperationState } from './createUserOperation';
import { deleteUserOperation, DeleteUserOperationState } from './deleteUserOperation';
import introspectionResult from '../../../introspection.json';

export interface MockGQLOperationsType {
  operations: MockOperations;
  state:
    BookOperationState &
    UserOperationState &
    UsersOperationState &
    CreateUserOperationState &
    DeleteUserOperationState;
}

export const { MockApolloProvider, current } = new MockGQLOperations<MockGQLOperationsType>({
  introspectionResult,
  operations: {
    query: [
      userOperation,
      usersOperation,
      bookOperation
    ],
    mutation: [
      createUserOperation,
      deleteUserOperation
    ]
  },
});
