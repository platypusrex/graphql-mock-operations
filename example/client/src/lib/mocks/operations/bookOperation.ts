import { OperationState } from '@graphql-mock-operations/core';
import { BookMockOperation } from '../../../typings/generated';
import { mockBuilder } from '../builder';

export type BookOperationState = OperationState<BookMockOperation, 'SUCCESS' | 'EMPTY' | 'ERROR'>;

mockBuilder.queryOperation<BookMockOperation, BookOperationState>('book', (_, { id }) => [
  { state: 'SUCCESS', result: ({ book }) => book.findOne('id', id) },
  { state: 'EMPTY', result: null },
  { state: 'ERROR', result: { networkError: new Error('failed with 404') } },
]);

