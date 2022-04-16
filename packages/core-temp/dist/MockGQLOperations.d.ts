import * as React from 'react';
import { IntrospectionQuery } from 'graphql';
import { ResolverReturn, OperationModel } from './OperationModel';
import { CreateOperationState, MockProviderProps, NonEmptyArray, OperationFn, OperationState, OperationType } from './types';
interface MockGQLOperationsConfig {
    introspectionResult: IntrospectionQuery | any;
}
export declare type MockGQLOperationsType<TOperationState extends Record<'state', OperationState<any, any>>, TModels extends Record<'models', OperationModel<any>>> = {
    state: TOperationState;
    models?: TModels;
};
export declare class MockGQLOperations<TMockGQLOperations extends MockGQLOperationsType<any, any>> {
    private readonly introspectionResult;
    private _models;
    private _operations;
    constructor({ introspectionResult }: MockGQLOperationsConfig);
    get operations(): {
        query: OperationFn<TMockGQLOperations["state"], any, any>[];
        mutation?: OperationFn<TMockGQLOperations["state"], any, any>[] | undefined;
    } | undefined;
    get models(): TMockGQLOperations["models"];
    createProvider: () => React.FC<MockProviderProps<TMockGQLOperations['state']>>;
    createModel: <TModel extends OperationType<any, any>>(name: keyof TModel, data: NonEmptyArray<ResolverReturn<ReturnType<TModel[keyof TModel]>>>) => void;
    private createOperation;
    queryOperation: <TMockOperation extends OperationType<any, any>, TOperationState extends OperationState<TMockOperation, string>>(name: keyof TMockOperation, state: CreateOperationState<TMockOperation, TOperationState["state"][keyof TMockOperation], TMockGQLOperations["models"]>) => void;
    mutationOperation: <TMockOperation extends OperationType<any, any>, TOperationState extends OperationState<TMockOperation, string>>(name: keyof TMockOperation, state: CreateOperationState<TMockOperation, TOperationState["state"][keyof TMockOperation], TMockGQLOperations["models"]>) => void;
    private generateProviderProps;
    private mapOperations;
    private generateResolverKey;
    private createOperations;
    private mergeOperations;
}
export {};
