import React from 'react';
import { IntrospectionQuery } from 'graphql';
import { MockedProviderProps, OperationFn, RequireAtLeastOne } from '../types';
interface MockGQLOperationsCreate<TQueryOperations, TMutationOperations> {
    Query: TQueryOperations;
    Mutation: TMutationOperations;
}
declare type MockGQLOperationsMerge<TQueryOperations, TMutationOperations> = RequireAtLeastOne<{
    query: TQueryOperations;
    mutation: TMutationOperations;
}>;
interface MockGQLOperationsConfig<TOperationState> {
    operations: {
        query: OperationFn<TOperationState, any, any>[];
        mutation?: OperationFn<TOperationState, any, any>[];
    };
    introspectionResult: IntrospectionQuery | any;
}
export declare type MockGQLOperationsType<TMockOperations extends Record<'operations', any>, TOperationState extends Record<'state', any>> = {
    operations: TMockOperations;
    state: TOperationState;
};
export declare class MockGQLOperations<TMockGQLOperations extends MockGQLOperationsType<any, any>> {
    private readonly operations;
    private readonly introspectionResult;
    constructor({ operations, introspectionResult, }: MockGQLOperationsConfig<TMockGQLOperations['state']>);
    get current(): {
        query: OperationFn<TMockGQLOperations["operations"], any, any>[];
        mutation?: OperationFn<TMockGQLOperations["operations"], any, any>[] | undefined;
    };
    get MockApolloProvider(): React.FC<MockedProviderProps<TMockGQLOperations['state']>>;
    private generateProviderProps;
    private mapOperations;
    private generateResolverKey;
    private createResolvers;
    merge: ({ query, mutation, }: MockGQLOperationsMerge<TMockGQLOperations['operations']['Query'], TMockGQLOperations['operations']['Mutation']>) => MockGQLOperationsCreate<TMockGQLOperations['operations']['Query'], TMockGQLOperations['operations']['Mutation']>;
}
export {};
