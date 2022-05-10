import { useQuery } from '@apollo/client';
import { loader } from 'graphql.macro';
import { BookQuery, BookQueryVariables } from '../typings/generated';

const Book = loader('../gql/bookQuery.graphql');

export const useBook = () => {
  const { data, ...rest } = useQuery<BookQuery, BookQueryVariables>(Book, {
    variables: { id: '1' },
  });
  return { book: data?.book, ...rest };
};
