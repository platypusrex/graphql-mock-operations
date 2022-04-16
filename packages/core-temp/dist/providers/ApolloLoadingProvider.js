import { jsx as _jsx } from "react/jsx-runtime";
import { useMemo } from 'react';
import { ApolloClient, ApolloProvider, InMemoryCache } from '@apollo/client';
import { createLoadingLink } from '../utils';
export const ApolloLoadingProvider = ({ Provider = ApolloProvider, children, }) => {
    const client = useMemo(() => {
        return new ApolloClient({ link: createLoadingLink(), cache: new InMemoryCache() });
    }, []);
    return _jsx(Provider, { client: client, children: children });
};
//# sourceMappingURL=ApolloLoadingProvider.js.map