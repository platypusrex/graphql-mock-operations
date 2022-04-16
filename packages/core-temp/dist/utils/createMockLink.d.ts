import { GraphQLSchema } from 'graphql';
import { ApolloLink } from '@apollo/client';
import { CreateLinkOptions } from '../types';
export declare function createMockLink(schema: GraphQLSchema, rootValue?: {}, context?: {}, options?: CreateLinkOptions): ApolloLink;
