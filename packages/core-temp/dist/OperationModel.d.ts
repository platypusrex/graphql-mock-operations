import { GraphQLErrors, NetworkError, NonEmptyArray, OperationLoading, OperationType } from './types';
export declare type ResolverReturn<T> = T extends GraphQLErrors | NetworkError | Promise<any> | OperationLoading ? never : NonNullable<T>;
export declare class OperationModel<TModel extends OperationType<any, any>> {
    private _models;
    constructor(models: NonEmptyArray<ResolverReturn<ReturnType<TModel[keyof TModel]>>>);
    get models(): ResolverReturn<ReturnType<TModel[keyof TModel]>>[];
    findOne: (key: keyof Omit<ResolverReturn<ReturnType<TModel[keyof TModel]>>, '__typename'>, value: ResolverReturn<ReturnType<TModel[keyof TModel]>>[keyof ResolverReturn<ReturnType<TModel[keyof TModel]>>]) => NonNullable<ResolverReturn<ReturnType<TModel[keyof TModel]>>> | null;
    findFirst: () => ResolverReturn<ReturnType<TModel[keyof TModel]>>;
    findLast: () => ResolverReturn<ReturnType<TModel[keyof TModel]>>;
    create: (model: ResolverReturn<ReturnType<TModel[keyof TModel]>>) => ResolverReturn<ReturnType<TModel[keyof TModel]>>;
    update: (key: keyof Omit<ResolverReturn<ReturnType<TModel[keyof TModel]>>, '__typename'>, value: ResolverReturn<ReturnType<TModel[keyof TModel]>>[keyof ResolverReturn<ReturnType<TModel[keyof TModel]>>], data: Partial<ResolverReturn<ReturnType<TModel[keyof TModel]>>>) => ResolverReturn<ReturnType<TModel[keyof TModel]>>;
    delete: (key: keyof Omit<ResolverReturn<ReturnType<TModel[keyof TModel]>>, '__typename'>, value: ResolverReturn<ReturnType<TModel[keyof TModel]>>[keyof ResolverReturn<ReturnType<TModel[keyof TModel]>>]) => ResolverReturn<ReturnType<TModel[keyof TModel]>>;
}
