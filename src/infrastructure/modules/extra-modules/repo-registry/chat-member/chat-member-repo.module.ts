import {DomainPersistenceMappers} from "@application/di-tokens/domain-persistence-mappers";
import {Repositories} from "@application/di-tokens/repositories";
import {Module} from "@nestjs/common";
import {MongooseModule} from "@nestjs/mongoose";
import {ChatMemberMapper} from "./chat-member.mapper";
import {ChatMemberRepository} from "./chat-member.repository";
import {DbChatMember, DbChatMemberSchema} from "./chat-member.schema";

@Module({
  imports: [
    MongooseModule.forFeature([
      {name: DbChatMember.name, schema: DbChatMemberSchema},
    ]),
  ],
  providers: [
    {provide: Repositories.ChatMember, useClass: ChatMemberRepository},
    {provide: DomainPersistenceMappers.ChatMember, useClass: ChatMemberMapper},
  ],
  exports: [Repositories.ChatMember],
})
export class ChatMemberRepoModule {}
