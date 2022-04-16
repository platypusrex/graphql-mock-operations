export class OperationModel {
    _models;
    constructor(models) {
        this._models = models;
    }
    get models() {
        return this._models;
    }
    getOne = (key, value) => {
        return this._models.find(model => model[key] === value) ?? null;
    };
    create = (model) => {
        this._models = [...this._models, model];
        return model;
    };
    add = (model) => {
        this._models.push(model);
    };
    delete = (key, value) => {
        console.log({ key, value });
        const model = this._models.find(model => model[key] === value);
        console.log({ model });
        if (!model) {
            throw new Error('Delete model: model not found. Please provide a unique key/value pair.');
        }
        this._models = this._models.filter(model => model[key] !== value);
        console.log({ models: this._models });
        return model;
    };
}
//# sourceMappingURL=OperationModel.js.map