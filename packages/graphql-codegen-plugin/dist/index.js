"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TypeScriptDocumentsVisitor = exports.plugin = void 0;
const plugin_helpers_1 = require("@graphql-codegen/plugin-helpers");
const visitor_plugin_common_1 = require("@graphql-codegen/visitor-plugin-common");
const graphql_1 = require("graphql");
const visitor_1 = require("./visitor");
Object.defineProperty(exports, "TypeScriptDocumentsVisitor", { enumerable: true, get: function () { return visitor_1.TypeScriptDocumentsVisitor; } });
const plugin = (schema, rawDocuments, config) => {
    const documents = config.flattenGeneratedTypes
        ? (0, visitor_plugin_common_1.optimizeOperations)(schema, rawDocuments, {
            includeFragments: !!config.flattenGeneratedTypesIncludeFragments,
        })
        : rawDocuments;
    const allAst = (0, graphql_1.concatAST)(documents.map(v => v.document));
    const allFragments = [
        ...allAst.definitions.filter(d => d.kind === graphql_1.Kind.FRAGMENT_DEFINITION).map(fragmentDef => ({
            node: fragmentDef,
            name: fragmentDef.name.value,
            onType: fragmentDef.typeCondition.name.value,
            isExternal: false,
        })),
        ...(config.externalFragments || []),
    ];
    const visitor = new visitor_1.TypeScriptDocumentsVisitor(schema, config, allFragments);
    const operationNodes = allAst.definitions
        .filter(d => d.kind === 'OperationDefinition');
    const definitions = visitor.getOperationDefinition(operationNodes);
    const operationDefinitions = definitions.map(def => def.definition);
    const operationObjectArr = definitions.map(def => def.operation);
    const combinedOperationDefinitions = visitor.getCombinedOperationsDefinition(operationObjectArr);
    const visitorResult = (0, plugin_helpers_1.oldVisit)(allAst, {
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
exports.plugin = plugin;
//# sourceMappingURL=index.js.map