import { graphql, print } from 'graphql';
import { ApolloLink, Observable } from '@apollo/client';
import { delay } from './delay';
export function createMockLink(schema, rootValue = {}, context = {}, options = {}) {
    const delayMs = options?.delay ?? 0;
    return new ApolloLink((operation) => {
        return new Observable((observer) => {
            const { query, operationName, variables } = operation;
            delay(delayMs)
                .then(() => {
                return graphql({
                    schema,
                    source: print(query),
                    rootValue,
                    contextValue: context,
                    variableValues: variables,
                    operationName
                });
            })
                .then((result) => {
                const onResolved = options.onResolved;
                onResolved && onResolved({
                    operationName,
                    variables,
                    query: print(query),
                    result
                });
                const originalError = result?.errors?.[0].originalError;
                if (originalError) {
                    const { graphQLErrors, networkError } = originalError ?? {};
                    graphQLErrors && observer.next({ errors: graphQLErrors });
                    networkError ? observer.error(networkError.message) : observer.error(originalError.message);
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