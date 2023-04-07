import {Entity} from "./entity";

export interface IDomainPersistenceMapper<
  DomainEntity extends Entity<any, unknown>,
  PersistenceModel
> {
  toPersistence(entity: DomainEntity): PersistenceModel;
  toDomain(dbModel: PersistenceModel): DomainEntity;
}
