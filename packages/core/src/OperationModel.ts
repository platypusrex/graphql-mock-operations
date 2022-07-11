import deepmerge from 'deepmerge';
import type {
  GraphQLErrors,
  NetworkError,
  NonEmptyArray,
  OperationLoading,
  OperationType,
} from './types';

export type ResolverReturn<T> = T extends
  | GraphQLErrors
  | NetworkError
  | OperationLoading
  | Promise<any>
  ? never
  : NonNullable<T>;

export class OperationModel<TModel extends OperationType<any, any>> {
  private _models: ResolverReturn<ReturnType<TModel[keyof TModel]>>[];
  constructor(models: NonEmptyArray<ResolverReturn<ReturnType<TModel[keyof TModel]>>>) {
    this._models = models;
  }

  get models(): ResolverReturn<ReturnType<TModel[keyof TModel]>>[] {
    return this._models;
  }

  findOne = (
    key: keyof Omit<ResolverReturn<ReturnType<TModel[keyof TModel]>>, '__typename'>,
    value: ResolverReturn<ReturnType<TModel[keyof TModel]>>[keyof ResolverReturn<
      ReturnType<TModel[keyof TModel]>
    >]
  ): ResolverReturn<ReturnType<TModel[keyof TModel]>> | null =>
    this._models.find((model) => model[key] === value) ?? null;

  findFirst = (): ResolverReturn<ReturnType<TModel[keyof TModel]>> => {
    const [firstModel] = this._models;
    return firstModel;
  };

  findLast = (): ResolverReturn<ReturnType<TModel[keyof TModel]>> =>
    this._models[this._models?.length - 1];

  create = (
    model: ResolverReturn<ReturnType<TModel[keyof TModel]>>
  ): ResolverReturn<ReturnType<TModel[keyof TModel]>> => {
    this._models = [...this._models, model];
    return model;
  };

  update = (
    key: keyof Omit<ResolverReturn<ReturnType<TModel[keyof TModel]>>, '__typename'>,
    value: ResolverReturn<ReturnType<TModel[keyof TModel]>>[keyof ResolverReturn<
      ReturnType<TModel[keyof TModel]>
    >],
    data: Partial<ResolverReturn<ReturnType<TModel[keyof TModel]>>>
  ): ResolverReturn<ReturnType<TModel[keyof TModel]>> => {
    const models = this._models.filter((model) => model[key] === value);
    if (models?.length > 1) {
      // eslint-disable-next-line no-console
      console.warn(
        'update model: more than one model found. Please provide a unique key/value pair for improved results.'
      );
    }

    if (models?.length === 0) {
      throw new Error('update model: model not found. Please provide a unique key/value pair.');
    }

    let model = models[0];
    model = deepmerge(model, data);
    this._models.map((m) => (m[key] === value ? model : m));
    return model;
  };

  delete = (
    key: keyof Omit<ResolverReturn<ReturnType<TModel[keyof TModel]>>, '__typename'>,
    value: ResolverReturn<ReturnType<TModel[keyof TModel]>>[keyof ResolverReturn<
      ReturnType<TModel[keyof TModel]>
    >]
  ): ResolverReturn<ReturnType<TModel[keyof TModel]>> => {
    const model = this._models.find((m) => m[key] === value);
    if (!model) {
      throw new Error('Delete model: model not found. Please provide a unique key/value pair.');
    }

    this._models = this._models.filter((m) => m[key] !== value);
    return model;
  };
}
