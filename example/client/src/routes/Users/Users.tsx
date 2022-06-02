import React, { FormEvent } from 'react';
import { useForm } from '../../hooks/useForm';
import { useUsers } from '../../hooks/useUsers';
import { useBook } from '../../hooks/useBook';
import { useCreateUser } from '../../hooks/useCreateUser';
import { usersQuery } from '../../gql';
import { UsersQuery } from '../../typings/generated';
import './Users.css';
import { UserCard } from './UserCard';

export interface UsersProps {
  foo?: 'bar';
}

interface CreateUserFormValues {
  name: string;
  email: string;
}
const initialFormState: CreateUserFormValues = {
  name: '',
  email: '',
};

export const Users: React.FC<UsersProps> = () => {
  const { values, onChange, reset } = useForm<CreateUserFormValues>(initialFormState);

  const { users, error, loading: usersLoading } = useUsers();

  const { book, loading: bookLoading } = useBook();

  const { createUser, loading: submitting } = useCreateUser({
    onCompleted: () => {
      reset();
    },
    update: (cache, { data }) => {
      const result = data?.createUser;
      if (!result) return;
      const currentUsers = cache.readQuery<UsersQuery>({
        query: usersQuery,
      });

      const users = currentUsers?.users;
      if (!users) return;

      cache.writeQuery<UsersQuery>({
        query: usersQuery,
        data: {
          users: [...users, result],
        },
      });
    },
  });

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    await createUser({
      variables: {
        input: { name: values.name, email: values.email },
      },
    });
  };

  if (error?.graphQLErrors.length) {
    return <div>Graphql error: {error.graphQLErrors[0].message}</div>;
  }

  if (error?.networkError) {
    return <div>Network error: {error.networkError?.message}</div>;
  }

  const usersList = usersLoading ? (
    <div style={{ display: 'flex', alignContent: 'center', justifyContent: 'center' }}>
      Loading users...
    </div>
  ) : (
    <>
      {users?.map((user: any) => (
        <UserCard key={user.id} user={user} />
      ))}
    </>
  );

  const bookContent = bookLoading ? (
    <div style={{ display: 'flex', alignContent: 'center', justifyContent: 'center' }}>
      Loading books...
    </div>
  ) : (
    <pre className="Users-code-block">
      <h3>Title: {book?.title}</h3>
      <code>{JSON.stringify(book, null, 2)}</code>
    </pre>
  );

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <div className="form-control">
          <label htmlFor="name">Name</label>
          <input id="name" name="name" type="text" value={values.name} onChange={onChange} />
        </div>
        <div className="form-control">
          <label htmlFor="email">Email</label>
          <input id="email" name="email" type="text" value={values.email} onChange={onChange} />
        </div>
        <button type="submit">{submitting ? 'Loading...' : 'Create user'}</button>
      </form>
      {usersList}
      {bookContent}
    </div>
  );
};
