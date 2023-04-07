import {DomainPersistenceMappers} from "@application/di-tokens/domain-persistence-mappers";
import {Repositories} from "@application/di-tokens/repositories";
import {Module} from "@nestjs/common";
import {MongooseModule} from "@nestjs/mongoose";
import {ChatOwnerMapper} from "./chat-owner.mapper";
import {ChatOwnerRepository} from "./chat-owner.repository";
import {DbChatOwner, DbChatOwnerSchema} from "./chat-owner.schema";

@Module({
  imports: [
    MongooseModule.forFeature([
      {name: DbChatOwner.name, schema: DbChatOwnerSchema},
    ]),
  ],
  providers: [
    {provide: Repositories.ChatOwner, useClass: ChatOwnerRepository},
    {provide: DomainPersistenceMappers.ChatOwner, useClass: ChatOwnerMapper},
  ],
  exports: [Repositories.ChatOwner],
})
export class ChatOwnerRepoModule {}
