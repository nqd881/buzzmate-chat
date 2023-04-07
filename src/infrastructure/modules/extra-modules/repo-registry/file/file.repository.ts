import {DOMAIN_EVENT_BUS} from "@application/di-tokens/domain-event-bus";
import {DomainPersistenceMappers} from "@application/di-tokens/domain-persistence-mappers";
import {File} from "@domain/models/file/file";
import {UserId} from "@domain/models/user/user";
import {IFileRepo} from "@domain/models/file/file-repo.interface";
import {MongoRepository} from "@infrastructure/db/mongo-repository";
import {Inject, Injectable} from "@nestjs/common";
import {InjectModel} from "@nestjs/mongoose";
import EventEmitter2 from "eventemitter2";
import {Model} from "mongoose";
import {FileMapper} from "./file.mapper";
import {DbFile} from "./file.schema";

@Injectable()
export class FileRepository
  extends MongoRepository<File, DbFile>
  implements IFileRepo
{
  constructor(
    @InjectModel(DbFile.name) dbModel: Model<DbFile>,
    @Inject(DOMAIN_EVENT_BUS) domainEventBus: EventEmitter2,
    @Inject(DomainPersistenceMappers.File) mapper: FileMapper
  ) {
    super(dbModel, domainEventBus, mapper);
  }

  async findOneByUserId(userId: UserId) {
    const chatOwner = await this.dbModel.findOne({
      userId: userId.value,
    });

    return this.mapper.toDomain(chatOwner);
  }
}
