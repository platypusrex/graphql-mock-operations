import deepmerge from 'deepmerge';
export class OperationModel {
    _models;
    constructor(models) {
        this._models = models;
    }
    get models() {
        return this._models;
    }
    findOne = (key, value) => {
        return this._models.find((model) => model[key] === value) ?? null;
    };
    findFirst = () => {
        const [firstModel] = this._models;
        return firstModel;
    };
    findLast = () => {
        return this._models[this._models.length - 1];
    };
    create = (model) => {
        this._models = [...this._models, model];
        return model;
    };
    update = (key, value, data) => {
        const models = this._models.filter((model) => model[key] === value);
        if (models.length > 1) {
            console.warn('update model: more than one model found. Please provide a unique key/value pair for improved results.');
        }
        if (!models.length) {
            throw new Error('update model: model not found. Please provide a unique key/value pair.');
        }
        let model = models[0];
        model = deepmerge(model, data);
        this._models.map((m) => (m[key] === value ? model : m));
        return model;
    };
    delete = (key, value) => {
        const model = this._models.find((model) => model[key] === value);
        if (!model) {
            throw new Error('Delete model: model not found. Please provide a unique key/value pair.');
        }
        this._models = this._models.filter((model) => model[key] !== value);
        return model;
    };
}
//# sourceMappingURL=OperationModel.js.map