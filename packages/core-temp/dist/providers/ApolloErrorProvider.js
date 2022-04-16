import { jsx as _jsx } from "react/jsx-runtime";
import { useMemo } from 'react';
import { ApolloClient, ApolloProvider, InMemoryCache } from '@apollo/client';
import { createErrorLink } from '../utils';
export const ApolloErrorProvider = ({ children, graphQLError, Provider = ApolloProvider, }) => {
    const client = useMemo(() => {
        return new ApolloClient({
            link: createErrorLink(graphQLError),
            cache: new InMemoryCache(),
        });
    }, [graphQLError]);
    return _jsx(Provider, { client: client, children: children });
};
//# sourceMappingURL=ApolloErrorProvider.js.map