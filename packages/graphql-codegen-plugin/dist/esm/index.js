import { oldVisit } from '@graphql-codegen/plugin-helpers';
import { optimizeOperations } from '@graphql-codegen/visitor-plugin-common';
import { concatAST, Kind } from 'graphql';
import { TypeScriptDocumentsVisitor } from './visitor';
export const plugin = (schema, rawDocuments, config) => {
    const documents = config.flattenGeneratedTypes
        ? optimizeOperations(schema, rawDocuments, {
            includeFragments: !!config.flattenGeneratedTypesIncludeFragments,
        })
        : rawDocuments;
    const allAst = concatAST(documents.map(v => v.document));
    const allFragments = [
        ...allAst.definitions.filter(d => d.kind === Kind.FRAGMENT_DEFINITION).map(fragmentDef => ({
            node: fragmentDef,
            name: fragmentDef.name.value,
            onType: fragmentDef.typeCondition.name.value,
            isExternal: false,
        })),
        ...(config.externalFragments || []),
    ];
    const visitor = new TypeScriptDocumentsVisitor(schema, config, allFragments);
    const operationNodes = allAst.definitions
        .filter(d => d.kind === 'OperationDefinition');
    const definitions = visitor.getOperationDefinition(operationNodes);
    const operationDefinitions = definitions.map(def => def.definition);
    const operationObjectArr = definitions.map(def => def.operation);
    const combinedOperationDefinitions = visitor.getCombinedOperationsDefinition(operationObjectArr);
    const visitorResult = oldVisit(allAst, {
        leave: visitor,
    });
    let content = visitorResult.definitions.join('\n');
    if (config.addOperationExport) {
        const exportConsts = [];
        allAst.definitions.forEach(d => {
            if ('name' in d) {
                exportConsts.push(`export declare const ${d.name?.value}: import("graphql").DocumentNode;`);
            }
        });
        content = visitorResult.definitions.concat(exportConsts).join('\n');
    }
    if (config.globalNamespace) {
        content = `
    declare global {
      ${content}
    }`;
    }
    const imports = `import { GraphQLError, GraphQLResolveInfo } from 'graphql';`;
    const headers = `
export type GraphQLErrors = { graphQLErrors?: GraphQLError | GraphQLError[] };
export type NetworkError = { networkError?: Error };
export type OperationLoading = { loading?: boolean };
export type ResolverFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => Promise<TResult> | TResult | GraphQLErrors | NetworkError | OperationLoading;

type ResolverType<TResult, TArgs> = Record<keyof TResult, ResolverFn<TResult[keyof TResult], {}, {}, TArgs>>;  
  `;
    return {
        prepend: [imports, ...visitor.getImports(), ...visitor.getGlobalDeclarations(visitor.config.noExport)],
        content: [
            headers,
            ...operationDefinitions,
            ...combinedOperationDefinitions,
        ].join('\n'),
    };
};
export { TypeScriptDocumentsVisitor };
//# sourceMappingURL=index.js.map