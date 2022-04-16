import React from 'react';
import { GraphQLError } from 'graphql';
export interface ApolloErrorProviderProps {
    graphQLError?: string | GraphQLError[];
    Provider?: React.ComponentType<any>;
}
export declare const ApolloErrorProvider: React.FC<ApolloErrorProviderProps>;
