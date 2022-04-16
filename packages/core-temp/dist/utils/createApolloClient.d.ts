import { ApolloClient, ApolloClientOptions, ApolloLink, InMemoryCache, InMemoryCacheConfig, NormalizedCacheObject } from '@apollo/client';
import { LinkSchemaProps } from '../types';
export interface CreateApolloClient {
    mocks: LinkSchemaProps;
    cacheOptions?: Omit<InMemoryCacheConfig, 'addTypename'>;
    clientOptions?: Omit<ApolloClientOptions<NormalizedCacheObject>, 'cache'>;
    links?: (cache?: InMemoryCache) => ApolloLink[];
}
export declare function createApolloClient({ mocks, cacheOptions, clientOptions, links, }: CreateApolloClient): ApolloClient<NormalizedCacheObject>;
