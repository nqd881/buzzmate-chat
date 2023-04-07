import {DomainPersistenceMappers} from "@application/di-tokens/domain-persistence-mappers";
import {Repositories} from "@application/di-tokens/repositories";
import {Module} from "@nestjs/common";
import {MongooseModule} from "@nestjs/mongoose";
import {UserMapper} from "./user.mapper";
import {UserRepository} from "./user.repository";
import {DbUser, DbUserSchema} from "./user.schema";

@Module({
  imports: [
    MongooseModule.forFeature([{name: DbUser.name, schema: DbUserSchema}]),
  ],
  providers: [
    {provide: Repositories.User, useClass: UserRepository},
    {provide: DomainPersistenceMappers.User, useClass: UserMapper},
  ],
  exports: [Repositories.User],
})
export class UserRepoModule {}
