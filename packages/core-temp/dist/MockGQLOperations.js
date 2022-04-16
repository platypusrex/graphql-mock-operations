import { jsx as _jsx } from "react/jsx-runtime";
import * as React from 'react';
import { mergeResolvers } from '@graphql-tools/merge';
import { ApolloError, ApolloProvider } from '@apollo/client';
import { createApolloClient, createLoadingApolloClient, generateOperationLoadingError, } from './utils';
import { OperationModel } from './OperationModel';
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
        const client = React.useMemo(() => {
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
    mapOperations = (operations, state) => {
        const defaultState = (state ?? {});
        return operations.reduce((operationObj, operation) => {
            const key = Object.keys(operation({}))[0];
            const operationState = Object.keys(defaultState) ? { [key]: defaultState[key] } : {};
            operationObj[key] = operation(operationState)[key];
            return operationObj;
        }, {});
    };
    generateResolverKey = (key) => key.charAt(0).toUpperCase() + key.slice(1);
    createOperations = (state) => {
        return [this._operations ?? []].reduce((operationObj, operation) => {
            const keys = Object.keys(operation);
            for (const key of keys) {
                operationObj[this.generateResolverKey(key)] = this.mapOperations(this._operations?.[key] ?? [], state);
            }
            return operationObj;
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
        const defaultOperations = this.createOperations(operationState);
        return mergeResolvers([defaultOperations, customOperations]);
    }
}
//# sourceMappingURL=MockGQLOperations.js.map