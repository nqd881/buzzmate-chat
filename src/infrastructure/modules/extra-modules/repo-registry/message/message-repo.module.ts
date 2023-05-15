import { DomainPersistenceMappers } from "@application/di-tokens/domain-persistence-mappers";
import { Repositories } from "@application/di-tokens/repositories";
import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { MessageMapper } from "./message.mapper";
import { MessageRepository } from "./message.repository";
import { DbMessage, DbMessageSchema } from "./schemas/message.schema";

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: DbMessage.name, schema: DbMessageSchema },
    ]),
  ],
  providers: [
    { provide: Repositories.Message, useClass: MessageRepository },
    { provide: DomainPersistenceMappers.Message, useClass: MessageMapper },
  ],
  exports: [Repositories.Message],
})
export class MessageRepoModule {}
