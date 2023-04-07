import { MaybePromise } from "@libs/utilities/types";
import { AggregateRoot } from "./aggregate-root";
import { IdTypeOfEntity } from "./extension.type";

export interface IRepositoryBase<AR extends AggregateRoot<any, unknown>> {
  save(entity: AR): MaybePromise<void>;

  batchCreate(entities: AR[]): MaybePromise<void>;

  findOneById(id: IdTypeOfEntity<AR>): MaybePromise<AR>;
  findManyById(ids: IdTypeOfEntity<AR>[]): MaybePromise<AR[]>;
  findAny(): MaybePromise<AR>;
  findAll(): MaybePromise<AR[]>;
  delete(entity: AR): MaybePromise<boolean>;

  transaction<T>(handler: () => MaybePromise<T>): MaybePromise<any>;
}
