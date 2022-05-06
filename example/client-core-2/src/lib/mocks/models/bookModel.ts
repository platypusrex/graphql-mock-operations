import { mockBuilder } from '../builder';
import { BookMockOperation } from '../../../typings/generated';
import { OperationModelType } from '@graphql-mock-operations/core-temp';

export type BookModel = OperationModelType<BookMockOperation>;

mockBuilder.createModel<BookMockOperation>('book', [
  { id: '1', title: 'Baby Shark', authorId: '3', numPages: 200 },
  { id: '2', title: 'Mommy Shark', authorId: '2', numPages: 200 },
  { id: '3', title: 'Daddy Shark', authorId: '1', numPages: 200 },
  { id: '4', title: 'DeeDee Shark', authorId: '4', numPages: 200 },
]);
