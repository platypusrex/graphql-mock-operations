import { QueryOptions } from '@apollo/client';
import { generateHydrationMap } from 'nextjs-apollo-client';
import { bookQuery, usersQuery } from '../../gql';

export const hydrationMap = generateHydrationMap({
  users: (): QueryOptions<UsersQueryVariables, UsersQuery> => ({ query: usersQuery }),
  book: (): QueryOptions<BookQueryVariables, BookQuery> => ({
    query: bookQuery,
    variables: { id: '1' }
  })
});
