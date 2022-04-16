import { jsx as _jsx } from "react/jsx-runtime";
import { useMemo } from 'react';
import { ApolloProvider } from '@apollo/client';
import { createApolloClient } from '../utils';
export const ApolloMockedProvider = ({ children, Provider = ApolloProvider, ...rest }) => {
    const client = useMemo(() => createApolloClient(rest), [rest]);
    return _jsx(Provider, { client: client, children: children });
};
//# sourceMappingURL=ApolloMockProvider.js.map