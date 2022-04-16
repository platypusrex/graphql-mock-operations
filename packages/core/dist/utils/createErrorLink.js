import { ApolloLink, Observable } from '@apollo/client';
import { delay } from './delay';
import { createGraphQLErrorMessage } from './createGraphQLErrorMessage';
export function createErrorLink(graphQLError) {
    return new ApolloLink(() => {
        return new Observable((observer) => {
            delay(100)
                .then(() => {
                observer.next({
                    // @ts-ignore
                    errors: createGraphQLErrorMessage(graphQLError),
                });
                observer.complete();
            })
                .catch(observer.error.bind(observer));
        });
    });
}
//# sourceMappingURL=createErrorLink.js.map