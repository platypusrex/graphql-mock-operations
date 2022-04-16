import { OperationModel } from '@graphql-mock-operations/core';
import { UserFragment } from '../typings/generated';

export const UserModels = new OperationModel<UserFragment>([
  { id: '1', name: 'Frank' },
  { id: '2', name: 'Jen' },
  { id: '3', name: 'Dylan' },
  { id: '4', name: 'Dublin' },
]);
