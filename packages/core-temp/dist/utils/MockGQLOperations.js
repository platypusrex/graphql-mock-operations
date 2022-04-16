import { jsx as _jsx } from "react/jsx-runtime";
import { useMemo } from 'react';
import { mergeResolvers as mergeGQLResolvers } from '@graphql-tools/merge';
import { ApolloError, ApolloProvider } from '@apollo/client';
import { createApolloClient } from './createApolloClient';
import { OperationModel } from './OperationModel';
import { createLoadingApolloClient } from './createLoadingApolloClient';
import { generateOperationLoadingError } from './generateOperationLoadingError';
export class MockGQLOperations {
    introspectionResult;
    _models = {};
    _operations = {
        query: [],
        mutation: [],
    };
    constructor({ introspectionResult }) {
        this.introspectionResult = introspectionResult;
    }
    get operations() {
        return this._operations;
    }
    get models() {
        return this._models;
    }
    createProvider = () => ({ children, Provider = ApolloProvider, loading, ...props }) => {
        const client = useMemo(() => {
            if (loading) {
                return createLoadingApolloClient();
            }
            return createApolloClient(this.generateProviderProps(props));
        }, [props.operationState, props.clientOptions, props.cacheOptions, props.delay, loading]);
        return _jsx(Provider, { client: client, children: children });
    };
    createModel = (name, data) => {
        this._models = { ...this._models, [name]: new OperationModel(data) };
    };
    createOperation = (name, state) => (scenario) => ({
        [name]: (parent, variables, context, info) => {
            const currentState = scenario[name] ? scenario[name] : 'SUCCESS';
            let currentStateObj = typeof state === 'function'
                ? state(parent, variables, context, info)
                : state;
            currentStateObj = [...currentStateObj].find((s) => s.state === currentState);
            if (!currentStateObj) {
                throw new Error(`${name} operation: unable to match state`);
            }
            const { result } = currentStateObj;
            const { loading, graphQLErrors, networkError } = result ?? {};
            if (loading) {
                return generateOperationLoadingError();
            }
            if (graphQLErrors) {
                return new ApolloError({ graphQLErrors });
            }
            if (networkError) {
                return new ApolloError({ networkError });
            }
            return typeof result === 'function' ? result(this._models) : result;
        },
    });
    queryOperation = (name, state) => {
        const operation = this.createOperation(name, state);
        if (this._operations) {
            this._operations.query = [...(this._operations.query ?? []), operation];
        }
    };
    mutationOperation = (name, state) => {
        const operation = this.createOperation(name, state);
        if (this._operations) {
            this._operations.mutation = [...(this._operations.mutation ?? []), operation];
        }
    };
    generateProviderProps = ({ operationState, mergeOperations, delay, onResolved, ...rest }) => {
        console.log(mergeOperations
            ? this.mergeOperations(mergeOperations)
            : this.createOperations(operationState));
        return {
            mocks: {
                resolvers: mergeOperations
                    ? this.mergeOperations(mergeOperations)
                    : this.createOperations(operationState),
                introspectionResult: this.introspectionResult,
                delay: delay,
                onResolved,
            },
            ...rest,
        };
    };
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
    createOperations = (state) => {
        return [this._operations ?? []].reduce((resolvers, operation) => {
            const keys = Object.keys(operation);
            for (const key of keys) {
                resolvers[this.generateResolverKey(key)] = this.mapOperations(this._operations?.[key] ?? [], state);
            }
            return resolvers;
        }, {});
    };
    mergeOperations(operations, operationState) {
        const rootResolverTypes = this.introspectionResult.__schema.types.filter((type) => type.name === 'Mutation' || type.name === 'Query');
        const customOperations = Object.keys(operations).reduce((acc, operationName) => {
            const resolverRootKey = rootResolverTypes.find((resolverType) => {
                return resolverType.fields.find((field) => {
                    return field.name === operationName;
                });
            })?.name;
            if (resolverRootKey) {
                // @ts-ignore
                acc[resolverRootKey] = {
                    ...acc[resolverRootKey],
                    [operationName]: operations?.[operationName],
                };
            }
            return acc;
        }, {});
        const defaultResolvers = this.createOperations(operationState);
        return mergeGQLResolvers([defaultResolvers, customOperations]);
    }
    mergeResolvers({ query, mutation, }) {
        const defaultResolvers = this.createOperations();
        const { Query, Mutation } = defaultResolvers || {};
        const customResolvers = [query, mutation].reduce((root, resolvers, i) => {
            if (Object.keys(resolvers || {}).length) {
                const res = i === 0 ? Query : Mutation;
                root[i === 0 ? 'Query' : 'Mutation'] = () => ({
                    ...(res ? res() : {}),
                    ...resolvers,
                });
            }
            return root;
        }, {});
        if (!Object.keys(customResolvers).length) {
            return defaultResolvers;
        }
        // @ts-ignore
        return mergeGQLResolvers([defaultResolvers, customResolvers]);
    }
}
//# sourceMappingURL=MockGQLOperations.js.map