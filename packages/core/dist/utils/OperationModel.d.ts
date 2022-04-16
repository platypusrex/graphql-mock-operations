export declare class OperationModel<TModel extends Record<string, any>> {
    private _models;
    constructor(models: TModel[]);
    get models(): TModel[];
    getOne: (key: keyof Omit<TModel, '__typename'>, value: TModel[keyof TModel]) => NonNullable<TModel> | null;
    create: (model: TModel) => TModel;
    add: (model: TModel) => void;
    delete: (key: keyof Omit<TModel, '__typename'>, value: TModel[keyof TModel]) => TModel;
}
