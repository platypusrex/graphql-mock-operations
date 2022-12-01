import { mockBuilder } from '../builder';

mockBuilder.mutationOperation('createUser', (_, { input: { name } }) => [
  {
    state: 'SUCCESS',
    result: ({ user }) =>
      user.create({
        id: String(user.models.length + 1),
        name,
        address: null,
      }),
  },
]);
