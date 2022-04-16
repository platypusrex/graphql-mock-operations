import { GraphQLError } from 'graphql';
export function createGraphQLErrorMessage(graphQLError) {
    if (graphQLError) {
        return typeof graphQLError === 'string'
            ? [new GraphQLError(graphQLError)]
            : graphQLError;
    }
    return [new GraphQLError('Unspecified error from ErrorProvider.')];
}
//# sourceMappingURL=createGraphQLErrorMessage.js.map