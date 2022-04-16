import * as React from 'react';
import { IResolvers } from '@graphql-tools/utils';
import { GraphQLError, GraphQLResolveInfo, IntrospectionQuery } from 'graphql';
import {
  ApolloClientOptions,
  ApolloLink,
  InMemoryCache,
  InMemoryCacheConfig,
  NormalizedCacheObject,
} from '@apollo/client';

export type RequireAtLeastOne<T> = {
  [K in keyof T]-?: Required<Pick<T, K>> & Partial<Pick<T, Exclude<keyof T, K>>>;
}[keyof T];

export interface OperationMeta {
  query: string;
  operationName: string;
  variables: { [key: string]: any };
  result: { [key: string]: any };
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

// types for provider
type ClientOptions = Pick<
  ApolloClientOptions<NormalizedCacheObject>,
  | 'headers'
  | 'queryDeduplication'
  | 'defaultOptions'
  | 'assumeImmutableResults'
  | 'typeDefs'
  | 'fragmentMatcher'
  | 'connectToDevTools'
>;

type CacheOptions = Omit<InMemoryCacheConfig, 'addTypename'>;

export interface MockedProviderProps<TOperationState> {
  operationState: Partial<TOperationState>;
  delay?: number;
  cacheOptions?: CacheOptions;
  clientOptions?: ClientOptions;
  links?: (cache?: InMemoryCache) => ApolloLink[];
  Provider?: React.ComponentType<any>;
}

export interface ProtectedMockedProviderProps {
  onResolved?: (operationMeta: OperationMeta) => void;
}

// MockGQLOperations supporting types
export type ResolverFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => Promise<TResult> | TResult | GraphQLError[] | Error;

export type OperationType<TResult, TArgs> = Record<
  keyof TResult,
  ResolverFn<TResult[keyof TResult], {}, {}, TArgs>
>;
export type OperationFn<TState, TResult, TArgs> = (state: TState) => OperationType<TResult, TArgs>;
export type OperationState<TMockOperation, TOperationState = 'SUCCESS'> = Record<
  keyof TMockOperation,
  TOperationState | 'SUCCESS'
>;
