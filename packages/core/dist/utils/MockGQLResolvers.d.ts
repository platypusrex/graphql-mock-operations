declare type AnyObject = Record<string, unknown>;
export declare type RequireAtLeastOne<T> = {
    [K in keyof T]-?: Required<Pick<T, K>> & Partial<Pick<T, Exclude<keyof T, K>>>;
}[keyof T];
declare type QueryType<TState, TReturn> = (state: TState) => TReturn;
interface MockGQLResolverConfig<TQueryResolvers, TMutationResolvers, TResolverState> {
    resolvers: {
        query: QueryType<TResolverState, TQueryResolvers>[];
        mutation: QueryType<TResolverState, TMutationResolvers>[];
    };
}
interface MockGQLResolverCreate<TQueryResolvers, TMutationResolvers> {
    Query: () => TQueryResolvers;
    Mutation: () => TMutationResolvers;
}
declare type MockGQLResolverMerge<TQueryResolvers, TMutationResolvers> = RequireAtLeastOne<{
    query: TQueryResolvers;
    mutation: TMutationResolvers;
}>;
export declare class MockGQLResolvers<TQueryResolvers, TMutationResolvers, TResolverState = AnyObject> {
    private readonly resolvers;
    constructor({ resolvers, }?: MockGQLResolverConfig<TQueryResolvers, TMutationResolvers, TResolverState>);
    private mapResolvers;
    create: (state?: TResolverState | undefined) => MockGQLResolverCreate<TQueryResolvers, TMutationResolvers>;
    merge: ({ query, mutation, }: MockGQLResolverMerge<TQueryResolvers, TMutationResolvers>) => MockGQLResolverCreate<TQueryResolvers, TMutationResolvers>;
}
export {};
