import { OperationModel } from '@graphql-mock-operations/core';
import { BookFragment } from '../typings/generated';

export const BookModels = new OperationModel<BookFragment>([
  { id: '1', title: 'Baby Shark', authorId: '3', numPages: 200 },
  { id: '2', title: 'Mommy Shark', authorId: '2', numPages: 200 },
  { id: '3', title: 'Daddy Shark', authorId: '1', numPages: 200 },
  { id: '4', title: 'DeeDee Shark', authorId: '4', numPages: 200 },
]);
