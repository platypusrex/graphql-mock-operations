import { ApolloLink, Observable } from '@apollo/client';
export function createLoadingLink() {
    return new ApolloLink(() => {
        return new Observable(() => { });
    });
}
//# sourceMappingURL=createLoadingLink.js.map