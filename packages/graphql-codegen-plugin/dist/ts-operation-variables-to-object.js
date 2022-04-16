"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TypeScriptOperationVariablesToObject = void 0;
const visitor_plugin_common_1 = require("@graphql-codegen/visitor-plugin-common");
const graphql_1 = require("graphql");
class TypeScriptOperationVariablesToObject extends visitor_plugin_common_1.OperationVariablesToObject {
    _avoidOptionals;
    _immutableTypes;
    _maybeType;
    constructor(_scalars, _convertName, _avoidOptionals, _immutableTypes, _namespacedImportName = null, _enumNames = [], _enumPrefix = true, _enumValues = {}, _applyCoercion = false, _directiveArgumentAndInputFieldMappings = {}, _maybeType = 'Maybe') {
        super(_scalars, _convertName, _namespacedImportName, _enumNames, _enumPrefix, _enumValues, _applyCoercion, _directiveArgumentAndInputFieldMappings);
        this._avoidOptionals = _avoidOptionals;
        this._immutableTypes = _immutableTypes;
        this._maybeType = _maybeType;
    }
    clearOptional(str) {
        const prefix = this._namespacedImportName ? `${this._namespacedImportName}.` : '';
        const rgx = new RegExp(`^${this.wrapMaybe(`(.*?)`)}$`, 'i');
        if (str.startsWith(`${prefix}${this._maybeType}`)) {
            return str.replace(rgx, '$1');
        }
        return str;
    }
    wrapAstTypeWithModifiers(baseType, typeNode, applyCoercion = false) {
        if (typeNode.kind === graphql_1.Kind.NON_NULL_TYPE) {
            const type = this.wrapAstTypeWithModifiers(baseType, typeNode.type, applyCoercion);
            return this.clearOptional(type);
        }
        else if (typeNode.kind === graphql_1.Kind.LIST_TYPE) {
            const innerType = this.wrapAstTypeWithModifiers(baseType, typeNode.type, applyCoercion);
            const listInputCoercionExtension = applyCoercion ? ` | ${innerType}` : '';
            return this.wrapMaybe(`${this._immutableTypes ? 'ReadonlyArray' : 'Array'}<${innerType}>${listInputCoercionExtension}`);
        }
        else {
            return this.wrapMaybe(baseType);
        }
    }
    formatFieldString(fieldName, isNonNullType, hasDefaultValue) {
        return `${fieldName}${this.getAvoidOption(isNonNullType, hasDefaultValue) ? '?' : ''}`;
    }
    wrapMaybe(type) {
        const prefix = this._namespacedImportName ? `${this._namespacedImportName}.` : '';
        return `${prefix}${this._maybeType}${type ? `<${type}>` : ''}`;
    }
    getAvoidOption(isNonNullType, hasDefaultValue) {
        const options = (0, visitor_plugin_common_1.normalizeAvoidOptionals)(this._avoidOptionals);
        return ((options.object || !options.defaultValue) && hasDefaultValue) || (!options.object && !isNonNullType);
    }
    getPunctuation() {
        return ';';
    }
    formatTypeString(fieldType) {
        return fieldType;
    }
    getName(node) {
        if (node.name) {
            if (typeof node.name === 'string') {
                return node.name;
            }
            return node.name.value;
        }
        else if (node.variable) {
            return node.variable.name.value;
        }
        return null;
    }
    transform(variablesNode) {
        if (!variablesNode || variablesNode.length === 0) {
            return null;
        }
        return (variablesNode.map(variable => (0, visitor_plugin_common_1.indent)(this.transformVariable(variable))).join(`${this.getPunctuation()}\n`) +
            this.getPunctuation());
    }
    getScalar(name) {
        const prefix = this._namespacedImportName ? `${this._namespacedImportName}.` : '';
        return `${prefix}Scalars['${name}']`;
    }
    getDirectiveMapping(name) {
        return `DirectiveArgumentAndInputFieldMappings['${name}']`;
    }
    getDirectiveOverrideType(directives) {
        if (!this._directiveArgumentAndInputFieldMappings)
            return null;
        const type = directives
            .map(directive => {
            const directiveName = directive.name.value;
            if (this._directiveArgumentAndInputFieldMappings[directiveName]) {
                return this.getDirectiveMapping(directiveName);
            }
            return null;
        })
            .reverse()
            .find(a => !!a);
        return type || null;
    }
    transformVariable(variable) {
        let typeValue = null;
        const prefix = this._namespacedImportName ? `${this._namespacedImportName}.` : '';
        if (typeof variable.type === 'string') {
            typeValue = variable.type;
        }
        else {
            const baseType = (0, visitor_plugin_common_1.getBaseTypeNode)(variable.type);
            const overrideType = variable.directives ? this.getDirectiveOverrideType(variable.directives) : null;
            const typeName = baseType.name.value;
            if (overrideType) {
                typeValue = overrideType;
            }
            else if (this._scalars[typeName]) {
                typeValue = this.getScalar(typeName);
            }
            else if (this._enumValues[typeName] && this._enumValues[typeName].sourceFile) {
                typeValue = this._enumValues[typeName].typeIdentifier || this._enumValues[typeName].sourceIdentifier;
            }
            else {
                typeValue = `${prefix}${this._convertName(baseType, {
                    useTypesPrefix: this._enumNames.includes(typeName) ? this._enumPrefix : true,
                })}`;
            }
        }
        const fieldName = this.getName(variable);
        const fieldType = this.wrapAstTypeWithModifiers(typeValue, variable.type, !!this._applyCoercion);
        const hasDefaultValue = variable.defaultValue != null && typeof variable.defaultValue !== 'undefined';
        const isNonNullType = variable.type.kind === graphql_1.Kind.NON_NULL_TYPE;
        const formattedFieldString = this.formatFieldString(fieldName, isNonNullType, hasDefaultValue);
        const formattedTypeString = this.formatTypeString(fieldType);
        return `${formattedFieldString}: ${formattedTypeString}`;
    }
}
exports.TypeScriptOperationVariablesToObject = TypeScriptOperationVariablesToObject;
//# sourceMappingURL=ts-operation-variables-to-object.js.map