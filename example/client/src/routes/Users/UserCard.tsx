import React from 'react';
import { UserFragment, UsersQuery } from '../../typings/generated';
import { useDeleteUser } from '../../hooks/useDeleteUser';
import { usersQuery } from '../../gql';

interface UserCardProps {
  user: UserFragment;
}

export const UserCard: React.FC<UserCardProps> = ({ user }) => {
  const { deleteUser, loading } = useDeleteUser({
    update: (cache, { data }) => {
      const result = data?.deleteUser;
      if (!result) return;
      const currentUsers = cache.readQuery<UsersQuery>({
        query: usersQuery,
      });

      const users = currentUsers?.users;
      if (!users) return;

      console.log({ result, users, newUsers: users.filter((user) => user.id !== result.id) });

      cache.writeQuery<UsersQuery>({
        query: usersQuery,
        data: {
          users: users.filter((user) => user.id !== result.id),
        },
      });
    },
  });

  const handleDeleteUser = async () => {
    await deleteUser({
      variables: { id: user.id },
    });
  };

  return (
    <div key={user.id} className="user-card">
      <pre className="Users-code-block">
        <code>{JSON.stringify(user, null, 2)}</code>
      </pre>
      <button onClick={handleDeleteUser}>{loading ? 'Loading...' : `Delete ${user.name}`}</button>
    </div>
  );
};
