import { DomainPersistenceMappers } from "@application/di-tokens/domain-persistence-mappers";
import { Repositories } from "@application/di-tokens/repositories";
import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { ChatAdminMapper } from "./chat-admin.mapper";
import { ChatAdminRepository } from "./chat-admin.repository";
import { DbChatAdmin, DbChatAdminSchema } from "./chat-admin.schema";

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: DbChatAdmin.name, schema: DbChatAdminSchema },
    ]),
  ],
  providers: [
    {
      provide: Repositories.ChatAdmin,
      useClass: ChatAdminRepository,
    },
    {
      provide: DomainPersistenceMappers.ChatAdmin,
      useClass: ChatAdminMapper,
    },
  ],
  exports: [Repositories.ChatAdmin],
})
export class ChatAdminRepoModule {}
