import { SelectionNode, GraphQLObjectType, DirectiveNode, GraphQLNamedType, SelectionSetNode, GraphQLSchema } from 'graphql';
import { BaseSelectionSetProcessor, BaseVisitorConvertOptions, ConvertNameFn, GetFragmentSuffixFn, LoadedFragment, NameAndType, NormalizedScalarsMap, ParsedDocumentsConfig, ProcessResult, SelectionSetToObject as CodegenSelectionSetToObject } from '@graphql-codegen/visitor-plugin-common';
declare type FragmentSpreadUsage = {
    fragmentName: string;
    typeName: string;
    onType: string;
    selectionNodes: Array<SelectionNode>;
};
export declare class SelectionSetToObject extends CodegenSelectionSetToObject {
    protected _processor: BaseSelectionSetProcessor<any>;
    protected _scalars: NormalizedScalarsMap;
    protected _schema: GraphQLSchema;
    protected _convertName: ConvertNameFn<BaseVisitorConvertOptions>;
    protected _getFragmentSuffix: GetFragmentSuffixFn;
    protected _loadedFragments: LoadedFragment[];
    protected _config: ParsedDocumentsConfig;
    protected _parentSchemaType?: GraphQLNamedType | undefined;
    protected _selectionSet?: SelectionSetNode | undefined;
    constructor(_processor: BaseSelectionSetProcessor<any>, _scalars: NormalizedScalarsMap, _schema: GraphQLSchema, _convertName: ConvertNameFn<BaseVisitorConvertOptions>, _getFragmentSuffix: GetFragmentSuffixFn, _loadedFragments: LoadedFragment[], _config: ParsedDocumentsConfig, _parentSchemaType?: GraphQLNamedType | undefined, _selectionSet?: SelectionSetNode | undefined);
    createNext(parentSchemaType: GraphQLNamedType, selectionSet: SelectionSetNode): SelectionSetToObject;
    protected _buildGroupedSelections(): {
        grouped: Record<string, string[]>;
        mustAddEmptyObject: boolean;
        transformedSelectionSets: ProcessResult;
    };
    protected _buildSelectionSetObject(parentSchemaType: GraphQLObjectType, selectionNodes: Array<SelectionNode | FragmentSpreadUsage | DirectiveNode>): {
        typeString: string;
        transformed: (string | NameAndType)[];
    };
    transformGroupedSelections(): {
        grouped: Record<string, string[]>;
        mustAddEmptyObject: boolean;
        transformedSelectionSets: ProcessResult;
    };
}
export {};
