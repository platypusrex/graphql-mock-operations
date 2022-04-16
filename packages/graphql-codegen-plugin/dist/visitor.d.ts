import { AvoidOptionalsConfig, BaseDocumentsVisitor, DeclarationKind, LoadedFragment, NameAndType, ParsedDocumentsConfig } from '@graphql-codegen/visitor-plugin-common';
import { GraphQLSchema, OperationDefinitionNode } from 'graphql';
import { TypeScriptDocumentsPluginConfig } from './config';
declare type SelectionSetObject = Record<keyof NameAndType | 'operationKind', string>;
export interface TypeScriptDocumentsParsedConfig extends ParsedDocumentsConfig {
    arrayInputCoercion: boolean;
    avoidOptionals: AvoidOptionalsConfig;
    immutableTypes: boolean;
    noExport: boolean;
    maybeValue: string;
}
export declare class TypeScriptDocumentsVisitor extends BaseDocumentsVisitor<TypeScriptDocumentsPluginConfig, TypeScriptDocumentsParsedConfig> {
    constructor(schema: GraphQLSchema, config: TypeScriptDocumentsPluginConfig, allFragments: LoadedFragment[]);
    getImports: () => Array<string>;
    protected getPunctuation: (_declarationKind: DeclarationKind) => string;
    protected applyVariablesWrapper: (variablesBlock: string) => string;
    private internalHandleAnonymousOperation;
    private getOperationArgsDefinition;
    private getOperationResultDefinition;
    getOperationFunctionDefinition: (selectionSetObject: SelectionSetObject, name: string, type: string, args: string) => {
        operation: {
            kind: string;
            name: string;
        };
        result: string;
    };
    getCombinedOperationsDefinition: (operations: {
        kind: string;
        name: string;
    }[]) => string[];
    getOperationDefinition: (nodes: OperationDefinitionNode[]) => {
        operation: {
            kind: string;
            name: string;
        };
        definition: string;
    }[];
}
export {};
