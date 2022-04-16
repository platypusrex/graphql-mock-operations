import { isObjectType, isUnionType, SchemaMetaFieldDef, TypeMetaFieldDef, } from 'graphql';
import { getFieldNodeNameValue, getPossibleTypes, hasConditionalDirectives, mergeSelectionSets, SelectionSetToObject as CodegenSelectionSetToObject } from '@graphql-codegen/visitor-plugin-common';
import { getBaseType } from '@graphql-codegen/plugin-helpers';
function isMetadataFieldName(name) {
    return ['__schema', '__type'].includes(name);
}
const metadataFieldMap = {
    __schema: SchemaMetaFieldDef,
    __type: TypeMetaFieldDef,
};
export class SelectionSetToObject extends CodegenSelectionSetToObject {
    _processor;
    _scalars;
    _schema;
    _convertName;
    _getFragmentSuffix;
    _loadedFragments;
    _config;
    _parentSchemaType;
    _selectionSet;
    constructor(_processor, _scalars, _schema, _convertName, _getFragmentSuffix, _loadedFragments, _config, _parentSchemaType, _selectionSet) {
        super(_processor, _scalars, _schema, _convertName, _getFragmentSuffix, _loadedFragments, _config, _parentSchemaType, _selectionSet);
        this._processor = _processor;
        this._scalars = _scalars;
        this._schema = _schema;
        this._convertName = _convertName;
        this._getFragmentSuffix = _getFragmentSuffix;
        this._loadedFragments = _loadedFragments;
        this._config = _config;
        this._parentSchemaType = _parentSchemaType;
        this._selectionSet = _selectionSet;
    }
    createNext(parentSchemaType, selectionSet) {
        return new SelectionSetToObject(this._processor, this._scalars, this._schema, this._convertName.bind(this), this._getFragmentSuffix.bind(this), this._loadedFragments, this._config, parentSchemaType, selectionSet);
    }
    _buildGroupedSelections() {
        if (!this._selectionSet || !this._selectionSet.selections || this._selectionSet.selections.length === 0) {
            return { grouped: {}, mustAddEmptyObject: true, transformedSelectionSets: [] };
        }
        const selectionNodesByTypeName = this.flattenSelectionSet(this._selectionSet.selections);
        let mustAddEmptyObject = false;
        let transformedSelectionSets = [];
        const grouped = getPossibleTypes(this._schema, this._parentSchemaType).reduce((prev, type) => {
            const typeName = type.name;
            const schemaType = this._schema.getType(typeName);
            if (!isObjectType(schemaType)) {
                throw new TypeError(`Invalid state! Schema type ${typeName} is not a valid GraphQL object!`);
            }
            const selectionNodes = selectionNodesByTypeName.get(typeName) || [];
            if (!prev[typeName]) {
                prev[typeName] = [];
            }
            const { typeString, transformed } = this._buildSelectionSetObject(schemaType, selectionNodes);
            if (transformed) {
                transformedSelectionSets = transformed;
            }
            if (typeString) {
                prev[typeName].push(typeString);
            }
            else {
                mustAddEmptyObject = true;
            }
            return prev;
        }, {});
        return { grouped, mustAddEmptyObject, transformedSelectionSets };
    }
    _buildSelectionSetObject(parentSchemaType, selectionNodes) {
        const primitiveFields = new Map();
        const primitiveAliasFields = new Map();
        const linkFieldSelectionSets = new Map();
        let requireTypename = false;
        const fragmentsSpreadUsages = [];
        selectionNodes = [...selectionNodes];
        let inlineFragmentConditional = false;
        for (const selectionNode of selectionNodes) {
            if ('kind' in selectionNode) {
                if (selectionNode.kind === 'Field') {
                    if (!selectionNode.selectionSet) {
                        if (selectionNode.alias) {
                            primitiveAliasFields.set(selectionNode.alias.value, selectionNode);
                        }
                        else if (selectionNode.name.value === '__typename') {
                            requireTypename = true;
                        }
                        else {
                            primitiveFields.set(selectionNode.name.value, selectionNode);
                        }
                    }
                    else {
                        let selectedField = null;
                        const fields = parentSchemaType.getFields();
                        selectedField = fields[selectionNode.name.value];
                        if (isMetadataFieldName(selectionNode.name.value)) {
                            selectedField = metadataFieldMap[selectionNode.name.value];
                        }
                        if (!selectedField) {
                            continue;
                        }
                        const fieldName = getFieldNodeNameValue(selectionNode);
                        let linkFieldNode = linkFieldSelectionSets.get(fieldName);
                        if (!linkFieldNode) {
                            linkFieldNode = {
                                selectedFieldType: selectedField.type,
                                field: selectionNode,
                            };
                        }
                        else {
                            linkFieldNode = {
                                ...linkFieldNode,
                                field: {
                                    ...linkFieldNode.field,
                                    selectionSet: mergeSelectionSets(linkFieldNode.field.selectionSet, selectionNode.selectionSet),
                                },
                            };
                        }
                        linkFieldSelectionSets.set(fieldName, linkFieldNode);
                    }
                }
                else if (selectionNode.kind === 'Directive') {
                    if (['skip', 'include'].includes(selectionNode?.name?.value)) {
                        inlineFragmentConditional = true;
                    }
                }
                else {
                    throw new TypeError('Unexpected type.');
                }
                continue;
            }
            if (this._config.inlineFragmentTypes === 'combine') {
                fragmentsSpreadUsages.push(selectionNode.typeName);
                continue;
            }
            const fragmentType = this._schema.getType(selectionNode.onType);
            if (fragmentType == null) {
                throw new TypeError(`Unexpected error: Type ${selectionNode.onType} does not exist within schema.`);
            }
            if (parentSchemaType.name === selectionNode.onType ||
                parentSchemaType.getInterfaces().find(iinterface => iinterface.name === selectionNode.onType) != null ||
                (isUnionType(fragmentType) &&
                    fragmentType.getTypes().find(objectType => objectType.name === parentSchemaType.name))) {
                const flatten = this.flattenSelectionSet(selectionNode.selectionNodes);
                const typeNodes = flatten.get(parentSchemaType.name) ?? [];
                selectionNodes.push(...typeNodes);
                for (const iinterface of parentSchemaType.getInterfaces()) {
                    const typeNodes = flatten.get(iinterface.name) ?? [];
                    selectionNodes.push(...typeNodes);
                }
            }
        }
        const linkFields = [];
        for (const { field, selectedFieldType } of linkFieldSelectionSets.values()) {
            const realSelectedFieldType = getBaseType(selectedFieldType);
            const selectionSet = this.createNext(realSelectedFieldType, field.selectionSet);
            const isConditional = hasConditionalDirectives(field) || inlineFragmentConditional;
            linkFields.push({
                alias: field.alias ? this._processor.config.formatNamedField(field.alias.value, selectedFieldType) : undefined,
                name: this._processor.config.formatNamedField(field.name.value, selectedFieldType, isConditional),
                type: realSelectedFieldType.name,
                selectionSet: this._processor.config.wrapTypeWithModifiers(selectionSet.transformSelectionSet().split(`\n`).join(`\n  `), selectedFieldType),
            });
        }
        const typeInfoField = this.buildTypeNameField(parentSchemaType, this._config.nonOptionalTypename, this._config.addTypename, requireTypename, this._config.skipTypeNameForRoot);
        const transformed = [
            ...(typeInfoField ? this._processor.transformTypenameField(typeInfoField.type, typeInfoField.name) : []),
            ...this._processor.transformPrimitiveFields(parentSchemaType, Array.from(primitiveFields.values()).map(field => ({
                isConditional: hasConditionalDirectives(field),
                fieldName: field.name.value,
            }))),
            ...this._processor.transformAliasesPrimitiveFields(parentSchemaType, Array.from(primitiveAliasFields.values()).map(field => ({
                alias: field.alias.value,
                fieldName: field.name.value,
            }))),
            ...this._processor.transformLinkFields(linkFields),
        ].filter(Boolean);
        const allStrings = transformed.filter(t => typeof t === 'string');
        const allObjectsMerged = transformed
            .filter(t => typeof t !== 'string')
            .map((t) => `${t.name}: ${t.type}`);
        let mergedObjectsAsString = null;
        if (allObjectsMerged.length > 0) {
            mergedObjectsAsString = this._processor.buildFieldsIntoObject(allObjectsMerged);
        }
        const fields = [...allStrings, mergedObjectsAsString, ...fragmentsSpreadUsages].filter(Boolean);
        return { typeString: this._processor.buildSelectionSetFromStrings(fields), transformed };
    }
    transformGroupedSelections() {
        return this._buildGroupedSelections();
    }
}
//# sourceMappingURL=set-selection-set-to-object.js.map