import { GraphQLError } from 'graphql';
import { ApolloLink } from '@apollo/client';
export declare function createErrorLink(graphQLError?: string | GraphQLError[]): ApolloLink;
