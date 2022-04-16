import { useQuery } from '@apollo/client';
import { loader } from 'graphql.macro';
import { BooksQuery, BooksQueryVariables } from '../typings/generated';

const Books = loader('../gql/booksQuery.graphql');

export const useBook = () => {
  const { data, ...rest } = useQuery<BooksQuery, BooksQueryVariables>(Books);
  return { book: data?.books, ...rest };
}
