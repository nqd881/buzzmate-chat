import { EntityId } from "@libs/ddd";
import { AggregateRoot } from "@libs/ddd/aggregate-root";
import { IDomainPersistenceMapper } from "@libs/ddd/domain-persistence-mapper";
import { IdTypeOfEntity } from "@libs/ddd/extension.type";
import { IRepositoryBase } from "@libs/ddd/repository";
import EventEmitter2 from "eventemitter2";
import { Model } from "mongoose";

export abstract class MongoRepository<
  AR extends AggregateRoot<EntityId, unknown>,
  MongoDoc extends { _id: any }
> implements IRepositoryBase<AR>
{
  constructor(
    protected readonly dbModel: Model<MongoDoc>,
    protected readonly domainEventBus: EventEmitter2,
    protected readonly mapper: IDomainPersistenceMapper<AR, MongoDoc>
  ) {}

  async save(entity: AR) {
    if (!entity.isNew() && !entity.isChanged()) return;

    const doc = this.mapper.toPersistence(entity);

    if (entity.isNew()) {
      await this.dbModel.create(doc);

      entity.publishEvents(this.domainEventBus);

      return;
    }

    if (entity.isChanged()) {
      await this.dbModel.updateOne(
        {
          _id: entity.id.value,
          __version: entity.prevVersion,
        },
        doc
      );

      entity.publishEvents(this.domainEventBus);

      return;
    }
  }

  async batchCreate(entities: AR[]) {
    const newEntities = entities.filter((entity) => entity.isNew());

    const docs = newEntities.map((entity) => this.mapper.toPersistence(entity));

    await this.dbModel.insertMany(docs);

    entities.forEach((entity) => {
      entity.publishEvents(this.domainEventBus);
    });
  }

  async findOneById(id: IdTypeOfEntity<AR>) {
    if (!id) return null;

    const doc = await this.dbModel.findById(id.value);

    return this.mapper.toDomain(doc);
  }

  async findManyById(ids: IdTypeOfEntity<AR>[]) {
    if (!ids) return null;

    const docs = await this.dbModel.find({
      _id: ids.map((id) => id.value),
    });

    return docs.map((doc) => this.mapper.toDomain(doc));
  }

  async findAll() {
    const docs = await this.dbModel.find();

    return docs.map((doc) => this.mapper.toDomain(doc));
  }

  async findAny() {
    const doc = await this.dbModel.findOne();

    return this.mapper.toDomain(doc);
  }

  async delete(entity: AR) {
    try {
      await this.dbModel.findByIdAndDelete(entity.id.value);

      return true;
    } catch (err) {
      return false;
    }
  }

  async transaction<T>(handler: () => Promise<T>) {
    // const session = await this.connection.startSession();
    // session.startTransaction();
  }
}
