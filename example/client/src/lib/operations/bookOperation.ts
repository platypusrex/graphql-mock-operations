import { createOperation } from '@graphql-mock-operations/core';
import { OperationState } from '@graphql-mock-operations/core/dist/types';
import { BookMockOperation } from '../../typings/generated';
import { BookModels } from '../../models/book';

export type BookOperationState = OperationState<BookMockOperation, | 'EMPTY' | 'ERROR'>;

export const bookOperation = createOperation<
  BookMockOperation,
  BookOperationState
>('book', (_, { id }) => [
  { state: 'SUCCESS', value: BookModels.getOne('id', id) },
  { state: 'EMPTY', value: null },
  { state: 'ERROR', value: new Error('failed with 404') }
]);
