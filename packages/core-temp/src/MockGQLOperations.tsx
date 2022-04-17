import * as React from 'react';
import { mergeResolvers } from '@graphql-tools/merge';
import { IResolvers } from '@graphql-tools/utils';
import { IntrospectionQuery } from 'graphql';
import { IntrospectionObjectType } from 'graphql/utilities/getIntrospectionQuery';
import { ApolloError, ApolloProvider } from '@apollo/client';
import {
  CreateApolloClient,
  createApolloClient,
  createLoadingApolloClient,
  generateOperationLoadingError,
} from './utils';
import { ResolverReturn, OperationModel } from './OperationModel';
import {
  CreateOperationState,
  MockProviderProps,
  NonEmptyArray,
  OperationFn,
  OperationState,
  OperationType,
  ProtectedMockedProviderProps,
} from './types';

interface MockGQLOperationsCreate<TQueryOperations, TMutationOperations> {
  Query: TQueryOperations;
  Mutation: TMutationOperations;
}

interface MockGQLOperationType<TOperationState> {
  operations?: {
    query: OperationFn<TOperationState, any, any>[];
    mutation?: OperationFn<TOperationState, any, any>[];
  };
}

interface MockGQLOperationsConfig {
  introspectionResult: IntrospectionQuery | any;
}

export type MockGQLOperationsType<
  TOperationState extends Record<'state', OperationState<any, any>>,
  TModels extends Record<'models', OperationModel<any>>
> = {
  state: TOperationState;
  models?: TModels;
};

export class MockGQLOperations<TMockGQLOperations extends MockGQLOperationsType<any, any>> {
  private readonly introspectionResult: MockGQLOperationsConfig['introspectionResult'];
  private _models: TMockGQLOperations['models'] = {};
  private _operations: MockGQLOperationType<TMockGQLOperations['state']>['operations'] = {
    query: [],
    mutation: [],
  };

  constructor({ introspectionResult }: MockGQLOperationsConfig) {
    this.introspectionResult = introspectionResult;
  }

  get operations() {
    return this._operations;
  }

  get models() {
    return this._models;
  }

  createProvider =
    (): React.FC<MockProviderProps<TMockGQLOperations['state']>> =>
    ({ children, Provider = ApolloProvider, loading, ...props }) => {
      const client = React.useMemo(() => {
        if (loading) {
          return createLoadingApolloClient();
        }
        return createApolloClient(this.generateProviderProps(props));
      }, [props.operationState, props.clientOptions, props.cacheOptions, props.delay, loading]);
      return <Provider client={client}>{children}</Provider>;
    };

  createModel = <TModel extends OperationType<any, any>>(
    name: keyof TModel,
    data: NonEmptyArray<ResolverReturn<ReturnType<TModel[keyof TModel]>>>
  ): void => {
    this._models = { ...this._models, [name]: new OperationModel<TModel>(data) };
  };

  private createOperation =
    <
      TMockOperation extends OperationType<any, any>,
      TOperationState extends OperationState<TMockOperation, string>
    >(
      name: keyof TMockOperation,
      state: CreateOperationState<
        TMockOperation,
        TOperationState['state'][keyof TMockOperation],
        TMockGQLOperations['models']
      >
    ): OperationFn<
      TOperationState['state'],
      any,
      Parameters<TMockOperation[keyof TMockOperation]>
    > =>
    (scenario: Record<keyof TMockOperation, TOperationState['state'][keyof TMockOperation]>) => ({
      [name]: (
        parent: Parameters<TMockOperation[keyof TMockOperation]>[0],
        variables: Parameters<TMockOperation[keyof TMockOperation]>[1],
        context: Parameters<TMockOperation[keyof TMockOperation]>[2],
        info: Parameters<TMockOperation[keyof TMockOperation]>[3]
      ) => {
        const currentState = scenario[name] ? scenario[name] : 'SUCCESS';
        let currentStateObj =
          typeof state === 'function'
            ? (state as Function)(parent, variables, context, info)
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

  queryOperation = <
    TMockOperation extends OperationType<any, any>,
    TOperationState extends OperationState<TMockOperation, string>
  >(
    name: keyof TMockOperation,
    state: CreateOperationState<
      TMockOperation,
      TOperationState['state'][keyof TMockOperation],
      TMockGQLOperations['models']
    >
  ): void => {
    const operation = this.createOperation(name, state);
    if (this._operations) {
      this._operations.query = [...(this._operations.query ?? []), operation];
    }
  };

  mutationOperation = <
    TMockOperation extends OperationType<any, any>,
    TOperationState extends OperationState<TMockOperation, string>
  >(
    name: keyof TMockOperation,
    state: CreateOperationState<
      TMockOperation,
      TOperationState['state'][keyof TMockOperation],
      TMockGQLOperations['models']
    >
  ): void => {
    const operation = this.createOperation(name, state);
    if (this._operations) {
      this._operations.mutation = [...(this._operations.mutation ?? []), operation];
    }
  };

  private generateProviderProps = ({
    operationState,
    mergeOperations,
    delay,
    onResolved,
    ...rest
  }: MockProviderProps<TMockGQLOperations['state']> &
    ProtectedMockedProviderProps): CreateApolloClient => ({
    mocks: {
      resolvers: mergeOperations
        ? this.mergeOperations(mergeOperations)
        : this.createOperations(operationState),
      introspectionResult: this.introspectionResult,
      delay: delay,
      onResolved,
    },
    ...rest,
  });

  private mapOperations = (
    operations: OperationFn<TMockGQLOperations['state'], any, any>[],
    state?: TMockGQLOperations['state']
  ): MockGQLOperationsCreate<any, any> => {
    const defaultState = (state ?? {}) as TMockGQLOperations['state'];
    return operations.reduce((operationObj, operation) => {
      const key = Object.keys(
        operation({} as TMockGQLOperations['state'])
      )[0] as keyof TMockGQLOperations['state'];
      const operationState = Object.keys(defaultState) ? { [key]: defaultState[key] } : {};
      operationObj[key as keyof MockGQLOperationsCreate<any, any>] = operation(
        operationState as unknown as TMockGQLOperations['state']
      )[key];
      return operationObj;
    }, {} as MockGQLOperationsCreate<any, any>);
  };

  private generateResolverKey = (key: keyof MockGQLOperationType<any>['operations']): string =>
    (key as any).charAt(0).toUpperCase() + (key as any).slice(1);

  private createOperations = (state?: TMockGQLOperations['state']): IResolvers => {
    return [this._operations ?? []].reduce((operationObj, operation) => {
      const keys = Object.keys(operation);
      for (const key of keys as Array<keyof typeof operation>) {
        operationObj[this.generateResolverKey(key)] = this.mapOperations(
          this._operations?.[key] ?? [],
          state
        );
      }
      return operationObj;
    }, {} as IResolvers);
  };

  private mergeOperations(
    operations: Partial<TMockGQLOperations['state']['operation']>,
    operationState?: MockProviderProps<TMockGQLOperations['state']>['operationState']
  ) {
    const rootResolverTypes = (
      this.introspectionResult as IntrospectionQuery
    ).__schema.types.filter((type) => type.name === 'Mutation' || type.name === 'Query');

    const customOperations = Object.keys(operations).reduce((acc, operationName) => {
      const resolverRootKey = rootResolverTypes.find((resolverType) => {
        return (resolverType as IntrospectionObjectType).fields.find((field) => {
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
    }, {} as IResolvers);

    const defaultOperations = this.createOperations(operationState);

    return mergeResolvers([defaultOperations, customOperations]);
  }
}
