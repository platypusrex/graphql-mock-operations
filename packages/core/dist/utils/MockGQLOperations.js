import { jsx as _jsx } from "react/jsx-runtime";
import { useMemo } from 'react';
import { mergeResolvers as mergeGQLResolvers } from '@graphql-tools/merge';
import { ApolloProvider } from '@apollo/client';
import { createApolloClient } from './createApolloClient';
export class MockGQLOperations {
    operations;
    introspectionResult;
    constructor({ operations = { query: [], mutation: [] }, introspectionResult, }) {
        this.operations = operations;
        this.introspectionResult = introspectionResult;
    }
    get current() {
        return this.operations;
    }
    get MockApolloProvider() {
        return ({ children, Provider = ApolloProvider, operationState, ...rest }) => {
            const client = useMemo(() => {
                const providerProps = this.generateProviderProps({
                    operationState,
                    ...rest
                });
                return createApolloClient(providerProps);
            }, [operationState, rest.clientOptions, rest.cacheOptions, rest.delay]);
            return _jsx(Provider, { client: client, children: children });
        };
    }
    generateProviderProps = ({ operationState, delay, onResolved, ...rest }) => ({
        mocks: {
            resolvers: this.createResolvers(operationState),
            introspectionResult: this.introspectionResult,
            delay: delay,
            onResolved
        },
        ...rest
    });
    mapOperations = (resolvers, state) => {
        const defaultState = (state ?? {});
        return resolvers.reduce((resolver, operation) => {
            const key = Object.keys(operation({}))[0];
            const resolverState = Object.keys(defaultState) ? { [key]: defaultState[key] } : {};
            resolver[key] = operation(resolverState)[key];
            return resolver;
        }, {});
    };
    generateResolverKey = (key) => key.charAt(0).toUpperCase() + key.slice(1);
    createResolvers = (state) => {
        return [this.operations].reduce((resolvers, operation) => {
            const keys = Object.keys(operation);
            for (const key of keys) {
                resolvers[this.generateResolverKey(key)] =
                    this.mapOperations(this.operations[key] ?? [], state);
            }
            return resolvers;
        }, {});
    };
    merge = ({ query, mutation, }) => {
        const defaultResolvers = this.createResolvers();
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
//# sourceMappingURL=MockGQLOperations.js.map