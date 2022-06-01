import { MockGQLOperations } from '@graphql-mock-operations/core-temp';
// operation state
import {
  UsersOperationState,
  UserOperationState,
  BookOperationState,
  DeleteUserOperationState,
  CreateUserOperationState,
} from './operations';
// models
import { BookModel, UserModel } from './models';
import introspectionResult from './introspection.json';

export interface MockGQLOperationsType {
  state: BookOperationState &
    UserOperationState &
    UsersOperationState &
    CreateUserOperationState &
    DeleteUserOperationState;
  models: BookModel & UserModel;
}

export const mockBuilder = new MockGQLOperations<MockGQLOperationsType>({
  introspectionResult,
});
