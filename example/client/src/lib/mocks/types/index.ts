import { OperationModelType, OperationState } from '@graphql-mock-operations/core';
import * as GQL from '../../../typings/generated';

// Operation types
type UsersOperationState = OperationState<GQL.UsersMockOperation, 'SUCCESS' | 'ERROR' | 'GQL_ERROR' | 'LOADING'>;
type UserOperationState = OperationState<GQL.UserMockOperation, 'SUCCESS' | 'EMPTY' | 'NETWORK_ERROR' | 'ERROR'>;
type CreateUserOperationState = OperationState<GQL.CreateUserMockOperation, 'SUCCESS'>;
type DeleteUserOperationState = OperationState<GQL.DeleteUserMockOperation, 'SUCCESS'>;
type BookOperationState = OperationState<GQL.BookMockOperation, 'SUCCESS' | 'EMPTY' | 'ERROR'>;

// Model types
type UserModel = OperationModelType<GQL.UserMockOperation>;
type BookModel = OperationModelType<GQL.BookMockOperation>;

export type State = UsersOperationState
  & UserOperationState
  & CreateUserOperationState
  & DeleteUserOperationState
  & BookOperationState;

export type Models = UserModel & BookModel;
