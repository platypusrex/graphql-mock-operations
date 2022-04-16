import React from 'react';
import { CreateApolloClient } from '../utils';
export interface ApolloMockedProviderProps extends CreateApolloClient {
    Provider?: React.ComponentType<any>;
}
export declare const ApolloMockedProvider: React.FC<ApolloMockedProviderProps>;
