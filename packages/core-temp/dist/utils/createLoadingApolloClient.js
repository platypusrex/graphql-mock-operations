import { ApolloClient, InMemoryCache } from '@apollo/client';
import { createLoadingLink } from './createLoadingLink';
export const createLoadingApolloClient = () => new ApolloClient({ link: createLoadingLink(), cache: new InMemoryCache() });
//# sourceMappingURL=createLoadingApolloClient.js.map