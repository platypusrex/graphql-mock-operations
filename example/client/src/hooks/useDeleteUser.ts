import {
  BaseMutationOptions,
  FetchResult,
  MutationFunctionOptions,
  MutationResult,
  useMutation,
} from '@apollo/client';
import { DeleteUserMutation, DeleteUserMutationVariables } from '../typings/generated';
import { deleteUserMutation } from '../gql';

type UseDeleteUserOptions = BaseMutationOptions<
  DeleteUserMutation,
  DeleteUserMutationVariables
>;

type UseDeleteUser = MutationResult<DeleteUserMutation> & {
  deleteUser: (
    options: MutationFunctionOptions<DeleteUserMutation, DeleteUserMutationVariables>
  ) => Promise<FetchResult<DeleteUserMutation>>;
};

export const useDeleteUser = (options: UseDeleteUserOptions = {}): UseDeleteUser => {
  const [deleteUser, rest] = useMutation<
    DeleteUserMutation,
    DeleteUserMutationVariables
    >(deleteUserMutation, options);
  return { deleteUser, ...rest };
}
