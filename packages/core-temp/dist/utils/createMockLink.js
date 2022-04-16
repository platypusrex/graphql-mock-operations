import { graphql, print } from 'graphql';
import { ApolloLink, Observable } from '@apollo/client';
import { delay } from './delay';
import { LOADING_ERROR_CODE } from './generateOperationLoadingError';
export function createMockLink(schema, rootValue = {}, context = {}, options = {}) {
    const delayMs = options?.delay ?? 0;
    return new ApolloLink((operation) => {
        return new Observable((observer) => {
            const { query, operationName, variables } = operation;
            const source = print(query);
            delay(delayMs)
                .then(() => graphql({
                schema,
                source,
                rootValue,
                contextValue: context,
                variableValues: variables,
                operationName,
            }))
                // @ts-ignore
                .then((result) => {
                const { onResolved } = options;
                onResolved &&
                    onResolved({
                        operationName,
                        variables,
                        query: source,
                        result,
                    });
                const loading = result.errors?.find((error) => error?.extensions?.code === LOADING_ERROR_CODE);
                if (loading)
                    return {};
                const originalError = result?.errors?.[0].originalError;
                if (originalError) {
                    const { graphQLErrors, networkError } = originalError ?? {};
                    graphQLErrors.length && observer.next({ errors: result?.errors });
                    networkError
                        ? observer.error(networkError)
                        : observer.error(originalError.message);
                }
                else {
                    observer.next(result);
                }
                observer.complete();
            })
                .catch(observer.error.bind(observer));
        });
    });
}
//# sourceMappingURL=createMockLink.js.map