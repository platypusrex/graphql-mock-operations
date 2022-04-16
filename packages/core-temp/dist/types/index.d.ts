import * as React from 'react';
import { IResolvers } from '@graphql-tools/utils';
import { GraphQLError, GraphQLResolveInfo, IntrospectionQuery } from 'graphql';
import { ApolloClientOptions, ApolloLink, InMemoryCache, InMemoryCacheConfig, NormalizedCacheObject } from '@apollo/client';
import { OperationModel } from '../OperationModel';
export declare type RequireAtLeastOne<T> = {
    [K in keyof T]-?: Required<Pick<T, K>> & Partial<Pick<T, Exclude<keyof T, K>>>;
}[keyof T];
export declare type NonEmptyArray<T> = [T, ...T[]];
export interface OperationMeta {
    query: string;
    operationName: string;
    variables: {
        [key: string]: any;
    };
    result: {
        [key: string]: any;
    };
}
export interface CreateLinkOptions {
    delay?: number;
    onResolved?: (operationMeta: OperationMeta) => void;
}
export interface LinkSchemaProps extends CreateLinkOptions {
    resolvers: IResolvers;
    introspectionResult: IntrospectionQuery | any;
    rootValue?: any;
    context?: any;
}
declare type ClientOptions = Pick<ApolloClientOptions<NormalizedCacheObject>, 'headers' | 'queryDeduplication' | 'defaultOptions' | 'assumeImmutableResults' | 'typeDefs' | 'fragmentMatcher' | 'connectToDevTools'>;
declare type CacheOptions = Omit<InMemoryCacheConfig, 'addTypename'>;
export interface MockProviderProps<TOperationState extends OperationState<any, any>> {
    loading?: boolean;
    operationState?: RequireAtLeastOne<TOperationState['state']>;
    mergeOperations?: RequireAtLeastOne<TOperationState['operation']>;
    delay?: number;
    cacheOptions?: CacheOptions;
    clientOptions?: ClientOptions;
    links?: (cache?: InMemoryCache) => ApolloLink[];
    Provider?: React.ComponentType<any>;
}
export interface ProtectedMockedProviderProps {
    onResolved?: (operationMeta: OperationMeta) => void;
}
declare type OperationStateObject<TOperationState, TOperationReturn, TModels> = {
    state: TOperationState;
    result: TOperationReturn | ((models: TModels) => TOperationReturn);
};
export declare type CreateOperationState<TMockOperation extends OperationType<any, any>, TOperationState, TModels = any> = ((parent: Parameters<TMockOperation[keyof TMockOperation]>[0], args: Parameters<TMockOperation[keyof TMockOperation]>[1], context: Parameters<TMockOperation[keyof TMockOperation]>[2], info: Parameters<TMockOperation[keyof TMockOperation]>[3]) => NonEmptyArray<OperationStateObject<TOperationState, ReturnType<TMockOperation[keyof TMockOperation]>, TModels>>) | NonEmptyArray<OperationStateObject<TOperationState, ReturnType<TMockOperation[keyof TMockOperation]>, TModels>>;
export declare type GraphQLErrors = {
    graphQLErrors?: GraphQLError | GraphQLError[];
};
export declare type NetworkError = {
    networkError?: Error;
};
export declare type OperationLoading = {
    loading?: boolean;
};
export declare type ResolverFn<TResult, TParent, TContext, TArgs> = (parent: TParent, args: TArgs, context: TContext, info: GraphQLResolveInfo) => Promise<TResult> | TResult | GraphQLErrors | NetworkError | OperationLoading;
export declare type OperationType<TResult, TArgs> = Record<keyof TResult, ResolverFn<TResult[keyof TResult], {}, {}, TArgs>>;
export declare type OperationFn<TState, TResult, TArgs> = (scenario: TState) => OperationType<TResult, TArgs>;
export declare type OperationState<TMockOperation, TOperationState> = {
    operation: TMockOperation;
    state: Record<keyof TMockOperation, TOperationState>;
};
export declare type OperationModelType<TMockOperation extends OperationType<any, any>> = Record<keyof TMockOperation, OperationModel<TMockOperation>>;
export {};
