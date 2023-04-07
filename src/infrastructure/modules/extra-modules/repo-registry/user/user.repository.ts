import {IUserRepo} from "@domain/models/user/user-repo.interface";
import {Inject, Injectable} from "@nestjs/common";
import {InjectModel} from "@nestjs/mongoose";
import EventEmitter2 from "eventemitter2";
import {Model} from "mongoose";
import {DomainPersistenceMappers} from "src/application/di-tokens/domain-persistence-mappers";
import {MongoRepository} from "src/infrastructure/db/mongo-repository";
import {UserMapper} from "./user.mapper";
import {DbUser} from "./user.schema";
import {User} from "@domain/models/user/user";
import {DOMAIN_EVENT_BUS} from "@application/di-tokens/domain-event-bus";

@Injectable()
export class UserRepository
  extends MongoRepository<User, DbUser>
  implements IUserRepo
{
  constructor(
    @InjectModel(DbUser.name) dbModel: Model<DbUser>,
    @Inject(DOMAIN_EVENT_BUS) domainEventBus: EventEmitter2,
    @Inject(DomainPersistenceMappers.User) userMapper: UserMapper
  ) {
    super(dbModel, domainEventBus, userMapper);
  }

  async findOneByIdentity(identity: string) {
    const user = await this.dbModel.findOne({identity});

    return this.mapper.toDomain(user);
  }
}
