import {DomainPersistenceMappers} from "@application/di-tokens/domain-persistence-mappers";
import {Repositories} from "@application/di-tokens/repositories";
import {Module} from "@nestjs/common";
import {MongooseModule} from "@nestjs/mongoose";
import {ChatMapper} from "./chat.mapper";
import {ChatRepository} from "./chat.repository";
import {DbChat, DbChatSchema} from "./chat.schema";

@Module({
  imports: [
    MongooseModule.forFeature([{name: DbChat.name, schema: DbChatSchema}]),
  ],
  providers: [
    {provide: Repositories.Chat, useClass: ChatRepository},
    {provide: DomainPersistenceMappers.Chat, useClass: ChatMapper},
  ],
  exports: [Repositories.Chat],
})
export class ChatRepoModule {}
