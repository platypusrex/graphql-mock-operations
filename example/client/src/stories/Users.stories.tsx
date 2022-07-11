import React from 'react';
import { ComponentMeta } from '@storybook/react';
import { StoryWithApollo } from '@graphql-mock-operations/storybook-addon';
import { Users } from '../routes/Users';
import { MockProvider } from '../lib/mocks';

export default {
  title: 'Example/Users',
  component: Users,
} as ComponentMeta<typeof Users>;

const Template: StoryWithApollo<typeof MockProvider, typeof Users> = () => <Users />;

export const Primary = Template.bind({});
Primary.args = {
  foo: 'bar',
};
Primary.parameters = {
  apolloClient: {
    operationState: {
      book: 'SUCCESS',
      createUser: 'SUCCESS',
      user: 'SUCCESS',
      users: 'GQL_ERROR',
      deleteUser: 'SUCCESS'
    },
    mergeOperations: ({ user, book }) => ({
      users: () => [user.models[3]],
      book: () => book.findOne('id', '3'),
    }),
    delay: 1200,
  },
};
