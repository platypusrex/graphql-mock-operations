"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TypeScriptDocumentsVisitor = void 0;
const visitor_plugin_common_1 = require("@graphql-codegen/visitor-plugin-common");
const graphql_1 = require("graphql");
const set_selection_set_to_object_1 = require("./set-selection-set-to-object");
const ts_operation_variables_to_object_1 = require("./ts-operation-variables-to-object");
const ts_selection_set_processor_1 = require("./ts-selection-set-processor");
function getRootType(operation, schema) {
    switch (operation) {
        case 'query':
            return schema.getQueryType();
        case 'mutation':
            return schema.getMutationType();
        case 'subscription':
            return schema.getSubscriptionType();
    }
    throw new Error(`Unknown operation type: ${operation}`);
}
class TypeScriptDocumentsVisitor extends visitor_plugin_common_1.BaseDocumentsVisitor {
    constructor(schema, config, allFragments) {
        super(config, {
            arrayInputCoercion: (0, visitor_plugin_common_1.getConfigValue)(config.arrayInputCoercion, true),
            noExport: (0, visitor_plugin_common_1.getConfigValue)(config.noExport, false),
            avoidOptionals: (0, visitor_plugin_common_1.normalizeAvoidOptionals)((0, visitor_plugin_common_1.getConfigValue)(config.avoidOptionals, false)),
            immutableTypes: (0, visitor_plugin_common_1.getConfigValue)(config.immutableTypes, false),
            nonOptionalTypename: (0, visitor_plugin_common_1.getConfigValue)(config.nonOptionalTypename, false),
            preResolveTypes: (0, visitor_plugin_common_1.getConfigValue)(config.preResolveTypes, true),
        }, schema);
        const preResolveTypes = (0, visitor_plugin_common_1.getConfigValue)(config.preResolveTypes, true);
        const defaultMaybeValue = 'T | null';
        const maybeValue = (0, visitor_plugin_common_1.getConfigValue)(config.maybeValue, defaultMaybeValue);
        const wrapOptional = (type) => {
            if (preResolveTypes === true) {
                return maybeValue.replace('T', type);
            }
            const prefix = this.config.namespacedImportName ? `${this.config.namespacedImportName}.` : '';
            return `${prefix}Maybe<${type}>`;
        };
        const wrapArray = (type) => {
            const listModifier = this.config.immutableTypes ? 'ReadonlyArray' : 'Array';
            return `${listModifier}<${type}>`;
        };
        const formatNamedField = (name, type, isConditional = false) => {
            const optional = isConditional || (!this.config.avoidOptionals.field && !!type && !(0, graphql_1.isNonNullType)(type));
            return (this.config.immutableTypes ? `readonly ${name}` : name) + (optional ? '?' : '');
        };
        const processorConfig = {
            namespacedImportName: this.config.namespacedImportName,
            convertName: this.convertName.bind(this),
            enumPrefix: this.config.enumPrefix,
            scalars: this.scalars,
            formatNamedField,
            wrapTypeWithModifiers(baseType, type) {
                return (0, visitor_plugin_common_1.wrapTypeWithModifiers)(baseType, type, { wrapOptional, wrapArray });
            },
            avoidOptionals: this.config.avoidOptionals,
        };
        const processor = new (preResolveTypes ? visitor_plugin_common_1.PreResolveTypesProcessor : ts_selection_set_processor_1.TypeScriptSelectionSetProcessor)(processorConfig);
        this.setSelectionSetHandler(new set_selection_set_to_object_1.SelectionSetToObject(processor, this.scalars, this.schema, this.convertName.bind(this), this.getFragmentSuffix.bind(this), allFragments, this.config));
        const enumsNames = Object.keys(schema.getTypeMap()).filter(typeName => (0, graphql_1.isEnumType)(schema.getType(typeName)));
        this.setVariablesTransformer(new ts_operation_variables_to_object_1.TypeScriptOperationVariablesToObject(this.scalars, this.convertName.bind(this), !!this.config.avoidOptionals.object, this.config.immutableTypes, this.config.namespacedImportName, enumsNames, this.config.enumPrefix, this.config.enumValues, this.config.arrayInputCoercion, undefined, 'InputMaybe'));
        this._declarationBlockConfig = {
            ignoreExport: this.config.noExport,
        };
    }
    getImports = () => {
        return !this.config.globalNamespace && this.config.inlineFragmentTypes === 'combine'
            ? this.config.fragmentImports.map(fragmentImport => (0, visitor_plugin_common_1.generateFragmentImportStatement)(fragmentImport, 'type'))
            : [];
    };
    getPunctuation = (_declarationKind) => {
        return ';';
    };
    applyVariablesWrapper = (variablesBlock) => {
        const prefix = this.config.namespacedImportName ? `${this.config.namespacedImportName}.` : '';
        return `${prefix}Exact<${variablesBlock === '{}' ? `{ [key: string]: never; }` : variablesBlock}>`;
    };
    internalHandleAnonymousOperation = (node) => {
        const name = node.name && node.name.value;
        if (name) {
            return this.convertName(name, {
                useTypesPrefix: false,
                useTypesSuffix: false,
            });
        }
        return this.convertName(this._unnamedCounter++ + '', {
            prefix: 'Unnamed_',
            suffix: '_',
            useTypesPrefix: false,
            useTypesSuffix: false,
        });
    };
    getOperationArgsDefinition = (node, name, suffix) => {
        const visitedOperationVariables = this._variablesTransfomer.transform(node.variableDefinitions);
        const operationArgsString = this.convertName(name, {
            suffix: suffix + 'Args',
        });
        return {
            name: operationArgsString,
            result: new visitor_plugin_common_1.DeclarationBlock({
                ...this._declarationBlockConfig,
                blockTransformer: t => this.applyVariablesWrapper(t),
            })
                .export()
                .asKind('type')
                .withName(operationArgsString)
                .withBlock(visitedOperationVariables).string
        };
    };
    getOperationResultDefinition = (selectionSetObject, name, suffix) => {
        const operationResultName = this.convertName(name, {
            suffix: suffix + 'Result',
        });
        const operationResultString = `\t${selectionSetObject.name.replace('?', '')}: ${selectionSetObject.type}`;
        return {
            name: operationResultName,
            result: new visitor_plugin_common_1.DeclarationBlock(this._declarationBlockConfig)
                .export()
                .asKind('type')
                .withName(operationResultName)
                .withBlock(operationResultString).string
        };
    };
    getOperationFunctionDefinition = (selectionSetObject, name, type, args) => {
        const content = `ResolverType<${type}, ${args}>`;
        const operationFunctionName = this.convertName(name, {
            suffix: 'MockOperation',
        });
        return {
            operation: {
                kind: selectionSetObject.operationKind,
                name: operationFunctionName,
            },
            result: new visitor_plugin_common_1.DeclarationBlock(this._declarationBlockConfig)
                .export()
                .asKind('type')
                .withName(operationFunctionName)
                .withContent(content).string
        };
    };
    getCombinedOperationsDefinition = (operations) => {
        const queryOperations = operations.filter(op => op.kind === 'Query');
        const mutationOperations = operations.filter(op => op.kind === 'Mutation');
        const queryContent = queryOperations.map(op => op.name).join('\n\t & ');
        const mutationContent = mutationOperations.map(op => op.name).join('\n\t & ');
        const queryDefinitions = new visitor_plugin_common_1.DeclarationBlock(this._declarationBlockConfig)
            .export()
            .asKind('type')
            .withName('QueryMockOperations')
            .withContent(queryContent).string;
        const mutationDefinitions = new visitor_plugin_common_1.DeclarationBlock(this._declarationBlockConfig)
            .export()
            .asKind('type')
            .withName('MutationMockOperations')
            .withContent(mutationContent).string;
        const combinedQueryContent = '{\n\tQuery: Partial<QueryMockOperations>;\n\tMutation: Partial<MutationMockOperations>;\n}';
        const combinedDefinitions = new visitor_plugin_common_1.DeclarationBlock(this._declarationBlockConfig)
            .export()
            .asKind('type')
            .withName('MockOperations')
            .withContent(combinedQueryContent).string;
        return [queryDefinitions, mutationDefinitions, combinedDefinitions];
    };
    getOperationDefinition = (nodes) => {
        return nodes.map(node => {
            const operationRootType = getRootType(node.operation, this._schema);
            if (!operationRootType) {
                throw new Error(`Unable to find root schema type for operation type "${node.operation}"!`);
            }
            const selectionSet = this._selectionSetToObject.createNext(operationRootType, node.selectionSet);
            const { transformedSelectionSets } = selectionSet.transformGroupedSelections();
            const selectionSetObject = transformedSelectionSets?.reduce((acc, curr) => {
                let currentKey;
                let currentValue;
                for (const key in curr) {
                    const k = key;
                    if (curr[k] === "'Query'" || curr[k] === "'Mutation'") {
                        currentKey = 'operationKind';
                        currentValue = curr[k].replace(/'/g, '');
                    }
                    else {
                        currentKey = k;
                        currentValue = curr[k];
                    }
                    if (currentValue !== '__typename') {
                        acc[currentKey] = currentValue;
                    }
                }
                return acc;
            }, {});
            const name = this.internalHandleAnonymousOperation(node);
            const defaultSuffix = 'MockOperation';
            const { name: args, result: argsResult } = this.getOperationArgsDefinition(node, name, defaultSuffix);
            const { name: type, result: typeResult } = this.getOperationResultDefinition(selectionSetObject, name, defaultSuffix);
            const { result: operationFunction, operation } = this.getOperationFunctionDefinition(selectionSetObject, name, type, args);
            return {
                operation,
                definition: [argsResult, typeResult, operationFunction].join('\n')
            };
        });
    };
}
exports.TypeScriptDocumentsVisitor = TypeScriptDocumentsVisitor;
//# sourceMappingURL=visitor.js.map