import { GraphQLError } from 'graphql';
export function createGraphQLErrorMessage(graphQLError) {
    if (graphQLError) {
        return typeof graphQLError === 'string'
            ? [new GraphQLError(graphQLError)]
            : graphQLError;
    }
    return [new GraphQLError('Unspecified graphql error.')];
}
//# sourceMappingURL=createGraphQLErrorMessage.js.map