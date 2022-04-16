import { OperationState, OperationType } from '../types';
declare type OperationStateObject<TOperationState, TOperationReturn> = {
    state: TOperationState;
    value: TOperationReturn | (() => TOperationReturn);
};
declare type CreateOperationState<TMockOperation extends OperationType<any, any>, TOperationState> = ((parent: Parameters<TMockOperation[keyof TMockOperation]>[0], args: Parameters<TMockOperation[keyof TMockOperation]>[1], context: Parameters<TMockOperation[keyof TMockOperation]>[2], info: Parameters<TMockOperation[keyof TMockOperation]>[3]) => OperationStateObject<TOperationState, ReturnType<TMockOperation[keyof TMockOperation]>>[]) | OperationStateObject<TOperationState, ReturnType<TMockOperation[keyof TMockOperation]>>[];
export declare const createOperation: <TMockOperation extends OperationType<any, any>, TOperationState extends OperationState<TMockOperation, string>>(name: keyof TMockOperation, state: CreateOperationState<TMockOperation, TOperationState[keyof TMockOperation]>) => (action: Record<keyof TMockOperation, TOperationState[keyof TMockOperation]>) => {
    [x: string]: (parent: Parameters<TMockOperation[keyof TMockOperation]>[0], variables: Parameters<TMockOperation[keyof TMockOperation]>[1], context: Parameters<TMockOperation[keyof TMockOperation]>[2], info: Parameters<TMockOperation[keyof TMockOperation]>[3]) => any;
};
export {};
