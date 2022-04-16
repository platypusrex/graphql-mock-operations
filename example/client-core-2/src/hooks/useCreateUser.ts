import {
  BaseMutationOptions,
  FetchResult,
  MutationFunctionOptions,
  MutationResult,
  useMutation,
} from '@apollo/client';
import { loader } from 'graphql.macro';
import { CreateUserMutation, CreateUserMutationVariables } from '../typings/generated';

const CreateUser = loader('../gql/createUserMutation.graphql');

type UseCreateUserOptions = BaseMutationOptions<
  CreateUserMutation,
  CreateUserMutationVariables
>;

type UseCreateUser = MutationResult<CreateUserMutation> & {
  createUser: (
    options: MutationFunctionOptions<CreateUserMutation, CreateUserMutationVariables>
  ) => Promise<FetchResult<CreateUserMutation>>;
};

export const useCreateUser = (options: UseCreateUserOptions = {}): UseCreateUser => {
  const [createUser, rest] = useMutation<
    CreateUserMutation,
    CreateUserMutationVariables
  >(CreateUser, options);
  return { createUser, ...rest };
}
