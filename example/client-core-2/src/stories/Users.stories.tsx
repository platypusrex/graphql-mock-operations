import React from 'react';
import { ComponentMeta } from '@storybook/react';
import { StoryWithApollo } from '@graphql-mock-operations/storybook-addon';
import { Users } from '../routes/Users';
// import { GraphQLError, GraphQLFormattedError } from 'graphql';
import { MockProvider, models } from '../lib/mocks';

// const GRAPHQL_ERROR: GraphQLError = {
//   stack: '',
//   get [Symbol.toStringTag](): string {
//     return '';
//   },
//   toJSON: (): GraphQLFormattedError => ({
//     message: '',
//   }),
//   toString: (): string => '',
//   message: 'error message',
//   locations: [],
//   path: undefined,
//   source: undefined,
//   nodes: [],
//   positions: [],
//   originalError: undefined,
//   name: '',
//   extensions: { code: 'broke_up' }
// }
//
// const graphqlError = new GraphQLError(
//   'error message',
//   [],
//   undefined,
//   [],
//   undefined,
//   undefined,
//   { code: 'broke_up' }
// );

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
    operationState: { book: 'SUCCESS', createUser: 'SUCCESS' },
    mergeOperations: { users: () => [models.user.models[2]] },
    delay: 1200,
  },
};
