import { DomainPersistenceMappers } from "@application/di-tokens/domain-persistence-mappers";
import { Repositories } from "@application/di-tokens/repositories";
import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { ChatInvitationMapper } from "./chat-invitation.mapper";
import { ChatInvitationRepository } from "./chat-invitation.repository";
import {
  DbChatInvitation,
  DbChatInvitationSchema,
} from "./chat-invitation.schema";

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: DbChatInvitation.name, schema: DbChatInvitationSchema },
    ]),
  ],
  providers: [
    {
      provide: Repositories.ChatInvitation,
      useClass: ChatInvitationRepository,
    },
    {
      provide: DomainPersistenceMappers.ChatInvitation,
      useClass: ChatInvitationMapper,
    },
  ],
  exports: [Repositories.ChatInvitation],
})
export class ChatInvitationRepoModule {}
