import { OperationModelType, OperationState } from '@graphql-mock-operations/core';
import {
  BookMockOperation,
  CreateUserMockOperation,
  DeleteUserMockOperation,
  UserMockOperation,
  UsersMockOperation
} from '../../../typings/generated';

// Operation types
type UsersOperationState = OperationState<UsersMockOperation, 'SUCCESS' | 'ERROR' | 'GQL_ERROR' | 'LOADING'>;
type UserOperationState = OperationState<UserMockOperation, 'SUCCESS' | 'EMPTY' | 'NETWORK_ERROR' | 'ERROR'>;
type CreateUserOperationState = OperationState<CreateUserMockOperation, 'SUCCESS'>;
type DeleteUserOperationState = OperationState<DeleteUserMockOperation, 'SUCCESS'>;
type BookOperationState = OperationState<BookMockOperation, 'SUCCESS' | 'EMPTY' | 'ERROR'>;

// Model types
type UserModel = OperationModelType<UserMockOperation>;
type BookModel = OperationModelType<BookMockOperation>;

export type State = UsersOperationState
  & UserOperationState
  & CreateUserOperationState
  & DeleteUserOperationState
  & BookOperationState;

export type Models = UserModel & BookModel;
