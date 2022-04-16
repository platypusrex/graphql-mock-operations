import { mergeResolvers as mergeGQLResolvers } from '@graphql-tools/merge';
export class MockGQLResolvers {
    resolvers;
    constructor({ resolvers, } = { resolvers: { query: [], mutation: [] } }) {
        this.resolvers = resolvers;
    }
    mapResolvers = (resolvers, state) => {
        const defaultState = (state || {});
        return resolvers.reduce((acc, curr) => {
            const copy = curr;
            const key = Object.keys(copy({}))[0];
            const resolverState = Object.keys(defaultState) ? { [key]: defaultState[key] } : {};
            // @ts-ignore
            acc[key] = curr(resolverState)[key];
            return acc;
        }, {});
    };
    create = (state) => ({
        Query: () => this.mapResolvers(this.resolvers.query, state),
        Mutation: () => this.mapResolvers(this.resolvers.mutation, state),
    });
    merge = ({ query, mutation, }) => {
        const defaultResolvers = this.create();
        const { Query, Mutation } = defaultResolvers || {};
        const customResolvers = [query, mutation].reduce((root, resolvers, i) => {
            if (Object.keys(resolvers || {}).length) {
                const res = i === 0 ? Query : Mutation;
                root[i === 0 ? 'Query' : 'Mutation'] = () => ({ ...(res ? res() : {}), ...resolvers });
            }
            return root;
        }, {});
        if (!Object.keys(customResolvers).length) {
            return defaultResolvers;
        }
        // @ts-ignore
        return mergeGQLResolvers([defaultResolvers, customResolvers]);
    };
}
//# sourceMappingURL=MockGQLResolvers.js.map