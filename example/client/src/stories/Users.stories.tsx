import React from 'react';
import { ComponentMeta } from '@storybook/react';
import { Users } from '../routes/Users';
// import { GraphQLError, GraphQLFormattedError } from 'graphql';
// import { ApolloError } from '@apollo/client';
import { MockApolloProvider } from '../lib/operations';
import { StoryWithApollo } from '@graphql-mock-operations/storybook-addon/dist/types';

// const GRAPHQL_ERROR: GraphQLError = {
//   stack: '',
//   get [Symbol.toStringTag](): string {
//     return '';
//   },
//   toJSON: (): GraphQLFormattedError => ({
//     message: '',
//   }),
//   toString: (): string => '',
//   message: 'Fuck my life',
//   locations: [],
//   path: undefined,
//   source: undefined,
//   nodes: [],
//   positions: [],
//   originalError: undefined,
//   name: '',
//   extensions: { code: 'FUCK_MY_LIFE' }
// }
//
// const graphqlError = new GraphQLError(
//   'fuck you',
//   [],
//   undefined,
//   [],
//   undefined,
//   undefined,
//   { code: 'FUCK_MY_LIFE' }
// );

export default {
  title: 'Example/Users',
  component: Users,
} as ComponentMeta<typeof Users>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: StoryWithApollo<typeof MockApolloProvider, typeof Users> = () => <Users />;

export const Primary = Template.bind({});
Primary.args = {
  foo: 'bar',
};
Primary.parameters = {
  apolloClient: {
    operationState: { users: 'SUCCESS', book: 'SUCCESS', createUser: 'SUCCESS' },
    delay: 2000,
  },
};
