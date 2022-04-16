import { RawDocumentsConfig, AvoidOptionalsConfig } from '@graphql-codegen/visitor-plugin-common';
export interface TypeScriptDocumentsPluginConfig extends RawDocumentsConfig {
    arrayInputCoercion?: boolean;
    avoidOptionals?: boolean | AvoidOptionalsConfig;
    immutableTypes?: boolean;
    flattenGeneratedTypes?: boolean;
    flattenGeneratedTypesIncludeFragments?: boolean;
    noExport?: boolean;
    globalNamespace?: boolean;
    addOperationExport?: boolean;
    maybeValue?: string;
}
