import { buildClientSchema } from 'graphql';
import { addMocksToSchema } from '@graphql-tools/mock';
import { ApolloClient, ApolloLink, InMemoryCache } from '@apollo/client';
import { createMockLink } from './createMockLink';
export function createApolloClient({ mocks, cacheOptions = {}, clientOptions = {}, links = () => [], }) {
    const { resolvers, introspectionResult, rootValue, context, delay, onResolved, } = mocks;
    const schema = buildClientSchema(introspectionResult);
    const mockOptions = {
        schema,
        resolvers,
        // preserveResolvers: false,
    };
    const schemaWithMocks = addMocksToSchema(mockOptions);
    const apolloLinkOptions = {};
    if (delay)
        apolloLinkOptions.delay = delay;
    if (onResolved)
        apolloLinkOptions.onResolved = onResolved;
    const mockLink = createMockLink(schemaWithMocks, rootValue, context, apolloLinkOptions);
    const cache = new InMemoryCache({ ...cacheOptions, addTypename: true });
    return new ApolloClient({
        cache,
        link: ApolloLink.from([...links(cache), mockLink]),
        ...clientOptions,
    });
}
//# sourceMappingURL=createApolloClient.js.map