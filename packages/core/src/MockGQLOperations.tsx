import * as React from 'react';
import { ApolloError, ApolloProvider } from '@apollo/client';
import { mergeResolvers } from '@graphql-tools/merge';
import type { IntrospectionQuery } from 'graphql';
import type { IntrospectionObjectType } from 'graphql/utilities/getIntrospectionQuery';
import type { IResolvers } from '@graphql-tools/utils';
import { OperationModel, ResolverReturn } from './OperationModel';
import type {
  AnyObject,
  CreateOperationState,
  MockProviderProps,
  NonEmptyArray,
  OperationFn,
  OperationState,
  OperationType,
  ProtectedMockedProviderProps,
} from './types';
import {
  CreateApolloClient,
  createApolloClient,
  createLoadingApolloClient,
  generateOperationLoadingError,
} from './utils';

interface MockGQLOperationsCreate<TQueryOperations, TMutationOperations> {
  Query: TQueryOperations;
  Mutation: TMutationOperations;
}

interface MockGQLOperationType<TOperationState> {
  operations?: {
    query: OperationFn<TOperationState, AnyObject, AnyObject>[];
    mutation?: OperationFn<TOperationState, AnyObject, AnyObject>[];
  };
}

interface MockGQLOperationsConfig {
  introspectionResult: IntrospectionQuery | any;
}

export interface MockGQLOperationsType<
  TOperationState extends Record<'state', OperationState<any, any>>,
  TModels extends Record<'models', OperationModel<any>>
> {
  state: TOperationState;
  models?: TModels;
}

export class MockGQLOperations<TMockGQLOperations extends MockGQLOperationsType<any, any>> {
  private readonly introspectionResult: MockGQLOperationsConfig['introspectionResult'];
  private _models: TMockGQLOperations['models'] = {};
  private _operations: MockGQLOperationType<TMockGQLOperations['state']>['operations'] = {
    mutation: [],
    query: [],
  };

  constructor({ introspectionResult }: MockGQLOperationsConfig) {
    this.introspectionResult = introspectionResult;
  }

  get operations(): MockGQLOperationType<TMockGQLOperations['state']>['operations'] {
    return this._operations;
  }

  get models(): TMockGQLOperations['models'] {
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
      this._operations.query = [...((this._operations.query as any) ?? []), operation];
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
      this._operations.mutation = [...((this._operations.mutation as any) ?? []), operation];
    }
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
      // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
      [name]: (
        parent: Parameters<TMockOperation[keyof TMockOperation]>[0],
        variables: Parameters<TMockOperation[keyof TMockOperation]>[1],
        context: Parameters<TMockOperation[keyof TMockOperation]>[2],
        info: Parameters<TMockOperation[keyof TMockOperation]>[3]
      ) => {
        const currentState = scenario[name] ? scenario[name] : 'SUCCESS';
        let currentStateObj =
          typeof state === 'function' ? state(parent, variables, context, info) : state;

        // @ts-ignore
        currentStateObj = [...currentStateObj].find((s) => s.state === currentState);
        if (!currentStateObj) {
          throw new Error(`${name} operation: unable to match state`);
        }

        // @ts-ignore
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

  private generateProviderProps = ({
    operationState,
    mergeOperations,
    delay,
    onResolved,
    ...rest
  }: MockProviderProps<TMockGQLOperations['state']> &
    ProtectedMockedProviderProps): CreateApolloClient => ({
    mocks: {
      delay,
      introspectionResult: this.introspectionResult,
      onResolved,
      resolvers: mergeOperations
        ? this.mergeOperations(mergeOperations)
        : this.createOperations(operationState),
    },
    ...rest,
  });

  private mapOperations = (
    operations: OperationFn<TMockGQLOperations['state'], any, any>[],
    state?: TMockGQLOperations['state']
  ): MockGQLOperationsCreate<any, any> => {
    const defaultState = (state ?? {}) as TMockGQLOperations['state'];
    return operations.reduce<MockGQLOperationsCreate<any, any>>((operationObj, operation) => {
      const key = Object.keys(
        operation({} as TMockGQLOperations['state'])
      )[0] as keyof TMockGQLOperations['state'];
      const operationState = Object.keys(defaultState) ? { [key]: defaultState[key] } : {};
      // eslint-disable-next-line no-param-reassign
      operationObj[key as keyof MockGQLOperationsCreate<any, any>] = operation(
        operationState as unknown as TMockGQLOperations['state']
      )[key];
      return operationObj;
    }, {} as MockGQLOperationsCreate<any, any>);
  };

  private generateResolverKey = (key: keyof MockGQLOperationType<any>['operations']): string =>
    (key as string).charAt(0).toUpperCase() + (key as string).slice(1);

  private createOperations = (state?: TMockGQLOperations['state']): IResolvers =>
    [this._operations ?? []].reduce<IResolvers>((operationObj, operation) => {
      const keys = Object.keys(operation);
      for (const key of keys as (keyof typeof operation)[]) {
        // eslint-disable-next-line no-param-reassign
        operationObj[this.generateResolverKey(key)] = this.mapOperations(
          this._operations?.[key] ?? [],
          state
        );
      }
      return operationObj;
    }, {});

  private mergeOperations(
    operations: Partial<TMockGQLOperations['state']['operation']>,
    operationState?: MockProviderProps<TMockGQLOperations['state']>['operationState']
  ): IResolvers {
    const rootResolverTypes = (
      this.introspectionResult as IntrospectionQuery
    ).__schema.types.filter((type) => type.name === 'Mutation' || type.name === 'Query');

    const customOperations = Object.keys(operations).reduce<IResolvers>((acc, operationName) => {
      const resolverRootKey = rootResolverTypes.find((resolverType) =>
        (resolverType as IntrospectionObjectType).fields.find(
          (field) => field.name === operationName
        )
      )?.name;

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
