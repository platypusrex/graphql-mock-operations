import { useQuery } from '@apollo/client';
import { loader } from 'graphql.macro';

const UsersQuery = loader('../gql/usersQuery.graphql');

export const useUsers = () => {
  const { data, ...rest } = useQuery(UsersQuery);
  return { users: data?.users || [], ...rest };
};
